/**
 * PKSessionCard — VNS PickleTrack
 * Today's session card with attendance button
 * States: upcoming | in-progress | done
 */

import { Clock, MapPin, User, ClipboardCheck, CheckCircle2 } from 'lucide-react';

export type SessionState = 'upcoming' | 'in-progress' | 'done';

export interface PKSessionCardProps {
  time:          string;         /* e.g. "07:00 – 08:30" */
  className:     string;
  court:         string;
  coach:         string;
  checkedIn:     number;
  total:         number;
  sessionState?: SessionState;
  onAttendance?: () => void;
}

const STATE_CFG: Record<SessionState, {
  label:        string;
  labelColor:   string;
  labelBg:      string;
  accentColor:  string;
  btnLabel:     string;
  btnBg:        string;
  btnShadow:    string;
  done:         boolean;
}> = {
  upcoming: {
    label:        'Sắp diễn ra',
    labelColor:   '#0E7C7B',
    labelBg:      'rgba(14,124,123,0.1)',
    accentColor:  '#0E7C7B',
    btnLabel:     'Điểm danh',
    btnBg:        'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
    btnShadow:    '0 4px 12px rgba(14,124,123,0.35)',
    done:         false,
  },
  'in-progress': {
    label:        'Đang diễn ra',
    labelColor:   '#1A7B6E',
    labelBg:      'rgba(42,157,143,0.15)',
    accentColor:  '#2A9D8F',
    btnLabel:     'Điểm danh ngay',
    btnBg:        'linear-gradient(135deg,#F4A261,#D4762A)',
    btnShadow:    '0 4px 12px rgba(244,162,97,0.38)',
    done:         false,
  },
  done: {
    label:        'Đã hoàn thành',
    labelColor:   '#6B7280',
    labelBg:      'rgba(107,114,128,0.1)',
    accentColor:  '#9CA3AF',
    btnLabel:     'Đã điểm danh',
    btnBg:        'rgba(107,114,128,0.12)',
    btnShadow:    'none',
    done:         true,
  },
};

export function PKSessionCard({
  time, className, court, coach,
  checkedIn, total,
  sessionState = 'upcoming',
  onAttendance,
}: PKSessionCardProps) {
  const cfg    = STATE_CFG[sessionState];
  const pct    = total > 0 ? (checkedIn / total) * 100 : 0;

  /* pulse dot for in-progress */
  const showPulse = sessionState === 'in-progress';

  return (
    <div
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      {/* left accent stripe */}
      <div className="flex">
        <div style={{ width: 4, background: cfg.accentColor, flexShrink: 0, borderRadius: '0 0 0 0' }} />

        <div className="flex-1 p-4">
          {/* header row */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span style={{ fontSize: 16, fontWeight: 800 }}>{className}</span>

                {/* status chip */}
                <span
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ fontSize: 10, fontWeight: 700, color: cfg.labelColor, background: cfg.labelBg }}
                >
                  {showPulse && (
                    <span
                      className="rounded-full flex-shrink-0"
                      style={{ width: 6, height: 6, background: cfg.labelColor, animation: 'pulse 1.5s infinite' }}
                    />
                  )}
                  {cfg.label}
                </span>
              </div>

              {/* time */}
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Clock style={{ width: 12, height: 12 }} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>{time}</span>
              </div>
            </div>

            {/* check-in counter */}
            <div className="text-right flex-shrink-0 ml-2">
              <p style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, color: cfg.accentColor }}>
                {checkedIn}
              </p>
              <p className="text-muted-foreground" style={{ fontSize: 10 }}>/{total} HV</p>
            </div>
          </div>

          {/* meta row */}
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <MapPin style={{ width: 12, height: 12 }} />
              <span style={{ fontSize: 12 }}>{court}</span>
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <User style={{ width: 12, height: 12 }} />
              <span style={{ fontSize: 12 }}>{coach}</span>
            </span>
          </div>

          {/* progress */}
          <div className="mb-3">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, background: cfg.accentColor }}
              />
            </div>
          </div>

          {/* CTA button */}
          <button
            onClick={cfg.done ? undefined : onAttendance}
            disabled={cfg.done}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl transition-all active:scale-[0.98]"
            style={{
              background: cfg.btnBg,
              boxShadow:  cfg.btnShadow,
              fontSize:   13,
              fontWeight: 700,
              color:      cfg.done ? '#9CA3AF' : '#FFFFFF',
            }}
          >
            {cfg.done
              ? <CheckCircle2 style={{ width: 16, height: 16 }} />
              : <ClipboardCheck style={{ width: 16, height: 16 }} />
            }
            {cfg.btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
