import {
  ArrowLeft, KeyRound, Eye, EyeOff,
  ShieldCheck, AlertCircle, CheckCircle2,
  Lock, Lightbulb, X
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface ChangePINScreenProps {
  onBack: () => void;
  onSave: () => void;
}

/* ── Mock correct PIN for demo ── */
const MOCK_CURRENT_PIN = '1234';

/* ── Weak PIN patterns ── */
const WEAK_PINS = ['0000','1111','2222','3333','4444','5555','6666','7777','8888','9999',
                   '1234','4321','1230','0123','1230','123456','654321','000000','111111'];

export function ChangePINScreen({ onBack, onSave }: ChangePINScreenProps) {
  /* ── Field values ── */
  const [current,    setCurrent]    = useState('');
  const [newPin,     setNewPin]     = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  /* ── Visibility ── */
  const [showCurrent,    setShowCurrent]    = useState(false);
  const [showNew,        setShowNew]        = useState(false);
  const [showConfirm,    setShowConfirm]    = useState(false);

  /* ── Touched (for inline errors) ── */
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  /* ── Server-side error (wrong current PIN) ── */
  const [currentPinError, setCurrentPinError] = useState('');

  /* ── Success dialog ── */
  const [success, setSuccess] = useState(false);

  /* ── Auto-close success after 2s ── */
  useEffect(() => {
    if (success) {
      const t = setTimeout(() => {
        setSuccess(false);
        onSave();
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [success, onSave]);

  /* ── Validation ── */
  function validateCurrent() {
    if (!current)           return 'Vui lòng nhập mã PIN hiện tại';
    if (!/^\d{4,6}$/.test(current)) return 'Mã PIN phải từ 4–6 chữ số';
    return '';
  }
  function validateNew() {
    if (!newPin)                   return 'Vui lòng nhập mã PIN mới';
    if (!/^\d{4,6}$/.test(newPin)) return 'Mã PIN phải từ 4–6 chữ số';
    if (newPin === current)         return 'Mã PIN mới phải khác mã PIN hiện tại';
    return '';
  }
  function validateConfirm() {
    if (!confirmPin)              return 'Vui lòng nhập lại mã PIN mới';
    if (confirmPin !== newPin)    return 'Mã PIN mới không khớp';
    return '';
  }

  const errCurrent = touched.current ? (currentPinError || validateCurrent()) : '';
  const errNew     = touched.new     ? validateNew()     : '';
  const errConfirm = touched.confirm ? validateConfirm() : '';

  /* ── Weak PIN warning (not blocking, just advisory) ── */
  const isWeakPin = newPin.length >= 4 && WEAK_PINS.includes(newPin);

  /* ── PIN strength ── */
  const pinLen = newPin.length;
  const pinStrength = pinLen === 0 ? 'none'
    : WEAK_PINS.includes(newPin)   ? 'weak'
    : pinLen < 5                    ? 'medium'
    :                                 'strong';
  const strengthMeta = {
    none:   { label: '',             color: '#E5E7EB', bars: 0 },
    weak:   { label: 'Dễ đoán',      color: '#E76F51', bars: 1 },
    medium: { label: 'Trung bình',   color: '#E9C46A', bars: 2 },
    strong: { label: 'Mạnh',         color: '#2A9D8F', bars: 3 },
  }[pinStrength];

  const canSubmit = !validateCurrent() && !validateNew() && !validateConfirm();

  /* ── Handle submit ── */
  function handleSubmit() {
    setTouched({ current: true, new: true, confirm: true });
    if (validateCurrent() || validateNew() || validateConfirm()) return;

    /* Mock: check current PIN */
    if (current !== MOCK_CURRENT_PIN) {
      setCurrentPinError('Mã PIN hiện tại không đúng');
      setTouched(prev => ({ ...prev, current: true }));
      setCurrent('');
      return;
    }

    setCurrentPinError('');
    setSuccess(true);
  }

  function handleCurrentChange(val: string) {
    setCurrentPinError('');
    setCurrent(val.replace(/\D/g, '').slice(0, 6));
  }

  /* ── Dots indicator ── */
  function PinDots({ value, max = 6 }: { value: string; max?: number }) {
    return (
      <div className="flex gap-1.5 mt-2">
        {Array.from({ length: Math.max(value.length, 4) }).map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i < value.length ? '#0E7C7B' : '#E5E7EB',
              transform: i === value.length - 1 ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen bg-[#F7F9FA]">

        {/* ══ Header ══ */}
        <div
          className="flex-shrink-0 relative overflow-hidden"
          style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
        >
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-14 -right-3 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />
          {/* Decorative lock ring */}
          <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/3 pointer-events-none" />

          <div className="flex items-center gap-3 px-4 pt-10 pb-6">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <p className="text-white/60" style={{ fontSize: '11px' }}>Bảo mật tài khoản</p>
              <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
                Đổi mã PIN
              </h1>
            </div>
            <div
              className="w-9 h-9 flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Lock className="w-4 h-4 text-white/80" />
            </div>
          </div>
        </div>

        {/* ══ Scrollable body ══ */}
        <div className="flex-1 overflow-y-auto px-4 py-5 pb-32">

          {/* ── Security badge ── */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(14,124,123,0.1)', border: '1.5px solid rgba(14,124,123,0.2)' }}
            >
              <ShieldCheck className="w-6 h-6 text-[#0E7C7B]" />
            </div>
            <div>
              <p className="text-gray-900" style={{ fontSize: '15px', fontWeight: 700 }}>
                Cập nhật mã PIN đăng nhập
              </p>
              <p className="text-gray-500" style={{ fontSize: '12px' }}>
                Điền đầy đủ thông tin bên dưới để thay đổi
              </p>
            </div>
          </div>

          {/* ── Demo hint ── */}
          <div
            className="flex items-center gap-2.5 px-4 py-3 rounded-2xl mb-5"
            style={{ background: 'rgba(233,196,106,0.12)', border: '1.5px solid rgba(233,196,106,0.35)' }}
          >
            <Lightbulb className="w-4 h-4 text-[#B8860B] flex-shrink-0" />
            <p className="text-xs text-[#92690A]">
              <span style={{ fontWeight: 700 }}>Demo:</span> Mã PIN hiện tại là <span className="font-mono font-bold tracking-widest">1234</span>
            </p>
          </div>

          {/* ── Form ── */}
          <div className="space-y-4">

            {/* Mã PIN hiện tại */}
            <PinField
              label="Mã PIN hiện tại"
              required
              value={current}
              onChange={handleCurrentChange}
              show={showCurrent}
              onToggleShow={() => setShowCurrent(v => !v)}
              error={errCurrent}
              onBlur={() => setTouched(p => ({ ...p, current: true }))}
              placeholder="Nhập mã PIN hiện tại"
              hint="Nhập mã PIN bạn đang dùng để đăng nhập"
            />

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400 px-1">Mã PIN mới</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Mã PIN mới */}
            <div>
              <PinField
                label="Mã PIN mới"
                required
                value={newPin}
                onChange={v => setNewPin(v.replace(/\D/g, '').slice(0, 6))}
                show={showNew}
                onToggleShow={() => setShowNew(v => !v)}
                error={errNew}
                onBlur={() => setTouched(p => ({ ...p, new: true }))}
                placeholder="Nhập mã PIN mới (4–6 số)"
              />

              {/* Strength bar */}
              {newPin.length > 0 && (
                <div className="mt-2 px-1">
                  <div className="flex gap-1.5 mb-1">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="flex-1 h-1.5 rounded-full transition-all duration-300"
                        style={{
                          background: i <= strengthMeta.bars ? strengthMeta.color : '#E5E7EB',
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strengthMeta.color, fontWeight: 600 }}>
                    {strengthMeta.label}
                    {pinStrength === 'weak' && ' — Nên chọn mã khó đoán hơn'}
                    {pinStrength === 'medium' && ' — Dùng 6 chữ số để bảo mật hơn'}
                    {pinStrength === 'strong' && ' — Tốt!'}
                  </p>
                </div>
              )}
            </div>

            {/* Nhập lại mã PIN mới */}
            <PinField
              label="Nhập lại mã PIN mới"
              required
              value={confirmPin}
              onChange={v => setConfirmPin(v.replace(/\D/g, '').slice(0, 6))}
              show={showConfirm}
              onToggleShow={() => setShowConfirm(v => !v)}
              error={errConfirm}
              onBlur={() => setTouched(p => ({ ...p, confirm: true }))}
              placeholder="Nhập lại mã PIN mới"
              success={!!confirmPin && confirmPin === newPin}
            />
          </div>

          {/* ── Rules card ── */}
          <div
            className="mt-5 rounded-2xl p-4"
            style={{ background: 'rgba(14,124,123,0.06)', border: '1.5px solid rgba(14,124,123,0.16)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,124,123,0.12)' }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0E7C7B]" />
              </div>
              <p className="text-sm text-[#0E7C7B]" style={{ fontWeight: 700 }}>
                Quy tắc mã PIN an toàn
              </p>
            </div>
            <ul className="space-y-2">
              {[
                'Mã PIN nên có từ 4–6 chữ số.',
                'Không dùng mã dễ đoán như 1234 hoặc 0000.',
                'Không chia sẻ mã PIN với bất kỳ ai khác.',
                'Đổi mã PIN định kỳ để tăng bảo mật.',
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(14,124,123,0.15)' }}
                  >
                    <span style={{ fontSize: '9px', fontWeight: 800, color: '#0E7C7B' }}>{i + 1}</span>
                  </div>
                  <p className="text-xs text-[#0E7C7B]/75 leading-relaxed">{rule}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ══ Footer ══ */}
        <div
          className="flex-shrink-0 px-4 py-4 flex gap-3"
          style={{
            background: 'rgba(247,249,250,0.97)',
            borderTop: '1px solid rgba(0,0,0,0.07)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Hủy */}
          <button
            onClick={onBack}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white transition-all active:bg-gray-50"
            style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}
          >
            Hủy
          </button>

          {/* Cập nhật */}
          <button
            onClick={handleSubmit}
            className="flex-[2] py-3.5 rounded-2xl text-white transition-all flex items-center justify-center gap-2 active:opacity-90"
            style={{
              background: canSubmit
                ? 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)'
                : '#D1D5DB',
              fontSize: '14px',
              fontWeight: 700,
              boxShadow: canSubmit ? '0 4px 16px rgba(14,124,123,0.35)' : 'none',
            }}
          >
            <KeyRound className="w-4 h-4" />
            Cập nhật mã PIN
          </button>
        </div>
      </div>

      {/* ══ Success Dialog ══ */}
      {success && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-8"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-[300px] bg-white rounded-3xl overflow-hidden"
            style={{
              boxShadow: '0 24px 64px rgba(0,0,0,0.22)',
              animation: 'successPop 280ms cubic-bezier(0.34,1.56,0.64,1) both',
            }}
          >
            {/* Top band */}
            <div
              className="h-2 w-full"
              style={{ background: 'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }}
            />

            <div className="px-6 pt-6 pb-6 flex flex-col items-center text-center">
              {/* Icon */}
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                style={{
                  background: 'radial-gradient(circle,rgba(42,157,143,0.18) 0%,rgba(14,124,123,0.06) 70%)',
                  border: '2px solid rgba(42,157,143,0.25)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(42,157,143,0.15)' }}
                >
                  <CheckCircle2 className="w-8 h-8 text-[#2A9D8F]" />
                </div>
              </div>

              {/* Title */}
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#0E7C7B' }}>
                Đổi PIN thành công!
              </p>

              {/* Message */}
              <p className="text-gray-500 mt-2 leading-relaxed" style={{ fontSize: '13px' }}>
                Mã PIN của bạn đã được cập nhật.
              </p>
              <p className="text-gray-500 leading-relaxed" style={{ fontSize: '13px' }}>
                Vui lòng dùng mã PIN mới trong lần đăng nhập sau.
              </p>

              {/* Countdown bar */}
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-5">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg,#0E7C7B,#2A9D8F)',
                    animation: 'progressCount 2.2s linear both',
                  }}
                />
              </div>
              <p className="text-gray-400 mt-2" style={{ fontSize: '11px' }}>
                Tự động đóng sau vài giây...
              </p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes successPop {
          from { opacity: 0; transform: scale(0.82) translateY(16px); }
          to   { opacity: 1; transform: scale(1)    translateY(0); }
        }
        @keyframes progressCount {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </>
  );
}

/* ════════════════════════════════════
   Sub-component: PinField
   ════════════════════════════════════ */
interface PinFieldProps {
  label:         string;
  required?:     boolean;
  value:         string;
  onChange:      (v: string) => void;
  show:          boolean;
  onToggleShow:  () => void;
  error?:        string;
  onBlur?:       () => void;
  placeholder?:  string;
  hint?:         string;
  success?:      boolean;
}

function PinField({
  label, required, value, onChange, show, onToggleShow,
  error, onBlur, placeholder, hint, success,
}: PinFieldProps) {
  const hasError   = !!error;
  const hasSuccess = success && !hasError;

  return (
    <div>
      <label className="block px-1 mb-1.5" style={{ fontSize: '12px', fontWeight: 600, color: '#374151' }}>
        {label}
        {required && <span className="text-[#E76F51] ml-0.5">*</span>}
      </label>

      <div className="relative">
        {/* Left icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <KeyRound className="w-4 h-4 text-gray-400" />
        </div>

        <input
          type={show ? 'text' : 'password'}
          inputMode="numeric"
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className="w-full pl-10 pr-20 py-3.5 rounded-2xl border bg-white text-sm text-gray-900 outline-none transition-all tracking-widest"
          style={{
            borderColor: hasError   ? '#E76F51'
                        : hasSuccess ? '#2A9D8F'
                        : '#E5E7EB',
            boxShadow:  hasError    ? '0 0 0 3px rgba(231,111,81,0.12)'
                        : hasSuccess ? '0 0 0 3px rgba(42,157,143,0.12)'
                        : 'none',
          }}
        />

        {/* Right side: dots preview + show/hide */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Filled dots when hidden */}
          {!show && value.length > 0 && (
            <div className="flex gap-1">
              {Array.from({ length: Math.min(value.length, 6) }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: hasError ? '#E76F51' : hasSuccess ? '#2A9D8F' : '#0E7C7B' }}
                />
              ))}
            </div>
          )}

          {/* Success check */}
          {hasSuccess && (
            <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
          )}

          {/* Show/hide toggle */}
          <button
            type="button"
            onClick={onToggleShow}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Error */}
      {hasError && (
        <div className="flex items-center gap-1.5 mt-1.5 px-1">
          <AlertCircle className="w-3.5 h-3.5 text-[#E76F51] flex-shrink-0" />
          <p style={{ fontSize: '12px', color: '#E76F51', fontWeight: 500 }}>{error}</p>
        </div>
      )}

      {/* Hint (no error) */}
      {!hasError && hint && (
        <p className="text-xs text-gray-400 mt-1 px-1">{hint}</p>
      )}
    </div>
  );
}
