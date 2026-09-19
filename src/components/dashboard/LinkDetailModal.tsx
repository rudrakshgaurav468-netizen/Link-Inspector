import React from 'react';
import {
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Clock,
  AlertOctagon,
  ArrowRight,
  Globe,
  FileText
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { getNetworkBadgeColor } from '../../utils/affiliateDetector';

export const LinkDetailModal: React.FC = () => {
  const {
    selectedLinkForDetail,
    setSelectedLinkForDetail,
    setFixingLink,
    checkLinkNow,
    resolveAlert
  } = useApp();

  if (!selectedLinkForDetail) return null;

  const link = selectedLinkForDetail;

  const handleCheckAgain = () => {
    checkLinkNow(link.id);
  };

  const handleMarkResolved = () => {
    resolveAlert(link.id);
    setSelectedLinkForDetail(null);
  };

  return (
    <Modal
      isOpen={!!selectedLinkForDetail}
      onClose={() => setSelectedLinkForDetail(null)}
      title={
        <div className="flex items-center gap-2.5">
          <span className="text-base font-bold text-slate-900">Affiliate Link Telemetry</span>
          <StatusBadge status={link.status} size="sm" />
        </div>
      }
      description="Detailed HTTP health status, response codes, and 3-day verification audit."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Core Link Meta Card */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Monitored URL</span>
            <div className="mt-1 flex items-center justify-between gap-2 p-2.5 bg-white border border-slate-200 rounded-xl">
              <span className="font-mono text-slate-800 break-all">{link.url}</span>
              <a
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 shrink-0"
                title="Open Destination"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Affiliate Network</span>
              <span className={`inline-block mt-1 px-2 py-0.5 rounded-md font-semibold border ${getNetworkBadgeColor(link.network)}`}>
                {link.network}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">HTTP Code</span>
              <span className={`inline-block mt-1 font-mono font-bold text-xs ${link.httpStatus === 200 ? 'text-rose-600' : 'text-rose-600'}`}>
                {link.httpStatus === 0 ? 'Timeout (0)' : link.httpStatus}
              </span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">First Detected</span>
              <span className="text-slate-700 font-medium block mt-1">{link.firstDetectedAt}</span>
            </div>

            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Last Checked</span>
              <span className="text-slate-700 font-medium block mt-1">{link.lastCheckedAt}</span>
            </div>
          </div>
        </div>

        {/* Article Preview Card */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-subtle space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Article Source Preview</span>
          </div>

          <div className="text-xs space-y-1.5">
            <p className="font-semibold text-slate-800">{link.articleTitle}</p>
            <p className="text-slate-500 flex items-center gap-1.5">
              <span>Anchor Text:</span>
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                "{link.anchorText}"
              </span>
            </p>
            <a
              href={link.articleUrl}
              target="_blank"
              rel="noreferrer"
              className="text-rose-600 hover:underline inline-flex items-center gap-1 text-[11px] font-medium"
            >
              <span>{link.articleUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Suggested Action Alert Box */}
        {link.suggestedAction && (
          <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-900">
              <AlertOctagon className="w-4 h-4 text-amber-600" />
              <span>Recommended Remediation</span>
            </div>
            <p className="text-amber-800 leading-relaxed pl-5.5">
              {link.suggestedAction}
            </p>
          </div>
        )}

        {/* 3-Day Health History Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            3-Day Health Check History
          </h4>

          <div className="space-y-2">
            {link.checkHistory.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.status === 'healthy' ? 'bg-rose-500' : item.status === 'broken' ? 'bg-rose-500' : 'bg-amber-500'
                    }`} />
                  <div>
                    <span className="font-semibold text-slate-900">{item.date}</span>
                    <p className="text-[11px] text-slate-500">{item.message}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-semibold text-slate-700">{item.httpStatus}</span>
                  <span className="text-[10px] text-slate-400 block font-mono">{item.responseTimeMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open URL
            </a>

            <button
              onClick={handleCheckAgain}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs font-medium"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Check Again
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMarkResolved}
            >
              Mark Resolved
            </Button>

            <Button
              variant="danger"
              size="sm"
              leftIcon={<Wrench className="w-3.5 h-3.5" />}
              onClick={() => {
                setSelectedLinkForDetail(null);
                setFixingLink(link);
              }}
            >
              Fix Link Now
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
