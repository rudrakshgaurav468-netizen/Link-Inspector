import {
  Website,
  AffiliateLink,
  Alert,
  ScanJob,
  TelegramConnection,
  User,
  CompetitorOpportunity,
  WhiteLabelConfig,
  WebhookConfig,
  LinkStatus,
  ErrorType,
  CrawlerDiagnostics,
  LinkScope,
} from '../types';

export interface DatabaseState {
  user: User;
  telegram: TelegramConnection;
  websites: Website[];
  links: AffiliateLink[];
  alerts: Alert[];
  scanJobs: ScanJob[];
  competitors: CompetitorOpportunity[];
  whiteLabel: WhiteLabelConfig;
  webhooks: WebhookConfig;
}

export interface BackendHealth {
  status: string;
  version?: string;
  crawlerMode?: string;
  timestamp?: string;
  uptime?: number;
  uptimeFormatted?: string;
  activePlaywrightSessions?: number;
  memory?: {
    heapUsedMB: number;
    rssMB: number;
  };
  database?: {
    websitesCount: number;
    linksCount: number;
    scanJobsCount: number;
  };
  environment?: string;
}

const API_BASE = '/api';

export const api = {
  // 1. Health check
  async health(): Promise<BackendHealth> {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Backend health check failed');
    return res.json();
  },

  async getHealth(): Promise<BackendHealth> {
    return this.health();
  },

  // 2. Fetch entire database state
  async getDb(): Promise<DatabaseState> {
    const res = await fetch(`${API_BASE}/db`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('Failed to fetch database from backend');
    return res.json();
  },

  // 3. Sync & save entire or partial database state
  async syncDb(data: Partial<DatabaseState>): Promise<{ success: boolean; db: DatabaseState }> {
    const res = await fetch(`${API_BASE}/db/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error('Failed to sync database to backend');
    return res.json();
  },

  // 4. Live Crawl & Scan Website
  async liveCrawl(
    url: string,
    frequency: 'daily' | 'twice_daily' | 'weekly' = 'daily',
    telegramAlerts = true,
    emailAlerts = true,
    singlePageOnly = false,
    linkScope: LinkScope = 'all'
  ): Promise<{
    success: boolean;
    result: {
      website: Website;
      links: AffiliateLink[];
      scanJob: ScanJob;
      diagnostics?: CrawlerDiagnostics;
      stats: {
        totalLinks: number;
        healthyCount: number;
        brokenCount: number;
        warningCount: number;
      };
    };
  }> {
    const res = await fetch(`${API_BASE}/crawler/live-crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, frequency, telegramAlerts, emailAlerts, singlePageOnly, linkScope }),
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) throw new Error('Backend live crawl failed');
    return res.json();
  },

  // 5. Scan Registered Website
  async scanWebsite(websiteId: string, linkScope: LinkScope = 'all'): Promise<{ success: boolean; website: Website; scanJob: ScanJob }> {
    const res = await fetch(`${API_BASE}/crawler/scan-website`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ websiteId, linkScope }),
      signal: AbortSignal.timeout(120000),
    });
    if (!res.ok) throw new Error('Failed to scan website');
    return res.json();
  },

  // 6. Check Single Link Health Probe
  async checkLink(url: string): Promise<{
    status: LinkStatus;
    httpStatus: number;
    responseTimeMs: number;
    message: string;
    errorType?: ErrorType;
  }> {
    const res = await fetch(`${API_BASE}/crawler/check-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error('Failed to check link health');
    return res.json();
  },

  // 7. Fix Link & Verify
  async fixLink(linkId: string, newUrl: string, anchorText?: string): Promise<{ success: boolean; link: AffiliateLink }> {
    const res = await fetch(`${API_BASE}/links/fix`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ linkId, newUrl, anchorText }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error('Failed to fix link on backend');
    return res.json();
  },

  // 8. Wayback Machine Query
  async queryWayback(url: string): Promise<{ snapshot: any }> {
    const res = await fetch(`${API_BASE}/wayback/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error('Wayback query failed');
    return res.json();
  },

  // 9. AI Semantic Match Generator
  async getAiSuggestion(anchorText: string, brokenUrl: string, articleTitle: string): Promise<{ suggestion: any }> {
    const res = await fetch(`${API_BASE}/ai/suggest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ anchorText, brokenUrl, articleTitle }),
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error('AI suggestion failed');
    return res.json();
  },

  // 10. Send Telegram Alert
  async sendTelegramAlert(botToken?: string, chatId?: string, message?: string): Promise<{ success: boolean; method: string }> {
    const res = await fetch(`${API_BASE}/telegram/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botToken, chatId, message }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error('Failed to send Telegram alert');
    return res.json();
  },

  // 11. Send Webhook Notification (Slack / Discord)
  async sendWebhook(webhookUrl?: string, channelType?: 'slack' | 'discord' | 'custom', payload?: any): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/webhooks/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhookUrl, channelType, payload }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error('Failed to send webhook');
    return res.json();
  },

  // 12. Competitor Scanner
  async scanCompetitor(domain: string): Promise<{ success: boolean; opportunity: CompetitorOpportunity }> {
    const res = await fetch(`${API_BASE}/competitors/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
      signal: AbortSignal.timeout(10000),
    });
    if (!res.ok) throw new Error('Competitor scan failed');
    return res.json();
  },

  // 13. Trigger Cron Check
  async triggerCron(): Promise<any> {
    const res = await fetch(`${API_BASE}/cron/daily-check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer linkguard_cron_secret_auth_token_2026'
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) throw new Error('Cron execution failed');
    return res.json();
  },

  // 14. Reset Database
  async resetDb(): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/db/reset`, {
      method: 'POST',
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error('Database reset failed');
    return res.json();
  },

  // 15. CSV Export Link
  getCsvExportUrl(): string {
    return `${API_BASE}/export/csv`;
  }
};
