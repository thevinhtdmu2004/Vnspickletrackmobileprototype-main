import { useState, useEffect, useRef } from 'react';
import { Ban, AlertTriangle, X, CalendarDays, BookOpen, ChevronRight } from 'lucide-react';

/* ─── Props ─────────────────────────────────────────────── */
export interface CancelSessionDialogProps {
  visible:      boolean;
  className?:   string;   // "Beginner A"
  date?:        string;   // "29/04/2026"
  timeStart?:   string;   // "18:00"
  timeEnd?:     string;   // "19:30"
  onClose:      () => void;
  onConfirm:    (reason: string) => void;
}

/* ─── Standalone preview (default data) ─────────────────── */
const DEFAULTS = {
  className: 'Beginner A',
  date:      '29/04/2026',
  timeStart: '18:00',
  timeEnd:   '19:30',
};

/* ══════════════════════════════════════════════════════════
   DIALOG COMPONENT
══════════════════════════════════════════════════════════ */
export function CancelSessionDialog({
  visible,
  className  = DEFAULTS.className,
  date       = DEFAULTS.date,
  timeStart  = DEFAULTS.timeStart,
  timeEnd    = DEFAULTS.timeEnd,
  onClose,
  onConfirm,
}: CancelSessionDialogProps) {
  const [reason,       setReason]       = useState('');
  const [mounted,      setMounted]      = useState(false);
  const [sheetVisible, setSheetVisible] = useState(false);
  const [btnReady,     setBtnReady]     = useState(false);   // delay confirm btn
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* mount / unmount with animation */
  useEffect(() => {
    if (visible) {
      setMounted(true);
      setBtnReady(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSheetVisible(true);
          setTimeout(() => setBtnReady(true), 900);   // confirm btn appears after 0.9s
        });
      });
    } else {
      setSheetVisible(false);
      const t = setTimeout(() => { setMounted(false); setReason(''); }, 340);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-40"
        style={{
          background: 'rgba(15,23,42,0.55)',
          backdropFilter: 'blur(5px)',
          opacity: sheetVisible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onClick={onClose}
      />

      {/* ── Bottom Sheet ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 max-w-[390px] mx-auto flex flex-col"
        style={{
          background: 'white',
          borderRadius: '28px 28px 0 0',
          boxShadow: '0 -8px 60px rgba(0,0,0,0.22)',
          transform: sheetVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.38s cubic-bezier(0.32,0.72,0,1)',
          maxHeight: '92vh',
        }}
      >
        {/* ── Danger accent top strip ── */}
        <div style={{ height: 4, background: 'linear-gradient(90deg,#E76F51 0%,#C85A3D 60%,#E76F5155 100%)', borderRadius: '28px 28px 0 0' }} />

        {/* ── Drag handle ── */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.15)' }} />
        </div>

        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-5 right-4 w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-all z-10"
          style={{ background: 'rgba(0,0,0,0.06)' }}
        >
          <X style={{ width: 18, height: 18, color: '#6B7280' }} />
        </button>

        {/* ── Scrollable content ── */}
        <div className="flex-1 overflow-y-auto px-5 pb-2">

          {/* ── Icon hero ── */}
          <div className="flex flex-col items-center pt-3 pb-5">
            {/* pulsing rings */}
            <div className="relative flex items-center justify-center mb-4" style={{ width: 96, height: 96 }}>
              <div
                className="absolute rounded-full"
                style={{
                  width: 96, height: 96,
                  background: 'rgba(231,111,81,0.08)',
                  border: '1.5px solid rgba(231,111,81,0.2)',
                  animation: sheetVisible ? 'cancelPulse 2s ease-out 0.3s infinite' : 'none',
                }}
              />
              <div
                className="absolute rounded-full"
                style={{
                  width: 72, height: 72,
                  background: 'rgba(231,111,81,0.12)',
                  border: '1.5px solid rgba(231,111,81,0.25)',
                  animation: sheetVisible ? 'cancelPulse 2s ease-out 0.6s infinite' : 'none',
                }}
              />
              {/* icon circle */}
              <div
                className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg,rgba(231,111,81,0.18),rgba(200,90,61,0.12))',
                  border: '1.5px solid rgba(231,111,81,0.3)',
                  boxShadow: '0 4px 20px rgba(231,111,81,0.2)',
                  transform: sheetVisible ? 'scale(1)' : 'scale(0.5)',
                  opacity:   sheetVisible ? 1 : 0,
                  transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.1s, opacity 0.3s ease 0.1s',
                }}
              >
                <Ban style={{ width: 30, height: 30, color: '#E76F51' }} />
              </div>
            </div>

            {/* title */}
            <h2
              style={{
                fontSize: 22, fontWeight: 900, color: '#1F2933', textAlign: 'center',
                marginBottom: 8,
                opacity:   sheetVisible ? 1 : 0,
                transform: sheetVisible ? 'translateY(0)' : 'translateY(12px)',
                transition: 'all 0.4s ease 0.2s',
              }}
            >
              Hủy buổi học?
            </h2>

            {/* message */}
            <p
              style={{
                fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 1.65,
                maxWidth: 300,
                opacity:   sheetVisible ? 1 : 0,
                transform: sheetVisible ? 'translateY(0)' : 'translateY(10px)',
                transition: 'all 0.4s ease 0.28s',
              }}
            >
              Bạn có chắc muốn hủy buổi học{' '}
              <strong style={{ color: '#1F2933', fontWeight: 800 }}>{className}</strong>{' '}
              hôm nay không?
            </p>
          </div>

          {/* ── Session info chip row ── */}
          <div
            className="flex items-center gap-2 justify-center mb-4"
            style={{
              opacity:   sheetVisible ? 1 : 0,
              transform: sheetVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'all 0.4s ease 0.35s',
            }}
          >
            {[
              { icon: <BookOpen style={{ width: 11, height: 11 }} />,     text: className },
              { icon: <CalendarDays style={{ width: 11, height: 11 }} />, text: date      },
            ].map((chip, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(231,111,81,0.09)', border: '1px solid rgba(231,111,81,0.22)', fontSize: 12, fontWeight: 700, color: '#C85A3D' }}
              >
                <span style={{ color: '#E76F51' }}>{chip.icon}</span>
                {chip.text}
              </span>
            ))}
          </div>

          {/* ── Warning box ── */}
          <div
            className="rounded-2xl p-4 mb-5 flex gap-3"
            style={{
              background: 'rgba(233,196,106,0.13)',
              border: '1.5px solid rgba(233,196,106,0.45)',
              opacity:   sheetVisible ? 1 : 0,
              transform: sheetVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s ease 0.4s',
            }}
          >
            {/* icon */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(233,196,106,0.3)' }}
            >
              <AlertTriangle style={{ width: 16, height: 16, color: '#A07B10' }} />
            </div>
            {/* text */}
            <div className="flex-1">
              <p style={{ fontSize: 12, fontWeight: 800, color: '#92620A', marginBottom: 4, letterSpacing: '0.02em' }}>
                LƯU Ý TRƯỚC KHI HỦY
              </p>
              <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>
                Sau khi hủy, buổi học này sẽ{' '}
                <strong style={{ color: '#92620A' }}>không thể điểm danh</strong>.
                Dữ liệu điểm danh đã lưu trước đó sẽ cần được kiểm tra lại.
              </p>
            </div>
          </div>

          {/* ── Reason textarea ── */}
          <div
            className="mb-5"
            style={{
              opacity:   sheetVisible ? 1 : 0,
              transform: sheetVisible ? 'translateY(0)' : 'translateY(10px)',
              transition: 'all 0.4s ease 0.48s',
            }}
          >
            {/* label */}
            <div className="flex items-center justify-between mb-2">
              <label style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
                Lý do hủy
              </label>
              <span
                className="px-2 py-0.5 rounded-full"
                style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', background: 'rgba(0,0,0,0.05)', letterSpacing: '0.03em' }}
              >
                TÙY CHỌN
              </span>
            </div>

            {/* field */}
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{ border: `1.5px solid ${reason ? 'rgba(231,111,81,0.35)' : 'rgba(0,0,0,0.1)'}`, transition: 'border-color 0.2s' }}
            >
              <textarea
                ref={textareaRef}
                value={reason}
                onChange={e => setReason(e.target.value)}
                rows={3}
                maxLength={200}
                placeholder="Ví dụ: Trời mưa, sân bận, lớp nghỉ..."
                className="w-full resize-none focus:outline-none px-4 py-3"
                style={{
                  fontSize: 14, color: '#1F2933', background: '#FAFAFA',
                  lineHeight: 1.6,
                }}
              />
              {/* char count */}
              {reason.length > 0 && (
                <div
                  className="flex justify-end px-3 pb-2"
                  style={{ background: '#FAFAFA' }}
                >
                  <span style={{ fontSize: 11, color: reason.length > 180 ? '#E76F51' : '#9CA3AF', fontWeight: 600 }}>
                    {reason.length}/200
                  </span>
                </div>
              )}
            </div>

            {/* reason chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {['Trời mưa', 'Sân bận', 'Lớp nghỉ lễ', 'Coach bệnh', 'Lý do khác'].map(tag => (
                <button
                  key={tag}
                  onClick={() => setReason(prev => prev ? `${prev}, ${tag}` : tag)}
                  className="px-3 py-1.5 rounded-xl active:scale-95 transition-all"
                  style={{
                    fontSize: 12, fontWeight: 600,
                    background: reason.includes(tag) ? 'rgba(231,111,81,0.12)' : 'rgba(0,0,0,0.05)',
                    color:      reason.includes(tag) ? '#E76F51'               : '#6B7280',
                    border:     `1px solid ${reason.includes(tag) ? 'rgba(231,111,81,0.3)' : 'rgba(0,0,0,0.08)'}`,
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Action buttons (sticky bottom) ── */}
        <div
          className="px-5 pb-8 pt-4 flex flex-col gap-3"
          style={{
            borderTop: '1px solid rgba(0,0,0,0.07)',
            background: 'white',
            opacity:   sheetVisible ? 1 : 0,
            transform: sheetVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.4s ease 0.55s',
          }}
        >
          {/* Safe — Không hủy (primary CTA — top, large) */}
          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.98] transition-all"
            style={{
              fontSize: 15, fontWeight: 800, color: '#0E7C7B',
              background: 'rgba(14,124,123,0.08)',
              border: '1.5px solid rgba(14,124,123,0.3)',
            }}
          >
            <ChevronRight style={{ width: 16, height: 16, transform: 'rotate(180deg)' }} />
            Không hủy — Quay lại
          </button>

          {/* Danger — Xác nhận hủy */}
          <div className="relative">
            {/* unlock hint (first 0.9s) */}
            {!btnReady && (
              <div
                className="absolute inset-0 rounded-2xl z-10 flex items-center justify-center gap-2"
                style={{
                  background: 'rgba(231,111,81,0.12)',
                  border: '1.5px dashed rgba(231,111,81,0.35)',
                  backdropFilter: 'blur(1px)',
                }}
              >
                <div
                  className="h-1 rounded-full overflow-hidden"
                  style={{ width: 120, background: 'rgba(231,111,81,0.2)' }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      background: '#E76F51',
                      animation: 'btnUnlock 0.9s linear forwards',
                    }}
                  />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#E76F51' }}>Đang tải...</span>
              </div>
            )}

            <button
              onClick={() => btnReady && onConfirm(reason)}
              disabled={!btnReady}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl transition-all"
              style={{
                fontSize: 15, fontWeight: 800, color: 'white',
                background: btnReady
                  ? 'linear-gradient(135deg,#E76F51 0%,#C85A3D 100%)'
                  : 'rgba(231,111,81,0.08)',
                boxShadow: btnReady ? '0 8px 24px rgba(231,111,81,0.40)' : 'none',
                transform:  btnReady ? 'scale(1)' : 'scale(0.98)',
                transition: 'all 0.35s ease',
                opacity: btnReady ? 1 : 0,
              }}
            >
              <Ban style={{ width: 17, height: 17 }} />
              Xác nhận hủy buổi học
            </button>
          </div>

          {/* micro hint */}
          <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
            Hành động này{' '}
            <strong style={{ color: '#E76F51' }}>không thể hoàn tác</strong>
            {' '}sau khi xác nhận.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes cancelPulse {
          0%   { transform: scale(1);   opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0;   }
        }
        @keyframes btnUnlock {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   STANDALONE SCREEN (Prototype preview)
══════════════════════════════════════════════════════════ */
export function CancelSessionDialogScreen({ onBack }: { onBack: () => void }) {
  const [open,      setOpen]      = useState(true);
  const [cancelled, setCancelled] = useState(false);
  const [reason,    setReason]    = useState('');

  function handleConfirm(r: string) {
    setReason(r);
    setOpen(false);
    setCancelled(true);
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#F7F9FA' }}>

      {/* ── Simulated bg screen ── */}
      <div
        className="flex-shrink-0 relative"
        style={{ background: 'linear-gradient(150deg,#043F3E,#0E7C7B)', paddingTop: 44, paddingBottom: 20, paddingLeft: 16, paddingRight: 16 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M11 14L6 9l5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>Thứ 3 · 29/04/2026</p>
            <p style={{ fontSize: 17, fontWeight: 900, color: 'white' }}>Chi tiết buổi học</p>
          </div>
        </div>
        <div className="flex gap-2">
          {['18:00–19:30','Sân 1','Coach Nam'].map(t => (
            <span key={t} className="px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.13)', fontSize: 11, color: 'rgba(255,255,255,0.8)', fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* success/cancelled state */}
        {cancelled && (
          <div className="rounded-2xl p-5 flex flex-col items-center gap-3"
               style={{ background: 'white', border: '1.5px solid rgba(231,111,81,0.25)', boxShadow: '0 4px 20px rgba(231,111,81,0.12)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
                 style={{ background: 'rgba(231,111,81,0.1)' }}>
              <Ban style={{ width: 26, height: 26, color: '#E76F51' }} />
            </div>
            <p style={{ fontSize: 17, fontWeight: 900, color: '#1F2933' }}>Buổi học đã bị hủy</p>
            <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center' }}>
              Beginner A · 29/04/2026 đã được hủy thành công.
            </p>
            {reason.trim() && (
              <div className="w-full rounded-xl px-4 py-3"
                   style={{ background: 'rgba(231,111,81,0.07)', border: '1px solid rgba(231,111,81,0.2)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#E76F51', marginBottom: 2 }}>LÝ DO HỦY</p>
                <p style={{ fontSize: 13, color: '#374151' }}>{reason}</p>
              </div>
            )}
            <button onClick={() => { setOpen(true); setCancelled(false); }}
              className="w-full py-3 rounded-xl active:scale-[0.98] transition-all"
              style={{ fontSize: 14, fontWeight: 700, color: '#0E7C7B', background: 'rgba(14,124,123,0.08)', border: '1.5px solid rgba(14,124,123,0.25)' }}>
              Mở lại dialog để xem
            </button>
          </div>
        )}

        {/* preview trigger card */}
        {!cancelled && (
          <>
            {/* dummy info card */}
            <div className="bg-white rounded-2xl p-4"
                 style={{ border: '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.04em', marginBottom: 10 }}>THÔNG TIN BUỔI HỌC</p>
              {[['Lớp','Beginner A'],['Ngày','29/04/2026'],['Giờ','18:00–19:30'],['Sân','Sân 1'],['Học viên','8 người']].map(([l,v],i,a) => (
                <div key={l} className="flex justify-between py-2.5" style={{ borderBottom: i<a.length-1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>{l}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#1F2933' }}>{v}</span>
                </div>
              ))}
            </div>

            {/* trigger button */}
            <button
              onClick={() => setOpen(true)}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.98] transition-all"
              style={{
                background: 'rgba(231,111,81,0.08)',
                border: '1.5px solid rgba(231,111,81,0.3)',
                color: '#C85A3D',
              }}
            >
              <Ban style={{ width: 17, height: 17 }} />
              <span style={{ fontSize: 15, fontWeight: 800 }}>Hủy buổi học</span>
            </button>

            <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
              Nhấn nút trên để xem dialog hủy buổi học
            </p>
          </>
        )}
      </div>

      {/* ── The dialog ── */}
      <CancelSessionDialog
        visible={open}
        className="Beginner A"
        date="29/04/2026"
        timeStart="18:00"
        timeEnd="19:30"
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
