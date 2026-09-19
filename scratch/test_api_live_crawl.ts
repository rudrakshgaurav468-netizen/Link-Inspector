import axios from 'axios';

async function testApiLiveCrawl() {
  const targets = [
    'https://bet1x.biz',
    'https://quotes.toscrape.com/js/'
  ];

  for (const t of targets) {
    console.log(`\n=================================================`);
    console.log(`Testing Express Server POST /api/crawler/live-crawl with: ${t}`);
    console.log(`=================================================`);
    try {
      const res = await axios.post('http://localhost:3001/api/crawler/live-crawl', {
        url: t,
        frequency: 'daily'
      }, { timeout: 30000 });

      console.log('Response Success:', res.data.success);
      console.log('Website Record:', {
        name: res.data.result.website.name,
        domain: res.data.result.website.domain,
        articlesCount: res.data.result.website.articlesCount,
        linksCount: res.data.result.website.linksCount,
        crawlerEngineMode: res.data.result.website.crawlerEngineMode,
      });
      console.log('Links Extracted:', res.data.result.links.length);
      res.data.result.links.forEach((l: any, i: number) => {
        console.log(`  [${i+1}] ${l.anchorText} -> ${l.url} (${l.status})`);
      });
    } catch (err: any) {
      console.error('API Call Failed:', err.message, err.response?.data || '');
    }
  }
}

testApiLiveCrawl();
