/**
 * PKInputField — VNS PickleTrack
 * Text input with label, placeholder, error state
 * States: default | focused | error | disabled
 */

import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';

export interface PKInputFieldProps {
  label:        string;
  placeholder?: string;
  value?:       string;
  onChange?:    (val: string) => void;
  error?:       string;
  disabled?:    boolean;
  required?:    boolean;
  hint?:        string;
  icon?:        React.ReactNode;
  type?:        'text' | 'number' | 'tel' | 'email';
}

export function PKInputField({
  label, placeholder, value = '', onChange, error,
  disabled = false, required = false, hint, icon, type = 'text',
}: PKInputFieldProps) {
  const [focused, setFocused] = useState(false);

  const hasError = !!error;

  const borderColor = hasError    ? '#E76F51'
    : focused                     ? '#0E7C7B'
    : 'rgba(0,0,0,0.14)';

  const shadowStyle = hasError    ? '0 0 0 3px rgba(231,111,81,0.14)'
    : focused                     ? '0 0 0 3px rgba(14,124,123,0.13)'
    : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: '#1F2933' }}>
          {label}
        </label>
        {required && (
          <span style={{ fontSize: 12, color: '#E76F51', lineHeight: 1 }}>*</span>
        )}
      </div>

      {/* input wrapper */}
      <div style={{ position: 'relative' }}>
        {icon && (
          <div style={{
            position:   'absolute',
            left:       14,
            top:        '50%',
            transform:  'translateY(-50%)',
            color:      focused ? '#0E7C7B' : '#9CA3AF',
            display:    'flex',
            alignItems: 'center',
            pointerEvents: 'none',
            zIndex: 1,
          }}>
            {icon}
          </div>
        )}

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={()  => setFocused(false)}
          onChange={e => onChange?.(e.target.value)}
          style={{
            width:         '100%',
            height:        48,
            paddingInline: icon ? '44px 14px' : '14px',
            background:    disabled ? 'rgba(0,0,0,0.04)' : '#FFFFFF',
            border:        `1.5px solid ${borderColor}`,
            borderRadius:  14,
            fontSize:      14,
            fontWeight:    400,
            color:         disabled ? '#9CA3AF' : '#1F2933',
            outline:       'none',
            boxShadow:     shadowStyle,
            transition:    'all 150ms ease',
            boxSizing:     'border-box',
            cursor:        disabled ? 'not-allowed' : 'text',
          }}
        />
      </div>

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
