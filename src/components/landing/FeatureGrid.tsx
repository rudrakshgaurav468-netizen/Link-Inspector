import React from 'react';
import {
  Globe2,
  Link2,
  Clock,
  AlertOctagon,
  PackageX,
  Send,
  Mail,
  LayoutDashboard,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: <Globe2 className="w-5 h-5 text-rose-600" />,
      title: 'Automatic Website Scanning',
      description: 'Discover articles automatically through standard sitemap.xml or custom multi-level sitemap indexes without slowing down your site.',
      tag: 'Crawl Engine',
    },
    {
      icon: <Link2 className="w-5 h-5 text-rose-600" />,
      title: 'Affiliate Link Detection',
      description: 'Intelligently identifies outbound affiliate links from Amazon Associates, ClickBank, ShareASale, Impact, CJ, Rakuten, and custom affiliate redirects.',
      tag: 'Pattern Matching',
    },
    {
      icon: <Clock className="w-5 h-5 text-rose-600" />,
      title: 'Daily Link Monitoring',
      description: 'Autonomous background jobs run every night at 2:00 AM to verify uptime and response codes across your entire affiliate link inventory.',
      tag: '24/7 Shield',
    },
    {
      icon: <AlertOctagon className="w-5 h-5 text-rose-600" />,
      title: 'Broken Link Detection',
      description: 'Catch 404 Not Found, 410 Gone, redirect loops, connection timeouts (10s limit), and 500/502 server errors immediately.',
      tag: 'HTTP Health',
    },
    {
      icon: <PackageX className="w-5 h-5 text-amber-600" />,
      title: 'Product Availability Detection',
      description: 'Detect pages that return HTTP 200 OK but display "Currently unavailable", "Out of stock", or unverified 3rd-party sellers.',
      tag: 'Deep Inspection',
    },
    {
      icon: <Send className="w-5 h-5 text-sky-600" />,
      title: 'Instant Telegram Alerts',
      description: 'Receive rich actionable Telegram notifications with exact article URL, broken destination, and a one-click button to fix the link.',
      tag: 'Push Alerts',
    },
    {
      icon: <Mail className="w-5 h-5 text-purple-600" />,
      title: 'Email Alert Digest',
      description: 'Send high-priority alerts and daily summary digests directly to your editorial team or content managers.',
      tag: 'Notifications',
    },
    {
      icon: <LayoutDashboard className="w-5 h-5 text-indigo-600" />,
      title: 'Affiliate Health Dashboard',
      description: 'View 98.9% overall health score, 7-day trend charts, 3-day HTTP response history, and resolved status logs in one command center.',
      tag: 'Command Center',
    },
  ];

  return (
    <section id="features" className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Engine Capabilities
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineered specifically for affiliate revenue protection.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            Generic dead link checkers only check HTTP 200 codes. LinkGuard understands affiliate networks, redirects, and out-of-stock listings.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:shadow-elevated hover:border-slate-300 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-subtle">
                    {feature.icon}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{feature.description}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-rose-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
                <span>Active in all plans</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
