/**
 * MemberScheduleScreen — VNS PickleTrack
 * Lịch học & Lịch sử tham gia · Hội viên / Học viên
 * Android 390 × 844
 */
import { useState } from 'react';
import {
  ChevronLeft, ChevronRight, Clock, MapPin,
  User, Calendar, CheckCircle2, MinusCircle, Zap, BookOpen,
  XCircle, Filter, TrendingUp, AlertCircle
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   DATA TYPES
   ══════════════════════════════════════════════════════ */
type SessionStatus = 'upcoming' | 'next' | 'present' | 'leave' | 'late' | 'absent' | 'makeup';

interface Session {
  id:        number;
  isoDate:   string;      // YYYY-MM-DD
  dayLabel:  string;      // Thứ Tư
  dateStr:   string;      // 29/04/2026
  dayNum:    number;
  month:     number;
  timeStart: string;
  timeEnd:   string;
  class:     string;
  coach:     string;
  court:     string;
  status:    SessionStatus;
  note?:     string;
}

interface WeekDay {
  dayNum:   number;
  dayShort: string;
  monthNum: number;
  isToday:  boolean;
  hasSession: boolean;
  status?:  SessionStatus;
}

/* ══════════════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════════════ */
const CLASS_INFO = {
  name:  'Beginner A',
  coach: 'Coach Nam',
  court: 'Sân 1',
  time:  '18:00 – 19:30',
};

const ALL_SESSIONS: Session[] = [
  /* ── Upcoming ── */
  {
    id: 1,
    isoDate:  '2026-04-29',
    dayLabel: 'Thứ Tư',
    dateStr:  '29/04/2026',
    dayNum:   29, month: 4,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'next',
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
  /* ── Past ── */
  {
    id: 4,
    isoDate:  '2026-04-27',
    dayLabel: 'Thứ Hai',
    dateStr:  '27/04/2026',
    dayNum:   27, month: 4,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'present',
    note: 'Đã điểm danh',
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
    note: 'Có phép trước',
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
    note: 'Đi muộn 15p',
  },
  {
    id: 7,
    isoDate:  '2026-04-20',
    dayLabel: 'Thứ Hai',
    dateStr:  '20/04/2026',
    dayNum:   20, month: 4,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'present',
  },
  {
    id: 8,
    isoDate:  '2026-03-30',
    dayLabel: 'Thứ Hai',
    dateStr:  '30/03/2026',
    dayNum:   30, month: 3,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'present',
  },
  {
    id: 9,
    isoDate:  '2026-03-27',
    dayLabel: 'Thứ Sáu',
    dateStr:  '27/03/2026',
    dayNum:   27, month: 3,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'absent',
    note: 'Nghỉ không phép',
  },
  {
    id: 10,
    isoDate:  '2026-03-25',
    dayLabel: 'Thứ Tư',
    dateStr:  '25/03/2026',
    dayNum:   25, month: 3,
    timeStart:'18:00', timeEnd:'19:30',
    class: CLASS_INFO.name, coach: CLASS_INFO.coach, court: CLASS_INFO.court,
    status: 'makeup',
    note: 'Học bù buổi vắng 20/03',
  },
];

const WEEK_DAYS: WeekDay[] = [
  { dayNum:27, dayShort:'T2', monthNum:4,  isToday:false, hasSession:true,  status:'present'  },
  { dayNum:28, dayShort:'T3', monthNum:4,  isToday:false, hasSession:false                    },
  { dayNum:29, dayShort:'T4', monthNum:4,  isToday:true,  hasSession:true,  status:'next'     },
  { dayNum:30, dayShort:'T5', monthNum:4,  isToday:false, hasSession:false                    },
  { dayNum:1,  dayShort:'T6', monthNum:5,  isToday:false, hasSession:true,  status:'upcoming' },
  { dayNum:2,  dayShort:'T7', monthNum:5,  isToday:false, hasSession:false                    },
  { dayNum:3,  dayShort:'CN', monthNum:5,  isToday:false, hasSession:false                    },
];

const SESSION_WEEK_COUNT = 3;
const NEXT_SESSION_LABEL = 'Thứ Tư, 18:00';

const MONTHS = [
  { label: 'Tháng 03/2026', key: 'mar', num: 3 },
  { label: 'Tháng 04/2026', key: 'apr', num: 4 },
  { label: 'Tháng 05/2026', key: 'may', num: 5 },
];

const STATUS_CFG: Record<SessionStatus, {
  label: string; color: string; bg: string; border: string;
  Icon:  React.FC<{ style?: React.CSSProperties; className?: string }>;
}> = {
  next:     { label:'Sắp tới',   color:'#0E7C7B', bg:'rgba(14,124,123,0.12)',  border:'rgba(14,124,123,0.28)',  Icon: Zap           },
  upcoming: { label:'Sắp tới',   color:'#6B7280', bg:'rgba(107,114,128,0.09)', border:'rgba(107,114,128,0.22)', Icon: Calendar      },
  present:  { label:'Có mặt',    color:'#2A9D8F', bg:'rgba(42,157,143,0.12)',  border:'rgba(42,157,143,0.26)',  Icon: CheckCircle2  },
  leave:    { label:'Nghỉ phép', color:'#E9C46A', bg:'rgba(233,196,106,0.12)', border:'rgba(233,196,106,0.28)', Icon: MinusCircle   },
  late:     { label:'Trễ',       color:'#E76F51', bg:'rgba(231,111,81,0.12)',  border:'rgba(231,111,81,0.26)',  Icon: CheckCircle2  },
  absent:   { label:'Vắng',      color:'#EF4444', bg:'rgba(239,68,68,0.12)', border:'rgba(239,68,68,0.28)', Icon: XCircle   },
  makeup:   { label:'Học bù',    color:'#815AD5', bg:'rgba(129,90,213,0.12)', border:'rgba(129,90,213,0.28)', Icon: BookOpen },
};

/* ══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════ */
function WeekDayCell({ day, onClick, active }: { day: WeekDay; onClick?: () => void; active?: boolean }) {
  const isSession = day.hasSession;
  const isToday   = day.isToday;
  const isPast    = !isToday && day.status && ['present','leave','late','absent'].includes(day.status ?? '');

  let dotColor = 'transparent';
  if (isSession) {
    if (isToday)            dotColor = 'white';
    else if (isPast)        dotColor = STATUS_CFG[day.status!].color;
    else                    dotColor = '#9CA3AF';
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 active:scale-95 transition-transform ${active ? 'scale-105' : ''}`}
    >
      <span style={{ fontSize: 10, fontWeight: isToday ? 800 : 600, color: isToday ? 'white' : 'rgba(255,255,255,0.45)' }}>
        {day.dayShort}
      </span>
      <div
        className="flex items-center justify-center rounded-2xl transition-all"
        style={{
          width:    isToday ? 38 : 34,
          height:   isToday ? 38 : 34,
          background: isToday ? 'rgba(255,255,255,0.22)' : 'transparent',
          border:   isToday ? '2px solid rgba(255,255,255,0.45)' : '2px solid transparent',
        }}
      >
        <span style={{ fontSize: isToday ? 16 : 14, fontWeight: isToday ? 900 : isSession ? 700 : 500, color: isToday ? 'white' : isSession ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)' }}>
          {day.dayNum}
        </span>
      </div>
      <div className="rounded-full w-1 h-1" style={{ background: dotColor, opacity: isSession ? 1 : 0 }} />
    </button>
  );
}

function SessionCard({ session, onNavigate }: { session: Session; onNavigate?: (screen: string) => void }) {
  const cfg    = STATUS_CFG[session.status];
  const isNext = session.status === 'next';
  const isPast = ['present','leave','late','absent','makeup'].includes(session.status);

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden transition-all"
      style={{
        border:    `1.5px solid ${isNext ? 'rgba(14,124,123,0.22)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: isNext ? '0 6px 24px rgba(14,124,123,0.12)' : '0 2px 10px rgba(0,0,0,0.05)',
      }}
    >
      {isNext && <div style={{ height: 3, background: 'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 100%)' }} />}
      <div className="flex items-stretch gap-0 px-4 py-4">
        {/* Date pillar */}
        <div className="flex flex-col items-center justify-center pr-4 mr-4 flex-shrink-0" style={{ borderRight: '1px solid rgba(0,0,0,0.07)', minWidth: 52 }}>
          <div
            className="flex flex-col items-center justify-center rounded-2xl"
            style={{
              width: 52, height: 58,
              background: isNext ? 'linear-gradient(145deg,#0E7C7B,#2A9D8F)' : 'rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: isNext ? 'white' : '#9CA3AF' }}>
              {session.dayLabel.replace('Thứ ','')}
            </span>
            <span style={{ fontSize: 22, fontWeight: 900, color: isNext ? 'white' : '#9CA3AF' }}>
              {session.dayNum}
            </span>
            <span style={{ fontSize: 9, fontWeight: 600, color: isNext ? 'rgba(255,255,255,0.7)' : '#BBBFC6' }}>
              Th.{session.month}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="font-bold text-sm text-gray-800 truncate">{session.dayLabel}</span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg border" style={{ background: cfg.bg, borderColor: cfg.border }}>
              <cfg.Icon className="w-3 h-3" style={{ color: cfg.color }} />
              <span className="text-[9px] font-bold" style={{ color: cfg.color }}>{cfg.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-bold">{session.timeStart} – {session.timeEnd}</span>
            <span>·</span>
            <span>{session.dateStr}</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {session.court}</span>
            <span className="flex items-center gap-1"><User className="w-3 h-3" /> {session.coach}</span>
          </div>

          {session.note && (
            <div className="mt-2 bg-gray-50 border border-gray-100 px-2 py-1 rounded-lg text-[10px] text-gray-500 italic">
              {session.note}
            </div>
          )}

          {(session.status === 'leave' || session.status === 'absent') && (
            <div className="mt-2.5 flex justify-end">
              <button
                onClick={() => onNavigate?.('member-makeup-register')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-teal-700 active:bg-teal-800 active:scale-95 transition-transform flex items-center gap-1"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Xin học bù
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════ */
export function MemberScheduleScreen({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [activeSegment, setActiveSegment] = useState<'upcoming' | 'history'>('upcoming');
  const [monthIdx, setMonthIdx] = useState(1); // default = Tháng 04/2026
  const [selectedDayNum, setSelectedDayNum] = useState<number>(29);

  const monthNum = MONTHS[monthIdx].num;

  // upcoming list
  const upcomingList = ALL_SESSIONS.filter(s => ['next', 'upcoming'].includes(s.status) && s.month === monthNum);
  const selectedDay = WEEK_DAYS.find(day => day.dayNum === selectedDayNum && day.monthNum === monthNum) ?? WEEK_DAYS.find(day => day.isToday);
  const selectedUpcomingList = upcomingList.filter(session => {
    if (!selectedDay) return true;
    return session.dayNum === selectedDay.dayNum && session.month === selectedDay.monthNum;
  });

  // history list (filtered by month)
  const historyList = ALL_SESSIONS.filter(s =>
    ['present', 'leave', 'late', 'absent', 'makeup'].includes(s.status) && s.month === monthNum
  );

  // filters for history tab
  type FilterKey = 'all' | 'present' | 'nghi' | 'makeup';
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const presentCount = historyList.filter(s => ['present', 'late'].includes(s.status)).length;
  const absentCount = historyList.filter(s => s.status === 'absent').length;
  const leaveCount = historyList.filter(s => s.status === 'leave').length;
  const makeupCount = historyList.filter(s => s.status === 'makeup').length;

  const filteredHistory = activeFilter === 'all'
    ? historyList
    : activeFilter === 'present'
    ? historyList.filter(s => ['present', 'late'].includes(s.status))
    : activeFilter === 'makeup'
    ? historyList.filter(s => s.status === 'makeup')
    : historyList.filter(s => s.status === 'absent' || s.status === 'leave');

  const attendanceRate = historyList.length > 0
    ? Math.round(((presentCount + makeupCount) / historyList.length) * 100)
    : 0;

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F0F4F5' }}>
      {/* HEADER */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 28%,#075E5D 58%,#0E7C7B 82%,#1A8E87 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: -40, right: -30, width: 170, height: 170, borderRadius: '50%', background: 'rgba(255,255,255,0.042)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: -18, left: -14, width: 120, height: 120, borderRadius: '50%', background: 'rgba(42,157,143,0.09)' }} />

        <div className="relative px-5 pt-14 pb-4">
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.48)', fontWeight: 700, letterSpacing: '0.06em' }}>
            HỘI VIÊN
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', letterSpacing: '-0.5px', marginBottom: 6 }}>
            {activeSegment === 'upcoming' ? 'Lịch học của tôi' : 'Lịch sử tham gia'}
          </h1>

          {/* Segment controls */}
          <div className="flex bg-black/20 rounded-xl p-1 mb-3">
            <button
              onClick={() => setActiveSegment('upcoming')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                activeSegment === 'upcoming' ? 'bg-white text-teal-900 shadow' : 'text-white/75 hover:text-white'
              }`}
            >
              Lịch học sắp tới
            </button>
            <button
              onClick={() => setActiveSegment('history')}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                activeSegment === 'history' ? 'bg-white text-teal-900 shadow' : 'text-white/75 hover:text-white'
              }`}
            >
              Lịch sử điểm danh
            </button>
          </div>

          {/* Selector dynamically shown based on tab */}
          {activeSegment === 'upcoming' ? (
            <div className="mt-2">
              <span className="text-xs text-white/75 font-semibold">Chọn tháng:</span>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {MONTHS.map((month, idx) => {
                  const active = idx === monthIdx;
                  return (
                    <button
                      key={month.key}
                      onClick={() => {
                        setMonthIdx(idx);
                        setUnusedFilter();
                      }}
                      className={`shrink-0 px-3 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                        active
                          ? 'bg-white text-teal-900 shadow'
                          : 'bg-white/12 text-white/80 border border-white/15 hover:bg-white/18'
                      }`}
                    >
                      {month.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative pb-2 pt-3">
                <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.40)', fontWeight: 700, letterSpacing: '0.07em', marginBottom: 6 }}>
                  TUẦN NÀY · {MONTHS[monthIdx].label.replace('Tháng ', '')}
                </p>
                <div className="flex items-start justify-between">
                  {WEEK_DAYS.map((day, i) => (
                    <WeekDayCell
                      key={i}
                      day={day}
                      active={selectedDay?.dayNum === day.dayNum && selectedDay?.monthNum === day.monthNum}
                      onClick={() => {
                        setSelectedDayNum(day.dayNum);
                        const nextMonthIdx = MONTHS.findIndex(m => m.num === day.monthNum);
                        if (nextMonthIdx >= 0 && day.monthNum !== monthNum) {
                          setMonthIdx(nextMonthIdx);
                        }
                        setUnusedFilter();
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <span className="text-xs text-white/75 font-semibold">Chọn tháng:</span>
              <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                {MONTHS.map((month, idx) => {
                  const active = idx === monthIdx;
                  return (
                    <button
                      key={month.key}
                      onClick={() => {
                        setMonthIdx(idx);
                        setUnusedFilter();
                      }}
                      className={`shrink-0 px-3 py-2 rounded-xl text-xs font-extrabold transition-all active:scale-95 ${
                        active
                          ? 'bg-white text-teal-900 shadow'
                          : 'bg-white/12 text-white/80 border border-white/15 hover:bg-white/18'
                      }`}
                    >
                      {month.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 overflow-y-auto pb-28">
        {activeSegment === 'upcoming' ? (
          /* ========================================================
             UPCOMING CONTENT
             ======================================================== */
          <div className="px-4 pt-4 space-y-4">
            {/* Summary Banner */}
            <div
              className="flex items-center gap-0 rounded-2xl overflow-hidden"
              style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
            >
              <div className="flex-1 flex flex-col items-center justify-center py-3.5 px-3 border-r border-gray-100">
                <span style={{ fontSize: 24, fontWeight: 900, color: '#0E7C7B', lineHeight: 1 }}>
                  {SESSION_WEEK_COUNT}
                </span>
                <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 600, marginTop: 2, textAlign: 'center' }}>
                  buổi học tuần này
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center py-3.5 px-3">
                <div className="flex items-center gap-1 mb-0.5">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  <span className="text-[10px] text-teal-700 font-extrabold">Buổi kế tiếp</span>
                </div>
                <span style={{ fontSize: 13, fontWeight: 900, color: '#1F2933' }}>
                  {selectedDay ? `${selectedDay.dayShort}, ${selectedDay.dayNum}/${monthNum}` : NEXT_SESSION_LABEL}
                </span>
                <span className="text-[9px] text-gray-400 mt-0.5">
                  {selectedDay ? `Th.${monthNum} · đã chọn từ hàng thứ` : 'Thứ Tư, 29/04/2026'}
                </span>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {selectedUpcomingList.length > 0
                ? selectedUpcomingList.map(s => <SessionCard key={s.id} session={s} onNavigate={onNavigate} />)
                : upcomingList.map(s => <SessionCard key={s.id} session={s} onNavigate={onNavigate} />)}
            </div>

            {/* Footer */}
            <div
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
              style={{ background: 'rgba(14,124,123,0.07)', border: '1.5px solid rgba(14,124,123,0.14)' }}
            >
              <div className="flex items-center justify-center rounded-xl flex-shrink-0 w-9 h-9 bg-teal-100">
                <BookOpen className="w-4 h-4 text-teal-800" />
              </div>
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: 13, fontWeight: 800, color: '#0E7C7B' }}>{CLASS_INFO.name}</p>
                <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 500, marginTop: 1 }}>
                  {CLASS_INFO.coach} · {CLASS_INFO.court} · {CLASS_INFO.time}
                </p>
              </div>
              <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md">Đang học</span>
            </div>
          </div>
        ) : (
          /* ========================================================
             HISTORY CONTENT
             ======================================================== */
          <div className="px-4 pt-4 space-y-4">
            {/* Stats Summary */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-white rounded-xl p-2.5 border border-teal-50 text-center flex flex-col justify-between">
                <span className="text-lg font-black text-teal-800">{presentCount}</span>
                <span className="text-[9px] font-bold text-gray-500">Có mặt</span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-teal-50 text-center flex flex-col justify-between">
                <span className="text-lg font-black text-amber-500">{leaveCount}</span>
                <span className="text-[9px] font-bold text-gray-500">Nghỉ phép</span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-teal-50 text-center flex flex-col justify-between">
                <span className="text-lg font-black text-red-500">{absentCount}</span>
                <span className="text-[9px] font-bold text-gray-500">Vắng</span>
              </div>
              <div className="bg-white rounded-xl p-2.5 border border-teal-50 text-center flex flex-col justify-between">
                <span className="text-lg font-black text-purple-700">{makeupCount}</span>
                <span className="text-[9px] font-bold text-gray-500">Học bù</span>
              </div>
            </div>

            {/* Attendance rate banner */}
            <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center justify-between border border-teal-100/30">
              <div className="flex items-center gap-2">
                <div className="bg-teal-50 p-2 rounded-xl text-teal-800">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-700">Tỷ lệ chuyên cần</h4>
                  <p className="text-[10px] text-gray-400">Có mặt + Học bù trên tổng số buổi</p>
                </div>
              </div>
              <span className="text-lg font-black text-teal-700">{attendanceRate}%</span>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5">
              {[
                { key: 'all', label: 'Tất cả' },
                { key: 'present', label: 'Đã học' },
                { key: 'makeup', label: 'Học bù' },
                { key: 'nghi', label: 'Nghỉ' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key as FilterKey)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    activeFilter === f.key
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* List */}
            {filteredHistory.length === 0 ? (
              <div className="bg-white rounded-2xl py-8 px-4 text-center text-gray-400 text-xs shadow-sm">
                Không tìm thấy dữ liệu điểm danh phù hợp trong tháng này.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredHistory.map(s => <SessionCard key={s.id} session={s} onNavigate={onNavigate} />)}
              </div>
            )}
          </div>
        )}

        <p className="text-center mt-6 px-6 text-[10px] text-gray-400 leading-normal">
          Dữ liệu trên bản prototype dùng để mô phỏng tương tác UAT. Mọi dữ liệu điểm danh thực tế sẽ được cập nhật từ phía HLV.
        </p>
      </div>
    </div>
  );

  function setUnusedFilter() {
    setActiveFilter('all');
  }
}
