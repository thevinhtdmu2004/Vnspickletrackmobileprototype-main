/**
 * MemberAttendanceHistoryScreen — VNS PickleTrack
 * Lịch sử học của tôi · Read-only · Học viên / Hội viên
 * Android 390 × 844
 */
import { useState } from 'react';
import {
  CheckCircle2, XCircle, MinusCircle, Clock,
  ChevronLeft, ChevronRight, TrendingUp,
  AlertCircle, BookOpen, Calendar, Filter
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════ */
type Status = 'present' | 'late' | 'absent' | 'leave' | 'makeup';

interface Session {
  id:        number;
  isoDate:   string;
  dateStr:   string;      // dd/mm/yyyy
  dayLabel:  string;      // Thứ Hai…
  dayNum:    number;
  month:     number;
  timeStart: string;
  timeEnd:   string;
  class:     string;
  court:     string;
  status:    Status;
  deducted:  boolean;     // Trừ buổi: Có / Không
  note?:     string;
}

/* ══════════════════════════════════════════════════════
   STATUS CONFIG
══════════════════════════════════════════════════════ */
const STATUS_CFG: Record<Status, {
  label: string; sublabel: string;
  color: string; bg: string; border: string; trackColor: string;
  Icon:  React.FC<{ style?: React.CSSProperties }>;
}> = {
  present: {
    label: 'Có mặt',    sublabel: 'Tham gia đầy đủ',
    color: '#2A9D8F', bg: 'rgba(42,157,143,0.12)',  border: 'rgba(42,157,143,0.28)', trackColor: '#2A9D8F',
    Icon: CheckCircle2,
  },
  late: {
    label: 'Đi trễ',    sublabel: 'Vào muộn giờ học',
    color: '#F4A261', bg: 'rgba(244,162,97,0.14)',  border: 'rgba(244,162,97,0.32)', trackColor: '#F4A261',
    Icon: Clock,
  },
  absent: {
    label: 'Vắng mặt',  sublabel: 'Không tham gia',
    color: '#E76F51', bg: 'rgba(231,111,81,0.12)',  border: 'rgba(231,111,81,0.28)', trackColor: '#E76F51',
    Icon: XCircle,
  },
  leave: {
    label: 'Nghỉ phép', sublabel: 'Có phép trước',
    color: '#E9C46A', bg: 'rgba(233,196,106,0.18)', border: 'rgba(233,196,106,0.38)', trackColor: '#E9C46A',
    Icon: MinusCircle,
  },
  makeup: {
    label: 'Học bù',    sublabel: 'Buổi học bù',
    color: '#815AD5', bg: 'rgba(129,90,213,0.12)', border: 'rgba(129,90,213,0.28)', trackColor: '#815AD5',
    Icon: BookOpen,
  },
};

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const MONTHS = [
  { label: 'Tháng 03/2026', key: 'mar' },
  { label: 'Tháng 04/2026', key: 'apr' },
  { label: 'Tháng 05/2026', key: 'may' },
];

const ALL_SESSIONS: Session[] = [
  /* ── Tháng 04 ────────────────────────────────── */
  {
    id: 1, isoDate:'2026-04-29', dateStr:'29/04/2026',
    dayLabel:'Thứ Tư',   dayNum:29, month:4,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'present', deducted:true,
  },
  {
    id: 2, isoDate:'2026-04-27', dateStr:'27/04/2026',
    dayLabel:'Thứ Hai',  dayNum:27, month:4,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'late', deducted:true,
    note:'Vào muộn ~10 phút',
  },
  {
    id: 3, isoDate:'2026-04-25', dateStr:'25/04/2026',
    dayLabel:'Thứ Bảy',  dayNum:25, month:4,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'leave', deducted:false,
    note:'Có phép trước',
  },
  {
    id: 4, isoDate:'2026-04-22', dateStr:'22/04/2026',
    dayLabel:'Thứ Tư',   dayNum:22, month:4,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'present', deducted:true,
  },
  {
    id: 5, isoDate:'2026-04-20', dateStr:'20/04/2026',
    dayLabel:'Thứ Hai',  dayNum:20, month:4,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'present', deducted:true,
  },
  /* ── Tháng 03 ────────────────────────────────── */
  {
    id: 6, isoDate:'2026-03-30', dateStr:'30/03/2026',
    dayLabel:'Thứ Hai',  dayNum:30, month:3,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'present', deducted:true,
  },
  {
    id: 7, isoDate:'2026-03-27', dateStr:'27/03/2026',
    dayLabel:'Thứ Sáu',  dayNum:27, month:3,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'absent', deducted:false,
    note:'Không báo trước',
  },
  {
    id: 8, isoDate:'2026-03-25', dateStr:'25/03/2026',
    dayLabel:'Thứ Tư',   dayNum:25, month:3,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'makeup', deducted:true,
    note:'Bù buổi ngày 20/03',
  },
  {
    id: 9, isoDate:'2026-03-23', dateStr:'23/03/2026',
    dayLabel:'Thứ Hai',  dayNum:23, month:3,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'present', deducted:true,
  },
  {
    id: 10, isoDate:'2026-03-20', dateStr:'20/03/2026',
    dayLabel:'Thứ Sáu',  dayNum:20, month:3,
    timeStart:'18:00', timeEnd:'19:30',
    class:'Beginner A', court:'Sân 1',
    status:'late', deducted:true,
    note:'Vào muộn ~5 phút',
  },
];

/* ══════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════ */
function buildSummary(sessions: Session[]) {
  const total    = sessions.length;
  const present  = sessions.filter(s => s.status === 'present').length;
  const late     = sessions.filter(s => s.status === 'late').length;
  const absent   = sessions.filter(s => s.status === 'absent').length;
  const leave    = sessions.filter(s => s.status === 'leave').length;
  const makeup   = sessions.filter(s => s.status === 'makeup').length;
  return { total, present, late, absent, leave, makeup };
}

const MONTH_KEY_MAP: Record<string, number> = { mar: 3, apr: 4, may: 5 };

/* ══════════════════════════════════════════════════════
   SUB-COMPONENTS
══════════════════════════════════════════════════════ */

/** Single summary stat pill */
function SummaryPill({
  label, value, color, bg, border
}: { label:string; value:number; color:string; bg:string; border:string }) {
  return (
    <div
      className="flex flex-col items-center justify-center py-3 px-2 rounded-2xl flex-1"
      style={{ background:bg, border:`1.5px solid ${border}`, minWidth:0 }}
    >
      <span style={{ fontSize:24, fontWeight:900, color, lineHeight:1, letterSpacing:'-1px' }}>
        {value}
      </span>
      <span style={{ fontSize:9, color, fontWeight:700, marginTop:3, opacity:0.8, textAlign:'center', lineHeight:1.3 }}>
        {label}
      </span>
    </div>
  );
}

/** Timeline session card */
function SessionCard({ session, isLast }: { session: Session; isLast: boolean }) {
  const cfg = STATUS_CFG[session.status];

  return (
    <div className="flex gap-3">
      {/* Timeline track */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 32 }}>
        {/* Dot */}
        <div
          className="flex items-center justify-center rounded-full flex-shrink-0 z-10"
          style={{
            width:  28, height:28,
            background: cfg.bg,
            border: `2px solid ${cfg.border}`,
            marginTop: 14,
          }}
        >
          <cfg.Icon style={{ width:13, height:13, color: cfg.color }} />
        </div>
        {/* Connector line */}
        {!isLast && (
          <div
            className="flex-1 w-px mt-1"
            style={{ background: 'rgba(0,0,0,0.08)', minHeight:24 }}
          />
        )}
      </div>

      {/* Card */}
      <div
        className="flex-1 min-w-0 mb-3 bg-white rounded-3xl overflow-hidden"
        style={{
          border:    `1.5px solid ${cfg.border}`,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        }}
      >
        {/* Status color top stripe */}
        <div style={{ height: 3, background: cfg.trackColor, opacity: 0.7 }} />

        <div className="px-4 py-3.5">
          {/* Row 1: date + status badge */}
          <div className="flex items-start justify-between gap-2 mb-2">
            {/* Date block */}
            <div className="flex items-center gap-2.5">
              <div
                className="flex flex-col items-center justify-center rounded-xl flex-shrink-0"
                style={{
                  width:42, height:46,
                  background: 'rgba(0,0,0,0.05)',
                }}
              >
                <span style={{ fontSize:8, color:'#9CA3AF', fontWeight:700, letterSpacing:'0.04em' }}>
                  Th.{session.month}
                </span>
                <span style={{ fontSize:22, fontWeight:900, color:'#1F2933', lineHeight:1.1 }}>
                  {session.dayNum}
                </span>
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:800, color:'#1F2933' }}>
                  {session.dayLabel}
                </p>
                <p style={{ fontSize:10, color:'#9CA3AF', fontWeight:500 }}>
                  {session.dateStr}
                </p>
              </div>
            </div>

            {/* Status badge */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0"
              style={{ background: cfg.bg, border: `1.5px solid ${cfg.border}` }}
            >
              <cfg.Icon style={{ width:11, height:11, color: cfg.color }} />
              <span style={{ fontSize:10, fontWeight:800, color: cfg.color }}>
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="mb-2.5" style={{ height:1, background:'rgba(0,0,0,0.06)' }} />

          {/* Row 2: class + time + court */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2.5">
            <div className="flex items-center gap-1.5">
              <BookOpen style={{ width:11, height:11, color:'#C4C9D4' }} />
              <span style={{ fontSize:12, fontWeight:700, color:'#374151' }}>
                {session.class}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock style={{ width:11, height:11, color:'#C4C9D4' }} />
              <span style={{ fontSize:11, color:'#6B7280', fontWeight:600 }}>
                {session.timeStart} – {session.timeEnd}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar style={{ width:11, height:11, color:'#C4C9D4' }} />
              <span style={{ fontSize:11, color:'#6B7280', fontWeight:600 }}>
                {session.court}
              </span>
            </div>
          </div>

          {/* Row 3: deducted pill + note */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Trừ buổi */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
              style={{
                background: session.deducted ? 'rgba(231,111,81,0.09)' : 'rgba(42,157,143,0.09)',
                border:     session.deducted ? '1px solid rgba(231,111,81,0.22)' : '1px solid rgba(42,157,143,0.22)',
              }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: session.deducted ? '#E76F51' : '#2A9D8F' }}
              />
              <span style={{
                fontSize:  10, fontWeight:700,
                color:     session.deducted ? '#C85A3D' : '#1F8A7D',
              }}>
                Trừ buổi: {session.deducted ? 'Có' : 'Không'}
              </span>
            </div>

            {/* Note */}
            {session.note && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                style={{ background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.08)' }}
              >
                <AlertCircle style={{ width:10, height:10, color:'#9CA3AF' }} />
                <span style={{ fontSize:10, color:'#6B7280', fontWeight:500 }}>
                  {session.note}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export function MemberAttendanceHistoryScreen() {
  const [monthIdx, setMonthIdx] = useState(1);   // Tháng 04 default

  const monthNum  = MONTH_KEY_MAP[MONTHS[monthIdx].key];
  const sessions  = ALL_SESSIONS.filter(s => s.month === monthNum);
  const summary   = buildSummary(sessions);

  /* Attendance rate */
  const rate = sessions.length > 0
    ? Math.round(((summary.present + summary.late + summary.makeup) / sessions.length) * 100)
    : 0;

  /* Active filter tabs */
  type FilterKey = 'all' | Status;
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all',     label: 'Tất cả' },
    { key: 'present', label: 'Có mặt' },
    { key: 'late',    label: 'Đi trễ' },
    { key: 'leave',   label: 'Nghỉ phép' },
    { key: 'absent',  label: 'Vắng' },
    { key: 'makeup',  label: 'Học bù' },
  ];

  const filtered = activeFilter === 'all'
    ? sessions
    : sessions.filter(s => s.status === activeFilter);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F0F4F5' }}>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background:'linear-gradient(148deg,#032C2C 0%,#053E3E 28%,#075E5D 58%,#0E7C7B 82%,#1A8E87 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top:-40,right:-30,width:170,height:170,borderRadius:'50%',background:'rgba(255,255,255,0.042)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-18,left:-14,width:120,height:120,borderRadius:'50%',background:'rgba(42,157,143,0.09)' }} />

        <div className="relative px-5 pt-14 pb-4">
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.48)', fontWeight:700, letterSpacing:'0.06em' }}>
            HỘI VIÊN
          </p>
          <h1 style={{ fontSize:22, fontWeight:900, color:'white', letterSpacing:'-0.4px', marginTop:2, marginBottom:5 }}>
            Lịch sử học của tôi
          </h1>

          {/* Month selector */}
          <div
            className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl"
            style={{ background:'rgba(255,255,255,0.13)', border:'1.5px solid rgba(255,255,255,0.20)' }}
          >
            <button
              onClick={() => { setMonthIdx(i => Math.max(0, i-1)); setActiveFilter('all'); }}
              disabled={monthIdx <= 0}
              className="disabled:opacity-30 active:scale-90 transition-transform"
            >
              <ChevronLeft style={{ width:15, height:15, color:'rgba(255,255,255,0.8)' }} />
            </button>
            <span style={{ fontSize:13, fontWeight:800, color:'white', minWidth:108, textAlign:'center' }}>
              {MONTHS[monthIdx].label}
            </span>
            <button
              onClick={() => { setMonthIdx(i => Math.min(MONTHS.length-1, i+1)); setActiveFilter('all'); }}
              disabled={monthIdx >= MONTHS.length-1}
              className="disabled:opacity-30 active:scale-90 transition-transform"
            >
              <ChevronRight style={{ width:15, height:15, color:'rgba(255,255,255,0.8)' }} />
            </button>
          </div>
        </div>

        {/* ── Attendance rate bar ── */}
        <div className="relative px-5 pb-5">
          <div className="flex items-center justify-between mb-2">
            <span style={{ fontSize:10, color:'rgba(255,255,255,0.45)', fontWeight:700, letterSpacing:'0.05em' }}>
              TỶ LỆ THAM GIA
            </span>
            <span style={{ fontSize:14, fontWeight:900, color:'white' }}>
              {rate}%
            </span>
          </div>
          <div className="rounded-full overflow-hidden" style={{ height:7, background:'rgba(255,255,255,0.16)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width:`${rate}%`, background:'rgba(255,255,255,0.65)' }}
            />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SCROLLABLE BODY
      ════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* ── SUMMARY CARD ── */}
        <div className="px-4 pt-4">
          <div
            className="bg-white rounded-3xl overflow-hidden"
            style={{ border:'1.5px solid rgba(0,0,0,0.07)', boxShadow:'0 4px 20px rgba(0,0,0,0.07)' }}
          >
            {/* Header row */}
            <div
              className="flex items-center justify-between px-4 py-3.5"
              style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width:30, height:30, background:'rgba(14,124,123,0.10)' }}
                >
                  <TrendingUp style={{ width:14, height:14, color:'#0E7C7B' }} />
                </div>
                <p style={{ fontSize:12, fontWeight:900, color:'#1F2933', letterSpacing:'0.04em' }}>
                  TỔNG KẾT {MONTHS[monthIdx].label.toUpperCase()}
                </p>
              </div>
              {/* Total badge */}
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
                style={{ background:'rgba(14,124,123,0.10)', border:'1px solid rgba(14,124,123,0.20)' }}
              >
                <span style={{ fontSize:16, fontWeight:900, color:'#0E7C7B', lineHeight:1 }}>{summary.total}</span>
                <span style={{ fontSize:10, color:'#0E7C7B', fontWeight:700 }}>buổi</span>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-0">
              {[
                { label:'Có mặt',    value: summary.present, ...STATUS_CFG.present  },
                { label:'Đi trễ',    value: summary.late,    ...STATUS_CFG.late     },
                { label:'Học bù',    value: summary.makeup,  ...STATUS_CFG.makeup   },
                { label:'Nghỉ phép', value: summary.leave,   ...STATUS_CFG.leave    },
                { label:'Vắng mặt', value: summary.absent,  ...STATUS_CFG.absent   },
                {
                  label:'Tỷ lệ',     value: rate,
                  color:'#0E7C7B',   bg:'rgba(14,124,123,0.09)', border:'', trackColor:'',
                  Icon: TrendingUp,  sublabel:'', unit: '%',
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center py-4"
                  style={{
                    borderRight:  (i % 3 !== 2) ? '1px solid rgba(0,0,0,0.06)' : 'none',
                    borderBottom: (i < 3)        ? '1px solid rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  <div
                    className="flex items-center justify-center rounded-xl mb-2"
                    style={{ width:32, height:32, background: stat.bg }}
                  >
                    <stat.Icon style={{ width:14, height:14, color: stat.color }} />
                  </div>
                  <span style={{
                    fontSize:   22, fontWeight:900, color: stat.color, lineHeight:1,
                    letterSpacing:'-0.5px',
                  }}>
                    {stat.value}{'unit' in stat ? stat.unit : ''}
                  </span>
                  <span style={{ fontSize:9, color:'#9CA3AF', fontWeight:700, marginTop:3, letterSpacing:'0.03em' }}>
                    {stat.label.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── FILTER CHIPS ── */}
        <div className="px-4 mt-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth:'none' }}>
            <div className="flex items-center gap-1.5 mr-1 flex-shrink-0">
              <Filter style={{ width:12, height:12, color:'#9CA3AF' }} />
            </div>
            {FILTERS.map(f => {
              const isActive = activeFilter === f.key;
              const cfg = f.key !== 'all' ? STATUS_CFG[f.key as Status] : null;
              return (
                <button
                  key={f.key}
                  onClick={() => setActiveFilter(f.key)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl flex-shrink-0 active:scale-95 transition-all"
                  style={{
                    background: isActive ? (cfg ? cfg.bg : 'rgba(14,124,123,0.12)') : 'white',
                    border:     isActive ? `1.5px solid ${cfg ? cfg.border : 'rgba(14,124,123,0.30)'}` : '1.5px solid rgba(0,0,0,0.09)',
                    boxShadow:  isActive ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  {cfg && (
                    <cfg.Icon style={{ width:11, height:11, color: isActive ? cfg.color : '#9CA3AF' }} />
                  )}
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color:    isActive ? (cfg ? cfg.color : '#0E7C7B') : '#6B7280',
                  }}>
                    {f.label}
                    {f.key !== 'all' && cfg && sessions.filter(s => s.status === f.key).length > 0 && (
                      <> ({sessions.filter(s => s.status === f.key).length})</>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TIMELINE ── */}
        <div className="px-4 mt-4">
          {/* Count label */}
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize:12, fontWeight:900, color:'#374151', letterSpacing:'0.04em' }}>
              {activeFilter === 'all' ? 'TOÀN BỘ' : STATUS_CFG[activeFilter as Status]?.label.toUpperCase()}
            </p>
            <span
              className="px-2.5 py-1 rounded-xl"
              style={{ fontSize:11, fontWeight:800, background:'rgba(0,0,0,0.07)', color:'#6B7280' }}
            >
              {filtered.length} buổi
            </span>
          </div>

          {filtered.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div
                className="flex items-center justify-center rounded-3xl"
                style={{ width:64, height:64, background:'rgba(0,0,0,0.06)' }}
              >
                <BookOpen style={{ width:28, height:28, color:'#D1D5DB' }} />
              </div>
              <p style={{ fontSize:14, fontWeight:800, color:'#9CA3AF' }}>Không có dữ liệu</p>
              <p style={{ fontSize:12, color:'#C4C9D4', fontWeight:500 }}>
                Không tìm thấy buổi học nào trong bộ lọc này
              </p>
            </div>
          ) : (
            <div>
              {filtered.map((session, idx) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isLast={idx === filtered.length - 1}
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Read-only notice ── */}
        <p
          className="text-center mt-4 mb-2 px-6"
          style={{ fontSize:10, color:'#C4C9D4', fontWeight:500, lineHeight:1.7 }}
        >
          Lịch sử điểm danh do Coach cập nhật.{'\n'}
          Nếu có sai sót, vui lòng liên hệ Coach hoặc Admin.
        </p>

      </div>
    </div>
  );
}
