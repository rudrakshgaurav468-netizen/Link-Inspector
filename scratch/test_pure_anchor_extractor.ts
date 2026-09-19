import http from 'http';
import { extractLinksFromArticle } from '../../../../OneDrive/Desktop/broken link/server/crawler';
import { createBrowserSession } from '../../../../OneDrive/Desktop/broken link/server/browser';

async function testPureAnchorExtractor() {
  console.log('🧪 Testing Pure <a href> Anchor Extraction (No Resource Inflation)...\n');

  // Create a test page with:
  // - 2 external stylesheets (<link rel="stylesheet">)
  // - 3 external scripts (<script src="...">)
  // - 4 external images (<img src="...">)
  // - 2 social meta tags (<meta property="og:image">)
  // - 3 internal navigation links (<a href="/home">, <a href="/about">, <a href="contact.html">)
  // - EXACTLY 3 outbound clickable affiliate/partner links:
  //     1. <a href="https://amazon.com/dp/B0CX2M9N88?tag=aff-20">Prime Headphones</a>
  //     2. <a href="https://shareasale.com/r.cfm?b=1&u=2">NordVPN Deal</a>
  //     3. <a href="https://partner.com/deal">Custom Merchant</a>

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>Resource Heavy Tech Blog</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.2.0/axios.min.js"></script>
  <meta property="og:image" content="https://images.unsplash.com/photo-123456.jpg">
  <meta property="og:url" content="https://techblog.com/post-1">
</head>
<body>
  <header>
    <img src="https://assets.cdn.com/logo.png" alt="Logo">
    <img src="https://assets.cdn.com/banner.jpg" alt="Banner">
    <img src="https://assets.cdn.com/ad-1.png" alt="Ad">
    <img src="https://assets.cdn.com/ad-2.png" alt="Ad">
    <nav>
      <a href="http://localhost:4997/home">Home</a>
      <a href="http://localhost:4997/about">About</a>
      <a href="contact.html">Contact</a>
    </nav>
  </header>
  <main>
    <h1>Top Picks for 2026</h1>
    <p>Check out our favorite gear:</p>
    <a href="https://amazon.com/dp/B0CX2M9N88?tag=aff-20">Prime Headphones</a>
    <a href="https://shareasale.com/r.cfm?b=1&u=2">NordVPN Deal</a>
    <a href="https://partner.com/deal">Custom Merchant</a>
  </main>
</body>
</html>`;

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });

  await new Promise<void>((resolve) => server.listen(4997, resolve));

  try {
    const session = await createBrowserSession();
    const result = await extractLinksFromArticle(
      'http://localhost:4997',
      'web_anchor_test',
      'localhost:4997',
      session
    );

    console.log(`Total Extracted Links: ${result.links.length} (Expected: EXACTLY 3)`);
    result.links.forEach((l, i) => {
      console.log(`  [${i + 1}] Network: [${l.network}] -> Anchor: "${l.anchorText}" -> URL: ${l.url}`);
    });

    await session.close();

    const nonAnchorDetected = result.links.some(l =>
      l.url.includes('bootstrap') ||
      l.url.includes('jquery') ||
      l.url.includes('unsplash') ||
      l.url.includes('assets.cdn.com') ||
      l.url.includes('logo.png')
    );

    const internalDetected = result.links.some(l =>
      l.url.includes('localhost:4997/home') ||
      l.url.includes('localhost:4997/about') ||
      l.url.includes('localhost:4997/contact.html')
    );

    console.log(`\nNon-anchor resources excluded: ${!nonAnchorDetected} (Expected: true)`);
    console.log(`Internal navigation links excluded: ${!internalDetected} (Expected: true)`);

    if (result.links.length === 3 && !nonAnchorDetected && !internalDetected) {
      console.log('\n🎉 TEST PASSED! Only genuine outbound <a href> anchor links are extracted and counted.');
    } else {
      throw new Error(`Test failed: count=${result.links.length}`);
    }
  } finally {
    server.close();
  }
}

testPureAnchorExtractor().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
