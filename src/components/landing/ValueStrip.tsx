import React from 'react';
import { CheckCircle2, ShieldCheck, Zap, Bell, Search, DollarSign } from 'lucide-react';

export const ValueStrip: React.FC = () => {
  const items = [
    { label: 'Automatic daily monitoring', icon: <CheckCircle2 className="w-4 h-4 text-rose-500" /> },
    { label: 'Affiliate-focused detection', icon: <CheckCircle2 className="w-4 h-4 text-rose-500" /> },
    { label: 'Telegram alerts', icon: <CheckCircle2 className="w-4 h-4 text-rose-500" /> },
    { label: 'No manual checking', icon: <CheckCircle2 className="w-4 h-4 text-rose-500" /> },
    { label: 'Protect lost commissions', icon: <CheckCircle2 className="w-4 h-4 text-rose-500" /> },
  ];

  return (
    <div className="border-y border-slate-200/80 bg-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 md:gap-8">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              {item.icon}
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
