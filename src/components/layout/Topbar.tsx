import React, { useState } from 'react';
import {
  Search,
  Play,
  Send,
  Bell,
  Globe,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
  ExternalLink,
  ChevronDown,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';

export const Topbar: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ searchQuery, setSearchQuery }) => {
  const [showWebsiteDropdown, setShowWebsiteDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [quickScanUrl, setQuickScanUrl] = useState('');
  const [isQuickScanning, setIsQuickScanning] = useState(false);

  const {
    activeView,
    activeWebsite,
    activeWebsiteId,
    setActiveWebsiteId,
    websites,
    affiliateLinks,
    startScan,
    isScanning,
    alerts,
    unreadAlertsCount,
    telegram,
    setIsTelegramModalOpen,
    setIsAddWebsiteModalOpen,
    sendTelegramTestAlert,
    setActiveView,
    openEmailPreview,
    addWebsite,
    clearAllDemoData,
    backendStatus,
    backendHealth,
    refreshBackendConnection,
    addToast,
  } = useApp();

  const handleQuickScan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!quickScanUrl.trim()) return;
    const targetUrl = quickScanUrl.trim();
    setIsQuickScanning(true);
    setQuickScanUrl('');
    await addWebsite(targetUrl);
    setIsQuickScanning(false);
  };

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard': return { title: 'Affiliate Health Dashboard', sub: 'Real-time overview of monitored affiliate links & issues' };
      case 'websites': return { title: 'Websites & Crawlers', sub: 'Manage connected domains and sitemap scanning schedules' };
      case 'links': return { title: 'Monitored Affiliate Links', sub: 'Searchable database of all discovered outbound affiliate links' };
      case 'broken': return { title: 'Broken & Critical Issues', sub: 'Urgent revenue leaks, 404s, expired hops & out-of-stock items' };
      case 'competitors': return { title: 'Competitor Broken Link Spotter', sub: 'Scan competitors for dead affiliate links & outreach to acquire backlinks' };
      case 'alerts': return { title: 'Alerts & Webhook Feed', sub: 'Live log of Telegram, Slack, Discord, and email dispatches' };
      case 'scans': return { title: 'Scan History & Telemetry', sub: 'Audit logs of SPA JavaScript hydration & stealth proxy audits' };
      case 'settings': return { title: 'Account & Engine Settings', sub: 'Configure crawler concurrency, timeouts, and notification channels' };
      case 'billing': return { title: 'Subscription & Usage', sub: 'Manage tier limits, active websites, and payment methods' };
      default: return { title: 'Dashboard', sub: 'LinkGuard Affiliate Monitoring' };
    }
  };

  const pageInfo = getPageTitle();

  const currentWebsiteLinks = affiliateLinks.filter(
    l => !activeWebsite || l.websiteDomain === activeWebsite.domain || l.websiteId === activeWebsite.id
  );
  const activeIssuesCount = currentWebsiteLinks.filter(
    l => l.status === 'broken' || l.status === 'warning'
  ).length;

  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-subtle gap-4">
      {/* Left: Active Website Switcher & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Prominent Active Website Dropdown Switcher */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowWebsiteDropdown(!showWebsiteDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm border border-slate-800"
            title="Switch Active Website"
          >
            <span className="truncate max-w-[130px] sm:max-w-[160px]">{activeWebsite?.domain || 'Select Website'}</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 font-mono hidden sm:inline">
              {currentWebsiteLinks.length} links
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </button>

          {showWebsiteDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-elevated z-50 p-2 animate-slide-down">
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Monitored Website
              </div>
              <div className="space-y-1 mt-1 max-h-56 overflow-y-auto">
                {websites.map(w => {
                  const wLinks = affiliateLinks.filter(l => l.websiteDomain === w.domain || l.websiteId === w.id);
                  const wIssues = wLinks.filter(l => l.status === 'broken' || l.status === 'warning').length;
                  const isSelected = w.id === activeWebsiteId;

                  return (
                    <button
                      key={w.id}
                      onClick={() => {
                        setActiveWebsiteId(w.id);
                        setShowWebsiteDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all ${isSelected
                          ? 'bg-rose-50 text-rose-900 font-bold border border-rose-200'
                          : 'text-slate-700 hover:bg-slate-50'
                        }`}
                    >
                      <div className="flex items-center gap-2 truncate text-left">
                        <Globe className={`w-3.5 h-3.5 ${isSelected ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className="truncate">{w.domain}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono">{wLinks.length} links</span>
                        {wIssues > 0 ? (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            {wIssues}
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                            0
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-slate-100 my-1 pt-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowWebsiteDropdown(false);
                    setIsAddWebsiteModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 p-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  + Add & Crawl New Website
                </button>

                <button
                  onClick={() => {
                    setShowWebsiteDropdown(false);
                    clearAllDemoData();
                  }}
                  className="w-full flex items-center gap-2 p-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear All Demo Data
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Page Title & Status Badge */}
        <div className="hidden md:block truncate">
          <h1 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2 truncate">
            {pageInfo.title}
            {activeView === 'broken' && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeIssuesCount === 0 ? 'bg-rose-100 text-rose-800' : 'bg-rose-100 text-rose-700'
                }`}>
                {activeIssuesCount === 0 ? '0 Issues (Healthy)' : `${activeIssuesCount} Issues`}
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Quick URL Crawl Input */}
        <form onSubmit={handleQuickScan} className="hidden lg:flex items-center gap-1.5">
          <div className="relative w-56">
            <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Scan URL (e.g. in.bookmyshow.com)"
              value={quickScanUrl}
              onChange={(e) => setQuickScanUrl(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="sm"
            isLoading={isQuickScanning}
            className="text-xs shrink-0"
          >
            Scan URL
          </Button>
        </form>

        {/* Search Bar */}
        {(activeView === 'links' || activeView === 'broken' || activeView === 'dashboard') && (
          <div className="relative w-36 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter links..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>
        )}

        {/* Backend Engine Status Pill */}
        <button
          onClick={async () => {
            await refreshBackendConnection();
            addToast({
              title: backendStatus === 'connected' ? 'Backend Engine Connected ⚡' : 'Reconnecting to Backend...',
              description: backendStatus === 'connected' 
                ? `Active on http://localhost:3001 (${backendHealth?.crawlerMode || 'Anti-Block Stealth Crawler'})` 
                : 'Attempting to ping backend at http://localhost:3001/api/health',
              type: backendStatus === 'connected' ? 'success' : 'info',
            });
          }}
          className={`hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-all ${
            backendStatus === 'connected'
              ? 'bg-rose-50 text-rose-700 border-rose-200/80 hover:bg-rose-100/70'
              : backendStatus === 'connecting'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
          }`}
          title="Click to verify backend connection"
        >
          <span>{backendStatus === 'connected' ? 'API Engine (3001)' : backendStatus === 'connecting' ? 'Connecting...' : 'API Offline'}</span>
        </button>

        {/* Telegram Test Trigger */}
        <button
          onClick={() => telegram.isConnected ? sendTelegramTestAlert() : setIsTelegramModalOpen(true)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100 transition-colors text-xs font-semibold"
          title={telegram.isConnected ? "Send instant test Telegram alert" : "Connect Telegram Bot"}
        >
          <Send className="w-3.5 h-3.5 text-sky-500" />
          <span>{telegram.isConnected ? 'Test Alert' : 'Telegram'}</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-elevated z-50 p-3 animate-slide-down">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Recent Critical Alerts</span>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActiveView('alerts');
                  }}
                  className="text-[11px] text-rose-600 font-semibold hover:underline"
                >
                  View All Feed
                </button>
              </div>

              <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto my-1">
                {alerts.slice(0, 4).map(alert => (
                  <div key={alert.id} className="py-2 text-xs">
                    <p className="font-semibold text-slate-800 truncate">{alert.articleTitle}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5 truncate">{alert.issue}: {alert.linkUrl}</p>
                    <span className="text-[10px] text-rose-600 font-bold mt-1 block">-${alert.estimatedRevenueLoss || 120}/mo at risk</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global Instant Scan Trigger */}
        <Button
          variant="rose"
          size="sm"
          isLoading={isScanning || isQuickScanning}
          leftIcon={<Play className="w-3 h-3 fill-current" />}
          onClick={async () => {
            if (quickScanUrl.trim()) {
              await handleQuickScan();
            } else {
              startScan(activeWebsite?.id);
            }
          }}
          className="text-xs font-bold shrink-0"
        >
          {isScanning || isQuickScanning ? 'Scanning...' : 'Scan Now'}
        </Button>
      </div>
    </header>
  );
};
