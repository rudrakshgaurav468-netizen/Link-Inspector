import dns from 'dns/promises';
import axios from 'axios';
import { createBrowserSession, fetchRenderedPage } from '../server/browser';
import { extractLinksFromArticle, crawlMultiPageWebsite } from '../server/crawler';

async function diagnose() {
  console.log('====================================================');
  console.log('🔍 LINKGUARD LIVE CRAWLER DIAGNOSTIC TOOL');
  console.log('====================================================\n');

  // Test Targets
  const targets = [
    { name: 'Target A (bet1x.biz)', url: 'https://bet1x.biz' },
    { name: 'Target B (example.com)', url: 'https://example.com' },
    { name: 'Target C (techblog demo - quotes.toscrape.com/js)', url: 'https://quotes.toscrape.com/js/' },
  ];

  for (const target of targets) {
    console.log(`\n----------------------------------------------------`);
    console.log(`🌐 Testing: ${target.name} (${target.url})`);
    console.log(`----------------------------------------------------`);

    // 1. DNS Resolution Check
    const hostname = new URL(target.url).hostname;
    try {
      const addresses = await dns.lookup(hostname);
      console.log(`[DNS] Resolved ${hostname} -> IP: ${addresses.address} (family: IPv${addresses.family})`);
    } catch (dnsErr: any) {
      console.error(`[DNS FAIL] Cannot resolve host ${hostname}: ${dnsErr.message}`);
    }

    // 2. Direct Axios HTTP Probe
    try {
      const axiosRes = await axios.get(target.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        },
        timeout: 10000,
        validateStatus: () => true,
      });
      console.log(`[Axios HTTP] Status: ${axiosRes.status} ${axiosRes.statusText}`);
      console.log(`[Axios HTTP] Content-Type: ${axiosRes.headers['content-type']}`);
      console.log(`[Axios HTTP] Server Header: ${axiosRes.headers['server'] || 'N/A'}`);
      const rawHtml = typeof axiosRes.data === 'string' ? axiosRes.data : '';
      if (rawHtml.includes('cloudflare') || rawHtml.includes('cf-browser-verification') || rawHtml.includes('Just a moment...')) {
        console.log(`[Axios Anti-Bot] ⚠️ Cloudflare Challenge / Turnstile detected in raw HTML!`);
      }
    } catch (axiosErr: any) {
      console.error(`[Axios HTTP Error] ${axiosErr.message}`);
    }

    // 3. Playwright Headless Chromium Rendering Probe
    console.log(`\n[Playwright] Launching browser session...`);
    const session = await createBrowserSession();
    console.log(`[Playwright] Browser mode: ${session.mode}`);

    try {
      const pageResult = await fetchRenderedPage(target.url, session, 15000);
      console.log(`[Playwright Result] Final URL: ${pageResult.finalUrl}`);
      console.log(`[Playwright Result] Page Title: "${pageResult.pageTitle || 'N/A'}"`);
      console.log(`[Playwright Result] Mode Used: ${pageResult.modeUsed}`);
      console.log(`[Playwright Result] HTML Length: ${pageResult.html.length} chars`);
      if (pageResult.error) {
        console.error(`[Playwright Error Log]: ${pageResult.error}`);
      }

      // Check for Anti-Bot signatures in rendered DOM
      const htmlLower = pageResult.html.toLowerCase();
      if (
        htmlLower.includes('just a moment...') ||
        htmlLower.includes('cf-browser-verification') ||
        htmlLower.includes('cloudflare') ||
        htmlLower.includes('attention required! | cloudflare') ||
        htmlLower.includes('enable javascript and cookies to continue') ||
        htmlLower.includes('turnstile')
      ) {
        console.log(`[Playwright Anti-Bot Detection] 🛑 Site is behind Cloudflare Bot Protection / Turnstile challenge.`);
      }

      // 4. Run Full Crawler Extraction
      const extracted = await extractLinksFromArticle(target.url, 'web_diag', hostname, session);
      console.log(`[Crawler Extraction] Found ${extracted.links.length} total outbound links`);
      extracted.links.slice(0, 5).forEach((l, idx) => {
        console.log(`   - Link #${idx + 1}: ${l.anchorText} -> ${l.url} (${l.status})`);
      });
    } catch (renderErr: any) {
      console.error(`[Playwright Diagnostic Exception]:`, renderErr);
    } finally {
      await session.close();
      console.log(`[Playwright] Browser closed.`);
    }
  }

  console.log('\n====================================================');
  console.log('✅ Diagnostic complete.');
  console.log('====================================================');
}

diagnose().catch(err => {
  console.error('Fatal diagnosis error:', err);
  process.exit(1);
});
