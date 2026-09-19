import React, { useState } from 'react';
import { Check, Sparkles, Zap, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const PricingSection: React.FC = () => {
  const { setAuthModalMode, setIsAuthModalOpen, user, updateUserSettings, addToast } = useApp();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const handleSelectPlan = (planName: 'free' | 'pro' | 'business') => {
    if (!user) {
      setAuthModalMode('signup');
      setIsAuthModalOpen(true);
      return;
    }

    updateUserSettings({ plan: planName });
    addToast({
      title: `Subscribed to ${planName.toUpperCase()} Plan! 🎉`,
      description: `Your website limit and monitoring link quota have been upgraded.`,
      type: 'success',
    });
  };

  const plans = [
    {
      id: 'free',
      name: 'FREE',
      price: '$0',
      period: '/month',
      description: 'For hobby bloggers testing link health and small sites.',
      popular: false,
      features: [
        '1 website',
        '100 affiliate links',
        'Daily monitoring (2:00 AM)',
        'Basic monitoring dashboard',
        'Email alerts',
        'Standard HTTP error checks',
      ],
      cta: 'Start Free',
      variant: 'secondary' as const,
    },
    {
      id: 'pro',
      name: 'PRO',
      price: billingCycle === 'monthly' ? '$9' : '$7',
      period: '/month',
      description: 'For serious affiliate marketers, niche sites, and creators.',
      popular: true,
      badge: 'Most Popular',
      features: [
        '5 websites',
        '5,000 affiliate links',
        'Daily autonomous monitoring',
        'Instant Telegram alerts bot',
        'Priority email notifications',
        'Broken link detection (404, 410, 500)',
        'Product availability detection (Out of Stock)',
        '30-day link check history timeline',
        'One-click fix link & instant re-verification',
      ],
      cta: 'Start Monitoring',
      variant: 'rose' as const,
    },
    {
      id: 'business',
      name: 'BUSINESS',
      price: billingCycle === 'monthly' ? '$29' : '$24',
      period: '/month',
      description: 'For publishers, media networks, and affiliate agencies.',
      popular: false,
      features: [
        '25 websites',
        '50,000 affiliate links',
        'Priority & 2x daily monitoring',
        'Telegram + Email + Webhook alerts',
        'Advanced health velocity reporting',
        '90-day comprehensive audit history',
        'Multiple websites & team collaboration',
        'Custom affiliate domain pattern matching',
        'Priority 24/7 dedicated support',
      ],
      cta: 'Get Started',
      variant: 'primary' as const,
    },
  ];

  return (
    <section id="pricing" className="py-20 md:py-28 bg-slate-50/70 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            Simple, Transparent Pricing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Protect thousands in commissions for the price of two coffees.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600">
            One single saved Amazon affiliate commission pays for an entire year of LinkGuard.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1 bg-white border border-slate-200 rounded-full shadow-subtle">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${billingCycle === 'monthly' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <span>Annual Billing</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${billingCycle === 'yearly' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-700 font-bold'}`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {plans.map((plan) => {
            const isCurrentPlan = user?.plan === plan.id;

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-8 border flex flex-col justify-between relative transition-all duration-200 ${plan.popular
                    ? 'border-2 border-rose-500 shadow-elevated scale-100 lg:-translate-y-2 ring-4 ring-rose-500/10'
                    : 'border-slate-200/90 shadow-card hover:border-slate-300'
                  }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-xs font-bold py-1 px-4 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {plan.badge}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    {isCurrentPlan && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 min-h-[36px]">{plan.description}</p>

                  <div className="mt-5 pb-6 border-b border-slate-100 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-tabular">
                      {plan.price}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{plan.period}</span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="mt-6 space-y-3">
                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Includes:</p>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5 border border-rose-200">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4">
                  <Button
                    variant={plan.variant}
                    size="lg"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => handleSelectPlan(plan.id as any)}
                  >
                    {isCurrentPlan ? 'Active Plan' : plan.cta}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Guarantee Banner */}
        <div className="mt-12 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-600" />
          <span>30-day money-back guarantee. No questions asked. Cancel anytime in one click.</span>
        </div>
      </div>
    </section>
  );
};
