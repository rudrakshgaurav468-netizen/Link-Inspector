import React, { useState } from 'react';
import { 
  Bell, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Mail, 
  Wrench, 
  ExternalLink, 
  X, 
  CheckCheck,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { Alert } from '../../types';

export const AlertsTab: React.FC = () => {
  const { 
    alerts, 
    dismissAlert, 
    resolveAlert, 
    setFixingLink, 
    affiliateLinks, 
    openEmailPreview,
    setIsTelegramModalOpen,
    telegram 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'all' | 'broken' | 'warning' | 'system'>('all');

  const visibleAlerts = alerts.filter(a => {
    if (a.isDismissed) return false;
    if (activeTab === 'broken') return a.type === 'broken';
    if (activeTab === 'warning') return a.type === 'warning';
    if (activeTab === 'system') return a.type === 'system';
    return true;
  });

  const handleFixAlert = (alert: Alert) => {
    const link = affiliateLinks.find(l => l.id === alert.affiliateLinkId);
    if (link) {
      setFixingLink(link);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Alerts & Notification Feed</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700">
              {visibleAlerts.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time feed of Telegram push alerts and email dispatches triggered by status changes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5 text-sky-500" />}
            onClick={() => setIsTelegramModalOpen(true)}
          >
            {telegram.isConnected ? 'Telegram Connected ✓' : 'Connect Telegram'}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'all' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            All Alerts ({alerts.filter(a => !a.isDismissed).length})
          </button>
          <button
            onClick={() => setActiveTab('broken')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'broken' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-300" />
            Broken Links ({alerts.filter(a => a.type === 'broken' && !a.isDismissed).length})
          </button>
          <button
            onClick={() => setActiveTab('warning')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'warning' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-300" />
            Warnings ({alerts.filter(a => a.type === 'warning' && !a.isDismissed).length})
          </button>
        </div>

        <span className="text-xs text-slate-400 hidden sm:inline">
          State transition alert policy active
        </span>
      </div>

      {/* Alerts Feed List */}
      <div className="space-y-4">
        {visibleAlerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 shadow-card">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">You’re all caught up!</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No active alerts pending. We’ll notify you on Telegram as soon as any link status changes.
            </p>
          </div>
        ) : (
          visibleAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-2xl p-5 border shadow-card transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 relative ${
                alert.type === 'broken' ? 'border-rose-200/90' : 'border-amber-200/90'
              }`}
            >
              {/* Left Details */}
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  alert.type === 'broken' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {alert.type === 'broken' ? <AlertOctagon className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold uppercase tracking-wider ${alert.type === 'broken' ? 'text-rose-600' : 'text-amber-600'}`}>
                      {alert.type === 'broken' ? '🚨 Broken Affiliate Link' : '⚠️ Affiliate Warning'}
                    </span>
                    <span className="text-slate-400 text-xs">• {alert.detectedAt}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">{alert.articleTitle}</h3>

                  <div className="flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{alert.linkUrl}</span>
                    <span className="font-semibold text-rose-700">• {alert.issue}</span>
                  </div>

                  {/* Channel delivery indicators */}
                  <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Send className="w-3 h-3 text-sky-500" /> Telegram Sent
                    </span>
                    <button 
                      onClick={() => openEmailPreview(alert)}
                      className="flex items-center gap-1 text-purple-600 hover:underline font-semibold"
                    >
                      <Mail className="w-3 h-3" /> View HTML Email
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Dismiss
                </button>

                <a
                  href={alert.articleUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Article
                </a>

                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<Wrench className="w-3.5 h-3.5" />}
                  onClick={() => handleFixAlert(alert)}
                >
                  Fix Link
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
