import {
  ArrowLeft, Search, Check, UserPlus, Users,
  X, AlertTriangle, Phone, Trophy, XCircle,
  CheckCircle2, MinusCircle, ChevronDown
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface AssignStudentsScreenProps {
  onBack:    () => void;
  onConfirm: () => void;
}

/* ─── Config ─────────────────────────────────────────────── */
const MAX_CAPACITY = 10;
const CLASS_NAME   = 'Beginner A';

type FilterType = 'all' | 'active' | 'expiring' | 'noClass';

/* ─── Student data ───────────────────────────────────────── */
interface Student {
  id:             number;
  name:           string;
  ini:            string;
  color:          string;
  phone:          string;
  levelLabel:     string;
  levelColor:     string;
  remaining:      number;
  inCurrentClass: boolean;   // đang trong lớp này
  inAnyClass:     boolean;   // đang trong bất kỳ lớp nào
  otherClass?:    string;    // tên lớp khác (nếu có)
}

const ALL_STUDENTS: Student[] = [
  /* ── Trong lớp (pre-selected, 8/10) ── */
  { id:1, name:'Nguyễn Văn A',  ini:'VA', color:'#0E7C7B', phone:'0912 345 678', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:7,  inCurrentClass:true,  inAnyClass:true                    },
  { id:2, name:'Trần Thị B',    ini:'TB', color:'#815AD5', phone:'0987 654 321', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:2,  inCurrentClass:true,  inAnyClass:true                    },
  { id:3, name:'Phạm Thị D',    ini:'TD', color:'#2A9D8F', phone:'0934 111 222', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:8,  inCurrentClass:true,  inAnyClass:true                    },
  { id:4, name:'Hoàng Văn E',   ini:'VE', color:'#F4A261', phone:'0961 777 888', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:5,  inCurrentClass:true,  inAnyClass:true                    },
  { id:5, name:'Vũ Ngọc F',     ini:'NF', color:'#264653', phone:'0908 222 333', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:3,  inCurrentClass:true,  inAnyClass:true                    },
  { id:6, name:'Đặng Văn G',    ini:'VG', color:'#C97B38', phone:'0971 444 555', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:9,  inCurrentClass:true,  inAnyClass:true                    },
  { id:7, name:'Bùi Thị H',     ini:'TH', color:'#5C3FA8', phone:'0946 888 999', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:1,  inCurrentClass:true,  inAnyClass:true                    },
  { id:8, name:'Cao Thu I',     ini:'TI', color:'#E76F51', phone:'0932 666 777', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:0,  inCurrentClass:true,  inAnyClass:true                    },
  /* ── Chưa trong lớp này ── */
  { id:9,  name:'Lê Văn C',      ini:'VC', color:'#E76F51', phone:'0919 333 444', levelLabel:'Trung cấp', levelColor:'#F4A261', remaining:10, inCurrentClass:false, inAnyClass:false                   },
  { id:10, name:'Đinh Xuân J',   ini:'XJ', color:'#2A9D8F', phone:'0953 555 666', levelLabel:'Trung cấp', levelColor:'#F4A261', remaining:6,  inCurrentClass:false, inAnyClass:true,  otherClass:'Intermediate B' },
  { id:11, name:'Kiều Thị K',    ini:'TK', color:'#F4A261', phone:'0978 111 222', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:15, inCurrentClass:false, inAnyClass:false                   },
  { id:12, name:'Lý Minh L',     ini:'ML', color:'#9CA3AF', phone:'0945 333 444', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:0,  inCurrentClass:false, inAnyClass:false                   },
  { id:13, name:'Mai Văn M',     ini:'VM', color:'#0E7C7B', phone:'0912 888 777', levelLabel:'Cơ bản',   levelColor:'#2A9D8F', remaining:4,  inCurrentClass:false, inAnyClass:false                   },
  { id:14, name:'Ngô Thị N',     ini:'TN', color:'#815AD5', phone:'0987 222 111', levelLabel:'Nâng cao',  levelColor:'#E76F51', remaining:2,  inCurrentClass:false, inAnyClass:true,  otherClass:'Advanced A'     },
];

/* ─── Status helpers ─────────────────────────────────────── */
function statusOf(r: number): 'expired' | 'expiring' | 'active' {
  if (r === 0) return 'expired';
  if (r <= 3)  return 'expiring';
  return 'active';
}
const STU_BADGE: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:   { label: 'Đang học',       color: '#1A7B6E', bg: 'rgba(42,157,143,0.11)',  border: 'rgba(42,157,143,0.25)'  },
  expiring: { label: 'Sắp hết buổi',  color: '#C97B38', bg: 'rgba(244,162,97,0.18)',  border: 'rgba(244,162,97,0.4)'   },
  expired:  { label: 'Hết buổi',      color: '#C85A3D', bg: 'rgba(231,111,81,0.14)',  border: 'rgba(231,111,81,0.35)'  },
};
const LEVEL_COLOR: Record<string, string> = {
  'Cơ bản':   '#2A9D8F',
  'Trung cấp':'#F4A261',
  'Nâng cao': '#E76F51',
};

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export function AssignStudentsScreen({ onBack, onConfirm }: AssignStudentsScreenProps) {
  const [search,   setSearch]   = useState('');
  const [filter,   setFilter]   = useState<FilterType>('all');
  const [selected, setSelected] = useState<Set<number>>(
    new Set(ALL_STUDENTS.filter(s => s.inCurrentClass).map(s => s.id))
  );

  const original = useMemo(
    () => new Set(ALL_STUDENTS.filter(s => s.inCurrentClass).map(s => s.id)),
    []
  );

  /* ── derived ── */
  const total   = selected.size;
  const added   = [...selected].filter(id => !original.has(id)).length;
  const removed = [...original].filter(id => !selected.has(id)).length;
  const isFull  = total >= MAX_CAPACITY;
  const capPct  = Math.round((total / MAX_CAPACITY) * 100);

  /* ── filter counts ── */
  const counts = useMemo(() => ({
    all:      ALL_STUDENTS.length,
    active:   ALL_STUDENTS.filter(s => statusOf(s.remaining) === 'active').length,
    expiring: ALL_STUDENTS.filter(s => statusOf(s.remaining) !== 'active').length,
    noClass:  ALL_STUDENTS.filter(s => !s.inAnyClass).length,
  }), []);

  /* ── filtered list ── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return ALL_STUDENTS.filter(s => {
      const matchSearch = s.name.toLowerCase().includes(q) || s.phone.includes(q);
      const st = statusOf(s.remaining);
      const matchFilter =
        filter === 'all'      ? true :
        filter === 'active'   ? st === 'active' :
        filter === 'expiring' ? (st === 'expiring' || st === 'expired') :
        filter === 'noClass'  ? !s.inAnyClass : true;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  function toggle(id: number) {
    const s = ALL_STUDENTS.find(s => s.id === id)!;
    if (!selected.has(id) && isFull) return;   // capacity full
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  /* ── filter chips config ── */
  const FILTERS: { id: FilterType; label: string; count: number }[] = [
    { id: 'all',      label: 'Tất cả',         count: counts.all      },
    { id: 'active',   label: 'Đang học',        count: counts.active   },
    { id: 'expiring', label: 'Sắp hết buổi',   count: counts.expiring },
    { id: 'noClass',  label: 'Chưa có lớp',    count: counts.noClass  },
  ];

  /* ─────────────────────────────────── RENDER ─── */
  return (
    <div className="flex flex-col h-screen" style={{ background: '#F7F9FA' }}>

      {/* ══ HEADER ══ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background: 'linear-gradient(150deg,#043F3E 0%,#054A49 35%,#0E7C7B 80%,#2A9D8F 100%)' }}>

        <div className="absolute pointer-events-none" style={{ top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-10, left:20, width:60, height:60, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        <div className="relative px-4 pt-12 pb-3">
          {/* top row */}
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width:18, height:18, color:'white' }} />
            </button>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.04em' }}>
                LỚP HỌC · {CLASS_NAME}
              </p>
              <h1 style={{ fontSize:19, fontWeight:900, color:'white', lineHeight:1.2 }}>
                Gán học viên vào lớp
              </h1>
            </div>
            {/* capacity badge */}
            <div className="flex flex-col items-center px-3 py-2 rounded-2xl"
                 style={{ background:'rgba(0,0,0,0.2)', border:`1.5px solid ${isFull ? 'rgba(231,111,81,0.4)' : 'rgba(255,255,255,0.15)'}` }}>
              <span style={{ fontSize:18, fontWeight:900, color: isFull ? '#FFA07A' : 'white', lineHeight:1 }}>
                {total}
              </span>
              <span style={{ fontSize:9, color:'rgba(255,255,255,0.5)', marginTop:1 }}>
                /{MAX_CAPACITY} HV
              </span>
            </div>
          </div>

          {/* capacity bar */}
          <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background:'rgba(255,255,255,0.15)' }}>
            <div className="h-full rounded-full transition-all duration-300"
                 style={{
                   width: `${capPct}%`,
                   background: isFull ? 'rgba(255,160,122,0.9)' : 'rgba(255,255,255,0.8)',
                 }} />
          </div>

          {/* filter chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {FILTERS.map(f => {
              const active = filter === f.id;
              return (
                <button key={f.id} onClick={() => setFilter(f.id)}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-95"
                        style={{
                          background: active ? 'white' : 'rgba(255,255,255,0.15)',
                          border:     active ? 'none'  : '1px solid rgba(255,255,255,0.2)',
                        }}>
                  <span style={{ fontSize:12, fontWeight: active ? 800 : 600, color: active ? '#0E7C7B' : 'rgba(255,255,255,0.85)' }}>
                    {f.label}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-full"
                        style={{ fontSize:10, fontWeight:800,
                                 background: active ? 'rgba(14,124,123,0.15)' : 'rgba(255,255,255,0.2)',
                                 color: active ? '#0E7C7B' : 'rgba(255,255,255,0.8)' }}>
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ SEARCH ══ */}
      <div className="px-4 py-3 flex-shrink-0"
           style={{ background:'white', borderBottom:'1px solid rgba(0,0,0,0.08)', boxShadow:'0 1px 6px rgba(0,0,0,0.05)' }}>
        <div className="relative">
          <Search style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#9CA3AF' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Tìm học viên..."
            className="w-full rounded-2xl focus:outline-none"
            style={{
              paddingLeft:42, paddingRight: search ? 42 : 16, paddingTop:12, paddingBottom:12,
              fontSize:14, color:'#1F2933',
              background: search ? 'rgba(14,124,123,0.04)' : 'rgba(0,0,0,0.05)',
              border: `1.5px solid ${search ? 'rgba(14,124,123,0.25)' : 'rgba(0,0,0,0.09)'}`,
              transition: 'all 0.2s',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center active:scale-90"
                    style={{ background:'rgba(0,0,0,0.08)' }}>
              <X style={{ width:13, height:13, color:'#6B7280' }} />
            </button>
          )}
        </div>
      </div>

      {/* ══ SCROLLABLE LIST ══ */}
      <div className="flex-1 overflow-y-auto pb-36">

        {/* ─── Summary card ─── */}
        <div className="mx-4 mt-3 mb-2">
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: isFull ? '1.5px solid rgba(244,162,97,0.4)' : '1.5px solid rgba(14,124,123,0.2)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>

            <div className="flex items-center gap-0 divide-x"
                 style={{ borderBottom:'1px solid rgba(0,0,0,0.07)', '--tw-divide-opacity':'1' } as React.CSSProperties}>
              {/* Đã chọn */}
              <div className="flex-1 flex flex-col items-center py-3">
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize:22, fontWeight:900, color:'#0E7C7B', lineHeight:1 }}>{total}</span>
                  <span style={{ fontSize:12, color:'#9CA3AF' }}>HV</span>
                </div>
                <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF', marginTop:2 }}>Đã chọn</span>
              </div>
              <div style={{ width:'1px', background:'rgba(0,0,0,0.07)', alignSelf:'stretch' }} />
              {/* Sức chứa */}
              <div className="flex-1 flex flex-col items-center py-3">
                <div className="flex items-baseline gap-0.5">
                  <span style={{ fontSize:22, fontWeight:900, color: isFull ? '#C97B38' : '#1F2933', lineHeight:1 }}>{total}</span>
                  <span style={{ fontSize:14, color:'#9CA3AF', fontWeight:700 }}>/{MAX_CAPACITY}</span>
                </div>
                <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF', marginTop:2 }}>Sức chứa</span>
              </div>
              <div style={{ width:'1px', background:'rgba(0,0,0,0.07)', alignSelf:'stretch' }} />
              {/* Còn trống */}
              <div className="flex-1 flex flex-col items-center py-3">
                <div className="flex items-baseline gap-1">
                  <span style={{ fontSize:22, fontWeight:900, color: MAX_CAPACITY - total === 0 ? '#E76F51' : '#374151', lineHeight:1 }}>
                    {MAX_CAPACITY - total}
                  </span>
                  <span style={{ fontSize:12, color:'#9CA3AF' }}>chỗ</span>
                </div>
                <span style={{ fontSize:11, fontWeight:600, color:'#9CA3AF', marginTop:2 }}>Còn trống</span>
              </div>
            </div>

            {/* capacity bar */}
            <div className="px-4 py-2.5">
              <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                <div className="h-full rounded-full transition-all duration-300"
                     style={{ width:`${capPct}%`, background: isFull ? 'linear-gradient(90deg,#F4A261,#E76F51)' : 'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }} />
              </div>
            </div>

            {/* change diff */}
            {(added > 0 || removed > 0) && (
              <div className="flex items-center gap-3 px-4 pb-3">
                {added > 0 && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                        style={{ fontSize:11, fontWeight:800, background:'rgba(42,157,143,0.12)', color:'#1A7B6E' }}>
                    <CheckCircle2 style={{ width:11, height:11 }} /> +{added} thêm mới
                  </span>
                )}
                {removed > 0 && (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                        style={{ fontSize:11, fontWeight:800, background:'rgba(231,111,81,0.1)', color:'#C85A3D' }}>
                    <MinusCircle style={{ width:11, height:11 }} /> -{removed} gỡ ra
                  </span>
                )}
                <span style={{ fontSize:10, color:'#9CA3AF', marginLeft:'auto' }}>Chưa lưu</span>
              </div>
            )}
          </div>
        </div>

        {/* ─── Capacity full warning ─── */}
        {isFull && (
          <div className="mx-4 mb-3 flex items-center gap-2.5 px-4 py-3 rounded-2xl"
               style={{ background:'rgba(233,196,106,0.12)', border:'1.5px solid rgba(233,196,106,0.4)' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(233,196,106,0.25)' }}>
              <AlertTriangle style={{ width:16, height:16, color:'#A07B10' }} />
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:800, color:'#92620A' }}>Lớp đã đầy {MAX_CAPACITY}/{MAX_CAPACITY}</p>
              <p style={{ fontSize:11, color:'#A07B10' }}>Bỏ chọn học viên để thêm người khác.</p>
            </div>
          </div>
        )}

        {/* ─── List header ─── */}
        <div className="flex items-center justify-between px-4 mb-2">
          <span style={{ fontSize:12, fontWeight:700, color:'#6B7280' }}>
            {filtered.length} học viên
          </span>
          <button
            onClick={() => {
              const allIds = filtered.map(s => s.id);
              const allSelected = allIds.every(id => selected.has(id));
              setSelected(prev => {
                const next = new Set(prev);
                if (allSelected) {
                  // deselect those in filtered that are NOT in original
                  allIds.forEach(id => { if (!original.has(id)) next.delete(id); });
                } else {
                  // select all that fit within capacity
                  allIds.forEach(id => { if (next.size < MAX_CAPACITY) next.add(id); });
                }
                return next;
              });
            }}
            className="px-3 py-1.5 rounded-xl active:scale-95 transition-all"
            style={{ background:'rgba(14,124,123,0.08)', border:'1px solid rgba(14,124,123,0.2)' }}>
            <span style={{ fontSize:11, fontWeight:800, color:'#0E7C7B' }}>
              {filtered.every(s => selected.has(s.id)) ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            </span>
          </button>
        </div>

        {/* ─── No results ─── */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-12 px-4 gap-3">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                 style={{ background:'rgba(0,0,0,0.05)' }}>
              <Search style={{ width:22, height:22, color:'#C0C7D0' }} />
            </div>
            <p style={{ fontSize:14, color:'#9CA3AF', textAlign:'center' }}>
              Không tìm thấy học viên nào phù hợp.
            </p>
          </div>
        )}

        {/* ─── Student items ─── */}
        <div className="px-4 space-y-2 pb-2">
          {filtered.map(s => {
            const isSelected = selected.has(s.id);
            const wasIn      = original.has(s.id);
            const changed    = isSelected !== wasIn;
            const st         = statusOf(s.remaining);
            const badge      = STU_BADGE[st];
            const disabled   = !isSelected && isFull;
            const usedPct    = s.remaining > 0 ? Math.max(10, 100 - (s.remaining / 20 * 100)) : 100;
            const barColor   = st === 'expired' ? '#E76F51' : st === 'expiring' ? '#F4A261' : '#2A9D8F';
            const lcol       = LEVEL_COLOR[s.levelLabel] ?? '#6B7280';

            return (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                disabled={disabled}
                className="w-full text-left active:scale-[0.99] transition-all"
              >
                <div
                  className="bg-white flex items-start gap-0 overflow-hidden"
                  style={{
                    borderRadius: 20,
                    border: `1.5px solid ${
                      isSelected
                        ? (st === 'expired' ? 'rgba(231,111,81,0.3)' : 'rgba(14,124,123,0.3)')
                        : 'rgba(0,0,0,0.09)'}`,
                    boxShadow: isSelected ? '0 3px 14px rgba(14,124,123,0.12)' : '0 1px 4px rgba(0,0,0,0.04)',
                    opacity:    disabled ? 0.4 : 1,
                    background: isSelected
                      ? (st === 'expired' ? 'rgba(231,111,81,0.03)' : st === 'expiring' ? 'rgba(244,162,97,0.03)' : 'rgba(14,124,123,0.03)')
                      : 'white',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {/* left accent bar (selected only) */}
                  {isSelected && (
                    <div className="w-1 self-stretch flex-shrink-0 rounded-l-xl"
                         style={{ background: st === 'expired' ? '#E76F51' : st === 'expiring' ? '#F4A261' : '#0E7C7B' }} />
                  )}

                  <div className="flex items-start gap-3 p-4 flex-1 min-w-0">

                    {/* ── CHECKBOX ── */}
                    <div
                      className="relative w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 transition-all mt-0.5"
                      style={{
                        background:  isSelected ? (st === 'expired' ? '#E76F51' : st === 'expiring' ? '#F4A261' : '#0E7C7B') : 'white',
                        border:      `2px solid ${isSelected ? 'transparent' : 'rgba(0,0,0,0.18)'}`,
                        boxShadow:   isSelected ? `0 3px 10px ${st === 'expired' ? 'rgba(231,111,81,0.35)' : st === 'expiring' ? 'rgba(244,162,97,0.35)' : 'rgba(14,124,123,0.35)'}` : 'none',
                        transform:   isSelected ? 'scale(1.05)' : 'scale(1)',
                      }}
                    >
                      {isSelected
                        ? <Check style={{ width:14, height:14, color:'white' }} />
                        : <div className="w-2 h-2 rounded-full" style={{ background:'rgba(0,0,0,0.12)' }} />
                      }
                      {/* change indicator dot */}
                      {changed && (
                        <div className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full border-2 border-white"
                             style={{ background: isSelected ? '#2A9D8F' : '#E76F51' }} />
                      )}
                    </div>

                    {/* ── AVATAR ── */}
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 relative"
                      style={{ background: s.color + '1A', border: `1.5px solid ${s.color}30` }}
                    >
                      <span style={{ fontSize:12, fontWeight:900, color:s.color }}>{s.ini}</span>
                      {st === 'expired' && (
                        <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center"
                             style={{ width:17, height:17, background:'#E76F51', border:'2px solid white' }}>
                          <XCircle style={{ width:10, height:10, color:'white' }} />
                        </div>
                      )}
                      {st === 'expiring' && (
                        <div className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
                             style={{ width:17, height:17, background:'#F4A261', border:'2px solid white' }}>
                          <AlertTriangle style={{ width:9, height:9, color:'white' }} />
                        </div>
                      )}
                    </div>

                    {/* ── INFO ── */}
                    <div className="flex-1 min-w-0">
                      {/* row 1: name + badge */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span style={{ fontSize:14, fontWeight:800, color:'#1F2933' }} className="truncate">
                            {s.name}
                          </span>
                          {/* in-class badge */}
                          {wasIn && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full"
                                  style={{ fontSize:9, fontWeight:800, background:'rgba(14,124,123,0.12)', color:'#0E7C7B' }}>
                              Trong lớp
                            </span>
                          )}
                          {/* change badge */}
                          {changed && (
                            <span className="flex-shrink-0 px-1.5 py-0.5 rounded-full"
                                  style={{ fontSize:9, fontWeight:800,
                                           background: isSelected ? 'rgba(42,157,143,0.12)' : 'rgba(231,111,81,0.12)',
                                           color:      isSelected ? '#1A7B6E' : '#C85A3D' }}>
                              {isSelected ? '+ Thêm' : '- Gỡ'}
                            </span>
                          )}
                        </div>
                        {/* status badge (prominent for expiring/expired) */}
                        {st !== 'active' && (
                          <span className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-xl"
                                style={{ fontSize:10, fontWeight:800, color:badge.color, background:badge.bg, border:`1px solid ${badge.border}` }}>
                            {st === 'expired'
                              ? <XCircle style={{ width:10, height:10 }} />
                              : <AlertTriangle style={{ width:10, height:10 }} />
                            }
                            {badge.label}
                          </span>
                        )}
                      </div>

                      {/* row 2: phone + level + other class */}
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <div className="flex items-center gap-1">
                          <Phone style={{ width:10, height:10, color:'#9CA3AF' }} />
                          <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:500 }}>{s.phone}</span>
                        </div>
                        <span style={{ color:'rgba(0,0,0,0.15)', fontSize:11 }}>·</span>
                        <span className="px-1.5 py-0.5 rounded-full"
                              style={{ fontSize:10, fontWeight:800, background: lcol + '15', color:lcol }}>
                          {s.levelLabel}
                        </span>
                        {s.otherClass && !s.inCurrentClass && (
                          <>
                            <span style={{ color:'rgba(0,0,0,0.15)', fontSize:11 }}>·</span>
                            <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>
                              {s.otherClass}
                            </span>
                          </>
                        )}
                        {!s.inAnyClass && !s.inCurrentClass && (
                          <>
                            <span style={{ color:'rgba(0,0,0,0.15)', fontSize:11 }}>·</span>
                            <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:700 }}>Chưa có lớp</span>
                          </>
                        )}
                      </div>

                      {/* row 3: remaining sessions bar */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                          <div className="h-full rounded-full transition-all duration-500"
                               style={{ width:`${100 - Math.min(100, s.remaining * 5)}%`, background:barColor }} />
                        </div>
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full"
                              style={{
                                fontSize:10, fontWeight:800,
                                color:      s.remaining === 0 ? '#C85A3D' : s.remaining <= 3 ? '#C97B38' : '#374151',
                                background: s.remaining === 0 ? 'rgba(231,111,81,0.1)' : s.remaining <= 3 ? 'rgba(244,162,97,0.12)' : 'rgba(0,0,0,0.06)',
                              }}>
                          {s.remaining === 0 ? 'Hết buổi' : `Còn ${s.remaining} buổi`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 max-w-[390px] mx-auto"
           style={{ background:'white', borderTop:'1px solid rgba(0,0,0,0.09)',
                    paddingLeft:16, paddingRight:16, paddingTop:12, paddingBottom:28,
                    boxShadow:'0 -6px 24px rgba(0,0,0,0.08)' }}>

        {/* unsaved changes summary */}
        {(added > 0 || removed > 0) && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
               style={{ background:'rgba(14,124,123,0.06)', border:'1px solid rgba(14,124,123,0.15)' }}>
            <Users style={{ width:13, height:13, color:'#0E7C7B', flexShrink:0 }} />
            <span style={{ fontSize:12, color:'#0E7C7B', fontWeight:600 }}>
              Thay đổi chưa lưu:
              {added > 0   && <strong style={{ color:'#1A7B6E' }}> +{added} thêm</strong>}
              {removed > 0 && <strong style={{ color:'#C85A3D' }}> · -{removed} gỡ</strong>}
            </span>
          </div>
        )}

        <div className="flex gap-3">
          {/* Hủy */}
          <button onClick={onBack}
                  className="flex items-center justify-center gap-2 rounded-2xl active:scale-95 transition-all"
                  style={{ width:90, flexShrink:0, paddingTop:15, paddingBottom:15,
                           border:'1.5px solid rgba(0,0,0,0.12)', background:'rgba(0,0,0,0.04)',
                           fontSize:14, fontWeight:700, color:'#6B7280' }}>
            <X style={{ width:15, height:15 }} /> Hủy
          </button>

          {/* Lưu danh sách lớp */}
          <button onClick={onConfirm}
                  className="flex-1 flex items-center justify-between px-4 rounded-2xl active:scale-[0.98] transition-all"
                  style={{
                    paddingTop:15, paddingBottom:15,
                    background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
                    boxShadow:  '0 8px 24px rgba(14,124,123,0.40)',
                  }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background:'rgba(255,255,255,0.2)' }}>
                <UserPlus style={{ width:15, height:15, color:'white' }} />
              </div>
              <div className="text-left">
                <p style={{ fontSize:14, fontWeight:900, color:'white' }}>Lưu danh sách lớp</p>
                <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)' }}>
                  {total} học viên · {CLASS_NAME}
                </p>
              </div>
            </div>
            <div className="px-2.5 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize:13, fontWeight:900, color:'white' }}>{total}/{MAX_CAPACITY}</span>
            </div>
          </button>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display:none; }
        .no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
      `}</style>
    </div>
  );
}
