import React, { useState } from 'react';
import { 
  History, 
  Play, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Link2, 
  XCircle, 
  AlertTriangle, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/StatusBadge';
import { ScanJob } from '../../types';

export const ScanHistoryTab: React.FC = () => {
  const { scanJobs, startScan, isScanning, activeWebsite, setActiveView } = useApp();
  const [selectedScan, setSelectedScan] = useState<ScanJob | null>(null);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-subtle">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Background Crawl & Scan Audit Log</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Audit logs of autonomous daily health checks executed for {activeWebsite?.domain}.
          </p>
        </div>

        <Button
          variant="emerald"
          size="md"
          isLoading={isScanning}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
          onClick={() => startScan(activeWebsite?.id)}
        >
          {isScanning ? 'Scan in Progress...' : 'Run Scan Now'}
        </Button>
      </div>

      {/* History List Cards */}
      <div className="space-y-4">
        {scanJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            {/* Left: Scan timestamp & status */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <History className="w-6 h-6 text-slate-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{job.startedAt}</h3>
                  <StatusBadge status="healthy" customLabel="Completed ✓" size="sm" />
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                  <span>Domain: <strong>{job.websiteDomain}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="font-mono text-slate-700">{job.duration}</strong></span>
                </p>
              </div>
            </div>

            {/* Middle: Metrics Pills */}
            <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Articles</span>
                <span className="text-xs font-bold text-slate-900 font-tabular">{job.articlesScanned}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Links Checked</span>
                <span className="text-xs font-bold text-slate-900 font-tabular">{job.linksChecked}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase block">Healthy</span>
                <span className="text-xs font-bold text-emerald-700 font-tabular">{job.healthyCount}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase block">Issues</span>
                <span className="text-xs font-bold text-rose-700 font-tabular">{job.brokenCount + job.warningCount}</span>
              </div>
            </div>

            {/* Right: View scan button */}
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveView('broken')}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                View Scan Results
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
