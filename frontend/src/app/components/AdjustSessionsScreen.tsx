import { useState, useMemo, useRef } from 'react';
import {
  ArrowLeft, Plus, Minus, RefreshCw, AlertTriangle,
  CheckCircle2, FileText, ChevronRight, ShieldAlert,
  SlidersHorizontal, Pen, Info, Lock, TrendingUp,
  TrendingDown, Equal, Zap, ArrowRight, ClipboardCheck
} from 'lucide-react';

/* ─── Types ────────────────────────────────────────────────── */
type AdjustType = 'add' | 'subtract' | 'set';

/* ─── Constants ────────────────────────────────────────────── */
const STUDENT = {
  name:      'Nguyễn Văn A',
  initials:  'NA',
  class:     'Beginner A',
  coach:     'Coach Nam',
};
const CURRENT = { total: 12, attended: 5, remaining: 7 };

const REASON_CHIPS = [
  'Nhầm lẫn khi nhập liệu',
  'Học viên mua thêm buổi lẻ',
  'Điều chỉnh từ bản ghi cũ',
  'Hủy buổi / hoàn lại',
  'Chuyển nhượng từ HV khác',
];

const TYPE_CFG: Record<AdjustType, {
  label: string; sublabel: string;
  icon: React.FC<{ style?: React.CSSProperties }>;
  color: string; bg: string; border: string; gradient: string;
}> = {
  add: {
    label: 'Cộng thêm', sublabel: 'Tăng số buổi',
    icon: TrendingUp,
    color:    '#1A7B6E',
    bg:       'rgba(42,157,143,0.12)',
    border:   'rgba(42,157,143,0.4)',
    gradient: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
  },
  subtract: {
    label: 'Trừ bớt', sublabel: 'Giảm số buổi',
    icon: TrendingDown,
    color:    '#C85A3D',
    bg:       'rgba(231,111,81,0.1)',
    border:   'rgba(231,111,81,0.4)',
    gradient: 'linear-gradient(135deg,#9E1010 0%,#C62828 40%,#E76F51 100%)',
  },
  set: {
    label: 'Cập nhật thủ công', sublabel: 'Đặt tổng buổi',
    icon: Equal,
    color:    '#264653',
    bg:       'rgba(38,70,83,0.09)',
    border:   'rgba(38,70,83,0.3)',
    gradient: 'linear-gradient(135deg,#264653 0%,#2A9D8F 100%)',
  },
};

/* ─── Props ────────────────────────────────────────────────── */
interface AdjustSessionsScreenProps {
  onBack:    () => void;
  onConfirm: () => void;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export function AdjustSessionsScreen({ onBack, onConfirm }: AdjustSessionsScreenProps) {

  /* ── State ── */
  const [adjType,      setAdjType]      = useState<AdjustType>('add');
  const [amount,       setAmount]       = useState(2);       // for add / subtract
  const [setTotal,     setSetTotal]     = useState(CURRENT.total); // for "set" mode
  const [reason,       setReason]       = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showCustom,   setShowCustom]   = useState(false);
  const [reasonError,  setReasonError]  = useState(false);
  const [confirmed,    setConfirmed]    = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* ── Computed new values ── */
  const { newTotal, newRemaining } = useMemo(() => {
    if (adjType === 'add') {
      const nt = CURRENT.total + amount;
      return { newTotal: nt, newRemaining: CURRENT.remaining + amount };
    }
    if (adjType === 'subtract') {
      const nt = Math.max(0, CURRENT.total - amount);
      const nr = Math.max(0, nt - CURRENT.attended);
      return { newTotal: nt, newRemaining: nr };
    }
    // set
    const nt = Math.max(0, setTotal);
    const nr = Math.max(0, nt - CURRENT.attended);
    return { newTotal: nt, newRemaining: nr };
  }, [adjType, amount, setTotal]);

  const delta          = newRemaining - CURRENT.remaining;
  const totalDelta     = newTotal - CURRENT.total;
  const finalReason    = showCustom ? customReason : reason;
  const canConfirm     = finalReason.trim().length > 0 && !confirmed;

  /* ── Warnings ── */
  const warnNegativeRemaining = adjType === 'subtract' && amount > CURRENT.remaining;
  const warnZeroRemaining     = newRemaining === 0 && delta < 0;
  const warnSetLow            = adjType === 'set' && setTotal < CURRENT.attended;

  const cfg = TYPE_CFG[adjType];

  /* ── Helpers ── */
  function stepAmount(d: number) {
    setAmount(v => Math.max(1, v + d));
  }

  function handleChip(chip: string) {
    if (chip === reason && !showCustom) { setReason(''); return; }
    setReason(chip);
    setShowCustom(false);
    setReasonError(false);
  }

  function handleCustom() {
    setShowCustom(s => !s);
    setReason('');
    setTimeout(() => textareaRef.current?.focus(), 60);
  }

  function handleConfirm() {
    if (!finalReason.trim()) { setReasonError(true); return; }
    setConfirmed(true);
    setTimeout(onConfirm, 800);
  }

  /* ── Delta label ── */
  function DeltaBadge({ val, className }: { val: number; className?: string }) {
    if (val === 0) return <span className={className} style={{ fontSize:11, color:'#9CA3AF', fontWeight:700 }}>= Không đổi</span>;
    const positive = val > 0;
    return (
      <span className={className}
            style={{ fontSize:11, fontWeight:900, color: positive ? '#1A7B6E' : '#C85A3D',
                     background: positive ? 'rgba(42,157,143,0.12)' : 'rgba(231,111,81,0.1)',
                     border: `1px solid ${positive ? 'rgba(42,157,143,0.3)' : 'rgba(231,111,81,0.3)'}`,
                     borderRadius:99, padding:'2px 8px' }}>
        {positive ? '▲' : '▼'}{Math.abs(val)}
      </span>
    );
  }

  /* ─────────────────────────────────── RENDER ─── */
  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* ══ HEADER ══ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(150deg,#032E2E 0%,#054A49 35%,#0E7C7B 75%,#1A8E87 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top:-24, right:-20, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />

        <div className="relative px-4 pt-12 pb-5">
          {/* top row */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width:18, height:18, color:'white' }} />
            </button>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)', letterSpacing:'0.04em' }}>ADMIN · Điều chỉnh dữ liệu</p>
              <h1 style={{ fontSize:19, fontWeight:900, color:'white', lineHeight:1.2 }}>Điều chỉnh số buổi</h1>
            </div>
            <div className="flex-shrink-0 w-11 h-11 rounded-2xl flex items-center justify-center"
                 style={{ background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.3)', fontSize:12, fontWeight:900, color:'white' }}>
              {STUDENT.initials}
            </div>
          </div>

          {/* student + admin badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                 style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)' }}>
              <SlidersHorizontal style={{ width:11, height:11, color:'rgba(255,255,255,0.8)' }} />
              <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>{STUDENT.name}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                 style={{ background:'rgba(231,111,81,0.35)', border:'1px solid rgba(231,111,81,0.5)' }}>
              <ShieldAlert style={{ width:10, height:10, color:'#FFD49E' }} />
              <span style={{ fontSize:10, fontWeight:800, color:'#FFD49E' }}>Chỉ Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══ SCROLLABLE BODY ══ */}
      <div className="flex-1 overflow-y-auto pb-36">
        <div className="px-4 pt-4 space-y-4">

          {/* ══════════════════════════════════════════
              CURRENT SUMMARY CARD
          ══════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* header row */}
            <div className="flex items-center gap-2 px-4 py-3"
                 style={{ background:'rgba(14,124,123,0.06)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
              <ClipboardCheck style={{ width:13, height:13, color:'#0E7C7B' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#0E7C7B', letterSpacing:'0.04em' }}>
                TÌNH TRẠNG BUỔI HỌC HIỆN TẠI
              </span>
            </div>

            {/* 3 stat cols */}
            <div className="grid grid-cols-3 divide-x" style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
              {[
                { label:'Tổng đã mua', value:CURRENT.total,     color:'#1F2933'  },
                { label:'Đã học',      value:CURRENT.attended,  color:'#6B7280'  },
                { label:'Còn lại',     value:CURRENT.remaining, color:'#2A9D8F'  },
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center py-4 px-2">
                  <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600, marginBottom:6 }}>{s.label}</span>
                  <span style={{ fontSize:30, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</span>
                  <span style={{ fontSize:10, color:'#C0C7D0', marginTop:4 }}>buổi</span>
                </div>
              ))}
            </div>

            {/* progress bar */}
            <div className="px-4 py-3.5">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>Tiến độ đã học</span>
                <span style={{ fontSize:11, fontWeight:800, color:'#6B7280' }}>
                  {CURRENT.attended}/{CURRENT.total} · {Math.round(CURRENT.attended/CURRENT.total*100)}%
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                <div className="h-full rounded-full" style={{ width:`${CURRENT.attended/CURRENT.total*100}%`, background:'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }} />
              </div>
              <div className="flex items-center gap-2 mt-2.5">
                <Info style={{ width:11, height:11, color:'#9CA3AF', flexShrink:0 }} />
                <span style={{ fontSize:10, color:'#B0B7C3' }}>
                  {STUDENT.class} · {STUDENT.coach}
                </span>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              ADJUSTMENT TYPE
          ══════════════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:'rgba(14,124,123,0.1)' }}>
                <SlidersHorizontal style={{ width:12, height:12, color:'#0E7C7B' }} />
              </div>
              <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.05em' }}>
                LOẠI ĐIỀU CHỈNH
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {(Object.entries(TYPE_CFG) as [AdjustType, typeof TYPE_CFG.add][]).map(([key, c]) => {
                const active = adjType === key;
                return (
                  <button key={key}
                          onClick={() => { setAdjType(key); setAmount(2); setSetTotal(CURRENT.total); }}
                          className="flex flex-col items-center rounded-2xl py-3.5 px-2 transition-all active:scale-95"
                          style={{
                            background: active ? c.bg : 'white',
                            border:     `1.5px solid ${active ? c.border : 'rgba(0,0,0,0.09)'}`,
                            boxShadow:  active ? `0 4px 16px ${c.color}25` : '0 1px 4px rgba(0,0,0,0.05)',
                          }}>
                    {/* icon circle */}
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-2"
                         style={{ background: active ? c.bg : 'rgba(0,0,0,0.05)',
                                  border: `1.5px solid ${active ? c.border : 'transparent'}` }}>
                      <c.icon style={{ width:18, height:18, color: active ? c.color : '#9CA3AF' }} />
                    </div>
                    <span style={{ fontSize:12, fontWeight:900, color: active ? c.color : '#6B7280',
                                   textAlign:'center', lineHeight:1.3 }}>
                      {c.label}
                    </span>
                    <span style={{ fontSize:9, color: active ? c.color+'CC' : '#B0B7C3', marginTop:2, fontWeight:600 }}>
                      {c.sublabel}
                    </span>
                    {active && (
                      <div className="w-1.5 h-1.5 rounded-full mt-2" style={{ background:c.color }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              AMOUNT INPUT
          ══════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border:`1.5px solid ${cfg.border}`, boxShadow:`0 4px 20px ${cfg.color}15` }}>

            {/* type strip */}
            <div className="flex items-center gap-2.5 px-4 py-3"
                 style={{ background:cfg.bg, borderBottom:`1px solid ${cfg.border}` }}>
              <cfg.icon style={{ width:14, height:14, color:cfg.color }} />
              <div>
                <span style={{ fontSize:12, fontWeight:900, color:cfg.color }}>{cfg.label} buổi học</span>
                <span style={{ fontSize:10, color:cfg.color+'99', fontWeight:600, marginLeft:6 }}>
                  {adjType === 'set' ? 'Nhập tổng buổi mới' : 'Nhập số buổi điều chỉnh'}
                </span>
              </div>
            </div>

            <div className="px-4 py-5">

              {/* ── Add / Subtract: Stepper ── */}
              {adjType !== 'set' && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-5">
                    {/* Minus */}
                    <button
                      onClick={() => stepAmount(-1)}
                      disabled={amount <= 1}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                      style={{
                        background: amount <= 1 ? 'rgba(0,0,0,0.05)' : cfg.bg,
                        border:     `2px solid ${amount <= 1 ? 'rgba(0,0,0,0.08)' : cfg.border}`,
                        boxShadow:  amount <= 1 ? 'none' : `0 4px 12px ${cfg.color}20`,
                      }}>
                      <Minus style={{ width:20, height:20, color: amount <= 1 ? '#D1D5DB' : cfg.color }} />
                    </button>

                    {/* number */}
                    <div className="flex flex-col items-center" style={{ minWidth:100 }}>
                      <span style={{ fontSize:56, fontWeight:900, color:cfg.color, lineHeight:1 }}>{amount}</span>
                      <span style={{ fontSize:13, color:'#9CA3AF', fontWeight:700, marginTop:4 }}>buổi</span>
                    </div>

                    {/* Plus */}
                    <button
                      onClick={() => stepAmount(+1)}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                      style={{ background:cfg.bg, border:`2px solid ${cfg.border}`, boxShadow:`0 4px 12px ${cfg.color}20` }}>
                      <Plus style={{ width:20, height:20, color:cfg.color }} />
                    </button>
                  </div>

                  {/* quick amount chips */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    {[1,2,3,5,10].map(n => (
                      <button key={n} onClick={() => setAmount(n)}
                              className="px-3.5 py-1.5 rounded-xl active:scale-95 transition-all"
                              style={{
                                fontSize:12, fontWeight: amount === n ? 800 : 600,
                                background: amount === n ? cfg.bg : 'rgba(0,0,0,0.05)',
                                border:     `1.5px solid ${amount === n ? cfg.border : 'transparent'}`,
                                color:      amount === n ? cfg.color : '#9CA3AF',
                              }}>
                        {n === amount ? '✓ ' : ''}{n}
                      </button>
                    ))}
                  </div>

                  {/* subtract limit warning */}
                  {adjType === 'subtract' && amount > CURRENT.remaining && (
                    <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl"
                         style={{ background:'rgba(231,111,81,0.08)', border:'1px solid rgba(231,111,81,0.3)' }}>
                      <AlertTriangle style={{ width:13, height:13, color:'#E76F51', flexShrink:0 }} />
                      <p style={{ fontSize:12, color:'#C85A3D', fontWeight:600 }}>
                        Trừ nhiều hơn số buổi còn lại ({CURRENT.remaining}). Số dư sẽ về 0.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* ── Set mode: Manual total input ── */}
              {adjType === 'set' && (
                <div className="flex flex-col items-center gap-4">
                  <div>
                    <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:700, textAlign:'center', marginBottom:12 }}>
                      TỔNG BUỔI MỚI
                    </p>
                    <div className="flex items-center gap-4">
                      <button onClick={() => setSetTotal(v => Math.max(0, v - 1))}
                              className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                              style={{ background:cfg.bg, border:`2px solid ${cfg.border}`, boxShadow:`0 4px 12px ${cfg.color}15` }}>
                        <Minus style={{ width:20, height:20, color:cfg.color }} />
                      </button>

                      <div className="flex flex-col items-center" style={{ minWidth:100 }}>
                        <span style={{ fontSize:56, fontWeight:900, color:cfg.color, lineHeight:1 }}>{setTotal}</span>
                        <span style={{ fontSize:13, color:'#9CA3AF', fontWeight:700, marginTop:4 }}>buổi tổng</span>
                      </div>

                      <button onClick={() => setSetTotal(v => v + 1)}
                              className="w-14 h-14 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
                              style={{ background:cfg.bg, border:`2px solid ${cfg.border}`, boxShadow:`0 4px 12px ${cfg.color}15` }}>
                        <Plus style={{ width:20, height:20, color:cfg.color }} />
                      </button>
                    </div>
                  </div>

                  {warnSetLow && (
                    <div className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl"
                         style={{ background:'rgba(231,111,81,0.08)', border:'1px solid rgba(231,111,81,0.3)' }}>
                      <AlertTriangle style={{ width:13, height:13, color:'#E76F51', flexShrink:0 }} />
                      <p style={{ fontSize:12, color:'#C85A3D', fontWeight:600 }}>
                        Tổng mới ({setTotal}) nhỏ hơn số buổi đã học ({CURRENT.attended}). Còn lại sẽ về 0.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              LIVE PREVIEW CARD
          ══════════════════════════════════════════ */}
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.05)' }}>

            <div className="flex items-center gap-2 px-4 py-3"
                 style={{ background:'rgba(0,0,0,0.04)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
              <Zap style={{ width:13, height:13, color:'#6B7280' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.04em' }}>XEM TRƯỚC THAY ĐỔI</span>
            </div>

            <div className="px-4 py-4">
              {/* header cols */}
              <div className="grid grid-cols-3 mb-3">
                <div className="text-center">
                  <span className="px-2.5 py-1 rounded-lg"
                        style={{ fontSize:10, fontWeight:800, color:'#6B7280', background:'rgba(0,0,0,0.06)' }}>
                    TRƯỚC
                  </span>
                </div>
                <div />
                <div className="text-center">
                  <span className="px-2.5 py-1 rounded-lg"
                        style={{ fontSize:10, fontWeight:800, color:cfg.color, background:cfg.bg }}>
                    SAU
                  </span>
                </div>
              </div>

              {/* rows */}
              {[
                { label:'Tổng buổi',  before:CURRENT.total,     after:newTotal,     delta:totalDelta },
                { label:'Đã học',     before:CURRENT.attended,  after:CURRENT.attended, delta:0      },
                { label:'Còn lại',    before:CURRENT.remaining, after:newRemaining, delta:delta, highlight:true },
              ].map((row, i) => (
                <div key={i}
                     className="grid grid-cols-3 items-center py-3.5"
                     style={{
                       borderTop: i > 0 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                       background: row.highlight ? (delta > 0 ? 'rgba(42,157,143,0.04)' : delta < 0 ? 'rgba(231,111,81,0.04)' : 'transparent') : 'transparent',
                       borderRadius: row.highlight ? 12 : 0,
                       marginLeft: row.highlight ? -4 : 0,
                       marginRight: row.highlight ? -4 : 0,
                       paddingLeft: row.highlight ? 4 : 0,
                       paddingRight: row.highlight ? 4 : 0,
                     }}>

                  {/* before */}
                  <div className="flex flex-col items-center">
                    <span style={{ fontSize:22, fontWeight:900, color:'#9CA3AF', lineHeight:1 }}>{row.before}</span>
                    {row.highlight && <span style={{ fontSize:9, color:'#C0C7D0', fontWeight:700, marginTop:2 }}>{row.label}</span>}
                  </div>

                  {/* arrow */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center">
                      <ArrowRight style={{ width:16, height:16, color: row.delta !== 0 ? cfg.color : '#D1D5DB' }} />
                    </div>
                    {i === 0 && <span style={{ fontSize:10, color:'#B0B7C3', fontWeight:600 }}>{row.label}</span>}
                  </div>

                  {/* after */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 flex-col">
                      <span style={{
                        fontSize:22, fontWeight:900, lineHeight:1,
                        color: row.delta > 0 ? '#1A7B6E' : row.delta < 0 ? '#C85A3D' : '#6B7280',
                      }}>
                        {row.after}
                      </span>
                      {row.delta !== 0 && <DeltaBadge val={row.delta} />}
                    </div>
                    {row.highlight && row.delta === 0 && (
                      <span style={{ fontSize:9, color:'#C0C7D0', fontWeight:700, marginTop:2 }}>không đổi</span>
                    )}
                  </div>
                </div>
              ))}

              {/* progress comparison */}
              <div className="mt-3 pt-3" style={{ borderTop:'1px solid rgba(0,0,0,0.06)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:700 }}>TIẾN ĐỘ</span>
                  <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>
                    {CURRENT.attended}/{CURRENT.total} → {CURRENT.attended}/{newTotal}
                  </span>
                </div>
                {/* before bar */}
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ fontSize:9, color:'#B0B7C3', width:28 }}>Trước</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width:`${Math.min(100,CURRENT.attended/CURRENT.total*100)}%`, background:'rgba(107,114,128,0.4)' }} />
                  </div>
                  <span style={{ fontSize:9, color:'#B0B7C3', width:28, textAlign:'right' }}>
                    {Math.round(CURRENT.attended/CURRENT.total*100)}%
                  </span>
                </div>
                {/* after bar */}
                <div className="flex items-center gap-2">
                  <span style={{ fontSize:9, color:cfg.color, width:28, fontWeight:700 }}>Sau</span>
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                    <div className="h-full rounded-full transition-all duration-400"
                         style={{ width: newTotal > 0 ? `${Math.min(100,CURRENT.attended/newTotal*100)}%` : '0%',
                                  background:cfg.gradient }} />
                  </div>
                  <span style={{ fontSize:9, color:cfg.color, width:28, textAlign:'right', fontWeight:700 }}>
                    {newTotal > 0 ? Math.round(CURRENT.attended/newTotal*100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              REASON FIELD
          ══════════════════════════════════════════ */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:'rgba(14,124,123,0.1)' }}>
                <FileText style={{ width:12, height:12, color:'#0E7C7B' }} />
              </div>
              <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.05em' }}>LÝ DO ĐIỀU CHỈNH</span>
              <span className="px-2 py-0.5 rounded-full"
                    style={{ fontSize:9, fontWeight:800, color:'#C85A3D', background:'rgba(231,111,81,0.1)', border:'1px solid rgba(231,111,81,0.3)' }}>
                Bắt buộc *
              </span>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden"
                 style={{ border:`1.5px solid ${reasonError ? 'rgba(231,111,81,0.5)' : 'rgba(0,0,0,0.09)'}`, boxShadow: reasonError ? '0 0 0 3px rgba(231,111,81,0.1)' : '0 2px 10px rgba(0,0,0,0.05)', transition:'all 0.2s' }}>

              {/* quick chips */}
              <div className="p-4 pb-3" style={{ borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:700, marginBottom:10 }}>CHỌN NHANH</p>
                <div className="flex flex-wrap gap-2">
                  {REASON_CHIPS.map(chip => {
                    const active = reason === chip && !showCustom;
                    return (
                      <button key={chip} onClick={() => handleChip(chip)}
                              className="px-3 py-2 rounded-xl active:scale-95 transition-all"
                              style={{
                                fontSize:11, fontWeight: active ? 800 : 600,
                                background: active ? 'rgba(14,124,123,0.1)' : 'rgba(0,0,0,0.05)',
                                border:     `1.5px solid ${active ? 'rgba(14,124,123,0.35)' : 'transparent'}`,
                                color:      active ? '#0E7C7B' : '#6B7280',
                              }}>
                        {active && '✓ '}{chip}
                      </button>
                    );
                  })}
                  {/* Khác */}
                  <button onClick={handleCustom}
                          className="px-3 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
                          style={{
                            fontSize:11, fontWeight: showCustom ? 800 : 600,
                            background: showCustom ? 'rgba(14,124,123,0.1)' : 'rgba(0,0,0,0.05)',
                            border:     `1.5px solid ${showCustom ? 'rgba(14,124,123,0.35)' : 'transparent'}`,
                            color:      showCustom ? '#0E7C7B' : '#6B7280',
                          }}>
                    <Pen style={{ width:10, height:10 }} /> Khác...
                  </button>
                </div>
              </div>

              {/* custom textarea */}
              {showCustom && (
                <div className="px-4 py-3" style={{ borderBottom:'1px solid rgba(0,0,0,0.06)' }}>
                  <textarea
                    ref={textareaRef}
                    value={customReason}
                    onChange={e => { setCustomReason(e.target.value); setReasonError(false); }}
                    placeholder="Nhập lý do điều chỉnh cụ thể..."
                    rows={3}
                    className="w-full resize-none focus:outline-none"
                    style={{ fontSize:13, color:'#1F2933', lineHeight:1.6, background:'transparent', border:'none' }}
                  />
                  <div className="flex justify-end">
                    <span style={{ fontSize:10, color:'#C0C7D0' }}>{customReason.length}/300</span>
                  </div>
                </div>
              )}

              {/* selected reason preview */}
              {!showCustom && reason && (
                <div className="flex items-center gap-2.5 px-4 py-3"
                     style={{ background:'rgba(14,124,123,0.04)' }}>
                  <CheckCircle2 style={{ width:14, height:14, color:'#2A9D8F', flexShrink:0 }} />
                  <p style={{ fontSize:12, color:'#1A7B6E', fontWeight:700, flex:1 }}>{reason}</p>
                </div>
              )}

              {/* empty state / error */}
              {reasonError && (
                <div className="flex items-center gap-2 px-4 py-3"
                     style={{ background:'rgba(231,111,81,0.06)', borderTop:'1px solid rgba(231,111,81,0.2)' }}>
                  <AlertTriangle style={{ width:13, height:13, color:'#E76F51', flexShrink:0 }} />
                  <p style={{ fontSize:12, color:'#C85A3D', fontWeight:700 }}>
                    Vui lòng chọn hoặc nhập lý do điều chỉnh.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              WARNING CALLOUT
          ══════════════════════════════════════════ */}
          <div className="rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(233,196,106,0.4)', boxShadow:'0 2px 12px rgba(233,196,106,0.12)' }}>

            <div className="flex items-center gap-2.5 px-4 py-3"
                 style={{ background:'rgba(233,196,106,0.15)', borderBottom:'1px solid rgba(233,196,106,0.25)' }}>
              <AlertTriangle style={{ width:14, height:14, color:'#A07B10', flexShrink:0 }} />
              <span style={{ fontSize:12, fontWeight:900, color:'#92620A' }}>Lưu ý quan trọng</span>
            </div>

            <div className="px-4 py-3.5 space-y-2.5" style={{ background:'rgba(255,253,244,0.9)' }}>
              {[
                { e:'📋', t:'Mọi điều chỉnh nên có lý do rõ ràng để đối chiếu sau này.' },
                { e:'🔍', t:'Thao tác này sẽ được ghi vào nhật ký hệ thống với tên Admin.' },
                { e:'🔄', t:'Nếu sai lệch do điểm danh, hãy ưu tiên sửa lại buổi điểm danh trước.' },
              ].map((w, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ fontSize:14, flexShrink:0 }}>{w.e}</span>
                  <p style={{ fontSize:12, color:'#92620A', lineHeight:1.55, fontWeight:500 }}>{w.t}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 max-w-[390px] mx-auto"
           style={{ background:'white', borderTop:'1px solid rgba(0,0,0,0.09)',
                    paddingLeft:16, paddingRight:16, paddingTop:12, paddingBottom:28,
                    boxShadow:'0 -8px 28px rgba(0,0,0,0.09)' }}>

        {/* preview strip */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-3"
             style={{ background: delta !== 0 ? cfg.bg : 'rgba(0,0,0,0.05)',
                      border:`1px solid ${delta !== 0 ? cfg.border : 'rgba(0,0,0,0.08)'}` }}>
          <div className="flex items-center gap-1.5 flex-1">
            <cfg.icon style={{ width:12, height:12, color: delta !== 0 ? cfg.color : '#9CA3AF' }} />
            <span style={{ fontSize:11, fontWeight:700, color: delta !== 0 ? cfg.color : '#9CA3AF' }}>
              Còn lại: {CURRENT.remaining} buổi
            </span>
            <ArrowRight style={{ width:11, height:11, color: delta !== 0 ? cfg.color : '#D1D5DB' }} />
            <span style={{ fontSize:12, fontWeight:900, color: delta !== 0 ? cfg.color : '#9CA3AF' }}>
              {newRemaining} buổi
            </span>
          </div>
          {delta !== 0 && <DeltaBadge val={delta} />}
        </div>

        <div className="flex gap-3">
          {/* Hủy */}
          <button onClick={onBack}
                  className="flex items-center justify-center gap-2 rounded-2xl active:scale-95 transition-all"
                  style={{ width:88, flexShrink:0, paddingTop:15, paddingBottom:15,
                           background:'rgba(0,0,0,0.05)', border:'1.5px solid rgba(0,0,0,0.12)',
                           fontSize:14, fontWeight:700, color:'#6B7280' }}>
            <ArrowLeft style={{ width:14, height:14 }} /> Hủy
          </button>

          {/* Xác nhận */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-between px-4 rounded-2xl transition-all"
            style={{
              paddingTop:15, paddingBottom:15,
              background: canConfirm ? cfg.gradient : 'rgba(0,0,0,0.07)',
              boxShadow:  canConfirm ? `0 8px 24px ${cfg.color}40` : 'none',
              cursor:     canConfirm ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s ease',
              opacity:    confirmed ? 0.7 : 1,
            }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: canConfirm ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.07)' }}>
                {confirmed
                  ? <CheckCircle2 style={{ width:15, height:15, color:'white' }} />
                  : <cfg.icon style={{ width:15, height:15, color: canConfirm ? 'white' : '#9CA3AF' }} />
                }
              </div>
              <div className="text-left">
                <p style={{ fontSize:14, fontWeight:900, color: canConfirm ? 'white' : '#9CA3AF' }}>
                  {confirmed ? 'Đã xác nhận...' : 'Xác nhận điều chỉnh'}
                </p>
                <p style={{ fontSize:10, color: canConfirm ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.3)' }}>
                  {canConfirm
                    ? `${cfg.label} · ${adjType === 'set' ? `Tổng → ${newTotal}` : `${amount} buổi`}`
                    : 'Cần nhập lý do điều chỉnh'
                  }
                </p>
              </div>
            </div>
            {canConfirm && (
              <div className="px-2 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.2)' }}>
                <ChevronRight style={{ width:16, height:16, color:'white' }} />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
