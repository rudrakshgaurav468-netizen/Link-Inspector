import React, { useState } from 'react';
import { 
  Globe, 
  Plus, 
  Play, 
  Settings, 
  Trash2, 
  ExternalLink, 
  FileText, 
  Link2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  Send,
  MoreVertical
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';

export const WebsitesTab: React.FC = () => {
  const { 
    websites, 
    activeWebsiteId, 
    setActiveWebsiteId, 
    startScan, 
    isScanning, 
    deleteWebsite, 
    setIsAddWebsiteModalOpen,
    setActiveView 
  } = useApp();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Monitored Websites ({websites.length})</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage websites crawled by LinkGuard. Daily sitemaps are parsed to index all active affiliate links.
          </p>
        </div>

        <Button
          variant="emerald"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => setIsAddWebsiteModalOpen(true)}
        >
          Add Website
        </Button>
      </div>

      {/* Website Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {websites.map((website) => {
          const isActive = website.id === activeWebsiteId;

          return (
            <div
              key={website.id}
              className={`bg-white rounded-2xl border p-6 shadow-card transition-all duration-200 flex flex-col justify-between relative ${
                isActive ? 'border-2 border-emerald-500 ring-4 ring-emerald-500/10' : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              {isActive && (
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Active Domain
                  </span>
                </div>
              )}

              <div>
                {/* Domain Header */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center shrink-0 shadow-subtle">
                    <Globe className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="min-w-0 pr-16">
                    <h3 className="text-base font-bold text-slate-900 truncate">{website.name}</h3>
                    <a
                      href={website.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-slate-500 hover:text-emerald-700 flex items-center gap-1 mt-0.5 truncate"
                    >
                      <span>{website.domain}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Metrics Breakdown */}
                <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-100 mb-5">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Articles</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{website.articlesCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Affiliate Links</span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 font-tabular">{website.linksCount}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Issues</span>
                    <p className={`text-sm font-bold mt-0.5 ${website.brokenCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {website.brokenCount + website.warningCount}
                    </p>
                  </div>
                </div>

                {/* Status & Schedule Details */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Status:</span>
                    <StatusBadge status={website.status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Sitemap URL:</span>
                    <span className="font-mono text-[11px] text-slate-700 truncate max-w-[200px]">{website.sitemapUrl}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Last Scanned:</span>
                    <span className="font-medium text-slate-800">{website.lastScannedAt}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Next Scheduled Scan:</span>
                    <span className="font-medium text-emerald-700">{website.nextScanAt}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isActive ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      setActiveWebsiteId(website.id);
                      setActiveView('dashboard');
                    }}
                  >
                    {isActive ? 'View Dashboard' : 'Select Domain'}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    isLoading={isScanning && isActive}
                    leftIcon={<Play className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setActiveWebsiteId(website.id);
                      startScan(website.id);
                    }}
                  >
                    Scan
                  </Button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteWebsite(website.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Remove website"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
