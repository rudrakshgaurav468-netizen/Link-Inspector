import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" variant="light" />
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Broken & expired affiliate link monitor. Protect every outbound affiliate link across your blog and niche sites. Never lose a commission.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>All crawlers and monitoring systems operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Product</h3>
            <ul className="space-y-2.5 text-sm">
              <li><button onClick={() => { setActiveView('landing'); document.getElementById('features')?.scrollIntoView(); }} className="hover:text-white transition-colors">Affiliate Link Scanner</button></li>
              <li><button onClick={() => { setActiveView('landing'); document.getElementById('how-it-works')?.scrollIntoView(); }} className="hover:text-white transition-colors">Sitemap Crawler</button></li>
              <li><button onClick={() => { setActiveView('landing'); document.getElementById('pricing')?.scrollIntoView(); }} className="hover:text-white transition-colors">Pricing & Plans</button></li>
              <li><button onClick={() => { setActiveView('dashboard'); }} className="hover:text-white transition-colors">Live Dashboard</button></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Integrations</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400">Amazon Associates</span></li>
              <li><span className="text-slate-400">ClickBank HopLinks</span></li>
              <li><span className="text-slate-400">ShareASale</span></li>
              <li><span className="text-slate-400">Impact Radius</span></li>
              <li><span className="text-slate-400">Telegram Alert Bot</span></li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">Trust & Security</h3>
            <ul className="space-y-2.5 text-sm">
              <li><span className="text-slate-400">Privacy Policy</span></li>
              <li><span className="text-slate-400">Terms of Service</span></li>
              <li><span className="text-slate-400">Security Practices</span></li>
              <li><span className="text-slate-400">Cookie Preferences</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} LinkGuard Technologies Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built for publishers, affiliate bloggers, and niche website owners.
          </p>
        </div>
      </div>
    </footer>
  );
};
