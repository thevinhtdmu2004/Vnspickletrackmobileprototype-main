/**
 * PKMetricCard — VNS PickleTrack
 * Dashboard summary metric card
 * Variants: primary | success | accent | warning | danger
 */

import React from 'react';

export type MetricVariant = 'primary' | 'success' | 'accent' | 'warning' | 'danger';

export interface PKMetricCardProps {
  number:    string | number;
  label:     string;
  icon:      React.ReactNode;
  variant?:  MetricVariant;
  sub?:      string;
  trend?:    { value: string; up: boolean };
  onClick?:  () => void;
}

const VARIANT_CONFIG: Record<MetricVariant, {
  color:    string;
  bg:       string;
  iconBg:   string;
  border:   string;
  gradient: string;
}> = {
  primary: {
    color:    '#0E7C7B',
    bg:       'rgba(14,124,123,0.07)',
    iconBg:   'rgba(14,124,123,0.14)',
    border:   'rgba(14,124,123,0.22)',
    gradient: 'linear-gradient(135deg,rgba(14,124,123,0.08),rgba(42,157,143,0.04))',
  },
  success: {
    color:    '#2A9D8F',
    bg:       'rgba(42,157,143,0.07)',
    iconBg:   'rgba(42,157,143,0.15)',
    border:   'rgba(42,157,143,0.22)',
    gradient: 'linear-gradient(135deg,rgba(42,157,143,0.08),rgba(42,157,143,0.03))',
  },
  accent: {
    color:    '#D4762A',
    bg:       'rgba(244,162,97,0.07)',
    iconBg:   'rgba(244,162,97,0.18)',
    border:   'rgba(244,162,97,0.28)',
    gradient: 'linear-gradient(135deg,rgba(244,162,97,0.1),rgba(244,162,97,0.04))',
  },
  warning: {
    color:    '#A07B10',
    bg:       'rgba(233,196,106,0.1)',
    iconBg:   'rgba(233,196,106,0.25)',
    border:   'rgba(233,196,106,0.35)',
    gradient: 'linear-gradient(135deg,rgba(233,196,106,0.12),rgba(233,196,106,0.04))',
  },
  danger: {
    color:    '#C85A3D',
    bg:       'rgba(231,111,81,0.07)',
    iconBg:   'rgba(231,111,81,0.15)',
    border:   'rgba(231,111,81,0.25)',
    gradient: 'linear-gradient(135deg,rgba(231,111,81,0.08),rgba(231,111,81,0.03))',
  },
};

export function PKMetricCard({ number, label, icon, variant = 'primary', sub, trend, onClick }: PKMetricCardProps) {
  const cfg = VARIANT_CONFIG[variant];

  return (
    <div
      onClick={onClick}
      style={{
        background:   '#FFFFFF',
        borderRadius: 18,
        border:       `1px solid ${cfg.border}`,
        padding:      '14px 16px',
        boxShadow:    '0 2px 8px rgba(0,0,0,0.05)',
        cursor:       onClick ? 'pointer' : 'default',
        position:     'relative',
        overflow:     'hidden',
      }}
    >
      {/* background tint */}
      <div style={{
        position: 'absolute', inset: 0,
        background: cfg.gradient,
        pointerEvents: 'none',
      }} />

      {/* icon */}
      <div style={{
        width:          38,
        height:         38,
        borderRadius:   12,
        background:     cfg.iconBg,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        marginBottom:   10,
        color:          cfg.color,
        position:       'relative',
      }}>
        {icon}
      </div>

      {/* number */}
      <div style={{
        fontSize:      28,
        fontWeight:    900,
        lineHeight:    1,
        color:         cfg.color,
        marginBottom:  4,
        position:      'relative',
      }}>
        {number}
      </div>

      {/* label */}
      <div style={{
        fontSize:  12,
        fontWeight: 500,
        color:     '#6B7280',
        position:  'relative',
      }}>
        {label}
      </div>

      {/* sub / trend */}
      {(sub || trend) && (
        <div style={{
          marginTop: 8,
          paddingTop: 8,
          borderTop: `1px solid ${cfg.border}`,
          display:   'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position:  'relative',
        }}>
          {sub && (
            <span style={{ fontSize: 11, color: '#6B7280' }}>{sub}</span>
          )}
          {trend && (
            <span style={{
              fontSize:   10,
              fontWeight: 700,
              color:      trend.up ? '#2A9D8F' : '#E76F51',
            }}>
              {trend.up ? '↑' : '↓'} {trend.value}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
