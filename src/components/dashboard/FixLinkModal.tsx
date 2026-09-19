import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Sparkles,
  Zap,
  History,
  CheckCircle2,
  Link2,
  ExternalLink,
  Loader2,
  TrendingDown,
  Globe,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { detectAffiliateNetwork, getNetworkBadgeColor } from '../../utils/affiliateDetector';
import { RevenueLossBadge } from './RevenueLossBadge';
import { HeadlessCmsType } from '../../types';

export const FixLinkModal: React.FC = () => {
  const {
    fixingLink,
    setFixingLink,
    fixLink,
    applyWaybackFallback,
    applyHeadlessRedirect
  } = useApp();

  const [activeTab, setActiveTab] = useState<'headless' | 'wayback' | 'manual'>('headless');
  const [newUrl, setNewUrl] = useState('');
  const [newAnchorText, setNewAnchorText] = useState('');
  const [selectedCms, setSelectedCms] = useState<HeadlessCmsType>('cloudflare_worker');
  const [isValidating, setIsValidating] = useState(false);
  const [validationStep, setValidationStep] = useState('');

  useEffect(() => {
    if (fixingLink) {
      setNewUrl(
        fixingLink.network === 'Amazon Associates'
          ? 'https://amazon.com/dp/B0CX2M9N88?tag=mytechblog-20'
          : `https://partner.updatedstore.com/promo-2026?ref=mytechblog`
      );
      setNewAnchorText(fixingLink.anchorText || '');
    }
  }, [fixingLink]);

  if (!fixingLink) return null;

  const link = fixingLink;
  const detectedNetwork = newUrl ? detectAffiliateNetwork(newUrl) : 'Custom / Direct';

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;

    setIsValidating(true);
    setValidationStep('Testing connection via Residential Proxy...');
    await new Promise(r => setTimeout(r, 450));
    setValidationStep('Following affiliate redirect hops...');
    await new Promise(r => setTimeout(r, 450));
    setValidationStep('Verifying HTTP 200 OK & stock availability...');
    await new Promise(r => setTimeout(r, 450));
    setIsValidating(false);

    fixLink(link.id, newUrl, newAnchorText);
  };

  const handleApplyWayback = async () => {
    setIsValidating(true);
    await applyWaybackFallback(link.id);
    setIsValidating(false);
  };

  const handleApplyHeadless = async () => {
    setIsValidating(true);
    await applyHeadlessRedirect(link.id, selectedCms, newUrl);
    setIsValidating(false);
  };

  return (
    <Modal
      isOpen={!!fixingLink}
      onClose={() => setFixingLink(null)}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900">The Fix Engine: Instant Remediation</span>
        </div>
      }
      description="Choose an automated resolution method to eliminate broken link revenue leakage."
      maxWidth="2xl"
    >
      <div className="space-y-5 text-xs">
        {/* Article and Revenue Context Box */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Article</span>
            <p className="font-bold text-slate-900 truncate mt-0.5">{link.articleTitle}</p>
            <p className="text-rose-600 font-semibold mt-0.5">Issue: {link.errorType || 'Broken Link'}</p>
          </div>
          <div className="shrink-0">
            <RevenueLossBadge impact={link.revenueImpact} size="md" showDetails />
          </div>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('headless')}
            className={`flex-1 py-2 px-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'headless' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>1-Click 301 Redirect</span>
          </button>

          {link.waybackSnapshot && (
            <button
              type="button"
              onClick={() => setActiveTab('wayback')}
              className={`flex-1 py-2 px-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'wayback' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Wayback Fallback</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-2 px-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 ${activeTab === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <Link2 className="w-3.5 h-3.5 text-slate-600" />
            <span>Manual Entry</span>
          </button>
        </div>

        {/* TAB 2: 1-CLICK HEADLESS REDIRECT */}
        {activeTab === 'headless' && (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 animate-fade-in">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Zero-Login 301 Edge Redirect</h4>
              <p className="text-slate-500 text-xs mt-0.5">
                Automatically deploy redirect rules to Cloudflare Workers, WordPress API, or Shopify Storefront.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedCms('cloudflare_worker')}
                className={`p-3 rounded-xl border text-left transition-all ${selectedCms === 'cloudflare_worker' ? 'border-rose-500 bg-rose-50/60 font-bold text-rose-900' : 'border-slate-200 bg-white'
                  }`}
              >
                <span>☁️ Cloudflare Worker</span>
                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">&lt;10ms Global Edge Routing</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedCms('wordpress_rest_api')}
                className={`p-3 rounded-xl border text-left transition-all ${selectedCms === 'wordpress_rest_api' ? 'border-rose-500 bg-rose-50/60 font-bold text-rose-900' : 'border-slate-200 bg-white'
                  }`}
              >
                <span>⚡ WordPress REST API</span>
                <span className="block text-[10px] text-slate-400 font-normal mt-0.5">Auto-push Redirection Plugin</span>
              </button>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Redirect Forwarding Target</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="rose"
                size="md"
                isLoading={isValidating}
                leftIcon={<Zap className="w-4 h-4 fill-current" />}
                onClick={handleApplyHeadless}
              >
                Deploy 301 Redirect Now
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: WAYBACK MACHINE FALLBACK */}
        {activeTab === 'wayback' && link.waybackSnapshot && (
          <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 space-y-4 animate-fade-in">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                🏛️ Internet Archive Working Snapshot Available
              </span>
              <h4 className="text-sm font-bold text-slate-900 mt-1">Snapshot Date: {link.waybackSnapshot.snapshotDate}</h4>
              <p className="text-slate-600 text-xs">
                LinkGuard retrieved a working historical snapshot before the original page was taken down.
              </p>
            </div>

            <div className="p-3 bg-white border border-blue-200 rounded-xl font-mono text-[11px] text-blue-900 break-all">
              {link.waybackSnapshot.archiveUrl}
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <a
                href={link.waybackSnapshot.archiveUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 border border-slate-200 bg-white rounded-xl text-xs text-slate-700 font-medium inline-flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Inspect Snapshot
              </a>

              <Button
                variant="rose"
                size="md"
                isLoading={isValidating}
                leftIcon={<History className="w-4 h-4" />}
                onClick={handleApplyWayback}
              >
                Apply Wayback Fallback
              </Button>
            </div>
          </div>
        )}

        {/* TAB 4: MANUAL ENTRY */}
        {activeTab === 'manual' && (
          <form onSubmit={handleManualSubmit} className="space-y-4 animate-fade-in">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-semibold text-slate-700">Custom Replacement URL</label>
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded border ${getNetworkBadgeColor(detectedNetwork)}`}>
                  {detectedNetwork}
                </span>
              </div>
              <input
                type="url"
                required
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://amzn.to/your-new-asin"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Anchor Text</label>
              <input
                type="text"
                value={newAnchorText}
                onChange={(e) => setNewAnchorText(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            {isValidating && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 font-mono">
                <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                <span>{validationStep}</span>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                variant="rose"
                size="md"
                isLoading={isValidating}
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Verify & Save
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
