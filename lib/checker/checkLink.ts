import axios from 'axios';
import { LinkStatus, ErrorType } from '../../src/types';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36 (compatible; LinkGuard/2.0; +https://linkguard.io/bot)';

export interface LinkCheckResult {
  status: LinkStatus;
  httpStatus: number;
  finalUrl: string;
  responseTimeMs: number;
  availabilityStatus: 'in_stock' | 'out_of_stock' | 'unavailable' | 'unknown';
  errorType?: ErrorType;
  message: string;
  hasStateChanged: boolean;
  previousStatus?: LinkStatus;
}

const OUT_OF_STOCK_PHRASES = [
  'currently unavailable',
  'we don\'t know when or if this item will be back in stock',
  'temporarily out of stock',
  'item is out of stock',
  'this item is no longer available',
  'sold out',
  'product no longer available',
  'page not found',
  'offer has expired',
  'deal expired',
];

export async function checkLinkHealth(
  targetUrl: string, 
  previousStatus: LinkStatus = 'healthy'
): Promise<LinkCheckResult> {
  const startTime = Date.now();
  let finalUrl = targetUrl;

  try {
    const res = await axios.get(targetUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      timeout: 10000,
      maxRedirects: 8,
      validateStatus: () => true, // capture all status codes
    });

    const responseTimeMs = Date.now() - startTime;
    const httpStatus = res.status;

    if (res.request?.res?.responseUrl) {
      finalUrl = res.request.res.responseUrl;
    }

    // 1. Status 404 Not Found
    if (httpStatus === 404) {
      const newStatus: LinkStatus = 'broken';
      return {
        status: newStatus,
        httpStatus: 404,
        finalUrl,
        responseTimeMs,
        availabilityStatus: 'unavailable',
        errorType: '404 Not Found',
        message: 'HTTP 404 Not Found — Destination page does not exist',
        hasStateChanged: previousStatus !== newStatus,
        previousStatus,
      };
    }

    // 2. Status 410 Gone
    if (httpStatus === 410) {
      const newStatus: LinkStatus = 'broken';
      return {
        status: newStatus,
        httpStatus: 410,
        finalUrl,
        responseTimeMs,
        availabilityStatus: 'unavailable',
        errorType: '410 Gone',
        message: 'HTTP 410 Gone — Product permanently removed by merchant',
        hasStateChanged: previousStatus !== newStatus,
        previousStatus,
      };
    }

    // 3. Status 5xx Server Error
    if (httpStatus >= 500) {
      const newStatus: LinkStatus = 'broken';
      return {
        status: newStatus,
        httpStatus,
        finalUrl,
        responseTimeMs,
        availabilityStatus: 'unavailable',
        errorType: httpStatus === 502 ? '502 Bad Gateway' : '500 Server Error',
        message: `HTTP ${httpStatus} Server Error on destination host`,
        hasStateChanged: previousStatus !== newStatus,
        previousStatus,
      };
    }

    // 4. Inspect Page HTML for Out-of-Stock / Delisted patterns
    const html = typeof res.data === 'string' ? res.data.toLowerCase() : '';
    const matchedPhrase = OUT_OF_STOCK_PHRASES.find(phrase => html.includes(phrase));

    if (matchedPhrase) {
      const newStatus: LinkStatus = 'warning';
      return {
        status: newStatus,
        httpStatus: 200,
        finalUrl,
        responseTimeMs,
        availabilityStatus: 'out_of_stock',
        errorType: 'Product Out of Stock',
        message: `HTTP 200 OK — Page detected "${matchedPhrase}" indicator`,
        hasStateChanged: previousStatus !== newStatus,
        previousStatus,
      };
    }

    // 5. Clean Healthy Link
    const newStatus: LinkStatus = 'healthy';
    return {
      status: newStatus,
      httpStatus: httpStatus || 200,
      finalUrl,
      responseTimeMs,
      availabilityStatus: 'in_stock',
      message: `HTTP ${httpStatus || 200} OK — Product Active & In Stock`,
      hasStateChanged: previousStatus !== newStatus,
      previousStatus,
    };
  } catch (err: any) {
    const responseTimeMs = Date.now() - startTime;
    const newStatus: LinkStatus = 'broken';

    if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
      return {
        status: newStatus,
        httpStatus: 0,
        finalUrl,
        responseTimeMs: 10000,
        availabilityStatus: 'unavailable',
        errorType: 'Timeout (10s)',
        message: 'Connection timed out after 10,000ms limit',
        hasStateChanged: previousStatus !== newStatus,
        previousStatus,
      };
    }

    return {
      status: newStatus,
      httpStatus: 0,
      finalUrl,
      responseTimeMs,
      availabilityStatus: 'unavailable',
      errorType: 'Redirect Failed',
      message: err.message || 'Connection failed during HTTP resolution',
      hasStateChanged: previousStatus !== newStatus,
      previousStatus,
    };
  }
}
