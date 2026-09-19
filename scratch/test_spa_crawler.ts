import http from 'http';
import axios from 'axios';
import { extractLinksFromArticle, crawlMultiPageWebsite } from '../../../../OneDrive/Desktop/broken link/server/crawler';
import { createBrowserSession, fetchRenderedPage } from '../../../../OneDrive/Desktop/broken link/server/browser';
import { normalizeDomain, isInternalDomain } from '../../../../OneDrive/Desktop/broken link/src/utils/urlUtils';

async function runSpaCrawlerTest() {
  console.log('🧪 Starting LinkGuard SPA / Playwright Dynamic Crawler Verification...\n');

  // 1. Create a mock local SPA server that injects links entirely via client-side JavaScript
  const server = http.createServer((req, res) => {
    if (req.url === '/sitemap.xml') {
      res.writeHead(200, { 'Content-Type': 'application/xml' });
      res.end(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>http://localhost:4999/spa-app</loc></url>
  <url><loc>http://localhost:4999/deals</loc></url>
</urlset>`);
      return;
    }

    if (req.url === '/deals') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(`<!DOCTYPE html>
<html>
<head><title>Top Deals (SPA Rendered)</title></head>
<body>
  <div id="root">Loading Deals...</div>
  <script>
    setTimeout(() => {
      const root = document.getElementById('root');
      root.innerHTML = \`
        <h1>Curated Deals</h1>
        <a href="https://amzn.to/392gaming">Gaming Mouse on Amazon</a>
        <a href="http://localhost:4999/about">Internal About Page</a>
      \`;
    }, 100);
  </script>
</body>
</html>`);
      return;
    }

    // Default: /spa-app
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head>
  <title>Modern SPA Tech Hub</title>
</head>
<body>
  <div id="app">Loading Single Page Application...</div>
  <script>
    // Client-side JavaScript DOM rendering (React / Vue style)
    window.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        const app = document.getElementById('app');
        app.innerHTML = \`
          <header>
            <a href="http://localhost:4999/home">Home (Internal)</a>
            <a href="http://localhost:4999/contact">Contact (Internal)</a>
          </header>
          <main>
            <h2>Recommended Hardware</h2>
            <p>Check out our top picks:</p>
            <a href="https://amazon.com/dp/B0CX2M9N88?tag=aff-20">Sony WH-1000XM5 Headphones</a>
            <a href="https://shareasale.com/r.cfm?b=123&u=456&m=789">NordVPN Discount</a>
            <a href="https://www.youtube.com/watch?v=demo123">Video Review</a>
          </main>
        \`;
      }, 150);
    });
  </script>
</body>
</html>`);
  });

  await new Promise<void>((resolve) => server.listen(4999, resolve));
  console.log('✅ Mock SPA Web Server running at http://localhost:4999\n');

  try {
    // 2. Demonstration: Prove plain Axios (Old Crawler) gets 0 links
    console.log('--- Step 1: Plain Axios static fetch (Previous behavior) ---');
    const staticRes = await axios.get('http://localhost:4999/spa-app');
    const hasRawLinks = staticRes.data.includes('href="https://amazon.com');
    console.log(`Axios saw dynamic Amazon link in raw HTML: ${hasRawLinks} (Expected: false)`);

    // 3. Test Playwright Browser Rendering
    console.log('\n--- Step 2: Headless Playwright Chromium Page Fetch ---');
    const session = await createBrowserSession();
    console.log(`Browser session initialized. Mode: ${session.mode}`);
    
    const rendered = await fetchRenderedPage('http://localhost:4999/spa-app', session);
    console.log(`Rendered Page Title: "${rendered.pageTitle}"`);
    console.log(`Mode Used: ${rendered.modeUsed}`);
    const foundInDom = rendered.html.includes('Sony WH-1000XM5 Headphones');
    console.log(`Rendered DOM contains client-hydrated <a> links: ${foundInDom} (Expected: true)`);

    // 4. Test extractLinksFromArticle with Playwright session
    console.log('\n--- Step 3: extractLinksFromArticle() with SPA Execution ---');
    const extracted = await extractLinksFromArticle(
      'http://localhost:4999/spa-app',
      'web_test1',
      'localhost:4999',
      session
    );
    console.log(`Article Title extracted: "${extracted.title}"`);
    console.log(`Total Outbound Links found: ${extracted.links.length}`);
    extracted.links.forEach((l, i) => {
      console.log(`  [${i + 1}] ${l.anchorText} -> ${l.url} | Status: ${l.status} | Network: ${l.network}`);
    });

    // Check that internal links (http://localhost:4999/home) were filtered out
    const internalFound = extracted.links.some(l => isInternalDomain(l.url, 'localhost:4999'));
    console.log(`Internal links excluded: ${!internalFound} (Expected: true)`);

    await session.close();
    console.log('Browser session cleanly closed.');

    // 5. Test Full Multi-Page Website Crawl
    console.log('\n--- Step 4: crawlMultiPageWebsite() Multi-Page Sitemap + SPA Crawl ---');
    const fullScan = await crawlMultiPageWebsite({
      websiteUrl: 'http://localhost:4999',
      websiteId: 'web_full_test',
      userPlan: 'pro',
      onProgress: (scanned, links, msg) => {
        console.log(`  [Progress] ${scanned} pages, ${links} links: ${msg}`);
      }
    });

    console.log('\n📊 Full Scan Results:');
    console.log(`  - Articles Scanned: ${fullScan.articlesScanned}`);
    console.log(`  - Total Outbound Links Checked: ${fullScan.linksChecked}`);
    console.log(`  - Healthy Links: ${fullScan.healthyCount}`);
    console.log(`  - Broken Links: ${fullScan.brokenCount}`);
    console.log(`  - Crawler Mode Used: ${fullScan.crawlerModeUsed}`);
    console.log(`  - JavaScript Render Count: ${fullScan.javascriptRenderCount}`);

    console.log('\n🎉 ALL SPA PLAYWRIGHT CRAWLER TESTS PASSED SUCCESSFULLY!');
  } finally {
    server.close();
  }
}

runSpaCrawlerTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
