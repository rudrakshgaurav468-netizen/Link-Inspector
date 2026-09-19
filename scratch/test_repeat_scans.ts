import { crawlMultiPageWebsite } from '../server/crawler';

async function testRepeat() {
  console.log('Running 3 consecutive full crawls on drlinkcheck.com to compare link lists...\n');

  const results = [];
  for (let i = 1; i <= 3; i++) {
    console.log(`--- Crawl #${i} Starting ---`);
    const res = await crawlMultiPageWebsite({
      websiteUrl: 'https://www.drlinkcheck.com',
      websiteId: 'test_' + i,
      websiteDomain: 'drlinkcheck.com',
      userPlan: 'pro',
    });
    console.log(`Crawl #${i} finished: ${res.links.length} links checked, ${res.articlesScanned} articles scanned.`);
    results.push(res);
  }

  const set1 = new Set(results[0].links.map(l => l.url));
  const set2 = new Set(results[1].links.map(l => l.url));
  const set3 = new Set(results[2].links.map(l => l.url));

  console.log(`\nLink count summary: #${1}=${set1.size}, #${2}=${set2.size}, #${3}=${set3.size}`);

  // Check differences
  for (const url of set1) {
    if (!set2.has(url)) console.log(`Present in #1 but MISSING in #2: ${url}`);
  }
  for (const url of set2) {
    if (!set1.has(url)) console.log(`Present in #2 but MISSING in #1: ${url}`);
  }
}

testRepeat().catch(console.error);
