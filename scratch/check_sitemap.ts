import axios from 'axios';

async function checkSitemap() {
  const urls = [
    'https://bet1x.biz/sitemap.xml',
    'https://bet1x.biz/robots.txt',
    'https://bet1x.biz/aviator.html',
    'https://bet1x.biz/cashier.html'
  ];

  for (const u of urls) {
    try {
      const res = await axios.get(u, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
        },
        timeout: 5000,
        validateStatus: () => true,
      });
      console.log(`[${u}] -> HTTP ${res.status}`);
    } catch (e: any) {
      console.log(`[${u}] -> Error: ${e.message}`);
    }
  }
}

checkSitemap();
