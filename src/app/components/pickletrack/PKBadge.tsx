/**
 * PKBadge — VNS PickleTrack
 * Warning / Status badges
 * Variants: expiring | expired | active | break | quit
 * Sizes:    sm | md
 */

import { AlertTriangle, XCircle, CheckCircle2, PauseCircle, MinusCircle } from 'lucide-react';

export type BadgeVariant = 'expiring' | 'expired' | 'active' | 'break' | 'quit';

export interface PKBadgeProps {
  variant:  BadgeVariant;
  size?:    'sm' | 'md';
  showIcon?: boolean;
}

const BADGE_CONFIG: Record<BadgeVariant, {
  label:  string;
  color:  string;
  bg:     string;
  border: string;
  icon:   React.ReactNode;
}> = {
  expiring: {
    label:  'Sắp hết buổi',
    color:  '#D4762A',
    bg:     'rgba(244,162,97,0.14)',
    border: 'rgba(244,162,97,0.35)',
    icon:   <AlertTriangle style={{ width: 11, height: 11 }} />,
  },
  expired: {
    label:  'Hết buổi',
    color:  '#C85A3D',
    bg:     'rgba(231,111,81,0.13)',
    border: 'rgba(231,111,81,0.3)',
    icon:   <XCircle style={{ width: 11, height: 11 }} />,
  },
  active: {
    label:  'Đang học',
    color:  '#1A7B6E',
    bg:     'rgba(42,157,143,0.13)',
    border: 'rgba(42,157,143,0.3)',
    icon:   <CheckCircle2 style={{ width: 11, height: 11 }} />,
  },
  break: {
    label:  'Tạm nghỉ',
    color:  '#A07B10',
    bg:     'rgba(233,196,106,0.18)',
    border: 'rgba(233,196,106,0.4)',
    icon:   <PauseCircle style={{ width: 11, height: 11 }} />,
  },
  quit: {
    label:  'Đã nghỉ',
    color:  '#6B7280',
    bg:     'rgba(107,114,128,0.12)',
    border: 'rgba(107,114,128,0.28)',
    icon:   <MinusCircle style={{ width: 11, height: 11 }} />,
  },
};

export function PKBadge({ variant, size = 'md', showIcon = true }: PKBadgeProps) {
  const cfg = BADGE_CONFIG[variant];
  const isSmall = size === 'sm';

  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border"
      style={{
        paddingInline: isSmall ? 8  : 10,
        paddingBlock:  isSmall ? 2  : 4,
        fontSize:      isSmall ? 10 : 11,
        fontWeight:    700,
        color:         cfg.color,
        background:    cfg.bg,
        borderColor:   cfg.border,
        lineHeight:    1,
        whiteSpace:    'nowrap',
      }}
    >
      {showIcon && <span style={{ color: cfg.color }}>{cfg.icon}</span>}
      {cfg.label}
    </span>
  );
}

/** Convenience: get raw config for custom rendering */
export function getBadgeConfig(variant: BadgeVariant) {
  return BADGE_CONFIG[variant];
}
