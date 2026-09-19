import React from 'react';
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileCode2,
  Link2,
  ArrowRight,
  Terminal
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const ScannerProgressModal: React.FC = () => {
  const {
    isScannerModalOpen,
    setIsScannerModalOpen,
    isScanning,
    scanProgress,
    scanCurrentStep,
    scanLogs,
    activeWebsite,
    affiliateLinks,
    setActiveView
  } = useApp();

  if (!isScannerModalOpen) return null;

  const isFinished = scanProgress >= 100 && !isScanning;

  const currentWebsiteLinks = affiliateLinks.filter(
    l => !activeWebsite || l.websiteDomain === activeWebsite.domain || l.websiteId === activeWebsite.id
  );
  const realHealthyCount = currentWebsiteLinks.length > 0
    ? currentWebsiteLinks.filter(l => l.status === 'healthy').length
    : (activeWebsite?.healthyCount ?? 0);
  const realBrokenCount = currentWebsiteLinks.length > 0
    ? currentWebsiteLinks.filter(l => l.status === 'broken').length
    : (activeWebsite?.brokenCount ?? 0);
  const realWarningCount = currentWebsiteLinks.length > 0
    ? currentWebsiteLinks.filter(l => l.status === 'warning').length
    : (activeWebsite?.warningCount ?? 0);
  const realTotalIssues = realBrokenCount + realWarningCount;
  const realTotalLinks = currentWebsiteLinks.length > 0 ? currentWebsiteLinks.length : (activeWebsite?.linksCount ?? 0);
  const realArticlesCount = activeWebsite?.articlesCount ?? (realTotalLinks > 0 ? 1 : 0);

  const handleViewResults = () => {
    setIsScannerModalOpen(false);
    setActiveView('broken');
  };

  return (
    <Modal
      isOpen={isScannerModalOpen}
      onClose={() => !isScanning && setIsScannerModalOpen(false)}
      showCloseButton={!isScanning}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Header Title */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-rose-400 flex items-center justify-center mx-auto mb-3 shadow-subtle">
            {isFinished ? (
              <CheckCircle2 className="w-7 h-7 text-rose-400" />
            ) : (
              <Loader2 className="w-7 h-7 animate-spin text-rose-400" />
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            {isFinished ? 'Scan Complete' : 'Scanning your website…'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {isFinished
              ? `Finished auditing ${activeWebsite?.domain || 'website'} links.`
              : `Crawling sitemap & verifying links on ${activeWebsite?.domain || 'website'}...`}
          </p>
        </div>

        {/* Animated Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span className="flex items-center gap-2">
              {!isFinished && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
              {scanCurrentStep || 'Initializing scan...'}
            </span>
            <span className="font-mono text-rose-700">{scanProgress}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200">
            <div
              className="bg-rose-500 h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{ width: `${scanProgress}%` }}
            >
              {/* Shimmer animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>
          </div>
        </div>

        {/* Finished Results Summary Box */}
        {isFinished ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Articles Scanned</span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block font-tabular">
                {realArticlesCount}
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Links</span>
              <span className="text-lg font-bold text-slate-900 mt-0.5 block font-tabular">
                {realTotalLinks}
              </span>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Healthy Links</span>
              <span className="text-lg font-bold text-rose-700 mt-0.5 block font-tabular">
                {realHealthyCount}
              </span>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-center">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Issues Found</span>
              <span className="text-lg font-bold text-rose-700 mt-0.5 block font-tabular">
                {realTotalIssues}
              </span>
            </div>
          </div>
        ) : null}

        {/* Live Terminal Status Messages Log */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-xs font-mono space-y-1.5 max-h-48 overflow-y-auto">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
            <Terminal className="w-3.5 h-3.5 text-rose-400" />
            <span>Crawler Engine Telemetry Output</span>
          </div>

          {scanLogs.map((log, index) => (
            <p key={index} className="text-slate-300 leading-relaxed text-[11px] animate-fade-in">
              {log}
            </p>
          ))}

          {isScanning && (
            <p className="text-rose-400 text-[11px] flex items-center gap-1.5 animate-pulse">
              <span>› Checking affiliate link status & response times...</span>
            </p>
          )}
        </div>

        {/* Footer */}
        {isFinished && (
          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setIsScannerModalOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="rose"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleViewResults}
            >
              View Results
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
