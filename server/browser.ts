import { chromium, Browser, BrowserContext, Page } from 'playwright';
import axios from 'axios';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 (compatible; LinkGuard/2.0; +https://linkguard.io/bot)';

const BROWSER_HEADERS = {
  'User-Agent': USER_AGENT,
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Upgrade-Insecure-Requests': '1',
};

export type CrawlerMode = 'headless_spa_playwright' | 'remote_browserless' | 'static_html_fallback';

export interface BrowserSession {
  browser: Browser | null;
  mode: CrawlerMode;
  isClosed: boolean;
  close: () => Promise<void>;
}

export interface RenderedPageResult {
  html: string;
  finalUrl: string;
  pageTitle?: string;
  modeUsed: CrawlerMode;
  httpStatus?: number;
  isCloudflareChallenge?: boolean;
  error?: string;
}

/**
 * Initializes a headless browser session.
 * Connects to remote browserless/playwright endpoint if configured,
 * or launches local headless Chromium.
 * Falls back to static HTML mode if browser launch fails.
 */
export async function createBrowserSession(): Promise<BrowserSession> {
  const wsEndpoint = process.env.PLAYWRIGHT_WS_ENDPOINT || process.env.BROWSERLESS_URL;

  // 1. Try Remote Browserless / Playwright WS Endpoint if configured (Vercel / Cloud ready)
  if (wsEndpoint) {
    try {
      console.log(`🌐 [Playwright] Connecting to remote browser endpoint: ${wsEndpoint.substring(0, 30)}...`);
      const browser = await chromium.connect(wsEndpoint, { timeout: 15000 });
      let isClosed = false;
      console.log(`✅ [Playwright] Remote browser session connected successfully.`);
      return {
        browser,
        mode: 'remote_browserless',
        isClosed: false,
        close: async () => {
          if (!isClosed) {
            isClosed = true;
            await browser.close().catch(() => {});
            console.log(`🔒 [Playwright] Remote browser session closed.`);
          }
        }
      };
    } catch (err: any) {
      console.warn(`⚠️ [Playwright WS Error] Remote connection failed (${err.message}). Falling back to local Chromium.`);
    }
  }

  // 2. Try Local Headless Chromium
  try {
    console.log(`🚀 [Playwright] Launching local Headless Chromium...`);
    const browser = await chromium.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--disable-extensions',
        '--disable-background-networking',
      ],
      timeout: 15000,
    });

    let isClosed = false;
    console.log(`✅ [Playwright] Headless Chromium launched successfully.`);
    return {
      browser,
      mode: 'headless_spa_playwright',
      isClosed: false,
      close: async () => {
        if (!isClosed) {
          isClosed = true;
          await browser.close().catch(() => {});
          console.log(`🔒 [Playwright] Headless Chromium browser cleanly closed.`);
        }
      }
    };
  } catch (launchErr: any) {
    console.warn(`❌ [Playwright Launch Error] Local Chromium launch failed: ${launchErr.message}`);
    console.warn(`⚠️ [Crawler Mode] Falling back to static HTML (Axios + Cheerio).`);
    return {
      browser: null,
      mode: 'static_html_fallback',
      isClosed: true,
      close: async () => {}
    };
  }
}

/**
 * Fetches and fully renders webpage HTML using Playwright Chromium (executing client-side JS/React/Vue SPAs).
 * If browser session is in fallback mode or throws an unrecoverable error, gracefully falls back to axios.
 */
export async function fetchRenderedPage(
  targetUrl: string,
  session?: BrowserSession,
  timeoutMs = 15000
): Promise<RenderedPageResult> {
  // If no browser available, use static axios fallback
  if (!session || !session.browser || session.isClosed || session.mode === 'static_html_fallback') {
    console.log(`📄 [Static Crawler] Fetching ${targetUrl} via static HTTP fallback...`);
    return fetchStaticFallback(targetUrl, timeoutMs);
  }

  let context: BrowserContext | null = null;
  let page: Page | null = null;

  try {
    console.log(`🌐 [Playwright] Opening page context for ${targetUrl}...`);
    context = await session.browser.newContext({
      userAgent: USER_AGENT,
      viewport: { width: 1280, height: 800 },
      javaScriptEnabled: true,
      ignoreHTTPSErrors: true,
      bypassCSP: true,
    });

    page = await context.newPage();

    // Block non-essential media assets to maximize crawling speed while executing JS
    await page.route('**/*.{png,jpg,jpeg,gif,webp,svg,ico,mp4,mp3,woff,woff2,ttf,otf}', route => {
      route.abort();
    });

    // Navigate to page
    console.log(`⏳ [Playwright] Navigating to ${targetUrl} (timeout: ${timeoutMs}ms)...`);
    const response = await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: timeoutMs,
    });

    const statusCode = response?.status() || 200;
    console.log(`📥 [Playwright] Response received: HTTP ${statusCode} for ${targetUrl}`);

    // Fast client-side JS / React / Next.js SPA hydration wait (non-blocking)
    await page.waitForLoadState('load', { timeout: 1500 }).catch(() => {});
    await page.waitForTimeout(200);

    const html = await page.content();
    const finalUrl = page.url() || targetUrl;
    const pageTitle = (await page.title()).trim();
    const htmlLower = html.toLowerCase();

    const isCloudflareChallenge =
      htmlLower.includes('just a moment...') ||
      htmlLower.includes('cf-browser-verification') ||
      htmlLower.includes('attention required! | cloudflare') ||
      htmlLower.includes('turnstile');

    if (isCloudflareChallenge) {
      console.warn(`🛡️ [Playwright Anti-Bot] ⚠️ Cloudflare Challenge / Bot verification detected on ${targetUrl}`);
    }

    console.log(`✨ [Playwright Rendered] Title: "${pageTitle}", HTML: ${html.length} chars (HTTP ${statusCode})`);

    await page.close().catch(() => {});
    await context.close().catch(() => {});

    return {
      html,
      finalUrl,
      pageTitle,
      modeUsed: session.mode,
      httpStatus: statusCode,
      isCloudflareChallenge,
    };
  } catch (err: any) {
    console.warn(`⚠️ [Playwright Error] Render failed for ${targetUrl} (${err.message}). Falling back to static fetch.`);
    if (page) await page.close().catch(() => {});
    if (context) await context.close().catch(() => {});
    return fetchStaticFallback(targetUrl, timeoutMs);
  }
}

/**
 * Fallback fetch using Axios + Stealth Headers when Playwright is unavailable
 */
async function fetchStaticFallback(url: string, timeoutMs = 12000): Promise<RenderedPageResult> {
  try {
    const res = await axios.get(url, {
      headers: BROWSER_HEADERS,
      timeout: timeoutMs,
      maxRedirects: 5,
      validateStatus: () => true,
    });

    const html = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
    const finalUrl = res.request?.res?.responseUrl || url;
    const htmlLower = html.toLowerCase();
    const isCloudflareChallenge =
      htmlLower.includes('just a moment...') ||
      htmlLower.includes('cf-browser-verification') ||
      htmlLower.includes('attention required! | cloudflare') ||
      htmlLower.includes('turnstile');

    return {
      html,
      finalUrl,
      modeUsed: 'static_html_fallback',
      httpStatus: res.status || 200,
      isCloudflareChallenge,
    };
  } catch (err: any) {
    return {
      html: '',
      finalUrl: url,
      modeUsed: 'static_html_fallback',
      httpStatus: 0,
      isCloudflareChallenge: false,
      error: err.message,
    };
  }
}
