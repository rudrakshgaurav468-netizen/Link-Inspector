import React, { useState } from 'react';
import {
  Globe,
  Send,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Sparkles,
  FileCode2,
  Link2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';

export const OnboardingWizard: React.FC = () => {
  const { setActiveView, addWebsite, connectTelegram, telegram, addToast } = useApp();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [websiteUrl, setWebsiteUrl] = useState('https://mytechblog.com');
  const [telegramUsername, setTelegramUsername] = useState('@alexvance_tech');
  const [isScanning, setIsScanning] = useState(false);
  const [scanStepMessage, setScanStepMessage] = useState('');

  // Handle Step 1: Scan Website
  const handleScanWebsite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl) return;

    setIsScanning(true);
    setScanStepMessage('Fetching sitemap.xml...');

    await new Promise(r => setTimeout(r, 600));
    setScanStepMessage('Discovered 342 articles...');

    await new Promise(r => setTimeout(r, 600));
    setScanStepMessage('Extracting 1,240 affiliate links...');

    await new Promise(r => setTimeout(r, 600));
    setIsScanning(false);
    setCurrentStep(2);
  };

  // Handle Step 2: Connect Telegram
  const handleConnectTelegram = () => {
    if (telegramUsername) {
      connectTelegram(telegramUsername);
    }
    setCurrentStep(3);
    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch { }
  };

  const handleSkipTelegram = () => {
    setCurrentStep(3);
  };

  // Handle Step 3: Open Dashboard
  const handleFinish = () => {
    setActiveView('dashboard');
    addToast({
      title: 'Welcome to your Command Center!',
      description: 'Daily background link checks are active.',
      type: 'success',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Brand Header */}
      <div className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-900 text-rose-400 flex items-center justify-center shadow-subtle">
          <ShieldCheck className="w-6 h-6 text-rose-400" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Link<span className="text-rose-600">Guard</span>
        </span>
      </div>

      {/* Wizard Progress Dots */}
      <div className="flex items-center gap-3 mb-8">
        <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 1 ? 'text-rose-700' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 1 ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
            1
          </span>
          <span>Add Website</span>
        </div>
        <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-rose-500' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 2 ? 'text-rose-700' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 2 ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
            2
          </span>
          <span>Connect Telegram</span>
        </div>
        <div className={`w-8 h-0.5 ${currentStep >= 3 ? 'bg-rose-500' : 'bg-slate-200'}`} />
        <div className={`flex items-center gap-2 text-xs font-semibold ${currentStep >= 3 ? 'text-rose-700' : 'text-slate-400'}`}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentStep >= 3 ? 'bg-rose-600 text-white shadow-sm' : 'bg-slate-200 text-slate-600'}`}>
            3
          </span>
          <span>Ready</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl p-8 border border-slate-200/90 shadow-card animate-slide-down">
        {/* STEP 1 */}
        {currentStep === 1 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Add your website URL</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                LinkGuard will fetch your sitemap and discover all articles and outbound affiliate links.
              </p>
            </div>

            <form onSubmit={handleScanWebsite} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    required
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://mytechblog.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-medium"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                  Standard sitemap.xml will be discovered automatically
                </p>
              </div>

              {isScanning && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between text-slate-700 font-semibold">
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                      Scanning website content...
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-700 font-mono">{scanStepMessage}</p>
                </div>
              )}

              <Button
                variant="rose"
                size="lg"
                className="w-full"
                isLoading={isScanning}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Scan Website
              </Button>
            </form>
          </div>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-3 border border-sky-200">
                <Send className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Connect Telegram Alerts</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                Get instant actionable alerts on your phone the moment an affiliate link breaks.
              </p>
            </div>

            <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl mb-5 space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2 font-bold text-sky-900">
                <span>🤖 LinkGuard Telegram Bot</span>
              </div>
              <p className="text-slate-600">
                1. Open Telegram and search <strong>@LinkGuardAlertsBot</strong>
              </p>
              <p className="text-slate-600">
                2. Tap Start and enter your username below to link your account.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Telegram Handle
                </label>
                <div className="relative">
                  <Send className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                    placeholder="@alexvance_tech"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full bg-[#2AABEE] hover:bg-[#229ED9] border-none text-white shadow-sm"
                  onClick={handleConnectTelegram}
                  leftIcon={<Send className="w-4 h-4" />}
                >
                  Connect Telegram
                </Button>

                <Button
                  variant="ghost"
                  size="md"
                  className="w-full text-xs text-slate-500"
                  onClick={handleSkipTelegram}
                >
                  Skip for now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <div>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3 border border-rose-200">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">You're All Set!</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                LinkGuard has successfully configured monitoring for your website.
              </p>
            </div>

            <div className="space-y-2.5 mb-6">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Website connected: <strong>mytechblog.com</strong></span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Sitemap discovered: <strong>342 articles found</strong></span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Affiliate monitoring enabled: <strong>1,240 links indexed</strong></span>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs font-semibold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Daily 2:00 AM autonomous health checks activated</span>
              </div>
            </div>

            <Button
              variant="rose"
              size="lg"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleFinish}
            >
              Open Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
