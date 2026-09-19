export type LinkStatus = 'healthy' | 'broken' | 'warning';

export type ErrorType = 
  | '404 Not Found'
  | '410 Gone'
  | 'Redirect Failed'
  | 'Timeout (10s)'
  | '500 Server Error'
  | '502 Bad Gateway'
  | 'Product Unavailable'
  | 'Product Out of Stock'
  | 'Expired Coupon Code'
  | 'Affiliate Destination Changed';

export type AffiliateNetwork = 
  | 'Amazon Associates'
  | 'ClickBank'
  | 'ShareASale'
  | 'CJ Affiliate'
  | 'Impact'
  | 'Rakuten'
  | 'Awin'
  | 'Custom / Direct';

export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

export interface RevenueImpact {
  estimatedMonthlyLoss: number;
  monthlyPageViews: number;
  conversionRate: number;
  averageCommission: number;
  priority: PriorityLevel;
  currency: string;
}

export interface AiSuggestion {
  suggestedUrl: string;
  sourceDomain: string;
  title: string;
  confidenceScore: number;
  relevanceReason: string;
  isAffiliateCompatible: boolean;
  anchorMatch: string;
}

export interface WaybackSnapshot {
  archiveUrl: string;
  snapshotDate: string;
  originalStatus: number;
  isAvailable: boolean;
}

export type HeadlessCmsType = 'cloudflare_worker' | 'wordpress_rest_api' | 'shopify_storefront' | 'vercel_edge';

export interface HeadlessRedirectRecord {
  id: string;
  linkId: string;
  targetCms: HeadlessCmsType;
  sourcePath: string;
  destinationUrl: string;
  appliedAt: string;
  status: 'active' | 'pending' | 'failed';
}

export interface CompetitorOpportunity {
  id: string;
  competitorDomain: string;
  articleTitle: string;
  articleUrl: string;
  brokenUrl: string;
  brokenAnchorText: string;
  errorType: string;
  referringDomainsCount: number;
  estimatedTraffic: number;
  outreachPitchTemplate: string;
  discoveredAt: string;
  status: 'uncontacted' | 'contacted' | 'won' | 'ignored';
}

export interface WhiteLabelConfig {
  isEnabled: boolean;
  agencyName: string;
  agencyLogoUrl: string;
  brandColor: string;
  customDomain: string;
  clientPortalUrl: string;
  requirePasscode: boolean;
  passcode?: string;
  showLinkGuardBranding: boolean;
}

export interface WebhookConfig {
  slackWebhookUrl?: string;
  slackEnabled: boolean;
  discordWebhookUrl?: string;
  discordEnabled: boolean;
  teamsWebhookUrl?: string;
  teamsEnabled: boolean;
  customWebhookUrl?: string;
  customWebhookEnabled: boolean;
  notifyOnCriticalOnly: boolean;
}

export type CrawlerEngineMode = 'standard_http' | 'headless_spa_playwright' | 'anti_block_stealth';

export interface Website {
  id: string;
  url: string;
  domain: string;
  name: string;
  status: 'monitoring' | 'paused' | 'scanning' | 'error';
  articlesCount: number;
  linksCount: number;
  healthyCount: number;
  brokenCount: number;
  warningCount: number;
  lastScannedAt: string;
  nextScanAt: string;
  scanFrequency: 'daily' | 'twice_daily' | 'weekly';
  preferredScanTime: string;
  sitemapUrl: string;
  crawlerEngineMode: CrawlerEngineMode;
  spaRenderingEnabled: boolean;
  antiBlockProxyEnabled: boolean;
  totalMonthlyLossAtRisk: number;
  telegramAlerts: boolean;
  emailAlerts: boolean;
  slackAlerts: boolean;
  discordAlerts: boolean;
}

export interface CheckHistoryItem {
  date: string;
  status: LinkStatus;
  httpStatus: number;
  responseTimeMs: number;
  message: string;
}

export type LinkScope = 'all' | 'outbound';

export interface CrawlerDiagnostics {
  targetUrl: string;
  finalUrl: string;
  isRedirected: boolean;
  pageTitle: string;
  modeUsed: CrawlerEngineMode;
  totalAnchorsInDom: number;
  internalAnchorsCount: number;
  nonHttpOrSchemeCount: number;
  outboundAnchorsCount: number;
  specialAnchorsCount?: number;
  linkScope?: LinkScope;
  isCloudflareBlocked: boolean;
  isLoginWall: boolean;
  httpStatus: number;
  executionDurationMs: number;
}

export interface AffiliateLink {
  id: string;
  websiteId: string;
  websiteDomain: string;
  articleId: string;
  articleTitle: string;
  articleUrl: string;
  url: string;
  finalUrl?: string;
  normalizedUrl: string;
  network: AffiliateNetwork;
  anchorText: string;
  linkType?: string;
  isInternal?: boolean;
  status: LinkStatus;
  httpStatus: number;
  responseTimeMs?: number;
  crawlerEngineMode?: CrawlerEngineMode;
  verificationMessage?: string;
  availabilityStatus: 'in_stock' | 'out_of_stock' | 'unavailable' | 'unknown';
  errorType?: ErrorType;
  revenueImpact: RevenueImpact;
  aiSuggestion?: AiSuggestion;
  waybackSnapshot?: WaybackSnapshot;
  firstDetectedAt: string;
  lastCheckedAt: string;
  lastStatusChangeAt: string;
  checkHistory: CheckHistoryItem[];
  suggestedAction?: string;
  isResolved?: boolean;
  activeHeadlessRedirect?: HeadlessRedirectRecord;
  linkCategory?: string;
}

export interface Alert {
  id: string;
  affiliateLinkId: string;
  linkUrl: string;
  articleTitle: string;
  articleUrl: string;
  type: 'broken' | 'warning' | 'system' | 'resolved';
  issue: string;
  detectedAt: string;
  estimatedRevenueLoss?: number;
  sentToTelegram: boolean;
  sentToEmail: boolean;
  sentToSlack?: boolean;
  sentToDiscord?: boolean;
  isRead: boolean;
  isDismissed: boolean;
}

export interface ScanJob {
  id: string;
  websiteId: string;
  websiteDomain: string;
  startedAt: string;
  completedAt: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'failed';
  articlesScanned: number;
  linksChecked: number;
  healthyCount: number;
  brokenCount: number;
  warningCount: number;
  crawlerModeUsed: CrawlerEngineMode;
  javascriptRenderCount: number;
  proxiesRotatedCount: number;
}

export interface TelegramConnection {
  isConnected: boolean;
  botUsername: string;
  chatId?: string;
  username?: string;
  connectedAt?: string;
  notificationEnabled: boolean;
  lastAlertSentAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'business';
  telegramConnected: boolean;
}

export type ActiveView = 
  | 'landing'
  | 'onboarding'
  | 'dashboard'
  | 'websites'
  | 'links'
  | 'broken'
  | 'competitors'
  | 'whitelabel'
  | 'alerts'
  | 'scans'
  | 'settings'
  | 'billing'
  | 'pricing'
  | 'features'
  | 'how-it-works';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}
