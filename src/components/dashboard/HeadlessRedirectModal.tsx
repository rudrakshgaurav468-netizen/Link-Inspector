import React, { useState } from 'react';
import {
  Zap,
  CheckCircle2,
  Globe,
  ArrowRight,
  Server,
  ExternalLink,
  ShieldCheck,
  Radio
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { HeadlessCmsType } from '../../types';

export const HeadlessRedirectModal: React.FC = () => {
  const { selectedLinkForRedirect, setSelectedLinkForRedirect, applyHeadlessRedirect } = useApp();

  const [selectedCms, setSelectedCms] = useState<HeadlessCmsType>('cloudflare_worker');
  const [destinationUrl, setDestinationUrl] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);

  React.useEffect(() => {
    if (selectedLinkForRedirect) {
      setDestinationUrl(
        selectedLinkForRedirect.aiSuggestion?.suggestedUrl ||
        'https://amzn.to/392-active-replacement-2026'
      );
    }
  }, [selectedLinkForRedirect]);

  if (!selectedLinkForRedirect) return null;

  const link = selectedLinkForRedirect;

  const cmsOptions: { id: HeadlessCmsType; name: string; desc: string; icon: string; badge: string }[] = [
    {
      id: 'cloudflare_worker',
      name: 'Cloudflare Worker (Edge)',
      desc: 'Instant global 301 redirect in <10ms across 300+ edge points with zero server load.',
      icon: '☁️',
      badge: 'Zero CMS Login',
    },
    {
      id: 'wordpress_rest_api',
      name: 'WordPress REST API',
      desc: 'Direct headless sync into your Redirection / RankMath plugin without wp-admin login.',
      icon: '⚡',
      badge: 'Plugin Sync',
    },
    {
      id: 'shopify_storefront',
      name: 'Shopify Storefront API',
      desc: 'Creates a URL Redirect resource directly in your Shopify admin via GraphQL.',
      icon: '🛍️',
      badge: 'E-commerce',
    },
    {
      id: 'vercel_edge',
      name: 'Vercel Edge Config / Next.js',
      desc: 'Updates Edge Config KV store for instantaneous Next.js client rewrites.',
      icon: '▲',
      badge: 'Jamstack',
    },
  ];

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destinationUrl) return;

    setIsDeploying(true);
    await applyHeadlessRedirect(link.id, selectedCms, destinationUrl);
    setIsDeploying(false);
  };

  return (
    <Modal
      isOpen={!!selectedLinkForRedirect}
      onClose={() => setSelectedLinkForRedirect(null)}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900">1-Click Headless 301 Redirect</span>
        </div>
      }
      description="Apply instant serverless redirects without logging into your CMS or installing heavy plugins."
      maxWidth="lg"
    >
      <form onSubmit={handleDeploy} className="space-y-4">
        {/* Source link info */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Source Broken Link</span>
          <p className="font-bold text-slate-900 truncate">{link.articleTitle}</p>
          <code className="font-mono text-rose-700 bg-rose-50 px-2 py-0.5 rounded text-[11px] block truncate mt-1">
            {link.url}
          </code>
        </div>

        {/* CMS Target Choice */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Select Edge Deployment Engine
          </label>
          <div className="space-y-2">
            {cmsOptions.map((opt) => (
              <div
                key={opt.id}
                onClick={() => setSelectedCms(opt.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${selectedCms === opt.id
                    ? 'border-rose-500 bg-rose-50/50 shadow-sm ring-2 ring-rose-500/10'
                    : 'border-slate-200 hover:bg-slate-50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{opt.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{opt.name}</span>
                      <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                        {opt.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                  </div>
                </div>

                <input
                  type="radio"
                  checked={selectedCms === opt.id}
                  onChange={() => setSelectedCms(opt.id)}
                  className="text-rose-600 focus:ring-rose-500 w-4 h-4 mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Destination Target */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Forwarding Destination URL
          </label>
          <input
            type="url"
            required
            value={destinationUrl}
            onChange={(e) => setDestinationUrl(e.target.value)}
            placeholder="https://amazon.com/dp/active-asin?tag=myblog"
            className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
          />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={() => setSelectedLinkForRedirect(null)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="rose"
            size="md"
            isLoading={isDeploying}
            leftIcon={<Zap className="w-4 h-4 fill-current" />}
          >
            Deploy 301 Redirect Now
          </Button>
        </div>
      </form>
    </Modal>
  );
};
