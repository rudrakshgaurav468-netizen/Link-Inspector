import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Wrench, 
  ExternalLink,
  Sparkles,
  Zap,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { QuickLinkAuditor } from '../dashboard/QuickLinkAuditor';

export const HeroSection: React.FC = () => {
  const { setActiveView, setAuthModalMode, setIsAuthModalOpen, affiliateLinks, setFixingLink } = useApp();

  const brokenSampleLink = affiliateLinks.find(l => l.id === 'link_b1') || affiliateLinks[0];

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-100/70 via-slate-50 to-white">
      {/* Background glowing blur orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[360px] bg-emerald-400/10 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-60 right-10 w-[400px] h-[300px] bg-sky-400/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Eyebrow Tag */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-subtle text-emerald-800 text-xs font-semibold animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-700">New: 2026 Amazon ASIN & Stock Availability Engine</span>
            <ArrowRight className="w-3.5 h-3.5 text-emerald-600 ml-0.5" />
          </div>
        </div>

        {/* Main Hero Headline & Copy */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Never lose a commission to a{' '}
            <span className="relative inline-block text-rose-600 decoration-rose-300">
              broken affiliate link.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            LinkGuard automatically scans your website, finds affiliate links, checks them every day, and alerts you the moment something breaks or goes out of stock.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              variant="emerald"
              size="lg"
              className="w-full sm:w-auto text-base px-7 py-3"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                setAuthModalMode('signup');
                setIsAuthModalOpen(true);
              }}
            >
              Start Monitoring Free
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto text-base px-6 py-3"
              onClick={() => {
                const el = document.getElementById('how-it-works');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </Button>
          </div>

          <p className="mt-3.5 text-xs text-slate-400 font-medium mb-8">
            No credit card required • 3-minute sitemap setup • Instant Telegram alerts
          </p>

          {/* Quick Real Link Auditor Box */}
          <div className="max-w-3xl mx-auto text-left shadow-xl rounded-2xl overflow-hidden border border-slate-200">
            <QuickLinkAuditor compact={true} />
          </div>
        </div>

        {/* High-Fidelity Hero Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto mt-6">
          {/* Mock Browser Frame */}
          <div className="bg-slate-900/90 rounded-2xl p-2.5 shadow-2xl border border-slate-800 backdrop-blur-xl">
            {/* Top window controls */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800/80 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <div className="px-3 py-1 rounded-lg bg-slate-800 text-[11px] font-mono text-slate-300 flex items-center gap-2 border border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>https://app.linkguard.io/dashboard</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Engine
              </div>
            </div>

            {/* Dashboard Inner Screen */}
            <div className="bg-[#F8FAFC] rounded-xl p-5 md:p-6 text-slate-900">
              {/* Header metrics bar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Active Domain</span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Monitored</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">mytechblog.com</h3>
                </div>

                {/* Stat pills */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-subtle">
                    <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Links</p>
                    <p className="text-xl font-bold text-slate-900 mt-0.5 font-tabular">1,240</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-emerald-200 shadow-subtle">
                    <p className="text-[11px] font-semibold text-emerald-600 uppercase">Healthy</p>
                    <p className="text-xl font-bold text-emerald-600 mt-0.5 font-tabular">1,228</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 border border-rose-200 shadow-subtle">
                    <p className="text-[11px] font-semibold text-rose-600 uppercase">Issues</p>
                    <p className="text-xl font-bold text-rose-600 mt-0.5 font-tabular">12</p>
                  </div>
                </div>
              </div>

              {/* Highlighted Critical Alert Card */}
              <div className="mt-5 bg-white rounded-2xl border-2 border-rose-500/30 p-4 md:p-5 shadow-elevated relative overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-rose-500" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xl">🚨</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          Broken Affiliate Link Detected
                        </span>
                        <span className="text-xs text-slate-400">2 min ago</span>
                      </div>
                      <h4 className="text-sm md:text-base font-bold text-slate-900 mt-1">
                        Article: Top 5 Gaming Headphones in 2026
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">amzn.to/392xyz-steelseries</span>
                        <span className="text-rose-600 font-semibold">• Issue: 404 Product Unavailable</span>
                      </p>
                    </div>
                  </div>

                  {/* Fix Link Action */}
                  <div className="flex items-center gap-2.5 sm:self-center shrink-0">
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<Wrench className="w-3.5 h-3.5" />}
                      onClick={() => setFixingLink(brokenSampleLink)}
                    >
                      Fix Link Now
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setActiveView('dashboard')}
                    >
                      View Live App
                    </Button>
                  </div>
                </div>
              </div>

              {/* Telegram Preview Floating Pill */}
              <div className="mt-4 flex items-center justify-between px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <Send className="w-4 h-4 text-sky-400" />
                  <span>
                    <strong className="text-sky-300">Telegram Alert:</strong> "🚨 Broken link detected on Top 5 Gaming Headphones (404 Not Found)"
                  </span>
                </div>
                <span className="text-slate-400 hidden sm:inline">Sent to @alexvance_tech</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
