import React, { useState } from 'react';
import {
  ShieldCheck,
  Link2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Clock,
  ArrowUpRight,
  Wrench,
  ExternalLink,
  Calendar,
  Activity,
  Sparkles,
  Search,
  Eye,
  TrendingDown,
  DollarSign,
  Target,
  Building2,
  Zap,
  Bot,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MetricCard } from '../common/MetricCard';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { RevenueLossBadge } from './RevenueLossBadge';
import { QuickLinkAuditor } from './QuickLinkAuditor';
import { HEALTH_HISTORY_7_DAYS } from '../../data/mockData';

export const OverviewTab: React.FC<{ searchQuery?: string }> = ({ searchQuery = '' }) => {
  const {
    user,
    activeWebsite,
    affiliateLinks,
    startScan,
    isScanning,
    setSelectedLinkForDetail,
    setFixingLink,
    setSelectedLinkForRedirect,
    applyWaybackFallback,
    setActiveView,
    setIsWhiteLabelModalOpen,
    setIsWebhooksModalOpen,
    totalRevenueProtected,
    backendHealth
  } = useApp();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentWebsiteLinks = affiliateLinks.filter(
    l => !activeWebsite || l.websiteDomain === activeWebsite.domain || l.websiteId === activeWebsite.id
  );

  const healthyLinks = currentWebsiteLinks.filter(l => l.status === 'healthy');
  const brokenLinks = currentWebsiteLinks.filter(l => l.status === 'broken');
  const warningLinks = currentWebsiteLinks.filter(l => l.status === 'warning');
  const totalIssuesCount = brokenLinks.length + warningLinks.length;

  const totalRevenueAtRisk = currentWebsiteLinks
    .filter(l => l.status === 'broken' || l.status === 'warning')
    .reduce((acc, l) => acc + (l.revenueImpact?.estimatedMonthlyLoss || 0), 0);

  const healthScore = currentWebsiteLinks.length > 0
    ? ((healthyLinks.length / currentWebsiteLinks.length) * 100).toFixed(1)
    : '100.0';

  const filteredIssues = currentWebsiteLinks
    .filter(l => l.status === 'broken' || l.status === 'warning')
    .filter(l =>
      !searchQuery ||
      l.articleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.errorType && l.errorType.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => (b.revenueImpact?.estimatedMonthlyLoss || 0) - (a.revenueImpact?.estimatedMonthlyLoss || 0));

  return (
    <div className="space-y-6 pb-12">
      {/* Revenue Shield Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-elevated relative overflow-hidden flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
              Active Domain: {activeWebsite?.domain || 'Active Domain'}
            </span>
            <span className="text-xs text-slate-400">Live Anti-Block & Stealth Probing Active</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {totalRevenueAtRisk === 0 ? (
              <span className="text-rose-400">100% Protected • 0 Revenue Loss Risk</span>
            ) : (
              <>Protecting <span className="text-rose-400 font-mono">${(totalRevenueAtRisk || activeWebsite?.totalMonthlyLossAtRisk || 0).toLocaleString()}/mo</span> revenue</>
            )}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {totalIssuesCount === 0 ? (
              <>All <strong>{currentWebsiteLinks.length} links</strong> on <strong>{activeWebsite?.domain}</strong> are healthy and verified reachable with HTTP 200 OK.</>
            ) : (
              <>LinkGuard identified <strong>${totalRevenueAtRisk.toLocaleString()}/mo</strong> in commissions at risk across {totalIssuesCount} broken links on <strong>{activeWebsite?.domain}</strong>.</>
            )}
          </p>
        </div>

        {/* Quick Power Actions */}
        <div className="flex flex-wrap items-center gap-2.5 z-10 shrink-0">
          <Button
            variant="secondary"
            size="md"
            className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 text-xs"
            leftIcon={<Target className="w-3.5 h-3.5 text-rose-400" />}
            onClick={() => setActiveView('competitors')}
          >
            Competitor Spotter
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="bg-slate-800 hover:bg-slate-700 text-white border-slate-700 text-xs"
            leftIcon={<Building2 className="w-3.5 h-3.5 text-purple-400" />}
            onClick={() => setIsWhiteLabelModalOpen(true)}
          >
            White-Label Portal
          </Button>

          <Button
            variant="rose"
            size="md"
            isLoading={isScanning}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            onClick={() => startScan(activeWebsite?.id)}
          >
            {isScanning ? 'Stealth Crawl in Progress...' : 'Run Scan Now'}
          </Button>
        </div>
      </div>

      {/* Quick Live Link / Page Auditor */}
      <QuickLinkAuditor compact={false} />

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Revenue at Risk"
          value={`$${totalRevenueAtRisk.toLocaleString()}/mo`}
          subtitle={totalRevenueAtRisk === 0 ? 'Zero commission risk' : 'GA4 page traffic weighted'}
          trend={{ value: `${totalIssuesCount} issues`, isPositive: totalRevenueAtRisk === 0, label: 'Risk' }}
          icon={<DollarSign className="w-5 h-5 text-rose-600" />}
          variant="rose"
          onClick={() => setActiveView('broken')}
        />

        <MetricCard
          title="Total Links"
          value={currentWebsiteLinks.length}
          subtitle={`On ${activeWebsite?.domain || 'domain'}`}
          trend={{ value: '100% indexed', isPositive: true, label: 'Indexed' }}
          icon={<Link2 className="w-5 h-5 text-slate-700" />}
          variant="default"
          onClick={() => setActiveView('links')}
        />

        <MetricCard
          title="Healthy Links"
          value={healthyLinks.length}
          subtitle={`${healthScore}% uptime verified`}
          trend={{ value: `${healthyLinks.length} active`, isPositive: true, label: 'Uptime' }}
          icon={<CheckCircle2 className="w-5 h-5 text-rose-600" />}
          variant="rose"
          onClick={() => setActiveView('links')}
        />

        <MetricCard
          title="Broken Issues"
          value={brokenLinks.length}
          subtitle={brokenLinks.length === 0 ? 'No 404s detected' : '404, 410, timeouts, 502'}
          icon={<XCircle className="w-5 h-5 text-rose-600" />}
          variant={brokenLinks.length === 0 ? 'rose' : 'amber'}
          onClick={() => setActiveView('broken')}
        />

        <MetricCard
          title="Health Score"
          value={`${healthScore}%`}
          subtitle="Commission earning efficiency"
          trend={{ value: `${healthScore}%`, isPositive: true, label: 'Score' }}
          icon={<ShieldCheck className="w-5 h-5 text-rose-600" />}
          variant="rose"
        />
      </div>

      {/* Health Chart & Modern Engine Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Health Chart */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-600" />
                Affiliate Revenue Protection & Health Velocity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Daily autonomous health checks weighted by traffic volume and commission yield
              </p>
            </div>

            {/* Time range selector */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${timeRange === '7d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${timeRange === '30d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeRange('90d')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${timeRange === '90d' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                90 Days
              </button>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-3 pt-4 items-end h-48 border-b border-slate-100 pb-2">
              {HEALTH_HISTORY_7_DAYS.map((item, idx) => {
                const healthyPercent = (item.healthy / 1250) * 100;
                const brokenHeight = Math.min(24, item.broken * 4);
                const isToday = idx === HEALTH_HISTORY_7_DAYS.length - 1;

                return (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group relative">
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-semibold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-md">
                      ${item.revenueProtected}/mo protected • {item.broken} broken ({item.score}%)
                    </div>

                    <div className="w-full max-w-[42px] bg-slate-100 rounded-xl overflow-hidden flex flex-col justify-end p-1 relative h-36">
                      <div
                        className={`w-full rounded-lg transition-all duration-300 ${isToday ? 'bg-rose-600' : 'bg-rose-500/80 group-hover:bg-rose-500'}`}
                        style={{ height: `${healthyPercent * 0.85}%` }}
                      />
                      {item.broken > 0 && (
                        <div
                          className="w-full bg-slate-800 rounded-t-sm mt-0.5"
                          style={{ height: `${brokenHeight}px` }}
                        />
                      )}
                    </div>

                    <span className={`text-xs font-semibold mt-2 ${isToday ? 'text-rose-700 font-bold' : 'text-slate-500'}`}>
                      {item.day}
                    </span>
                    <span className="text-[10px] text-slate-400">${item.revenueProtected}</span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Healthy (98.9%)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-800" /> Issues Fixed
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">Crawler Mode: Anti-Block Stealth (Residential Proxy)</span>
            </div>
          </div>
        </div>

        {/* Right: Modern Web & Anti-Block Telemetry */}
        <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Bot className="w-4 h-4 text-rose-600" />
                Live Crawler & SPA Telemetry
              </h3>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                (activeWebsite?.crawlerEngineMode === 'headless_spa_playwright' || backendHealth?.crawlerMode === 'headless_spa_playwright')
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {(activeWebsite?.crawlerEngineMode === 'headless_spa_playwright' || backendHealth?.crawlerMode === 'headless_spa_playwright')
                  ? 'Playwright JS Active'
                  : 'Standard HTTP Parser'}
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-500">Render Engine:</span>
                <span className="font-semibold text-slate-900">
                  {(activeWebsite?.crawlerEngineMode === 'headless_spa_playwright' || backendHealth?.crawlerMode === 'headless_spa_playwright')
                    ? 'Headless Chromium (Playwright)'
                    : 'Axios + Cheerio Fast Parser'}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">Link Extraction Scope:</span>
                <span className="font-semibold text-rose-700">All Links (100% DOM Anchors)</span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">Internal Domain Filter:</span>
                <span className="font-mono font-bold text-slate-900">
                  Disabled (Internal & Anchor Routes Tracked)
                </span>
              </div>

              <div className="flex items-center justify-between pt-3">
                <span className="text-slate-500">1-Click 301 Redirect:</span>
                <span className="font-semibold text-slate-800">Edge & CMS Ready</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Button
              variant="secondary"
              size="md"
              className="w-full text-xs"
              leftIcon={<Zap className="w-3.5 h-3.5 text-amber-500" />}
              onClick={() => setActiveView('broken')}
            >
              Review {totalIssuesCount} High-Priority Broken Links
            </Button>
          </div>
        </div>
      </div>

      {/* Critical Issues Sorted by Revenue Loss */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              High-Impact Revenue Leaks (Priority Sorted)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fix these {filteredIssues.length} broken affiliate links to recover <strong>${totalRevenueAtRisk.toLocaleString()}/month</strong>.
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveView('broken')}
            rightIcon={<ArrowUpRight className="w-3.5 h-3.5" />}
          >
            View All Broken Links
          </Button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
                <th className="py-3 px-5">Target Article</th>
                <th className="py-3 px-5">Est. Revenue Loss</th>
                <th className="py-3 px-5">Issue Detected</th>
                <th className="py-3 px-5">Recommended Resolution</th>
                <th className="py-3 px-5 text-right">Fix Engine Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredIssues.slice(0, 5).map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-5">
                    <p className="font-bold text-slate-900 truncate max-w-sm">{link.articleTitle}</p>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">Anchor: "{link.anchorText}"</p>

                    {/* Direct Broken URL Box */}
                    <div className="mt-1.5 flex items-center justify-between gap-2 bg-rose-50/90 border border-rose-200/90 rounded-lg p-1.5 max-w-sm">
                      <div className="flex items-center gap-1.5 truncate min-w-0">
                        <ExternalLink className="w-3 h-3 text-rose-600 shrink-0" />
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-rose-800 text-[10px] font-bold hover:underline truncate"
                          title={link.url}
                        >
                          {link.url}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleCopyUrl(link.id, link.url)}
                          className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 shrink-0 inline-flex items-center gap-1 transition-colors"
                          title="Copy broken URL"
                        >
                          {copiedId === link.id ? (
                            <>
                              <Check className="w-2.5 h-2.5 text-rose-600" />
                              <span className="text-rose-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-2.5 h-2.5 text-slate-500" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 shrink-0 inline-flex items-center transition-colors"
                          title="Open link in new tab"
                        >
                          <ExternalLink className="w-2.5 h-2.5 text-rose-600" />
                        </a>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-5">
                    <RevenueLossBadge impact={link.revenueImpact} size="sm" showDetails />
                  </td>

                  <td className="py-3.5 px-5">
                    <span className={`inline-flex items-center gap-1 font-bold ${link.status === 'broken' ? 'text-rose-600' : 'text-amber-600'}`}>
                      {link.status === 'broken' ? <XCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                      <span>{link.errorType || 'HTTP Error'}</span>
                    </span>
                  </td>

                  <td className="py-3.5 px-5">
                    {link.waybackSnapshot ? (
                      <div className="space-y-0.5 max-w-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                            Archive Snapshot
                          </span>
                          <span className="text-[11px] font-semibold text-slate-800 truncate">{link.waybackSnapshot.snapshotDate}</span>
                        </div>
                        <button
                          onClick={() => applyWaybackFallback(link.id)}
                          className="text-[10px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                        >
                          Apply Wayback Fallback
                        </button>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-[11px] font-medium block truncate max-w-xs">
                        {link.suggestedAction || '1-Click 301 Edge Redirect'}
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedLinkForRedirect(link)}
                        className="px-2.5 py-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl font-semibold transition-colors inline-flex items-center gap-1 border border-amber-200"
                        title="1-Click Headless 301 Redirect"
                      >
                        <Zap className="w-3 h-3" />
                        301 Redirect
                      </button>

                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Wrench className="w-3 h-3" />}
                        onClick={() => setFixingLink(link)}
                      >
                        Fix Link
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
