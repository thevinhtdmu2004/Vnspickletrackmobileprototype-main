import {
  ArrowLeft, AlertTriangle, Phone, RefreshCw,
  Download, ChevronRight, CheckCircle2, Zap,
  Filter, Shield, Clock
} from 'lucide-react';
import { useState } from 'react';

interface ReportExpiringScreenProps {
  onBack: () => void;
  onRenew: () => void;
}

type UrgencyLevel = 'expired' | 'critical' | 'warning';
type FilterType = 'all' | 'expired' | 'critical' | 'warning';

interface Student {
  id: number;
  name: string;
  phone: string;
  class: string;
  remaining: number;
  lastSession: string;
}

const STUDENTS: Student[] = [
  { id: 1, name: 'Lê Văn C',      phone: '0934 567 789', class: 'Intermediate B', remaining: 0, lastSession: '28/04' },
  { id: 2, name: 'Phạm Thị D',    phone: '0945 123 456', class: 'Advanced C',     remaining: 0, lastSession: '29/04' },
  { id: 3, name: 'Nguyễn Test',   phone: '0901 888 999', class: 'Beginner A',     remaining: 1, lastSession: '27/04' },
  { id: 4, name: 'Trần Thị B',    phone: '0912 345 678', class: 'Beginner A',     remaining: 2, lastSession: '30/04' },
  { id: 5, name: 'Hoàng Văn E',   phone: '0923 456 789', class: 'Intermediate B', remaining: 2, lastSession: '26/04' },
];

function getUrgency(remaining: number): UrgencyLevel {
  if (remaining === 0) return 'expired';
  if (remaining === 1) return 'critical';
  return 'warning';
}

const URGENCY_CFG: Record<UrgencyLevel, {
  label: string; subLabel: string;
  border: string; bg: string; strip: string;
  badgeBg: string; badgeText: string; badgeBorder: string;
  avatarBg: string; avatarText: string;
  sessionColor: string;
  btnBg: string; btnText: string; btnShadow: string;
  icon: React.ReactNode;
}> = {
  expired: {
    label: 'Đã hết buổi', subLabel: '0 buổi còn lại',
    border: '#E76F51', bg: 'rgba(231,111,81,0.05)', strip: '#E76F51',
    badgeBg: 'rgba(231,111,81,0.15)', badgeText: '#E76F51', badgeBorder: 'rgba(231,111,81,0.3)',
    avatarBg: 'rgba(231,111,81,0.15)', avatarText: '#E76F51',
    sessionColor: '#E76F51',
    btnBg: 'linear-gradient(135deg,#E76F51,#C85A3D)', btnText: '#fff', btnShadow: '0 4px 14px rgba(231,111,81,0.45)',
    icon: <AlertTriangle className="w-3.5 h-3.5" />,
  },
  critical: {
    label: 'Khẩn cấp', subLabel: '1 buổi còn lại',
    border: '#F4A261', bg: 'rgba(244,162,97,0.05)', strip: '#F4A261',
    badgeBg: 'rgba(244,162,97,0.15)', badgeText: '#D4762A', badgeBorder: 'rgba(244,162,97,0.35)',
    avatarBg: 'rgba(244,162,97,0.18)', avatarText: '#D4762A',
    sessionColor: '#F4A261',
    btnBg: 'linear-gradient(135deg,#F4A261,#D4762A)', btnText: '#fff', btnShadow: '0 4px 14px rgba(244,162,97,0.45)',
    icon: <Zap className="w-3.5 h-3.5" />,
  },
  warning: {
    label: 'Sắp hết', subLabel: '2 buổi còn lại',
    border: '#E9C46A', bg: 'rgba(233,196,106,0.05)', strip: '#E9C46A',
    badgeBg: 'rgba(233,196,106,0.2)', badgeText: '#A07B10', badgeBorder: 'rgba(233,196,106,0.4)',
    avatarBg: 'rgba(233,196,106,0.2)', avatarText: '#A07B10',
    sessionColor: '#C9942A',
    btnBg: 'linear-gradient(135deg,#E9C46A,#C9942A)', btnText: '#fff', btnShadow: '0 4px 14px rgba(233,196,106,0.45)',
    icon: <Clock className="w-3.5 h-3.5" />,
  },
};

const FILTER_OPTS: { id: FilterType; label: string }[] = [
  { id: 'all',      label: 'Tất cả' },
  { id: 'expired',  label: 'Đã hết' },
  { id: 'critical', label: 'Khẩn cấp' },
  { id: 'warning',  label: 'Sắp hết' },
];

export function ReportExpiringScreen({ onBack, onRenew }: ReportExpiringScreenProps) {
  const [filter, setFilter]     = useState<FilterType>('all');
  const [showEmpty, setShowEmpty] = useState(false);

  const expiredCount  = STUDENTS.filter(s => s.remaining === 0).length;
  const criticalCount = STUDENTS.filter(s => s.remaining === 1).length;
  const warningCount  = STUDENTS.filter(s => s.remaining === 2).length;

  const FILTER_COUNTS: Record<FilterType, number> = {
    all:      STUDENTS.length,
    expired:  expiredCount,
    critical: criticalCount,
    warning:  warningCount,
  };

  const FILTER_COLORS: Record<FilterType, string> = {
    all:      '#0E7C7B',
    expired:  '#E76F51',
    critical: '#F4A261',
    warning:  '#C9942A',
  };

  const filtered = showEmpty
    ? []
    : STUDENTS.filter(s => {
        if (filter === 'expired')  return s.remaining === 0;
        if (filter === 'critical') return s.remaining === 1;
        if (filter === 'warning')  return s.remaining === 2;
        return true;
      });

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ══ Header ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #E76F51 0%, #C85A3D 50%, #A04030 100%)' }}
      >
        {/* blobs */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/6 pointer-events-none" />
        <div className="absolute top-12 right-6 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />
        <div className="absolute top-4 -left-4 w-24 h-24 rounded-full bg-black/8 pointer-events-none" />

        {/* top bar */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              Học viên sắp hết buổi
            </h1>
            <p className="text-white/65" style={{ fontSize: '11px' }}>
              Điều kiện: còn từ 0 đến 2 buổi
            </p>
          </div>
          <button
            className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2 active:bg-white/25 transition-colors"
            style={{ fontSize: '11px', fontWeight: 600, color: 'white' }}
          >
            <Download className="w-3.5 h-3.5" />
            Xuất
          </button>
        </div>

        {/* ── Summary card ── */}
        <div className="mx-4 mb-5 bg-white/12 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/15">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white" style={{ fontSize: '14px', fontWeight: 700 }}>
                {STUDENTS.length} học viên cần nhắc gia hạn
              </p>
              <p className="text-white/65" style={{ fontSize: '11px' }}>
                Liên hệ sớm để tăng tỉ lệ gia hạn
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 divide-x divide-white/15">
            {[
              { count: expiredCount,  label: 'Đã hết',    color: '#FFB3A0' },
              { count: criticalCount, label: 'Khẩn cấp',  color: '#FFD4A8' },
              { count: warningCount,  label: 'Sắp hết',   color: '#FFF3C4' },
            ].map((s, i) => (
              <div key={i} className="py-2.5 flex flex-col items-center">
                <p className="text-white" style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1, color: s.color }}>
                  {s.count}
                </p>
                <p className="text-white/60" style={{ fontSize: '10px', marginTop: '2px' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div className="flex-shrink-0 bg-card border-b border-border">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto no-scrollbar">
          {FILTER_OPTS.map(opt => {
            const active = filter === opt.id;
            const color  = FILTER_COLORS[opt.id];
            const count  = FILTER_COUNTS[opt.id];
            return (
              <button
                key={opt.id}
                onClick={() => setFilter(opt.id)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border flex-shrink-0 transition-all active:scale-95"
                style={{
                  borderColor: active ? color : 'var(--border)',
                  background:  active ? color + '15' : 'var(--background)',
                }}
              >
                <span style={{ fontSize: '12px', fontWeight: active ? 700 : 400, color: active ? color : 'var(--muted-foreground)' }}>
                  {opt.label}
                </span>
                <span
                  className="rounded-full w-4 h-4 flex items-center justify-center"
                  style={{
                    fontSize: '10px', fontWeight: 700,
                    background: active ? color + '30' : 'var(--muted)',
                    color: active ? color : 'var(--muted-foreground)',
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}

          {/* toggle empty state for demo */}
          <button
            onClick={() => setShowEmpty(v => !v)}
            className="flex items-center gap-1.5 ml-auto px-3 py-1.5 rounded-xl border border-border flex-shrink-0 text-muted-foreground active:bg-muted/50"
            style={{ fontSize: '11px' }}
          >
            <Filter className="w-3 h-3" />
            {showEmpty ? 'Có dữ liệu' : 'Empty'}
          </button>
        </div>
      </div>

      {/* ══ List ══ */}
      <div className="flex-1 overflow-y-auto">

        {filtered.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center h-full px-8 py-16">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-5"
              style={{ background: 'rgba(42,157,143,0.12)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(42,157,143,0.2)' }}
              >
                <Shield className="w-9 h-9 text-success" />
              </div>
            </div>
            <p className="text-foreground text-center" style={{ fontSize: '17px', fontWeight: 700 }}>
              Không có học viên nào
            </p>
            <p className="text-center text-muted-foreground mt-1.5" style={{ fontSize: '14px' }}>
              sắp hết buổi
            </p>
            <div
              className="mt-5 flex items-center gap-2 px-5 py-3 rounded-2xl"
              style={{ background: 'rgba(42,157,143,0.1)', border: '1px solid rgba(42,157,143,0.25)' }}
            >
              <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
              <p className="text-success" style={{ fontSize: '13px', fontWeight: 600 }}>
                Tình hình lớp học đang ổn!
              </p>
            </div>
            <p className="text-center text-muted-foreground mt-3" style={{ fontSize: '12px' }}>
              Tất cả học viên đều có đủ buổi học.
            </p>
          </div>
        ) : (
          <div className="px-4 py-4 space-y-3">
            {filtered.map((student, index) => {
              const urgency = getUrgency(student.remaining);
              const cfg     = URGENCY_CFG[urgency];

              return (
                <div
                  key={student.id}
                  className="rounded-2xl overflow-hidden border"
                  style={{
                    borderColor: cfg.border + '55',
                    background: cfg.bg,
                    boxShadow: `0 2px 8px ${cfg.border}18`,
                  }}
                >
                  {/* ── urgency strip ── */}
                  <div
                    className="flex items-center gap-1.5 px-3.5 py-1.5"
                    style={{
                      background: cfg.badgeBg,
                      borderBottom: `1px solid ${cfg.badgeBorder}`,
                    }}
                  >
                    <span style={{ color: cfg.badgeText }}>{cfg.icon}</span>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: cfg.badgeText }}>
                      {cfg.label}
                    </span>
                    <span className="ml-auto text-muted-foreground" style={{ fontSize: '10px' }}>
                      Buổi cuối: {student.lastSession}
                    </span>
                  </div>

                  {/* ── card body ── */}
                  <div className="p-3.5">
                    <div className="flex items-center gap-3 mb-3">
                      {/* avatar */}
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border-2"
                        style={{
                          background: cfg.avatarBg,
                          borderColor: cfg.border + '45',
                        }}
                      >
                        <span style={{ fontSize: '18px', fontWeight: 800, color: cfg.avatarText }}>
                          {student.name.charAt(0)}
                        </span>
                      </div>

                      {/* info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <p style={{ fontSize: '15px', fontWeight: 700 }} className="truncate">
                            {student.name}
                          </p>
                          {urgency === 'expired' && (
                            <span
                              className="flex-shrink-0 px-1.5 py-0.5 rounded-full"
                              style={{ fontSize: '9px', fontWeight: 700, background: cfg.badgeBg, color: cfg.badgeText }}
                            >
                              HẾT
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span style={{ fontSize: '12px' }}>{student.phone}</span>
                          <span style={{ fontSize: '12px' }}>·</span>
                          <span
                            className="truncate px-1.5 py-0.5 rounded-full"
                            style={{ fontSize: '11px', fontWeight: 500, background: 'rgba(14,124,123,0.1)', color: '#0E7C7B' }}
                          >
                            {student.class}
                          </span>
                        </div>
                      </div>

                      {/* remaining sessions big number */}
                      <div className="text-right flex-shrink-0">
                        <p
                          style={{
                            fontSize: '36px',
                            fontWeight: 900,
                            lineHeight: 1,
                            color: cfg.sessionColor,
                          }}
                        >
                          {student.remaining}
                        </p>
                        <p className="text-muted-foreground" style={{ fontSize: '10px', marginTop: '1px' }}>
                          buổi còn
                        </p>
                      </div>
                    </div>

                    {/* ── Session dots bar ── */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex-1 h-1.5 rounded-full"
                          style={{
                            background: i < student.remaining
                              ? cfg.sessionColor
                              : 'var(--border)',
                            opacity: i < student.remaining ? 1 : 0.4,
                          }}
                        />
                      ))}
                    </div>

                    {/* ── Actions ── */}
                    <div className="flex gap-2">
                      {/* Call button */}
                      <a
                        href={`tel:${student.phone.replace(/\s/g, '')}`}
                        className="w-11 h-11 flex items-center justify-center rounded-xl border-2 flex-shrink-0 active:scale-95 transition-all"
                        style={{
                          borderColor: cfg.border + '40',
                          background: cfg.avatarBg,
                        }}
                      >
                        <Phone className="w-4.5 h-4.5" style={{ color: cfg.sessionColor, width: '18px', height: '18px' }} />
                      </a>

                      {/* Gia hạn button */}
                      <button
                        onClick={onRenew}
                        className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl text-white active:opacity-80 transition-opacity"
                        style={{
                          background: cfg.btnBg,
                          boxShadow: cfg.btnShadow,
                          fontSize: '13px',
                          fontWeight: 700,
                        }}
                      >
                        <RefreshCw className="w-4 h-4" />
                        Gia hạn ngay
                      </button>

                      {/* Detail button */}
                      <button
                        className="w-11 h-11 flex items-center justify-center rounded-xl border-2 flex-shrink-0 active:scale-95 transition-all"
                        style={{ borderColor: 'var(--border)', background: 'var(--background)' }}
                      >
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── Bottom tip ── */}
            <div
              className="rounded-2xl p-3.5 flex items-start gap-3"
              style={{ background: 'rgba(233,196,106,0.1)', border: '1px solid rgba(233,196,106,0.3)' }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(233,196,106,0.25)' }}
              >
                <Zap className="w-3.5 h-3.5 text-warning" />
              </div>
              <p className="text-muted-foreground" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                <span className="text-warning" style={{ fontWeight: 700 }}>Mẹo: </span>
                Liên hệ học viên sớm nhất có thể để tăng tỉ lệ gia hạn thành công. Ưu tiên nhóm{' '}
                <span style={{ fontWeight: 600, color: '#E76F51' }}>đã hết buổi</span> trước.
              </p>
            </div>

            <div className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
