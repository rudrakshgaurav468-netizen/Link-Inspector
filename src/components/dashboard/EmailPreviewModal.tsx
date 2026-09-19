import React from 'react';
import { Mail, ShieldCheck, ExternalLink, Wrench, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const EmailPreviewModal: React.FC = () => {
  const {
    isEmailPreviewModalOpen,
    setIsEmailPreviewModalOpen,
    selectedEmailAlert,
    setFixingLink,
    affiliateLinks
  } = useApp();

  if (!isEmailPreviewModalOpen || !selectedEmailAlert) return null;

  const alert = selectedEmailAlert;
  const associatedLink = affiliateLinks.find(l => l.id === alert.affiliateLinkId);

  const handleFixLink = () => {
    setIsEmailPreviewModalOpen(false);
    if (associatedLink) {
      setFixingLink(associatedLink);
    }
  };

  return (
    <Modal
      isOpen={isEmailPreviewModalOpen}
      onClose={() => setIsEmailPreviewModalOpen(false)}
      title={
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-purple-600" />
          <span>Email Alert Template Preview</span>
        </div>
      }
      description="Visual inspection of automated HTML email notifications delivered to publishers."
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Email Envelope Header */}
        <div className="bg-slate-100 p-3.5 rounded-xl text-xs space-y-1 text-slate-600 border border-slate-200">
          <div className="flex items-center justify-between">
            <span><strong>From:</strong> alerts@linkguard.io</span>
            <span className="text-slate-400">02:03 AM UTC</span>
          </div>
          <div>
            <strong>Subject:</strong>{' '}
            <span className="text-rose-600 font-semibold">
              🚨 LinkGuard: Broken affiliate link detected ({alert.articleTitle})
            </span>
          </div>
        </div>

        {/* Email Body Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-subtle space-y-5 text-slate-800">
          {/* Email Brand Header */}
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <div className="w-7 h-7 rounded-lg bg-slate-900 text-rose-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4 text-rose-400" />
            </div>
            <span className="text-sm font-bold text-slate-900">LinkGuard Security Alert</span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900">
              Broken affiliate link detected on your website.
            </h4>
            <p className="text-xs text-slate-600 mt-1">
              During the scheduled 2:00 AM daily background check, our scanner detected an unreachable or delisted affiliate link.
            </p>
          </div>

          {/* Details Table */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Article:</span>
              <strong className="text-slate-900">{alert.articleTitle}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Affiliate Link:</span>
              <code className="font-mono text-slate-700 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                {alert.linkUrl}
              </code>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Issue:</span>
              <span className="font-bold text-rose-600">{alert.issue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Detected At:</span>
              <span className="text-slate-700">{alert.detectedAt}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-200/60">
              <span className="text-slate-500">Recommended Action:</span>
              <span className="text-slate-800 font-medium">Replace this affiliate link with an active ASIN.</span>
            </div>
          </div>

          {/* Big CTA */}
          <div className="pt-2 text-center">
            <button
              onClick={handleFixLink}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors"
            >
              <Wrench className="w-4 h-4" />
              Fix This Link Now
            </button>
          </div>

          {/* Footer disclaimer */}
          <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center leading-relaxed">
            You are receiving this because affiliate link health monitoring is enabled on your LinkGuard account for mytechblog.com.
          </div>
        </div>
      </div>
    </Modal>
  );
};
