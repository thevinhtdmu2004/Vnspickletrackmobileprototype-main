import { useState, useMemo } from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, TrendingUp,
  Clock, MapPin, BookOpen, CheckCircle2, XCircle,
  AlertCircle, RotateCcw, Minus, Shield,
  CalendarDays, SlidersHorizontal, User, Filter
} from 'lucide-react';

/* ─── Status config ─────────────────────────────────────────── */
const STATUS_CFG = {
  present: {
    label: 'Có mặt',   color:'#1A7B6E', bg:'rgba(42,157,143,0.12)',
    border:'rgba(42,157,143,0.3)', dot:'#2A9D8F',
    Icon: CheckCircle2,
    deductSession: true,
  },
  late: {
    label: 'Trễ',      color:'#A07B10', bg:'rgba(233,196,106,0.16)',
    border:'rgba(233,196,106,0.4)', dot:'#E9C46A',
    Icon: AlertCircle,
    deductSession: true,
  },
  leave: {
    label: 'Nghỉ phép',color:'#4B6CB7', bg:'rgba(75,108,183,0.1)',
    border:'rgba(75,108,183,0.3)', dot:'#4B6CB7',
    Icon: Shield,
    deductSession: false,
  },
  absent: {
    label: 'Vắng',     color:'#C85A3D', bg:'rgba(231,111,81,0.1)',
    border:'rgba(231,111,81,0.3)', dot:'#E76F51',
    Icon: XCircle,
    deductSession: false,
  },
  makeup: {
    label: 'Học bù',   color:'#6B3FA8', bg:'rgba(129,90,213,0.1)',
    border:'rgba(129,90,213,0.3)', dot:'#815AD5',
    Icon: RotateCcw,
    deductSession: true,
  },
};

type StatusKey = keyof typeof STATUS_CFG;

/* ─── Records ────────────────────────────────────────────────── */
interface Rec {
  id:        number;
  fullDate:  string;   // DD/MM/YYYY
  dayOfWeek: string;   // Thứ ...
  class:     string;
  timeStart: string;
  timeEnd:   string;
  court:     string;
  coach:     string;
  status:    StatusKey;
  note?:     string;
}

const RECORDS: Rec[] = [
  {
    id:1,  fullDate:'29/04/2026', dayOfWeek:'Thứ Tư',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 1', coach:'Coach Nam',
    status:'present',
  },
  {
    id:2,  fullDate:'27/04/2026', dayOfWeek:'Thứ Hai',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 1', coach:'Coach Nam',
    status:'late', note:'Đến muộn 12 phút',
  },
  {
    id:3,  fullDate:'25/04/2026', dayOfWeek:'Thứ Bảy',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 1', coach:'Coach Nam',
    status:'leave', note:'Nghỉ có phép — báo trước 1 ngày',
  },
  {
    id:4,  fullDate:'23/04/2026', dayOfWeek:'Thứ Năm',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 1', coach:'Coach Nam',
    status:'absent',
  },
  {
    id:5,  fullDate:'20/04/2026', dayOfWeek:'Thứ Hai',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 2', coach:'Coach Nam',
    status:'present',
  },
  {
    id:6,  fullDate:'17/04/2026', dayOfWeek:'Thứ Sáu',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 1', coach:'Coach Nam',
    status:'makeup', note:'Bù buổi 13/04 — nghỉ phép',
  },
  {
    id:7,  fullDate:'15/04/2026', dayOfWeek:'Thứ Tư',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 1', coach:'Coach Nam',
    status:'present',
  },
  {
    id:8,  fullDate:'13/04/2026', dayOfWeek:'Thứ Hai',
    class:'Beginner A', timeStart:'18:00', timeEnd:'19:30', court:'Sân 2', coach:'Coach Nam',
    status:'leave', note:'Xin nghỉ — công tác',
  },
];

/* ─── Student data ───────────────────────────────────────────── */
const STUDENT = { name:'Nguyễn Văn A', initials:'NA', total:12, attended:5, remaining:7 };

/* ─── Months ─────────────────────────────────────────────────── */
const MONTHS = ['Tháng 02/2026','Tháng 03/2026','Tháng 04/2026'];

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
interface Props { onBack: () => void; }

export function AttendanceHistoryScreen({ onBack }: Props) {

  const [monthIdx,    setMonthIdx]    = useState(2);
  const [statusFilter,setStatusFilter]= useState<StatusKey | null>(null);

  /* filtered list */
  const filtered = useMemo(() =>
    statusFilter ? RECORDS.filter(r => r.status === statusFilter) : RECORDS,
    [statusFilter]
  );

  /* stats */
  const stats = useMemo(() => ({
    present: RECORDS.filter(r => r.status === 'present').length,
    late:    RECORDS.filter(r => r.status === 'late').length,
    leave:   RECORDS.filter(r => r.status === 'leave').length,
    absent:  RECORDS.filter(r => r.status === 'absent').length,
    makeup:  RECORDS.filter(r => r.status === 'makeup').length,
  }), []);

  const deducted    = RECORDS.filter(r => STATUS_CFG[r.status].deductSession).length;
  const notDeducted = RECORDS.length - deducted;
  const attendRate  = Math.round((stats.present + stats.late + stats.makeup) / RECORDS.length * 100);

  /* ─── Status chip for filter ─── */
  function FilterChip({ sKey }: { sKey: StatusKey | null }) {
    const active    = statusFilter === sKey;
    const cfg       = sKey ? STATUS_CFG[sKey] : null;
    const count     = sKey ? stats[sKey] : RECORDS.length;
    const label     = cfg ? cfg.label : 'Tất cả';
    const color     = cfg ? cfg.color : '#0E7C7B';
    const bg        = cfg ? cfg.bg    : 'rgba(14,124,123,0.1)';
    const border    = cfg ? cfg.border: 'rgba(14,124,123,0.3)';

    return (
      <button
        onClick={() => setStatusFilter(active ? null : sKey)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0 transition-all active:scale-95"
        style={{
          background: active ? bg                       : 'white',
          border:     `1.5px solid ${active ? border   : 'rgba(0,0,0,0.1)'}`,
          boxShadow:  active ? `0 2px 8px ${color}20`  : 'none',
        }}
      >
        {sKey && (
          <div className="w-2 h-2 rounded-full flex-shrink-0"
               style={{ background: active ? cfg!.dot : '#D1D5DB' }} />
        )}
        <span style={{ fontSize:11, fontWeight: active ? 800 : 600, color: active ? color : '#6B7280' }}>
          {label}
        </span>
        <span className="px-1.5 py-0.5 rounded-full"
              style={{ fontSize:9, fontWeight:800, background: active ? color : 'rgba(0,0,0,0.07)', color: active ? 'white' : '#9CA3AF' }}>
          {count}
        </span>
      </button>
    );
  }

  /* ─────────────────────────────────── RENDER ─── */
  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* ══ HEADER ══ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(150deg,#032E2E 0%,#054A49 35%,#0E7C7B 75%,#2A9D8F 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top:-22, right:-18, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div className="relative px-4 pt-12 pb-5">
          {/* top row */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width:18, height:18, color:'white' }} />
            </button>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.04em' }}>
                {STUDENT.name}
              </p>
              <h1 style={{ fontSize:19, fontWeight:900, color:'white', lineHeight:1.2 }}>
                Lịch sử điểm danh
              </h1>
            </div>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.3)', fontSize:12, fontWeight:900, color:'white' }}>
              {STUDENT.initials}
            </div>
          </div>

          {/* Quick stats in header */}
          <div className="grid grid-cols-4 gap-2">
            {([
              { key:'present', label:'Có mặt' },
              { key:'late',    label:'Trễ'    },
              { key:'leave',   label:'Phép'   },
              { key:'absent',  label:'Vắng'   },
            ] as { key: StatusKey; label: string }[]).map(s => {
              const cfg = STATUS_CFG[s.key];
              const isActive = statusFilter === s.key;
              return (
                <button key={s.key}
                        onClick={() => setStatusFilter(isActive ? null : s.key)}
                        className="flex flex-col items-center py-2.5 rounded-2xl transition-all active:scale-95"
                        style={{
                          background: isActive ? cfg.dot + '35' : 'rgba(255,255,255,0.12)',
                          border:     `1.5px solid ${isActive ? cfg.dot + '60' : 'transparent'}`,
                        }}>
                  <span style={{ fontSize:20, fontWeight:900, color: isActive ? cfg.dot : 'white', lineHeight:1 }}>
                    {stats[s.key]}
                  </span>
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.6)', marginTop:3, fontWeight:600 }}>
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ SCROLLABLE BODY ══ */}
      <div className="flex-1 overflow-y-auto pb-8">

        {/* ─── Student summary card ─── */}
        <div className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden"
             style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3.5 px-4 py-3.5" style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
            {/* avatar */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(14,124,123,0.1)', border:'1.5px solid rgba(14,124,123,0.2)', fontSize:13, fontWeight:900, color:'#0E7C7B' }}>
              {STUDENT.initials}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:15, fontWeight:900, color:'#1F2933' }}>{STUDENT.name}</p>
              <p style={{ fontSize:11, color:'#9CA3AF' }}>Beginner A · Coach Nam</p>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                 style={{ background:'rgba(14,124,123,0.08)', border:'1px solid rgba(14,124,123,0.2)' }}>
              <TrendingUp style={{ width:11, height:11, color:'#0E7C7B' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#0E7C7B' }}>{attendRate}%</span>
            </div>
          </div>

          {/* session stats */}
          <div className="grid grid-cols-3 divide-x" style={{ '--tw-divide-opacity':1 } as React.CSSProperties}>
            {[
              { label:'Tổng buổi', value:STUDENT.total,     color:'#1F2933'  },
              { label:'Đã học',    value:STUDENT.attended,  color:'#6B7280'  },
              { label:'Còn lại',   value:STUDENT.remaining, color:'#2A9D8F'  },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center py-3 px-2">
                <span style={{ fontSize:22, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</span>
                <span style={{ fontSize:10, color:'#9CA3AF', marginTop:3, fontWeight:600 }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* progress bar */}
          <div className="px-4 pb-3.5 pt-0">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
              <div className="h-full rounded-full" style={{ width:`${STUDENT.attended/STUDENT.total*100}%`, background:'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }} />
            </div>
          </div>
        </div>

        {/* ─── Month selector + Deduct summary ─── */}
        <div className="mx-4 mt-3 flex items-center gap-2">
          {/* month nav */}
          <div className="flex items-center gap-1 px-2 py-2 bg-white rounded-2xl flex-shrink-0"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)' }}>
            <button onClick={() => setMonthIdx(i => Math.max(0, i-1))}
                    disabled={monthIdx === 0}
                    className="w-7 h-7 rounded-xl flex items-center justify-center active:scale-90 transition-all"
                    style={{ background: monthIdx === 0 ? 'transparent' : 'rgba(14,124,123,0.08)' }}>
              <ChevronLeft style={{ width:14, height:14, color: monthIdx === 0 ? '#D1D5DB' : '#0E7C7B' }} />
            </button>
            <div className="flex items-center gap-1.5 px-1">
              <CalendarDays style={{ width:11, height:11, color:'#0E7C7B' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#1F2933', whiteSpace:'nowrap' }}>
                {MONTHS[monthIdx]}
              </span>
            </div>
            <button onClick={() => setMonthIdx(i => Math.min(MONTHS.length-1, i+1))}
                    disabled={monthIdx === MONTHS.length-1}
                    className="w-7 h-7 rounded-xl flex items-center justify-center active:scale-90 transition-all"
                    style={{ background: monthIdx === MONTHS.length-1 ? 'transparent' : 'rgba(14,124,123,0.08)' }}>
              <ChevronRight style={{ width:14, height:14, color: monthIdx === MONTHS.length-1 ? '#D1D5DB' : '#0E7C7B' }} />
            </button>
          </div>

          {/* deduct summary chips */}
          <div className="flex gap-2 flex-1 justify-end">
            <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
                 style={{ background:'rgba(244,162,97,0.1)', border:'1px solid rgba(244,162,97,0.3)' }}>
              <Minus style={{ width:10, height:10, color:'#C97B38' }} />
              <span style={{ fontSize:10, fontWeight:800, color:'#C97B38' }}>{deducted} trừ</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl"
                 style={{ background:'rgba(42,157,143,0.08)', border:'1px solid rgba(42,157,143,0.25)' }}>
              <CheckCircle2 style={{ width:10, height:10, color:'#2A9D8F' }} />
              <span style={{ fontSize:10, fontWeight:800, color:'#2A9D8F' }}>{notDeducted} giữ</span>
            </div>
          </div>
        </div>

        {/* ─── Status filter chips ─── */}
        <div className="mt-3 pl-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Filter style={{ width:11, height:11, color:'#9CA3AF' }} />
              <span style={{ fontSize:10, fontWeight:700, color:'#9CA3AF' }}>Lọc:</span>
            </div>
            <FilterChip sKey={null} />
            {(Object.keys(STATUS_CFG) as StatusKey[]).map(k => (
              <FilterChip key={k} sKey={k} />
            ))}
          </div>
        </div>

        {/* ─── Deduct legend ─── */}
        <div className="mx-4 mt-3 flex items-center gap-3 px-3.5 py-2.5 rounded-xl"
             style={{ background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.07)' }}>
          <span style={{ fontSize:10, fontWeight:700, color:'#9CA3AF' }}>TRỪ BUỔI:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background:'#F4A261' }} />
            <span style={{ fontSize:10, color:'#6B7280', fontWeight:600 }}>Có = buổi bị trừ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background:'#2A9D8F' }} />
            <span style={{ fontSize:10, color:'#6B7280', fontWeight:600 }}>Không = giữ nguyên</span>
          </div>
        </div>

        {/* ─── Result count ─── */}
        <div className="mx-4 mt-4 mb-2 flex items-center justify-between">
          <span style={{ fontSize:12, fontWeight:800, color:'#374151' }}>
            {filtered.length} buổi{statusFilter ? ` · ${STATUS_CFG[statusFilter].label}` : ''}
          </span>
          {statusFilter && (
            <button onClick={() => setStatusFilter(null)}
                    style={{ fontSize:11, color:'#0E7C7B', fontWeight:700 }}>
              Xem tất cả
            </button>
          )}
        </div>

        {/* ─── TIMELINE ─── */}
        <div className="px-4 relative">

          {/* vertical spine line */}
          <div className="absolute left-[46px] top-0 bottom-0 w-px" style={{ background:'rgba(14,124,123,0.12)' }} />

          <div className="space-y-0">
            {filtered.map((rec, idx) => {
              const cfg = STATUS_CFG[rec.status];
              const deducts = cfg.deductSession;
              const isLast  = idx === filtered.length - 1;

              const [day, month] = rec.fullDate.split('/');

              return (
                <div key={rec.id} className="flex gap-3 relative" style={{ paddingBottom: isLast ? 0 : 16 }}>

                  {/* ── Left: date badge + dot ── */}
                  <div className="flex flex-col items-center flex-shrink-0 w-8 relative z-10">
                    {/* date card */}
                    <div className="w-8 rounded-xl flex flex-col items-center py-1.5 mb-2 flex-shrink-0"
                         style={{ background:'white', border:`1.5px solid ${cfg.border}`, boxShadow:`0 2px 8px ${cfg.color}15` }}>
                      <span style={{ fontSize:16, fontWeight:900, color:cfg.color, lineHeight:1 }}>{day}</span>
                      <span style={{ fontSize:8,  fontWeight:700, color:cfg.color+'99', lineHeight:1.2 }}>/{month}</span>
                    </div>
                    {/* timeline dot */}
                    <div className="w-4 h-4 rounded-full flex items-center justify-center"
                         style={{ background:cfg.bg, border:`2px solid ${cfg.dot}`, boxShadow:`0 0 0 3px ${cfg.dot}20` }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background:cfg.dot }} />
                    </div>
                  </div>

                  {/* ── Right: content card ── */}
                  <div className="flex-1 min-w-0 bg-white rounded-2xl overflow-hidden mb-0"
                       style={{ border:`1.5px solid rgba(0,0,0,0.09)`, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>

                    {/* top strip — status color */}
                    <div className="h-1 w-full" style={{ background:cfg.dot }} />

                    <div className="p-3.5">

                      {/* row 1: day + status badge */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize:12, fontWeight:800, color:'#374151' }}>{rec.dayOfWeek}</span>
                          <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:500 }}>{rec.fullDate}</span>
                        </div>
                        {/* Status badge */}
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                             style={{ background:cfg.bg, border:`1.5px solid ${cfg.border}` }}>
                          <cfg.Icon style={{ width:11, height:11, color:cfg.color }} />
                          <span style={{ fontSize:11, fontWeight:800, color:cfg.color }}>{cfg.label}</span>
                        </div>
                      </div>

                      {/* row 2: class info row */}
                      <div className="flex items-center gap-3 flex-wrap mb-2.5">
                        <div className="flex items-center gap-1.5">
                          <BookOpen style={{ width:11, height:11, color:'#9CA3AF' }} />
                          <span style={{ fontSize:12, fontWeight:700, color:'#374151' }}>{rec.class}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock style={{ width:11, height:11, color:'#9CA3AF' }} />
                          <span style={{ fontSize:12, color:'#6B7280' }}>{rec.timeStart} – {rec.timeEnd}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin style={{ width:11, height:11, color:'#9CA3AF' }} />
                          <span style={{ fontSize:12, color:'#6B7280' }}>{rec.court}</span>
                        </div>
                      </div>

                      {/* row 3: note */}
                      {rec.note && (
                        <div className="flex items-start gap-1.5 mb-2.5">
                          <div className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ background:'#D1D5DB' }} />
                          <p style={{ fontSize:11, color:'#9CA3AF', lineHeight:1.5, fontStyle:'italic' }}>{rec.note}</p>
                        </div>
                      )}

                      {/* row 4: TRỪA BUỔI indicator — prominent */}
                      <div className="flex items-center gap-2 pt-2.5" style={{ borderTop:'1px solid rgba(0,0,0,0.07)' }}>
                        <span style={{ fontSize:10, fontWeight:800, color:'#9CA3AF', letterSpacing:'0.04em' }}>
                          TRỪ BUỔI:
                        </span>

                        {deducts ? (
                          /* Có trừ */
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                               style={{ background:'rgba(244,162,97,0.14)', border:'1.5px solid rgba(244,162,97,0.4)' }}>
                            <Minus style={{ width:10, height:10, color:'#C97B38' }} />
                            <span style={{ fontSize:11, fontWeight:900, color:'#C97B38' }}>Có — −1 buổi</span>
                          </div>
                        ) : (
                          /* Không trừ */
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl"
                               style={{ background:'rgba(42,157,143,0.1)', border:'1.5px solid rgba(42,157,143,0.28)' }}>
                            <CheckCircle2 style={{ width:10, height:10, color:'#2A9D8F' }} />
                            <span style={{ fontSize:11, fontWeight:900, color:'#2A9D8F' }}>Không — Giữ nguyên</span>
                          </div>
                        )}

                        {/* deduct reason hint */}
                        <span style={{ fontSize:9, color:'#C0C7D0', marginLeft:'auto', fontWeight:600 }}>
                          {deducts
                            ? (rec.status === 'present' ? 'Tham gia' : 'Đến trễ')
                            : (rec.status === 'leave' ? 'Nghỉ phép' : rec.status === 'makeup' ? 'Học bù' : 'Vắng')
                          }
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* timeline end cap */}
          {filtered.length > 0 && (
            <div className="flex gap-3 items-center mt-2">
              <div className="w-8 flex justify-center">
                <div className="w-3 h-3 rounded-full" style={{ background:'rgba(14,124,123,0.2)', border:'2px solid rgba(14,124,123,0.25)' }} />
              </div>
              <span style={{ fontSize:11, color:'#9CA3AF' }}>
                Bắt đầu ghi nhận — {MONTHS[monthIdx]}
              </span>
            </div>
          )}

          {/* empty state */}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                   style={{ background:'rgba(0,0,0,0.05)' }}>
                <CalendarDays style={{ width:28, height:28, color:'#D1D5DB' }} />
              </div>
              <div className="text-center">
                <p style={{ fontSize:15, fontWeight:800, color:'#6B7280' }}>Không có buổi nào</p>
                <p style={{ fontSize:12, color:'#9CA3AF', marginTop:4 }}>
                  {statusFilter ? `Không có buổi "${STATUS_CFG[statusFilter].label}" trong tháng này.` : 'Chưa có dữ liệu điểm danh.'}
                </p>
              </div>
              {statusFilter && (
                <button onClick={() => setStatusFilter(null)}
                        className="px-4 py-2.5 rounded-xl"
                        style={{ background:'rgba(14,124,123,0.1)', border:'1px solid rgba(14,124,123,0.25)', fontSize:12, fontWeight:700, color:'#0E7C7B' }}>
                  Xem tất cả
                </button>
              )}
            </div>
          )}
        </div>

        {/* ─── Bottom summary ─── */}
        {filtered.length > 0 && (
          <div className="mx-4 mt-6 bg-white rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>

            <div className="flex items-center gap-2 px-4 py-3"
                 style={{ background:'rgba(14,124,123,0.05)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
              <TrendingUp style={{ width:12, height:12, color:'#0E7C7B' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.04em' }}>
                TỔNG KẾT {MONTHS[monthIdx].toUpperCase()}
              </span>
            </div>

            <div className="p-4 space-y-3">
              {/* attendance rate */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize:12, color:'#6B7280', fontWeight:600 }}>Tỷ lệ chuyên cần</span>
                  <span style={{ fontSize:14, fontWeight:900, color:'#0E7C7B' }}>{attendRate}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                  <div className="h-full rounded-full transition-all" style={{ width:`${attendRate}%`, background:'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }} />
                </div>
              </div>

              {/* status breakdown */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {(Object.entries(STATUS_CFG) as [StatusKey, typeof STATUS_CFG.present][]).map(([k, c]) => (
                  <div key={k} className="flex items-center gap-2 py-2 px-3 rounded-xl"
                       style={{ background:c.bg }}>
                    <c.Icon style={{ width:13, height:13, color:c.color }} />
                    <span style={{ fontSize:12, color:c.color, fontWeight:700 }}>{c.label}</span>
                    <span className="ml-auto" style={{ fontSize:13, fontWeight:900, color:c.color }}>{stats[k]}</span>
                  </div>
                ))}
              </div>

              {/* deduct summary */}
              <div className="flex gap-2 pt-1">
                <div className="flex-1 flex items-center justify-between py-2.5 px-3 rounded-xl"
                     style={{ background:'rgba(244,162,97,0.1)', border:'1px solid rgba(244,162,97,0.25)' }}>
                  <div className="flex items-center gap-2">
                    <Minus style={{ width:12, height:12, color:'#C97B38' }} />
                    <span style={{ fontSize:11, color:'#C97B38', fontWeight:700 }}>Đã trừ</span>
                  </div>
                  <span style={{ fontSize:16, fontWeight:900, color:'#C97B38' }}>{deducted}</span>
                </div>
                <div className="flex-1 flex items-center justify-between py-2.5 px-3 rounded-xl"
                     style={{ background:'rgba(42,157,143,0.08)', border:'1px solid rgba(42,157,143,0.2)' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 style={{ width:12, height:12, color:'#2A9D8F' }} />
                    <span style={{ fontSize:11, color:'#2A9D8F', fontWeight:700 }}>Giữ lại</span>
                  </div>
                  <span style={{ fontSize:16, fontWeight:900, color:'#2A9D8F' }}>{notDeducted}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="h-6" />
      </div>
    </div>
  );
}
