import React, { useState } from 'react';
import {
  Target,
  Search,
  Play,
  ExternalLink,
  Copy,
  Mail,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  Globe,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Button } from '../common/Button';
import { CompetitorOpportunity } from '../../types';

export const CompetitorSpotterTab: React.FC = () => {
  const { competitors, runCompetitorScan, updateCompetitorStatus, addToast, activeWebsite } = useApp();

  const [competitorInput, setCompetitorInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<CompetitorOpportunity | null>(null);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!competitorInput) return;

    setIsScanning(true);
    await runCompetitorScan(competitorInput);
    setIsScanning(false);
    setCompetitorInput('');
  };

  const handleCopyPitch = (pitch: string) => {
    navigator.clipboard.writeText(pitch);
    addToast({
      title: 'Pitch Copied to Clipboard! 📋',
      description: 'Paste into Gmail or your outreach tool to reach out to the webmaster.',
      type: 'success',
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-elevated flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20 mb-3">
            <Target className="w-3.5 h-3.5" />
            <span>SEO Backlink Opportunity Engine</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Competitor Broken Link Spotter</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Scan your competitors’ high-authority articles for dead affiliate & citation links. Outreach to webmasters with your working replacement to acquire authoritative high-DR backlinks.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleScanSubmit} className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <div className="relative w-full md:w-64">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              required
              value={competitorInput}
              onChange={(e) => setCompetitorInput(e.target.value)}
              placeholder="e.g. wirecutter.com"
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <Button
            type="submit"
            variant="rose"
            size="md"
            isLoading={isScanning}
            leftIcon={<Search className="w-4 h-4" />}
          >
            {isScanning ? 'Scanning...' : 'Scan Competitor'}
          </Button>
        </form>
      </div>

      {/* Discovered Opportunities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>High-Authority Outreach Targets</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {competitors.length} Available
            </span>
          </h3>
          <span className="text-xs text-slate-500">Sorted by Referring Domains & Est. Traffic</span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {competitors.map((opp) => (
            <div
              key={opp.id}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-card hover:border-slate-300 transition-all space-y-4"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {opp.competitorDomain}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      {opp.errorType}
                    </span>
                    <span className="text-xs text-slate-400">• Discovered {opp.discoveredAt}</span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-1.5">{opp.articleTitle}</h4>
                  <a
                    href={opp.articleUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-rose-600 hover:underline inline-flex items-center gap-1 mt-0.5"
                  >
                    <span>{opp.articleUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Authority metrics */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Ref. Domains</span>
                    <span className="text-sm font-extrabold text-slate-900 font-tabular">{opp.referringDomainsCount}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Traffic</span>
                    <span className="text-sm font-extrabold text-rose-700 font-tabular">{opp.estimatedTraffic.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Dead Link details */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span>Competitor's Broken Outbound Link:</span>
                  <span className="font-semibold text-slate-700">Anchor: "{opp.brokenAnchorText}"</span>
                </div>
                <code className="font-mono text-rose-700 bg-white p-2 rounded border border-slate-200 block truncate">
                  {opp.brokenUrl}
                </code>
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Outreach Status:</span>
                  <select
                    value={opp.status}
                    onChange={(e) => updateCompetitorStatus(opp.id, e.target.value as any)}
                    className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <option value="uncontacted">Uncontacted</option>
                    <option value="contacted">Contacted 📩</option>
                    <option value="won">Backlink Won! 🏆</option>
                    <option value="ignored">Ignored</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => handleCopyPitch(opp.outreachPitchTemplate)}
                  >
                    Copy Outreach Pitch
                  </Button>
                  <Button
                    variant="rose"
                    size="sm"
                    leftIcon={<Mail className="w-3.5 h-3.5" />}
                    onClick={() => {
                      window.open(`mailto:editor@${opp.competitorDomain}?subject=${encodeURIComponent(`Broken link in "${opp.articleTitle}"`)}&body=${encodeURIComponent(opp.outreachPitchTemplate)}`);
                    }}
                  >
                    Send Email Pitch
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
