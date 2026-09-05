import React, { useState } from 'react';
import {
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wrench,
  Eye,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Download
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { AffiliateLink, AffiliateNetwork, LinkStatus } from '../../types';
import { getNetworkBadgeColor } from '../../utils/affiliateDetector';

export const AffiliateLinksTab: React.FC<{ searchQuery?: string; setSearchQuery?: (q: string) => void }> = ({
  searchQuery = '',
  setSearchQuery
}) => {
  const {
    affiliateLinks,
    activeWebsite,
    setSelectedLinkForDetail,
    setFixingLink,
    checkLinkNow
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'healthy' | 'broken' | 'warning'>('all');
  const [networkFilter, setNetworkFilter] = useState<string>('all');
  const [checkingLinkId, setCheckingLinkId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter links by active website first
  const currentWebsiteLinks = affiliateLinks.filter(
    l => !activeWebsite || l.websiteDomain === activeWebsite.domain || l.websiteId === activeWebsite.id
  );

  // Filter links
  const filteredLinks = currentWebsiteLinks.filter((link) => {
    // Status filter
    if (statusFilter !== 'all' && link.status !== statusFilter) return false;

    // Network filter
    if (networkFilter !== 'all' && link.network !== networkFilter) return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        link.articleTitle.toLowerCase().includes(q) ||
        link.url.toLowerCase().includes(q) ||
        link.network.toLowerCase().includes(q) ||
        link.anchorText.toLowerCase().includes(q)
      );
    }

    return true;
  });

  const totalPages = Math.ceil(filteredLinks.length / pageSize) || 1;
  const paginatedLinks = filteredLinks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCheckLink = async (linkId: string) => {
    setCheckingLinkId(linkId);
    await checkLinkNow(linkId);
    setCheckingLinkId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Affiliate Links Inventory</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Indexed outbound affiliate links from crawled articles. Monitored for 404s, redirect loops & stock availability.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search article, URL, ASIN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Filter Tabs & Network Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-subtle">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${statusFilter === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            All Links ({currentWebsiteLinks.length})
          </button>
          <button
            onClick={() => { setStatusFilter('healthy'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${statusFilter === 'healthy' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300" />
            Healthy ({currentWebsiteLinks.filter(l => l.status === 'healthy').length})
          </button>
          <button
            onClick={() => { setStatusFilter('broken'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${statusFilter === 'broken' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-300" />
            Broken ({currentWebsiteLinks.filter(l => l.status === 'broken').length})
          </button>
          <button
            onClick={() => { setStatusFilter('warning'); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${statusFilter === 'warning' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-300" />
            Warnings ({currentWebsiteLinks.filter(l => l.status === 'warning').length})
          </button>
        </div>

        {/* Affiliate Network Select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Network:</span>
          <select
            value={networkFilter}
            onChange={(e) => { setNetworkFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            <option value="all">All Networks</option>
            <option value="Amazon Associates">Amazon Associates</option>
            <option value="ClickBank">ClickBank</option>
            <option value="ShareASale">ShareASale</option>
            <option value="Impact">Impact Radius</option>
            <option value="Rakuten">Rakuten</option>
            <option value="Custom / Direct">Custom / Direct</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200/80">
                <th className="py-3 px-5">Article & Anchor Text</th>
                <th className="py-3 px-5">Affiliate URL</th>
                <th className="py-3 px-5">Network</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">HTTP Code</th>
                <th className="py-3 px-5">Last Checked</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedLinks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No affiliate links match your active filters.
                  </td>
                </tr>
              ) : (
                paginatedLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-bold text-slate-900 truncate max-w-xs">{link.articleTitle}</p>
                      <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <span className="text-slate-400">Anchor:</span> "{link.anchorText}"
                      </p>
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-600 truncate max-w-[200px]">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] text-slate-700">
                        {link.url}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getNetworkBadgeColor(link.network)}`}>
                        {link.network}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <StatusBadge status={link.status} size="sm" />
                    </td>

                    <td className="py-3.5 px-5">
                      <span className={`font-mono font-semibold px-2 py-0.5 rounded text-[11px] ${link.httpStatus === 200
                          ? 'bg-emerald-50 text-emerald-700'
                          : link.httpStatus === 404 || link.httpStatus === 410 || link.httpStatus >= 500
                            ? 'bg-rose-50 text-rose-700 font-bold'
                            : 'bg-amber-50 text-amber-700'
                        }`}>
                        {link.httpStatus === 0 ? 'Timeout' : `${link.httpStatus} ${link.httpStatus === 200 ? 'OK' : ''}`}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-500 whitespace-nowrap">
                      {link.lastCheckedAt}
                    </td>

                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedLinkForDetail(link)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                          title="View link detail & HTTP history"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleCheckLink(link.id)}
                          disabled={checkingLinkId === link.id}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Check link right now"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${checkingLinkId === link.id ? 'animate-spin text-emerald-600' : ''}`} />
                        </button>

                        {(link.status === 'broken' || link.status === 'warning') && (
                          <Button
                            variant="danger"
                            size="sm"
                            leftIcon={<Wrench className="w-3 h-3" />}
                            onClick={() => setFixingLink(link)}
                          >
                            Fix
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <span>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to <strong>{Math.min(currentPage * pageSize, filteredLinks.length)}</strong> of <strong>{filteredLinks.length}</strong> links
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-800">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 border border-slate-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed text-slate-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
