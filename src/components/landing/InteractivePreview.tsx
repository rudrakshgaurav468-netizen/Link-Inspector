import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Play,
  ExternalLink,
  Wrench,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HEALTH_HISTORY_7_DAYS } from '../../data/mockData';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';

export const InteractivePreview: React.FC = () => {
  const { setActiveView, affiliateLinks, setFixingLink, startScan, isScanning } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'issues'>('issues');

  const issuesList = affiliateLinks.filter(l => l.status === 'broken' || l.status === 'warning');

  return (
    <section id="product-preview" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Interactive Command Center
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            See exactly what’s happening in your affiliate links.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            LinkGuard surfaces broken ASINs, expired redirects, and stock changes in a crystal clear dashboard.
          </p>
        </div>

        {/* Realistic Dashboard Container */}
        <div className="bg-slate-900 rounded-3xl p-3 md:p-6 shadow-2xl border border-slate-800">
          {/* Dashboard Header Bar */}
          <div className="bg-slate-800/80 rounded-2xl p-4 md:p-6 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-700/60 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center font-bold text-xl">
                98.9%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white">Affiliate Link Health Score</h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    EXCELLENT
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  1,240 links monitored across 342 articles • Last scan: Today, 2:00 AM
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-slate-700 hover:bg-slate-600 text-white border-slate-600 text-xs"
                onClick={() => setActiveView('dashboard')}
              >
                Open Full App
              </Button>
              <Button
                variant="rose"
                size="sm"
                isLoading={isScanning}
                leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                onClick={() => startScan('web_1')}
              >
                {isScanning ? 'Scanning...' : 'Run Scan Now'}
              </Button>
            </div>
          </div>

          {/* Metric Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-5">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4 text-white">
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Total Monitored</p>
              <p className="text-2xl font-extrabold text-white mt-1 font-tabular">1,240</p>
              <p className="text-[11px] text-slate-400 mt-1">342 indexed articles</p>
            </div>

            <div className="bg-slate-800/60 border border-rose-500/30 rounded-2xl p-4 text-white">
              <p className="text-[11px] font-semibold text-rose-400 uppercase">Healthy Links</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1 font-tabular">1,228</p>
              <p className="text-[11px] text-rose-400/80 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 99.03% Uptime
              </p>
            </div>

            <div className="bg-slate-800/60 border border-rose-500/30 rounded-2xl p-4 text-white">
              <p className="text-[11px] font-semibold text-rose-400 uppercase">Broken Links</p>
              <p className="text-2xl font-extrabold text-rose-400 mt-1 font-tabular">7</p>
              <p className="text-[11px] text-rose-400/80 mt-1 flex items-center gap-1">
                <XCircle className="w-3 h-3" /> 404, 410, 502 Errors
              </p>
            </div>

            <div className="bg-slate-800/60 border border-amber-500/30 rounded-2xl p-4 text-white">
              <p className="text-[11px] font-semibold text-amber-400 uppercase">Warnings</p>
              <p className="text-2xl font-extrabold text-amber-400 mt-1 font-tabular">5</p>
              <p className="text-[11px] text-amber-400/80 mt-1 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Out of Stock / Unavail.
              </p>
            </div>
          </div>

          {/* Visual Health Trend Bar Chart */}
          <div className="bg-slate-800/50 border border-slate-700/60 rounded-2xl p-5 mb-5 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-rose-400" />
                  7-Day Link Health & Issue Velocity
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">Daily health checks recorded automatically at 2:00 AM UTC</p>
              </div>
              <span className="text-xs text-rose-400 font-mono font-semibold">98.9% Health</span>
            </div>

            {/* SVG Chart */}
            <div className="grid grid-cols-7 gap-2 pt-2">
              {HEALTH_HISTORY_7_DAYS.map((h, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-700/50 rounded-xl h-24 flex flex-col justify-end p-1 relative overflow-hidden group">
                    {/* Healthy bar portion */}
                    <div
                      className="w-full bg-rose-500 rounded-md transition-all duration-500 group-hover:bg-rose-400"
                      style={{ height: `${(h.healthy / 1250) * 85}%` }}
                    />
                    {/* Issue indicator */}
                    {h.broken > 0 && (
                      <div
                        className="w-full bg-rose-500 rounded-t-md mt-0.5"
                        style={{ height: `${Math.min(20, h.broken * 4)}%` }}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-slate-300 block">{h.day}</span>
                    <span className="text-[10px] text-slate-500 block">{h.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Issues Table Preview */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-card text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Critical Issues Requiring Attention ({issuesList.length})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Live sample dataset</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/70 text-slate-500 font-semibold border-b border-slate-200">
                    <th className="py-3 px-4">Article</th>
                    <th className="py-3 px-4">Affiliate URL</th>
                    <th className="py-3 px-4">Network</th>
                    <th className="py-3 px-4">Issue</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {issuesList.slice(0, 4).map((link) => (
                    <tr key={link.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <p className="font-bold text-slate-900 truncate max-w-xs">{link.articleTitle}</p>
                        <p className="text-[11px] text-slate-400 truncate">{link.anchorText}</p>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 truncate max-w-[180px]">
                        {link.url}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                          {link.network}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 font-semibold ${link.status === 'broken' ? 'text-rose-600' : 'text-amber-600'}`}>
                          {link.status === 'broken' ? <XCircle className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                          {link.errorType}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="danger"
                          size="sm"
                          leftIcon={<Wrench className="w-3 h-3" />}
                          onClick={() => setFixingLink(link)}
                        >
                          Fix Link
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button
                onClick={() => setActiveView('broken')}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 transition-colors inline-flex items-center gap-1"
              >
                View all 12 detected issues in dashboard <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
