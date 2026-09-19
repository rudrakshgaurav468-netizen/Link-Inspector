import React from 'react';
import { CreditCard, Check, Sparkles, ArrowRight, ShieldCheck, Download, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const BillingTab: React.FC = () => {
  const { user, updateUserSettings, addToast, websites, affiliateLinks } = useApp();

  const totalLinks = affiliateLinks.length;
  const currentPlan = user?.plan || 'pro';

  const handleUpgrade = (plan: 'free' | 'pro' | 'business') => {
    updateUserSettings({ plan });
    addToast({
      title: `Plan Updated to ${plan.toUpperCase()}`,
      description: 'Your account limits have been adjusted immediately.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">Subscription & Usage</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold uppercase bg-rose-100 text-rose-800">
              {currentPlan} Plan
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your LinkGuard monitoring tier, quota limits, and billing details.
          </p>
        </div>
      </div>

      {/* Quota Usage Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Affiliate Links Monitored</span>
            <span className="text-xs font-bold font-mono text-rose-700">
              {totalLinks} / {currentPlan === 'free' ? '100' : currentPlan === 'pro' ? '5,000' : '50,000'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (totalLinks / (currentPlan === 'free' ? 100 : currentPlan === 'pro' ? 5000 : 50000)) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {currentPlan === 'pro' ? '3,760 additional link slots remaining in your plan.' : 'Upgrade to monitor more links.'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Monitored Domains</span>
            <span className="text-xs font-bold font-mono text-rose-700">
              {websites.length} / {currentPlan === 'free' ? '1' : currentPlan === 'pro' ? '5' : '25'}
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-rose-500 h-full rounded-full"
              style={{ width: `${Math.min(100, (websites.length / (currentPlan === 'free' ? 1 : currentPlan === 'pro' ? 5 : 25)) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {currentPlan === 'pro' ? `${5 - websites.length} domain slots available.` : 'Connect more domains by upgrading.'}
          </p>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* FREE */}
        <div className={`bg-white p-6 rounded-2xl border flex flex-col justify-between ${currentPlan === 'free' ? 'border-2 border-slate-900 shadow-elevated' : 'border-slate-200'}`}>
          <div>
            <h3 className="text-sm font-bold text-slate-900">FREE</h3>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">$0<span className="text-xs font-normal text-slate-500">/mo</span></p>
            <p className="text-xs text-slate-500 mt-1">1 website • 100 links</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Daily monitoring</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Email alerts</li>
            </ul>
          </div>
          <div className="mt-6">
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={currentPlan === 'free'}
              onClick={() => handleUpgrade('free')}
            >
              {currentPlan === 'free' ? 'Current Plan' : 'Downgrade to Free'}
            </Button>
          </div>
        </div>

        {/* PRO */}
        <div className={`bg-white p-6 rounded-2xl border flex flex-col justify-between relative ${currentPlan === 'pro' ? 'border-2 border-rose-500 shadow-elevated ring-4 ring-rose-500/10' : 'border-slate-200'}`}>
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[10px] font-bold py-0.5 px-3 rounded-full uppercase">
            Most Popular
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">PRO</h3>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">$9<span className="text-xs font-normal text-slate-500">/mo</span></p>
            <p className="text-xs text-slate-500 mt-1">5 websites • 5,000 links</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Instant Telegram alerts</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Out-of-stock availability engine</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> 30-day health history</li>
            </ul>
          </div>
          <div className="mt-6">
            <Button
              variant="rose"
              size="sm"
              className="w-full"
              disabled={currentPlan === 'pro'}
              onClick={() => handleUpgrade('pro')}
            >
              {currentPlan === 'pro' ? 'Current Plan' : 'Switch to Pro'}
            </Button>
          </div>
        </div>

        {/* BUSINESS */}
        <div className={`bg-white p-6 rounded-2xl border flex flex-col justify-between ${currentPlan === 'business' ? 'border-2 border-slate-900 shadow-elevated' : 'border-slate-200'}`}>
          <div>
            <h3 className="text-sm font-bold text-slate-900">BUSINESS</h3>
            <p className="text-2xl font-extrabold text-slate-900 mt-2">$29<span className="text-xs font-normal text-slate-500">/mo</span></p>
            <p className="text-xs text-slate-500 mt-1">25 websites • 50,000 links</p>
            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Priority twice-daily scans</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> Webhook integration</li>
              <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-rose-600" /> 24/7 dedicated support</li>
            </ul>
          </div>
          <div className="mt-6">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              disabled={currentPlan === 'business'}
              onClick={() => handleUpgrade('business')}
            >
              {currentPlan === 'business' ? 'Current Plan' : 'Upgrade to Business'}
            </Button>
          </div>
        </div>
      </div>

      {/* Payment Method & Invoices */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card space-y-4">
        <h3 className="text-sm font-bold text-slate-900">Payment Method & Invoices</h3>
        <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-slate-700" />
            <div>
              <span className="font-bold text-slate-900">Visa ending in •••• 4242</span>
              <p className="text-slate-500 text-[11px]">Expires 08/2028 • Next renewal: October 3, 2026</p>
            </div>
          </div>
          <span className="text-rose-700 font-semibold bg-rose-100 px-2 py-0.5 rounded-full text-[10px]">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};
