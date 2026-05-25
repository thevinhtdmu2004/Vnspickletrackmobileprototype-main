import {
  ArrowLeft, Edit2, Users, CalendarDays, Clock, MapPin,
  User2, CalendarPlus, UserPlus, ChevronRight,
  CheckCircle2, XCircle, AlertTriangle, MinusCircle,
  FileText, Sparkles, BarChart3, ClipboardCheck, Trophy,
  Pen, BookOpen, TrendingUp
} from 'lucide-react';
import { useState } from 'react';

interface ClassDetailScreenProps {
  onBack:            () => void;
  onEdit:            () => void;
  onAssignStudents:  () => void;
  onStudentDetail:   () => void;
  onCreateSession?:  () => void;
  onSessionDetail?:  () => void;
}

type TabType = 'students' | 'sessions' | 'notes';

/* ─── Class ─────────────────────────────────────────────── */
const CLS = {
  name: 'Beginner A', levelLabel: 'Cơ bản', levelColor: '#2A9D8F',
  levelBg: 'rgba(42,157,143,0.14)',
  statusLabel: 'Đang mở', statusColor: '#2A9D8F',
  students: 8, maxStudents: 10,
  coach: 'Coach Nam', court: 'Sân 1',
  days: 'T2 · T4 · T6', startTime: '18:00', endTime: '19:30',
  notes: 'Lớp dành cho người mới bắt đầu.\nYêu cầu mang đủ dụng cụ cá nhân (vợt, bóng, giày thể thao).\nHọc viên cần có mặt trước 5 phút.',
};

/* ─── Students (8 total) ─────────────────────────────────── */
const STUDENTS = [
  { id:1, name:'Nguyễn Văn A',  ini:'VA', color:'#0E7C7B', remaining:7, total:10, status:'active'   },
  { id:2, name:'Trần Thị B',    ini:'TB', color:'#815AD5', remaining:2, total:10, status:'expiring' },
  { id:3, name:'Lê Văn C',      ini:'VC', color:'#E76F51', remaining:0, total:10, status:'expired'  },
  { id:4, name:'Phạm Thị D',    ini:'TD', color:'#2A9D8F', remaining:8, total:10, status:'active'   },
  { id:5, name:'Hoàng Văn E',   ini:'VE', color:'#F4A261', remaining:5, total:10, status:'active'   },
  { id:6, name:'Vũ Ngọc F',     ini:'NF', color:'#264653', remaining:3, total:10, status:'expiring' },
  { id:7, name:'Đặng Văn G',    ini:'VG', color:'#C97B38', remaining:9, total:10, status:'active'   },
  { id:8, name:'Bùi Thị H',     ini:'TH', color:'#5C3FA8', remaining:1, total:10, status:'expiring' },
];

/* ─── Sessions ───────────────────────────────────────────── */
const SESSIONS = [
  { id:1, date:'29/04/2026', dayShort:'T4', status:'done',      attended:8, total:8, note:''         },
  { id:2, date:'27/04/2026', dayShort:'T2', status:'done',      attended:7, total:8, note:''         },
  { id:3, date:'25/04/2026', dayShort:'T6', status:'cancelled', attended:0, total:8, note:'Trời mưa' },
  { id:4, date:'22/04/2026', dayShort:'T4', status:'done',      attended:8, total:8, note:''         },
  { id:5, date:'20/04/2026', dayShort:'T2', status:'done',      attended:6, total:8, note:''         },
];

/* ─── Configs ────────────────────────────────────────────── */
const STU_CFG: Record<string,{label:string;color:string;bg:string}> = {
  active:   { label:'Đang học', color:'#1A7B6E', bg:'rgba(42,157,143,0.11)'  },
  expiring: { label:'Sắp hết',  color:'#C97B38', bg:'rgba(244,162,97,0.14)' },
  expired:  { label:'Hết buổi', color:'#C85A3D', bg:'rgba(231,111,81,0.12)' },
};
const SES_CFG: Record<string,{label:string;color:string;bg:string;Icon:React.FC<{style?:React.CSSProperties}>}> = {
  done:      { label:'Đã điểm danh', color:'#1A7B6E', bg:'rgba(42,157,143,0.11)', Icon: CheckCircle2 },
  cancelled: { label:'Đã hủy',       color:'#C85A3D', bg:'rgba(231,111,81,0.12)', Icon: XCircle      },
  pending:   { label:'Chưa điểm danh',color:'#6B7280', bg:'rgba(0,0,0,0.07)',      Icon: MinusCircle  },
};

/* ─── Helpers ────────────────────────────────────────────── */
const capacityPct = Math.round((CLS.students / CLS.maxStudents) * 100);
const capacityColor = capacityPct >= 90 ? '#E76F51' : capacityPct >= 70 ? '#F4A261' : '#2A9D8F';
const expiringCount = STUDENTS.filter(s => s.status === 'expiring' || s.status === 'expired').length;
const doneCount     = SESSIONS.filter(s => s.status === 'done').length;
const avgAttend     = SESSIONS.filter(s => s.status === 'done').length > 0
  ? Math.round(SESSIONS.filter(s => s.status === 'done').reduce((a, s) => a + s.attended / s.total, 0) / doneCount * 100)
  : 0;

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export function ClassDetailScreen({
  onBack, onEdit, onAssignStudents, onStudentDetail,
  onCreateSession, onSessionDetail,
}: ClassDetailScreenProps) {
  const [tab,       setTab]       = useState<TabType>('students');
  const [noteEdit,  setNoteEdit]  = useState(false);
  const [noteText,  setNoteText]  = useState(CLS.notes);
  const [stuFilter, setStuFilter] = useState<'all' | 'expiring' | 'expired'>('all');

  const filteredStudents = stuFilter === 'all'      ? STUDENTS
    : stuFilter === 'expiring' ? STUDENTS.filter(s => s.status === 'expiring')
    : STUDENTS.filter(s => s.status === 'expired');

  return (
    <div className="flex flex-col h-screen" style={{ background: '#F7F9FA' }}>

      {/* ══════════════════════════════════════════════════════
          HEADER — teal gradient hero
      ══════════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background: 'linear-gradient(150deg,#032E2E 0%,#054A49 30%,#0E7C7B 75%,#2A9D8F 100%)' }}>

        {/* decorative circles */}
        <div className="absolute pointer-events-none" style={{ top:-24, right:-24, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div className="absolute pointer-events-none" style={{ top:8, right:32, width:64, height:64, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-16, left:-16, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        <div className="relative px-4 pt-12 pb-0">

          {/* ── row 1: back + edit ── */}
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width:18, height:18, color:'white' }} />
            </button>

            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.04em' }}>CHI TIẾT LỚP HỌC</p>
              <h1 style={{ fontSize:22, fontWeight:900, color:'white', lineHeight:1.15 }}>{CLS.name}</h1>
            </div>

            <button onClick={onEdit}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl active:scale-90 transition-transform"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <Edit2 style={{ width:14, height:14, color:'white' }} />
              <span style={{ fontSize:12, fontWeight:700, color:'white' }}>Sửa</span>
            </button>
          </div>

          {/* ── row 2: badges ── */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            {/* Level badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                 style={{ background:'rgba(255,255,255,0.16)', border:'1px solid rgba(255,255,255,0.25)' }}>
              <Trophy style={{ width:11, height:11, color:'rgba(255,255,255,0.85)' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'rgba(255,255,255,0.9)' }}>{CLS.levelLabel}</span>
            </div>
            {/* Status badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                 style={{ background:'rgba(42,157,143,0.35)', border:'1px solid rgba(42,157,143,0.5)' }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background:'#7FFFEA' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'white' }}>{CLS.statusLabel}</span>
            </div>
            {/* Spacer */}
            <div className="flex-1" />
            {/* Capacity pill */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                 style={{ background:'rgba(0,0,0,0.25)', border:`1px solid ${capacityColor}55` }}>
              <Users style={{ width:12, height:12, color:capacityColor }} />
              <span style={{ fontSize:13, fontWeight:900, color:'white' }}>
                {CLS.students}
                <span style={{ color:'rgba(255,255,255,0.5)' }}>/{CLS.maxStudents}</span>
              </span>
              <span style={{ fontSize:10, color:'rgba(255,255,255,0.5)' }}>HV</span>
            </div>
          </div>

          {/* ── row 3: quick schedule chips ── */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                 style={{ background:'rgba(255,255,255,0.1)' }}>
              <CalendarDays style={{ width:11, height:11, color:'rgba(255,255,255,0.7)' }} />
              <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>{CLS.days}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                 style={{ background:'rgba(255,255,255,0.1)' }}>
              <Clock style={{ width:11, height:11, color:'rgba(255,255,255,0.7)' }} />
              <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.85)' }}>
                {CLS.startTime} – {CLS.endTime}
              </span>
            </div>
          </div>

          {/* ── capacity progress bar ── */}
          <div className="mb-0">
            <div className="h-1 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.15)' }}>
              <div className="h-full rounded-full"
                   style={{ width:`${capacityPct}%`, background:`rgba(255,255,255,0.7)`, transition:'width 0.6s ease' }} />
            </div>
          </div>

          {/* ── tab bar ── */}
          <div className="flex gap-0 mt-4"
               style={{ borderTop:'1px solid rgba(255,255,255,0.13)' }}>
            {([
              { id:'students', label:'Học viên',  Icon:Users,          count: CLS.students      },
              { id:'sessions', label:'Buổi học',   Icon:ClipboardCheck, count: SESSIONS.length   },
              { id:'notes',    label:'Ghi chú',    Icon:FileText,       count: null              },
            ] as {id:TabType;label:string;Icon:React.FC<{style?:React.CSSProperties}>;count:number|null}[]).map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-3.5 transition-all"
                      style={{
                        borderBottom: tab === t.id ? '2.5px solid white' : '2.5px solid transparent',
                        opacity: tab === t.id ? 1 : 0.55,
                      }}>
                <t.Icon style={{ width:13, height:13, color:'white' }} />
                <span style={{ fontSize:12, fontWeight: tab === t.id ? 800 : 500, color:'white' }}>
                  {t.label}
                </span>
                {t.count !== null && (
                  <span className="px-1.5 py-0.5 rounded-full"
                        style={{ fontSize:9, fontWeight:800,
                                 background: tab === t.id ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                                 color:'white' }}>
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SCROLLABLE BODY
      ══════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Info card + Actions (shown for all tabs) ── */}
        <div className="px-4 pt-4 space-y-3">

          {/* ─── Info card (2×2 grid) ─── */}
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="grid grid-cols-2">
              {[
                { Icon:User2,        label:'Coach',    value:CLS.coach,                        border:'right bottom' },
                { Icon:MapPin,       label:'Sân học',  value:CLS.court,                        border:'bottom'       },
                { Icon:CalendarDays, label:'Lịch học', value:CLS.days,                         border:'right'        },
                { Icon:Clock,        label:'Giờ học',  value:`${CLS.startTime}–${CLS.endTime}`, border:''            },
              ].map((row, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3.5"
                     style={{
                       borderRight:  row.border.includes('right')  ? '1px solid rgba(0,0,0,0.07)' : 'none',
                       borderBottom: row.border.includes('bottom') ? '1px solid rgba(0,0,0,0.07)' : 'none',
                     }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background:'rgba(14,124,123,0.09)' }}>
                    <row.Icon style={{ width:14, height:14, color:'#0E7C7B' }} />
                  </div>
                  <div className="min-w-0">
                    <p style={{ fontSize:10, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.03em' }}>
                      {row.label.toUpperCase()}
                    </p>
                    <p style={{ fontSize:13, fontWeight:800, color:'#1F2933', marginTop:1 }} className="truncate">
                      {row.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── CTA: Tạo buổi học hôm nay ─── */}
          <button
            onClick={onCreateSession}
            className="w-full relative overflow-hidden active:scale-[0.98] transition-all"
            style={{
              borderRadius: 20,
              background:   'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 55%,#38B2A3 100%)',
              boxShadow:    '0 10px 30px rgba(14,124,123,0.45), 0 3px 8px rgba(14,124,123,0.25)',
              padding:      '0',
            }}
          >
            {/* shimmer overlay */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background:'linear-gradient(105deg,transparent 40%,rgba(255,255,255,0.08) 50%,transparent 60%)', animation:'ctaShimmer 3s ease-in-out infinite' }} />

            {/* orange accent top stripe */}
            <div style={{ height:3, background:'linear-gradient(90deg,rgba(255,255,255,0.1),rgba(244,162,97,0.5),rgba(255,255,255,0.1))', borderRadius:'20px 20px 0 0' }} />

            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-4">
                {/* icon block */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                       style={{ background:'rgba(255,255,255,0.22)', border:'1.5px solid rgba(255,255,255,0.3)' }}>
                    <CalendarPlus style={{ width:22, height:22, color:'white' }} />
                  </div>
                  {/* live pulse dot */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                       style={{ background:'#F4A261', border:'2px solid white' }}>
                    <Sparkles style={{ width:9, height:9, color:'white' }} />
                  </div>
                </div>
                {/* text */}
                <div className="text-left">
                  <p style={{ fontSize:16, fontWeight:900, color:'white', lineHeight:1.2 }}>
                    Tạo buổi học hôm nay
                  </p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', marginTop:2 }}>
                    Thứ 4 · 29/04/2026 · {CLS.startTime}–{CLS.endTime}
                  </p>
                </div>
              </div>
              {/* arrow */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{ background:'rgba(255,255,255,0.2)' }}>
                <ChevronRight style={{ width:18, height:18, color:'white' }} />
              </div>
            </div>
          </button>

          {/* ─── Secondary action buttons (2 cols) ─── */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onAssignStudents}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-95 transition-all"
              style={{ background:'rgba(14,124,123,0.08)', border:'1.5px solid rgba(14,124,123,0.25)' }}
            >
              <UserPlus style={{ width:16, height:16, color:'#0E7C7B' }} />
              <span style={{ fontSize:13, fontWeight:800, color:'#0E7C7B' }}>Gán học viên</span>
            </button>

            <button
              onClick={onEdit}
              className="flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-95 transition-all"
              style={{ background:'rgba(0,0,0,0.04)', border:'1.5px solid rgba(0,0,0,0.1)' }}
            >
              <Edit2 style={{ width:16, height:16, color:'#6B7280' }} />
              <span style={{ fontSize:13, fontWeight:800, color:'#6B7280' }}>Chỉnh sửa lớp</span>
            </button>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════
            TAB CONTENT
        ══════════════════════════════════════════════════════ */}

        {/* ── TAB: HỌC VIÊN ── */}
        {tab === 'students' && (
          <div className="px-4 pt-3 pb-10">

            {/* mini stats row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { n: STUDENTS.filter(s => s.status === 'active').length,   label:'Đang học', color:'#2A9D8F', bg:'rgba(42,157,143,0.1)'   },
                { n: STUDENTS.filter(s => s.status === 'expiring').length, label:'Sắp hết',  color:'#C97B38', bg:'rgba(244,162,97,0.12)' },
                { n: STUDENTS.filter(s => s.status === 'expired').length,  label:'Hết buổi', color:'#C85A3D', bg:'rgba(231,111,81,0.1)'  },
              ].map((s, i) => (
                <button key={i}
                        onClick={() => setStuFilter(i === 0 ? 'all' : i === 1 ? 'expiring' : 'expired')}
                        className="py-2.5 px-2 rounded-xl flex flex-col items-center gap-0.5 active:scale-95 transition-all"
                        style={{ background: s.bg, border:`1.5px solid ${s.color}30` }}>
                  <span style={{ fontSize:18, fontWeight:900, color:s.color, lineHeight:1 }}>{s.n}</span>
                  <span style={{ fontSize:10, fontWeight:700, color:s.color, opacity:0.8 }}>{s.label}</span>
                </button>
              ))}
            </div>

            {/* filter badge */}
            {stuFilter !== 'all' && (
              <div className="flex items-center gap-2 mb-3">
                <span style={{ fontSize:12, color:'#6B7280' }}>Lọc:</span>
                <span className="px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      style={{ background:'rgba(244,162,97,0.12)', border:'1px solid rgba(244,162,97,0.35)' }}>
                  <span style={{ fontSize:11, fontWeight:800, color:'#C97B38' }}>
                    {stuFilter === 'expiring' ? 'Sắp hết' : 'Hết buổi'}
                  </span>
                </span>
                <button onClick={() => setStuFilter('all')}
                        style={{ fontSize:11, color:'#0E7C7B', fontWeight:700 }}>Xem tất cả</button>
              </div>
            )}

            {/* student list */}
            <div className="space-y-2">
              {filteredStudents.map(s => {
                const cfg = STU_CFG[s.status];
                const usedPct = Math.round(((s.total - s.remaining) / s.total) * 100);
                const barColor = s.status === 'expired' ? '#E76F51' : s.status === 'expiring' ? '#F4A261' : '#2A9D8F';
                return (
                  <button key={s.id} onClick={onStudentDetail} className="w-full text-left">
                    <div className="bg-white flex items-center gap-3 p-3.5 active:scale-[0.99] transition-all"
                         style={{ borderRadius:18, border:`1.5px solid ${s.status === 'expired' ? 'rgba(231,111,81,0.2)' : s.status === 'expiring' ? 'rgba(244,162,97,0.2)' : 'rgba(0,0,0,0.09)'}`, boxShadow:'0 1px 8px rgba(0,0,0,0.05)' }}>

                      {/* avatar */}
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
                           style={{ background: s.color + '18', border:`1.5px solid ${s.color}30` }}>
                        <span style={{ fontSize:12, fontWeight:900, color:s.color }}>{s.ini}</span>
                        {s.status === 'expired' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                               style={{ background:'#E76F51', border:'1.5px solid white' }}>
                            <XCircle style={{ width:10, height:10, color:'white' }} />
                          </div>
                        )}
                        {s.status === 'expiring' && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                               style={{ background:'#F4A261', border:'1.5px solid white' }}>
                            <AlertTriangle style={{ width:8, height:8, color:'white' }} />
                          </div>
                        )}
                      </div>

                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span style={{ fontSize:14, fontWeight:800, color:'#1F2933' }} className="truncate">
                            {s.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded-full flex-shrink-0"
                                style={{ fontSize:9, fontWeight:800, color:cfg.color, background:cfg.bg }}>
                            {cfg.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* progress bar */}
                          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                            <div className="h-full rounded-full" style={{ width:`${usedPct}%`, background:barColor, transition:'width 0.5s ease' }} />
                          </div>
                          {/* remaining count */}
                          <span className="flex-shrink-0 px-2 py-0.5 rounded-full"
                                style={{
                                  fontSize:10, fontWeight:800,
                                  color:     s.remaining === 0 ? '#C85A3D' : s.remaining <= 2 ? '#C97B38' : '#374151',
                                  background: s.remaining === 0 ? 'rgba(231,111,81,0.1)' : s.remaining <= 2 ? 'rgba(244,162,97,0.12)' : 'rgba(0,0,0,0.06)',
                                }}>
                            Còn {s.remaining}
                          </span>
                        </div>
                      </div>

                      <ChevronRight style={{ width:15, height:15, color:'#C0C7D0', flexShrink:0 }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add more hint */}
            {STUDENTS.length < CLS.maxStudents && (
              <button onClick={onAssignStudents}
                      className="w-full flex items-center justify-center gap-2 py-3.5 mt-3 rounded-2xl active:scale-[0.98] transition-all"
                      style={{ border:'1.5px dashed rgba(14,124,123,0.3)', background:'rgba(14,124,123,0.04)' }}>
                <UserPlus style={{ width:15, height:15, color:'#0E7C7B' }} />
                <span style={{ fontSize:13, fontWeight:700, color:'#0E7C7B' }}>
                  Gán thêm học viên ({CLS.maxStudents - STUDENTS.length} chỗ trống)
                </span>
              </button>
            )}
          </div>
        )}

        {/* ── TAB: BUỔI HỌC ── */}
        {tab === 'sessions' && (
          <div className="px-4 pt-3 pb-10">

            {/* attendance summary mini card */}
            <div className="bg-white rounded-2xl p-4 mb-3 flex items-center gap-4"
                 style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <div className="flex-1">
                <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.04em', marginBottom:4 }}>
                  CHUYÊN CẦN TRUNG BÌNH
                </p>
                <div className="flex items-end gap-2">
                  <span style={{ fontSize:28, fontWeight:900, color:'#0E7C7B', lineHeight:1 }}>{avgAttend}%</span>
                  <span style={{ fontSize:12, color:'#9CA3AF', paddingBottom:2 }}>/ {doneCount} buổi</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden mt-2" style={{ background:'rgba(0,0,0,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width:`${avgAttend}%`, background:'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }} />
                </div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                     style={{ background:'rgba(14,124,123,0.1)' }}>
                  <TrendingUp style={{ width:20, height:20, color:'#0E7C7B' }} />
                </div>
                <div className="flex gap-1">
                  {[
                    { n:SESSIONS.filter(s=>s.status==='done').length,      c:'#2A9D8F' },
                    { n:SESSIONS.filter(s=>s.status==='cancelled').length,  c:'#E76F51' },
                  ].map((d,i) => (
                    <div key={i} className="px-2 py-0.5 rounded-full text-center"
                         style={{ background:d.c+'15' }}>
                      <span style={{ fontSize:11, fontWeight:900, color:d.c }}>{d.n}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* session list */}
            <div className="space-y-2.5">
              {SESSIONS.map(ses => {
                const cfg  = SES_CFG[ses.status] ?? SES_CFG.pending;
                const pct  = ses.total > 0 ? Math.round(ses.attended / ses.total * 100) : 0;
                const [dd, mm, yyyy] = ses.date.split('/');
                return (
                  <button key={ses.id} onClick={onSessionDetail} className="w-full text-left">
                    <div className="bg-white flex items-center gap-3 p-3.5 active:scale-[0.99] transition-all"
                         style={{
                           borderRadius: 18,
                           border: `1.5px solid ${ses.status === 'cancelled' ? 'rgba(231,111,81,0.2)' : 'rgba(0,0,0,0.09)'}`,
                           boxShadow: '0 1px 8px rgba(0,0,0,0.05)',
                           background: ses.status === 'cancelled' ? 'rgba(231,111,81,0.02)' : 'white',
                           opacity: ses.status === 'cancelled' ? 0.85 : 1,
                         }}>

                      {/* date badge */}
                      <div className="w-12 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0"
                           style={{
                             background: ses.status === 'cancelled' ? 'rgba(231,111,81,0.08)' : 'rgba(14,124,123,0.09)',
                             border:     `1.5px solid ${ses.status === 'cancelled' ? 'rgba(231,111,81,0.25)' : 'rgba(14,124,123,0.2)'}`,
                           }}>
                        <span style={{ fontSize:9, fontWeight:800, color: ses.status === 'cancelled' ? '#C85A3D' : '#6B7280', letterSpacing:'0.02em', marginBottom:1 }}>
                          {ses.dayShort}
                        </span>
                        <span style={{ fontSize:18, fontWeight:900, color: ses.status === 'cancelled' ? '#C85A3D' : '#0E7C7B', lineHeight:1 }}>
                          {dd}
                        </span>
                        <span style={{ fontSize:9, color:'#9CA3AF', marginTop:1 }}>/{mm}</span>
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-1.5">
                            <Clock style={{ width:12, height:12, color:'#9CA3AF' }} />
                            <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>
                              {CLS.startTime} – {CLS.endTime}
                            </span>
                          </div>
                          {/* status badge */}
                          <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                                style={{ fontSize:10, fontWeight:800, color:cfg.color, background:cfg.bg }}>
                            <cfg.Icon style={{ width:10, height:10 }} />
                            {cfg.label}
                          </span>
                        </div>

                        {ses.status === 'done' ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                              <div className="h-full rounded-full"
                                   style={{ width:`${pct}%`, background: pct >= 80 ? '#2A9D8F' : pct >= 60 ? '#F4A261' : '#E76F51' }} />
                            </div>
                            <span style={{ fontSize:10, fontWeight:700, color:'#6B7280', flexShrink:0 }}>
                              {ses.attended}/{ses.total} HV
                            </span>
                          </div>
                        ) : ses.status === 'cancelled' ? (
                          <div className="flex items-center gap-1.5">
                            <XCircle style={{ width:11, height:11, color:'#E76F51' }} />
                            <span style={{ fontSize:11, color:'#C85A3D', fontWeight:600 }}>
                              Buổi bị hủy{ses.note ? ` · ${ses.note}` : ''}
                            </span>
                          </div>
                        ) : null}
                      </div>

                      <ChevronRight style={{ width:15, height:15, color:'#C0C7D0', flexShrink:0 }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* load more */}
            <button className="w-full py-3.5 mt-3 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                    style={{ border:'1.5px dashed rgba(0,0,0,0.15)', background:'rgba(0,0,0,0.02)' }}>
              <BarChart3 style={{ width:14, height:14, color:'#9CA3AF' }} />
              <span style={{ fontSize:13, fontWeight:600, color:'#9CA3AF' }}>Xem thêm buổi học cũ</span>
            </button>
          </div>
        )}

        {/* ── TAB: GHI CHÚ ── */}
        {tab === 'notes' && (
          <div className="px-4 pt-3 pb-10">
            <div className="bg-white rounded-2xl overflow-hidden"
                 style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>

              {/* card header */}
              <div className="px-4 py-3.5 flex items-center justify-between"
                   style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                       style={{ background:'rgba(14,124,123,0.1)' }}>
                    <FileText style={{ width:14, height:14, color:'#0E7C7B' }} />
                  </div>
                  <span style={{ fontSize:13, fontWeight:800, color:'#374151' }}>Ghi chú lớp học</span>
                </div>
                <button onClick={() => setNoteEdit(e => !e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:scale-90 transition-all"
                        style={{ background: noteEdit ? 'rgba(14,124,123,0.1)' : 'rgba(0,0,0,0.06)', border:`1px solid ${noteEdit ? 'rgba(14,124,123,0.25)' : 'transparent'}` }}>
                  <Pen style={{ width:12, height:12, color: noteEdit ? '#0E7C7B' : '#6B7280' }} />
                  <span style={{ fontSize:12, fontWeight:700, color: noteEdit ? '#0E7C7B' : '#6B7280' }}>
                    {noteEdit ? 'Đang sửa' : 'Sửa'}
                  </span>
                </button>
              </div>

              {/* content */}
              <div className="px-4 py-4">
                {noteEdit ? (
                  <>
                    <textarea
                      value={noteText}
                      onChange={e => setNoteText(e.target.value)}
                      rows={6}
                      className="w-full resize-none rounded-2xl focus:outline-none px-4 py-3.5"
                      style={{
                        fontSize:14, color:'#1F2933', lineHeight:1.7,
                        background:'rgba(14,124,123,0.04)',
                        border:'1.5px solid rgba(14,124,123,0.25)',
                      }}
                    />
                    <div className="flex gap-2.5 mt-3">
                      <button onClick={() => { setNoteText(CLS.notes); setNoteEdit(false); }}
                              className="flex-none px-4 py-2.5 rounded-xl active:scale-95"
                              style={{ background:'rgba(0,0,0,0.06)', fontSize:13, fontWeight:700, color:'#6B7280' }}>
                        Hủy
                      </button>
                      <button onClick={() => setNoteEdit(false)}
                              className="flex-1 py-2.5 rounded-xl active:scale-95 transition-all"
                              style={{ background:'linear-gradient(135deg,#0E7C7B,#2A9D8F)', fontSize:13, fontWeight:800, color:'white', boxShadow:'0 4px 12px rgba(14,124,123,0.3)' }}>
                        Lưu ghi chú
                      </button>
                    </div>
                  </>
                ) : noteText.trim() ? (
                  <div className="rounded-2xl px-4 py-3.5"
                       style={{ background:'rgba(14,124,123,0.04)', border:'1.5px solid rgba(14,124,123,0.12)' }}>
                    {noteText.split('\n').map((line, i) => (
                      <p key={i} style={{ fontSize:14, color:'#374151', lineHeight:1.7, marginBottom: i < noteText.split('\n').length - 1 ? 4 : 0 }}>
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 gap-3">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                         style={{ background:'rgba(0,0,0,0.05)' }}>
                      <FileText style={{ width:22, height:22, color:'#C0C7D0' }} />
                    </div>
                    <p style={{ fontSize:14, color:'#9CA3AF', textAlign:'center' }}>
                      Chưa có ghi chú nào.
                    </p>
                    <button onClick={() => setNoteEdit(true)}
                            className="px-4 py-2.5 rounded-xl active:scale-95"
                            style={{ background:'rgba(14,124,123,0.09)', border:'1px solid rgba(14,124,123,0.2)', fontSize:13, fontWeight:700, color:'#0E7C7B' }}>
                      Thêm ghi chú
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* class meta */}
            <div className="mt-3 px-4 py-4 rounded-2xl"
                 style={{ background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.08)' }}>
              <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.04em', marginBottom:8 }}>THÔNG TIN CHUNG</p>
              {[
                ['Tên lớp',    CLS.name],
                ['Trình độ',   CLS.levelLabel],
                ['Trạng thái', CLS.statusLabel],
                ['Sĩ số',      `${CLS.students}/${CLS.maxStudents} học viên`],
                ['Giáo viên',  CLS.coach],
              ].map(([l, v], i, a) => (
                <div key={l} className="flex items-center justify-between py-2"
                     style={{ borderBottom: i < a.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                  <span style={{ fontSize:13, color:'#6B7280' }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:700, color:'#1F2933' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <style>{`
        @keyframes ctaShimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center;  }
        }
      `}</style>
    </div>
  );
}
