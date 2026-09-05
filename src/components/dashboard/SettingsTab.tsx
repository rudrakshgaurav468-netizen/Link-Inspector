import React, { useState } from 'react';
import { 
  User, 
  Globe, 
  Clock, 
  Send, 
  Mail, 
  CreditCard, 
  ShieldCheck, 
  Sliders, 
  CheckCircle2, 
  Save,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const SettingsTab: React.FC = () => {
  const { user, updateUserSettings, telegram, activeWebsite, setIsTelegramModalOpen } = useApp();

  const [activeSection, setActiveSection] = useState<'monitoring' | 'notifications' | 'profile' | 'crawler'>('monitoring');

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Vance');
  const [email, setEmail] = useState(user?.email || 'alex@mytechblog.com');
  const [scanFrequency, setScanFrequency] = useState('daily');
  const [preferredScanTime, setPreferredScanTime] = useState('02:00');
  const [timeoutSec, setTimeoutSec] = useState('10');
  const [followRedirects, setFollowRedirects] = useState(true);
  const [availabilityDetection, setAvailabilityDetection] = useState(true);

  // Notification toggles
  const [telegramEnabled, setTelegramEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [notifyBroken, setNotifyBroken] = useState(true);
  const [notifyUnavailable, setNotifyUnavailable] = useState(true);
  const [notifyServerErrors, setNotifyServerErrors] = useState(true);
  const [notifyScanComplete, setNotifyScanComplete] = useState(false);

  const handleSave = () => {
    updateUserSettings({ name, email });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <h2 className="text-xl font-bold text-slate-900">Engine & Account Settings</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configure crawler concurrency, HTTP timeout limits, stock availability detection, and notification channels.
        </p>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200/80 pb-1">
        <button
          onClick={() => setActiveSection('monitoring')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSection === 'monitoring' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Monitoring & Crawler Engine
        </button>

        <button
          onClick={() => setActiveSection('notifications')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSection === 'notifications' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Notifications & Telegram
        </button>

        <button
          onClick={() => setActiveSection('profile')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeSection === 'profile' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Account Profile
        </button>
      </div>

      {/* MONITORING ENGINE SECTION */}
      {activeSection === 'monitoring' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Crawling & Health Check Configuration</h3>
            <p className="text-xs text-slate-500 mt-0.5">Control how LinkGuard inspects outbound affiliate URLs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Check Frequency</label>
              <select
                value={scanFrequency}
                onChange={(e) => setScanFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="daily">Daily Autonomous Scan (Recommended)</option>
                <option value="twice_daily">Twice Daily (Pro/Business)</option>
                <option value="weekly">Weekly Summary Scan</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Scan Time (UTC)</label>
              <input
                type="time"
                value={preferredScanTime}
                onChange={(e) => setPreferredScanTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">HTTP Request Timeout</label>
              <select
                value={timeoutSec}
                onChange={(e) => setTimeoutSec(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="5">5 seconds</option>
                <option value="10">10 seconds (Default)</option>
                <option value="15">15 seconds</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Affiliate Network Parsers</label>
              <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs text-slate-700 font-semibold flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Amazon, ClickBank, ShareASale, Impact, Rakuten active</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={followRedirects}
                onChange={(e) => setFollowRedirects(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Follow 301 / 302 Redirect Hops</span>
                <span className="text-[11px] text-slate-500 block">
                  Follows affiliate hoplinks to ensure the final landing page loads and is not redirected to a 404 or generic root domain.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={availabilityDetection}
                onChange={(e) => setAvailabilityDetection(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div>
                <span className="text-xs font-bold text-slate-800 block">Deep Product Availability & Out-of-Stock Detection</span>
                <span className="text-[11px] text-slate-500 block">
                  Flag products that return HTTP 200 OK but are marked "Currently unavailable" or "Sold Out" as Warnings.
                </span>
              </div>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="emerald" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
              Save Engine Settings
            </Button>
          </div>
        </div>
      )}

      {/* NOTIFICATIONS SECTION */}
      {activeSection === 'notifications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Alert Channels & Thresholds</h3>
            <p className="text-xs text-slate-500 mt-0.5">Control where and when you receive instant alerts.</p>
          </div>

          {/* Telegram status banner */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2AABEE] text-white flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Telegram Bot Notifications</h4>
                <p className="text-[11px] text-slate-500">
                  {telegram.isConnected ? `Connected to ${telegram.username}` : 'Not connected'}
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsTelegramModalOpen(true)}
            >
              {telegram.isConnected ? 'Manage Bot' : 'Connect Telegram'}
            </Button>
          </div>

          {/* Alert types checklist */}
          <div className="space-y-3 pt-2">
            <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Trigger alerts when:</p>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyBroken}
                onChange={(e) => setNotifyBroken(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Broken affiliate links detected (HTTP 404, 410, 500, timeouts)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyUnavailable}
                onChange={(e) => setNotifyUnavailable(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Product goes out of stock or becomes unavailable</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyServerErrors}
                onChange={(e) => setNotifyServerErrors(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Affiliate redirect targets fail with 502/503 server error</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyScanComplete}
                onChange={(e) => setNotifyScanComplete(e.target.checked)}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <span>Daily scan completes successfully (Summary digest)</span>
            </label>
          </div>

          <div className="pt-4 flex justify-end">
            <Button variant="emerald" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
              Save Notification Preferences
            </Button>
          </div>
        </div>
      )}

      {/* PROFILE SECTION */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">User Profile</h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage your publisher contact info.</p>
          </div>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-start">
            <Button variant="emerald" size="md" leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>
              Save Profile
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
