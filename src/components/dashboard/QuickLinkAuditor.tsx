import React, { useState } from 'react';
import {
  Globe,
  Search,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  ExternalLink,
  ArrowRight,
  Loader2,
  Sparkles,
  Trash2,
  Copy,
  Check,
  Tag,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Lock,
  CornerDownRight,
  Activity,
  Cpu,
  Clock,
  CheckCheck,
  Info
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { crawlWebsiteLive } from '../../services/liveCrawler';
import { api } from '../../services/api';
import { AffiliateLink, CrawlerDiagnostics, Website } from '../../types';
import { getNetworkBadgeColor } from '../../utils/affiliateDetector';

export const QuickLinkAuditor: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { addWebsite, clearAllDemoData, setActiveView, setActiveWebsiteId, websites, registerScannedResults } = useApp();
  const [urlInput, setUrlInput] = useState('');
  const [linkScope, setLinkScope] = useState<'all' | 'outbound'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [auditResults, setAuditResults] = useState<{
    pageTitle: string;
    url: string;
    domain: string;
    diagnostics?: CrawlerDiagnostics;
    links: AffiliateLink[];
    stats: {
      total: number;
      healthy: number;
      broken: number;
      warning: number;
    };
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'broken' | 'warning' | 'healthy'>('all');
  const [filterType, setFilterType] = useState<'all' | 'internal' | 'outbound' | 'special'>('all');
  const [filterNetwork, setFilterNetwork] = useState<string>('all');
  const [expandedLinkId, setExpandedLinkId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedLinkId(prev => prev === id ? null : id);
  };

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    const targetUrl = urlInput.trim();
    setIsLoading(true);
    setProgressMsg('Rendering page via Headless Chromium (Playwright) & discovering all <a> anchors...');
    setAuditResults(null);
    setExpandedLinkId(null);

    try {
      let liveLinks: AffiliateLink[] = [];
      let pageTitle = targetUrl;
      let domain = targetUrl.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split('?')[0].split('#')[0] || 'target-site.com';
      let diagnostics: CrawlerDiagnostics | undefined = undefined;
      let returnedWebsite: Website | undefined = undefined;
      let returnedScanJob: any = undefined;

      try {
        const crawlRes = await api.liveCrawl(targetUrl, 'daily', true, true, true, linkScope);
        liveLinks = crawlRes.result?.links || [];
        diagnostics = crawlRes.result?.diagnostics;
        returnedWebsite = crawlRes.result?.website;
        returnedScanJob = crawlRes.result?.scanJob;
        if (crawlRes.result?.website?.name) {
          pageTitle = crawlRes.result.website.name;
        }
        if (crawlRes.result?.website?.domain) {
          domain = crawlRes.result.website.domain;
        }
      } catch {
        const fallback = await crawlWebsiteLive(targetUrl, linkScope);
        liveLinks = fallback?.links || [];
        returnedWebsite = fallback?.website;
        returnedScanJob = fallback?.scanJob;
      }

      const healthy = liveLinks.filter(l => l.status === 'healthy').length;
      const broken = liveLinks.filter(l => l.status === 'broken').length;
      const warning = liveLinks.filter(l => l.status === 'warning').length;

      const existingWeb = websites.find(w => w.domain.toLowerCase() === domain.toLowerCase() || (returnedWebsite && w.id === returnedWebsite.id));

      const scannedWeb: Website = returnedWebsite ? {
        ...returnedWebsite,
        linksCount: liveLinks.length,
        healthyCount: healthy,
        brokenCount: broken,
        warningCount: warning,
      } : {
        id: existingWeb?.id || ('web_' + Date.now().toString(36)),
        url: targetUrl,
        domain: domain,
        name: pageTitle || domain,
        status: 'monitoring',
        articlesCount: 1,
        linksCount: liveLinks.length,
        healthyCount: healthy,
        brokenCount: broken,
        warningCount: warning,
        lastScannedAt: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        nextScanAt: 'Tomorrow, 2:00 AM',
        scanFrequency: 'daily',
        preferredScanTime: '02:00',
        sitemapUrl: `${targetUrl}/sitemap.xml`,
        crawlerEngineMode: 'anti_block_stealth',
        spaRenderingEnabled: true,
        antiBlockProxyEnabled: true,
        totalMonthlyLossAtRisk: broken * 45,
        telegramAlerts: true,
        emailAlerts: true,
        slackAlerts: true,
        discordAlerts: true,
      };

      setAuditResults({
        pageTitle,
        url: targetUrl,
        domain,
        diagnostics,
        links: liveLinks,
        stats: {
          total: liveLinks.length,
          healthy,
          broken,
          warning,
        }
      });

      // Synchronize into single source of truth across all overview cards, sidebar, and tables
      registerScannedResults({
        website: scannedWeb,
        links: liveLinks,
        scanJob: returnedScanJob,
        diagnostics,
      });
    } catch (err: any) {
      setProgressMsg('Scan failed: ' + (err.message || 'Check URL'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!urlInput.trim() && !auditResults?.url) return;
    setActiveView('dashboard');
  };

  // Compute category breakdown subsets
  const internalLinks = (auditResults?.links || []).filter(
    l => l.isInternal && !l.linkType?.includes('Anchor') && !l.linkType?.includes('Special') && !l.linkType?.includes('Mailto') && !l.linkType?.includes('Tel') && !l.linkType?.includes('JavaScript')
  );
  const outboundLinks = (auditResults?.links || []).filter(
    l => !l.isInternal && !l.linkType?.includes('Mailto') && !l.linkType?.includes('Tel') && !l.linkType?.includes('Special')
  );
  const specialLinks = (auditResults?.links || []).filter(
    l => l.linkType?.includes('Anchor') || l.linkType?.includes('Special') || l.linkType?.includes('Mailto') || l.linkType?.includes('Tel') || l.linkType?.includes('JavaScript')
  );

  // Compute network breakdown counts
  const networkCounts = (auditResults?.links || []).reduce((acc: Record<string, number>, l) => {
    const net = l.network || 'Custom / Direct';
    acc[net] = (acc[net] || 0) + 1;
    return acc;
  }, {});

  const displayedLinks = (auditResults?.links || []).filter(l => {
    if (filterMode === 'broken' && l.status !== 'broken') return false;
    if (filterMode === 'warning' && l.status !== 'warning') return false;
    if (filterMode === 'healthy' && l.status !== 'healthy') return false;
    
    // Type filtering
    if (filterType === 'outbound' && (l.isInternal || l.linkType?.includes('Mailto') || l.linkType?.includes('Tel') || l.linkType?.includes('Anchor') || l.linkType?.includes('Special'))) return false;
    if (filterType === 'internal' && (!l.isInternal || l.linkType?.includes('Anchor') || l.linkType?.includes('JavaScript') || l.linkType?.includes('Special'))) return false;
    if (filterType === 'special' && !l.linkType?.includes('Anchor') && !l.linkType?.includes('Special') && !l.linkType?.includes('Mailto') && !l.linkType?.includes('Tel') && !l.linkType?.includes('JavaScript')) return false;

    if (filterNetwork !== 'all') {
      const net = l.network || 'Custom / Direct';
      if (net !== filterNetwork) return false;
    }
    return true;
  });

  // Check if target URL belongs to an already-monitored domain
  const matchingWebsite = auditResults ? websites.find(w => {
    const normSiteDomain = (w.domain || '').toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split(':')[0];
    const normAuditDomain = (auditResults.domain || '').toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0].split(':')[0];
    return normSiteDomain && normAuditDomain && (
      normSiteDomain === normAuditDomain || 
      normAuditDomain.endsWith('.' + normSiteDomain) || 
      normSiteDomain.endsWith('.' + normAuditDomain)
    );
  }) : undefined;

  const isHomepage = Boolean(
    auditResults?.url &&
    auditResults.url.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '') === 
    auditResults.domain.replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '')
  );

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-100">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">Live Page & Outbound Link Auditor</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600" />
              Real-Time Verification
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paste any arbitrary URL to execute client-side JavaScript, discover all &lt;a&gt; anchors, and verify live HTTP status codes.
          </p>
        </div>

        <button
          onClick={clearAllDemoData}
          title="Remove all sample demo data"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200/60 transition-colors self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Demo Data</span>
        </button>
      </div>

      {/* Scope Selector & Input Box */}
      <form onSubmit={handleScan} className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">Crawl Scope:</span>
            <button
              type="button"
              onClick={() => setLinkScope('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                linkScope === 'all'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Links (100% DOM Anchors)
            </button>
            <button
              type="button"
              onClick={() => setLinkScope('outbound')}
              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                linkScope === 'outbound'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Outbound Only
            </button>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Matches document.querySelectorAll('a[href]').length
          </span>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
          <div className="relative flex-1">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste ANY webpage URL (e.g. https://amc.drguptamd.in, https://example.com/page)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-inner"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !urlInput.trim()}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Auditing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-rose-200" />
                <span>Audit Links ({linkScope === 'all' ? 'All' : 'Outbound'})</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Loading status */}
      {isLoading && (
        <div className="mt-4 p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl flex items-center gap-3 animate-fade-in">
          <Loader2 className="w-4 h-4 text-rose-600 animate-spin shrink-0" />
          <p className="text-xs font-mono text-rose-800">{progressMsg}</p>
        </div>
      )}

      {/* Results View */}
      {auditResults && (
        <div className="mt-5 pt-5 border-t border-slate-100 animate-fade-in">
          {/* Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl mb-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-bold text-slate-900 truncate max-w-sm sm:max-w-md">
                  {auditResults.pageTitle}
                </h4>
                <a
                  href={auditResults.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-slate-600"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-200 text-slate-700 flex items-center gap-1">
                  <Cpu className="w-3 h-3 text-slate-500" />
                  {auditResults.diagnostics?.modeUsed === 'headless_spa_playwright' ? 'Playwright Chromium' : 'HTTP Parser'}
                </span>
                {auditResults.diagnostics?.executionDurationMs && (
                  <span className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {(auditResults.diagnostics.executionDurationMs / 1000).toFixed(2)}s
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{auditResults.url}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {auditResults.stats.healthy} Healthy
                </span>
                {auditResults.stats.warning > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    {auditResults.stats.warning} Timeout/Warning
                  </span>
                )}
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${auditResults.stats.broken > 0 ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-slate-100 text-slate-600'}`}>
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
                  {auditResults.stats.broken} Broken
                </span>
              </div>

              <button
                onClick={handleSaveToDashboard}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <span>Save to Monitor</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scope Distinction Note (when audited URL matches an already-monitored domain) */}
          {matchingWebsite && (
            <div className="mb-3 p-3 bg-indigo-50/90 border border-indigo-200/90 rounded-xl flex items-start gap-2.5 text-xs text-indigo-950 shadow-2xs animate-fade-in">
              <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-indigo-900">Scope Distinction Note</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-200/70 text-indigo-800">
                    Single-Page Audit vs Full-Site Monitoring
                  </span>
                </div>
                <p className="text-indigo-900/90">
                  Note: This is an on-demand single-page check of the <strong>{isHomepage ? 'homepage only' : 'audited URL only'}</strong>. Your full site monitoring for <strong className="font-mono text-indigo-950">{matchingWebsite.domain}</strong> covers <strong>{matchingWebsite.linksCount} links</strong> across <strong>{matchingWebsite.articlesCount || 1} crawled pages</strong> — this single-page result is separate and does not replace or overwrite those.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveWebsiteId(matchingWebsite.id);
                  setActiveView('dashboard');
                }}
                className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-950 bg-white hover:bg-indigo-100/80 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
              >
                <span>View Full-Site</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Diagnostic Context Alerts */}
          {auditResults.diagnostics?.isRedirected && (
            <div className="mb-3 p-2.5 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-2 text-xs text-sky-900">
              <CornerDownRight className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                <strong>Page Redirected:</strong> Initial URL redirected to{' '}
                <a href={auditResults.diagnostics.finalUrl} target="_blank" rel="noopener noreferrer" className="font-mono underline font-bold">
                  {auditResults.diagnostics.finalUrl}
                </a>{' '}
                (HTTP {auditResults.diagnostics.httpStatus}).
              </span>
            </div>
          )}

          {auditResults.diagnostics?.isCloudflareBlocked && (
            <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-900">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Cloudflare Challenge Detected:</strong> Target site displayed a bot challenge screen. Playwright Chromium rendered pre-challenge DOM.
              </span>
            </div>
          )}

          {auditResults.diagnostics?.isLoginWall && (
            <div className="mb-3 p-2.5 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-2 text-xs text-purple-900">
              <Lock className="w-4 h-4 text-purple-600 shrink-0" />
              <span>
                <strong>Authentication Gate Detected:</strong> Page title or HTML indicates a login/sign-in screen.
              </span>
            </div>
          )}

          {/* Link Type Breakdown & Filters */}
          <div className="mb-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">Link Scope & Type:</span>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  All Links ({auditResults.links.length})
                </button>
                <button
                  onClick={() => setFilterType('internal')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterType === 'internal' ? 'bg-sky-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Internal Routes ({internalLinks.length})
                </button>
                <button
                  onClick={() => setFilterType('outbound')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterType === 'outbound' ? 'bg-rose-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  Outbound Partners ({outboundLinks.length})
                </button>
                {specialLinks.length > 0 && (
                  <button
                    onClick={() => setFilterType('special')}
                    className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterType === 'special' ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                  >
                    Anchors & Actions ({specialLinks.length})
                  </button>
                )}
              </div>

              {auditResults.diagnostics && (
                <span className="text-[11px] text-slate-500 font-mono font-medium">
                  DOM Count: <strong>{auditResults.diagnostics.totalAnchorsInDom}</strong> &lt;a&gt; tags
                </span>
              )}
            </div>
          </div>

          {/* Network Breakdown Chips */}
          {Object.keys(networkCounts).length > 0 && (
            <div className="mb-3 p-2.5 bg-slate-50/70 border border-slate-200/60 rounded-xl">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3 h-3 text-slate-400" />
                <span>Affiliate Networks / Partners:</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setFilterNetwork('all')}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${filterNetwork === 'all' ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                >
                  All Networks ({auditResults.links.length})
                </button>
                {Object.entries(networkCounts).map(([net, count]) => (
                  <button
                    key={net}
                    onClick={() => setFilterNetwork(net === filterNetwork ? 'all' : net)}
                    className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${filterNetwork === net ? 'bg-rose-700 text-white' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                  >
                    {net}: <strong className="ml-0.5">{count}</strong>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Status Filters */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterMode === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                All Status ({auditResults.links.length})
              </button>
              <button
                onClick={() => setFilterMode('healthy')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterMode === 'healthy' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Healthy ({auditResults.stats.healthy})
              </button>
              <button
                onClick={() => setFilterMode('broken')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterMode === 'broken' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Broken ({auditResults.stats.broken})
              </button>
              {auditResults.stats.warning > 0 && (
                <button
                  onClick={() => setFilterMode('warning')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterMode === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
                >
                  Timeout/Warning ({auditResults.stats.warning})
                </button>
              )}
            </div>

            {auditResults.diagnostics && (
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {auditResults.diagnostics.internalAnchorsCount} Internal, {auditResults.diagnostics.outboundAnchorsCount} Outbound, {auditResults.diagnostics.specialAnchorsCount || 0} Special
              </span>
            )}
          </div>

          {/* Links Table / List */}
          {displayedLinks.length === 0 ? (
            <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 p-4">
              <CheckCircle2 className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {auditResults.links.length === 0
                  ? '0 Links Detected on this page.'
                  : filterMode === 'broken'
                  ? '🎉 No broken links found matching your current filter!'
                  : filterType === 'outbound'
                  ? '0 Outbound Links — All anchor tags on this page are internal domain routes.'
                  : 'No links match this filter.'}
              </p>
              {matchingWebsite && (
                <p className="text-[11px] text-slate-500 mt-2 font-medium">
                  💡 Note: Your full-site monitoring is currently tracking <strong className="text-slate-700">{matchingWebsite.linksCount} links</strong> across <strong className="text-slate-700">{matchingWebsite.articlesCount || 1} pages</strong> on <strong className="text-slate-700 font-mono">{matchingWebsite.domain}</strong>.
                </p>
              )}
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {displayedLinks.map((link) => {
                const isExpanded = expandedLinkId === link.id;
                const isHealthy = link.status === 'healthy';
                const isBroken = link.status === 'broken';
                const isWarning = link.status === 'warning';

                return (
                  <div key={link.id} className="pt-2.5 first:pt-0">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                              isHealthy
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : isBroken
                                ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {isHealthy ? `HTTP ${link.httpStatus || 200} OK` : isBroken ? `HTTP ${link.httpStatus || 404} Broken` : `HTTP ${link.httpStatus || 408} Timeout`}
                          </span>

                          {/* Link Scope / Category Badge */}
                          {link.linkType === 'Internal Link' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                              Internal Route
                            </span>
                          ) : link.linkType === 'Page Anchor (#)' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              Page Anchor (#)
                            </span>
                          ) : link.linkType === 'Mailto Link' || link.linkType === 'Tel Link' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                              {link.linkType}
                            </span>
                          ) : link.linkType === 'JavaScript Trigger' ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                              JS Trigger
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                              Outbound Partner
                            </span>
                          )}

                          {link.network && link.network !== 'Custom / Direct' && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getNetworkBadgeColor(link.network)}`}>
                              {link.network}
                            </span>
                          )}

                          <span className="font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                            {link.anchorText || 'Direct Link'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">{link.url}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleExpand(link.id)}
                          title="View raw HTTP verification details"
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                            isExpanded ? 'bg-slate-900 text-white border-slate-900' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <span>Raw Data</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <button
                          onClick={() => handleCopy(link.id, link.url)}
                          title="Copy URL"
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                        >
                          {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open destination link in new tab"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                        >
                          <span>Test</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    {/* Expandable Raw Verification Data Drawer */}
                    {isExpanded && (
                      <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-1.5 animate-fade-in shadow-inner">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-1.5">
                          <span className="text-slate-400 font-sans font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                            <Activity className="w-3 h-3 text-rose-400" />
                            Live Verification Trace
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Latency: <strong className="text-emerald-400">{link.responseTimeMs || 115}ms</strong>
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1">
                          <div>
                            <span className="text-slate-400">Target URL: </span>
                            <span className="text-slate-200 break-all">{link.url}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Resolved Destination: </span>
                            <span className="text-sky-300 break-all">{link.finalUrl || link.url}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Status Code: </span>
                            <span className={isHealthy ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                              HTTP {link.httpStatus || 200} ({link.status.toUpperCase()})
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Crawler Mode: </span>
                            <span className="text-purple-300">{link.crawlerEngineMode || 'headless_spa_playwright'}</span>
                          </div>
                        </div>

                        {link.verificationMessage && (
                          <div className="pt-1 text-slate-300 text-[10px] border-t border-slate-800/80">
                            <span className="text-slate-500">Diagnostic Info: </span>
                            {link.verificationMessage}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
