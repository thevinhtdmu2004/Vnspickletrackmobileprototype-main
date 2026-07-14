import {
  User, CloudUpload, FileDown, RotateCcw, Package,
  Users, Sliders, Info, LogOut, ChevronRight,
  Shield, Clock, CheckCircle2, X, Lock, Sparkles,
  AlertCircle, Dumbbell, HelpCircle, FileText
} from 'lucide-react';
import { useState } from 'react';

/* ── Toast notification ── */
type ToastType = 'success' | 'info' | 'warning';
interface Toast { id: number; type: ToastType; message: string }

/* ── Logout confirmation ── */
export function SettingsPage({
  onNavigate,
  role = 'admin',
  onLogout,
}: {
  onNavigate?: (screen: string) => void;
  role?:       'admin' | 'coach' | 'member';
  onLogout?:   () => void;
}) {
  const [toasts, setToasts]           = useState<Toast[]>([]);
  const [showLogout, setShowLogout]   = useState(false);
  const [backingUp, setBackingUp]     = useState(false);
  const [exporting, setExporting]     = useState(false);
  let   toastId                       = 0;

  function pushToast(type: ToastType, message: string) {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }

  function handleBackup() {
    if (backingUp) return;
    setBackingUp(true);
    setTimeout(() => {
      setBackingUp(false);
      pushToast('success', 'Sao lưu dữ liệu thành công!');
    }, 1800);
  }

  function handleExport() {
    if (exporting) return;
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      pushToast('success', 'Đã xuất danh sách học viên CSV');
    }, 1400);
  }

  /* ── data ── */
  const TOAST_CFG: Record<ToastType, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    success: { bg: 'rgba(42,157,143,0.12)', border: 'rgba(42,157,143,0.35)', text: '#0E7C7B', icon: <CheckCircle2 className="w-4 h-4" /> },
    info:    { bg: 'rgba(14,124,123,0.10)', border: 'rgba(14,124,123,0.30)', text: '#0E7C7B', icon: <Info className="w-4 h-4" /> },
    warning: { bg: 'rgba(233,196,106,0.15)', border: 'rgba(233,196,106,0.4)', text: '#A07B10', icon: <Clock className="w-4 h-4" /> },
  };

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ══ Toast stack ══ */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-[340px] pointer-events-none">
        {toasts.map(t => {
          const cfg = TOAST_CFG[t.type];
          return (
            <div
              key={t.id}
              className="flex items-center gap-2.5 px-4 py-3 rounded-2xl border shadow-lg backdrop-blur-sm"
              style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.text }}
            >
              {cfg.icon}
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{t.message}</span>
            </div>
          );
        })}
      </div>

      {/* ══ Logout Dialog ══ */}
      {showLogout && (
        <div className="fixed inset-0 z-40 flex items-end justify-center pb-0" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div
            className="w-full max-w-[390px] bg-card rounded-t-3xl overflow-hidden"
            style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.2)' }}
          >
            {/* handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="px-6 py-4 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(231,111,81,0.12)' }}
              >
                <LogOut className="w-8 h-8 text-destructive" />
              </div>
              <p style={{ fontSize: '17px', fontWeight: 700 }}>Đăng xuất?</p>
              <p className="text-muted-foreground mt-1.5" style={{ fontSize: '13px' }}>
                Bạn sẽ cần đăng nhập lại để sử dụng ứng dụng.
              </p>
            </div>

            <div className="flex gap-3 px-6 pb-8">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-3.5 rounded-2xl border border-border"
                style={{ fontSize: '14px', fontWeight: 600 }}
              >
                Huỷ
              </button>
              <button
                onClick={() => { setShowLogout(false); pushToast('info', 'Đã đăng xuất'); setTimeout(() => onLogout?.(), 800); }}
                className="flex-1 py-3.5 rounded-2xl text-white"
                style={{ fontSize: '14px', fontWeight: 700, background: 'linear-gradient(135deg,#E76F51,#C85A3D)', boxShadow: '0 4px 14px rgba(231,111,81,0.4)' }}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto pb-24">

        {/* ── Header / Account card ── */}
        <div
          className="relative overflow-hidden pb-6"
          style={{ background: 'linear-gradient(150deg, #054A49 0%, #075E5D 50%, #0E7C7B 100%)' }}
        >
          {/* decorative blobs */}
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute top-16 -right-4 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />
          <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full bg-black/8 pointer-events-none" />

          {/* title row */}
          <div className="flex items-center justify-between px-4 pt-10 pb-5">
            <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 800 }}>Cài đặt</h1>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.12)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-white/80" style={{ fontSize: '11px', fontWeight: 600 }}>v1.0.0</span>
            </div>
          </div>

          {/* account card */}
          <div
            className="mx-4 rounded-2xl border border-white/20 overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-center gap-4 p-4">
              {/* avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 border-white/30"
                  style={{ background: 'rgba(255,255,255,0.2)' }}
                >
                  <span className="text-white" style={{ fontSize: '28px', fontWeight: 900 }}>
                    {role === 'coach' ? 'C' : 'A'}
                  </span>
                </div>
                {/* online dot */}
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white bg-emerald-400" />
              </div>

              {/* info */}
              <div className="flex-1">
                <p className="text-white" style={{ fontSize: '18px', fontWeight: 800 }}>
                  {role === 'coach' ? 'Coach Nam' : 'Admin'}
                </p>
                <p className="text-white/55" style={{ fontSize: '12px' }}>
                  {role === 'coach' ? 'coach@vnspickletrack.com' : 'admin@vnspickletrack.com'}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full"
                    style={{ background: 'rgba(244,162,97,0.25)', fontSize: '11px', fontWeight: 700, color: '#FFD4A8' }}
                  >
                    {role === 'coach'
                      ? <><Dumbbell className="w-3 h-3" /> Huấn luyện viên</>
                      : <><Shield className="w-3 h-3" /> Quản trị viên</>
                    }
                  </span>
                </div>
              </div>

              <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25">
                <ChevronRight className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4 pt-5 space-y-5">

          {/* ══ ADMIN ONLY SECTIONS ══ */}
          {role === 'admin' && (
            <>
              {/* ── Dữ liệu ── */}
              <SettingsSection label="Dữ liệu">
                <SettingsItem
                  icon={<CloudUpload style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(14,124,123,0.14)" iconColor="#0E7C7B"
                  label="Sao lưu dữ liệu" sub="Lần cuối: 29/04/2026 — 08:30"
                  loading={backingUp} loadingLabel="Đang lưu..."
                  onClick={() => onNavigate ? onNavigate('backup') : handleBackup()}
                  isLast={false}
                />
                <SettingsItem
                  icon={<FileDown style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(42,157,143,0.14)" iconColor="#2A9D8F"
                  label="Xuất danh sách học viên" sub="Định dạng CSV — tương thích Excel"
                  loading={exporting} loadingLabel="Đang xuất..."
                  onClick={() => onNavigate?.('export-csv')}
                  isLast={false}
                />
                <SettingsItem
                  icon={<RotateCcw style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(244,162,97,0.14)" iconColor="#F4A261"
                  label="Khôi phục dữ liệu" sub="Khôi phục từ bản sao lưu"
                  onClick={() => onNavigate?.('restore-data')}
                  badge="Sắp có" isLast
                />
              </SettingsSection>

              {/* ── Cấu hình ── */}
              <SettingsSection label="Cấu hình">
                <SettingsItem
                  icon={<Package style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(244,162,97,0.15)" iconColor="#F4A261"
                  label="Gói học" sub="Quản lý các gói học viên"
                  onClick={() => onNavigate?.('package-management')}
                  isLast={false}
                />
                <SettingsItem
                  icon={<Users style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(129,90,213,0.14)" iconColor="#815AD5"
                  label="Người dùng" sub="Admin & Coach trong hệ thống"
                  onClick={() => onNavigate?.('user-management')}
                  isLast={false}
                />
                <SettingsItem
                  icon={<Sliders style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(156,163,175,0.14)" iconColor="#9CA3AF"
                  label="Quy tắc trừ buổi" sub="Cấu hình cách tính điểm danh"
                  disabled badge="Sắp có" isLast
                />
              </SettingsSection>

              {/* ── Tài khoản Admin ── */}
              <SettingsSection label="Tài khoản">
                <SettingsItem
                  icon={<Lock style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(14,124,123,0.14)" iconColor="#0E7C7B"
                  label="Đổi mã PIN" sub="Cập nhật mã PIN bảo mật"
                  onClick={() => onNavigate?.('change-pin')}
                  isLast
                />
              </SettingsSection>

              {/* ── Ứng dụng (Admin) ── */}
              <SettingsSection label="Ứng dụng & Tài liệu">
                <SettingsItem
                  icon={<Sparkles style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(129,90,213,0.14)" iconColor="#815AD5"
                  label="Component Library" sub="Design system — 11 components"
                  onClick={() => onNavigate?.('component-library')}
                  isLast={false}
                />
                <SettingsItem
                  icon={<Shield style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(14,124,123,0.14)" iconColor="#0E7C7B"
                  label="Developer Handoff" sub=".NET MAUI · Screens · Tokens · XAML"
                  onClick={() => onNavigate?.('dev-handoff')}
                  isLast={false}
                />
                <SettingsItem
                  icon={<FileText style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(38,70,83,0.14)" iconColor="#264653"
                  label="Screen Flow Document" sub="Sitemap · Flows · Permission Matrix"
                  onClick={() => onNavigate?.('screen-flow-doc')}
                  isLast={false}
                />
                <SettingsItem
                  icon={<AlertCircle style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(231,111,81,0.12)" iconColor="#E76F51"
                  label="Dialog xác nhận" sub="Demo 6 loại dialog quan trọng"
                  onClick={() => onNavigate?.('confirm-dialogs')}
                  isLast={false}
                />
                {/* Version info */}
                <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-border/60">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,124,123,0.10)' }}>
                    <Info style={{ width: 18, height: 18, color: '#0E7C7B' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Phiên bản</p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>VNS PickleTrack</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl" style={{ fontSize: '12px', fontWeight: 700, background: 'rgba(14,124,123,0.10)', color: '#0E7C7B' }}>1.0.0</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Phát triển bởi</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>VNS Technology</span>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-muted-foreground" style={{ fontSize: '13px' }}>Cập nhật lần cuối</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>30/04/2026</span>
                </div>
              </SettingsSection>
            </>
          )}

          {/* ══ COACH ONLY SECTIONS ══ */}
          {role === 'coach' && (
            <>
              {/* ── Tài khoản Coach ── */}
              <SettingsSection label="Tài khoản">
                {/* Thông tin tài khoản — display only */}
                <div className="flex items-center gap-3.5 px-4 py-3.5 border-b border-border/60">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(38,70,83,0.12)' }}>
                    <User style={{ width: 18, height: 18, color: '#264653' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Thông tin tài khoản</p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Coach Nam · Lớp Beginner A, Intermediate B</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full" style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(38,70,83,0.10)', color: '#264653' }}>Chỉ xem</span>
                </div>
                <SettingsItem
                  icon={<Lock style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(14,124,123,0.14)" iconColor="#0E7C7B"
                  label="Đổi mã PIN" sub="Cập nhật mã PIN bảo mật"
                  onClick={() => onNavigate?.('change-pin')}
                  isLast
                />
              </SettingsSection>

              {/* ── Trợ giúp ── */}
              <SettingsSection label="Trợ giúp">
                <SettingsItem
                  icon={<HelpCircle style={{ width: 18, height: 18 }} />}
                  iconBg="rgba(244,162,97,0.14)" iconColor="#F4A261"
                  label="Hướng dẫn sử dụng" sub="Hướng dẫn điểm danh, xem lớp"
                  disabled badge="Sắp có" isLast={false}
                />
                <div className="flex items-center gap-3.5 px-4 py-3.5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,124,123,0.10)' }}>
                    <Info style={{ width: 18, height: 18, color: '#0E7C7B' }} />
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '14px', fontWeight: 600 }}>Phiên bản</p>
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>VNS PickleTrack v1.0.0</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl" style={{ fontSize: '12px', fontWeight: 700, background: 'rgba(14,124,123,0.10)', color: '#0E7C7B' }}>1.0.0</span>
                </div>
              </SettingsSection>
            </>
          )}

          {/* ══ Nút đăng xuất (Admin & Coach) ══ */}
          <button
            onClick={() => setShowLogout(true)}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl border active:scale-[0.98] transition-all"
            style={{ background: 'rgba(231,111,81,0.08)', borderColor: 'rgba(231,111,81,0.28)' }}
          >
            <LogOut style={{ width: 18, height: 18, color: '#E76F51' }} />
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#E76F51' }}>Đăng xuất</span>
          </button>

          {/* ── Footer ── */}
          <p className="text-center text-muted-foreground pb-2" style={{ fontSize: '11px' }}>
            © 2026 VNS Technology · VNS PickleTrack v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── reusable section wrapper ── */
function SettingsSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        className="text-muted-foreground px-1 mb-2"
        style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}
      >
        {label}
      </p>
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );
}

/* ── reusable list item ── */
interface SettingsItemProps {
  icon:         React.ReactNode;
  iconBg:       string;
  iconColor:    string;
  label:        string;
  sub:          string;
  disabled?:    boolean;
  badge?:       string;
  onClick?:     () => void;
  loading?:     boolean;
  loadingLabel?: string;
  isLast:       boolean;
}

function SettingsItem({
  icon, iconBg, iconColor, label, sub,
  disabled, badge, onClick, loading, loadingLabel, isLast,
}: SettingsItemProps) {
  return (
    <div
      className={`flex items-center gap-3.5 px-4 py-3.5 ${!isLast ? 'border-b border-border/60' : ''} ${disabled ? 'opacity-50' : ''} ${onClick && !disabled ? 'active:bg-muted/40 cursor-pointer' : ''} transition-colors`}
      onClick={!disabled ? onClick : undefined}
    >
      {/* icon box */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: disabled ? 'rgba(156,163,175,0.14)' : iconBg, color: disabled ? '#9CA3AF' : iconColor }}
      >
        {icon}
      </div>

      {/* text */}
      <div className="flex-1 min-w-0">
        <p style={{ fontSize: '14px', fontWeight: 600 }}>{label}</p>
        <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
          {loading ? loadingLabel : sub}
        </p>
      </div>

      {/* right side */}
      {badge ? (
        <span
          className="px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(233,196,106,0.2)', color: '#A07B10', border: '1px solid rgba(233,196,106,0.4)' }}
        >
          {badge}
        </span>
      ) : loading ? (
        <div
          className="w-5 h-5 rounded-full border-2 border-t-transparent flex-shrink-0 animate-spin"
          style={{ borderColor: `${iconColor}40`, borderTopColor: iconColor }}
        />
      ) : onClick ? (
        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      ) : null}
    </div>
  );
}
