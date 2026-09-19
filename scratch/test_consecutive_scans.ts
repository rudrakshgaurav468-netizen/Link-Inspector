import { crawlMultiPageWebsite } from '../server/crawler';

async function runConsecutiveScans() {
  const targetUrl = 'https://www.drlinkcheck.com';
  console.log(`Starting 3 consecutive scans for: ${targetUrl}`);

  const results = [];

  for (let run = 1; run <= 3; run++) {
    console.log(`\n========================================`);
    console.log(`🚀 RUN #${run} STARTING...`);
    console.log(`========================================`);
    
    const startTime = Date.now();
    const res = await crawlMultiPageWebsite({
      websiteUrl: targetUrl,
      websiteId: `test_run_${run}`,
      userPlan: 'pro',
      maxArticles: 50,
      onProgress: (scanned, links, msg) => {
        // quiet progress logging
      }
    });
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`✅ RUN #${run} FINISHED in ${elapsedSec}s:`);
    console.log(`  - Articles Scanned: ${res.articlesScanned}`);
    console.log(`  - Total Discovered Links: ${res.linksChecked}`);
    console.log(`  - Healthy Links: ${res.healthyCount}`);
    console.log(`  - Broken Links: ${res.brokenCount}`);
    console.log(`  - Warning / Timeout Links: ${res.warningCount}`);
    
    results.push({
      run,
      articlesScanned: res.articlesScanned,
      linksChecked: res.linksChecked,
      healthyCount: res.healthyCount,
      brokenCount: res.brokenCount,
      warningCount: res.warningCount,
      links: res.links.map(l => l.url)
    });
  }

  console.log(`\n========================================`);
  console.log(`📊 FINAL SUMMARY ACROSS 3 RUNS:`);
  console.log(`========================================`);
  for (const r of results) {
    console.log(`Run #${r.run}: ${r.linksChecked} Total Links (${r.healthyCount} healthy, ${r.brokenCount} broken, ${r.warningCount} warning) across ${r.articlesScanned} articles`);
  }

  const allIdentical = results.every(r => r.linksChecked === results[0].linksChecked);
  console.log(`\nAre all 3 scan counts identical? ${allIdentical ? '✅ YES (' + results[0].linksChecked + ' links)' : '❌ NO'}`);
}

runConsecutiveScans().catch(console.error);
