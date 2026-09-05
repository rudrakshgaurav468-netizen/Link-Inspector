import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  ExternalLink, 
  Copy, 
  ShieldCheck, 
  CheckCircle2, 
  Lock, 
  Save,
  Sparkles,
  Eye
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const WhiteLabelPortalModal: React.FC = () => {
  const { isWhiteLabelModalOpen, setIsWhiteLabelModalOpen, whiteLabel, saveWhiteLabelSettings, addToast, activeWebsite } = useApp();

  const [agencyName, setAgencyName] = useState(whiteLabel.agencyName);
  const [customDomain, setCustomDomain] = useState(whiteLabel.customDomain);
  const [brandColor, setBrandColor] = useState(whiteLabel.brandColor);
  const [requirePasscode, setRequirePasscode] = useState(whiteLabel.requirePasscode);
  const [passcode, setPasscode] = useState(whiteLabel.passcode || 'client2026');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveWhiteLabelSettings({
      agencyName,
      customDomain,
      brandColor,
      requirePasscode,
      passcode,
      clientPortalUrl: `https://${customDomain}/portal/${activeWebsite?.domain || 'client-audit'}`,
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(whiteLabel.clientPortalUrl);
    addToast({
      title: 'Portal Link Copied! 📋',
      description: 'Share this branded link with your client.',
      type: 'success',
    });
  };

  return (
    <Modal
      isOpen={isWhiteLabelModalOpen}
      onClose={() => setIsWhiteLabelModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-base font-bold text-slate-900">White-Label Client Portal</span>
        </div>
      }
      description="Provide your SEO & affiliate marketing clients with a 100% white-labeled health audit dashboard under your own agency brand."
      maxWidth="2xl"
    >
      {!isPreviewOpen ? (
        <form onSubmit={handleSave} className="space-y-5 text-xs">
          {/* Active Branded Link Banner */}
          <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-purple-600 block">Live Client Portal URL</span>
              <p className="font-mono font-semibold text-slate-800 text-xs mt-0.5">{whiteLabel.clientPortalUrl}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                leftIcon={<Copy className="w-3.5 h-3.5" />}
                onClick={handleCopyLink}
              >
                Copy URL
              </Button>
              <Button
                type="button"
                variant="emerald"
                size="sm"
                leftIcon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => setIsPreviewOpen(true)}
              >
                Preview Portal
              </Button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Agency / Company Name</label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="Vance Growth Media"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Custom Portal CNAME Domain</label>
              <input
                type="text"
                required
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="audit.youragency.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Brand Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-9 h-9 rounded-xl border border-slate-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={brandColor}
                  onChange={(e) => setBrandColor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Client Access Passcode</label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="e.g. client2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={requirePasscode}
                onChange={(e) => setRequirePasscode(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span>Require password to view client audit portal</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={true}
                readOnly
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
              />
              <span>Hide LinkGuard branding completely (100% White-Label)</span>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => setIsWhiteLabelModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              leftIcon={<Save className="w-4 h-4" />}
            >
              Save White-Label Settings
            </Button>
          </div>
        </form>
      ) : (
        /* LIVE CLIENT PORTAL PREVIEW VIEW */
        <div className="space-y-4 animate-fade-in">
          {/* Top Bar inside preview */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between" style={{ borderTop: `4px solid ${brandColor}` }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm" style={{ backgroundColor: brandColor }}>
                {agencyName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">{agencyName}</h4>
                <p className="text-[11px] text-slate-400">Affiliate Link Health & Audit Portal</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              Verified Client Report
            </span>
          </div>

          {/* Client portal summary stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Monitored Links</span>
              <span className="text-base font-bold text-slate-900 mt-0.5 block font-tabular">1,240</span>
            </div>
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Link Health</span>
              <span className="text-base font-bold text-emerald-700 mt-0.5 block font-tabular">98.9%</span>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Revenue Protected</span>
              <span className="text-base font-bold text-emerald-700 mt-0.5 block font-tabular">$2,840/mo</span>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
            Client has read-only access to resolve reports, export CSV audits, and monitor domain uptime.
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
            >
              ← Back to Settings
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
