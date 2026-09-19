import React, { useState } from 'react';
import {
  AlertOctagon,
  XCircle,
  AlertTriangle,
  Wrench,
  Eye,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Zap,
  History,
  TrendingDown,
  ArrowUpDown,
  Filter,
  Download,
  Search,
  RotateCcw,
  ArrowRight,
  Copy,
  Check,
  Globe
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { RevenueLossBadge } from './RevenueLossBadge';
import { QuickLinkAuditor } from './QuickLinkAuditor';
import { AffiliateLink } from '../../types';

export const BrokenLinksTab: React.FC<{ searchQuery?: string; setSearchQuery?: (q: string) => void }> = ({
  searchQuery = '',
  setSearchQuery
}) => {
  const {
    affiliateLinks,
    activeWebsite,
    websites,
    setActiveWebsiteId,
    setActiveView,
    setIsAddWebsiteModalOpen,
    setSelectedLinkForDetail,
    setFixingLink,
    setSelectedLinkForRedirect,
    applyWaybackFallback,
    checkLinkNow,
    addWebsite
  } = useApp();

  const [issueFilter, setIssueFilter] = useState<'all' | 'critical' | 'broken' | 'warning'>('all');
  const [sortBy, setSortBy] = useState<'loss' | 'date' | 'traffic'>('loss');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const currentWebsiteLinks = affiliateLinks.filter(
    l => !activeWebsite || l.websiteDomain === activeWebsite.domain || l.websiteId === activeWebsite.id
  );

  const allBrokenAndWarnings = currentWebsiteLinks.filter(l => l.status === 'broken' || l.status === 'warning');
  const brokenList = allBrokenAndWarnings.filter(l => l.status === 'broken');
  const warningList = allBrokenAndWarnings.filter(l => l.status === 'warning');
  const totalIssues = allBrokenAndWarnings.length;

  const totalMonthlyLoss = allBrokenAndWarnings.reduce(
    (acc, l) => acc + (l.revenueImpact?.estimatedMonthlyLoss || 0),
    0
  );

  const filteredIssues = allBrokenAndWarnings
    .filter(l => {
      if (issueFilter === 'critical') return l.revenueImpact?.priority === 'critical';
      if (issueFilter === 'broken') return l.status === 'broken';
      if (issueFilter === 'warning') return l.status === 'warning';
      return true;
    })
    .filter(l => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        l.articleTitle.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        (l.normalizedUrl && l.normalizedUrl.toLowerCase().includes(q)) ||
        (l.errorType && l.errorType.toLowerCase().includes(q)) ||
        (l.anchorText && l.anchorText.toLowerCase().includes(q)) ||
        (l.network && l.network.toLowerCase().includes(q)) ||
        (l.websiteDomain && l.websiteDomain.toLowerCase().includes(q)) ||
        (l.aiSuggestion?.title && l.aiSuggestion.title.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'loss') {
        return (b.revenueImpact?.estimatedMonthlyLoss || 0) - (a.revenueImpact?.estimatedMonthlyLoss || 0);
      }
      if (sortBy === 'traffic') {
        return (b.revenueImpact?.monthlyPageViews || 0) - (a.revenueImpact?.monthlyPageViews || 0);
      }
      return b.firstDetectedAt.localeCompare(a.firstDetectedAt);
    });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with Total Revenue at Risk */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-rose-200/90 shadow-card bg-gradient-to-r from-white via-rose-50/20 to-white">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <AlertOctagon className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-slate-900">Broken Links & Revenue Leaks</h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                  {activeWebsite?.domain || 'Active Domain'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {totalIssues === 0 ? (
              <>All <strong>{currentWebsiteLinks.length} links</strong> on <strong>{activeWebsite?.domain || 'this website'}</strong> are verified healthy with 0 broken issues.</>
            ) : (
              <>Fix problems on <strong>{activeWebsite?.domain || 'this website'}</strong> with 1-click Cloudflare 301 redirects, Wayback historical fallbacks, or manual remediation.</>
            )}
          </p>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <a
            href="/api/export/csv"
            download="linkguard-broken-links-audit.csv"
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs inline-flex items-center gap-1.5 transition-colors shadow-subtle"
            title="Download CSV Audit"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export CSV</span>
          </a>

          <div className="px-4 py-2 bg-slate-900 text-white rounded-xl text-center shadow-sm">
            <span className="text-[10px] uppercase font-bold text-rose-400 block">Est. Revenue Loss</span>
            <span className="text-base font-extrabold font-mono text-white">-${totalMonthlyLoss}/mo</span>
          </div>
          <div className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-rose-500 block">🔴 Broken</span>
            <span className="text-base font-extrabold font-tabular">{brokenList.length}</span>
          </div>
          <div className="px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-center">
            <span className="text-[10px] uppercase font-bold text-amber-500 block">🟠 Warnings</span>
            <span className="text-base font-extrabold font-tabular">{warningList.length}</span>
          </div>
        </div>
      </div>

      {/* Active Search Filter Banner if search query is active */}
      {searchQuery && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Searching for: <strong className="font-mono bg-amber-100 px-2 py-0.5 rounded text-amber-950">"{searchQuery}"</strong> ({filteredIssues.length} matching of {totalIssues} issues)
            </span>
          </div>
          {setSearchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 rounded-lg font-semibold text-amber-800 transition-colors inline-flex items-center gap-1 shadow-xs shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              Clear Search Filter
            </button>
          )}
        </div>
      )}

      {/* Quick Live Link / Page Auditor */}
      <QuickLinkAuditor compact={true} />

      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setIssueFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${issueFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            All Issues ({totalIssues})
          </button>
          <button
            onClick={() => setIssueFilter('critical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${issueFilter === 'critical' ? 'bg-rose-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            🔥 Critical Revenue Loss ({allBrokenAndWarnings.filter(l => l.revenueImpact?.priority === 'critical').length})
          </button>
          <button
            onClick={() => setIssueFilter('broken')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${issueFilter === 'broken' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            404/410/500 ({brokenList.length})
          </button>
          <button
            onClick={() => setIssueFilter('warning')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${issueFilter === 'warning' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            Out of Stock ({warningList.length})
          </button>
        </div>

        {/* Sort select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
          >
            <option value="loss">Highest Revenue Loss ($$$)</option>
            <option value="traffic">Monthly Traffic Volume</option>
            <option value="date">Detection Date</option>
          </select>
        </div>
      </div>

      {/* Issues Table or Clean State */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        {filteredIssues.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
                  <th className="py-3 px-5">Target Article</th>
                  <th className="py-3 px-5">Revenue Loss Risk</th>
                  <th className="py-3 px-5">Issue Type</th>
                  <th className="py-3 px-5">Recommended Action / Fallback</th>
                  <th className="py-3 px-5 text-right">Fix Engine Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredIssues.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-5">
                      <p className="font-bold text-slate-900 truncate max-w-sm">{link.articleTitle}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        Anchor: "{link.anchorText}" • Network: {link.network}
                      </p>

                      {/* Direct Broken URL Box with Open and 1-Click Copy */}
                      <div className="mt-2 flex items-center justify-between gap-2 bg-rose-50/90 border border-rose-200/90 rounded-xl p-2 max-w-md shadow-xs">
                        <div className="flex items-center gap-1.5 truncate min-w-0">
                          <ExternalLink className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-rose-800 text-[11px] font-bold hover:underline truncate"
                            title={link.url}
                          >
                            {link.url}
                          </a>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleCopyUrl(link.id, link.url)}
                            className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 shrink-0 inline-flex items-center gap-1 transition-colors shadow-2xs"
                            title="Copy exact broken URL"
                          >
                            {copiedId === link.id ? (
                              <>
                                <Check className="w-3 h-3 text-rose-600" />
                                <span className="text-rose-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3 text-slate-500" />
                                <span>Copy URL</span>
                              </>
                            )}
                          </button>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1 rounded-lg bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 shrink-0 inline-flex items-center transition-colors"
                            title="Open link in new tab"
                          >
                            <ExternalLink className="w-3 h-3 text-rose-600" />
                          </a>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 whitespace-nowrap">
                      <RevenueLossBadge impact={link.revenueImpact} size="md" showDetails />
                    </td>

                    <td className="py-4 px-5">
                      <span className={`inline-flex items-center gap-1 font-bold ${link.status === 'broken' ? 'text-rose-600' : 'text-amber-600'}`}>
                        {link.status === 'broken' ? <XCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                        <span>{link.errorType || 'HTTP Error'}</span>
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">HTTP {link.httpStatus}</p>
                    </td>

                    <td className="py-4 px-5">
                      {link.waybackSnapshot ? (
                        <div className="space-y-1 max-w-xs">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-1.5 py-0.2 rounded">
                              Wayback Archive Snapshot
                            </span>
                            <span className="text-[11px] font-semibold text-slate-800 truncate">{link.waybackSnapshot.snapshotDate}</span>
                          </div>
                          <button
                            onClick={() => applyWaybackFallback(link.id)}
                            className="text-[10px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <History className="w-2.5 h-2.5" /> Apply Archive Snapshot
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-[11px] font-medium block truncate max-w-xs">
                          {link.suggestedAction || 'Deploy 301 Edge Redirect'}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLinkForDetail(link)}
                          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Inspect telemetry"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

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
        ) : (
          /* EMPTY STATE WHEN FILTER/SEARCH MATCHES 0 OR WEBSITE HAS 0 ISSUES */
          <div className="p-12 text-center space-y-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto ${totalIssues === 0 ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-400'
              }`}>
              {totalIssues === 0 ? (
                <CheckCircle2 className="w-7 h-7" />
              ) : (
                <Search className="w-6 h-6" />
              )}
            </div>

            <div className="max-w-md mx-auto space-y-1">
              <h4 className="text-base font-bold text-slate-900">
                {totalIssues === 0
                  ? `🎉 0 Broken Links on ${activeWebsite?.domain || 'this website'}`
                  : searchQuery
                    ? `No broken links match "${searchQuery}"`
                    : 'No issues found for this filter'}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {totalIssues === 0
                  ? `All ${currentWebsiteLinks.length} links on ${activeWebsite?.domain || 'this website'} are 100% healthy, verified reachable with HTTP 200 OK, and earning commissions.`
                  : searchQuery
                    ? `Try searching for another keyword or clear the search filter.`
                    : 'All links in this category are healthy.'}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              {totalIssues === 0 ? (
                <Button
                  variant="rose"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={() => setActiveView('links')}
                >
                  View All {currentWebsiteLinks.length} Healthy Links
                </Button>
              ) : (
                searchQuery && (
                  <>
                    {setSearchQuery && (
                      <Button
                        variant="rose"
                        size="md"
                        leftIcon={<RotateCcw className="w-4 h-4" />}
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search Filter
                      </Button>
                    )}

                    {searchQuery.includes('.') && (
                      <Button
                        variant="secondary"
                        size="md"
                        leftIcon={<Sparkles className="w-4 h-4 text-rose-600" />}
                        onClick={async () => {
                          const domainToScan = searchQuery.trim();
                          setSearchQuery && setSearchQuery('');
                          await addWebsite(domainToScan);
                        }}
                      >
                        Add & Crawl "{searchQuery.trim()}"
                      </Button>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
