import {
  ArrowLeft, User, Phone, AtSign, KeyRound, Eye, EyeOff,
  ShieldCheck, Dumbbell, AlertTriangle, CheckCircle2,
  Lock, Unlock, ChevronDown
} from 'lucide-react';
import { useState } from 'react';

interface AddUserScreenProps {
  onBack: () => void;
  onSave: () => void;
}

type Role   = 'Admin' | 'Coach';
type Status = 'active' | 'locked';

export function AddUserScreen({ onBack, onSave }: AddUserScreenProps) {
  /* ── Form state ── */
  const [fullName,    setFullName]    = useState('');
  const [phone,       setPhone]       = useState('');
  const [username,    setUsername]    = useState('');
  const [pin,         setPin]         = useState('');
  const [pinConfirm,  setPinConfirm]  = useState('');
  const [role,        setRole]        = useState<Role>('Coach');
  const [status,      setStatus]      = useState<Status>('active');

  /* ── Visibility ── */
  const [showPin,        setShowPin]        = useState(false);
  const [showPinConfirm, setShowPinConfirm] = useState(false);
  const [showRoleDrop,   setShowRoleDrop]   = useState(false);
  const [touched,        setTouched]        = useState<Record<string, boolean>>({});

  /* ── Validation ── */
  const errors = {
    fullName:   fullName.trim() === ''               ? 'Vui lòng nhập họ tên'              : '',
    username:   username.trim() === ''               ? 'Vui lòng nhập username'            :
                !/^[a-z0-9_]{3,20}$/.test(username)  ? 'Chỉ gồm chữ thường, số, dấu _ (3-20 ký tự)' : '',
    pin:        pin === ''                           ? 'Vui lòng nhập mã PIN'             :
                !/^\d{4,6}$/.test(pin)               ? 'PIN phải từ 4-6 chữ số'           : '',
    pinConfirm: pinConfirm === ''                    ? 'Vui lòng xác nhận mã PIN'         :
                pin !== pinConfirm                   ? 'Mã PIN không khớp'                 : '',
  };

  const canSave = Object.values(errors).every(e => e === '') && fullName && username && pin && pinConfirm;

  function touch(field: string) {
    setTouched(prev => ({ ...prev, [field]: true }));
  }

  function handleSave() {
    setTouched({ fullName: true, username: true, pin: true, pinConfirm: true });
    if (!canSave) return;
    console.log('Save user:', { fullName, phone, username, pin, role, status });
    onSave();
  }

  /* ── PIN strength indicator ── */
  const pinStrength = pin.length >= 6 ? 'strong' : pin.length >= 4 ? 'medium' : pin.length > 0 ? 'weak' : 'none';
  const pinStrengthLabel  = { strong: 'Mạnh', medium: 'Trung bình', weak: 'Yếu', none: '' }[pinStrength];
  const pinStrengthColor  = { strong: '#2A9D8F', medium: '#E9C46A', weak: '#E76F51', none: '' }[pinStrength];

  /* ── Role options ── */
  const roleOptions: { value: Role; label: string; desc: string; color: string; bg: string }[] = [
    {
      value: 'Coach', label: 'Coach', color: '#F4A261', bg: 'rgba(244,162,97,0.1)',
      desc: 'Điểm danh, xem lớp học, quản lý học viên được phân công',
    },
    {
      value: 'Admin', label: 'Admin', color: '#815AD5', bg: 'rgba(129,90,213,0.1)',
      desc: 'Toàn quyền: doanh thu, dữ liệu, sao lưu & tất cả Coach',
    },
  ];

  const selectedRole = roleOptions.find(r => r.value === role)!;

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">

      {/* ══ Header ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-14 -right-3 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />

        <div className="flex items-center gap-3 px-4 pt-10 pb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              Thêm người dùng
            </h1>
            <p className="text-white/60" style={{ fontSize: '11px' }}>
              Tạo tài khoản đăng nhập mới
            </p>
          </div>
          {/* Lock icon as visual hint */}
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 flex-shrink-0">
            <KeyRound className="w-4 h-4 text-white/70" />
          </div>
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-32">

        {/* ── Section: Thông tin cá nhân ── */}
        <SectionLabel icon={<User className="w-3.5 h-3.5" />} title="Thông tin cá nhân" />

        {/* Họ tên */}
        <FieldWrapper>
          <FieldLabel label="Họ tên" required />
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <User className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              onBlur={() => touch('fullName')}
              placeholder="VD: Nguyễn Văn A"
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white text-sm text-gray-900 outline-none transition-all
                ${touched.fullName && errors.fullName
                  ? 'border-[#E76F51] ring-2 ring-[#E76F51]/20'
                  : 'border-gray-200 focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15'}`}
            />
          </div>
          {touched.fullName && errors.fullName && <FieldError msg={errors.fullName} />}
        </FieldWrapper>

        {/* Số điện thoại */}
        <FieldWrapper>
          <FieldLabel label="Số điện thoại" />
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <Phone className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="VD: 0901 234 567"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 bg-white text-sm text-gray-900 outline-none
                focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15 transition-all"
            />
          </div>
          <p className="text-xs text-gray-400 mt-1 px-1">Không bắt buộc</p>
        </FieldWrapper>

        {/* ── Section: Thông tin đăng nhập ── */}
        <SectionLabel icon={<KeyRound className="w-3.5 h-3.5" />} title="Thông tin đăng nhập" />

        {/* Username */}
        <FieldWrapper>
          <FieldLabel label="Username" required />
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <AtSign className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value.toLowerCase())}
              onBlur={() => touch('username')}
              placeholder="VD: coach_nam"
              autoCapitalize="none"
              className={`w-full pl-10 pr-4 py-3 rounded-2xl border bg-white text-sm text-gray-900 outline-none transition-all font-mono
                ${touched.username && errors.username
                  ? 'border-[#E76F51] ring-2 ring-[#E76F51]/20'
                  : username && !errors.username
                  ? 'border-[#2A9D8F] ring-2 ring-[#2A9D8F]/15'
                  : 'border-gray-200 focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15'}`}
            />
            {username && !errors.username && (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
              </div>
            )}
          </div>
          {touched.username && errors.username
            ? <FieldError msg={errors.username} />
            : <p className="text-xs text-gray-400 mt-1 px-1">Chỉ gồm chữ thường, số và dấu _ (3-20 ký tự)</p>
          }
        </FieldWrapper>

        {/* Mã PIN */}
        <FieldWrapper>
          <FieldLabel label="Mã PIN" required />
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <KeyRound className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
              onBlur={() => touch('pin')}
              placeholder="Nhập 4-6 chữ số"
              className={`w-full pl-10 pr-12 py-3 rounded-2xl border bg-white text-sm text-gray-900 outline-none tracking-widest transition-all
                ${touched.pin && errors.pin
                  ? 'border-[#E76F51] ring-2 ring-[#E76F51]/20'
                  : 'border-gray-200 focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15'}`}
            />
            <button
              type="button"
              onClick={() => setShowPin(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {/* PIN strength bar */}
          {pin.length > 0 && (
            <div className="mt-2 px-1">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="flex-1 h-1 rounded-full transition-all"
                    style={{
                      background: i <= (pinStrength === 'strong' ? 3 : pinStrength === 'medium' ? 2 : 1)
                        ? pinStrengthColor : '#E5E7EB',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: pinStrengthColor }}>
                Độ mạnh: <span style={{ fontWeight: 600 }}>{pinStrengthLabel}</span>
                {pinStrength === 'weak' && ' — Nên dùng 6 chữ số'}
              </p>
            </div>
          )}
          {touched.pin && errors.pin && <FieldError msg={errors.pin} />}
        </FieldWrapper>

        {/* Nhập lại mã PIN */}
        <FieldWrapper>
          <FieldLabel label="Nhập lại mã PIN" required />
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <KeyRound className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type={showPinConfirm ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={6}
              value={pinConfirm}
              onChange={e => setPinConfirm(e.target.value.replace(/\D/g, ''))}
              onBlur={() => touch('pinConfirm')}
              placeholder="Nhập lại mã PIN"
              className={`w-full pl-10 pr-12 py-3 rounded-2xl border bg-white text-sm text-gray-900 outline-none tracking-widest transition-all
                ${touched.pinConfirm && errors.pinConfirm
                  ? 'border-[#E76F51] ring-2 ring-[#E76F51]/20'
                  : pinConfirm && !errors.pinConfirm
                  ? 'border-[#2A9D8F] ring-2 ring-[#2A9D8F]/15'
                  : 'border-gray-200 focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/15'}`}
            />
            <button
              type="button"
              onClick={() => setShowPinConfirm(v => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPinConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
            {pinConfirm && !errors.pinConfirm && (
              <div className="absolute right-10 top-1/2 -translate-y-1/2">
                <CheckCircle2 className="w-4 h-4 text-[#2A9D8F]" />
              </div>
            )}
          </div>
          {touched.pinConfirm && errors.pinConfirm && <FieldError msg={errors.pinConfirm} />}
        </FieldWrapper>

        {/* ── Section: Vai trò & Trạng thái ── */}
        <SectionLabel icon={<ShieldCheck className="w-3.5 h-3.5" />} title="Vai trò & Trạng thái" />

        {/* Vai trò — custom dropdown */}
        <FieldWrapper>
          <FieldLabel label="Vai trò" required />
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleDrop(v => !v)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border bg-white text-sm outline-none transition-all
                ${showRoleDrop ? 'border-[#0E7C7B] ring-2 ring-[#0E7C7B]/15' : 'border-gray-200'}`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: selectedRole.bg }}
              >
                {role === 'Admin'
                  ? <ShieldCheck className="w-4 h-4" style={{ color: selectedRole.color }} />
                  : <Dumbbell   className="w-4 h-4" style={{ color: selectedRole.color }} />
                }
              </div>
              <span className="flex-1 text-left text-gray-900" style={{ fontWeight: 600 }}>
                {selectedRole.label}
              </span>
              <ChevronDown
                className="w-4 h-4 text-gray-400 transition-transform"
                style={{ transform: showRoleDrop ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* Dropdown */}
            {showRoleDrop && (
              <div
                className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-gray-100 overflow-hidden z-10"
                style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
              >
                {roleOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setRole(opt.value); setShowRoleDrop(false); }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors
                      ${role === opt.value ? 'bg-gray-50' : 'hover:bg-gray-50 active:bg-gray-100'}`}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: opt.bg }}
                    >
                      {opt.value === 'Admin'
                        ? <ShieldCheck className="w-4 h-4" style={{ color: opt.color }} />
                        : <Dumbbell   className="w-4 h-4" style={{ color: opt.color }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900" style={{ fontWeight: 700 }}>{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{opt.desc}</p>
                    </div>
                    {role === opt.value && (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-1.5" style={{ color: '#2A9D8F' }} />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </FieldWrapper>

        {/* Admin Warning */}
        {role === 'Admin' && (
          <div
            className="mx-0 mb-4 rounded-2xl p-4 flex gap-3"
            style={{ background: 'rgba(231,111,81,0.08)', border: '1.5px solid rgba(231,111,81,0.25)' }}
          >
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ background: 'rgba(231,111,81,0.15)' }}
            >
              <AlertTriangle className="w-4 h-4 text-[#E76F51]" />
            </div>
            <div>
              <p className="text-sm text-[#C1461D]" style={{ fontWeight: 700 }}>
                Lưu ý quyền Admin
              </p>
              <ul className="mt-1.5 space-y-1">
                <li className="text-xs text-[#C1461D]/80 flex gap-1.5 items-start">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  Admin có quyền xem doanh thu và tất cả dữ liệu tài chính.
                </li>
                <li className="text-xs text-[#C1461D]/80 flex gap-1.5 items-start">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  Admin có thể sao lưu, khôi phục và xoá dữ liệu.
                </li>
                <li className="text-xs text-[#C1461D]/80 flex gap-1.5 items-start">
                  <span className="mt-0.5 flex-shrink-0">•</span>
                  Chỉ cấp quyền Admin cho người thực sự cần thiết.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Trạng thái */}
        <FieldWrapper>
          <FieldLabel label="Trạng thái" />
          <div className="flex gap-3">
            {/* Đang hoạt động */}
            <button
              type="button"
              onClick={() => setStatus('active')}
              className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all
                ${status === 'active'
                  ? 'border-[#2A9D8F] bg-[#2A9D8F]/8 ring-2 ring-[#2A9D8F]/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: status === 'active' ? 'rgba(42,157,143,0.15)' : 'rgba(0,0,0,0.04)' }}
              >
                <Unlock className="w-4 h-4" style={{ color: status === 'active' ? '#2A9D8F' : '#9CA3AF' }} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm"
                  style={{ fontWeight: 700, color: status === 'active' ? '#2A9D8F' : '#6B7280' }}
                >
                  Hoạt động
                </p>
                <p className="text-xs text-gray-400">Có thể đăng nhập</p>
              </div>
              {status === 'active' && (
                <CheckCircle2 className="w-4 h-4 ml-auto text-[#2A9D8F]" />
              )}
            </button>

            {/* Tạm khóa */}
            <button
              type="button"
              onClick={() => setStatus('locked')}
              className={`flex-1 flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all
                ${status === 'locked'
                  ? 'border-[#E76F51] bg-[#E76F51]/8 ring-2 ring-[#E76F51]/20'
                  : 'border-gray-200 bg-white hover:border-gray-300'}`}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: status === 'locked' ? 'rgba(231,111,81,0.15)' : 'rgba(0,0,0,0.04)' }}
              >
                <Lock className="w-4 h-4" style={{ color: status === 'locked' ? '#E76F51' : '#9CA3AF' }} />
              </div>
              <div className="text-left">
                <p
                  className="text-sm"
                  style={{ fontWeight: 700, color: status === 'locked' ? '#E76F51' : '#6B7280' }}
                >
                  Tạm khóa
                </p>
                <p className="text-xs text-gray-400">Chưa cho đăng nhập</p>
              </div>
              {status === 'locked' && (
                <CheckCircle2 className="w-4 h-4 ml-auto text-[#E76F51]" />
              )}
            </button>
          </div>
        </FieldWrapper>

        {/* ── Security tips ── */}
        <div
          className="mt-2 rounded-2xl p-4 flex gap-3"
          style={{ background: 'rgba(14,124,123,0.06)', border: '1.5px solid rgba(14,124,123,0.18)' }}
        >
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: 'rgba(14,124,123,0.12)' }}
          >
            <KeyRound className="w-4 h-4 text-[#0E7C7B]" />
          </div>
          <div>
            <p className="text-sm text-[#0E7C7B]" style={{ fontWeight: 700 }}>
              Bảo mật tài khoản
            </p>
            <ul className="mt-1.5 space-y-1">
              <li className="text-xs text-[#0E7C7B]/75 flex gap-1.5 items-start">
                <span className="mt-0.5 flex-shrink-0">•</span>
                Dùng PIN 6 chữ số để tăng bảo mật.
              </li>
              <li className="text-xs text-[#0E7C7B]/75 flex gap-1.5 items-start">
                <span className="mt-0.5 flex-shrink-0">•</span>
                Không dùng PIN dễ đoán như 123456, 000000.
              </li>
              <li className="text-xs text-[#0E7C7B]/75 flex gap-1.5 items-start">
                <span className="mt-0.5 flex-shrink-0">•</span>
                Mỗi người dùng cần có PIN riêng, bảo mật.
              </li>
            </ul>
          </div>
        </div>

      </div>

      {/* ══ Footer ══ */}
      <div
        className="flex-shrink-0 px-4 py-4 flex gap-3"
        style={{
          background: 'rgba(247,249,250,0.96)',
          borderTop: '1px solid rgba(0,0,0,0.07)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Hủy */}
        <button
          onClick={onBack}
          className="flex-1 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm text-gray-700 transition-all
            active:bg-gray-50"
          style={{ fontWeight: 600 }}
        >
          Hủy
        </button>

        {/* Lưu người dùng */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className="flex-[2] py-3.5 rounded-2xl text-sm text-white transition-all flex items-center justify-center gap-2"
          style={{
            background: canSave
              ? 'linear-gradient(135deg, #0E7C7B 0%, #2A9D8F 100%)'
              : '#D1D5DB',
            fontWeight: 700,
            boxShadow: canSave ? '0 4px 16px rgba(14,124,123,0.35)' : 'none',
          }}
        >
          <User className="w-4 h-4" />
          Lưu người dùng
        </button>
      </div>

      <style>{`
        .bg-\\[\\#2A9D8F\\]\\/8 { background-color: rgba(42,157,143,0.08); }
        .bg-\\[\\#E76F51\\]\\/8 { background-color: rgba(231,111,81,0.08); }
      `}</style>
    </div>
  );
}

/* ── Small reusable helpers ── */
function SectionLabel({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-2">
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center"
        style={{ background: 'rgba(14,124,123,0.1)', color: '#0E7C7B' }}
      >
        {icon}
      </div>
      <span className="text-xs uppercase tracking-wider text-gray-500" style={{ fontWeight: 700 }}>
        {title}
      </span>
      <div className="flex-1 h-px bg-gray-100" />
    </div>
  );
}

function FieldWrapper({ children }: { children: React.ReactNode }) {
  return <div className="mb-4">{children}</div>;
}

function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <label className="block text-xs text-gray-600 mb-1.5 px-1" style={{ fontWeight: 600 }}>
      {label}
      {required && <span className="text-[#E76F51] ml-0.5">*</span>}
    </label>
  );
}

function FieldError({ msg }: { msg: string }) {
  return (
    <p className="text-xs text-[#E76F51] mt-1.5 px-1 flex items-center gap-1">
      <span className="inline-block w-1 h-1 rounded-full bg-[#E76F51] flex-shrink-0" />
      {msg}
    </p>
  );
}