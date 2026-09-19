import axios from 'axios';

async function testSinglePageAudit() {
  console.log('🧪 Testing POST /api/crawler/live-crawl with singlePageOnly: true for https://www.drlinkcheck.com ...\n');

  const res = await axios.post('http://localhost:3001/api/crawler/live-crawl', {
    url: 'https://www.drlinkcheck.com',
    singlePageOnly: true
  });

  console.log('API Response:');
  console.log(`  - Success: ${res.data.success}`);
  console.log(`  - Articles Scanned: ${res.data.result.website.articlesCount}`);
  console.log(`  - Outbound Links Count: ${res.data.result.website.linksCount}`);
  console.log(`  - Total Extracted Links in payload: ${res.data.result.links.length}`);
}

testSinglePageAudit().catch(err => {
  console.error('Error:', err.message, err.response?.data);
});
