/**
 * PKStatusButton — VNS PickleTrack
 * Attendance status selector buttons
 * Types:   present | late | makeup | absent | leave
 * States:  selected | unselected
 */

export type AttendanceStatus = 'present' | 'late' | 'makeup' | 'absent' | 'leave';

export interface PKStatusButtonProps {
  status:    AttendanceStatus;
  selected?: boolean;
  onClick?:  () => void;
}

const STATUS_CONFIG: Record<AttendanceStatus, {
  label:      string;
  color:      string;
  bgSelected: string;
  bgUnsel:    string;
  border:     string;
}> = {
  present: {
    label:      'Có mặt',
    color:      '#1A7B6E',
    bgSelected: 'linear-gradient(135deg,#2A9D8F,#1A7B6E)',
    bgUnsel:    'rgba(42,157,143,0.1)',
    border:     'rgba(42,157,143,0.35)',
  },
  late: {
    label:      'Trễ',
    color:      '#A07B10',
    bgSelected: 'linear-gradient(135deg,#E9C46A,#C49A20)',
    bgUnsel:    'rgba(233,196,106,0.15)',
    border:     'rgba(233,196,106,0.4)',
  },
  makeup: {
    label:      'Học bù',
    color:      '#5C3FA8',
    bgSelected: 'linear-gradient(135deg,#815AD5,#5C3FA8)',
    bgUnsel:    'rgba(129,90,213,0.1)',
    border:     'rgba(129,90,213,0.3)',
  },
  absent: {
    label:      'Vắng',
    color:      '#C85A3D',
    bgSelected: 'linear-gradient(135deg,#E76F51,#C85A3D)',
    bgUnsel:    'rgba(231,111,81,0.1)',
    border:     'rgba(231,111,81,0.3)',
  },
  leave: {
    label:      'Nghỉ phép',
    color:      '#6B7280',
    bgSelected: 'linear-gradient(135deg,#9CA3AF,#6B7280)',
    bgUnsel:    'rgba(107,114,128,0.1)',
    border:     'rgba(107,114,128,0.28)',
  },
};

export function PKStatusButton({ status, selected = false, onClick }: PKStatusButtonProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <button
      onClick={onClick}
      style={{
        display:        'inline-flex',
        alignItems:     'center',
        justifyContent: 'center',
        height:         36,
        paddingInline:  14,
        borderRadius:   10,
        fontSize:       13,
        fontWeight:     selected ? 700 : 500,
        whiteSpace:     'nowrap',
        transition:     'all 150ms ease',
        ...(selected
          ? {
              background: cfg.bgSelected,
              color:      '#FFFFFF',
              border:     '1.5px solid transparent',
              boxShadow:  `0 3px 10px ${cfg.border}`,
              transform:  'scale(1.02)',
            }
          : {
              background: cfg.bgUnsel,
              color:      cfg.color,
              border:     `1.5px solid ${cfg.border}`,
              boxShadow:  'none',
            }),
      }}
    >
      {selected && (
        <span style={{ marginRight: 5, fontSize: 12 }}>✓</span>
      )}
      {cfg.label}
    </button>
  );
}

/** Full status row (all 5 buttons, toggleable) */
export interface PKStatusRowProps {
  value:    AttendanceStatus | null;
  onChange: (s: AttendanceStatus) => void;
}

export function PKStatusRow({ value, onChange }: PKStatusRowProps) {
  const statuses: AttendanceStatus[] = ['present', 'late', 'makeup', 'absent', 'leave'];
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {statuses.map(s => (
        <PKStatusButton
          key={s}
          status={s}
          selected={value === s}
          onClick={() => onChange(s)}
        />
      ))}
    </div>
  );
}
