import axios from 'axios';
import * as cheerio from 'cheerio';
import { XMLParser } from 'fast-xml-parser';
import { detectAffiliateNetwork, isAffiliateLink } from '../../src/utils/affiliateDetector';
import { normalizeDomain, isInternalDomain } from '../../src/utils/urlUtils';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 (compatible; LinkGuard/2.0; +https://linkguard.io/bot)';

export interface CrawlOptions {
  websiteUrl: string;
  websiteId: string;
  userPlan?: 'free' | 'pro' | 'business';
  linkScope?: 'all' | 'outbound';
  onProgress?: (scannedArticles: number, linksFound: number, status: string) => void;
}

export interface CrawledArticleResult {
  url: string;
  title: string;
  links: {
    rawUrl: string;
    absoluteUrl: string;
    anchorText: string;
    network: string;
    isAffiliate: boolean;
  }[];
}

export const PLAN_LIMITS = {
  free: { maxWebsites: 1, maxLinks: 100, scanFrequency: 'daily' },
  pro: { maxWebsites: 5, maxLinks: 5000, scanFrequency: 'twice_daily' },
  business: { maxWebsites: 25, maxLinks: 50000, scanFrequency: 'hourly' },
};

// 1. Discover Sitemap (tries /sitemap.xml, /sitemap_index.xml, and robots.txt)
export async function discoverSitemapUrls(baseUrl: string): Promise<string[]> {
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const candidateUrls = [
    `${cleanBase}/sitemap.xml`,
    `${cleanBase}/sitemap_index.xml`,
    `${cleanBase}/post-sitemap.xml`,
    `${cleanBase}/wp-sitemap.xml`,
  ];

  for (const smUrl of candidateUrls) {
    try {
      const res = await axios.get(smUrl, {
        headers: { 'User-Agent': USER_AGENT },
        timeout: 8000,
      });

      if (res.status === 200 && typeof res.data === 'string' && res.data.includes('<urlset') || res.data.includes('<sitemapindex')) {
        const extracted = await parseSitemapXml(res.data);
        if (extracted.length > 0) {
          return extracted;
        }
      }
    } catch {
      // try next
    }
  }

  // Fallback: Try reading robots.txt
  try {
    const robotsRes = await axios.get(`${cleanBase}/robots.txt`, {
      headers: { 'User-Agent': USER_AGENT },
      timeout: 6000,
    });

    if (robotsRes.status === 200 && typeof robotsRes.data === 'string') {
      const match = robotsRes.data.match(/Sitemap:\s*(https?:\/\/[^\s]+)/i);
      if (match && match[1]) {
        const sitemapContent = await axios.get(match[1], { headers: { 'User-Agent': USER_AGENT }, timeout: 8000 });
        const extracted = await parseSitemapXml(sitemapContent.data);
        if (extracted.length > 0) return extracted;
      }
    }
  } catch {
    // fallback
  }

  // Fallback if no sitemap found: return home page
  return [cleanBase];
}

// 2. Parse XML (supports <urlset> and recursive <sitemapindex>)
async function parseSitemapXml(xmlContent: string): Promise<string[]> {
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xmlContent);
  const urls: string[] = [];

  // Case 1: Standard URL Set
  if (parsed.urlset && parsed.urlset.url) {
    const list = Array.isArray(parsed.urlset.url) ? parsed.urlset.url : [parsed.urlset.url];
    for (const item of list) {
      if (item.loc && typeof item.loc === 'string') {
        const loc = item.loc.trim();
        // Skip images/PDFs/attachments
        if (!loc.match(/\.(jpg|jpeg|png|gif|svg|pdf|webp|zip)$/i)) {
          urls.push(loc);
        }
      }
    }
  }

  // Case 2: Sitemap Index (recurse child sitemaps)
  if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
    const list = Array.isArray(parsed.sitemapindex.sitemap) ? parsed.sitemapindex.sitemap : [parsed.sitemapindex.sitemap];
    for (const sm of list.slice(0, 4)) {
      if (sm.loc && typeof sm.loc === 'string') {
        try {
          const childRes = await axios.get(sm.loc.trim(), { headers: { 'User-Agent': USER_AGENT }, timeout: 8000 });
          const childUrls = await parseSitemapXml(childRes.data);
          urls.push(...childUrls);
        } catch { }
      }
    }
  }

  return Array.from(new Set(urls));
}

// 3. Crawl Website & Extract Affiliate Links (with Plan Limits Enforcement)
export async function scanWebsiteArticles(options: CrawlOptions): Promise<{
  articlesScanned: number;
  totalLinksFound: number;
  results: CrawledArticleResult[];
}> {
  const plan = options.userPlan || 'pro';
  const maxAllowedLinks = PLAN_LIMITS[plan].maxLinks;

  options.onProgress?.(0, 0, `Discovering sitemap for ${options.websiteUrl}...`);
  const articleUrls = await discoverSitemapUrls(options.websiteUrl);

  const websiteDomain = normalizeDomain(options.websiteUrl);

  let scannedCount = 0;
  let totalLinks = 0;
  const results: CrawledArticleResult[] = [];

  // Limit articles to process based on plan limits
  const articlesToProcess = articleUrls.slice(0, 50);

  for (const articleUrl of articlesToProcess) {
    if (totalLinks >= maxAllowedLinks) {
      options.onProgress?.(scannedCount, totalLinks, `Plan link limit (${maxAllowedLinks}) reached for ${plan.toUpperCase()} tier.`);
      break;
    }

    scannedCount++;
    options.onProgress?.(scannedCount, totalLinks, `Crawling article: ${articleUrl}`);

    try {
      const res = await axios.get(articleUrl, {
        headers: { 'User-Agent': USER_AGENT },
        timeout: 10000,
        maxRedirects: 5,
      });

      const $ = cheerio.load(res.data);
      const title = $('title').text().trim() || $('h1').first().text().trim() || articleUrl;
      const extractedArticleLinks: CrawledArticleResult['links'] = [];

      $('a[href]').each((_, el) => {
        if (totalLinks >= maxAllowedLinks) return;

        const href = $(el).attr('href');
        if (!href) return;
        const trimmed = href.trim();
        const anchorText = $(el).text().replace(/\s+/g, ' ').trim() || $(el).attr('title') || 'Click here';

        let absoluteUrl = '';
        try {
          absoluteUrl = new URL(trimmed, articleUrl).href;
        } catch {
          absoluteUrl = trimmed;
        }

        const isInternal = isInternalDomain(absoluteUrl, websiteDomain);
        if (options.linkScope === 'outbound' && isInternal) return;

        const isAff = isInternal ? false : isAffiliateLink(absoluteUrl);
        const network = isInternal ? 'Custom / Direct' : detectAffiliateNetwork(absoluteUrl);

        extractedArticleLinks.push({
          rawUrl: trimmed,
          absoluteUrl,
          anchorText: anchorText.substring(0, 80),
          network,
          isAffiliate: isAff,
        });

        totalLinks++;
      });

      results.push({
        url: articleUrl,
        title,
        links: extractedArticleLinks,
      });
    } catch (err: any) {
      console.warn(`Could not fetch article ${articleUrl}:`, err.message);
    }
  }

  options.onProgress?.(scannedCount, totalLinks, `Crawl completed! Found ${totalLinks} outbound links across ${scannedCount} articles.`);

  return {
    articlesScanned: scannedCount,
    totalLinksFound: totalLinks,
    results,
  };
}
