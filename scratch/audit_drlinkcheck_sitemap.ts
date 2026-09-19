import { discoverSitemapUrls } from '../lib/crawler/scanWebsite';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { normalizeDomain, isInternalDomain } from '../src/utils/urlUtils';

async function test() {
  const baseUrl = 'https://www.drlinkcheck.com';
  const urls = await discoverSitemapUrls(baseUrl);
  console.log(`Discovered ${urls.length} sitemap URLs:`);
  
  const allOutbound = new Map<string, string[]>();
  const domain = normalizeDomain(baseUrl);

  for (let i = 0; i < urls.length; i++) {
    const pageUrl = urls[i];
    try {
      const res = await axios.get(pageUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
        timeout: 10000,
      });
      const $ = cheerio.load(res.data);
      let pageLinks = 0;
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        const trimmed = href.trim();
        if (trimmed.startsWith('#') || trimmed.startsWith('mailto:') || trimmed.startsWith('tel:') || trimmed.startsWith('javascript:')) return;
        try {
          const abs = new URL(trimmed, pageUrl).href;
          if (!isInternalDomain(abs, domain)) {
            pageLinks++;
            if (!allOutbound.has(abs)) {
              allOutbound.set(abs, []);
            }
            allOutbound.get(abs)!.push(pageUrl);
          }
        } catch {}
      });
      if (pageLinks > 0) {
        console.log(`Page ${i + 1}/${urls.length}: ${pageUrl} -> ${pageLinks} outbound links`);
      }
    } catch (e: any) {
      console.log(`Error on page ${pageUrl}: ${e.message}`);
    }
  }

  console.log(`\n==================================================`);
  console.log(`TOTAL UNIQUE OUTBOUND LINKS DISCOVERED: ${allOutbound.size}`);
  console.log(`==================================================`);
  for (const [link, pages] of allOutbound.entries()) {
    console.log(`- ${link} (found on ${pages.length} pages: ${pages[0]})`);
  }
}

test();
