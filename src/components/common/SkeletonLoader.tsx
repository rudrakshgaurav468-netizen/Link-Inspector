import React from 'react';

export const SkeletonLoader: React.FC<{
  type?: 'card' | 'table' | 'chart' | 'line';
  count?: number;
  className?: string;
}> = ({ type = 'line', count = 1, className = '' }) => {
  const renderItem = (index: number) => {
    switch (type) {
      case 'card':
        return (
          <div key={index} className={`bg-white rounded-2xl border border-slate-200/80 p-5 animate-pulse ${className}`}>
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-slate-200 rounded w-1/3"></div>
              <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-2/3"></div>
          </div>
        );
      case 'table':
        return (
          <div key={index} className={`space-y-3 animate-pulse ${className}`}>
            <div className="h-10 bg-slate-100 rounded-xl w-full"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-white border border-slate-100 rounded-xl w-full flex items-center px-4 gap-4">
                <div className="w-1/4 h-4 bg-slate-200 rounded"></div>
                <div className="w-1/3 h-4 bg-slate-100 rounded"></div>
                <div className="w-1/6 h-6 bg-slate-100 rounded-full"></div>
                <div className="w-1/6 h-4 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        );
      case 'chart':
        return (
          <div key={index} className={`bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse ${className}`}>
            <div className="h-4 bg-slate-200 rounded w-1/4 mb-6"></div>
            <div className="h-48 bg-slate-100 rounded-xl w-full flex items-end p-4 gap-3">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex-1 bg-slate-200 rounded-t-lg" style={{ height: `${30 + (i * 10)}%` }}></div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div key={index} className={`h-4 bg-slate-200 rounded animate-pulse w-full ${className}`}></div>
        );
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => renderItem(index))}
    </>
  );
};
