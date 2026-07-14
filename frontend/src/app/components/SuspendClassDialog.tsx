import { useState, useEffect, useRef } from 'react';
import {
  PauseCircle, AlertTriangle, X, Users,
  CalendarDays, Clock, CheckCircle2,
  Ban, RotateCcw, ChevronRight, BookOpen,
  MapPin, Pen, Zap
} from 'lucide-react';

/* ─── Props ─────────────────────────────────────────────── */
export interface SuspendClassDialogProps {
  visible:        boolean;
  className?:     string;    // 'Beginner A'
  levelLabel?:    string;    // 'Cơ bản'
  coach?:         string;    // 'Coach Nam'
  court?:         string;    // 'Sân 1'
  days?:          string;    // 'T2 · T4 · T6'
  time?:          string;    // '18:00 – 19:30'
  studentCount?:  number;    // 8
  onClose:        () => void;
  onConfirm:      (reason: string) => void;
}

/* ─── Defaults ───────────────────────────────────────────── */
const DEF = {
  className:    'Beginner A',
  levelLabel:   'Cơ bản',
  coach:        'Coach Nam',
  court:        'Sân 1',
  days:         'T2 · T4 · T6',
  time:         '18:00 – 19:30',
  studentCount: 8,
};

/* ─── Quick-reason chips ──────────────────────────────────── */
const REASON_CHIPS = [
  'Thiếu học viên',
  'Sân không khả dụng',
  'Coach nghỉ dài hạn',
  'Cuối kỳ học',
  'Bảo trì cơ sở',
  'Thời tiết / Sự kiện',
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════ */
export function SuspendClassDialog({
  visible,
  className    = DEF.className,
  levelLabel   = DEF.levelLabel,
  coach        = DEF.coach,
  court        = DEF.court,
  days         = DEF.days,
  time         = DEF.time,
  studentCount = DEF.studentCount,
  onClose,
  onConfirm,
}: SuspendClassDialogProps) {

  const [mounted,      setMounted]      = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [reason,       setReason]       = useState('');
  const [customReason, setCustomReason] = useState('');
  const [showCustom,   setShowCustom]   = useState(false);
  const [countdown,    setCountdown]    = useState(3);
  const [btnReady,     setBtnReady]     = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);

  /* ── mount / slide animation ── */
  useEffect(() => {
    if (visible) {
      setMounted(true);
      setReason('');
      setCustomReason('');
      setShowCustom(false);
      setCountdown(3);
      setBtnReady(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSheetVisible(true);
          // countdown timer
          let c = 3;
          timerRef.current = setInterval(() => {
            c -= 1;
            setCountdown(c);
            if (c <= 0) {
              clearInterval(timerRef.current!);
              setBtnReady(true);
            }
          }, 1000);
        });
      });
    } else {
      setSheetVisible(false);
      if (timerRef.current) clearInterval(timerRef.current);
      const t = setTimeout(() => {
        setMounted(false);
        setReason('');
        setCustomReason('');
        setShowCustom(false);
        setCountdown(3);
        setBtnReady(false);
      }, 360);
      return () => clearTimeout(t);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [visible]);

  if (!mounted) return null;

  const finalReason = showCustom ? customReason : reason;

  function handleChip(chip: string) {
    if (chip === reason) {
      setReason('');
      setShowCustom(false);
    } else {
      setReason(chip);
      setShowCustom(false);
    }
  }

  function handleCustomToggle() {
    setShowCustom(s => !s);
    setReason('');
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  /* ─────────────────────────────────── RENDER ─── */
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[390px] mx-auto">

      {/* ── Backdrop ── */}
      <div
        className="absolute inset-0 transition-all duration-300"
        style={{
          background:   'rgba(10,20,20,0.72)',
          backdropFilter: sheetVisible ? 'blur(4px)' : 'none',
          opacity:      sheetVisible ? 1 : 0,
        }}
        onClick={onClose}
      />

      {/* ── Bottom sheet ── */}
      <div
        className="relative flex flex-col"
        style={{
          background:    'white',
          borderRadius:  '28px 28px 0 0',
          maxHeight:     '92vh',
          transform:     sheetVisible ? 'translateY(0)' : 'translateY(100%)',
          transition:    'transform 0.36s cubic-bezier(0.32,0.72,0,1)',
          boxShadow:     '0 -12px 60px rgba(0,0,0,0.28)',
          overflow:      'hidden',
        }}
      >

        {/* ── Danger gradient top strip ── */}
        <div style={{ height:5, background:'linear-gradient(90deg,#7B1010 0%,#C62828 30%,#E76F51 70%,#F4A261 100%)', flexShrink:0 }} />

        {/* ── Drag pill ── */}
        <div className="flex justify-center pt-3 pb-0 flex-shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ background:'rgba(0,0,0,0.12)' }} />
        </div>

        {/* ── Scrollable content ── */}
        <div className="overflow-y-auto flex-1 pb-6 px-5">

          {/* ── Icon + Title ── */}
          <div className="flex flex-col items-center pt-5 pb-5">
            {/* outer glow ring */}
            <div className="relative flex items-center justify-center mb-4">
              <div className="absolute inset-0 rounded-full" style={{ background:'rgba(231,111,81,0.1)', transform:'scale(1.6)' }} />
              <div className="absolute inset-0 rounded-full" style={{ background:'rgba(231,111,81,0.15)', transform:'scale(1.3)' }} />
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center relative"
                style={{
                  background: 'linear-gradient(145deg,#FFF0EB,#FFE4DC)',
                  border:     '2px solid rgba(231,111,81,0.35)',
                  boxShadow:  '0 6px 24px rgba(231,111,81,0.3)',
                }}
              >
                <PauseCircle style={{ width:30, height:30, color:'#E76F51' }} />
              </div>
            </div>

            <h2 style={{ fontSize:20, fontWeight:900, color:'#1F2933', textAlign:'center', lineHeight:1.2, marginBottom:8 }}>
              Ngưng lớp học?
            </h2>
            <p style={{ fontSize:13, color:'#6B7280', textAlign:'center', lineHeight:1.6, maxWidth:290 }}>
              Lớp <strong style={{ color:'#374151' }}>{className}</strong> sẽ được chuyển sang trạng thái tạm ngưng. Lớp này sẽ không còn xuất hiện trong danh sách tạo buổi học mặc định.
            </p>
          </div>

          {/* ── Class info card ── */}
          <div className="rounded-2xl overflow-hidden mb-4"
               style={{ background:'rgba(231,111,81,0.05)', border:'1.5px solid rgba(231,111,81,0.2)' }}>

            <div className="flex items-center gap-2 px-4 py-2.5"
                 style={{ background:'rgba(231,111,81,0.09)', borderBottom:'1px solid rgba(231,111,81,0.15)' }}>
              <BookOpen style={{ width:13, height:13, color:'#C85A3D' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#C85A3D', letterSpacing:'0.04em' }}>
                LỚP BỊ TÁC ĐỘNG
              </span>
            </div>

            <div className="px-4 py-3.5 space-y-2.5">
              {[
                { Icon:BookOpen,     value:`${className} · ${levelLabel}` },
                { Icon:Users,        value:`${studentCount} học viên đang học` },
                { Icon:CalendarDays, value:`Lịch ${days}` },
                { Icon:Clock,        value:time },
                { Icon:MapPin,       value:`${court} · ${coach}` },
              ].map((row, i, a) => (
                <div key={i} className="flex items-center gap-3"
                     style={{ paddingBottom: i < a.length-1 ? 8 : 0, borderBottom: i < a.length-1 ? '1px solid rgba(231,111,81,0.1)' : 'none' }}>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                       style={{ background:'rgba(231,111,81,0.1)' }}>
                    <row.Icon style={{ width:13, height:13, color:'#C85A3D' }} />
                  </div>
                  <span style={{ fontSize:13, fontWeight:700, color:'#374151' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Impact list ── */}
          <div className="rounded-2xl overflow-hidden mb-4"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)' }}>

            <div className="flex items-center gap-2 px-4 py-2.5"
                 style={{ background:'rgba(0,0,0,0.04)', borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
              <AlertTriangle style={{ width:13, height:13, color:'#6B7280' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.04em' }}>
                ĐIỀU GÌ SẼ XẢY RA
              </span>
            </div>

            <div className="px-4 py-3 space-y-0">
              {[
                {
                  Icon: Ban,
                  color: '#C85A3D',
                  bg:   'rgba(231,111,81,0.1)',
                  text: 'Lớp bị ẩn khỏi màn hình tạo buổi học mới',
                  severity: 'danger',
                },
                {
                  Icon: Users,
                  color: '#C97B38',
                  bg:   'rgba(244,162,97,0.12)',
                  text: `${studentCount} học viên hiện tại sẽ cần được chuyển sang lớp khác`,
                  severity: 'warn',
                },
                {
                  Icon: CalendarDays,
                  color: '#C97B38',
                  bg:   'rgba(244,162,97,0.12)',
                  text: `Lịch học ${days} sẽ bị tạm dừng hoàn toàn`,
                  severity: 'warn',
                },
                {
                  Icon: RotateCcw,
                  color: '#2A9D8F',
                  bg:   'rgba(42,157,143,0.1)',
                  text: 'Có thể kích hoạt lại lớp bất cứ lúc nào trong cài đặt',
                  severity: 'ok',
                },
              ].map((item, i, a) => (
                <div key={i} className="flex items-start gap-3 py-3"
                     style={{ borderBottom: i < a.length-1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                       style={{ background:item.bg }}>
                    <item.Icon style={{ width:13, height:13, color:item.color }} />
                  </div>
                  <p style={{ fontSize:13, color: item.severity === 'ok' ? '#2A7A6E' : '#374151', lineHeight:1.5, flex:1 }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Lý do ngưng (optional) ── */}
          <div className="mb-2">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <Pen style={{ width:13, height:13, color:'#6B7280' }} />
                <span style={{ fontSize:13, fontWeight:800, color:'#374151' }}>Lý do ngưng lớp</span>
              </div>
              <span className="px-2 py-0.5 rounded-full"
                    style={{ fontSize:10, fontWeight:700, color:'#9CA3AF', background:'rgba(0,0,0,0.06)' }}>
                Tùy chọn
              </span>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mb-3">
              {REASON_CHIPS.map(chip => {
                const active = reason === chip && !showCustom;
                return (
                  <button
                    key={chip}
                    onClick={() => handleChip(chip)}
                    className="px-3 py-2 rounded-xl active:scale-95 transition-all"
                    style={{
                      fontSize:   12,
                      fontWeight: active ? 800 : 600,
                      background: active ? 'rgba(231,111,81,0.12)' : 'rgba(0,0,0,0.05)',
                      border:     `1.5px solid ${active ? 'rgba(231,111,81,0.4)' : 'rgba(0,0,0,0.09)'}`,
                      color:      active ? '#C85A3D' : '#6B7280',
                    }}
                  >
                    {active && '✓ '}{chip}
                  </button>
                );
              })}
              {/* Khác button */}
              <button
                onClick={handleCustomToggle}
                className="px-3 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
                style={{
                  fontSize:   12,
                  fontWeight: showCustom ? 800 : 600,
                  background: showCustom ? 'rgba(231,111,81,0.12)' : 'rgba(0,0,0,0.05)',
                  border:     `1.5px solid ${showCustom ? 'rgba(231,111,81,0.4)' : 'rgba(0,0,0,0.09)'}`,
                  color:      showCustom ? '#C85A3D' : '#6B7280',
                }}
              >
                <Pen style={{ width:11, height:11 }} />
                Khác...
              </button>
            </div>

            {/* Custom textarea */}
            {showCustom && (
              <div className="rounded-2xl overflow-hidden"
                   style={{ border:'1.5px solid rgba(231,111,81,0.3)', background:'rgba(231,111,81,0.03)' }}>
                <textarea
                  ref={textareaRef}
                  value={customReason}
                  onChange={e => setCustomReason(e.target.value)}
                  placeholder="Nhập lý do cụ thể..."
                  rows={3}
                  className="w-full resize-none focus:outline-none px-4 py-3.5"
                  style={{ fontSize:14, color:'#1F2933', lineHeight:1.6, background:'transparent' }}
                />
                <div className="px-4 pb-3 flex justify-between items-center">
                  <span style={{ fontSize:11, color:'rgba(0,0,0,0.3)' }}>
                    {customReason.length}/200
                  </span>
                  {customReason && (
                    <button onClick={() => setCustomReason('')}
                            style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Selected reason preview (chip or custom) */}
            {!showCustom && reason && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2.5 rounded-xl"
                   style={{ background:'rgba(231,111,81,0.06)', border:'1px solid rgba(231,111,81,0.2)' }}>
                <CheckCircle2 style={{ width:13, height:13, color:'#C85A3D', flexShrink:0 }} />
                <span style={{ fontSize:12, color:'#C85A3D', fontWeight:700 }}>Lý do: {reason}</span>
                <button onClick={() => setReason('')} className="ml-auto">
                  <X style={{ width:13, height:13, color:'#C85A3D' }} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Footer buttons ── */}
        <div className="flex-shrink-0 px-5 pt-3 pb-8"
             style={{ borderTop:'1px solid rgba(0,0,0,0.08)', background:'white', boxShadow:'0 -4px 16px rgba(0,0,0,0.04)' }}>

          {/* Safety delay notice */}
          {!btnReady && (
            <div className="flex items-center justify-center gap-2 mb-3 py-2 rounded-xl"
                 style={{ background:'rgba(233,196,106,0.12)', border:'1px solid rgba(233,196,106,0.3)' }}>
              <Zap style={{ width:12, height:12, color:'#A07B10' }} />
              <span style={{ fontSize:12, fontWeight:700, color:'#A07B10' }}>
                Vui lòng đọc kỹ trước khi xác nhận ({countdown}s)
              </span>
            </div>
          )}

          <div className="flex gap-3">
            {/* Hủy */}
            <button
              onClick={onClose}
              className="flex items-center justify-center gap-2 rounded-2xl active:scale-95 transition-all"
              style={{
                width:90, flexShrink:0,
                paddingTop:15, paddingBottom:15,
                background:'rgba(0,0,0,0.05)',
                border:'1.5px solid rgba(0,0,0,0.12)',
                fontSize:14, fontWeight:700, color:'#6B7280',
              }}
            >
              <X style={{ width:15, height:15 }} /> Hủy
            </button>

            {/* Ngưng lớp */}
            <button
              onClick={() => btnReady && onConfirm(finalReason)}
              className="flex-1 flex items-center justify-between px-4 rounded-2xl transition-all"
              style={{
                paddingTop:15, paddingBottom:15,
                background: btnReady
                  ? 'linear-gradient(135deg,#9E1010 0%,#C62828 40%,#E76F51 100%)'
                  : 'rgba(0,0,0,0.08)',
                boxShadow:  btnReady ? '0 8px 24px rgba(198,40,40,0.4)' : 'none',
                cursor:     btnReady ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                transform:  btnReady ? 'scale(1)' : 'scale(0.98)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                     style={{ background: btnReady ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.08)' }}>
                  {btnReady
                    ? <PauseCircle style={{ width:16, height:16, color:'white' }} />
                    : <PauseCircle style={{ width:16, height:16, color:'#9CA3AF' }} />
                  }
                </div>
                <div className="text-left">
                  <p style={{ fontSize:14, fontWeight:900, color: btnReady ? 'white' : '#9CA3AF' }}>
                    Ngưng lớp
                  </p>
                  <p style={{ fontSize:10, color: btnReady ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.3)' }}>
                    {btnReady ? `${className} · ${studentCount} HV` : `Chờ ${countdown}s...`}
                  </p>
                </div>
              </div>
              {btnReady && (
                <div className="px-2.5 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.2)' }}>
                  <ChevronRight style={{ width:16, height:16, color:'white' }} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   STANDALONE SCREEN (Prototype preview)
══════════════════════════════════════════════════════════ */
export function SuspendClassDialogScreen({ onBack }: { onBack: () => void }) {
  const [open,      setOpen]      = useState(true);
  const [suspended, setSuspended] = useState(false);
  const [reason,    setReason]    = useState('');

  function handleConfirm(r: string) {
    setReason(r);
    setOpen(false);
    setSuspended(true);
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#F7F9FA' }}>

      {/* ── Simulated EditClassScreen danger zone bg ── */}
      <div className="flex-shrink-0 relative"
           style={{ background:'linear-gradient(150deg,#043F3E,#0E7C7B)', paddingTop:44, paddingBottom:20, paddingLeft:16, paddingRight:16 }}>
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack}
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background:'rgba(255,255,255,0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9l5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)' }}>Chỉnh sửa lớp học</p>
            <p style={{ fontSize:17, fontWeight:900, color:'white' }}>Beginner A</p>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['Cơ bản','Coach Nam','T2·T4·T6','18:00–19:30'].map(t => (
            <span key={t} className="px-3 py-1.5 rounded-full"
                  style={{ background:'rgba(255,255,255,0.13)', fontSize:11, color:'rgba(255,255,255,0.8)', fontWeight:600 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* ── Danger zone card (simulated EditClassScreen) ── */}
        {!suspended && (
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(231,111,81,0.25)', boxShadow:'0 2px 12px rgba(231,111,81,0.08)' }}>
            <div className="flex items-center gap-2 px-4 py-3"
                 style={{ background:'rgba(231,111,81,0.07)', borderBottom:'1px solid rgba(231,111,81,0.15)' }}>
              <Ban style={{ width:14, height:14, color:'#E76F51' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#C85A3D', letterSpacing:'0.04em' }}>
                VÙNG NGUY HIỂM
              </span>
            </div>
            <div className="p-4">
              <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.5, marginBottom:16 }}>
                Ngưng hoạt động của lớp Beginner A. Hành động này ảnh hưởng đến 8 học viên hiện tại.
              </p>
              <button
                onClick={() => setOpen(true)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-all"
                style={{ background:'rgba(231,111,81,0.08)', border:'1.5px solid rgba(231,111,81,0.3)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                       style={{ background:'rgba(231,111,81,0.15)' }}>
                    <PauseCircle style={{ width:16, height:16, color:'#E76F51' }} />
                  </div>
                  <div className="text-left">
                    <p style={{ fontSize:13, fontWeight:800, color:'#C85A3D' }}>Ngưng lớp học</p>
                    <p style={{ fontSize:11, color:'#9CA3AF' }}>Chuyển sang trạng thái tạm ngưng</p>
                  </div>
                </div>
                <ChevronRight style={{ width:15, height:15, color:'#E76F51' }} />
              </button>
            </div>
          </div>
        )}

        {/* ── Suspended success state ── */}
        {suspended && (
          <div className="bg-white rounded-2xl p-5 flex flex-col items-center gap-3"
               style={{ border:'1.5px solid rgba(231,111,81,0.25)', boxShadow:'0 4px 20px rgba(231,111,81,0.1)' }}>
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                 style={{ background:'rgba(231,111,81,0.1)', border:'1.5px solid rgba(231,111,81,0.25)' }}>
              <PauseCircle style={{ width:28, height:28, color:'#E76F51' }} />
            </div>
            <div className="text-center">
              <p style={{ fontSize:17, fontWeight:900, color:'#1F2933', marginBottom:6 }}>
                Lớp đã được ngưng hoạt động
              </p>
              <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.5 }}>
                Beginner A đã chuyển sang trạng thái tạm ngưng. 8 học viên đã được thông báo.
              </p>
            </div>
            {reason.trim() && (
              <div className="w-full px-4 py-3 rounded-xl"
                   style={{ background:'rgba(231,111,81,0.06)', border:'1px solid rgba(231,111,81,0.2)' }}>
                <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', marginBottom:4 }}>LÝ DO</p>
                <p style={{ fontSize:13, color:'#C85A3D', fontWeight:700 }}>{reason}</p>
              </div>
            )}
            <div className="flex gap-2 w-full">
              <div className="flex-1 flex flex-col items-center py-2.5 rounded-xl"
                   style={{ background:'rgba(42,157,143,0.08)', border:'1px solid rgba(42,157,143,0.2)' }}>
                <span style={{ fontSize:16, fontWeight:900, color:'#0E7C7B' }}>8</span>
                <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>HV tác động</span>
              </div>
              <div className="flex-1 flex flex-col items-center py-2.5 rounded-xl"
                   style={{ background:'rgba(233,196,106,0.08)', border:'1px solid rgba(233,196,106,0.3)' }}>
                <span style={{ fontSize:16, fontWeight:900, color:'#A07B10' }}>T2·T4·T6</span>
                <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>Lịch ngưng</span>
              </div>
            </div>
            <button onClick={onBack}
                    className="w-full py-3.5 rounded-2xl active:scale-[0.98] transition-all"
                    style={{ background:'linear-gradient(135deg,#0E7C7B,#2A9D8F)', fontSize:14, fontWeight:800, color:'white', boxShadow:'0 6px 20px rgba(14,124,123,0.3)' }}>
              Quay về danh sách lớp
            </button>
          </div>
        )}

        {/* ── Tap hint ── */}
        {!suspended && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
               style={{ background:'rgba(14,124,123,0.06)', border:'1px solid rgba(14,124,123,0.15)' }}>
            <Zap style={{ width:13, height:13, color:'#0E7C7B', flexShrink:0 }} />
            <p style={{ fontSize:12, color:'#0E7C7B', fontWeight:600 }}>
              Nhấn vào nút "Ngưng lớp học" bên trên để xem dialog xác nhận.
            </p>
          </div>
        )}
      </div>

      {/* Dialog */}
      <SuspendClassDialog
        visible={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}