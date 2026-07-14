/**
 * PKClassCard — VNS PickleTrack
 * Class information card
 */

import { Clock, MapPin, User, Users, ChevronRight } from 'lucide-react';

export interface PKClassCardProps {
  name:          string;
  schedule:      string;         /* e.g. "Thứ 2 • 07:00 – 08:30" */
  court:         string;         /* e.g. "Sân 1" */
  coach:         string;
  studentCount:  number;
  maxStudents?:  number;
  level?:        'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  colorAccent?:  string;
  onClick?:      () => void;
}

const LEVEL_CFG: Record<string, { color: string; bg: string }> = {
  'Cơ bản':   { color: '#1A7B6E', bg: 'rgba(42,157,143,0.12)'  },
  'Trung cấp':{ color: '#D4762A', bg: 'rgba(244,162,97,0.14)'  },
  'Nâng cao': { color: '#5C3FA8', bg: 'rgba(129,90,213,0.12)'  },
};

export function PKClassCard({
  name, schedule, court, coach,
  studentCount, maxStudents = 12,
  level, colorAccent = '#0E7C7B', onClick,
}: PKClassCardProps) {
  const fillPct     = Math.min((studentCount / maxStudents) * 100, 100);
  const isFull      = studentCount >= maxStudents;
  const lvlCfg      = level ? LEVEL_CFG[level] : null;

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-2xl border border-border shadow-sm active:scale-[0.99] transition-all overflow-hidden"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {/* top accent bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg,${colorAccent},${colorAccent}88)` }} />

      <div className="p-4">
        {/* name row */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ fontSize: 16, fontWeight: 800 }} className="truncate">{name}</span>
              {level && lvlCfg && (
                <span
                  className="px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ fontSize: 10, fontWeight: 700, color: lvlCfg.color, background: lvlCfg.bg }}
                >
                  {level}
                </span>
              )}
            </div>
          </div>
          {onClick && <ChevronRight style={{ width: 16, height: 16, color: '#9CA3AF', flexShrink: 0, marginTop: 2 }} />}
        </div>

        {/* meta grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock style={{ width: 13, height: 13, color: colorAccent, flexShrink: 0 }} />
            <span style={{ fontSize: 12 }}>{schedule}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin style={{ width: 13, height: 13, color: colorAccent, flexShrink: 0 }} />
            <span style={{ fontSize: 12 }}>{court}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground col-span-2">
            <User style={{ width: 13, height: 13, color: colorAccent, flexShrink: 0 }} />
            <span style={{ fontSize: 12 }}>Coach: <span style={{ fontWeight: 600, color: '#1F2933' }}>{coach}</span></span>
          </div>
        </div>

        {/* student count bar */}
        <div
          className="flex items-center gap-3 pt-3"
          style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}
        >
          <Users style={{ width: 14, height: 14, color: colorAccent, flexShrink: 0 }} />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: 11, color: '#6B7280' }}>Học viên</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: isFull ? '#E76F51' : '#1F2933' }}>
                {studentCount}/{maxStudents}
                {isFull && <span style={{ fontSize: 10, fontWeight: 600, color: '#E76F51', marginLeft: 4 }}>Đủ chỗ</span>}
              </span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
              <div
                className="h-full rounded-full"
                style={{
                  width:      `${fillPct}%`,
                  background: isFull
                    ? '#E76F51'
                    : `linear-gradient(90deg,${colorAccent},${colorAccent}BB)`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
