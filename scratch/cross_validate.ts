import { extractLinksFromArticle } from '../server/crawler';

interface TestTarget {
  name: string;
  type: string;
  url: string;
}

const testTargets: TestTarget[] = [
  {
    name: 'DrLinkCheck Pricing',
    type: 'Static Page with Outbound Partner Links',
    url: 'https://www.drlinkcheck.com/pricing',
  },
  {
    name: 'bet1x.biz',
    type: 'JS-heavy SPA with Internal Navigation Only',
    url: 'https://bet1x.biz',
  },
  {
    name: 'GitHub (HTTP to HTTPS Redirect)',
    type: 'Page with Redirect Resolution',
    url: 'http://github.com',
  },
  {
    name: 'DrLinkCheck Check Results Reference',
    type: 'Page with Mixed Outbound Specs & External Links',
    url: 'https://www.drlinkcheck.com/support/check-results',
  }
];

async function runCrossValidation() {
  console.log('========================================================================');
  console.log('🧪 RUNNING CROSS-VALIDATION TEST SUITE (LIVE PLAYWRIGHT + HTTP PROBING)');
  console.log('========================================================================\n');

  for (let i = 0; i < testTargets.length; i++) {
    const target = testTargets[i];
    console.log(`------------------------------------------------------------------------`);
    console.log(`[TEST #${i + 1}] ${target.name} (${target.type})`);
    console.log(`Target URL: ${target.url}`);
    console.log(`------------------------------------------------------------------------`);

    const start = Date.now();
    const result = await extractLinksFromArticle(target.url, `test_${i + 1}`, '');
    const duration = ((Date.now() - start) / 1000).toFixed(2);

    console.log(`\n📊 DIAGNOSTIC SUMMARY:`);
    console.log(`  - Rendered Page Title: "${result.title}"`);
    console.log(`  - Target URL: ${result.diagnostics.targetUrl}`);
    console.log(`  - Final Resolved URL: ${result.diagnostics.finalUrl}`);
    console.log(`  - Is Redirected: ${result.diagnostics.isRedirected ? 'YES ↪️' : 'NO'}`);
    console.log(`  - Crawler Mode Used: ${result.diagnostics.modeUsed}`);
    console.log(`  - Total <a> Tags in DOM: ${result.diagnostics.totalAnchorsInDom}`);
    console.log(`  - Internal Domain Links Filtered: ${result.diagnostics.internalAnchorsCount}`);
    console.log(`  - Outbound Links Extracted: ${result.links.length}`);
    console.log(`  - Cloudflare Bot Challenge Detected: ${result.diagnostics.isCloudflareBlocked}`);
    console.log(`  - Login Wall Detected: ${result.diagnostics.isLoginWall}`);
    console.log(`  - HTTP Status of Base Page: ${result.diagnostics.httpStatus}`);
    console.log(`  - Total Audit Latency: ${duration}s`);

    console.log(`\n🔗 VERIFIED OUTBOUND LINKS (${result.links.length} total):`);
    if (result.links.length === 0) {
      console.log(`  (0 outbound links found — all links internal or non-HTTP)`);
    } else {
      result.links.slice(0, 10).forEach((l, idx) => {
        console.log(`  [${idx + 1}] ${l.url}`);
        console.log(`      -> Status: HTTP ${l.httpStatus} (${l.status.toUpperCase()})`);
        console.log(`      -> Destination: ${l.finalUrl}`);
        console.log(`      -> Latency: ${l.responseTimeMs}ms | Network: ${l.network || 'Direct'}`);
      });
      if (result.links.length > 10) {
        console.log(`      ... and ${result.links.length - 10} more verified outbound links.`);
      }
    }
    console.log('\n');
  }
}

runCrossValidation().catch(console.error);
