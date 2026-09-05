import { AffiliateNetwork } from '../types';

export interface AffiliatePattern {
  network: AffiliateNetwork;
  patterns: RegExp[];
  badgeColor: string;
}

export const AFFILIATE_PATTERNS: AffiliatePattern[] = [
  {
    network: 'Amazon Associates',
    patterns: [
      /amazon\.[a-z.]+(\/.*)?([?&]tag=[a-zA-Z0-9_-]+)/i,
      /amzn\.to\/[a-zA-Z0-9_-]+/i,
      /a\.co\/[a-zA-Z0-9_-]+/i,
      /amazon\.[a-z.]+\/gp\/product\/[a-zA-Z0-9]+/i,
      /amazon\.[a-z.]+\/dp\/[a-zA-Z0-9]+/i,
    ],
    badgeColor: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  },
  {
    network: 'ClickBank',
    patterns: [
      /[a-zA-Z0-9_-]+\.hop\.clickbank\.net/i,
      /clickbank\.net/i,
      /hop\.clickbank\.net/i,
    ],
    badgeColor: 'bg-red-500/10 text-red-600 border-red-500/20',
  },
  {
    network: 'ShareASale',
    patterns: [
      /shareasale\.com\/r\.cfm/i,
      /shareasale\.com\/u\.cfm/i,
      /shrsl\.com\/[a-zA-Z0-9_-]+/i,
    ],
    badgeColor: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  },
  {
    network: 'CJ Affiliate',
    patterns: [
      /cj\.com/i,
      /anrdoezrs\.net/i,
      /dpbolvw\.net/i,
      /jdoqocy\.com/i,
      /tkqlhce\.com/i,
      /kqzyfj\.com/i,
    ],
    badgeColor: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  },
  {
    network: 'Impact',
    patterns: [
      /impactradius\.com/i,
      /impact\.com/i,
      /sjv\.io/i,
      /pxf\.io/i,
      /7eer\.net/i,
    ],
    badgeColor: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  },
  {
    network: 'Rakuten',
    patterns: [
      /linksynergy\.com/i,
      /click\.linksynergy\.com/i,
      /rakutenadvertising\.com/i,
    ],
    badgeColor: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  },
  {
    network: 'Awin',
    patterns: [
      /awin1\.com/i,
      /zenaps\.com/i,
      /adgoal\.net/i,
    ],
    badgeColor: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20',
  }
];

export function detectAffiliateNetwork(url: string): AffiliateNetwork {
  for (const item of AFFILIATE_PATTERNS) {
    for (const pattern of item.patterns) {
      if (pattern.test(url)) {
        return item.network;
      }
    }
  }
  return 'Custom / Direct';
}

export function isAffiliateLink(url: string): boolean {
  if (!url || !url.startsWith('http')) return false;
  return AFFILIATE_PATTERNS.some(item => 
    item.patterns.some(pattern => pattern.test(url))
  ) || url.includes('aff') || url.includes('ref=') || url.includes('subid=') || url.includes('partner=');
}

export function getNetworkBadgeColor(network: AffiliateNetwork): string {
  const match = AFFILIATE_PATTERNS.find(p => p.network === network);
  return match ? match.badgeColor : 'bg-slate-100 text-slate-700 border-slate-200';
}
