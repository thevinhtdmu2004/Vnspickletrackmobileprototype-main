/**
 * PKButton — VNS PickleTrack
 * Variants:  primary | secondary
 * States:    default | pressed | disabled
 * Icon:      optional (left position)
 * Sizes:     md (default) | sm
 */

import React from 'react';

export type PKButtonVariant = 'primary' | 'secondary';
export type PKButtonState   = 'default' | 'pressed' | 'disabled';
export type PKButtonSize    = 'md' | 'sm';

export interface PKButtonProps {
  label:    string;
  icon?:    React.ReactNode;
  variant?: PKButtonVariant;
  state?:   PKButtonState;
  size?:    PKButtonSize;
  fullWidth?: boolean;
  onClick?:   () => void;
}

export function PKButton({
  label,
  icon,
  variant   = 'primary',
  state     = 'default',
  size      = 'md',
  fullWidth = false,
  onClick,
}: PKButtonProps) {
  const isDisabled = state === 'disabled';
  const isPressed  = state === 'pressed';
  const isSmall    = size  === 'sm';

  /* ── Primary styles ── */
  const primaryStyle = (): React.CSSProperties => {
    if (isDisabled) return {
      background: '#C4CECE',
      color:      '#8FA5A5',
      boxShadow:  'none',
      cursor:     'not-allowed',
    };
    if (isPressed)  return {
      background: 'linear-gradient(135deg,#054A49,#075E5D)',
      color:      'rgba(255,255,255,0.85)',
      boxShadow:  '0 2px 8px rgba(14,124,123,0.28)',
      transform:  'scale(0.97)',
    };
    return {
      background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
      color:      '#FFFFFF',
      boxShadow:  '0 4px 14px rgba(14,124,123,0.38)',
    };
  };

  /* ── Secondary styles ── */
  const secondaryStyle = (): React.CSSProperties => {
    if (isDisabled) return {
      background:   'transparent',
      color:        '#BFCCCC',
      border:       '1.5px solid #D4DFDF',
      boxShadow:    'none',
      cursor:       'not-allowed',
    };
    if (isPressed)  return {
      background:   'rgba(14,124,123,0.1)',
      color:        '#075E5D',
      border:       '1.5px solid #0E7C7B',
      boxShadow:    'none',
      transform:    'scale(0.97)',
    };
    return {
      background:   'transparent',
      color:        '#0E7C7B',
      border:       '1.5px solid #0E7C7B',
      boxShadow:    '0 1px 4px rgba(14,124,123,0.12)',
    };
  };

  const baseStyle: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            icon ? 8 : 0,
    height:         isSmall ? 38 : 48,
    paddingInline:  isSmall ? 16 : 22,
    borderRadius:   14,
    fontSize:       isSmall ? 13 : 14,
    fontWeight:     700,
    width:          fullWidth ? '100%' : undefined,
    transition:     'all 150ms ease',
    userSelect:     'none',
    ...(variant === 'primary' ? primaryStyle() : secondaryStyle()),
  };

  return (
    <button
      disabled={isDisabled}
      onClick={isDisabled ? undefined : onClick}
      style={baseStyle}
    >
      {icon && (
        <span style={{ display: 'flex', alignItems: 'center', opacity: isDisabled ? 0.5 : 1 }}>
          {icon}
        </span>
      )}
      {label}
    </button>
  );
}
