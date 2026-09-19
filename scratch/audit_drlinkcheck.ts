import { createBrowserSession, fetchRenderedPage } from '../../../../OneDrive/Desktop/broken link/server/browser';
import { extractLinksFromArticle, crawlMultiPageWebsite } from '../../../../OneDrive/Desktop/broken link/server/crawler';
import * as cheerio from 'cheerio';
import { isInternalDomain, normalizeDomain } from '../../../../OneDrive/Desktop/broken link/src/utils/urlUtils';

async function auditDrLinkCheck() {
  console.log('🔍 Auditing https://www.drlinkcheck.com ...\n');

  const targetUrl = 'https://www.drlinkcheck.com';
  const domain = normalizeDomain(targetUrl);

  const session = await createBrowserSession();
  const pageResult = await fetchRenderedPage(targetUrl, session, 15000);
  const $ = cheerio.load(pageResult.html);

  console.log(`[DOM Check] Total <a> tags in HTML: ${$('a').length}`);
  console.log(`[DOM Check] Total <a[href]> tags in HTML: ${$('a[href]').length}`);

  let internalCount = 0;
  let outboundCount = 0;
  const outboundLinks: { href: string; text: string; abs: string }[] = [];
  const internalLinks: { href: string; text: string; abs: string }[] = [];

  $('a[href]').each((i, el) => {
    const href = $(el).attr('href') || '';
    const text = $(el).text().trim() || 'No text';
    let abs = '';
    try {
      abs = new URL(href, targetUrl).href;
    } catch {
      abs = href;
    }

    if (isInternalDomain(abs, domain)) {
      internalCount++;
      internalLinks.push({ href, text, abs });
    } else if (abs.startsWith('http')) {
      outboundCount++;
      outboundLinks.push({ href, text, abs });
    }
  });

  console.log(`[Breakdown] Internal Links: ${internalCount}`);
  console.log(`[Breakdown] Outbound Links: ${outboundCount}`);
  console.log('\n--- Outbound Links List ---');
  outboundLinks.forEach((l, i) => {
    console.log(`  [${i+1}] "${l.text}" -> ${l.abs}`);
  });

  console.log('\n--- Internal Links List ---');
  internalLinks.forEach((l, i) => {
    console.log(`  [${i+1}] "${l.text}" -> ${l.abs}`);
  });

  console.log('\n--- Single Page extractLinksFromArticle() Test ---');
  const singlePageRes = await extractLinksFromArticle(targetUrl, 'test_dr', domain, session);
  console.log(`extractLinksFromArticle() returned: ${singlePageRes.links.length} links`);

  await session.close();
}

auditDrLinkCheck().catch(console.error);
