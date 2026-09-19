import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'rose';
  showSubtitle?: boolean;
  className?: string;
}

/**
 * Warm Hug Icon: Two smooth, organic interlocking rounded link loops (hugging rings).
 * Warm, protective, and humanized branding for LinkGuard.
 */
export const WarmHugIcon: React.FC<{ className?: string; strokeWidth?: number }> = ({
  className = 'w-5 h-5 text-white',
  strokeWidth = 2.4,
}) => {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Left Interlocking Warm Hug Loop */}
      <path
        d="M10.8 8.2C7.3 8.2 4.5 10.8 4.5 14C4.5 17.2 7.3 19.8 10.8 19.8C13.2 19.8 15.3 18.3 16.3 16.2"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Interlocking Warm Hug Loop */}
      <path
        d="M17.2 19.8C20.7 19.8 23.5 17.2 23.5 14C23.5 10.8 20.7 8.2 17.2 8.2C14.8 8.2 12.7 9.7 11.7 11.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Interlocking Connection Cross-Hug */}
      <path
        d="M11.2 11.2C12.4 9.6 14.4 8.5 16.8 8.5C19.8 8.5 22.2 10.7 22.5 13.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
      <path
        d="M16.8 16.8C15.6 18.4 13.6 19.5 11.2 19.5C8.2 19.5 5.8 17.3 5.5 14.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.95"
      />
    </svg>
  );
};

/**
 * Warm Hug Circular Badge as featured in the humanized branding concepts.
 */
export const WarmHugBadge: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  }[size];

  return (
    <div
      className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#E11D48] via-[#BE123C] to-[#881337] text-white flex items-center justify-center shadow-subtle shrink-0 border border-rose-500/30 transition-transform group-hover:scale-105 ${className}`}
      title="LinkGuard — Warm Hug Logo"
    >
      <WarmHugIcon className={`${iconSizes} text-white`} strokeWidth={2.4} />
    </div>
  );
};

/**
 * Full Brand Logo component with Warm Hug Emblem + Typography
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'dark',
  showSubtitle = true,
  className = '',
}) => {
  const textSizes = {
    sm: 'text-sm',
    md: 'text-base sm:text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-3xl',
  }[size];

  const subtitleSizes = {
    sm: 'text-[8px]',
    md: 'text-[9px] sm:text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  }[size];

  const titleColor = variant === 'light' ? 'text-white' : 'text-slate-900';
  const subtitleColor = variant === 'light' ? 'text-rose-200' : 'text-slate-500';

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      <WarmHugBadge size={size} />
      <div>
        <span className={`${textSizes} font-bold tracking-tight ${titleColor} flex items-center gap-0.5 leading-none`}>
          Link<span className="text-rose-600">Guard</span>
        </span>
        {showSubtitle && (
          <span className={`block ${subtitleSizes} font-semibold ${subtitleColor} tracking-wider uppercase mt-0.5 leading-none`}>
            Affiliate Monitor
          </span>
        )}
      </div>
    </div>
  );
};
