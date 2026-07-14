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
  notifications = [],
  unreadNotifications = false,
  onMarkNotificationsAsRead,
  onOpenCart = () => {},
  cartItemsCount = 0
}: MemberDashboardProps) {
  const member = hasActivePackage ? {
    name: 'Nguyễn Văn A',
    initials: 'NA',
    role: 'Học viên Pickleball',
    remaining: 7,
    total: 12,
    packageName: 'Gói 12 buổi',
    status: 'active' as const,
  } : {
    name: 'Nguyễn Hội Viên',
    initials: 'HV',
    role: 'Hội viên Pickleball',
    remaining: 0,
    total: 0,
    packageName: 'Chưa đăng ký gói',
    status: 'active' as const,
  };

  const urgency = getSessionUrgency(member.remaining);
  const progress = member.total > 0 ? member.remaining / member.total : 0;

  const [showNotifications, setShowNotifications] = useState(false);

  const handleOpenNotifications = () => {
    setShowNotifications(true);
    if (onMarkNotificationsAsRead) {
      onMarkNotificationsAsRead();
    }
  };

  const handleActionClick = (screen: string) => {
    if (screen === 'member-attendance-history') {
      onNavigate('member-schedule');
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
                {member.initials}
              </div>

              <div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.52)', fontWeight: 600, lineHeight: 1.3 }}>
                  Xin chào 👋
                </p>
                <p style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1.25, letterSpacing: '-0.3px' }}>
                  {member.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Award style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.5)' }} />
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>
                    {hasActivePackage ? 'Học viên active' : 'Hội viên'}
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

          {/* Gói học card */}

          {/* ─────────────────────────────────────────
              BANNER QUẢNG CÁO / HỌC THỬ
          ───────────────────────────────────────── */}
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('member-trial-register')}
              className="w-full relative overflow-hidden rounded-[28px] text-left active:scale-[0.99] transition-transform"
              style={{
                background: 'linear-gradient(135deg, #111827 0%, #312E81 45%, #7C3AED 100%)',
                boxShadow: '0 16px 36px rgba(49,46,129,0.22)',
              }}
            >
              <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.34), transparent 32%), radial-gradient(circle at bottom left, rgba(34,211,238,0.24), transparent 28%)' }} />
              <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-white/12 blur-2xl" />
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-fuchsia-400/20 blur-2xl" />
              <div className="relative p-5 text-white">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/14 text-[10px] font-bold tracking-wide border border-white/15 backdrop-blur-sm">
                      <Calendar size={10} />
                      Học thử 1 ngày
                    </div>
                    <h3 className="mt-3 text-[18px] font-black leading-tight tracking-[-0.02em]">
                      Trải nghiệm Pickleball, đặt lịch trong 30 giây
                    </h3>
                    <p className="mt-1 text-[12px] text-white/78 font-medium leading-relaxed max-w-[230px]">
                      Lớp học thử thiết kế hiện đại, linh hoạt, phù hợp người mới bắt đầu.
                    </p>
                  </div>
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-[12px] font-bold text-white/90">
                  Đăng ký ngay
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>

            <button
              onClick={() => onNavigate('member-course-list')}
              className="w-full relative overflow-hidden rounded-[28px] bg-white text-left active:scale-[0.99] transition-transform"
              style={{
                border: '1px solid rgba(168,85,247,0.14)',
                boxShadow: '0 14px 32px rgba(15,23,42,0.08)',
              }}
            >
              <div className="absolute inset-0 opacity-80" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.05), rgba(236,72,153,0.05) 45%, rgba(251,191,36,0.08))' }} />
              <div className="h-[3px] bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400" />
              <div className="relative p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-fuchsia-50 text-fuchsia-700 text-[10px] font-black tracking-wide border border-fuchsia-100">
                      <BookOpen size={10} />
                      Khóa học nổi bật
                    </div>
                    <h3 className="mt-3 text-[17px] font-black text-slate-900 leading-tight tracking-[-0.02em]">
                      Khám phá lộ trình học phù hợp với bạn
                    </h3>
                    <p className="mt-1 text-[12px] text-slate-500 font-medium leading-relaxed max-w-[230px]">
                      Xem lịch khai giảng, cấp độ, ưu đãi và chọn lớp học ngay trên mobile.
                    </p>
                  </div>
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-fuchsia-100 via-pink-100 to-amber-100 flex items-center justify-center border border-white/70">
                    <ShoppingCart className="w-6 h-6 text-fuchsia-700" />
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
                    <Info className="w-3.5 h-3.5 text-fuchsia-500" />
                    Cập nhật liên tục
                  </div>
                  <div className="inline-flex items-center gap-1 text-[12px] font-bold text-fuchsia-700">
                    Xem ngay
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          </div>

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
          {hasActivePackage && (
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em', marginBottom: 10 }}>
                THÔNG TIN SỐ BUỔI
              </p>

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
                      {member.packageName}
                    </span>
                    <h3 style={{ fontSize: 24, fontWeight: 900, marginTop: 8, letterSpacing: '-0.5px' }}>
                      Còn {member.remaining} / {member.total} <span className="text-xs font-bold opacity-80">buổi học</span>
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
            </div>
          )}

          
          {/* ─────────────────────────────────────────
              QUICK ACTIONS
              ═══════════════════════════════════════ */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em', marginBottom: 10 }}>
              THAO TÁC NHANH
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Giữ chỗ sân',
                  sub: 'Giữ sân Pickleball nhanh',
                  icon: Calendar,
                  iconBg: 'rgba(14,124,123,0.10)',
                  iconColor: '#0E7C7B',
                  border: 'rgba(14,124,123,0.18)',
                  screen: 'member-court-booking',
                },
                {
                  label: 'Quá trình học',
                  sub: 'Cập nhật video buổi học',
                  icon: Video,
                  iconBg: 'rgba(42,157,143,0.12)',
                  iconColor: '#2A9D8F',
                  border: 'rgba(42,157,143,0.25)',
                  screen: 'member-learning-progress',
                  studentOnly: true,
                },
                {
                  label: 'Xem lịch học',
                  sub: 'Lịch Thứ 3 & Thứ 6',
                  icon: Calendar,
                  iconBg: 'rgba(14,124,123,0.10)',
                  iconColor: '#0E7C7B',
                  border: 'rgba(14,124,123,0.18)',
                  screen: 'member-schedule',
                  studentOnly: true,
                },
                {
                  label: 'Lịch sử học',
                  sub: 'Điểm danh chi tiết',
                  icon: TrendingUp,
                  iconBg: 'rgba(42,157,143,0.10)',
                  iconColor: '#2A9D8F',
                  border: 'rgba(42,157,143,0.18)',
                  screen: 'member-attendance-history',
                  studentOnly: true,
                },
                {
                  label: hasActivePackage ? 'Gia hạn gói học' : 'Gói hội viên của tôi',
                  sub: hasActivePackage ? 'Mua thêm buổi học' : 'Xem chi tiết & gia hạn',
                  icon: RefreshCw,
                  iconBg: 'rgba(244,162,97,0.14)',
                  iconColor: '#E8832A',
                  border: 'rgba(244,162,97,0.30)',
                  screen: hasActivePackage ? 'member-package' : 'member-membership-overview',
                },
                {
                  label: hasActivePackage ? 'Liên hệ Coach' : 'Liên hệ Admin',
                  sub: hasActivePackage ? 'Gửi tin nhắn' : 'Hỗ trợ trực tuyến',
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
                  studentOnly: true,
                },
                {
                  label: 'Tài liệu khóa học',
                  sub: 'Giáo trình & Video',
                  icon: FileText,
                  iconBg: 'rgba(14,124,123,0.10)',
                  iconColor: '#0E7C7B',
                  border: 'rgba(14,124,123,0.18)',
                  screen: 'member-course-materials',
                  studentOnly: true,
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
                {
                  label: 'Cửa hàng',
                  sub: 'Mua sắm trực tuyến',
                  icon: ShoppingCart,
                  iconBg: 'rgba(168,85,247,0.10)',
                  iconColor: '#7C3AED',
                  border: 'rgba(168,85,247,0.18)',
                  screen: 'member-cart',
                },
              ].filter(action => !action.studentOnly || hasActivePackage).map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleActionClick(action.screen)}
                  className="flex flex-col gap-3 p-4 bg-white rounded-2xl text-left active:scale-95 transition-all relative overflow-hidden"
                  style={{
                    border: `1.5px solid ${action.border}`,
                    boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
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
                </button>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────
              THỐNG KÊ THÁNG NÀY
          ───────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                THÁNG NÀY
              </p>
              <button
                onClick={() => handleActionClick('member-attendance-history')}
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

    </div>
  );
}
