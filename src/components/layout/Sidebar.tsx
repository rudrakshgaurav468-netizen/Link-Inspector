import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Globe, 
  Link2, 
  AlertOctagon, 
  Bell, 
  History, 
  Settings, 
  CreditCard, 
  ShieldCheck, 
  ChevronDown, 
  Plus, 
  Send, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  ExternalLink,
  LifeBuoy,
  Target,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ActiveView } from '../../types';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    websites, 
    activeWebsiteId, 
    setActiveWebsiteId, 
    activeWebsite, 
    alerts, 
    affiliateLinks,
    setIsAddWebsiteModalOpen,
    setIsTelegramModalOpen,
    telegram,
    user,
    setUser,
    clearAllDemoData
  } = useApp();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showWebsiteMenu, setShowWebsiteMenu] = useState(false);

  const currentLinks = affiliateLinks.filter(
    l => !activeWebsite || l.websiteDomain === activeWebsite.domain || l.websiteId === activeWebsite.id
  );
  const brokenLinksCount = currentLinks.filter(l => l.status === 'broken').length;
  const warningsCount = currentLinks.filter(l => l.status === 'warning').length;
  const unreadAlertsCount = alerts.filter(a => !a.isRead && !a.isDismissed).length;

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number; badgeVariant?: 'rose' | 'amber' | 'slate' | 'emerald' }[] = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'websites', label: 'Websites', icon: <Globe className="w-4 h-4" />, badge: websites.length, badgeVariant: 'slate' },
    { id: 'links', label: 'Affiliate Links', icon: <Link2 className="w-4 h-4" />, badge: currentLinks.length, badgeVariant: 'slate' },
    { id: 'broken', label: 'Broken Links', icon: <AlertOctagon className="w-4 h-4" />, badge: brokenLinksCount + warningsCount > 0 ? brokenLinksCount + warningsCount : undefined, badgeVariant: brokenLinksCount > 0 ? 'rose' : 'amber' },
    { id: 'competitors', label: 'Competitor Spotter', icon: <Target className="w-4 h-4 text-emerald-500" />, badge: 3, badgeVariant: 'emerald' },
    { id: 'alerts', label: 'Alerts Feed', icon: <Bell className="w-4 h-4" />, badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined, badgeVariant: 'rose' },
    { id: 'scans', label: 'Scan History', icon: <History className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'billing', label: 'Billing & Plan', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <aside className={`h-screen sticky top-0 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-all duration-300 z-30 shrink-0 select-none ${isCollapsed ? 'w-20' : 'w-64'}`}>
      {/* Top Header */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-100">
          <div 
            onClick={() => setActiveView('landing')}
            className={`flex items-center gap-3 cursor-pointer overflow-hidden ${isCollapsed ? 'justify-center w-full' : ''}`}
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center shadow-subtle shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-base font-bold tracking-tight text-slate-900 flex items-center gap-1">
                  Link<span className="text-emerald-600">Guard</span>
                </span>
                <span className="block text-[9px] font-bold text-slate-400 tracking-wider -mt-0.5 uppercase">Affiliate Shield</span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Website Selector Dropdown */}
        <div className="p-3 relative">
          {!isCollapsed ? (
            <div className="relative">
              <button
                onClick={() => setShowWebsiteMenu(!showWebsiteMenu)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{activeWebsite?.domain || 'Select Website'}</p>
                    <p className="text-[10px] text-slate-500 truncate">{activeWebsite?.linksCount || 0} links monitored</p>
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
              </button>

              {/* Website selection popup */}
              {showWebsiteMenu && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-elevated z-50 p-1.5 animate-slide-down">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Monitored Domains
                  </div>
                  {websites.map(w => (
                    <button
                      key={w.id}
                      onClick={() => {
                        setActiveWebsiteId(w.id);
                        setShowWebsiteMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-colors ${w.id === activeWebsiteId ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'}`}
                    >
                      <span className="truncate">{w.domain}</span>
                      <span className="text-[10px] text-slate-400">{w.linksCount} links</span>
                    </button>
                  ))}
                  <div className="border-t border-slate-100 my-1 pt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setShowWebsiteMenu(false);
                        setIsAddWebsiteModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-emerald-600 hover:bg-emerald-50 rounded-lg font-semibold transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add New Website
                    </button>

                    <button
                      onClick={() => {
                        setShowWebsiteMenu(false);
                        clearAllDemoData();
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg font-medium transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Clear Demo Data
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center">
              <button
                onClick={() => setIsCollapsed(false)}
                className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                title={activeWebsite?.domain}
              >
                <Globe className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation List */}
        <nav className="px-3 space-y-1 mt-1">
          {navItems.map(item => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive 
                    ? 'bg-slate-900 text-white shadow-sm font-semibold' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
              >
                <span className={isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-600'}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}

                {!isCollapsed && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive 
                      ? 'bg-slate-800 text-slate-200' 
                      : item.badgeVariant === 'rose'
                        ? 'bg-rose-100 text-rose-700'
                        : item.badgeVariant === 'amber'
                          ? 'bg-amber-100 text-amber-700'
                          : item.badgeVariant === 'emerald'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                  }`}>
                    {item.badge}
                  </span>
                )}

                {isCollapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        {/* Telegram Status Card */}
        {!isCollapsed ? (
          <div className="p-3 bg-gradient-to-br from-slate-900 to-slate-850 rounded-2xl text-white shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Send className="w-3 h-3 text-sky-400" />
                Telegram Alert Bot
              </span>
              <span className={`w-2 h-2 rounded-full ${telegram.isConnected ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-slate-500'}`} />
            </div>
            <p className="text-xs font-semibold text-slate-200 truncate">
              {telegram.isConnected ? telegram.username || 'Connected' : 'Not Connected'}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {telegram.isConnected ? 'Instant broken link alerts' : 'Receive instant push alerts'}
            </p>
            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="mt-2.5 w-full py-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
            >
              {telegram.isConnected ? 'Manage Bot' : 'Connect Telegram'}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsTelegramModalOpen(true)}
              className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center hover:bg-slate-800 relative"
              title="Telegram Notifications"
            >
              <Send className="w-4 h-4" />
              {telegram.isConnected && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
              )}
            </button>
          </div>
        )}

        {/* User Card */}
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100"}
                alt={user?.name || "User"}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Alex Vance'}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide bg-emerald-50 px-1.5 py-0.2 rounded">PRO</span>
                  <span className="text-[10px] text-slate-400">98.9% Health</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveView('landing')}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              title="Landing Page"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsCollapsed(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
