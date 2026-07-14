import { useState, useEffect } from 'react';
import {
  CheckCircle2, AlertTriangle, X, ClipboardCheck,
  ArrowLeft, Users, Clock, BookOpen, XCircle,
  MinusCircle, RotateCcw, Sparkles, ChevronRight
} from 'lucide-react';

/* ─── Types ─────────────────────────────────────────────── */
export interface CompleteSessionStats {
  total:   number;
  checked: number;   // học viên đã có trạng thái (any status)
  present: number;
  late:    number;
  makeup:  number;
  absent:  number;
  leave:   number;
}

export interface CompleteSessionDialogProps {
  visible:    boolean;
  className?: string;
  date?:      string;
  timeStart?: string;
  timeEnd?:   string;
  stats?:     CompleteSessionStats;
  onClose:    () => void;   // Quay lại điểm danh
  onConfirm:  () => void;   // Hoàn tất buổi học
}

/* ─── Default / mock ────────────────────────────────────── */
const DEFAULT_STATS_COMPLETE: CompleteSessionStats = {
  total: 8, checked: 8,
  present: 5, late: 1, makeup: 0, absent: 1, leave: 1,
};
const DEFAULT_STATS_WARNING: CompleteSessionStats = {
  total: 8, checked: 6,
  present: 4, late: 1, makeup: 1, absent: 0, leave: 0,
};

/* ─── Theme configs ─────────────────────────────────────── */
const THEME_COMPLETE = {
  strip:      'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 60%,#2A9D8F55 100%)',
  iconBg:     'rgba(14,124,123,0.11)',
  iconBorder: 'rgba(14,124,123,0.25)',
  iconColor:  '#0E7C7B',
  iconShadow: 'rgba(14,124,123,0.22)',
  ringColor:  'rgba(14,124,123,0.22)',
  badgeBg:    'rgba(14,124,123,0.11)',
  badgeBorder:'rgba(14,124,123,0.28)',
  badgeColor: '#0E7C7B',
  badgeLabel: 'SẴN SÀNG HOÀN TẤT',
  dot:        '#2A9D8F',
  barBg:      'linear-gradient(90deg,#0E7C7B,#2A9D8F)',
  barLabel:   '#0E7C7B',
};
const THEME_WARNING = {
  strip:      'linear-gradient(90deg,#E9C46A 0%,#F4A261 60%,#F4A26155 100%)',
  iconBg:     'rgba(233,196,106,0.15)',
  iconBorder: 'rgba(233,196,106,0.4)',
  iconColor:  '#A07B10',
  iconShadow: 'rgba(233,196,106,0.25)',
  ringColor:  'rgba(233,196,106,0.25)',
  badgeBg:    'rgba(233,196,106,0.15)',
  badgeBorder:'rgba(233,196,106,0.4)',
  badgeColor: '#92620A',
  badgeLabel: 'CHƯA ĐỦ ĐIỂM DANH',
  dot:        '#E9C46A',
  barBg:      'linear-gradient(90deg,#E9C46A,#F4A261)',
  barLabel:   '#A07B10',
};

/* ══════════════════════════════════════════════════════════
   DIALOG
══════════════════════════════════════════════════════════ */
export function CompleteSessionDialog({
  visible,
  className  = 'Beginner A',
  date       = '29/04/2026',
  timeStart  = '18:00',
  timeEnd    = '19:30',
  stats      = DEFAULT_STATS_COMPLETE,
  onClose,
  onConfirm,
}: CompleteSessionDialogProps) {
  const [mounted,      setMounted]      = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);

  const isComplete = stats.checked >= stats.total;
  const theme      = isComplete ? THEME_COMPLETE : THEME_WARNING;
  const unchecked  = stats.total - stats.checked;
  const pct        = Math.round(stats.checked / stats.total * 100);

  /* mount animation */
  useEffect(() => {
    if (visible) {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setSheetVisible(true)));
    } else {
      setSheetVisible(false);
      const t = setTimeout(() => setMounted(false), 360);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  /* stat rows config */
  const STAT_ROWS = [
    { label:'Có mặt',    value: stats.present, color:'#1A7B6E', bg:'rgba(42,157,143,0.11)',  icon:<CheckCircle2  style={{width:14,height:14}}/> },
    { label:'Trễ',       value: stats.late,    color:'#A07B10', bg:'rgba(233,196,106,0.15)', icon:<AlertTriangle style={{width:14,height:14}}/> },
    { label:'Học bù',    value: stats.makeup,  color:'#5C3FA8', bg:'rgba(129,90,213,0.11)',  icon:<RotateCcw     style={{width:14,height:14}}/> },
    { label:'Vắng',      value: stats.absent,  color:'#C85A3D', bg:'rgba(231,111,81,0.11)',  icon:<XCircle       style={{width:14,height:14}}/> },
    { label:'Nghỉ phép', value: stats.leave,   color:'#6B7280', bg:'rgba(107,114,128,0.10)', icon:<MinusCircle   style={{width:14,height:14}}/> },
  ];

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background:      'rgba(10,20,35,0.55)',
          backdropFilter:  'blur(6px)',
          opacity:         sheetVisible ? 1 : 0,
          transition:      'opacity 0.32s ease',
        }}
        onClick={onClose}
      />

      {/* ── Bottom Sheet ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-w-[390px] mx-auto flex flex-col"
        style={{
          background:   'white',
          borderRadius: '28px 28px 0 0',
          boxShadow:    '0 -10px 60px rgba(0,0,0,0.20)',
          transform:    sheetVisible ? 'translateY(0)' : 'translateY(105%)',
          transition:   'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
          maxHeight:    '91vh',
        }}
      >
        {/* accent strip — color changes with theme */}
        <div
          style={{
            height:       4,
            background:   theme.strip,
            borderRadius: '28px 28px 0 0',
            transition:   'background 0.4s ease',
          }}
        />

        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-0.5">
          <div className="w-10 h-1 rounded-full" style={{ background:'rgba(0,0,0,0.14)' }} />
        </div>

        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 z-10"
          style={{ background:'rgba(0,0,0,0.06)' }}
        >
          <X style={{ width:18, height:18, color:'#6B7280' }} />
        </button>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">

          {/* ── Hero icon ── */}
          <div className="flex flex-col items-center pt-3 pb-5">
            <div
              className="relative flex items-center justify-center mb-4"
              style={{ width:96, height:96 }}
            >
              {/* outer pulsing ring */}
              {[96, 72].map((size, n) => (
                <div
                  key={n}
                  className="absolute rounded-full"
                  style={{
                    width:size, height:size,
                    border:     `1.5px solid ${theme.ringColor}`,
                    background: n === 1 ? theme.iconBg : 'transparent',
                    animation:  sheetVisible ? `completePulse 2.2s ease-out ${n * 0.4}s infinite` : 'none',
                  }}
                />
              ))}

              {/* icon circle */}
              <div
                className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background:  theme.iconBg,
                  border:      `1.5px solid ${theme.iconBorder}`,
                  boxShadow:   `0 6px 22px ${theme.iconShadow}`,
                  transform:   sheetVisible ? 'scale(1)' : 'scale(0.4)',
                  opacity:     sheetVisible ? 1 : 0,
                  transition:  'transform 0.48s cubic-bezier(0.34,1.56,0.64,1) 0.08s, opacity 0.3s ease 0.08s',
                }}
              >
                {isComplete
                  ? <CheckCircle2  style={{ width:30, height:30, color: theme.iconColor }} />
                  : <AlertTriangle style={{ width:30, height:30, color: theme.iconColor }} />
                }
              </div>

              {/* sparkles (complete only) */}
              {isComplete && sheetVisible && (
                <>
                  <Sparkles
                    style={{ position:'absolute', top:4,  right:4,  width:14, height:14, color:'#0E7C7B', opacity:0.7,
                             animation:'sparkleIn 0.6s ease 0.5s both' }}
                  />
                  <Sparkles
                    style={{ position:'absolute', bottom:6, left:6, width:10, height:10, color:'#2A9D8F', opacity:0.55,
                             animation:'sparkleIn 0.6s ease 0.7s both' }}
                  />
                </>
              )}
            </div>

            {/* status badge */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-3"
              style={{
                background:  theme.badgeBg,
                border:      `1.5px solid ${theme.badgeBorder}`,
                opacity:     sheetVisible ? 1 : 0,
                transform:   sheetVisible ? 'translateY(0)' : 'translateY(8px)',
                transition:  'all 0.38s ease 0.22s',
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: theme.dot }} />
              <span style={{ fontSize:10, fontWeight:900, color:theme.badgeColor, letterSpacing:'0.05em' }}>
                {theme.badgeLabel}
              </span>
            </div>

            {/* title */}
            <h2
              style={{
                fontSize:22, fontWeight:900, color:'#1F2933', textAlign:'center', marginBottom:8,
                opacity:   sheetVisible ? 1 : 0,
                transform: sheetVisible ? 'translateY(0)' : 'translateY(10px)',
                transition:'all 0.38s ease 0.3s',
              }}
            >
              Hoàn tất buổi học?
            </h2>

            {/* message */}
            <p
              style={{
                fontSize:14, color:'#4B5563', textAlign:'center', lineHeight:1.65, maxWidth:300,
                opacity:   sheetVisible ? 1 : 0,
                transform: sheetVisible ? 'translateY(0)' : 'translateY(8px)',
                transition:'all 0.38s ease 0.36s',
              }}
            >
              Bạn muốn đánh dấu buổi học{' '}
              <strong style={{ color:'#1F2933', fontWeight:800 }}>{className}</strong>{' '}
              là đã hoàn tất?
            </p>
          </div>

          {/* ── Stats card ── */}
          <div
            className="rounded-2xl overflow-hidden mb-4"
            style={{
              border:     '1.5px solid rgba(0,0,0,0.09)',
              boxShadow:  '0 2px 12px rgba(0,0,0,0.06)',
              opacity:    sheetVisible ? 1 : 0,
              transform:  sheetVisible ? 'translateY(0)' : 'translateY(16px)',
              transition: 'all 0.42s ease 0.42s',
            }}
          >
            {/* card header — attendance total */}
            <div
              className="px-4 pt-3.5 pb-3"
              style={{
                background:   isComplete ? 'rgba(14,124,123,0.06)' : 'rgba(233,196,106,0.09)',
                borderBottom: '1px solid rgba(0,0,0,0.07)',
              }}
            >
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <ClipboardCheck style={{ width:15, height:15, color: theme.barLabel }} />
                  <span style={{ fontSize:13, fontWeight:800, color:'#1F2933' }}>
                    Tổng hợp điểm danh
                  </span>
                </div>
                <div className="flex items-baseline gap-0.5">
                  <span style={{ fontSize:22, fontWeight:900, color: theme.barLabel, lineHeight:1 }}>
                    {stats.checked}
                  </span>
                  <span style={{ fontSize:13, color:'#9CA3AF', fontWeight:600 }}>
                    /{stats.total}
                  </span>
                </div>
              </div>

              {/* progress bar */}
              <div className="h-2 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.08)' }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width:      `${pct}%`,
                    background: theme.barBg,
                    transition: 'width 0.7s ease 0.6s',
                  }}
                />
              </div>
              <div className="flex items-center justify-between mt-1.5">
                <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>
                  {isComplete ? '✓ Tất cả học viên đã được ghi nhận' : `Còn ${unchecked} học viên chưa điểm danh`}
                </span>
                <span style={{ fontSize:11, fontWeight:800, color: theme.barLabel }}>{pct}%</span>
              </div>
            </div>

            {/* stat rows */}
            {STAT_ROWS.map((row, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: idx < STAT_ROWS.length - 1 ? '1px solid rgba(0,0,0,0.055)' : 'none' }}
              >
                {/* icon */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: row.value > 0 ? row.bg : 'rgba(0,0,0,0.04)',
                    color:      row.value > 0 ? row.color : '#D1D5DB',
                  }}
                >
                  {row.icon}
                </div>

                {/* label */}
                <span
                  className="flex-1"
                  style={{ fontSize:13, color: row.value > 0 ? '#374151' : '#9CA3AF' }}
                >
                  {row.label}
                </span>

                {/* mini bar */}
                {stats.total > 0 && (
                  <div className="w-20 h-1.5 rounded-full overflow-hidden mr-2"
                       style={{ background:'rgba(0,0,0,0.06)' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        width:      `${(row.value / stats.total) * 100}%`,
                        background: row.value > 0 ? row.color : 'transparent',
                        transition: 'width 0.6s ease 0.7s',
                      }}
                    />
                  </div>
                )}

                {/* value */}
                <span
                  className="w-6 text-right"
                  style={{
                    fontSize:16, fontWeight: row.value > 0 ? 900 : 500,
                    color:    row.value > 0 ? row.color : '#D1D5DB',
                    lineHeight:1,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}
          </div>

          {/* ── Warning box (incomplete only) ── */}
          {!isComplete && (
            <div
              className="rounded-2xl p-4 mb-5"
              style={{
                background:  'rgba(233,196,106,0.12)',
                border:      '1.5px solid rgba(233,196,106,0.4)',
                opacity:     sheetVisible ? 1 : 0,
                transform:   sheetVisible ? 'translateY(0)' : 'translateY(12px)',
                transition:  'all 0.4s ease 0.52s',
              }}
            >
              <div className="flex gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background:'rgba(233,196,106,0.28)' }}
                >
                  <AlertTriangle style={{ width:18, height:18, color:'#A07B10' }} />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize:12, fontWeight:900, color:'#92620A', letterSpacing:'0.03em', marginBottom:5 }}>
                    LƯU Ý — CHƯA ĐỦ ĐIỂM DANH
                  </p>
                  <p style={{ fontSize:13, color:'#374151', lineHeight:1.65 }}>
                    Còn{' '}
                    <strong style={{ color:'#92620A', fontWeight:800 }}>
                      {unchecked} học viên
                    </strong>{' '}
                    chưa được điểm danh. Bạn nên hoàn tất điểm danh trước khi đóng buổi học.
                  </p>
                </div>
              </div>

              {/* recommended action hint */}
              <div
                className="flex items-center gap-2 mt-3 pt-3"
                style={{ borderTop:'1px solid rgba(233,196,106,0.3)' }}
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background:'#E9C46A' }} />
                <span style={{ fontSize:12, color:'#6B7280', lineHeight:1.5 }}>
                  Nhấn <strong style={{ color:'#0E7C7B' }}>"Quay lại điểm danh"</strong> để cập nhật trước khi hoàn tất.
                </span>
              </div>
            </div>
          )}

          {/* ── Complete state — session info chips ── */}
          {isComplete && (
            <div
              className="flex items-center gap-2 flex-wrap justify-center mb-5"
              style={{
                opacity:    sheetVisible ? 1 : 0,
                transform:  sheetVisible ? 'translateY(0)' : 'translateY(8px)',
                transition: 'all 0.38s ease 0.52s',
              }}
            >
              {[
                { icon:<BookOpen style={{width:11,height:11}}/>,  text: className   },
                { icon:<Clock    style={{width:11,height:11}}/>,  text:`${timeStart}–${timeEnd}` },
                { icon:<Users    style={{width:11,height:11}}/>,  text:`${stats.total} học viên` },
              ].map((chip, i) => (
                <span
                  key={i}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: 'rgba(14,124,123,0.08)',
                    border:     '1px solid rgba(14,124,123,0.2)',
                    fontSize:12, fontWeight:700, color:'#0E7C7B',
                  }}
                >
                  <span>{chip.icon}</span>{chip.text}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════
            BUTTONS — layout inverts by state
        ════════════════════════════════════════ */}
        <div
          className="px-5 pb-8 pt-4 flex flex-col gap-2.5"
          style={{
            borderTop:  '1px solid rgba(0,0,0,0.07)',
            background: 'white',
            opacity:    sheetVisible ? 1 : 0,
            transform:  sheetVisible ? 'translateY(0)' : 'translateY(12px)',
            transition: 'all 0.4s ease 0.58s',
          }}
        >
          {isComplete ? (
            /* ─── COMPLETE STATE ───────────────────────
               Primary:   Hoàn tất buổi học (teal)
               Secondary: Quay lại điểm danh (gray)
            ─────────────────────────────────────────── */
            <>
              {/* Primary */}
              <button
                onClick={onConfirm}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
                  boxShadow:  '0 8px 26px rgba(14,124,123,0.40)',
                  color:      'white',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background:'rgba(255,255,255,0.2)' }}
                  >
                    <CheckCircle2 style={{ width:18, height:18, color:'white' }} />
                  </div>
                  <div className="text-left">
                    <p style={{ fontSize:15, fontWeight:900, color:'white' }}>Hoàn tất buổi học</p>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>Đóng buổi học · {stats.total}/{stats.total} đã điểm danh</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                     style={{ background:'rgba(255,255,255,0.18)' }}>
                  <ChevronRight style={{ width:15, height:15, color:'white' }} />
                </div>
              </button>

              {/* Secondary */}
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.98] transition-all"
                style={{
                  background: 'rgba(0,0,0,0.04)',
                  border:     '1.5px solid rgba(0,0,0,0.1)',
                  color:      '#6B7280',
                }}
              >
                <ArrowLeft style={{ width:15, height:15 }} />
                <span style={{ fontSize:14, fontWeight:700 }}>Quay lại điểm danh</span>
              </button>
            </>
          ) : (
            /* ─── WARNING STATE ────────────────────────
               Primary:   Quay lại điểm danh (teal)
               Secondary: Hoàn tất dù vậy (outlined subtle)
            ─────────────────────────────────────────── */
            <>
              {/* Primary — recommended */}
              <button
                onClick={onClose}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
                  boxShadow:  '0 8px 26px rgba(14,124,123,0.38)',
                  color:      'white',
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background:'rgba(255,255,255,0.2)' }}
                  >
                    <ClipboardCheck style={{ width:18, height:18, color:'white' }} />
                  </div>
                  <div className="text-left">
                    <p style={{ fontSize:15, fontWeight:900, color:'white' }}>Quay lại điểm danh</p>
                    <p style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>
                      Cập nhật {unchecked} học viên còn lại
                    </p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                     style={{ background:'rgba(255,255,255,0.18)' }}>
                  <ChevronRight style={{ width:13, height:13, color:'white' }} />
                </div>
              </button>

              {/* Separator label */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px" style={{ background:'rgba(0,0,0,0.08)' }} />
                <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>hoặc</span>
                <div className="flex-1 h-px" style={{ background:'rgba(0,0,0,0.08)' }} />
              </div>

              {/* Secondary — force complete */}
              <button
                onClick={onConfirm}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-[0.98] transition-all"
                style={{
                  background: 'rgba(233,196,106,0.1)',
                  border:     '1.5px solid rgba(233,196,106,0.4)',
                  color:      '#92620A',
                }}
              >
                <CheckCircle2 style={{ width:15, height:15 }} />
                <span style={{ fontSize:14, fontWeight:700 }}>Hoàn tất buổi học (bỏ qua cảnh báo)</span>
              </button>
            </>
          )}

          {/* micro footer note */}
          <p style={{ fontSize:11, color:'#9CA3AF', textAlign:'center', lineHeight:1.5 }}>
            {isComplete
              ? 'Buổi học sẽ được lưu và không thể chỉnh sửa sau khi hoàn tất.'
              : `${unchecked} học viên chưa được ghi nhận sẽ được bỏ qua nếu hoàn tất ngay.`
            }
          </p>
        </div>
      </div>

      <style>{`
        @keyframes completePulse {
          0%   { transform:scale(1);   opacity:0.75; }
          100% { transform:scale(1.6); opacity:0;    }
        }
        @keyframes sparkleIn {
          from { transform:scale(0) rotate(-30deg); opacity:0; }
          to   { transform:scale(1) rotate(0deg);   opacity:1; }
        }
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   STANDALONE PREVIEW SCREEN  (prototype panel)
══════════════════════════════════════════════════════════ */
export function CompleteSessionDialogScreen({ onBack }: { onBack: () => void }) {
  const [open,      setOpen]      = useState(true);
  const [stateMode, setStateMode] = useState<'complete' | 'warning'>('complete');
  const [done,      setDone]      = useState(false);

  const statsMap = {
    complete: DEFAULT_STATS_COMPLETE,
    warning:  DEFAULT_STATS_WARNING,
  };

  function handleConfirm() { setOpen(false); setDone(true); }

  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* simulated header */}
      <div
        className="flex-shrink-0"
        style={{ background:'linear-gradient(150deg,#043F3E,#0E7C7B)', paddingTop:44, paddingBottom:16, paddingLeft:16, paddingRight:16 }}
      >
        <div className="flex items-center gap-3 mb-3">
          <button onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:'rgba(255,255,255,0.15)' }}>
            <ArrowLeft style={{ width:18, height:18, color:'white' }} />
          </button>
          <div>
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.5)' }}>Thứ 3 · 29/04/2026</p>
            <p style={{ fontSize:17, fontWeight:900, color:'white' }}>Chi tiết buổi học</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['Beginner A','18:00–19:30','Sân 1'].map(t => (
            <span key={t} className="px-3 py-1.5 rounded-full"
                  style={{ background:'rgba(255,255,255,0.13)', fontSize:11, color:'rgba(255,255,255,0.85)', fontWeight:600 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* state toggle */}
        <div className="bg-white rounded-2xl p-3 flex gap-2"
             style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 8px rgba(0,0,0,0.05)' }}>
          <p style={{ fontSize:12, fontWeight:700, color:'#9CA3AF', width:80, paddingTop:6 }}>Trạng thái:</p>
          <div className="flex-1 flex gap-2">
            {(['complete','warning'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setStateMode(m); setDone(false); setOpen(true); }}
                className="flex-1 py-2.5 rounded-xl active:scale-[0.97] transition-all"
                style={{
                  fontSize:12, fontWeight:800,
                  background: stateMode === m ? (m === 'complete' ? 'rgba(14,124,123,0.12)' : 'rgba(233,196,106,0.2)') : 'rgba(0,0,0,0.04)',
                  color:      stateMode === m ? (m === 'complete' ? '#0E7C7B' : '#92620A') : '#9CA3AF',
                  border:     `1.5px solid ${stateMode === m ? (m === 'complete' ? 'rgba(14,124,123,0.3)' : 'rgba(233,196,106,0.4)') : 'transparent'}`,
                }}
              >
                {m === 'complete' ? '✓ Đủ điểm danh' : '⚠ Còn thiếu'}
              </button>
            ))}
          </div>
        </div>

        {/* success result */}
        {done && (
          <div className="rounded-2xl p-5 flex flex-col items-center gap-3 bg-white"
               style={{ border:'1.5px solid rgba(14,124,123,0.25)', boxShadow:'0 4px 20px rgba(14,124,123,0.12)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                 style={{ background:'rgba(14,124,123,0.1)' }}>
              <CheckCircle2 style={{ width:26, height:26, color:'#0E7C7B' }} />
            </div>
            <p style={{ fontSize:17, fontWeight:900, color:'#1F2933' }}>Buổi học đã hoàn tất!</p>
            <p style={{ fontSize:13, color:'#6B7280', textAlign:'center' }}>
              Beginner A · 29/04/2026 đã được lưu thành công.
            </p>
            <button onClick={() => { setOpen(true); setDone(false); }}
              className="w-full py-3 rounded-xl active:scale-[0.98] transition-all"
              style={{ fontSize:14, fontWeight:700, color:'#0E7C7B', background:'rgba(14,124,123,0.08)', border:'1.5px solid rgba(14,124,123,0.25)' }}>
              Mở lại dialog
            </button>
          </div>
        )}

        {!done && (
          <>
            {/* stat preview */}
            <div className="bg-white rounded-2xl p-4"
                 style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize:12, fontWeight:700, color:'#9CA3AF', letterSpacing:'0.04em', marginBottom:10 }}>THỐNG KÊ BUỔI HỌC</p>
              {[
                ['Đã điểm danh', `${statsMap[stateMode].checked}/${statsMap[stateMode].total}`, stateMode === 'complete' ? '#0E7C7B' : '#A07B10'],
                ['Có mặt', statsMap[stateMode].present, '#1A7B6E'],
                ['Trễ',    statsMap[stateMode].late,    '#A07B10'],
                ['Vắng',   statsMap[stateMode].absent,  '#C85A3D'],
              ].map(([l,v,c],i,a) => (
                <div key={String(l)} className="flex justify-between py-2.5"
                     style={{ borderBottom: i < a.length-1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <span style={{ fontSize:13, color:'#6B7280' }}>{l}</span>
                  <span style={{ fontSize:13, fontWeight:800, color:String(c) }}>{v}</span>
                </div>
              ))}
            </div>

            {/* trigger */}
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.98] transition-all"
              style={{
                background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
                boxShadow:  '0 8px 24px rgba(14,124,123,0.35)',
                color:      'white',
              }}
            >
              <CheckCircle2 style={{ width:17, height:17 }} />
              <span style={{ fontSize:15, fontWeight:800 }}>Hoàn tất buổi học</span>
            </button>
          </>
        )}
      </div>

      {/* Dialog */}
      <CompleteSessionDialog
        visible={open}
        className="Beginner A"
        date="29/04/2026"
        timeStart="18:00"
        timeEnd="19:30"
        stats={statsMap[stateMode]}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
