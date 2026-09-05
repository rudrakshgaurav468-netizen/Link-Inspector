import React from 'react';
import { Send, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const TelegramAlertPreview: React.FC = () => {
  const { setIsTelegramModalOpen, setFixingLink, affiliateLinks } = useApp();
  const sampleBrokenLink = affiliateLinks.find(l => l.id === 'link_b1') || affiliateLinks[0];

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200">
              <Send className="w-3.5 h-3.5 text-sky-500" />
              <span>Instant Telegram Push Bot</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Actionable alerts right on your phone the second a link breaks.
            </h2>

            <p className="text-base text-slate-600 leading-relaxed">
              Don't wait for your monthly analytics audit to discover you've been driving thousands of clicks to dead 404 pages or out-of-stock items. LinkGuard pings you with exact details and one-tap fix buttons.
            </p>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-slate-700">
                  <strong className="text-slate-900 font-semibold">Zero Spam Guarantee:</strong> Only notifies on state transitions (Healthy → Broken or Out of Stock).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-slate-700">
                  <strong className="text-slate-900 font-semibold">One-Tap Action:</strong> Direct deep-links to your WordPress/Webflow post editor or Amazon catalog.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <p className="text-sm text-slate-700">
                  <strong className="text-slate-900 font-semibold">30-Second Setup:</strong> Just start @LinkGuardAlertsBot and enter your token.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                leftIcon={<Send className="w-4 h-4 text-sky-400" />}
                onClick={() => setIsTelegramModalOpen(true)}
              >
                Connect Telegram Alert Bot
              </Button>
            </div>
          </div>

          {/* Right Telegram Message Card */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-md bg-[#17212B] rounded-3xl p-5 shadow-2xl border border-slate-700 text-white relative">
              {/* Telegram App Header */}
              <div className="flex items-center gap-3 pb-3.5 border-b border-slate-700/60">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
                  LG
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    LinkGuard Bot
                    <span className="text-[10px] font-semibold bg-sky-500/30 text-sky-300 px-1.5 py-0.2 rounded">BOT</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">bot • official alerts</p>
                </div>
              </div>

              {/* Message Bubble */}
              <div className="mt-4 bg-[#242F3D] rounded-2xl rounded-tl-sm p-4 border border-slate-700/80 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    🚨 Broken affiliate link detected
                  </span>
                  <span className="text-[10px] text-slate-400">02:03 AM</span>
                </div>

                <div className="text-xs space-y-2 text-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Article:</span>
                    <strong className="text-white">“Top 5 Gaming Headphones in 2026”</strong>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Affiliate URL:</span>
                    <code className="text-sky-300 font-mono text-[11px] bg-slate-900/60 px-1.5 py-0.5 rounded">
                      amzn.to/392xyz-steelseries
                    </code>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Issue Detected:</span>
                    <span className="text-rose-400 font-semibold">404 Not Found (Amazon product delisted)</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Suggested Action:</span>
                    <span className="text-slate-300">Replace the affiliate link with the 2026 active revision ASIN.</span>
                  </div>
                </div>

                {/* Inline Action Buttons */}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFixingLink(sampleBrokenLink)}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Fix Link
                  </button>
                  <a
                    href="https://amazon.com"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-[#2b5278] hover:bg-[#32618e] text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Article
                  </a>
                </div>
              </div>

              {/* Timestamp footer */}
              <div className="mt-3 text-center">
                <span className="text-[10px] text-slate-500">Delivered instantly via LinkGuard Telegram Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
