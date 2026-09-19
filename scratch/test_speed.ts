import { extractLinksFromArticle } from '../server/crawler';

async function test() {
  console.log('Testing single-page audit speed for bet1x.biz...');
  let start = Date.now();
  let res = await extractLinksFromArticle('https://bet1x.biz', 'test1', 'bet1x.biz');
  console.log('bet1x.biz finished in:', ((Date.now() - start)/1000).toFixed(2), 'seconds. Links found:', res.links.length);

  console.log('\nTesting single-page audit speed for drlinkcheck.com/pricing...');
  start = Date.now();
  res = await extractLinksFromArticle('https://www.drlinkcheck.com/pricing', 'test2', 'drlinkcheck.com');
  console.log('drlinkcheck.com/pricing finished in:', ((Date.now() - start)/1000).toFixed(2), 'seconds. Links found:', res.links.length);
}

test().catch(console.error);
