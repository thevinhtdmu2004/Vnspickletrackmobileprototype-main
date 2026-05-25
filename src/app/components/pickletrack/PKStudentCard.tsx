/**
 * PKStudentCard — VNS PickleTrack
 * Student list card with session progress and status badge
 */

import { Phone, GraduationCap, ChevronRight } from 'lucide-react';
import { PKBadge, BadgeVariant } from './PKBadge';

export interface PKStudentCardProps {
  name:               string;
  phone:              string;
  className:          string;
  totalSessions:      number;
  usedSessions:       number;
  remainingSessions:  number;
  badgeStatus:        BadgeVariant;
  avatarColor?:       string;
  onClick?:           () => void;
}

const AVATAR_COLORS = [
  '#0E7C7B','#2A9D8F','#815AD5','#F4A261','#E76F51','#E9C46A',
];

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export function PKStudentCard({
  name, phone, className, totalSessions,
  usedSessions, remainingSessions, badgeStatus, avatarColor, onClick,
}: PKStudentCardProps) {
  const color     = avatarColor ?? getAvatarColor(name);
  const initials  = name.split(' ').map(p => p[0]).slice(-2).join('').toUpperCase();
  const pct       = totalSessions > 0 ? (usedSessions / totalSessions) * 100 : 0;
  const isLow     = remainingSessions <= 2;

  /* progress bar color */
  const barColor = remainingSessions === 0 ? '#E76F51'
    : remainingSessions <= 2              ? '#F4A261'
    : '#2A9D8F';

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-2xl border border-border shadow-sm active:scale-[0.99] transition-all overflow-hidden"
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="flex items-center gap-3 p-4">
        {/* avatar */}
        <div
          className="flex-shrink-0 rounded-xl flex items-center justify-center"
          style={{ width: 44, height: 44, background: color + '20', color, fontSize: 15, fontWeight: 800 }}
        >
          {initials}
        </div>

        {/* info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span style={{ fontSize: 15, fontWeight: 700 }} className="truncate">{name}</span>
            <PKBadge variant={badgeStatus} size="sm" />
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: 11 }}>
              <Phone style={{ width: 10, height: 10 }} /> {phone}
            </span>
            <span className="flex items-center gap-1 text-muted-foreground" style={{ fontSize: 11 }}>
              <GraduationCap style={{ width: 10, height: 10 }} /> {className}
            </span>
          </div>
        </div>

        {/* chevron */}
        {onClick && <ChevronRight style={{ width: 16, height: 16, color: '#9CA3AF', flexShrink: 0 }} />}
      </div>

      {/* session bar */}
      <div
        className="px-4 pb-4"
        style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
      >
        <div className="flex items-center justify-between mt-3 mb-1.5">
          <span className="text-muted-foreground" style={{ fontSize: 11 }}>
            Đã học: <span style={{ fontWeight: 700, color: '#1F2933' }}>{usedSessions}/{totalSessions}</span> buổi
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, color: isLow ? barColor : '#1F2933' }}>
            Còn {remainingSessions} buổi
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${pct}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  );
}
