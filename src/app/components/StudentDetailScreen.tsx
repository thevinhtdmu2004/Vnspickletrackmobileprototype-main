import {
  ArrowLeft, Phone, Edit3, RefreshCw, PhoneCall,
  CheckCircle2, Clock, XCircle, AlertTriangle,
  CreditCard, FileText, Calendar, User, Trophy,
  ChevronRight, Banknote, Smartphone
} from 'lucide-react';
import { useState } from 'react';

interface StudentDetailScreenProps {
  onBack: () => void;
  onEdit: () => void;
  onRenew: () => void;
  onPaymentHistory?: () => void;
  onAttendanceHistory?: () => void;
}

type TabId = 'schedule' | 'payment' | 'notes';

const STUDENT = {
  name: 'Nguyễn Văn A',
  initials: 'A',
  phone: '0901 234 567',
  level: 'Beginner',
  status: 'active' as const,
  defaultClass: 'Beginner A',
  coach: 'Coach Nam',
  total: 12,
  attended: 5,
  remaining: 7,
  joinDate: '01/04/2026',
  notes: 'Học viên chăm chỉ, cần cải thiện kỹ thuật serve và volley. Sở thích chơi singles. Thường xuyên hỏi bài về chiến thuật.',
};

const ATTENDANCE = [
  { id: 1, date: '29/04/2026', dayOfWeek: 'Thứ Tư', status: 'present', class: 'Beginner A', coach: 'Coach Nam', court: 'Sân 1' },
  { id: 2, date: '27/04/2026', dayOfWeek: 'Thứ Hai', status: 'late', class: 'Beginner A', coach: 'Coach Nam', court: 'Sân 1' },
  { id: 3, date: '24/04/2026', dayOfWeek: 'Thứ Sáu', status: 'present', class: 'Beginner A', coach: 'Coach Nam', court: 'Sân 2' },
  { id: 4, date: '22/04/2026', dayOfWeek: 'Thứ Tư', status: 'absent', class: 'Beginner A', coach: 'Coach Nam', court: 'Sân 1' },
  { id: 5, date: '20/04/2026', dayOfWeek: 'Thứ Hai', status: 'present', class: 'Beginner A', coach: 'Coach Nam', court: 'Sân 1' },
];

const PAYMENTS = [
  {
    id: 1,
    date: '01/04/2026',
    package: 'Gói 12 buổi',
    amount: '2.400.000đ',
    method: 'Chuyển khoản',
    methodIcon: 'bank',
    note: 'Thanh toán đợt 1',
  },
];

const STATUS_CONFIG = {
  active: { label: 'Đang học', color: 'text-success', bg: 'bg-success/15', dot: 'bg-success' },
  paused: { label: 'Tạm nghỉ', color: 'text-warning-foreground', bg: 'bg-warning/20', dot: 'bg-warning' },
  inactive: { label: 'Đã nghỉ', color: 'text-destructive', bg: 'bg-destructive/15', dot: 'bg-destructive' },
};

const ATTENDANCE_CONFIG = {
  present: { label: 'Có mặt', color: 'text-success', bg: 'bg-success/12', icon: CheckCircle2 },
  late: { label: 'Đi trễ', color: 'text-warning-foreground', bg: 'bg-warning/20', icon: Clock },
  absent: { label: 'Vắng mặt', color: 'text-destructive', bg: 'bg-destructive/10', icon: XCircle },
};

export function StudentDetailScreen({ onBack, onEdit, onRenew, onPaymentHistory, onAttendanceHistory }: StudentDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>('schedule');

  const { total, attended, remaining } = STUDENT;
  const progressPercent = Math.round((attended / total) * 100);
  const isWarning = remaining <= 3 && remaining > 0;
  const isDanger = remaining <= 0;
  const isCritical = remaining <= 2 && remaining > 0;

  const statusCfg = STATUS_CONFIG[STUDENT.status];

  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'schedule', label: 'Lịch học', icon: Calendar },
    { id: 'payment', label: 'Thanh toán', icon: CreditCard },
    { id: 'notes', label: 'Ghi chú', icon: FileText },
  ];

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ── Hero Header ── */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0E7C7B 0%, #075E5D 60%, #054A49 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-white/5" />

        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-10 pb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <span className="text-white/80" style={{ fontSize: '14px', fontWeight: 500 }}>Chi tiết học viên</span>
          <button
            onClick={onEdit}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* Student identity */}
        <div className="px-5 pb-2 flex items-center gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg border-2 border-white/30"
              style={{ fontSize: '26px', fontWeight: 700, color: 'white' }}
            >
              {STUDENT.initials}
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${statusCfg.dot}`} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700, lineHeight: 1.2 }}>
              {STUDENT.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="flex items-center gap-1 bg-white/15 rounded-full px-2 py-0.5">
                <Trophy className="w-3 h-3 text-white/80" />
                <span className="text-white/90" style={{ fontSize: '11px', fontWeight: 500 }}>{STUDENT.level}</span>
              </span>
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${statusCfg.bg}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                <span className={`${statusCfg.color}`} style={{ fontSize: '11px', fontWeight: 600 }}>{statusCfg.label}</span>
              </span>
              {isCritical && (
                <span className="flex items-center gap-1 bg-destructive/25 rounded-full px-2 py-0.5">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                  <span className="text-destructive" style={{ fontSize: '11px', fontWeight: 600 }}>Sắp hết buổi!</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Phone className="w-3 h-3 text-white/60" />
              <span className="text-white/70" style={{ fontSize: '12px' }}>{STUDENT.phone}</span>
            </div>
          </div>
        </div>

        {/* ── Metric Cards ── */}
        <div className="px-4 pt-3 pb-4">
          <div className="grid grid-cols-3 gap-2.5">
            {/* Tổng */}
            <div className="bg-white/12 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/15">
              <p className="text-white/60" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tổng buổi</p>
              <p className="text-white mt-1" style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>{total}</p>
              <p className="text-white/50 mt-0.5" style={{ fontSize: '10px' }}>đã mua</p>
            </div>

            {/* Đã học */}
            <div className="bg-white/12 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/15">
              <p className="text-white/60" style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Đã học</p>
              <p className="text-white mt-1" style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1 }}>{attended}</p>
              <p className="text-white/50 mt-0.5" style={{ fontSize: '10px' }}>{progressPercent}% hoàn thành</p>
            </div>

            {/* Còn lại — highlighted */}
            <div
              className={`rounded-2xl p-3 text-center border-2 shadow-lg relative overflow-hidden ${
                isDanger
                  ? 'bg-destructive/30 border-destructive/60'
                  : isCritical
                  ? 'bg-warning/25 border-warning/60'
                  : isWarning
                  ? 'bg-warning/20 border-warning/40'
                  : 'bg-accent/25 border-accent/50'
              }`}
            >
              {isCritical && (
                <div className="absolute top-1 right-1">
                  <AlertTriangle className="w-3 h-3 text-warning" />
                </div>
              )}
              <p className="text-white/70" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Còn lại</p>
              <p
                className={`mt-1 ${
                  isDanger ? 'text-destructive' : isCritical ? 'text-warning' : 'text-white'
                }`}
                style={{ fontSize: '28px', fontWeight: 800, lineHeight: 1 }}
              >
                {remaining}
              </p>
              <p
                className={`mt-0.5 ${isDanger || isCritical ? 'text-warning' : 'text-white/60'}`}
                style={{ fontSize: '10px', fontWeight: isCritical ? 600 : 400 }}
              >
                {isDanger ? '🚨 Hết buổi' : isCritical ? '⚠ Sắp hết!' : 'buổi trống'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-white/50" style={{ fontSize: '10px' }}>Tiến độ học</span>
              <span className="text-white/70" style={{ fontSize: '10px', fontWeight: 600 }}>{attended}/{total} buổi</span>
            </div>
            <div className="h-1.5 bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPercent}%`,
                  background: isCritical ? '#E9C46A' : isDanger ? '#E76F51' : '#F4A261',
                }}
              />
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="px-4 pb-5 grid grid-cols-3 gap-2.5">
          {/* Gia hạn */}
          <button
            onClick={onRenew}
            className="flex flex-col items-center gap-1.5 bg-accent text-white py-3 rounded-2xl shadow-lg active:opacity-80 transition-opacity"
          >
            <RefreshCw className="w-5 h-5" />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Gia hạn gói</span>
          </button>

          {/* Chỉnh sửa */}
          <button
            onClick={onEdit}
            className="flex flex-col items-center gap-1.5 bg-white/18 text-white py-3 rounded-2xl border border-white/25 active:bg-white/25 transition-colors"
          >
            <Edit3 className="w-5 h-5" />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Chỉnh sửa</span>
          </button>

          {/* Gọi điện */}
          <a
            href={`tel:${STUDENT.phone.replace(/\s/g, '')}`}
            className="flex flex-col items-center gap-1.5 bg-success/25 text-white py-3 rounded-2xl border border-success/40 active:opacity-80 transition-opacity"
          >
            <PhoneCall className="w-5 h-5" />
            <span style={{ fontSize: '11px', fontWeight: 600 }}>Gọi điện</span>
          </a>
        </div>
      </div>

      {/* ── Warning Banner (if <= 2 sessions) ── */}
      {isCritical && (
        <div className="flex-shrink-0 bg-warning/15 border-b-2 border-warning/30 px-4 py-2.5 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-warning-foreground flex-shrink-0" />
          <div className="flex-1">
            <p className="text-warning-foreground" style={{ fontSize: '13px', fontWeight: 600 }}>
              Học viên còn {remaining} buổi — Cần gia hạn sớm!
            </p>
            <p className="text-warning-foreground/70" style={{ fontSize: '11px' }}>
              Nhắn nhủ học viên gia hạn để không bị gián đoạn
            </p>
          </div>
          <button
            onClick={onRenew}
            className="bg-warning text-warning-foreground px-3 py-1.5 rounded-xl flex-shrink-0"
            style={{ fontSize: '12px', fontWeight: 600 }}
          >
            Gia hạn
          </button>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex-shrink-0 bg-card border-b border-border shadow-sm">
        <div className="flex">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors relative ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span style={{ fontSize: '11px', fontWeight: isActive ? 600 : 400 }}>{tab.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto">

        {/* ── Tab: Lịch học ── */}
        {activeTab === 'schedule' && (
          <div className="p-4 space-y-3">
            {/* Summary row */}
            <div className="flex items-center justify-between px-1">
              <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 500 }}>
                {ATTENDANCE.length} buổi gần đây
              </span>
              <div className="flex items-center gap-3">
                {[
                  { s: 'present', l: 'Có mặt', c: 'text-success' },
                  { s: 'late', l: 'Đi trễ', c: 'text-warning-foreground' },
                  { s: 'absent', l: 'Vắng', c: 'text-destructive' },
                ].map(item => (
                  <span key={item.s} className={`${item.c}`} style={{ fontSize: '11px', fontWeight: 500 }}>
                    {ATTENDANCE.filter(a => a.status === item.s).length} {item.l}
                  </span>
                ))}
              </div>
            </div>

            {ATTENDANCE.map((record, idx) => {
              const cfg = ATTENDANCE_CONFIG[record.status as keyof typeof ATTENDANCE_CONFIG];
              const Icon = cfg.icon;
              return (
                <div key={record.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                  {/* Date header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 600 }}>{record.date}</p>
                        <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{record.dayOfWeek}</p>
                      </div>
                    </div>
                    <span
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${cfg.bg} ${cfg.color}`}
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {cfg.label}
                    </span>
                  </div>
                  {/* Detail row */}
                  <div className="px-4 py-2.5 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{record.class}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <div className="flex items-center gap-1.5">
                      <Trophy className="w-3.5 h-3.5 text-muted-foreground/70" />
                      <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{record.coach}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{record.court}</span>
                  </div>
                </div>
              );
            })}

            {/* Load more */}
            <button
              onClick={onAttendanceHistory}
              className="w-full py-3 flex items-center justify-center gap-1.5 text-primary border border-primary/30 rounded-2xl bg-primary/5 active:bg-primary/10 transition-colors"
            >
              <span style={{ fontSize: '13px', fontWeight: 500 }}>Xem thêm lịch sử</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Tab: Thanh toán ── */}
        {activeTab === 'payment' && (
          <div className="p-4 space-y-3">
            {/* Total spent */}
            <div
              className="rounded-2xl p-4 flex items-center justify-between"
              style={{ background: 'linear-gradient(135deg, #0E7C7B, #075E5D)' }}
            >
              <div>
                <p className="text-white/70" style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Tổng đã thanh toán
                </p>
                <p className="text-white mt-1" style={{ fontSize: '24px', fontWeight: 800 }}>2.400.000đ</p>
                <p className="text-white/60 mt-0.5" style={{ fontSize: '11px' }}>Từ {STUDENT.joinDate} đến nay</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <Banknote className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Transaction list */}
            <div className="flex items-center justify-between px-1">
              <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 500 }}>Lịch sử giao dịch</span>
              <span className="text-primary" style={{ fontSize: '12px', fontWeight: 500 }}>{PAYMENTS.length} giao dịch</span>
            </div>

            {PAYMENTS.map(payment => (
              <div key={payment.id} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Date + package */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 600 }}>{payment.package}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{payment.date}</p>
                    </div>
                  </div>
                  <p className="text-success" style={{ fontSize: '16px', fontWeight: 700 }}>
                    {payment.amount}
                  </p>
                </div>
                {/* Method */}
                <div className="px-4 py-2.5 flex items-center gap-2">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-primary/8`}>
                    <Smartphone className="w-3 h-3 text-primary" />
                    <span className="text-primary" style={{ fontSize: '12px', fontWeight: 500 }}>{payment.method}</span>
                  </div>
                  <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{payment.note}</span>
                </div>
              </div>
            ))}

            {/* Add payment button */}
            <button
              onClick={onPaymentHistory}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-accent text-white rounded-2xl shadow-md active:opacity-80 transition-opacity"
            >
              <CreditCard className="w-5 h-5" />
              <span style={{ fontSize: '14px', fontWeight: 600 }}>Ghi nhận thanh toán mới</span>
            </button>
          </div>
        )}

        {/* ── Tab: Ghi chú ── */}
        {activeTab === 'notes' && (
          <div className="p-4 space-y-3">
            {/* Note card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  <span className="text-foreground" style={{ fontSize: '14px', fontWeight: 600 }}>Ghi chú về học viên</span>
                </div>
                <button
                  onClick={onEdit}
                  className="text-primary flex items-center gap-1"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Sửa
                </button>
              </div>
              <p className="text-foreground/80 leading-relaxed" style={{ fontSize: '14px' }}>
                {STUDENT.notes}
              </p>
            </div>

            {/* Quick info card */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-border/50">
                <span className="text-foreground" style={{ fontSize: '14px', fontWeight: 600 }}>Thông tin lớp học</span>
              </div>
              {[
                { icon: Trophy, label: 'Trình độ', value: STUDENT.level },
                { icon: User, label: 'Lớp mặc định', value: STUDENT.defaultClass },
                { icon: User, label: 'Huấn luyện viên', value: STUDENT.coach },
                { icon: Calendar, label: 'Ngày tham gia', value: STUDENT.joinDate },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="px-4 py-3 flex items-center gap-3 border-b border-border/40 last:border-0">
                    <div className="w-8 h-8 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{item.label}</p>
                      <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}