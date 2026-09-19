import React from 'react';
import { XCircle, CheckCircle2, AlertTriangle, ArrowDown } from 'lucide-react';

export const ProblemComparison: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            The Silent Revenue Killer
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your affiliate links can break without you noticing.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Amazon pages change ASINs. ClickBank hoplinks expire. Products go permanently out of stock. A publisher may not notice for weeks—silently leaking thousands in lost commissions.
          </p>
        </div>

        {/* Side by Side Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* WITHOUT LINKGUARD */}
          <div className="bg-white rounded-2xl p-8 border-2 border-rose-200/80 shadow-card flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-rose-500 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              Without LinkGuard
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Manual & Blind</h3>
                  <p className="text-xs text-slate-500">Unmonitored affiliate links</p>
                </div>
              </div>

              {/* Flow Steps */}
              <div className="space-y-4 relative pl-6 border-l-2 border-rose-100">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                  <p className="text-sm font-semibold text-slate-800">Affiliate link breaks or item goes out of stock</p>
                  <p className="text-xs text-slate-500 mt-0.5">Amazon delists ASIN or redirect target fails</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-400 ring-4 ring-rose-50" />
                  <p className="text-sm font-semibold text-slate-800">No alert or notification received</p>
                  <p className="text-xs text-slate-500 mt-0.5">You assume the article is still earning</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                  <p className="text-sm font-semibold text-rose-700">Visitors click dead 404 links</p>
                  <p className="text-xs text-slate-500 mt-0.5">High-intent buyer traffic is completely wasted</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-600 ring-4 ring-rose-50" />
                  <p className="text-sm font-bold text-rose-600">Lost commissions & zero earnings</p>
                  <p className="text-xs text-slate-500 mt-0.5">You only discover it months later when payouts drop</p>
                </div>
              </div>
            </div>
          </div>

          {/* WITH LINKGUARD */}
          <div className="bg-white rounded-2xl p-8 border-2 border-rose-500 shadow-elevated flex flex-col justify-between relative overflow-hidden ring-4 ring-rose-500/10">
            <div className="absolute top-0 right-0 bg-rose-600 text-white text-[11px] font-bold px-4 py-1 rounded-bl-xl uppercase tracking-wider">
              With LinkGuard
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Protected 24/7</h3>
                  <p className="text-xs text-rose-700 font-semibold">Autonomous affiliate link shield</p>
                </div>
              </div>

              {/* Flow Steps */}
              <div className="space-y-4 relative pl-6 border-l-2 border-rose-100">
                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                  <p className="text-sm font-semibold text-slate-800">Affiliate link breaks or item changes</p>
                  <p className="text-xs text-slate-500 mt-0.5">Daily 2:00 AM crawler checks status & availability</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                  <p className="text-sm font-semibold text-rose-700">Instant Telegram & Email alert sent</p>
                  <p className="text-xs text-slate-500 mt-0.5">Exact article name and replacement suggestion provided</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-500 ring-4 ring-rose-50" />
                  <p className="text-sm font-semibold text-slate-800">Fix link in 60 seconds</p>
                  <p className="text-xs text-slate-500 mt-0.5">Update URL and LinkGuard verifies it instantly</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-rose-600 ring-4 ring-rose-50" />
                  <p className="text-sm font-bold text-rose-700">Keep earning every single commission</p>
                  <p className="text-xs text-slate-500 mt-0.5">100% affiliate link uptime protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
