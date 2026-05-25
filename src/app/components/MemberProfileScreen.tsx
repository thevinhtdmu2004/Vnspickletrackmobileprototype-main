/**
 * MemberProfileScreen — VNS PickleTrack
 * Hồ sơ của tôi · Học viên / Hội viên
 * Android 390 × 844
 */
import { useState } from 'react';
import {
  Phone, Calendar, ChevronRight,
  Lock, LogOut, Shield, User,
  Award, Send, BookOpen, Dumbbell,
  Bell, FileText, X, CheckCircle2,
  AlertCircle, Edit3, Info
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const MEMBER = {
  name:       'Nguyễn Văn A',
  initials:   'NA',
  role:       'Hội viên Pickleball',
  phone:      '090xxxxxxx',
  level:      'Beginner',
  className:  'Beginner A',
  coach:      'Coach Nam',
  joinDate:   '01/04/2026',
  remaining:  7,
  total:      12,
  status:     'active' as 'active' | 'suspended' | 'quit',
};

const STATUS_CFG = {
  active:    { label:'Đang học',  color:'#2A9D8F', bg:'rgba(42,157,143,0.14)', dot:'#2A9D8F'  },
  suspended: { label:'Tạm nghỉ', color:'#E9C46A', bg:'rgba(233,196,106,0.20)', dot:'#E9C46A'  },
  quit:      { label:'Đã nghỉ',  color:'#E76F51', bg:'rgba(231,111,81,0.15)',  dot:'#E76F51'  },
};

/* ══════════════════════════════════════════════════════
   UPDATE-REQUEST BOTTOM SHEET
══════════════════════════════════════════════════════ */
interface UpdateSheetProps {
  onClose:  () => void;
  onSubmit: () => void;
}
function UpdateSheet({ onClose, onSubmit }: UpdateSheetProps) {
  const [text, setText] = useState('');
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background:'rgba(0,0,0,0.42)', backdropFilter:'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl overflow-hidden"
        style={{ background:'white', boxShadow:'0 -12px 48px rgba(0,0,0,0.18)', maxHeight:'82vh', display:'flex', flexDirection:'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1.5 rounded-full" style={{ background:'rgba(0,0,0,0.12)' }} />
        </div>

        <div className="px-5 pb-8 overflow-y-auto">
          {/* Title */}
          <div className="flex items-center justify-between mb-5 mt-2">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{ width:42, height:42, background:'rgba(14,124,123,0.10)' }}
              >
                <Edit3 style={{ width:18, height:18, color:'#0E7C7B' }} />
              </div>
              <div>
                <p style={{ fontSize:17, fontWeight:900, color:'#1F2933' }}>Yêu cầu cập nhật</p>
                <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:500 }}>Gửi yêu cầu tới Admin</p>
              </div>
            </div>
            <button onClick={onClose} className="active:scale-90">
              <X style={{ width:20, height:20, color:'#9CA3AF' }} />
            </button>
          </div>

          {/* Info notice */}
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-2xl mb-4"
            style={{ background:'rgba(233,196,106,0.12)', border:'1.5px solid rgba(233,196,106,0.28)' }}
          >
            <Info style={{ width:14, height:14, color:'#B8860B', marginTop:1, flexShrink:0 }} />
            <p style={{ fontSize:11, color:'#7A5C00', fontWeight:500, lineHeight:1.7 }}>
              Vui lòng mô tả thông tin cần thay đổi. Admin sẽ xem xét và cập nhật trong vòng 24 giờ.
            </p>
          </div>

          {/* Fields to update */}
          <p style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.04em', marginBottom:8 }}>
            THÔNG TIN CẦN CẬP NHẬT
          </p>
          <div className="space-y-2 mb-4">
            {[
              { label:'Số điện thoại', current: MEMBER.phone },
              { label:'Họ và tên',     current: MEMBER.name  },
            ].map((field, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-4 py-3 rounded-2xl"
                style={{ background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.07)' }}
              >
                <div>
                  <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>{field.label}</p>
                  <p style={{ fontSize:13, fontWeight:700, color:'#4B5563' }}>{field.current}</p>
                </div>
                <span style={{ fontSize:10, color:'#C4C9D4', fontWeight:600 }}>Hiện tại</span>
              </div>
            ))}
          </div>

          {/* Note textarea */}
          <p style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.04em', marginBottom:8 }}>
            GHI CHÚ YÊU CẦU
          </p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Ví dụ: Cập nhật số điện thoại thành 0912345678..."
            rows={4}
            className="w-full rounded-2xl px-4 py-3 resize-none outline-none"
            style={{
              fontSize:13, color:'#374151', fontWeight:500, lineHeight:1.7,
              background:'rgba(0,0,0,0.03)', border:'1.5px solid rgba(0,0,0,0.10)',
              fontFamily:'inherit',
            }}
          />

          {/* Submit */}
          <button
            onClick={onSubmit}
            disabled={text.trim().length < 5}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl mt-4 active:opacity-80 transition-all disabled:opacity-40"
            style={{
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow:  text.trim().length >= 5 ? '0 8px 24px rgba(14,124,123,0.32)' : 'none',
            }}
          >
            <Send style={{ width:16, height:16, color:'white' }} />
            <span style={{ fontSize:15, fontWeight:900, color:'white' }}>
              Gửi yêu cầu cập nhật
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PIN CHANGE SHEET
══════════════════════════════════════════════════════ */
interface PinSheetProps { onClose: () => void; onDone: () => void; }
function PinSheet({ onClose, onDone }: PinSheetProps) {
  const [step,    setStep]    = useState<'current' | 'new' | 'confirm'>('current');
  const [current, setCurrent] = useState('');
  const [newPin,  setNewPin]  = useState('');
  const [confirm, setConfirm] = useState('');

  const STEP_CFG = {
    current: { label:'Nhập mã PIN hiện tại', setter: setCurrent, value: current },
    new:     { label:'Nhập mã PIN mới (4 chữ số)', setter: setNewPin,  value: newPin  },
    confirm: { label:'Xác nhận mã PIN mới', setter: setConfirm, value: confirm },
  };
  const cfg = STEP_CFG[step];

  function handleDigit(d: string) {
    if (cfg.value.length >= 4) return;
    const next = cfg.value + d;
    cfg.setter(next);
    if (next.length === 4) {
      setTimeout(() => {
        if (step === 'current') setStep('new');
        else if (step === 'new')  setStep('confirm');
        else onDone();
      }, 320);
    }
  }
  function handleBack() {
    cfg.setter(cfg.value.slice(0, -1));
  }

  const KEYS = ['1','2','3','4','5','6','7','8','9','','0','←'];

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background:'rgba(0,0,0,0.42)', backdropFilter:'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl overflow-hidden"
        style={{ background:'white', boxShadow:'0 -12px 48px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full" style={{ background:'rgba(0,0,0,0.12)' }} />
        </div>
        <div className="px-5 pb-8">
          {/* Title */}
          <div className="flex items-center justify-between mb-6 mt-2">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center rounded-2xl"
                style={{ width:42, height:42, background:'rgba(14,124,123,0.10)' }}
              >
                <Lock style={{ width:18, height:18, color:'#0E7C7B' }} />
              </div>
              <div>
                <p style={{ fontSize:17, fontWeight:900, color:'#1F2933' }}>Đổi mã PIN</p>
                <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:500 }}>{cfg.label}</p>
              </div>
            </div>
            <button onClick={onClose} className="active:scale-90">
              <X style={{ width:20, height:20, color:'#9CA3AF' }} />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {(['current','new','confirm'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="flex items-center justify-center rounded-full"
                  style={{
                    width:24, height:24,
                    background: s === step ? '#0E7C7B' : ['current','new','confirm'].indexOf(step) > i ? 'rgba(42,157,143,0.15)' : 'rgba(0,0,0,0.07)',
                    border: s === step ? '2px solid #0E7C7B' : 'none',
                  }}
                >
                  {(['current','new','confirm'].indexOf(step) > i)
                    ? <CheckCircle2 style={{ width:12, height:12, color:'#2A9D8F' }} />
                    : <span style={{ fontSize:10, fontWeight:800, color: s === step ? 'white' : '#9CA3AF' }}>{i+1}</span>
                  }
                </div>
                {i < 2 && <div className="w-6 h-px" style={{ background:'rgba(0,0,0,0.12)' }} />}
              </div>
            ))}
          </div>

          {/* PIN dots */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {Array.from({length:4}).map((_,i) => (
              <div
                key={i}
                className="rounded-full transition-all"
                style={{
                  width:  cfg.value.length > i ? 20 : 14,
                  height: cfg.value.length > i ? 20 : 14,
                  background: cfg.value.length > i ? '#0E7C7B' : 'rgba(0,0,0,0.12)',
                  boxShadow: cfg.value.length > i ? '0 4px 12px rgba(14,124,123,0.35)' : 'none',
                }}
              />
            ))}
          </div>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-3">
            {KEYS.map((key, i) => (
              <button
                key={i}
                onClick={() => key === '←' ? handleBack() : key ? handleDigit(key) : undefined}
                disabled={!key}
                className="flex items-center justify-center rounded-2xl active:scale-90 transition-all disabled:opacity-0"
                style={{
                  height:56,
                  background: key === '←' ? 'rgba(231,111,81,0.08)' : 'rgba(0,0,0,0.04)',
                  border:     key === '←' ? '1.5px solid rgba(231,111,81,0.20)' : '1.5px solid rgba(0,0,0,0.08)',
                }}
              >
                <span style={{
                  fontSize: key === '←' ? 18 : 22,
                  fontWeight: 700,
                  color: key === '←' ? '#E76F51' : '#1F2933',
                }}>
                  {key}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   LOGOUT CONFIRM
══════════════════════════════════════════════════════ */
function LogoutConfirm({ onClose, onConfirm }: { onClose:()=>void; onConfirm:()=>void }) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center"
      style={{ background:'rgba(0,0,0,0.42)', backdropFilter:'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full rounded-t-3xl overflow-hidden"
        style={{ background:'white', boxShadow:'0 -12px 48px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pt-3"><div className="w-10 h-1.5 rounded-full" style={{ background:'rgba(0,0,0,0.12)' }} /></div>
        <div className="px-5 pb-8 pt-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div
              className="flex items-center justify-center rounded-3xl mb-3"
              style={{ width:56, height:56, background:'rgba(231,111,81,0.10)' }}
            >
              <LogOut style={{ width:24, height:24, color:'#E76F51' }} />
            </div>
            <p style={{ fontSize:18, fontWeight:900, color:'#1F2933' }}>Đăng xuất?</p>
            <p style={{ fontSize:13, color:'#9CA3AF', fontWeight:500, marginTop:4 }}>
              Bạn sẽ cần đăng nhập lại để sử dụng ứng dụng.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl active:opacity-70"
              style={{ background:'rgba(0,0,0,0.06)', border:'1.5px solid rgba(0,0,0,0.09)' }}
            >
              <span style={{ fontSize:14, fontWeight:800, color:'#6B7280' }}>Huỷ</span>
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-4 rounded-2xl active:opacity-80"
              style={{ background:'linear-gradient(135deg,#C62828,#E76F51)', boxShadow:'0 8px 20px rgba(231,111,81,0.35)' }}
            >
              <span style={{ fontSize:14, fontWeight:900, color:'white' }}>Đăng xuất</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SUCCESS TOAST
══════════════════════════════════════════════════════ */
function Toast({ message, sub }: { message:string; sub:string }) {
  return (
    <div
      className="absolute bottom-28 left-4 right-4 z-50 flex items-center gap-3 px-4 py-4 rounded-2xl"
      style={{
        background: 'linear-gradient(135deg,#065F5E,#0E7C7B)',
        boxShadow:  '0 12px 36px rgba(14,124,123,0.45)',
        border:     '1.5px solid rgba(255,255,255,0.18)',
      }}
    >
      <div className="flex items-center justify-center rounded-xl flex-shrink-0"
           style={{ width:38, height:38, background:'rgba(255,255,255,0.18)' }}>
        <CheckCircle2 style={{ width:18, height:18, color:'white' }} />
      </div>
      <div>
        <p style={{ fontSize:13, fontWeight:900, color:'white' }}>{message}</p>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', fontWeight:500, marginTop:1 }}>{sub}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
interface MemberProfileScreenProps {
  onNavigate?: (screen: string) => void;
  onLogout?:   () => void;
}

export function MemberProfileScreen({ onNavigate, onLogout }: MemberProfileScreenProps) {
  const [sheet,   setSheet]   = useState<'none'|'update'|'pin'|'logout'>('none');
  const [toast,   setToast]   = useState<{ message:string; sub:string } | null>(null);

  const statusCfg = STATUS_CFG[MEMBER.status];
  const progress  = MEMBER.remaining / MEMBER.total;

  function showToast(message: string, sub: string) {
    setToast({ message, sub });
    setTimeout(() => setToast(null), 3800);
  }

  function handleUpdateSubmit() {
    setSheet('none');
    showToast('Đã gửi yêu cầu!', 'Admin sẽ xử lý trong vòng 24 giờ');
  }
  function handlePinDone() {
    setSheet('none');
    showToast('Đổi mã PIN thành công!', 'Mã PIN mới đã được lưu');
  }
  function handleLogout() {
    setSheet('none');
    showToast('Đã đăng xuất', 'Hẹn gặp lại bạn!');
    setTimeout(() => onLogout?.(), 700);
  }

  return (
    <div className="relative flex flex-col min-h-screen" style={{ background:'#F0F4F5' }}>

      {/* ════════════════════════════════════════
          HEADER / PROFILE HERO
      ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background:'linear-gradient(148deg,#032C2C 0%,#053E3E 28%,#075E5D 58%,#0E7C7B 82%,#1A8E87 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute pointer-events-none" style={{ top:-48,right:-32,width:180,height:180,borderRadius:'50%',background:'rgba(255,255,255,0.042)' }} />
        <div className="absolute pointer-events-none" style={{ top:20, right:60, width:88, height:88, borderRadius:'50%',background:'rgba(255,255,255,0.026)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-22,left:-16,width:130,height:130,borderRadius:'50%',background:'rgba(42,157,143,0.09)' }} />

        <div className="relative px-5 pt-14 pb-6">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-4">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div
                className="flex items-center justify-center rounded-3xl"
                style={{
                  width:72, height:72,
                  background:'rgba(255,255,255,0.20)',
                  border:'3px solid rgba(255,255,255,0.38)',
                  fontSize:24, fontWeight:900, color:'white',
                  boxShadow:'0 8px 28px rgba(0,0,0,0.22)',
                  letterSpacing:'0.02em',
                }}
              >
                {MEMBER.initials}
              </div>
              {/* Online dot */}
              <div
                className="absolute rounded-full"
                style={{
                  bottom:4, right:4, width:14, height:14,
                  background:'#2A9D8F',
                  border:'2.5px solid rgba(7,94,93,0.9)',
                  boxShadow:'0 2px 6px rgba(42,157,143,0.5)',
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 style={{ fontSize:20, fontWeight:900, color:'white', letterSpacing:'-0.3px', lineHeight:1.2 }}>
                {MEMBER.name}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <Award style={{ width:11, height:11, color:'rgba(255,255,255,0.55)' }} />
                <span style={{ fontSize:12, color:'rgba(255,255,255,0.60)', fontWeight:600 }}>
                  {MEMBER.role}
                </span>
              </div>
              {/* Status badge */}
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl mt-2"
                style={{ background:statusCfg.bg, border:`1.5px solid ${statusCfg.bg.replace('0.14','0.35').replace('0.20','0.45')}` }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background:statusCfg.dot }} />
                <span style={{ fontSize:11, fontWeight:800, color:statusCfg.color }}>{statusCfg.label}</span>
              </div>
            </div>
          </div>

          {/* Package mini bar */}
          <div
            className="flex items-center gap-4 px-4 py-3 rounded-2xl"
            style={{ background:'rgba(0,0,0,0.20)', border:'1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <span style={{ fontSize:10, color:'rgba(255,255,255,0.50)', fontWeight:700 }}>
                  {MEMBER.className} — {MEMBER.total} buổi
                </span>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.75)', fontWeight:800 }}>
                  Còn {MEMBER.remaining} buổi
                </span>
              </div>
              <div className="rounded-full overflow-hidden" style={{ height:6, background:'rgba(255,255,255,0.16)' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width:`${progress * 100}%`, background:'rgba(255,255,255,0.65)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SCROLLABLE BODY
      ════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-4 pt-4 space-y-4">

          {/* ─────────────────────────────────────────
              THÔNG TIN CÁ NHÂN
          ───────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width:28, height:28, background:'rgba(14,124,123,0.10)' }}
                >
                  <User style={{ width:13, height:13, color:'#0E7C7B' }} />
                </div>
                <p style={{ fontSize:12, fontWeight:900, color:'#1F2933', letterSpacing:'0.04em' }}>
                  THÔNG TIN CÁ NHÂN
                </p>
              </div>
              {/* Request update */}
              <button
                onClick={() => setSheet('update')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl active:scale-95 transition-all"
                style={{ background:'rgba(14,124,123,0.09)', border:'1.5px solid rgba(14,124,123,0.20)' }}
              >
                <Edit3 style={{ width:11, height:11, color:'#0E7C7B' }} />
                <span style={{ fontSize:11, fontWeight:700, color:'#0E7C7B' }}>Yêu cầu cập nhật</span>
              </button>
            </div>

            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{ border:'1.5px solid rgba(0,0,0,0.07)', boxShadow:'0 4px 18px rgba(0,0,0,0.06)' }}
            >
              {[
                {
                  icon: Phone, iconBg:'rgba(14,124,123,0.09)', iconColor:'#0E7C7B',
                  label:'Số điện thoại', value:MEMBER.phone,
                },
                {
                  icon: Award, iconBg:'rgba(244,162,97,0.12)', iconColor:'#E8832A',
                  label:'Trình độ', value:MEMBER.level,
                  badge: { text:MEMBER.level, color:'#E8832A', bg:'rgba(244,162,97,0.14)', border:'rgba(244,162,97,0.30)' },
                },
                {
                  icon: BookOpen, iconBg:'rgba(42,157,143,0.10)', iconColor:'#2A9D8F',
                  label:'Lớp đang học', value:MEMBER.className,
                },
                {
                  icon: Dumbbell, iconBg:'rgba(129,90,213,0.10)', iconColor:'#815AD5',
                  label:'Coach phụ trách', value:MEMBER.coach,
                },
                {
                  icon: Calendar, iconBg:'rgba(233,196,106,0.14)', iconColor:'#B8860B',
                  label:'Ngày tham gia', value:MEMBER.joinDate,
                },
              ].map((row, i, arr) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-4 py-4"
                  style={{ borderBottom: i < arr.length-1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl flex-shrink-0"
                    style={{ width:40, height:40, background:row.iconBg }}
                  >
                    <row.icon style={{ width:17, height:17, color:row.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:600, marginBottom:2 }}>
                      {row.label}
                    </p>
                    <p style={{ fontSize:14, fontWeight:800, color:'#1F2933' }}>
                      {row.value}
                    </p>
                  </div>
                  {row.badge && (
                    <div
                      className="flex-shrink-0 px-2.5 py-1 rounded-xl"
                      style={{
                        background: row.badge.bg,
                        border:     `1px solid ${row.badge.border}`,
                      }}
                    >
                      <span style={{ fontSize:10, fontWeight:800, color:row.badge.color }}>
                        {row.badge.text}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────
              TÀI KHOẢN
          ───────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width:28, height:28, background:'rgba(0,0,0,0.07)' }}
              >
                <Shield style={{ width:13, height:13, color:'#6B7280' }} />
              </div>
              <p style={{ fontSize:12, fontWeight:900, color:'#1F2933', letterSpacing:'0.04em' }}>
                TÀI KHOẢN
              </p>
            </div>

            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{ border:'1.5px solid rgba(0,0,0,0.07)', boxShadow:'0 4px 18px rgba(0,0,0,0.06)' }}
            >
              {[
                {
                  icon: Lock, iconBg:'rgba(14,124,123,0.09)', iconColor:'#0E7C7B',
                  label:'Đổi mã PIN', sub:'Cập nhật mã bảo mật',
                  action: () => setSheet('pin'),
                  arrow: true, danger: false,
                },
                {
                  icon: Bell, iconBg:'rgba(244,162,97,0.12)', iconColor:'#E8832A',
                  label:'Liên hệ Admin', sub:'Gửi tin nhắn hỗ trợ',
                  action: () => onNavigate?.('member-contact'),
                  arrow: true, danger: false,
                },
                {
                  icon: FileText, iconBg:'rgba(42,157,143,0.09)', iconColor:'#2A9D8F',
                  label:'Chính sách lớp học', sub:'Nội quy & điều khoản',
                  action: () => {},
                  arrow: true, danger: false,
                },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={item.action}
                  className="flex items-center gap-4 w-full px-4 py-4 text-left active:bg-gray-50 transition-colors"
                  style={{ borderBottom:'1px solid rgba(0,0,0,0.06)' }}
                >
                  <div
                    className="flex items-center justify-center rounded-2xl flex-shrink-0"
                    style={{ width:40, height:40, background:item.iconBg }}
                  >
                    <item.icon style={{ width:17, height:17, color:item.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p style={{ fontSize:14, fontWeight:800, color:'#1F2933' }}>{item.label}</p>
                    <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:500, marginTop:1 }}>{item.sub}</p>
                  </div>
                  <ChevronRight style={{ width:18, height:18, color:'#C4C9D4', flexShrink:0 }} />
                </button>
              ))}

              {/* Logout — separate danger row */}
              <button
                onClick={() => setSheet('logout')}
                className="flex items-center gap-4 w-full px-4 py-4 text-left active:bg-red-50 transition-colors"
              >
                <div
                  className="flex items-center justify-center rounded-2xl flex-shrink-0"
                  style={{ width:40, height:40, background:'rgba(231,111,81,0.09)' }}
                >
                  <LogOut style={{ width:17, height:17, color:'#E76F51' }} />
                </div>
                <div className="flex-1">
                  <p style={{ fontSize:14, fontWeight:800, color:'#E76F51' }}>Đăng xuất</p>
                  <p style={{ fontSize:11, color:'rgba(231,111,81,0.60)', fontWeight:500, marginTop:1 }}>
                    Thoát khỏi tài khoản
                  </p>
                </div>
                <ChevronRight style={{ width:18, height:18, color:'rgba(231,111,81,0.40)', flexShrink:0 }} />
              </button>
            </div>
          </div>

          {/* ─────────────────────────────────────────
              Read-only notice
          ───────────────────────────────────────── */}
          <div
            className="flex items-start gap-2.5 px-4 py-3.5 rounded-2xl"
            style={{ background:'rgba(14,124,123,0.06)', border:'1.5px solid rgba(14,124,123,0.14)' }}
          >
            <AlertCircle style={{ width:14, height:14, color:'#0E7C7B', marginTop:1, flexShrink:0 }} />
            <p style={{ fontSize:11, color:'#0E7C7B', fontWeight:500, lineHeight:1.7 }}>
              Thông tin được quản lý bởi Admin. Để chỉnh sửa, vui lòng{' '}
              <strong>gửi yêu cầu cập nhật</strong> — Admin sẽ xác nhận và cập nhật trong vòng 24 giờ.
            </p>
          </div>

          {/* App version */}
          <p className="text-center" style={{ fontSize:10, color:'#D1D5DB', fontWeight:500, paddingBottom:4 }}>
            VNS PickleTrack · Phiên bản 1.0.0
          </p>

        </div>
      </div>

      {/* ════════════════════════════════════════
          BOTTOM SHEETS & OVERLAYS
      ════════════════════════════════════════ */}
      {sheet === 'update' && (
        <UpdateSheet onClose={() => setSheet('none')} onSubmit={handleUpdateSubmit} />
      )}
      {sheet === 'pin' && (
        <PinSheet onClose={() => setSheet('none')} onDone={handlePinDone} />
      )}
      {sheet === 'logout' && (
        <LogoutConfirm onClose={() => setSheet('none')} onConfirm={handleLogout} />
      )}

      {/* ════════════════════════════════════════
          SUCCESS TOAST
      ════════════════════════════════════════ */}
      {toast && <Toast message={toast.message} sub={toast.sub} />}

    </div>
  );
}