/**
 * MemberScheduleScreen — VNS PickleTrack
 * Lịch học của tôi · Read-only · Học viên / Hội viên
 * Android 390 × 844
 */
import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Clock, MapPin,
  User, Calendar, CheckCircle2, PauseCircle,
  MinusCircle, Zap, BookOpen
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   DATA TYPES
══════════════════════════════════════════════════════ */
type SessionStatus = 'upcoming' | 'next' | 'present' | 'leave' | 'late' | 'absent';

interface Session {
  id:        number;
  isoDate:   string;      // YYYY-MM-DD  (for sorting)
  dayLabel:  string;      // Thứ Tư
  dateStr:   string;      // 29/04/2026
  dayNum:    number;      // 29
  month:     number;      // 4
  timeStart: string;
  timeEnd:   string;
  class:     string;
  coach:     string;
  court:     string;
  status:    SessionStatus;
}

/* ── Week strip days (Mon 27/04 → Sun 03/05) ───── */
interface WeekDay {
  dayNum:   number;
  dayShort: string;
  monthNum: number;
  isToday:  boolean;
  hasSession: boolean;
  status?:  SessionStatus;
}

/* ══════════════════════════════════════════════════════
   MOCK DATA  — "today" = 29/04/2026
══════════════════════════════════════════════════════ */
const CLASS_INFO = {
  name:  'Beginner A',
  coach: 'Coach Nam',
  court: 'Sân 1',
  time:  '18:00 – 19:30',
};

const ALL_SESSIONS: Session[] = [
  /* ── Upcoming ───────────────────────────────── */
  {
    id: 1,
    isoDate:  '2026-04-29',
    dayLabel: 'Thứ Tư',
    dateStr:  '29/04/2026',
    dayNum:   29, month: 4,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'next',     // ← closest upcoming (hôm nay)
  },
  {
    id: 2,
    isoDate:  '2026-05-01',
    dayLabel: 'Thứ Sáu',
    dateStr:  '01/05/2026',
    dayNum:   1,  month: 5,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'upcoming',
  },
  {
    id: 3,
    isoDate:  '2026-05-04',
    dayLabel: 'Thứ Hai',
    dateStr:  '04/05/2026',
    dayNum:   4,  month: 5,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'upcoming',
  },
  /* ── Past ───────────────────────────────────── */
  {
    id: 4,
    isoDate:  '2026-04-27',
    dayLabel: 'Thứ Hai',
    dateStr:  '27/04/2026',
    dayNum:   27, month: 4,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'present',
  },
  {
    id: 5,
    isoDate:  '2026-04-25',
    dayLabel: 'Thứ Bảy',
    dateStr:  '25/04/2026',
    dayNum:   25, month: 4,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'leave',
  },
  {
    id: 6,
    isoDate:  '2026-04-23',
    dayLabel: 'Thứ Năm',
    dateStr:  '23/04/2026',
    dayNum:   23, month: 4,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'late',
  },
];

/* ── Week strip: Mon 27/04 – Sun 03/05 ────────── */
const WEEK_DAYS: WeekDay[] = [
  { dayNum:27, dayShort:'T2', monthNum:4,  isToday:false, hasSession:true,  status:'present'  },
  { dayNum:28, dayShort:'T3', monthNum:4,  isToday:false, hasSession:false                    },
  { dayNum:29, dayShort:'T4', monthNum:4,  isToday:true,  hasSession:true,  status:'next'     },
  { dayNum:30, dayShort:'T5', monthNum:4,  isToday:false, hasSession:false                    },
  { dayNum:1,  dayShort:'T6', monthNum:5,  isToday:false, hasSession:true,  status:'upcoming' },
  { dayNum:2,  dayShort:'T7', monthNum:5,  isToday:false, hasSession:false                    },
  { dayNum:3,  dayShort:'CN', monthNum:5,  isToday:false, hasSession:false                    },
];

const SESSION_WEEK_COUNT = 3;   // 27/04 + 29/04 + 01/05
const NEXT_SESSION_LABEL = 'Thứ Tư, 18:00';

/* ══════════════════════════════════════════════════════
   STATUS CONFIG
══════════════════════════════════════════════════════ */
const STATUS_CFG: Record<SessionStatus, {
  label: string; color: string; bg: string; border: string;
  Icon:  React.FC<{ style?: React.CSSProperties }>;
}> = {
  next:     { label:'Sắp tới',   color:'#0E7C7B', bg:'rgba(14,124,123,0.12)',  border:'rgba(14,124,123,0.28)',  Icon: Zap           },
  upcoming: { label:'Sắp tới',   color:'#6B7280', bg:'rgba(107,114,128,0.09)', border:'rgba(107,114,128,0.22)', Icon: Calendar      },
  present:  { label:'Có mặt',   color:'#2A9D8F', bg:'rgba(42,157,143,0.12)',  border:'rgba(42,157,143,0.26)',  Icon: CheckCircle2  },
  leave:    { label:'Nghỉ phép', color:'#E9C46A', bg:'rgba(233,196,106,0.18)', border:'rgba(233,196,106,0.38)', Icon: PauseCircle   },
  late:     { label:'Đi trễ',   color:'#F4A261', bg:'rgba(244,162,97,0.14)',  border:'rgba(244,162,97,0.30)',  Icon: MinusCircle   },
  absent:   { label:'Vắng mặt', color:'#E76F51', bg:'rgba(231,111,81,0.12)',  border:'rgba(231,111,81,0.28)',  Icon: BookOpen      },
};

/* ══════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════ */

/** Week day cell */
function WeekDayCell({ day }: { day: WeekDay }) {
  const isSession = day.hasSession;
  const isToday   = day.isToday;
  const isPast    = !isToday && day.status && ['present','leave','late','absent'].includes(day.status ?? '');

  /* dot color */
  let dotColor = 'transparent';
  if (isSession) {
    if (isToday)            dotColor = 'white';
    else if (isPast)        dotColor = STATUS_CFG[day.status!].color;
    else                    dotColor = '#9CA3AF';
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      {/* Day label */}
      <span
        style={{
          fontSize:   10,
          fontWeight: isToday ? 800 : 600,
          color:      isToday ? 'white' : 'rgba(255,255,255,0.45)',
          letterSpacing: '0.02em',
        }}
      >
        {day.dayShort}
      </span>

      {/* Day number circle */}
      <div
        className="flex items-center justify-center rounded-2xl transition-all"
        style={{
          width:    isToday ? 38 : 34,
          height:   isToday ? 38 : 34,
          background: isToday
            ? 'rgba(255,255,255,0.22)'
            : 'transparent',
          border:   isToday ? '2px solid rgba(255,255,255,0.45)' : '2px solid transparent',
          boxShadow: isToday ? '0 4px 14px rgba(0,0,0,0.18)' : 'none',
        }}
      >
        <span
          style={{
            fontSize:   isToday ? 16 : 14,
            fontWeight: isToday ? 900 : isSession ? 700 : 500,
            color:      isToday ? 'white' : isSession ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
          }}
        >
          {day.dayNum}
        </span>
      </div>

      {/* Session dot */}
      <div
        className="rounded-full transition-all"
        style={{
          width:      isToday ? 6 : 5,
          height:     isToday ? 6 : 5,
          background: dotColor,
          opacity:    isSession ? 1 : 0,
        }}
      />
    </div>
  );
}

/** Session card */
function SessionCard({ session }: { session: Session }) {
  const cfg    = STATUS_CFG[session.status];
  const isNext = session.status === 'next';
  const isPast = ['present','leave','late','absent'].includes(session.status);

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden transition-all"
      style={{
        border:    `1.5px solid ${isNext ? 'rgba(14,124,123,0.22)' : isPast ? 'rgba(0,0,0,0.07)' : 'rgba(0,0,0,0.07)'}`,
        boxShadow: isNext ? '0 6px 24px rgba(14,124,123,0.12)' : '0 2px 10px rgba(0,0,0,0.05)',
        opacity:   isPast ? 0.88 : 1,
      }}
    >
      {/* Top accent for "next" */}
      {isNext && (
        <div style={{ height: 3, background: 'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 100%)' }} />
      )}

      <div className="flex items-stretch gap-0 px-4 py-4">
        {/* Date pillar */}
        <div className="flex flex-col items-center justify-center pr-4 mr-4 flex-shrink-0"
             style={{ borderRight: '1px solid rgba(0,0,0,0.07)', minWidth: 52 }}>
          <div
            className="flex flex-col items-center justify-center rounded-2xl"
            style={{
              width: 52, height: 58,
              background: isNext
                ? 'linear-gradient(145deg,#0E7C7B,#2A9D8F)'
                : isPast
                ? 'rgba(0,0,0,0.06)'
                : 'rgba(14,124,123,0.08)',
              boxShadow: isNext ? '0 6px 16px rgba(14,124,123,0.30)' : 'none',
            }}
          >
            <span style={{
              fontSize:   10,
              fontWeight: 700,
              color:      isNext ? 'rgba(255,255,255,0.7)' : '#9CA3AF',
              letterSpacing: '0.02em',
            }}>
              {session.dayLabel.replace('Thứ ','')}
            </span>
            <span style={{
              fontSize:   24,
              fontWeight: 900,
              lineHeight: 1.1,
              color:      isNext ? 'white' : isPast ? '#9CA3AF' : '#0E7C7B',
            }}>
              {session.dayNum}
            </span>
            <span style={{
              fontSize:  9,
              fontWeight: 600,
              color:     isNext ? 'rgba(255,255,255,0.6)' : '#BBBFC6',
            }}>
              Th.{session.month}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          {/* Day name + badge */}
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-2 min-w-0">
              <span style={{
                fontSize:   15,
                fontWeight: 900,
                color:      isPast ? '#6B7280' : '#1F2933',
                whiteSpace: 'nowrap',
              }}>
                {session.dayLabel}
              </span>
              {isNext && (
                <span
                  className="px-2 py-0.5 rounded-lg flex-shrink-0"
                  style={{ fontSize:9, fontWeight:800, background:'rgba(14,124,123,0.1)', color:'#0E7C7B' }}
                >
                  HÔM NAY
                </span>
              )}
            </div>

            {/* Status badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0"
              style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
            >
              <cfg.Icon style={{ width: 11, height: 11, color: cfg.color }} />
              <span style={{ fontSize:10, fontWeight:800, color: cfg.color }}>{cfg.label}</span>
            </div>
          </div>

          {/* Date + time */}
          <div className="flex items-center gap-1.5 mb-2">
            <Clock style={{ width:12, height:12, color: isPast ? '#BBBFC6' : '#6B7280' }} />
            <span style={{ fontSize:13, fontWeight:700, color: isPast ? '#9CA3AF' : '#374151' }}>
              {session.timeStart} – {session.timeEnd}
            </span>
            <span style={{ fontSize:11, color:'#D1D5DB' }}>·</span>
            <span style={{ fontSize:12, color: isPast ? '#BBBFC6' : '#6B7280', fontWeight:500 }}>
              {session.dateStr}
            </span>
          </div>

          {/* Court + Coach */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <MapPin style={{ width:11, height:11, color:'#C4C9D4' }} />
              <span style={{ fontSize:11, color: isPast ? '#C4C9D4' : '#9CA3AF', fontWeight:600 }}>
                {session.court}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <User style={{ width:11, height:11, color:'#C4C9D4' }} />
              <span style={{ fontSize:11, color: isPast ? '#C4C9D4' : '#9CA3AF', fontWeight:600 }}>
                {session.coach}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
const MONTHS = [
  { label: 'Tháng 03/2026', key: 'mar' },
  { label: 'Tháng 04/2026', key: 'apr' },
  { label: 'Tháng 05/2026', key: 'may' },
];

export function MemberScheduleScreen() {
  const [monthIdx, setMonthIdx] = useState(1);   // default = Tháng 04/2026

  const upcoming  = ALL_SESSIONS.filter(s => ['next','upcoming'].includes(s.status));
  const past      = ALL_SESSIONS.filter(s => ['present','leave','late','absent'].includes(s.status));

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F0F4F5' }}>

      {/* ════════════════════════════════════════
          HEADER  (gradient + week strip)
      ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background:'linear-gradient(148deg,#032C2C 0%,#053E3E 28%,#075E5D 58%,#0E7C7B 82%,#1A8E87 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute pointer-events-none" style={{ top:-40,right:-30,width:170,height:170,borderRadius:'50%',background:'rgba(255,255,255,0.042)' }} />
        <div className="absolute pointer-events-none" style={{ top:14, right:50, width:80, height:80, borderRadius:'50%',background:'rgba(255,255,255,0.028)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-18,left:-14,width:120,height:120,borderRadius:'50%',background:'rgba(42,157,143,0.09)' }} />

        {/* Title row */}
        <div className="relative px-5 pt-14 pb-3">
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.48)', fontWeight:700, letterSpacing:'0.06em' }}>
            LỊCH HỌC
          </p>
          <h1 style={{ fontSize:24, fontWeight:900, color:'white', letterSpacing:'-0.5px', marginBottom:6 }}>
            Lịch học của tôi
          </h1>

          {/* Month selector */}
          <div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{ background:'rgba(255,255,255,0.13)', border:'1.5px solid rgba(255,255,255,0.20)' }}
          >
            <button
              onClick={() => setMonthIdx(i => Math.max(0, i - 1))}
              disabled={monthIdx <= 0}
              className="disabled:opacity-30 active:scale-90 transition-transform"
            >
              <ChevronLeft style={{ width:15, height:15, color:'rgba(255,255,255,0.8)' }} />
            </button>
            <span style={{ fontSize:13, fontWeight:800, color:'white', letterSpacing:'0.02em', minWidth:108, textAlign:'center' }}>
              {MONTHS[monthIdx].label}
            </span>
            <button
              onClick={() => setMonthIdx(i => Math.min(MONTHS.length - 1, i + 1))}
              disabled={monthIdx >= MONTHS.length - 1}
              className="disabled:opacity-30 active:scale-90 transition-transform"
            >
              <ChevronRight style={{ width:15, height:15, color:'rgba(255,255,255,0.8)' }} />
            </button>
          </div>
        </div>

        {/* ── Week strip calendar ── */}
        <div className="relative px-4 pb-2 pt-3">
          {/* Week label */}
          <p style={{ fontSize:9, color:'rgba(255,255,255,0.40)', fontWeight:700, letterSpacing:'0.07em', marginBottom:6 }}>
            TUẦN NÀY  ·  27 Th4 – 3 Th5
          </p>
          <div className="flex items-start justify-between">
            {WEEK_DAYS.map((day, i) => (
              <WeekDayCell key={i} day={day} />
            ))}
          </div>
        </div>

        {/* ── Summary banner ── */}
        <div
          className="mx-4 mb-4 mt-3 flex items-center gap-0 rounded-2xl overflow-hidden"
          style={{ background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.18)' }}
        >
          {/* Left cell */}
          <div className="flex-1 flex flex-col items-center justify-center py-3.5 px-3"
               style={{ borderRight:'1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontSize:28, fontWeight:900, color:'white', lineHeight:1, letterSpacing:'-1px' }}>
              {SESSION_WEEK_COUNT}
            </span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.55)', fontWeight:600, marginTop:2, textAlign:'center' }}>
              buổi trong tuần này
            </span>
          </div>
          {/* Right cell */}
          <div className="flex-1 flex flex-col items-center justify-center py-3.5 px-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap style={{ width:13, height:13, color:'rgba(255,255,255,0.7)' }} />
              <span style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:700 }}>Buổi kế tiếp</span>
            </div>
            <span style={{ fontSize:15, fontWeight:900, color:'white', letterSpacing:'0.01em' }}>
              {NEXT_SESSION_LABEL}
            </span>
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:600, marginTop:1 }}>
              Thứ Tư, 29/04/2026
            </span>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SCROLLABLE BODY
      ════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* ── UPCOMING SESSIONS ── */}
        <div className="px-4 pt-4">
          {/* Section header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width:28, height:28, background:'rgba(14,124,123,0.10)' }}
            >
              <Zap style={{ width:13, height:13, color:'#0E7C7B' }} />
            </div>
            <p style={{ fontSize:12, fontWeight:900, color:'#1F2933', letterSpacing:'0.04em' }}>
              SẮP TỚI
            </p>
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width:22, height:22, background:'rgba(14,124,123,0.10)' }}
            >
              <span style={{ fontSize:11, fontWeight:900, color:'#0E7C7B' }}>{upcoming.length}</span>
            </div>
          </div>

          <div className="space-y-3">
            {upcoming.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="flex items-center gap-3 px-5 my-5">
          <div className="flex-1 h-px" style={{ background:'rgba(0,0,0,0.08)' }} />
          <span style={{ fontSize:10, color:'#C4C9D4', fontWeight:700, letterSpacing:'0.05em' }}>ĐÃ QUA</span>
          <div className="flex-1 h-px" style={{ background:'rgba(0,0,0,0.08)' }} />
        </div>

        {/* ── PAST SESSIONS ── */}
        <div className="px-4">
          {/* Section header */}
          <div className="flex items-center gap-2.5 mb-3">
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width:28, height:28, background:'rgba(0,0,0,0.06)' }}
            >
              <CheckCircle2 style={{ width:13, height:13, color:'#9CA3AF' }} />
            </div>
            <p style={{ fontSize:12, fontWeight:900, color:'#6B7280', letterSpacing:'0.04em' }}>
              ĐÃ QUA
            </p>
            <div
              className="flex items-center justify-center rounded-lg"
              style={{ width:22, height:22, background:'rgba(0,0,0,0.06)' }}
            >
              <span style={{ fontSize:11, fontWeight:900, color:'#9CA3AF' }}>{past.length}</span>
            </div>
          </div>

          {/* Past legend */}
          <div className="flex items-center flex-wrap gap-3 mb-3 px-1">
            {[
              { label:'Có mặt',   color:'#2A9D8F', bg:'rgba(42,157,143,0.12)'  },
              { label:'Nghỉ phép', color:'#E9C46A', bg:'rgba(233,196,106,0.20)' },
              { label:'Đi trễ',   color:'#F4A261', bg:'rgba(244,162,97,0.15)'  },
            ].map((leg, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: leg.color }} />
                <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>{leg.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            {past.map(s => <SessionCard key={s.id} session={s} />)}
          </div>
        </div>

        {/* ── Class info footer ── */}
        <div className="px-4 mt-5">
          <div
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
            style={{ background:'rgba(14,124,123,0.07)', border:'1.5px solid rgba(14,124,123,0.14)' }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width:36, height:36, background:'rgba(14,124,123,0.12)' }}
            >
              <BookOpen style={{ width:16, height:16, color:'#0E7C7B' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:13, fontWeight:800, color:'#0E7C7B' }}>{CLASS_INFO.name}</p>
              <p style={{ fontSize:11, color:'#6B7280', fontWeight:500, marginTop:1 }}>
                {CLASS_INFO.coach} · {CLASS_INFO.court} · {CLASS_INFO.time}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ background:'#2A9D8F' }} />
              <span style={{ fontSize:10, fontWeight:700, color:'#2A9D8F' }}>Đang học</span>
            </div>
          </div>
        </div>

        {/* Read-only notice */}
        <p
          className="text-center mt-4 mb-2 px-6"
          style={{ fontSize:10, color:'#C4C9D4', fontWeight:500, lineHeight:1.6 }}
        >
          Lịch học do Coach cập nhật. Nếu có thay đổi, vui lòng liên hệ Coach hoặc Admin.
        </p>

      </div>{/* /scroll */}
    </div>
  );
}
