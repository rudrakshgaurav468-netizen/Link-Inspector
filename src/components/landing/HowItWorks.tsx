import React from 'react';
import { Globe, FileCode2, Link2, CheckCircle, BellRing, ArrowRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const HowItWorks: React.FC = () => {
  const { setAuthModalMode, setIsAuthModalOpen } = useApp();

  const steps = [
    {
      num: '01',
      title: 'Add your website',
      desc: 'Enter your website URL and LinkGuard discovers your content and sitemap index in seconds.',
      icon: <Globe className="w-6 h-6 text-rose-600" />,
    },
    {
      num: '02',
      title: 'Scan your sitemap',
      desc: 'LinkGuard reads your sitemap.xml and discovers all published articles automatically.',
      icon: <FileCode2 className="w-6 h-6 text-rose-600" />,
    },
    {
      num: '03',
      title: 'Find affiliate links',
      desc: 'Outbound affiliate links (Amazon, ClickBank, ShareASale, Impact) are extracted and saved.',
      icon: <Link2 className="w-6 h-6 text-rose-600" />,
    },
    {
      num: '04',
      title: 'Check links every day',
      desc: 'LinkGuard runs autonomous background health checks at 2:00 AM for HTTP status & stock availability.',
      icon: <CheckCircle className="w-6 h-6 text-rose-600" />,
    },
    {
      num: '05',
      title: 'Get alerted',
      desc: 'If something breaks or goes out of stock, you receive an actionable Telegram or email push alert.',
      icon: <BellRing className="w-6 h-6 text-rose-600" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Automated Architecture
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How LinkGuard Protects Your Commissions
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            A 5-step automated lifecycle that keeps your affiliate revenue running smoothly without any manual spreadsheets.
          </p>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white rounded-2xl p-6 border border-slate-200/80 hover:border-rose-300 hover:shadow-elevated transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-slate-300 font-mono group-hover:text-rose-500 transition-colors">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-rose-200 group-hover:bg-rose-50/50 flex items-center justify-center transition-all shadow-subtle">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                  <ArrowRight className="w-5 h-5 text-slate-300" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA bar */}
        <div className="mt-14 p-6 bg-slate-900 rounded-2xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-white">Ready to automate your affiliate link health?</h4>
            <p className="text-xs text-slate-400 mt-0.5">Start monitoring in under 3 minutes with zero code or plugins required.</p>
          </div>
          <Button
            variant="rose"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            }}
          >
            Start Free Monitoring
          </Button>
        </div>
      </div>
    </section>
  );
};
