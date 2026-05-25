/*
 * ScreenFlowDocument.tsx — VNS PickleTrack
 * Documentation Board · Screen Flow Document
 * Full-width · Sạch · Chuyên nghiệp
 */
import { useState } from 'react';
import {
  Shield, Dumbbell, User, ArrowRight, ArrowLeft,
  Check, X, CheckCircle2, Clock, RotateCcw, XCircle,
  MinusCircle, LogIn, BarChart3, Settings, Home, Users,
  Package, History, Phone, Lock, Database, FileText,
  Calendar, RefreshCw, Star, AlertCircle, ChevronRight,
  Layers, Award, ClipboardCheck, BookOpen, Zap, Info,
} from 'lucide-react';

/* ═══════════ DESIGN TOKENS ═══════════ */
const C = {
  bg:      '#F7F9FA',
  card:    '#FFFFFF',
  pri:     '#0E7C7B',
  priDim:  'rgba(14,124,123,0.10)',
  acc:     '#F4A261',
  warn:    '#E9C46A',
  danger:  '#E76F51',
  text:    '#1F2933',
  sub:     '#6B7280',
  border:  'rgba(0,0,0,0.07)',
  admin:   '#0E7C7B',
  coach:   '#264653',
  member:  '#815AD5',
};

/* ═══════════ SUB-COMPONENTS ═══════════ */
function SectionHeader({ num, title, sub }: { num: string; title: string; sub?: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white"
        style={{ background: C.pri, fontSize: 15, fontWeight: 800 }}
      >{num}</div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: C.text, lineHeight: 1.2, margin: 0 }}>{title}</h2>
        {sub && <p style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>{sub}</p>}
      </div>
    </div>
  );
}

function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div
      className={className}
      style={{
        background: C.card,
        borderRadius: 16,
        border: `1px solid ${C.border}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        ...style,
      }}
    >{children}</div>
  );
}

function RoleBadge({ role }: { role: 'admin' | 'coach' | 'member' }) {
  const cfg = {
    admin:  { label: 'Admin',    color: C.admin,  bg: 'rgba(14,124,123,0.10)',  Icon: Shield   },
    coach:  { label: 'Coach',    color: C.coach,  bg: 'rgba(38,70,83,0.10)',    Icon: Dumbbell },
    member: { label: 'Hội viên', color: C.member, bg: 'rgba(129,90,213,0.10)', Icon: User     },
  }[role];
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full"
      style={{ background: cfg.bg, color: cfg.color, fontSize: 11, fontWeight: 700 }}
    >
      <cfg.Icon style={{ width: 11, height: 11 }} />
      {cfg.label}
    </span>
  );
}

function FlowStep({ label, active, color }: { label: string; active?: boolean; color: string }) {
  return (
    <div
      className="px-3 py-1.5 rounded-lg flex-shrink-0"
      style={{
        background: active ? color : `${color}14`,
        color:      active ? 'white' : color,
        fontSize:   11,
        fontWeight: 700,
        border:     `1px solid ${color}30`,
        whiteSpace: 'nowrap',
      }}
    >{label}</div>
  );
}

function FlowRow({ steps, color, label }: { steps: string[]; color: string; label?: string }) {
  return (
    <div className="mb-3">
      {label && (
        <p style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>{label}</p>
      )}
      <div className="flex items-center flex-wrap gap-1.5">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <FlowStep label={s} active={i === 0} color={color} />
            {i < steps.length - 1 && (
              <ArrowRight style={{ width: 12, height: 12, color, flexShrink: 0 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

type PermType = 'yes' | 'no' | 'limited' | 'self' | 'request';
function PermCell({ type, note }: { type: PermType; note?: string }) {
  if (type === 'yes')     return <div className="flex justify-center"><Check style={{ width: 16, height: 16, color: '#2A9D8F' }} /></div>;
  if (type === 'no')      return <div className="flex justify-center"><X style={{ width: 15, height: 15, color: '#D1D5DB' }} /></div>;
  if (type === 'limited') return <span style={{ fontSize: 10, fontWeight: 700, color: C.warn, whiteSpace: 'nowrap' }}>{note ?? 'Giới hạn'}</span>;
  if (type === 'self')    return <span style={{ fontSize: 10, fontWeight: 700, color: '#4B6CB7', whiteSpace: 'nowrap' }}>{note ?? 'Bản thân'}</span>;
  if (type === 'request') return <span style={{ fontSize: 10, fontWeight: 700, color: C.acc, whiteSpace: 'nowrap' }}>{note ?? 'Gửi YC'}</span>;
  return null;
}

/* ═══════════ DATA ═══════════ */
const SITEMAP = [
  { depth: 0, label: 'VNS PickleTrack', color: C.pri, bold: true },
  { depth: 1, label: 'Splash Screen',   color: C.sub },
  { depth: 1, label: 'Màn hình đăng nhập', color: C.sub },
  { depth: 1, label: '📌 ADMIN AREA', color: C.admin, bold: true },
  { depth: 2, label: 'Dashboard Admin' },
  { depth: 2, label: 'Lớp hôm nay' },
  { depth: 2, label: 'Tạo buổi học hôm nay' },
  { depth: 2, label: 'Chi tiết buổi học' },
  { depth: 2, label: 'Điểm danh học viên' },
  { depth: 2, label: 'Học viên (danh sách)' },
  { depth: 2, label: 'Thêm học viên' },
  { depth: 2, label: 'Sửa học viên' },
  { depth: 2, label: 'Chi tiết học viên' },
  { depth: 2, label: 'Gia hạn gói' },
  { depth: 2, label: 'Lịch sử điểm danh' },
  { depth: 2, label: 'Lịch sử thanh toán' },
  { depth: 2, label: 'Lớp học (danh sách)' },
  { depth: 2, label: 'Thêm lớp' },
  { depth: 2, label: 'Sửa lớp' },
  { depth: 2, label: 'Chi tiết lớp' },
  { depth: 2, label: 'Gán học viên vào lớp' },
  { depth: 2, label: 'Báo cáo', color: '#815AD5', bold: true },
  { depth: 3, label: 'Học viên sắp hết buổi' },
  { depth: 3, label: 'Doanh thu tháng (Admin only)' },
  { depth: 3, label: 'Lượt học tháng' },
  { depth: 3, label: 'Báo cáo theo lớp' },
  { depth: 3, label: 'Báo cáo học viên' },
  { depth: 2, label: 'Cài đặt', color: '#815AD5', bold: true },
  { depth: 3, label: 'Sao lưu dữ liệu' },
  { depth: 3, label: 'Xuất CSV' },
  { depth: 3, label: 'Khôi phục dữ liệu (sắp có)' },
  { depth: 3, label: 'Quản lý gói học' },
  { depth: 3, label: 'Quản lý người dùng' },
  { depth: 3, label: 'Đổi mã PIN' },
  { depth: 1, label: '📌 COACH AREA', color: C.coach, bold: true },
  { depth: 2, label: 'Dashboard Coach' },
  { depth: 2, label: 'Lớp hôm nay' },
  { depth: 2, label: 'Chi tiết buổi học' },
  { depth: 2, label: 'Điểm danh học viên' },
  { depth: 2, label: 'Học viên trong lớp' },
  { depth: 2, label: 'Báo cáo vận hành' },
  { depth: 2, label: 'Đổi mã PIN' },
  { depth: 1, label: '📌 MEMBER AREA', color: C.member, bold: true },
  { depth: 2, label: 'Member Dashboard' },
  { depth: 2, label: 'Lịch học của tôi' },
  { depth: 2, label: 'Gói học của tôi' },
  { depth: 2, label: 'Lịch sử học của tôi' },
  { depth: 2, label: 'Lịch sử thanh toán của tôi' },
  { depth: 2, label: 'Yêu cầu gia hạn gói' },
  { depth: 2, label: 'Cảnh báo sắp hết buổi' },
  { depth: 2, label: 'Liên hệ Coach / Admin' },
  { depth: 2, label: 'Hồ sơ của tôi' },
];

const ATTENDANCE_RULES = [
  { status: 'Có mặt',   Icon: CheckCircle2, color: '#2A9D8F', deduct: true,  note: 'Học viên có mặt, buổi học bình thường' },
  { status: 'Trễ',      Icon: Clock,        color: '#E9C46A', deduct: true,  note: 'Đến muộn nhưng vẫn học, tính 1 buổi' },
  { status: 'Học bù',   Icon: RotateCcw,    color: '#0E7C7B', deduct: true,  note: '⚠️ Nghiệp vụ quan trọng — bù buổi đã nghỉ, vẫn trừ' },
  { status: 'Vắng',     Icon: XCircle,      color: '#E76F51', deduct: false, note: 'Không đến, không báo — không trừ buổi' },
  { status: 'Nghỉ phép', Icon: MinusCircle, color: '#4B6CB7', deduct: false, note: 'Đã báo trước, giữ nguyên số buổi' },
];

const PERMISSIONS: { feature: string; admin: PermType; coach: PermType; member: PermType; coachNote?: string; memberNote?: string }[] = [
  { feature: 'Dashboard Admin',                  admin: 'yes', coach: 'no',      member: 'no'                                              },
  { feature: 'Dashboard Coach',                  admin: 'no',  coach: 'yes',     member: 'no'                                              },
  { feature: 'Member Dashboard',                 admin: 'no',  coach: 'no',      member: 'yes'                                             },
  { feature: 'Lớp hôm nay',                      admin: 'yes', coach: 'yes',     member: 'no'                                              },
  { feature: 'Điểm danh học viên',               admin: 'yes', coach: 'yes',     member: 'no'                                              },
  { feature: 'Danh sách học viên toàn HT',       admin: 'yes', coach: 'limited', member: 'no',      coachNote: 'Lớp mình'                  },
  { feature: 'Chi tiết học viên',                admin: 'yes', coach: 'limited', member: 'self',    coachNote: 'Lớp mình'                  },
  { feature: 'Gia hạn gói học',                  admin: 'yes', coach: 'no',      member: 'request'                                         },
  { feature: 'Doanh thu tháng 🔒',               admin: 'yes', coach: 'no',      member: 'no'                                              },
  { feature: 'Báo cáo vận hành',                 admin: 'yes', coach: 'yes',     member: 'no'                                              },
  { feature: 'Backup dữ liệu',                   admin: 'yes', coach: 'no',      member: 'no'                                              },
  { feature: 'Quản lý gói học',                  admin: 'yes', coach: 'no',      member: 'no'                                              },
  { feature: 'Quản lý người dùng',               admin: 'yes', coach: 'no',      member: 'no'                                              },
  { feature: 'Settings đầy đủ',                  admin: 'yes', coach: 'limited', member: 'no',      coachNote: 'Chỉ PIN & Info'             },
  { feature: 'Lịch học của tôi',                 admin: 'no',  coach: 'no',      member: 'yes'                                             },
  { feature: 'Gói học của tôi',                  admin: 'no',  coach: 'no',      member: 'yes'                                             },
  { feature: 'Hồ sơ của tôi',                    admin: 'no',  coach: 'no',      member: 'yes'                                             },
  { feature: 'AccessDeniedScreen (khi vi phạm)', admin: 'no',  coach: 'limited', member: 'limited', coachNote: 'Truy cập DT', memberNote: 'Truy cập DT' },
];

const DEMO_FLOWS: { id: number; title: string; role: 'admin' | 'coach' | 'member'; color: string; steps: string[] }[] = [
  { id: 1, title: 'Admin điểm danh',           role: 'admin',  color: C.admin,  steps: ['Login Admin', 'Dashboard Admin', 'Lớp hôm nay', 'Chi tiết buổi', 'Điểm danh học viên', 'Lưu điểm danh'] },
  { id: 2, title: 'Admin thêm HV & gia hạn',  role: 'admin',  color: '#2A9D8F', steps: ['Login Admin', 'Học viên', 'Thêm học viên', 'Chi tiết học viên', 'Gia hạn gói', 'Success'] },
  { id: 3, title: 'Admin tạo lớp & gán HV',   role: 'admin',  color: C.acc,    steps: ['Login Admin', 'Lớp học', 'Thêm lớp', 'Chi tiết lớp', 'Gán học viên', 'Lưu'] },
  { id: 4, title: 'Coach điểm danh',           role: 'coach',  color: C.coach,  steps: ['Login Coach', 'Dashboard Coach', 'Lớp hôm nay', 'Điểm danh học viên', 'Lưu điểm danh'] },
  { id: 5, title: 'Hội viên xem thông tin',    role: 'member', color: C.member, steps: ['Login Member', 'Member Dashboard', 'Gói học', 'Lịch học', 'Lịch sử', 'Hồ sơ'] },
  { id: 6, title: 'Hội viên yêu cầu gia hạn', role: 'member', color: '#815AD5', steps: ['Login Member', 'Gói học của tôi', 'Yêu cầu gia hạn', 'Gửi yêu cầu', 'Success'] },
  { id: 7, title: 'Admin backup dữ liệu',      role: 'admin',  color: '#4B6CB7', steps: ['Login Admin', 'Cài đặt', 'Sao lưu dữ liệu', 'Sao lưu ngay', 'Thành công'] },
];

const CHECKLIST = [
  'Login Admin → vào đúng Dashboard Admin',
  'Login Coach → vào đúng Dashboard Coach',
  'Login Member → vào đúng Member Dashboard',
  'Admin xem được doanh thu tháng',
  'Coach không xem được doanh thu',
  'Member không thấy menu Admin / Coach',
  'Điểm danh có đủ 5 trạng thái (Có mặt, Trễ, Học bù, Vắng, Nghỉ phép)',
  'Học bù được tính là trừ buổi (deduct: true)',
  'Member gửi được yêu cầu gia hạn',
  'Admin backup flow chạy được',
];

/* ═══════════ MAIN COMPONENT ═══════════ */
interface ScreenFlowDocumentProps {
  onBack?: () => void;
}

export function ScreenFlowDocument({ onBack }: ScreenFlowDocumentProps) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const toggle = (n: number) => setChecked(p => ({ ...p, [n]: !p[n] }));
  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'system-ui,-apple-system,sans-serif', color: C.text }}>

      {/* ── STICKY TOP BAR ── */}
      <div
        className="sticky top-0 z-30 flex items-center gap-3 px-6 py-3"
        style={{ background: 'rgba(247,249,250,0.92)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${C.border}` }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-black/5"
          style={{ fontSize: 12, fontWeight: 600, color: C.sub }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          Quay lại Prototype
        </button>
        <div style={{ width: 1, height: 18, background: C.border }} />
        <div className="flex items-center gap-2">
          <Layers style={{ width: 15, height: 15, color: C.pri }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Screen Flow Document</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span
            className="px-2.5 py-1 rounded-full"
            style={{ background: C.priDim, color: C.pri, fontSize: 10, fontWeight: 700 }}
          >VNS PickleTrack v1.0</span>
          <span
            className="px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(129,90,213,0.10)', color: C.member, fontSize: 10, fontWeight: 700 }}
          >3 Vai trò · 19 Flows · 45+ Màn hình</span>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg,#032626 0%,#054A49 40%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/3" style={{ transform: 'translate(-30%,30%)' }} />
        <div className="relative px-8 py-12">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.20)' }}
                  >
                    <span style={{ fontSize: 28 }}>🏓</span>
                  </div>
                  <div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Screen Flow Document</p>
                    <h1 style={{ fontSize: 32, fontWeight: 900, color: 'white', lineHeight: 1.1, margin: 0 }}>VNS PickleTrack</h1>
                  </div>
                </div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', maxWidth: 500, lineHeight: 1.6 }}>
                  Tài liệu trực quan mô tả sitemap, luồng màn hình, phân quyền và demo flows cho ứng dụng quản lý học viên Pickleball.
                </p>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  {(['admin','coach','member'] as const).map(r => <RoleBadge key={r} role={r} />)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: '19',  label: 'Flows',    color: '#7FFFD4' },
                  { val: '45+', label: 'Màn hình', color: '#FFD4A8' },
                  { val: '3',   label: 'Vai trò',  color: '#D4BBFF' },
                  { val: '5',   label: 'Trạng thái điểm danh', color: '#FFB3A0' },
                ].map((s, i) => (
                  <div key={i} className="text-center px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    <p style={{ fontSize: 24, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</p>
                    <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 3 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main style={{ maxWidth: 1140, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* ──────────────────────────────────────────────
            §1  OVERVIEW
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="1" title="Tổng quan" sub="Mục tiêu, phạm vi và đối tượng sử dụng ứng dụng" />
          <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px,1fr))' }}>
            {[
              {
                Icon: Info, color: C.pri,
                title: 'Mục tiêu',
                items: [
                  'Quản lý học viên Pickleball và gói học',
                  'Theo dõi buổi học, điểm danh, số buổi còn lại',
                  'Gia hạn gói, thông báo sắp hết buổi',
                  'Báo cáo doanh thu, vận hành lớp học',
                  'Sao lưu và xuất dữ liệu',
                ],
              },
              {
                Icon: Users, color: C.acc,
                title: 'Đối tượng sử dụng',
                items: [
                  'Admin — Quản trị toàn hệ thống',
                  'Coach — Vận hành lớp học hàng ngày',
                  'Học viên / Hội viên — Xem thông tin bản thân',
                ],
              },
              {
                Icon: Zap, color: C.member,
                title: 'Thông tin kỹ thuật',
                items: [
                  'Nền tảng: Android (390 × 844 px)',
                  'Ngôn ngữ: Tiếng Việt',
                  'Prototype: React + Tailwind CSS',
                  'Sản phẩm thật: .NET MAUI',
                  'Màu chủ đạo: Xanh teal #0E7C7B',
                ],
              },
            ].map(({ Icon, color, title, items }) => (
              <Card key={title} style={{ padding: 20 }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}14` }}>
                    <Icon style={{ width: 16, height: 16, color }} />
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{title}</span>
                </div>
                <ul className="space-y-1.5">
                  {items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight style={{ width: 13, height: 13, color, marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: C.sub, lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            §2  ROLE SUMMARY
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="2" title="Tóm tắt vai trò" sub="Quyền hạn và trách nhiệm của từng vai trò" />
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))' }}>
            {[
              {
                role: 'admin' as const,
                color: C.admin, bg: 'rgba(14,124,123,0.06)',
                border: 'rgba(14,124,123,0.20)',
                Icon: Shield, login: 'admin / 123456',
                perms: ['Quản trị toàn hệ thống', 'Quản lý học viên, lớp học, coach', 'Điểm danh & gia hạn gói học', 'Xem doanh thu & báo cáo', 'Sao lưu / xuất dữ liệu', 'Quản lý người dùng & gói học'],
                cannot: [],
              },
              {
                role: 'coach' as const,
                color: C.coach, bg: 'rgba(38,70,83,0.06)',
                border: 'rgba(38,70,83,0.18)',
                Icon: Dumbbell, login: 'coach / 111111',
                perms: ['Xem lớp hôm nay của mình', 'Điểm danh học viên', 'Sửa điểm danh', 'Xem báo cáo lớp / học viên', 'Đổi mã PIN cá nhân'],
                cannot: ['Doanh thu', 'Backup', 'Quản lý gói', 'Quản lý người dùng'],
              },
              {
                role: 'member' as const,
                color: C.member, bg: 'rgba(129,90,213,0.06)',
                border: 'rgba(129,90,213,0.18)',
                Icon: User, login: 'member / 222222',
                perms: ['Xem hồ sơ cá nhân', 'Xem số buổi còn lại', 'Xem lịch học & lịch sử', 'Xem lịch sử thanh toán', 'Gửi yêu cầu gia hạn'],
                cannot: ['Điểm danh', 'Doanh thu', 'Dữ liệu người khác', 'Quản lý lớp'],
              },
            ].map(({ role, color, bg, border, Icon, login, perms, cannot }) => (
              <Card key={role} style={{ padding: 20, background: bg, borderColor: border }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}20`, border: `2px solid ${color}30` }}>
                    <Icon style={{ width: 20, height: 20, color }} />
                  </div>
                  <div>
                    <RoleBadge role={role} />
                    <p style={{ fontSize: 10, color: C.sub, marginTop: 3 }}>Demo: <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 6px', borderRadius: 4, fontSize: 10 }}>{login}</code></p>
                  </div>
                </div>
                <div className="space-y-1.5 mb-3">
                  {perms.map((p, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check style={{ width: 12, height: 12, color: '#2A9D8F', marginTop: 2, flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: C.text, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
                {cannot.length > 0 && (
                  <div className="pt-3" style={{ borderTop: `1px solid ${border}` }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Không được phép</p>
                    <div className="flex flex-wrap gap-1.5">
                      {cannot.map((c, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md" style={{ background: 'rgba(231,111,81,0.12)', color: C.danger, fontSize: 10, fontWeight: 600 }}>{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            §3  LOGIN FLOW
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="3" title="Login Flow" sub="Luồng đăng nhập và phân nhánh theo vai trò" />
          <Card style={{ padding: 28 }}>
            <div className="flex items-center justify-center flex-wrap gap-6">
              {/* Splash → Login */}
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center mx-auto mb-2" style={{ background: 'linear-gradient(135deg,#054A49,#0E7C7B)', boxShadow: '0 4px 16px rgba(14,124,123,0.25)' }}>
                    <span style={{ fontSize: 28 }}>🏓</span>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>Splash Screen</span>
                </div>
                <ArrowRight style={{ width: 20, height: 20, color: C.pri }} />
                <div className="text-center">
                  <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center mx-auto mb-2" style={{ background: 'rgba(14,124,123,0.10)', border: `2px solid rgba(14,124,123,0.25)` }}>
                    <LogIn style={{ width: 28, height: 28, color: C.pri }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>Đăng nhập</span>
                </div>
              </div>

              {/* Arrow + branch */}
              <ArrowRight style={{ width: 24, height: 24, color: C.pri }} />

              {/* 3 branches */}
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Dashboard Admin', Icon: Shield,   color: C.admin,  demo: 'admin / 123456'  },
                  { label: 'Dashboard Coach', Icon: Dumbbell, color: C.coach,  demo: 'coach / 111111'  },
                  { label: 'Member Dashboard', Icon: User,    color: C.member, demo: 'member / 222222' },
                ].map(({ label, Icon, color, demo }) => (
                  <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: `${color}0E`, border: `1px solid ${color}30` }}>
                    <ArrowRight style={{ width: 14, height: 14, color, flexShrink: 0 }} />
                    <Icon style={{ width: 16, height: 16, color, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color }}>{label}</p>
                      <p style={{ fontSize: 10, color: C.sub }}>Demo: <code style={{ fontSize: 10 }}>{demo}</code></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </section>

        {/* ──────────────────────────────────────────────
            §4  GLOBAL SITEMAP
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="4" title="Global Sitemap" sub="Cây màn hình toàn bộ hệ thống theo vai trò" />
          <Card style={{ padding: 24 }}>
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))' }}>
              {/* Column split: admin, coach, member */}
              {[
                { role: 'admin' as const, color: C.admin, items: SITEMAP.filter((_,i) => i <= 33) },
                { role: 'coach' as const, color: C.coach, items: SITEMAP.filter((_,i) => i >= 34 && i <= 41) },
                { role: 'member' as const, color: C.member, items: SITEMAP.filter((_,i) => i >= 42) },
              ].map(({ role, color, items }) => (
                <div key={role}>
                  <div className="flex items-center gap-2 mb-3 pb-2" style={{ borderBottom: `2px solid ${color}` }}>
                    <RoleBadge role={role} />
                  </div>
                  <div className="space-y-0.5">
                    {items.map((node, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1"
                        style={{ paddingLeft: node.depth <= 1 ? 0 : node.depth === 2 ? 12 : 24 }}
                      >
                        {node.depth >= 2 && (
                          <span style={{ color: `${color}60`, fontSize: 10, flexShrink: 0, marginRight: 2 }}>
                            {node.depth === 2 ? '├─' : '└─'}
                          </span>
                        )}
                        <span style={{
                          fontSize: node.depth === 0 ? 14 : node.depth === 1 ? 12 : 11,
                          fontWeight: node.bold ? 700 : 400,
                          color: node.color ?? (node.depth <= 1 ? C.text : C.sub),
                          lineHeight: 1.8,
                        }}>
                          {node.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ──────────────────────────────────────────────
            §5-7  FLOWS PER ROLE (3 LANES)
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="5–7" title="Luồng màn hình theo vai trò" sub="Admin Flow · Coach Flow · Member Flow" />
          <div className="grid gap-5" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px,1fr))' }}>

            {/* ── ADMIN LANE ── */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg,#054A49,#0E7C7B)' }}>
                <div className="flex items-center gap-2">
                  <Shield style={{ width: 18, height: 18, color: 'white' }} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Admin Flow</span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Bottom Nav: Trang chủ · Điểm danh · Học viên · Báo cáo · Cài đặt</p>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Dashboard', steps: ['Dashboard Admin', 'Lớp hôm nay', 'Thêm HV', 'Gia hạn gói', 'HV sắp hết buổi'] },
                  { label: 'Điểm danh', steps: ['Lớp hôm nay', 'Tạo buổi', 'Chi tiết buổi', 'Điểm danh', 'Lưu', 'Success'] },
                  { label: 'Học viên', steps: ['Danh sách HV', 'Thêm HV', 'Chi tiết HV', 'Gia hạn gói', 'Lịch sử'] },
                  { label: 'Lớp học', steps: ['Danh sách lớp', 'Thêm lớp', 'Chi tiết lớp', 'Gán học viên'] },
                  { label: 'Báo cáo (Admin)', steps: ['Báo cáo', 'Sắp hết buổi', 'Doanh thu ✓', 'Lượt học', 'Theo lớp'] },
                  { label: 'Cài đặt (đầy đủ)', steps: ['Cài đặt', 'Sao lưu', 'Xuất CSV', 'Quản lý gói', 'Người dùng', 'Đổi PIN', 'Screen Flow Doc'] },
                ].map(f => <FlowRow key={f.label} steps={f.steps} color={C.admin} label={f.label} />)}
              </div>
            </Card>

            {/* ── COACH LANE ── */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg,#1A3040,#264653)' }}>
                <div className="flex items-center gap-2">
                  <Dumbbell style={{ width: 18, height: 18, color: 'white' }} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Coach Flow</span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Bottom Nav: Trang chủ · Điểm danh · Học viên · Báo cáo · Cài đặt</p>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Flow chính', steps: ['Dashboard Coach', 'Lớp hôm nay', 'Chi tiết buổi', 'Điểm danh', 'Lưu'] },
                  { label: 'Báo cáo (Coach)', steps: ['Báo cáo', 'Lượt học tháng', 'Theo lớp', 'Học viên'] },
                  { label: 'Cài đặt (giới hạn)', steps: ['Cài đặt', 'Thông tin TK', 'Đổi mã PIN'] },
                  { label: 'Khi truy cập Doanh thu', steps: ['Doanh thu tháng', 'AccessDeniedScreen', 'Quay lại'] },
                ].map(f => <FlowRow key={f.label} steps={f.steps} color={C.coach} label={f.label} />)}
                <div className="rounded-xl p-3" style={{ background: 'rgba(231,111,81,0.08)', border: '1px solid rgba(231,111,81,0.20)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.danger, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Không được phép xem</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Doanh thu tháng → AccessDenied', 'Xu hướng doanh thu', 'Quản lý gói học', 'Quản lý người dùng', 'Backup dữ liệu', 'Dev Handoff', 'Screen Flow Doc'].map((x, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: 'rgba(231,111,81,0.10)', color: C.danger, fontSize: 10, fontWeight: 600 }}>
                        <X style={{ width: 9, height: 9 }} />{x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            {/* ── MEMBER LANE ── */}
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div className="px-5 py-4" style={{ background: 'linear-gradient(135deg,#4B2D8C,#815AD5)' }}>
                <div className="flex items-center gap-2">
                  <User style={{ width: 18, height: 18, color: 'white' }} />
                  <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Member Flow</span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>Bottom Nav: Trang chủ · Lịch học · Gói học · Lịch sử · Cá nhân</p>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Dashboard', steps: ['Member Dashboard', 'Lịch học', 'Gói học', 'Lịch sử', 'Gia hạn', 'Liên hệ'] },
                  { label: 'Gói học', steps: ['Gói học của tôi', 'Xem buổi còn lại', 'Yêu cầu gia hạn', 'Success'] },
                  { label: 'Lịch sử', steps: ['Lịch sử', 'Lịch sử học', 'Lịch sử thanh toán'] },
                  { label: 'Hồ sơ (Member Profile)', steps: ['Cá nhân', 'Hồ sơ', 'Đổi PIN', 'Liên hệ', 'Đăng xuất'] },
                  { label: 'Khi truy cập tính năng cấm', steps: ['Tính năng cấm', 'AccessDeniedScreen', 'Quay lại'] },
                ].map(f => <FlowRow key={f.label} steps={f.steps} color={C.member} label={f.label} />)}
                <div className="rounded-xl p-3" style={{ background: 'rgba(231,111,81,0.08)', border: '1px solid rgba(231,111,81,0.20)' }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: C.danger, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Chỉ xem dữ liệu cá nhân · Không được phép</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Điểm danh', 'Danh sách toàn bộ HV', 'Doanh thu → AccessDenied', 'Quản lý lớp', 'Backup', 'Quản lý gói', 'Quản lý ND', 'Settings Admin/Coach'].map((x, i) => (
                      <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-md" style={{ background: 'rgba(231,111,81,0.10)', color: C.danger, fontSize: 10, fontWeight: 600 }}>
                        <X style={{ width: 9, height: 9 }} />{x}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            §8  ATTENDANCE RULES
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="8" title="Quy tắc điểm danh" sub="Nghiệp vụ quan trọng — 5 trạng thái và quy tắc trừ buổi" />
          <Card style={{ overflow: 'hidden' }}>
            {/* table header */}
            <div className="grid grid-cols-4 px-5 py-3" style={{ background: 'rgba(14,124,123,0.06)', borderBottom: `1px solid ${C.border}` }}>
              {['Trạng thái', 'Mô tả', 'Trừ buổi', 'Ghi chú nghiệp vụ'].map((h, i) => (
                <p key={i} style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</p>
              ))}
            </div>
            {ATTENDANCE_RULES.map(({ status, Icon, color, deduct, note }, i) => (
              <div
                key={status}
                className="grid grid-cols-4 items-center px-5 py-4"
                style={{ borderBottom: i < ATTENDANCE_RULES.length - 1 ? `1px solid ${C.border}` : 'none', background: i % 2 === 0 ? 'white' : 'rgba(0,0,0,0.015)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}14` }}>
                    <Icon style={{ width: 14, height: 14, color }} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 700, color }}>{status}</span>
                </div>
                <div />
                <div>
                  {deduct ? (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full w-fit" style={{ background: 'rgba(231,111,81,0.12)', color: C.danger, fontSize: 12, fontWeight: 700 }}>
                      <Check style={{ width: 12, height: 12 }} /> Có — −1 buổi
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full w-fit" style={{ background: 'rgba(42,157,143,0.10)', color: '#2A9D8F', fontSize: 12, fontWeight: 700 }}>
                      <X style={{ width: 12, height: 12 }} /> Không trừ
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: C.sub, lineHeight: 1.5 }}>{note}</p>
              </div>
            ))}
          </Card>
          <div className="flex items-start gap-2 mt-3 px-1">
            <AlertCircle style={{ width: 14, height: 14, color: C.acc, marginTop: 2, flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: C.sub, lineHeight: 1.6 }}>
              <strong style={{ color: C.text }}>Lưu ý quan trọng:</strong> "Học bù" phải được cấu hình <code style={{ background: 'rgba(0,0,0,0.06)', padding: '1px 5px', borderRadius: 4 }}>deduct: true</code> — Học viên bù buổi đã nghỉ vẫn sẽ bị trừ 1 buổi từ gói học hiện tại.
            </p>
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            §9  PERMISSION MATRIX
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="9" title="Ma trận phân quyền" sub="Quyền truy cập từng tính năng theo vai trò" />
          <Card style={{ overflow: 'hidden' }}>
            {/* Header row */}
            <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
              <div className="px-5 py-3" style={{ background: 'rgba(0,0,0,0.03)', borderBottom: `1px solid ${C.border}` }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: C.sub, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Màn hình / Tính năng</p>
              </div>
              {(['admin','coach','member'] as const).map(r => (
                <div key={r} className="flex justify-center items-center py-3" style={{ background: 'rgba(0,0,0,0.03)', borderBottom: `1px solid ${C.border}` }}>
                  <RoleBadge role={r} />
                </div>
              ))}
            </div>
            {/* Data rows */}
            {PERMISSIONS.map(({ feature, admin, coach, member, coachNote, memberNote }, i) => (
              <div
                key={feature}
                className="grid"
                style={{
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  borderBottom: i < PERMISSIONS.length - 1 ? `1px solid ${C.border}` : 'none',
                  background: i % 2 === 0 ? 'white' : 'rgba(0,0,0,0.015)',
                }}
              >
                <div className="px-5 py-3.5 flex items-center">
                  <span style={{ fontSize: 13, color: C.text }}>{feature}</span>
                </div>
                <div className="flex items-center justify-center py-3.5">
                  <PermCell type={admin} />
                </div>
                <div className="flex items-center justify-center py-3.5">
                  <PermCell type={coach} note={coachNote} />
                </div>
                <div className="flex items-center justify-center py-3.5">
                  <PermCell type={member} note={memberNote} />
                </div>
              </div>
            ))}
            {/* Legend */}
            <div className="px-5 py-3 flex items-center gap-5 flex-wrap" style={{ background: 'rgba(0,0,0,0.02)', borderTop: `1px solid ${C.border}` }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: C.sub }}>Ký hiệu:</p>
              {[
                { el: <Check style={{ width: 13, height: 13, color: '#2A9D8F' }} />, label: 'Có quyền' },
                { el: <X style={{ width: 13, height: 13, color: '#D1D5DB' }} />, label: 'Không' },
                { el: <span style={{ fontSize: 10, fontWeight: 700, color: C.warn }}>Giới hạn</span>, label: 'Có điều kiện' },
                { el: <span style={{ fontSize: 10, fontWeight: 700, color: '#4B6CB7' }}>Bản thân</span>, label: 'Chỉ dữ liệu cá nhân' },
                { el: <span style={{ fontSize: 10, fontWeight: 700, color: C.acc }}>Gửi YC</span>, label: 'Gửi yêu cầu' },
              ].map(({ el, label }, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {el}
                  <span style={{ fontSize: 11, color: C.sub }}>{label}</span>
                </div>
              ))}
            </div>
          </Card>
        </section>

        {/* ──────────────────────────────────────────────
            §10  DEMO FLOWS
        ────────────────────────────────────────────── */}
        <section className="mb-14">
          <SectionHeader num="10" title="Demo Flows" sub="7 kịch bản demo cho buổi giới thiệu hoặc kiểm thử" />
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px,1fr))' }}>
            {DEMO_FLOWS.map(({ id, title, role, color, steps }) => (
              <Card key={id} style={{ padding: 20, borderLeft: `4px solid ${color}` }}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                    style={{ background: color, fontSize: 12, fontWeight: 800 }}
                  >{id}</div>
                  <div className="flex-1">
                    <p style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{title}</p>
                  </div>
                  <RoleBadge role={role} />
                </div>
                <div className="flex items-center flex-wrap gap-1.5">
                  {steps.map((s, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div
                        className="px-2 py-1 rounded-md"
                        style={{
                          background: i === 0 ? color : `${color}12`,
                          color:      i === 0 ? 'white' : color,
                          fontSize:   11,
                          fontWeight: 600,
                          border:     `1px solid ${color}25`,
                          whiteSpace: 'nowrap',
                        }}
                      >{s}</div>
                      {i < steps.length - 1 && <ArrowRight style={{ width: 11, height: 11, color, flexShrink: 0 }} />}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* ──────────────────────────────────────────────
            §11  PROTOTYPE CHECKLIST
        ────────────────────────────────────────────── */}
        <section>
          <SectionHeader num="11" title="Prototype Demo Checklist" sub="Danh sách kiểm tra trước khi demo hoặc bàn giao" />
          <Card style={{ padding: 24 }}>
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{checkedCount} / {CHECKLIST.length} hoàn thành</span>
                <span style={{ fontSize: 12, color: checkedCount === CHECKLIST.length ? '#2A9D8F' : C.sub, fontWeight: 600 }}>
                  {checkedCount === CHECKLIST.length ? '✓ Sẵn sàng demo!' : `Còn ${CHECKLIST.length - checkedCount} mục`}
                </span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.06)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${(checkedCount / CHECKLIST.length) * 100}%`,
                    background: checkedCount === CHECKLIST.length
                      ? 'linear-gradient(90deg,#2A9D8F,#0E7C7B)'
                      : 'linear-gradient(90deg,#0E7C7B,#2A9D8F)',
                  }}
                />
              </div>
            </div>
            {/* Items */}
            <div className="space-y-2">
              {CHECKLIST.map((item, i) => {
                const done = !!checked[i];
                return (
                  <button
                    key={i}
                    onClick={() => toggle(i)}
                    className="w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all hover:scale-[1.005]"
                    style={{
                      background: done ? 'rgba(42,157,143,0.08)' : 'rgba(0,0,0,0.02)',
                      border: `1px solid ${done ? 'rgba(42,157,143,0.25)' : C.border}`,
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                      style={{
                        background: done ? '#2A9D8F' : 'white',
                        border: `2px solid ${done ? '#2A9D8F' : '#D1D5DB'}`,
                      }}
                    >
                      {done && <Check style={{ width: 11, height: 11, color: 'white', strokeWidth: 3 }} />}
                    </div>
                    <span style={{ fontSize: 13, color: done ? '#2A9D8F' : C.text, textDecoration: done ? 'line-through' : 'none', fontWeight: done ? 500 : 400, lineHeight: 1.5 }}>{item}</span>
                  </button>
                );
              })}
            </div>
            {checkedCount === CHECKLIST.length && (
              <div className="mt-5 flex items-center gap-3 px-5 py-4 rounded-xl" style={{ background: 'rgba(42,157,143,0.10)', border: '1px solid rgba(42,157,143,0.25)' }}>
                <Award style={{ width: 22, height: 22, color: '#2A9D8F', flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#2A9D8F' }}>Tất cả tiêu chí đã đạt!</p>
                  <p style={{ fontSize: 12, color: C.sub }}>Prototype VNS PickleTrack sẵn sàng để demo.</p>
                </div>
              </div>
            )}
          </Card>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 12, color: C.sub }}>
            VNS PickleTrack · Screen Flow Document · Prototype v1.0 · Tháng 05/2026
          </p>
          <p style={{ fontSize: 11, color: `${C.sub}80`, marginTop: 4 }}>
            Tài liệu nội bộ · Dành cho bàn giao Developer · Không phát hành bên ngoài
          </p>
        </div>

      </main>
    </div>
  );
}
