import React from 'react';
import { ShieldCheck, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const FinalCta: React.FC = () => {
  const { setAuthModalMode, setIsAuthModalOpen } = useApp();

  return (
    <section className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Protect Every Outbound Link</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight">
          Stop discovering broken affiliate links after your commissions disappear.
        </h2>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Set up automatic sitemap scanning in under 3 minutes. Receive instant Telegram alerts the second a product goes out of stock or returns a 404 error.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            variant="emerald"
            size="lg"
            className="w-full sm:w-auto px-8 py-3.5 text-base"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            }}
          >
            Start Monitoring Free
          </Button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free 14-day trial
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1-click Telegram setup
          </span>
        </div>
      </div>
    </section>
  );
};
