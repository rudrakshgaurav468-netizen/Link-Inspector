import React from 'react';
import { DollarSign, TrendingDown, AlertCircle } from 'lucide-react';
import { RevenueImpact, PriorityLevel } from '../../types';

export const RevenueLossBadge: React.FC<{
  impact?: RevenueImpact;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}> = ({ impact, size = 'sm', showDetails = false }) => {
  if (!impact || impact.estimatedMonthlyLoss === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
        $0 Loss Risk
      </span>
    );
  }

  const priorityStyles: Record<PriorityLevel, { bg: string; text: string; border: string; label: string }> = {
    critical: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-700 font-bold',
      border: 'border-rose-500/30',
      label: 'CRITICAL',
    },
    high: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-700 font-bold',
      border: 'border-orange-500/30',
      label: 'HIGH',
    },
    medium: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-700 font-semibold',
      border: 'border-amber-500/30',
      label: 'MEDIUM',
    },
    low: {
      bg: 'bg-slate-100',
      text: 'text-slate-600 font-medium',
      border: 'border-slate-200',
      label: 'LOW',
    },
  };

  const style = priorityStyles[impact.priority] || priorityStyles.medium;

  return (
    <div className="inline-flex items-center gap-1.5 flex-wrap">
      <span
        className={`inline-flex items-center gap-1 rounded-md border ${style.bg} ${style.text} ${style.border} ${size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
          }`}
        title={`Estimated based on ${impact.monthlyPageViews.toLocaleString()} monthly page views @ ${impact.conversionRate}% conversion rate`}
      >
        <TrendingDown className="w-3 h-3 text-rose-500 shrink-0" />
        <span>-${impact.estimatedMonthlyLoss}/mo</span>
      </span>

      {showDetails && (
        <span className="text-[10px] text-slate-400 font-mono">
          ({impact.monthlyPageViews.toLocaleString()} views/mo)
        </span>
      )}
    </div>
  );
};
