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
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { crawlWebsiteLive } from '../../services/liveCrawler';
import { AffiliateLink } from '../../types';

export const QuickLinkAuditor: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { addWebsite, clearAllDemoData, setActiveView, setActiveWebsiteId } = useApp();
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [auditResults, setAuditResults] = useState<{
    pageTitle: string;
    url: string;
    domain: string;
    links: AffiliateLink[];
    stats: {
      total: number;
      healthy: number;
      broken: number;
      warning: number;
    };
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'broken' | 'healthy'>('all');

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    const targetUrl = urlInput.trim();
    setIsLoading(true);
    setProgressMsg('Connecting to website...');
    setAuditResults(null);

    try {
      const res = await crawlWebsiteLive(targetUrl, (progress, message) => {
        setProgressMsg(message);
      });

      setAuditResults({
        pageTitle: res.website.name || targetUrl,
        url: res.website.url,
        domain: res.website.domain,
        links: res.links,
        stats: {
          total: res.stats.totalLinks,
          healthy: res.stats.healthyCount,
          broken: res.stats.brokenCount,
          warning: res.stats.warningCount,
        }
      });
    } catch (err: any) {
      setProgressMsg('Scan failed: ' + (err.message || 'Check URL'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToDashboard = async () => {
    if (!urlInput.trim()) return;
    await addWebsite(urlInput.trim());
    setActiveView('broken');
  };

  const displayedLinks = (auditResults?.links || []).filter(l => {
    if (filterMode === 'broken') return l.status === 'broken';
    if (filterMode === 'healthy') return l.status === 'healthy';
    return true;
  });

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden ${compact ? 'p-4' : 'p-6'}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-slate-900">Live Page & Link Auditor</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              100% Real Live Check
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Paste any webpage or post URL to extract its actual links and verify if they are alive (200 OK) or broken (404).
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

      {/* Input Box */}
      <form onSubmit={handleScan} className="flex flex-col sm:flex-row items-stretch gap-2.5">
        <div className="relative flex-1">
          <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste any URL (e.g., https://example.com/blog/my-post or your site)..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-inner"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading || !urlInput.trim()}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Scanning...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Audit Links Now</span>
            </>
          )}
        </button>
      </form>

      {/* Loading status */}
      {isLoading && (
        <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl flex items-center gap-3 animate-fade-in">
          <Loader2 className="w-4 h-4 text-emerald-600 animate-spin shrink-0" />
          <p className="text-xs font-mono text-emerald-800">{progressMsg}</p>
        </div>
      )}

      {/* Results View */}
      {auditResults && (
        <div className="mt-5 pt-5 border-t border-slate-100 animate-fade-in">
          {/* Summary Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl mb-4">
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
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{auditResults.url}</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  {auditResults.stats.healthy} Healthy
                </span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${auditResults.stats.broken > 0 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'}`}>
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

          {/* Filters */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1 text-xs">
              <button
                onClick={() => setFilterMode('all')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterMode === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                All ({auditResults.links.length})
              </button>
              <button
                onClick={() => setFilterMode('broken')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterMode === 'broken' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Broken ({auditResults.stats.broken})
              </button>
              <button
                onClick={() => setFilterMode('healthy')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${filterMode === 'healthy' ? 'bg-emerald-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                Healthy ({auditResults.stats.healthy})
              </button>
            </div>
          </div>

          {/* Links Table / List */}
          {displayedLinks.length === 0 ? (
            <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-slate-800">
                {filterMode === 'broken' 
                  ? '🎉 No broken links found on this page! Everything is 100% working.' 
                  : 'No links match this filter.'}
              </p>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
              {displayedLinks.map((link) => (
                <div
                  key={link.id}
                  className="pt-2 first:pt-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${link.status === 'broken' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {link.status === 'broken' ? '404 Broken' : '200 OK'}
                      </span>
                      <span className="font-bold text-slate-900 truncate max-w-xs sm:max-w-sm">
                        {link.anchorText || 'Direct Link'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 font-mono truncate mt-0.5">{link.url}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
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
                      title="Open destination link to verify"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors"
                    >
                      <span>Verify</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
