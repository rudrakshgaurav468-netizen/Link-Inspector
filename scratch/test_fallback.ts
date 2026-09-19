import http from 'http';
import { extractLinksFromArticle } from '../../../../OneDrive/Desktop/broken link/server/crawler';
import { BrowserSession } from '../../../../OneDrive/Desktop/broken link/server/browser';

async function runFallbackTest() {
  console.log('🧪 Testing Static HTML Fallback...\n');

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`<!DOCTYPE html>
<html>
<head><title>Static Page Test</title></head>
<body>
  <h1>Static Article</h1>
  <a href="https://example.com/outbound">Outbound Static Link</a>
</body>
</html>`);
  });

  await new Promise<void>((resolve) => server.listen(4998, resolve));

  try {
    // Pass a fallback session (simulating browser launch failure or serverless env without chromium)
    const fallbackSession: BrowserSession = {
      browser: null,
      mode: 'static_html_fallback',
      isClosed: true,
      close: async () => {}
    };

    const res = await extractLinksFromArticle(
      'http://localhost:4998',
      'web_fallback',
      'localhost:4998',
      fallbackSession
    );

    console.log(`Extracted title: "${res.title}"`);
    console.log(`Extracted mode: ${res.modeUsed} (Expected: static_html_fallback)`);
    console.log(`Links found: ${res.links.length} (Expected: 1)`);
    console.log(`Link URL: ${res.links[0]?.url}`);

    if (res.modeUsed === 'static_html_fallback' && res.links.length === 1) {
      console.log('\n✅ Static HTML Fallback works perfectly!');
    } else {
      throw new Error('Fallback did not match expectations');
    }
  } finally {
    server.close();
  }
}

runFallbackTest().catch(err => {
  console.error('❌ Fallback test failed:', err);
  process.exit(1);
});
