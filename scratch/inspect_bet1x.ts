import { createBrowserSession, fetchRenderedPage } from '../../../../OneDrive/Desktop/broken link/server/browser';
import * as cheerio from 'cheerio';
import { normalizeDomain, isInternalDomain } from '../../../../OneDrive/Desktop/broken link/src/utils/urlUtils';

async function inspectBet1x() {
  console.log('Inspecting DOM of https://bet1x.biz ...');
  const session = await createBrowserSession();
  const pageRes = await fetchRenderedPage('https://bet1x.biz', session, 15000);
  const $ = cheerio.load(pageRes.html);

  console.log(`Page Title: ${pageRes.pageTitle}`);
  console.log(`Total <a> tags found in DOM: ${$('a').length}`);
  console.log(`Total <button> tags found in DOM: ${$('button').length}`);
  console.log(`Total <script> tags found in DOM: ${$('script').length}`);

  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim() || $(el).attr('title') || 'No text';
    console.log(`[Link ${i + 1}] text: "${text}", href: "${href}", isInternal: ${href ? isInternalDomain(href, 'bet1x.biz') : 'N/A'}`);
  });

  await session.close();
}

inspectBet1x().catch(console.error);
