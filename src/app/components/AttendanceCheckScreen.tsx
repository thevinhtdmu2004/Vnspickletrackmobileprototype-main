import { useState, useMemo } from 'react';
import {
  ArrowLeft, MapPin, Clock, CheckCircle2, XCircle,
  RotateCcw, Shield, Save, Users, Search, X,
  AlertTriangle, RefreshCw, ChevronDown, Zap
} from 'lucide-react';
import QuickAttendanceDialog, { QuickAttendanceAction } from './QuickAttendanceDialog';

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONFIG
═══════════════════════════════════════════════════════════════ */
type AttendStatus = 'present' | 'late' | 'makeup' | 'absent' | 'leave';

const STATUS_CFG: Record<AttendStatus, {
  label:    string;
  short:    string;
  Icon:     React.FC<{ style?: React.CSSProperties }>;
  color:    string;
  colorDim: string;
  bg:       string;
  bgSel:    string;
  border:   string;
  dot:      string;
  deduct:   boolean;          // trừ buổi hay không
}> = {
  present: {
    label:'Có mặt', short:'Có mặt',
    Icon: CheckCircle2,
    color:'#1A7B6E', colorDim:'rgba(42,157,143,0.8)',
    bg:'rgba(42,157,143,0.1)', bgSel:'#1A7B6E',
    border:'rgba(42,157,143,0.35)', dot:'#2A9D8F', deduct:true,
  },
  late: {
    label:'Trễ', short:'Trễ',
    Icon: Clock,
    color:'#A07B10', colorDim:'rgba(233,196,106,0.85)',
    bg:'rgba(233,196,106,0.15)', bgSel:'#9E7000',
    border:'rgba(233,196,106,0.5)', dot:'#E9C46A', deduct:true,
  },
  makeup: {
    label:'Học bù', short:'Học bù',
    Icon: RotateCcw,
    color:'#0E7C7B', colorDim:'rgba(14,124,123,0.8)',
    bg:'rgba(14,124,123,0.1)', bgSel:'#0E7C7B',
    border:'rgba(14,124,123,0.35)', dot:'#2A9D8F', deduct:true,
  },
  absent: {
    label:'Vắng', short:'Vắng',
    Icon: XCircle,
    color:'#C85A3D', colorDim:'rgba(231,111,81,0.8)',
    bg:'rgba(231,111,81,0.1)', bgSel:'#C42B0B',
    border:'rgba(231,111,81,0.35)', dot:'#E76F51', deduct:false,
  },
  leave: {
    label:'Nghỉ phép', short:'Phép',
    Icon: Shield,
    color:'#4B6CB7', colorDim:'rgba(75,108,183,0.8)',
    bg:'rgba(75,108,183,0.1)', bgSel:'#3B5A9E',
    border:'rgba(75,108,183,0.3)', dot:'#4B6CB7', deduct:false,
  },
};

const STATUS_ORDER: AttendStatus[] = ['present','late','makeup','absent','leave'];

/* ── Avatar palette ── */
const AVATAR_COLORS = [
  '#0E7C7B','#F4A261','#E76F51','#2A9D8F',
  '#264653','#9B6B38','#815AD5','#1A5FA8',
];

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
interface Student {
  id:        number;
  name:      string;
  initials:  string;
  remaining: number;
  status:    AttendStatus | null;
}

const INITIAL_STUDENTS: Student[] = [
  { id:1, name:'Nguyễn Văn A', initials:'NA', remaining:7,  status:'present' },
  { id:2, name:'Trần Thị B',   initials:'TB', remaining:2,  status:'present' },
  { id:3, name:'Lê Văn C',     initials:'LC', remaining:0,  status:null      },
  { id:4, name:'Phạm Thị D',   initials:'PD', remaining:15, status:'present' },
  { id:5, name:'Hoàng Văn E',  initials:'HE', remaining:8,  status:'late'    },
  { id:6, name:'Võ Thị F',     initials:'VF', remaining:3,  status:'makeup'  },
  { id:7, name:'Đặng Văn G',   initials:'DG', remaining:12, status:null      },
  { id:8, name:'Ngô Thị H',    initials:'NH', remaining:1,  status:null      },
];

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
interface Props { onBack: () => void; onSave: () => void; }

export function AttendanceCheckScreen({ onBack, onSave }: Props) {
  const [students, setStudents]   = useState<Student[]>(INITIAL_STUDENTS);
  const [search,   setSearch]     = useState('');
  const [filter,   setFilter]     = useState<AttendStatus | 'unset' | null>(null);
  const [warnFor,  setWarnFor]    = useState<{ id:number; st:AttendStatus } | null>(null);
  const [saved,    setSaved]      = useState(false);
  const [showQuickDialog, setShowQuickDialog] = useState(false);
  const [overuseAckIds, setOveruseAckIds] = useState<number[]>([]);

  /* ── Stats ── */
  const counts = useMemo(() => {
    const c: Partial<Record<AttendStatus,number>> = {};
    STATUS_ORDER.forEach(k => { c[k] = students.filter(s => s.status === k).length; });
    return c as Record<AttendStatus,number>;
  }, [students]);

  const markedCount = students.filter(s => s.status !== null).length;
  const total       = students.length;
  const progress    = markedCount / total;
  const deductCount = students.filter(s => s.status && STATUS_CFG[s.status].deduct).length;
  const overuseStudents = students.filter(s => s.remaining < 0);

  /* ── Filtered list ── */
  const displayed = useMemo(() => {
    let list = students;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }
    if (filter === 'unset') list = list.filter(s => s.status === null);
    else if (filter)        list = list.filter(s => s.status === filter);
    return list;
  }, [students, search, filter]);

  /* ── Actions ── */
  function previewRemaining(student: Student, nextStatus: AttendStatus | null) {
    const currentDeduct = student.status ? STATUS_CFG[student.status].deduct : false;
    const nextDeduct = nextStatus ? STATUS_CFG[nextStatus].deduct : false;
    return student.remaining + (currentDeduct ? 1 : 0) - (nextDeduct ? 1 : 0);
  }

  function setStatus(id: number, st: AttendStatus) {
    const student = students.find(s => s.id === id);
    const nextStatus = student?.status === st ? null : st;
    // Warn if this status change would make the package balance negative.
    if (student && nextStatus && previewRemaining(student, nextStatus) < 0) {
      setWarnFor({ id, st });
      return;
    }
    applyStatus(id, st);
  }

  function applyStatus(id: number, st: AttendStatus) {
    setStudents(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextStatus = s.status === st ? null : st;
      return { ...s, status: nextStatus, remaining: previewRemaining(s, nextStatus) };
    }));
  }

  function resetAll() {
    setStudents(INITIAL_STUDENTS.map(s => ({ ...s, status: null })));
    setFilter(null);
    setSearch('');
    setOveruseAckIds([]);
  }

  function handleQuickAction(action: QuickAttendanceAction) {
    switch (action) {
      case 'mark-all-present':
        setStudents(prev => prev.map(s => ({
          ...s,
          status: 'present',
          remaining: previewRemaining(s, 'present'),
        })));
        break;
      case 'mark-unselected-present':
        setStudents(prev => prev.map(s => s.status === null ? {
          ...s,
          status: 'present',
          remaining: previewRemaining(s, 'present'),
        } : s));
        break;
      case 'clear-all':
        setStudents(prev => prev.map(s => ({
          ...s,
          status: null,
          remaining: previewRemaining(s, null),
        })));
        setOveruseAckIds([]);
        break;
      case 'filter-unmarked':
        setFilter('unset');
        setSearch('');
        break;
      case 'filter-low-sessions':
        setStudents(prev => [...prev].sort((a, b) => a.remaining - b.remaining));
        setFilter(null);
        setSearch('');
        break;
    }
  }

  function handleSave() {
    const blocked = students.find(s =>
      s.status &&
      STATUS_CFG[s.status].deduct &&
      s.remaining < 0 &&
      !overuseAckIds.includes(s.id)
    );
    if (blocked) {
      setWarnFor({ id: blocked.id, st: blocked.status as AttendStatus });
      return;
    }
    setSaved(true);
    setTimeout(onSave, 700);
  }

  /* ─── RENDER ─── */
  return (
    <div className="flex flex-col h-screen" style={{ background:'#F0F4F3' }}>

      {/* ══ HEADER ══ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(150deg,#032E2E 0%,#054A49 30%,#0E7C7B 70%,#1A8C85 100%)' }}>
        {/* deco */}
        <div className="absolute pointer-events-none" style={{ top:-24, right:-20, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:0, left:60, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        <div className="relative px-4 pt-11 pb-0">
          {/* nav row */}
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width:18, height:18, color:'white' }} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 style={{ fontSize:21, fontWeight:900, color:'white', lineHeight:1.1 }}>Beginner A</h1>
                <div className="px-2 py-0.5 rounded-lg" style={{ background:'rgba(255,255,255,0.2)' }}>
                  <span style={{ fontSize:10, fontWeight:800, color:'white' }}>ĐIỂM DANH</span>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1">
                  <Clock style={{ width:11, height:11, color:'rgba(255,255,255,0.6)' }} />
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>29/04/2026 · 18:00–19:30</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin style={{ width:11, height:11, color:'rgba(255,255,255,0.6)' }} />
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>Sân 1 · Coach Nam</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress row */}
          <div className="rounded-2xl px-4 py-3 mb-4"
               style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.18)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users style={{ width:13, height:13, color:'rgba(255,255,255,0.8)' }} />
                <span style={{ fontSize:13, fontWeight:800, color:'white' }}>
                  Đã chọn {markedCount}/{total} học viên
                </span>
              </div>
              <span style={{ fontSize:12, fontWeight:700, color: markedCount === total ? '#98E8C0' : 'rgba(255,255,255,0.6)' }}>
                {markedCount === total ? '✓ Hoàn tất' : `Còn ${total - markedCount}`}
              </span>
            </div>
            {/* Progress bar */}
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(255,255,255,0.2)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                   style={{ width:`${progress*100}%`, background: progress===1 ? '#4ADE80' : 'white' }} />
            </div>
          </div>

          {/* Status summary chips — scrollable */}
          <div className="flex gap-2 pb-4 overflow-x-auto no-scrollbar">
            {/* Tất cả */}
            <button
              onClick={() => setFilter(null)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full flex-shrink-0 active:scale-95 transition-all"
              style={{
                background: filter === null ? 'white'               : 'rgba(255,255,255,0.15)',
                border:     `1.5px solid ${filter===null ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
              }}>
              <span style={{ fontSize:11, fontWeight:800, color: filter===null ? '#0E7C7B' : 'rgba(255,255,255,0.85)' }}>
                Tất cả
              </span>
              <span className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background: filter===null ? 'rgba(14,124,123,0.15)' : 'rgba(255,255,255,0.2)',
                             fontSize:10, fontWeight:900, color: filter===null ? '#0E7C7B' : 'white' }}>
                {total}
              </span>
            </button>

            {/* Chưa chọn */}
            <button
              onClick={() => setFilter(f => f==='unset' ? null : 'unset')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full flex-shrink-0 active:scale-95 transition-all"
              style={{
                background: filter==='unset' ? 'rgba(255,255,255,0.95)'       : 'rgba(255,255,255,0.12)',
                border:     `1.5px solid ${filter==='unset' ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
              }}>
              <div className="w-2 h-2 rounded-full" style={{ background: filter==='unset' ? '#9CA3AF' : 'rgba(255,255,255,0.5)' }} />
              <span style={{ fontSize:11, fontWeight:800, color: filter==='unset' ? '#6B7280' : 'rgba(255,255,255,0.85)' }}>Chưa chọn</span>
              <span className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ background:'rgba(255,255,255,0.2)', fontSize:10, fontWeight:900, color: filter==='unset'?'#6B7280':'white' }}>
                {total - markedCount}
              </span>
            </button>

            {/* Per-status chips */}
            {STATUS_ORDER.map(st => {
              const c = STATUS_CFG[st];
              const cnt = counts[st];
              const active = filter === st;
              return (
                <button key={st}
                        onClick={() => setFilter(f => f===st ? null : st)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-full flex-shrink-0 active:scale-95 transition-all"
                        style={{
                          background: active ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.12)',
                          border:     `1.5px solid ${active ? 'transparent' : 'rgba(255,255,255,0.2)'}`,
                        }}>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: active ? c.dot : 'rgba(255,255,255,0.6)' }} />
                  <span style={{ fontSize:11, fontWeight:800, color: active ? c.color : 'rgba(255,255,255,0.85)' }}>
                    {c.label}
                  </span>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ background: active ? c.bg : 'rgba(255,255,255,0.2)', fontSize:10, fontWeight:900, color: active ? c.color : 'white' }}>
                    {cnt}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ BODY ══ */}
      <div className="flex-1 overflow-y-auto pb-28">

        {/* ── Search + quick actions ── */}
        <div className="px-4 pt-3 pb-2 space-y-2 sticky top-0 z-10" style={{ background:'#F0F4F3' }}>
          {/* Search */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
            <Search style={{ width:16, height:16, color:'#9CA3AF', flexShrink:0 }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm học viên..."
              className="flex-1 bg-transparent focus:outline-none"
              style={{ fontSize:14, color:'#1F2933' }}
            />
            {search && (
              <button onClick={() => setSearch('')}
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background:'rgba(0,0,0,0.08)' }}>
                <X style={{ width:12, height:12, color:'#6B7280' }} />
              </button>
            )}
          </div>

          {/* Quick actions */}
          <div className="flex gap-2">
            <button onClick={() => setShowQuickDialog(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl active:scale-95 transition-all"
                    style={{ background:'rgba(42,157,143,0.12)', border:'1.5px solid rgba(42,157,143,0.28)' }}>
              <Zap style={{ width:13, height:13, color:'#1A7B6E' }} />
              <span style={{ fontSize:12, fontWeight:800, color:'#1A7B6E' }}>Điểm danh nhanh</span>
            </button>
            <button onClick={resetAll}
                    className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-95 transition-all"
                    style={{ background:'rgba(0,0,0,0.06)', border:'1.5px solid rgba(0,0,0,0.1)' }}>
              <RefreshCw style={{ width:15, height:15, color:'#6B7280' }} />
            </button>
          </div>
        </div>

        {/* ── Student result count ── */}
        <div className="px-4 pb-1 flex items-center justify-between">
          <span style={{ fontSize:11, fontWeight:700, color:'#9CA3AF' }}>
            {displayed.length} học viên{filter ? ` · ${filter === 'unset' ? 'Chưa chọn' : STATUS_CFG[filter]?.label}` : ''}
          </span>
          {(filter || search) && (
            <button onClick={() => { setFilter(null); setSearch(''); }}
                    style={{ fontSize:11, color:'#0E7C7B', fontWeight:700 }}>
              Xóa lọc
            </button>
          )}
        </div>

        {/* ── Student cards ── */}
        <div className="px-4 pt-1 space-y-3">
          {displayed.map((student, idx) => {
            const st  = student.status;
            const cfg = st ? STATUS_CFG[st] : null;
            const isExpiring = student.remaining <= 2 && student.remaining > 0;
            const isExpired  = student.remaining === 0;
            const isOverused  = student.remaining < 0;
            const avatarColor = AVATAR_COLORS[idx % AVATAR_COLORS.length];

            return (
              <div key={student.id} className="relative">
                {/* Card */}
                <div className="bg-white rounded-2xl overflow-hidden"
                     style={{
                       border: `1.5px solid ${cfg ? cfg.border : 'rgba(0,0,0,0.09)'}`,
                       boxShadow: cfg
                         ? `0 4px 16px ${cfg.color}18`
                         : '0 2px 8px rgba(0,0,0,0.05)',
                       transition: 'all 0.2s ease',
                     }}>

                  {/* Left status accent strip */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
                       style={{ background: cfg ? cfg.bgSel : 'rgba(0,0,0,0.08)', transition:'background 0.2s' }} />

                  {/* ── Info row ── */}
                  <div className="flex items-center gap-3 pl-4 pr-4 pt-3.5 pb-3">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                         style={{ background: avatarColor + '18', border:`2px solid ${avatarColor}30`, fontSize:12, fontWeight:900, color:avatarColor }}>
                      {student.initials}
                    </div>

                    {/* Name + sessions */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize:15, fontWeight:900, color:'#1F2933', lineHeight:1.2 }}>
                        {student.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span style={{ fontSize:11, fontWeight:600,
                          color: isOverused || isExpired ? '#C85A3D' : isExpiring ? '#A07B10' : '#9CA3AF' }}>
                          Còn {student.remaining} buổi
                        </span>
                        {(isExpired || isOverused) && (
                          <span className="px-2 py-0.5 rounded-full"
                                style={{ fontSize:9, fontWeight:900, color:'#C85A3D', background:'rgba(231,111,81,0.12)', border:'1px solid rgba(231,111,81,0.3)' }}>
                            {isOverused ? 'Vượt số buổi' : 'Hết buổi'}
                          </span>
                        )}
                        {isExpiring && (
                          <span className="px-2 py-0.5 rounded-full"
                                style={{ fontSize:9, fontWeight:900, color:'#A07B10', background:'rgba(233,196,106,0.18)', border:'1px solid rgba(233,196,106,0.4)' }}>
                            ⚠ Sắp hết
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Selected status badge */}
                    {cfg ? (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0"
                           style={{ background:cfg.bg, border:`1.5px solid ${cfg.border}` }}>
                        <cfg.Icon style={{ width:13, height:13, color:cfg.color }} />
                        <span style={{ fontSize:11, fontWeight:900, color:cfg.color }}>{cfg.label}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0"
                           style={{ background:'rgba(0,0,0,0.05)', border:'1.5px solid transparent' }}>
                        <ChevronDown style={{ width:12, height:12, color:'#C0C7D0' }} />
                        <span style={{ fontSize:11, fontWeight:700, color:'#C0C7D0' }}>Chọn</span>
                      </div>
                    )}
                  </div>

                  {/* ── 5 Status Buttons ── */}
                  <div className="grid grid-cols-5 gap-1.5 px-3 pb-3"
                       style={{ paddingLeft:14, paddingRight:14 }}>
                    {STATUS_ORDER.map(s => {
                      const c       = STATUS_CFG[s];
                      const isSel   = student.status === s;
                      return (
                        <button
                          key={s}
                          onClick={() => setStatus(student.id, s)}
                          className="flex flex-col items-center justify-center rounded-xl active:scale-90 transition-all"
                          style={{
                            height: 56,
                            background: isSel ? c.bgSel   : c.bg,
                            border:     `2px solid ${isSel ? c.bgSel : c.border}`,
                            boxShadow:  isSel ? `0 4px 12px ${c.color}40` : 'none',
                            transform:  isSel ? 'scale(1.03)' : 'scale(1)',
                            transition: 'all 0.18s ease',
                          }}>
                          <c.Icon style={{
                            width:17, height:17,
                            color: isSel ? 'white' : c.color,
                            transition:'color 0.15s',
                          }} />
                          <span style={{
                            fontSize:9, fontWeight:900, marginTop:4, lineHeight:1.2, textAlign:'center',
                            color: isSel ? 'white' : c.color,
                          }}>
                            {c.short}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Deduct indicator (only when status selected) */}
                  {cfg && (
                    <div className="flex items-center gap-2 px-4 pb-3"
                         style={{ borderTop:'1px solid rgba(0,0,0,0.06)', paddingTop:8, marginTop:-4 }}>
                      <span style={{ fontSize:9, fontWeight:800, color:'#B0B7C3', letterSpacing:'0.04em' }}>TRỪ BUỔI:</span>
                      {cfg.deduct ? (
                        <span className="px-2 py-0.5 rounded-full"
                              style={{ fontSize:9, fontWeight:900, color:'#C97B38', background:'rgba(244,162,97,0.15)', border:'1px solid rgba(244,162,97,0.35)' }}>
                          Có — −1 buổi
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full"
                              style={{ fontSize:9, fontWeight:900, color:'#2A9D8F', background:'rgba(42,157,143,0.1)', border:'1px solid rgba(42,157,143,0.25)' }}>
                          Không trừ
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {displayed.length === 0 && (
            <div className="flex flex-col items-center py-12 gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                   style={{ background:'rgba(0,0,0,0.06)' }}>
                <Search style={{ width:24, height:24, color:'#D1D5DB' }} />
              </div>
              <p style={{ fontSize:14, fontWeight:800, color:'#6B7280' }}>Không tìm thấy</p>
              <button onClick={() => { setSearch(''); setFilter(null); }}
                      className="px-4 py-2 rounded-xl"
                      style={{ background:'rgba(14,124,123,0.1)', border:'1px solid rgba(14,124,123,0.25)', fontSize:12, fontWeight:700, color:'#0E7C7B' }}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══ FIXED FOOTER ══ */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-20"
           style={{ background:'white', borderTop:'1px solid rgba(0,0,0,0.09)', padding:'12px 16px 28px', boxShadow:'0 -8px 28px rgba(0,0,0,0.1)' }}>

        {/* Status mini-legend */}
        <div className="flex items-center gap-3 mb-3 overflow-x-auto no-scrollbar">
          {STATUS_ORDER.map(st => {
            const c = STATUS_CFG[st];
            if (counts[st] === 0) return null;
            return (
              <div key={st} className="flex items-center gap-1.5 flex-shrink-0">
                <div className="w-2 h-2 rounded-full" style={{ background:c.dot }} />
                <span style={{ fontSize:10, color:'#6B7280', fontWeight:700 }}>{c.label}: {counts[st]}</span>
              </div>
            );
          })}
        </div>

        {overuseStudents.length > 0 && (
          <div className="flex items-start gap-2 px-3 py-2 rounded-xl mb-3"
               style={{ background:'rgba(231,111,81,0.1)', border:'1px solid rgba(231,111,81,0.28)' }}>
            <AlertTriangle style={{ width:14, height:14, color:'#C85A3D', flexShrink:0, marginTop:1 }} />
            <span style={{ fontSize:11, fontWeight:700, color:'#C85A3D', lineHeight:1.4 }}>
              {overuseStudents.length} học viên sẽ âm số buổi nếu lưu. Cần xác nhận lại trạng thái trừ buổi.
            </span>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-between px-5 rounded-2xl active:scale-98 transition-all"
          style={{
            paddingTop:16, paddingBottom:16,
            background: markedCount === 0
              ? 'rgba(0,0,0,0.07)'
              : saved
                ? 'linear-gradient(135deg,#1A7B6E,#2A9D8F)'
                : markedCount === total
                  ? 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)'
                  : 'linear-gradient(135deg,#0E7C7B 0%,#1A8C85 100%)',
            boxShadow: markedCount > 0 ? '0 8px 24px rgba(14,124,123,0.35)' : 'none',
            cursor: markedCount === 0 ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
          }}>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background: markedCount > 0 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.07)' }}>
              {saved
                ? <CheckCircle2 style={{ width:17, height:17, color:'white' }} />
                : <Save style={{ width:17, height:17, color: markedCount > 0 ? 'white' : '#9CA3AF' }} />
              }
            </div>
            <div className="text-left">
              <p style={{ fontSize:15, fontWeight:900, color: markedCount > 0 ? 'white' : '#9CA3AF' }}>
                {saved ? 'Đã lưu!' : 'Lưu điểm danh'}
              </p>
              <p style={{ fontSize:10, color: markedCount > 0 ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.3)' }}>
                {markedCount > 0
                  ? `${markedCount}/${total} học viên · ${deductCount} buổi bị trừ`
                  : 'Chưa điểm danh học viên nào'}
              </p>
            </div>
          </div>

          {markedCount > 0 && (
            <div className="flex items-center gap-2">
              {/* mini progress dots */}
              <div className="flex items-center gap-1">
                {Array.from({ length: total }).map((_, i) => {
                  const s = students[i];
                  const dot = s?.status ? STATUS_CFG[s.status].dot : 'rgba(255,255,255,0.25)';
                  return <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background:dot }} />;
                })}
              </div>
              <span className="px-2.5 py-1.5 rounded-xl"
                    style={{ background:'rgba(255,255,255,0.2)', fontSize:13, fontWeight:900, color:'white' }}>
                {markedCount}/{total}
              </span>
            </div>
          )}
        </button>
      </div>

      {/* ══ WARNING DIALOG (0-session student) ══ */}
      {warnFor && (() => {
        const s = students.find(x => x.id === warnFor.id)!;
        return (
          <div className="fixed inset-0 z-50 flex items-end"
               style={{ background:'rgba(0,0,0,0.55)', backdropFilter:'blur(3px)' }}
               onClick={() => setWarnFor(null)}>
            <div className="w-full max-w-[390px] mx-auto bg-white rounded-t-3xl overflow-hidden"
                 onClick={e => e.stopPropagation()}
                 style={{ boxShadow:'0 -12px 48px rgba(0,0,0,0.2)' }}>

              {/* handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 rounded-full" style={{ background:'rgba(0,0,0,0.12)' }} />
              </div>

              {/* icon + message */}
              <div className="flex flex-col items-center px-6 pt-2 pb-5 text-center gap-3">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                     style={{ background:'rgba(231,111,81,0.1)', border:'2px solid rgba(231,111,81,0.3)' }}>
                  <AlertTriangle style={{ width:28, height:28, color:'#E76F51' }} />
                </div>
                <div>
                  <p style={{ fontSize:17, fontWeight:900, color:'#1F2933' }}>Học viên đã hết buổi</p>
                  <p style={{ fontSize:13, color:'#6B7280', marginTop:6, lineHeight:1.55 }}>
                    <strong style={{ color:'#1F2933' }}>{s.name}</strong> có{' '}
                    <strong style={{ color:'#C85A3D' }}>0 buổi</strong> còn lại.
                    Điểm danh "<strong>{STATUS_CFG[warnFor.st].label}</strong>" sẽ trừ thêm 1 buổi
                    và làm âm số dư.
                  </p>
                </div>
                <div className="w-full flex items-start gap-2.5 px-4 py-3 rounded-xl"
                     style={{ background:'rgba(233,196,106,0.12)', border:'1px solid rgba(233,196,106,0.4)' }}>
                  <AlertTriangle style={{ width:13, height:13, color:'#A07B10', flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:12, color:'#92620A', lineHeight:1.5, textAlign:'left' }}>
                    Hãy yêu cầu học viên gia hạn gói mới trước buổi học tiếp theo.
                  </p>
                </div>
              </div>

              {/* buttons */}
              <div className="flex gap-3 px-6 pb-10">
                <button onClick={() => setWarnFor(null)}
                        className="flex-1 py-4 rounded-2xl active:scale-95 transition-all"
                        style={{ background:'rgba(0,0,0,0.06)', border:'1.5px solid rgba(0,0,0,0.1)', fontSize:14, fontWeight:700, color:'#6B7280' }}>
                  Hủy
                </button>
                <button
                  onClick={() => {
                    setOveruseAckIds(prev => prev.includes(warnFor.id) ? prev : [...prev, warnFor.id]);
                    applyStatus(warnFor.id, warnFor.st);
                    setWarnFor(null);
                  }}
                  className="flex-1 py-4 rounded-2xl active:scale-95 transition-all"
                  style={{ background:'linear-gradient(135deg,#C62828,#E76F51)', fontSize:14, fontWeight:900, color:'white', boxShadow:'0 6px 20px rgba(231,111,81,0.4)' }}>
                  Vẫn điểm danh
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ QUICK ATTENDANCE DIALOG ══ */}
      <QuickAttendanceDialog
        isOpen={showQuickDialog}
        onClose={() => setShowQuickDialog(false)}
        onApply={handleQuickAction}
      />
    </div>
  );
}
