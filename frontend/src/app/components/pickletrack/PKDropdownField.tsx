/**
 * PKDropdownField — VNS PickleTrack
 * Select / dropdown with label, selected value, error state
 * States: default | open | error | disabled
 */

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, AlertCircle, Check } from 'lucide-react';

export interface PKDropdownFieldProps {
  label:        string;
  options:      string[];
  value?:       string;
  placeholder?: string;
  onChange?:    (val: string) => void;
  error?:       string;
  disabled?:    boolean;
  required?:    boolean;
  hint?:        string;
  icon?:        React.ReactNode;
}

export function PKDropdownField({
  label, options, value = '', placeholder = 'Chọn...', onChange,
  error, disabled = false, required = false, hint, icon,
}: PKDropdownFieldProps) {
  const [open,    setOpen]    = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setFocused(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const hasError     = !!error;
  const hasSelection = !!value;

  const borderColor = hasError ? '#E76F51'
    : (open || focused)        ? '#0E7C7B'
    : 'rgba(0,0,0,0.14)';

  const shadowStyle = hasError       ? '0 0 0 3px rgba(231,111,81,0.14)'
    : (open || focused)              ? '0 0 0 3px rgba(14,124,123,0.13)'
    : 'none';

  function select(opt: string) {
    onChange?.(opt);
    setOpen(false);
    setFocused(false);
  }

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 6, position: 'relative' }}>
      {/* label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1F2933' }}>
          {label}
        </label>
        {required && (
          <span style={{ fontSize: 12, color: '#E76F51' }}>*</span>
        )}
      </div>

      {/* trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(o => !o); setFocused(true); } }}
        style={{
          width:          '100%',
          height:         48,
          paddingInline:  icon ? '44px 14px' : '14px',
          background:     disabled ? 'rgba(0,0,0,0.04)' : '#FFFFFF',
          border:         `1.5px solid ${borderColor}`,
          borderRadius:   14,
          fontSize:       14,
          fontWeight:     hasSelection ? 500 : 400,
          color:          hasSelection ? '#1F2933' : '#9CA3AF',
          textAlign:      'left',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            8,
          boxShadow:      shadowStyle,
          transition:     'all 150ms ease',
          cursor:         disabled ? 'not-allowed' : 'pointer',
          boxSizing:      'border-box',
        }}
      >
        {/* leading icon */}
        {icon && (
          <span style={{ position: 'absolute', left: 14, display: 'flex', alignItems: 'center', color: open ? '#0E7C7B' : '#9CA3AF' }}>
            {icon}
          </span>
        )}

        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>

        <ChevronDown
          style={{
            width:      18,
            height:     18,
            flexShrink: 0,
            color:      open ? '#0E7C7B' : '#9CA3AF',
            transition: 'transform 200ms ease',
            transform:  open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {/* dropdown list */}
      {open && (
        <div
          style={{
            position:   'absolute',
            top:        'calc(100% - 2px)',
            left:       0,
            right:      0,
            zIndex:     50,
            background: '#FFFFFF',
            border:     '1.5px solid rgba(14,124,123,0.3)',
            borderRadius: 14,
            boxShadow:  '0 8px 24px rgba(0,0,0,0.12)',
            overflow:   'hidden',
            animation:  'slideUpIn 150ms ease both',
          }}
        >
          {options.map((opt, i) => (
            <button
              key={opt}
              type="button"
              onClick={() => select(opt)}
              style={{
                width:          '100%',
                padding:        '12px 14px',
                textAlign:      'left',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'space-between',
                fontSize:       14,
                fontWeight:     opt === value ? 700 : 400,
                color:          opt === value ? '#0E7C7B' : '#1F2933',
                background:     opt === value ? 'rgba(14,124,123,0.08)' : 'transparent',
                borderBottom:   i < options.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                cursor:         'pointer',
                transition:     'background 100ms',
              }}
            >
              {opt}
              {opt === value && (
                <Check style={{ width: 15, height: 15, color: '#0E7C7B', flexShrink: 0 }} />
              )}
            </button>
          ))}
        </div>
      )}

      {/* hint / error */}
      {(hint && !hasError) && (
        <p style={{ fontSize: 11, color: '#9CA3AF', margin: 0 }}>{hint}</p>
      )}
      {hasError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <AlertCircle style={{ width: 13, height: 13, color: '#E76F51', flexShrink: 0 }} />
          <p style={{ fontSize: 12, color: '#E76F51', margin: 0 }}>{error}</p>
        </div>
      )}
    </div>
  );
}
