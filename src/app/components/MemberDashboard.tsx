/**
 * MemberDashboard — VNS PickleTrack
 * Trang chủ Hội viên · Android 390 × 844
 */
import { useState } from 'react';
import {
  Bell, Calendar, Clock, MapPin, ChevronRight,
  TrendingUp, BookOpen, MessageCircle, Check,
  RefreshCw, AlertTriangle, User, Award, Percent,
  XCircle, PlusCircle, FileText, Video, Info, ShoppingCart
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   MOCK DATA
   ══════════════════════════════════════════════════════ */
const MEMBER = {
  name: 'Nguyễn Văn A',
  initials: 'NA',
  role: 'Hội viên Pickleball',
  remaining: 7,
  total: 12,
  packageName: 'Gói 12 buổi',
  status: 'active' as 'active' | 'suspended' | 'quit',
};

const NEXT_CLASS = {
  className: 'Beginner A',
  dayLabel: 'Thứ Tư',
  date: '29/04/2026',
  dayNum: '29',
  month: 'Th.4',
  timeStart: '18:00',
  timeEnd: '19:30',
  court: 'Sân 1',
  coach: 'Coach Nam',
};

const MONTHLY_STATS = [
  { label: 'Đã học tháng này', value: 5, unit: 'buổi', icon: BookOpen, color: '#0E7C7B', bg: 'rgba(14,124,123,0.09)' },
  { label: 'Tỷ lệ tham gia', value: '90', unit: '%', icon: Percent, color: '#2A9D8F', bg: 'rgba(42,157,143,0.09)' },
  { label: 'Buổi nghỉ', value: 1, unit: 'buổi', icon: XCircle, color: '#6B7280', bg: 'rgba(107,114,128,0.10)' },
];

/* Status config */
const STATUS_CFG = {
  active: { label: 'Đang học', color: '#2A9D8F', bg: 'rgba(42,157,143,0.15)', dot: '#2A9D8F' },
  suspended: { label: 'Tạm nghỉ', color: '#E9C46A', bg: 'rgba(233,196,106,0.20)', dot: '#E9C46A' },
  quit: { label: 'Đã nghỉ', color: '#E76F51', bg: 'rgba(231,111,81,0.15)', dot: '#E76F51' },
};

/* Sessions remaining urgency */
function getSessionUrgency(n: number) {
  if (n === 0) return { color: '#E76F51', gradient: 'linear-gradient(135deg,#C62828 0%,#E76F51 100%)', shadow: 'rgba(231,111,81,0.40)', label: 'Đã hết buổi!', alertBg: 'rgba(231,111,81,0.15)', alertBorder: 'rgba(231,111,81,0.35)', alertColor: '#C85A3D' };
  if (n <= 2) return { color: '#E76F51', gradient: 'linear-gradient(135deg,#C62828 0%,#E76F51 100%)', shadow: 'rgba(231,111,81,0.38)', label: 'Sắp hết buổi', alertBg: 'rgba(231,111,81,0.12)', alertBorder: 'rgba(231,111,81,0.30)', alertColor: '#C85A3D' };
  if (n <= 5) return { color: '#F4A261', gradient: 'linear-gradient(135deg,#E76F51 0%,#F4A261 100%)', shadow: 'rgba(244,162,97,0.35)', label: 'Sắp hết — gia hạn sớm', alertBg: 'rgba(244,162,97,0.12)', alertBorder: 'rgba(244,162,97,0.30)', alertColor: '#9E5A00' };
  return { color: '#2A9D8F', gradient: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)', shadow: 'rgba(14,124,123,0.30)', label: '', alertBg: '', alertBorder: '', alertColor: '' };
}

/* ══════════════════════════════════════════════════════
   PROPS
   ══════════════════════════════════════════════════════ */
interface MemberDashboardProps {
  onNavigate: (screen: string) => void;
  onNotification?: () => void;
  hasActivePackage?: boolean;
  setHasActivePackage?: (val: boolean) => void;
  notifications?: any[];
  unreadNotifications?: boolean;
  onMarkNotificationsAsRead?: () => void;
  onOpenCart?: () => void;
  cartItemsCount?: number;
}

/* ══════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════ */
export function MemberDashboard({
  onNavigate,
  hasActivePackage = true,
  setHasActivePackage,
  notifications = [],
  unreadNotifications = false,
  onMarkNotificationsAsRead,
  onOpenCart = () => {},
  cartItemsCount = 0
}: MemberDashboardProps) {
  const urgency = getSessionUrgency(MEMBER.remaining);
  const progress = MEMBER.remaining / MEMBER.total;   // remaining / total
  const isLow = MEMBER.remaining <= 5;
  const isCritical = MEMBER.remaining <= 2;

  const [showNotifications, setShowNotifications] = useState(false);
  const [lockedAlert, setLockedAlert] = useState<string | null>(null);

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    if (onMarkNotificationsAsRead) {
      onMarkNotificationsAsRead();
    }
  };

  const handleActionClick = (screen: string, label: string) => {
    // Check if the action belongs to student specific features (locked for non-active package members)
    const isStudentFeature = ['member-learning-progress', 'member-schedule', 'member-attendance-history', 'member-makeup-register', 'member-course-materials'].includes(screen);
    
    if (isStudentFeature && !hasActivePackage) {
      setLockedAlert(`Tính năng "${label}" chỉ dành cho Học viên đang học. Bạn cần mua gói tập tại tab Gói Học để mở khóa tính năng này!`);
      return;
    }
    
    if (screen === 'member-attendance-history') {
      onNavigate('member-schedule'); // Redirect merged history to schedule (tab 2)
    } else {
      onNavigate(screen);
    }
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F0F4F5' }}>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 30%,#075E5D 60%,#0E7C7B 85%,#1A8E87 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute pointer-events-none" style={{ top: -36, right: -28, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.045)' }} />
        <div className="absolute pointer-events-none" style={{ top: 10, right: 36, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: -16, left: -12, width: 110, height: 110, borderRadius: '50%', background: 'rgba(42,157,143,0.10)' }} />

        <div className="relative px-5 pt-14 pb-6">
          <div className="flex items-center justify-between">

            {/* Left: avatar + greeting */}
            <div className="flex items-center gap-3.5">
              <div
                className="flex items-center justify-center rounded-2xl flex-shrink-0"
                style={{
                  width: 52, height: 52,
                  background: 'rgba(255,255,255,0.20)',
                  border: '2.5px solid rgba(255,255,255,0.35)',
                  fontSize: 16, fontWeight: 900, color: 'white',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
                  letterSpacing: '0.02em',
                }}
              >
                {MEMBER.initials}
              </div>

              <div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)', fontWeight: 600, lineHeight: 1.3 }}>
                  Xin chào 👋
                </p>
                <p style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
                  {MEMBER.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Award style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.5)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
                    {hasActivePackage ? 'Học viên active' : 'Hội viên chưa có gói'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: cart and bell */}
            <div className="flex gap-2">
              <button
                onClick={onOpenCart}
                className="relative flex items-center justify-center rounded-2xl active:scale-90 transition-transform"
                style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.22)' }}
              >
                <ShoppingCart style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.85)' }} />
                {cartItemsCount > 0 && (
                  <span
                    className="absolute flex items-center justify-center rounded-full text-[9px] font-black text-white bg-red-500 animate-pulse"
                    style={{ top: -4, right: -4, width: 18, height: 18, border: '1.5px solid #075E5D' }}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleOpenNotifications}
                className="relative flex items-center justify-center rounded-2xl active:scale-90 transition-transform"
                style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.22)' }}
              >
                <Bell style={{ width: 20, height: 20, color: 'rgba(255,255,255,0.85)' }} />
                {unreadNotifications && (
                  <span
                    className="absolute flex items-center justify-center rounded-full"
                    style={{ top: 10, right: 10, width: 8, height: 8, background: '#EF4444', border: '1.5px solid #075E5D' }}
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SCROLLABLE BODY */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-4 pt-4 space-y-4">

          {/* UAT Simulator Controls */}
          {setHasActivePackage && (
            <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-amber-900">UAT Simulator: Trạng thái gói học</p>
                  <p className="text-[10px] text-amber-700">Chuyển đổi trạng thái gói học để test luồng Hội viên vs Học viên</p>
                </div>
                <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-lg">Demo</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setHasActivePackage(false)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                    !hasActivePackage
                      ? 'bg-amber-700 border-amber-700 text-white shadow-sm'
                      : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-100/50'
                  }`}
                >
                  Chưa có gói (Hội viên)
                </button>
                <button
                  onClick={() => setHasActivePackage(true)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                    hasActivePackage
                      ? 'bg-teal-700 border-teal-700 text-white shadow-sm'
                      : 'bg-white border-teal-200 text-teal-800 hover:bg-teal-50'
                  }`}
                >
                  Có gói học (Học viên)
                </button>
              </div>
            </div>
          )}

          {/* Locked status banner if has no active package */}
          {!hasActivePackage && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-3xl flex gap-3.5 shadow-sm">
              <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
              <div>
                <h4 className="text-xs font-bold text-red-950">Bạn chưa đăng ký gói học</h4>
                <p className="text-[11px] text-red-800 leading-normal mt-0.5 font-medium">
                  Hãy đăng ký gói tập tại mục **Gói học** để được xếp lớp, xem lịch học bù, lịch sử điểm danh, giáo trình và tài liệu học tập của học viên!
                </p>
                <button
                  onClick={() => onNavigate('member-package')}
                  className="mt-2.5 bg-red-600 hover:bg-red-750 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg"
                >
                  Đăng ký gói ngay
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────
              BUỔI HỌC TIẾP THEO (CLASS CARD)
          ───────────────────────────────────────── */}
          {hasActivePackage && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em', marginBottom: 10 }}>
                BUỔI HỌC TIẾP THEO
              </p>

              <div
                className="bg-white rounded-3xl overflow-hidden shadow-sm"
                style={{ border: '1.5px solid rgba(0,0,0,0.06)' }}
              >
                <div style={{ height: 4, background: 'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 100%)' }} />
                <div className="p-5 flex items-stretch justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <span className="bg-teal-50 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Lớp: {NEXT_CLASS.className}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: '#1F2933', marginTop: 8 }}>
                      {NEXT_CLASS.dayLabel}, ngày {NEXT_CLASS.date}
                    </h3>
                    <div className="space-y-1.5 mt-3">
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                        <Clock size={13} className="text-teal-600" />
                        <span>{NEXT_CLASS.timeStart} – {NEXT_CLASS.timeEnd}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 font-semibold">
                        <MapPin size={13} className="text-teal-600" />
                        <span>{NEXT_CLASS.court} · {NEXT_CLASS.coach}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center pr-1 flex-shrink-0">
                    <div className="bg-teal-50 rounded-2xl w-14 h-14 flex flex-col items-center justify-center border border-teal-100">
                      <span className="text-[10px] text-teal-800 font-bold">Tháng 4</span>
                      <span className="text-2xl font-black text-teal-800 leading-none">{NEXT_CLASS.dayNum}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────
              GÓI HỌC CARD
          ───────────────────────────────────────── */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em', marginBottom: 10 }}>
              THÔNG TIN SỐ BUỔI
            </p>

            {hasActivePackage ? (
              <div
                className="rounded-3xl p-5 text-white relative overflow-hidden"
                style={{
                  background: urgency.gradient,
                  boxShadow: `0 8px 20px ${urgency.shadow}`,
                }}
              >
                <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)', transform: 'translate(20px, -20px)' }} />
                
                <div className="relative z-10 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-md uppercase tracking-wider">
                      {MEMBER.packageName}
                    </span>
                    <h3 style={{ fontSize: 24, fontWeight: 900, marginTop: 8, letterSpacing: '-0.5px' }}>
                      Còn {MEMBER.remaining} / {MEMBER.total} <span className="text-xs font-bold opacity-80">buổi học</span>
                    </h3>
                    <p style={{ fontSize: 11, opacity: 0.85, marginTop: 4, fontWeight: 500 }}>
                      Thời gian học: Thứ 3 & Thứ 6 (18:00)
                    </p>
                  </div>
                  <button
                    onClick={() => onNavigate('member-package')}
                    className="bg-white text-teal-900 rounded-full w-10 h-10 flex items-center justify-center active:scale-90 transition-transform shadow"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                    <div className="bg-white h-full rounded-full" style={{ width: `${progress * 100}%` }} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-5 border border-gray-150 flex items-center justify-between shadow-sm">
                <div>
                  <p className="text-xs font-bold text-gray-800">Chưa đăng ký gói tập</p>
                  <p className="text-[10px] text-gray-400 mt-1">Vui lòng chọn mua gói tập phía dưới</p>
                </div>
                <button
                  onClick={() => onNavigate('member-package')}
                  className="bg-teal-100 text-teal-800 text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-teal-200"
                >
                  Mua gói
                </button>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────
              QUICK ACTIONS
          ───────────────────────────────────────── */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em', marginBottom: 10 }}>
              THAO TÁC NHANH
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Quá trình học',
                  sub: 'Cập nhật video buổi học',
                  icon: Video,
                  iconBg: 'rgba(42,157,143,0.12)',
                  iconColor: '#2A9D8F',
                  border: 'rgba(42,157,143,0.25)',
                  screen: 'member-learning-progress',
                },
                {
                  label: 'Xem lịch học',
                  sub: 'Lịch Thứ 3 & Thứ 6',
                  icon: Calendar,
                  iconBg: 'rgba(14,124,123,0.10)',
                  iconColor: '#0E7C7B',
                  border: 'rgba(14,124,123,0.18)',
                  screen: 'member-schedule',
                },
                {
                  label: 'Lịch sử học',
                  sub: 'Điểm danh chi tiết',
                  icon: TrendingUp,
                  iconBg: 'rgba(42,157,143,0.10)',
                  iconColor: '#2A9D8F',
                  border: 'rgba(42,157,143,0.18)',
                  screen: 'member-attendance-history',
                },
                {
                  label: hasActivePackage ? 'Yêu cầu gia hạn' : 'Đăng ký gói học',
                  sub: hasActivePackage ? 'Mua thêm buổi học' : 'Xem các gói học tập',
                  icon: RefreshCw,
                  iconBg: 'rgba(244,162,97,0.14)',
                  iconColor: '#E8832A',
                  border: 'rgba(244,162,97,0.30)',
                  screen: hasActivePackage ? 'member-renew-request' : 'member-package',
                },
                {
                  label: 'Liên hệ Coach',
                  sub: 'Gửi tin nhắn',
                  icon: MessageCircle,
                  iconBg: 'rgba(129,90,213,0.10)',
                  iconColor: '#815AD5',
                  border: 'rgba(129,90,213,0.20)',
                  screen: 'member-contact',
                },
                {
                  label: 'Đăng ký học bù',
                  sub: 'Sử dụng buổi vắng',
                  icon: PlusCircle,
                  iconBg: 'rgba(231,111,81,0.10)',
                  iconColor: '#E76F51',
                  border: 'rgba(231,111,81,0.18)',
                  screen: 'member-makeup-register',
                },
                {
                  label: 'Tài liệu khóa học',
                  sub: 'Giáo trình & Video',
                  icon: FileText,
                  iconBg: 'rgba(14,124,123,0.10)',
                  iconColor: '#0E7C7B',
                  border: 'rgba(14,124,123,0.18)',
                  screen: 'member-course-materials',
                },
                {
                  label: 'Khám phá khóa học',
                  sub: 'Đăng ký lớp học mới',
                  icon: BookOpen,
                  iconBg: 'rgba(14,124,123,0.10)',
                  iconColor: '#0E7C7B',
                  border: 'rgba(14,124,123,0.18)',
                  screen: 'member-course-list',
                },
              ].filter(action => {
                const isStudent = ['member-learning-progress', 'member-schedule', 'member-attendance-history', 'member-makeup-register', 'member-course-materials'].includes(action.screen);
                return !(isStudent && !hasActivePackage);
              }).map((action, i) => {
                const isStudent = ['member-learning-progress', 'member-schedule', 'member-attendance-history', 'member-makeup-register', 'member-course-materials'].includes(action.screen);
                const isLocked = isStudent && !hasActivePackage;

                return (
                  <button
                    key={i}
                    onClick={() => handleActionClick(action.screen, action.label)}
                    className="flex flex-col gap-3 p-4 bg-white rounded-2xl text-left active:scale-95 transition-all relative overflow-hidden"
                    style={{
                      border: `1.5px solid ${isLocked ? 'rgba(0,0,0,0.04)' : action.border}`,
                      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                      opacity: isLocked ? 0.45 : 1,
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width: 40, height: 40, background: action.iconBg }}
                    >
                      <action.icon style={{ width: 18, height: 18, color: action.iconColor }} />
                    </div>
                    {/* Label */}
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 800, color: '#1F2933', lineHeight: 1.25 }}>
                        {action.label}
                      </p>
                      <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500, marginTop: 2 }}>
                        {action.sub}
                      </p>
                    </div>

                    {isLocked && (
                      <span className="absolute top-2 right-2 bg-gray-100 text-gray-500 rounded text-[8px] font-bold px-1.5 py-0.5">
                        Khóa
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────
              THỐNG KÊ THÁNG NÀY
          ───────────────────────────────────────── */}
          {hasActivePackage && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                  THÁNG NÀY
                </p>
                <button
                  onClick={() => handleActionClick('member-attendance-history', 'Lịch sử học')}
                  className="flex items-center gap-1 active:opacity-60"
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#0E7C7B' }}>Chi tiết</span>
                  <ChevronRight style={{ width: 13, height: 13, color: '#0E7C7B' }} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {MONTHLY_STATS.map((stat, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl px-3 py-3 text-center"
                    style={{
                      border: '1px solid rgba(0,0,0,0.06)',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-xl mx-auto mb-2"
                      style={{ width: 32, height: 32, background: stat.bg }}
                    >
                      <stat.icon style={{ width: 14, height: 14, color: stat.color }} />
                    </div>
                    <p className="text-sm font-black text-gray-800 leading-none">
                      {stat.value}
                      <span className="text-[10px] font-semibold text-gray-400 ml-0.5">{stat.unit}</span>
                    </p>
                    <p className="text-[9px] font-bold text-gray-400 mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════
          NOTIFICATION BOTTOM SHEET
      ════════════════════════════════════════ */}
      {showNotifications && (
        <div
          className="absolute inset-0 z-50 flex flex-col justify-end"
          style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(3px)' }}
          onClick={() => setShowNotifications(false)}
        >
          <div
            className="bg-white rounded-t-[32px] overflow-hidden animate-in slide-in-from-bottom duration-300"
            style={{ maxHeight: '80%', boxShadow: '0 -10px 30px rgba(0,0,0,0.15)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* drag bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1.5 rounded-full bg-gray-200" />
            </div>

            <div className="px-5 pb-8">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mt-1 mb-4">
                <h3 className="font-black text-teal-900 text-base">Thông báo của bạn</h3>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded-lg">
                  {notifications.length} thông báo
                </span>
              </div>

              {notifications.length === 0 ? (
                <div className="py-10 text-center text-gray-400 text-xs font-semibold">
                  Hộp thư thông báo đang trống.
                </div>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {notifications.map(notif => (
                    <div
                      key={notif.id}
                      className="p-3.5 rounded-2xl flex gap-3 border border-gray-100"
                      style={{
                        background: notif.unread ? 'rgba(14,124,123,0.04)' : 'white',
                        borderColor: notif.unread ? 'rgba(14,124,123,0.15)' : 'rgba(0,0,0,0.05)',
                      }}
                    >
                      <span className="text-xl mt-0.5">{notif.icon || '🔔'}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-800 leading-normal">
                          {notif.message}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-1 font-semibold">
                          {notif.time}
                        </p>
                      </div>
                      {notif.unread && (
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setShowNotifications(false)}
                className="w-full mt-6 bg-teal-700 active:bg-teal-800 text-white font-bold py-3.5 rounded-2xl text-xs active:scale-95 transition-transform"
              >
                Đóng thông báo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          LOCKED ALERT DIALOG
      ════════════════════════════════════════ */}
      {lockedAlert && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm"
          onClick={() => setLockedAlert(null)}
        >
          <div
            className="bg-white rounded-3xl p-5 w-full max-w-[320px] shadow-2xl relative space-y-4 text-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-800 text-sm">Tính năng bị hạn chế</h3>
              <p className="text-[11px] text-gray-500 leading-normal mt-2">
                {lockedAlert}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setLockedAlert(null)}
                className="flex-1 bg-gray-100 active:bg-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-xs transition-transform"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  setLockedAlert(null);
                  onNavigate('member-package');
                }}
                className="flex-1 bg-teal-700 active:bg-teal-800 text-white font-bold py-2.5 rounded-xl text-xs transition-transform"
              >
                Mua gói học
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}