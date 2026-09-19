import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label: string;
  };
  icon: React.ReactNode;
  variant?: 'default' | 'rose' | 'amber' | 'blue';
  onClick?: () => void;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const borderVariants = {
    default: 'border-slate-200/80 hover:border-slate-300',
    rose: 'border-rose-200/90 hover:border-rose-300 bg-gradient-to-br from-white to-rose-50/20',
    amber: 'border-amber-200/90 hover:border-amber-300 bg-gradient-to-br from-white to-amber-50/20',
    blue: 'border-blue-200/90 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50/20',
  };

  const iconBgVariants = {
    default: 'bg-slate-100 text-slate-700',
    rose: 'bg-rose-100/80 text-rose-600',
    amber: 'bg-amber-100/80 text-amber-600',
    blue: 'bg-blue-100/80 text-blue-600',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 shadow-card transition-all duration-200 ${borderVariants[variant]} ${onClick ? 'cursor-pointer hover:shadow-elevated hover:-translate-y-0.5' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`p-2.5 rounded-xl ${iconBgVariants[variant]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-slate-900 font-tabular">{value}</span>
        {trend && (
          <span className={`inline-flex items-center text-xs font-semibold ${trend.isPositive ? 'text-rose-600' : 'text-slate-500'}`}>
            {trend.isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
            )}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-500 flex items-center gap-1.5">
          {subtitle}
        </p>
      )}
    </div>
  );
};
