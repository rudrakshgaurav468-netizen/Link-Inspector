import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { LinkStatus } from '../../types';

interface StatusBadgeProps {
  status: LinkStatus | 'monitoring' | 'paused' | 'scanning' | 'resolved' | 'error';
  size?: 'sm' | 'md';
  showIcon?: boolean;
  className?: string;
  customLabel?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
  customLabel
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  let config = {
    label: 'Healthy',
    bg: 'bg-rose-50/90 text-rose-800 border-rose-200/90',
    dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-rose-600" />
  };

  switch (status) {
    case 'healthy':
    case 'resolved':
      config = {
        label: customLabel || (status === 'resolved' ? 'Resolved ✓' : 'Healthy'),
        bg: 'bg-rose-50/90 text-rose-800 border-rose-200',
        dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      };
      break;
    case 'broken':
      config = {
        label: customLabel || 'Broken',
        bg: 'bg-rose-50/90 text-rose-700 border-rose-200',
        dot: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]',
        icon: <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      };
      break;
    case 'warning':
      config = {
        label: customLabel || 'Warning',
        bg: 'bg-amber-50/90 text-amber-700 border-amber-200',
        dot: 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
      };
      break;
    case 'monitoring':
      config = {
        label: customLabel || 'Monitoring Active',
        bg: 'bg-blue-50 text-blue-700 border-blue-200',
        dot: 'bg-blue-500',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
      };
      break;
    case 'scanning':
      config = {
        label: customLabel || 'Scanning...',
        bg: 'bg-purple-50 text-purple-700 border-purple-200 animate-pulse',
        dot: 'bg-purple-500',
        icon: <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
      };
      break;
    case 'paused':
      config = {
        label: customLabel || 'Paused',
        bg: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-400',
        icon: <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
      };
      break;
    case 'error':
      config = {
        label: customLabel || 'Error',
        bg: 'bg-rose-50 text-rose-700 border-rose-200',
        dot: 'bg-rose-500',
        icon: <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
      };
      break;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} ${className}`}>
      {showIcon && config.icon}
      <span className="truncate">{config.label}</span>
    </span>
  );
};

export const Badge: React.FC<{
  children: React.ReactNode;
  variant?: 'slate' | 'rose' | 'amber' | 'blue' | 'purple';
  size?: 'sm' | 'md';
  className?: string;
}> = ({ children, variant = 'slate', size = 'sm', className = '' }) => {
  const styles = {
    slate: 'bg-slate-100 text-slate-700 border-slate-200/80',
    rose: 'bg-rose-50 text-rose-700 border-rose-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span className={`inline-flex items-center rounded-md border ${styles[variant]} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};
