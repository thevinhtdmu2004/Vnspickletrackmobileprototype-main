/**
 * LoginScreen — VNS PickleTrack
 * Hỗ trợ 3 vai trò: Admin · Coach · Hội viên
 */
import { useState } from 'react';
import { User, Lock, AlertCircle, LogIn, Dumbbell, ShieldCheck, Award, Eye, EyeOff } from 'lucide-react';

/* ══════════════════════════════════════════════════════
   DEMO ACCOUNTS
══════════════════════════════════════════════════════ */
type Role = 'admin' | 'coach' | 'member';

const DEMO_ACCOUNTS: {
  role:    Role;
  label:   string;
  user:    string;
  phone:   string;
  pin:     string;
  color:   string;
  bg:      string;
  border:  string;
  Icon:    React.FC<{ style?: React.CSSProperties }>;
  desc:    string;
}[] = [
  {
    role: 'admin',  label: 'Admin',      user: 'admin',  phone: '0901234567', pin: '123456',
    color: '#0E7C7B', bg: 'rgba(14,124,123,0.09)',  border: 'rgba(14,124,123,0.25)',
    Icon: ShieldCheck, desc: 'Quản lý toàn hệ thống',
  },
  {
    role: 'coach',  label: 'Coach',      user: 'coach',  phone: '0909999999', pin: '111111',
    color: '#2A9D8F', bg: 'rgba(42,157,143,0.09)',  border: 'rgba(42,157,143,0.25)',
    Icon: Dumbbell,   desc: 'Huấn luyện viên',
  },
  {
    role: 'member', label: 'Hội viên',   user: 'member', phone: '0908888888', pin: '222222',
    color: '#815AD5', bg: 'rgba(129,90,213,0.09)',  border: 'rgba(129,90,213,0.25)',
    Icon: Award,      desc: 'Học viên Pickleball',
  },
];

/* Validate credentials */
function validateLogin(account: string, pin: string): Role | null {
  const a = account.trim().toLowerCase();
  for (const demo of DEMO_ACCOUNTS) {
    if ((a === demo.user || a === demo.phone) && pin === demo.pin) return demo.role;
  }
  return null;
}

/* ══════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════ */
export function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [account,   setAccount]   = useState('');
  const [pin,       setPin]       = useState('');
  const [showPin,   setShowPin]   = useState(false);
  const [error,     setError]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [quickRole, setQuickRole] = useState<Role | null>(null);   // quick-fill

  function handleLogin() {
    setError('');
    if (!account.trim() || !pin.trim()) {
      setError('Vui lòng nhập tài khoản và mã PIN.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const role = validateLogin(account, pin);
      if (role) {
        onLogin(role);
      } else {
        setError('Tài khoản hoặc mã PIN không đúng.');
        setLoading(false);
      }
    }, 720);
  }

  /* Quick-fill a demo account */
  function quickFill(demo: typeof DEMO_ACCOUNTS[0]) {
    setAccount(demo.user);
    setPin(demo.pin);
    setError('');
    setQuickRole(demo.role);
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(175deg,#032C2C 0%,#064B4A 35%,#0E7C7B 65%,#1A8E87 85%,#2EAA9F 100%)' }}
    >
      {/* ── Decorative circles ── */}
      <div className="absolute pointer-events-none" style={{ top:-80, right:-60, width:280, height:280, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
      <div className="absolute pointer-events-none" style={{ top:40,  left:-40,  width:180, height:180, borderRadius:'50%', background:'rgba(42,157,143,0.10)' }} />
      <div className="absolute pointer-events-none" style={{ bottom:100, right:-30, width:220, height:220, borderRadius:'50%', background:'rgba(14,124,123,0.07)' }} />

      {/* ── Branding ── */}
      <div className="relative flex flex-col items-center pt-16 pb-8 px-8">
        {/* App icon */}
        <div
          className="flex items-center justify-center rounded-3xl mb-5"
          style={{
            width:80, height:80,
            background: 'rgba(255,255,255,0.18)',
            border:     '2.5px solid rgba(255,255,255,0.30)',
            boxShadow:  '0 12px 36px rgba(0,0,0,0.20)',
          }}
        >
          <svg width="48" height="48" viewBox="0 0 100 100" fill="none">
            <ellipse cx="38" cy="32" rx="16" ry="20" fill="white" opacity="0.90" />
            <rect x="34" y="50" width="8" height="22" rx="4" fill="white" opacity="0.90" />
            <rect x="31" y="68" width="14" height="5" rx="2.5" fill="white" opacity="0.90" />
            <circle cx="64" cy="52" r="18" fill="#F4A261" opacity="0.95" />
            <circle cx="58" cy="46" r="3"   fill="white" />
            <circle cx="68" cy="46" r="3"   fill="white" />
            <circle cx="63" cy="54" r="3"   fill="white" />
            <circle cx="56" cy="56" r="3"   fill="white" />
            <circle cx="70" cy="56" r="3"   fill="white" />
          </svg>
        </div>

        <h1 style={{ fontSize:26, fontWeight:900, color:'white', letterSpacing:'-0.5px' }}>
          VNS PickleTrack
        </h1>
        <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', fontWeight:600, marginTop:4 }}>
          Quản lý học viên &amp; điểm danh Pickleball
        </p>
      </div>

      {/* ── Card ── */}
      <div
        className="relative flex-1 flex flex-col mx-4 mb-8 rounded-3xl overflow-hidden"
        style={{
          background: 'white',
          boxShadow:  '0 24px 64px rgba(0,0,0,0.22)',
          border:     '1px solid rgba(255,255,255,0.80)',
        }}
      >
        {/* Green top accent */}
        <div style={{ height:3, background:'linear-gradient(90deg,#0E7C7B,#2A9D8F 50%,#F4A261)' }} />

        <div className="px-5 pt-5 pb-6 flex-1">
          {/* Title */}
          <p style={{ fontSize:18, fontWeight:900, color:'#1F2933', marginBottom:2 }}>Đăng nhập</p>
          <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:500, marginBottom:20 }}>
            Nhập tài khoản và mã PIN để tiếp tục
          </p>

          {/* Error */}
          {error && (
            <div
              className="flex items-center gap-2.5 px-3.5 py-3 rounded-2xl mb-4"
              style={{ background:'rgba(231,111,81,0.09)', border:'1.5px solid rgba(231,111,81,0.28)' }}
            >
              <AlertCircle style={{ width:15, height:15, color:'#E76F51', flexShrink:0 }} />
              <p style={{ fontSize:12, color:'#C85A3D', fontWeight:600 }}>{error}</p>
            </div>
          )}

          {/* Account input */}
          <div className="mb-3">
            <label style={{ fontSize:11, fontWeight:800, color:'#374151', letterSpacing:'0.04em', display:'block', marginBottom:6 }}>
              TÀI KHOẢN / SỐ ĐIỆN THOẠI
            </label>
            <div className="relative">
              <div
                className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl"
                style={{ width:30, height:30, background:'rgba(14,124,123,0.09)' }}
              >
                <User style={{ width:14, height:14, color:'#0E7C7B' }} />
              </div>
              <input
                type="text"
                value={account}
                onChange={e => { setAccount(e.target.value); setError(''); setQuickRole(null); }}
                placeholder="admin, coach, member, hoặc SĐT"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full rounded-2xl outline-none"
                style={{
                  paddingLeft: 52, paddingRight: 16, paddingTop: 13, paddingBottom: 13,
                  fontSize: 14, color: '#1F2933', fontWeight: 500,
                  background: 'rgba(0,0,0,0.04)', border: '1.5px solid rgba(0,0,0,0.10)',
                  fontFamily: 'inherit',
                  transition: 'border-color 0.15s',
                }}
              />
            </div>
          </div>

          {/* PIN input */}
          <div className="mb-5">
            <label style={{ fontSize:11, fontWeight:800, color:'#374151', letterSpacing:'0.04em', display:'block', marginBottom:6 }}>
              MÃ PIN
            </label>
            <div className="relative">
              <div
                className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl"
                style={{ width:30, height:30, background:'rgba(14,124,123,0.09)' }}
              >
                <Lock style={{ width:14, height:14, color:'#0E7C7B' }} />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={e => { setPin(e.target.value); setError(''); setQuickRole(null); }}
                placeholder="••••••"
                maxLength={6}
                inputMode="numeric"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                className="w-full rounded-2xl outline-none"
                style={{
                  paddingLeft: 52, paddingRight: 48, paddingTop: 13, paddingBottom: 13,
                  fontSize: 14, color: '#1F2933', fontWeight: 500,
                  background: 'rgba(0,0,0,0.04)', border: '1.5px solid rgba(0,0,0,0.10)',
                  fontFamily: 'inherit',
                }}
              />
              <button
                onClick={() => setShowPin(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 active:opacity-60"
              >
                {showPin
                  ? <EyeOff style={{ width:16, height:16, color:'#9CA3AF' }} />
                  : <Eye    style={{ width:16, height:16, color:'#9CA3AF' }} />
                }
              </button>
            </div>
          </div>

          {/* Login button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl active:opacity-80 transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow:  '0 8px 24px rgba(14,124,123,0.38)',
            }}
          >
            {loading ? (
              <>
                <div
                  className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"
                  style={{ borderTopColor:'white' }}
                />
                <span style={{ fontSize:15, fontWeight:900, color:'white' }}>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <div
                  className="flex items-center justify-center rounded-xl"
                  style={{ width:32, height:32, background:'rgba(255,255,255,0.18)' }}
                >
                  <LogIn style={{ width:15, height:15, color:'white' }} />
                </div>
                <span style={{ fontSize:15, fontWeight:900, color:'white' }}>Đăng nhập</span>
              </>
            )}
          </button>

          {/* ── Demo Accounts ── */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px" style={{ background:'rgba(0,0,0,0.07)' }} />
              <span style={{ fontSize:10, color:'#C4C9D4', fontWeight:700, letterSpacing:'0.05em' }}>
                TÀI KHOẢN DEMO
              </span>
              <div className="flex-1 h-px" style={{ background:'rgba(0,0,0,0.07)' }} />
            </div>

            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(demo => {
                const isActive = quickRole === demo.role;
                return (
                  <button
                    key={demo.role}
                    onClick={() => quickFill(demo)}
                    className="flex items-center gap-3 w-full px-3.5 py-3 rounded-2xl text-left active:scale-98 transition-all"
                    style={{
                      background: isActive ? demo.bg : 'rgba(0,0,0,0.03)',
                      border:     `1.5px solid ${isActive ? demo.border : 'rgba(0,0,0,0.07)'}`,
                      boxShadow:  isActive ? `0 4px 16px ${demo.color}22` : 'none',
                    }}
                  >
                    {/* Role icon */}
                    <div
                      className="flex items-center justify-center rounded-xl flex-shrink-0"
                      style={{
                        width:  36, height:36,
                        background: isActive ? demo.bg : 'rgba(0,0,0,0.06)',
                        border: `1.5px solid ${isActive ? demo.border : 'transparent'}`,
                      }}
                    >
                      <demo.Icon style={{ width:16, height:16, color: isActive ? demo.color : '#9CA3AF' }} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize:13, fontWeight:800, color: isActive ? demo.color : '#374151' }}>
                          {demo.label}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded-lg"
                          style={{
                            fontSize: 9, fontWeight: 700,
                            background: isActive ? demo.bg : 'rgba(0,0,0,0.06)',
                            color: isActive ? demo.color : '#9CA3AF',
                          }}
                        >
                          {demo.desc}
                        </span>
                      </div>
                      <p style={{ fontSize:10, color:'#9CA3AF', fontWeight:500, marginTop:1, fontFamily:'monospace' }}>
                        {demo.user} &nbsp;·&nbsp; PIN: {demo.pin}
                      </p>
                    </div>

                    {/* SĐT */}
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontSize:9, color:'#C4C9D4', fontWeight:500, fontFamily:'monospace' }}>
                        {demo.phone}
                      </p>
                      {isActive && (
                        <p style={{ fontSize:9, color: demo.color, fontWeight:700, marginTop:1 }}>
                          ✓ Đã chọn
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 text-center"
          style={{ borderTop:'1px solid rgba(0,0,0,0.06)', background:'rgba(0,0,0,0.02)' }}
        >
          <p style={{ fontSize:10, color:'#C4C9D4', fontWeight:500 }}>
            VNS PickleTrack · Phiên bản 1.0.0 · © 2026 VNS Technology
          </p>
        </div>
      </div>
    </div>
  );
}
