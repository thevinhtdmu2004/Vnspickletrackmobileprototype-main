import {
  AlertTriangle, TrendingUp, Users, DollarSign,
  ChevronRight, BarChart3, Calendar, UserCircle
} from 'lucide-react';

interface ReportsPageProps {
  onNavigate?: (screen: string) => void;
  role?:       'admin' | 'coach' | 'member';
}

export function ReportsPage({ onNavigate, role = 'admin' }: ReportsPageProps) {
  const nav      = (s: string) => onNavigate?.(s);
  const isAdmin  = role === 'admin';

  return (
    <div className="flex flex-col gap-4 pb-24">

      {/* ── Header ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="px-4 pt-10 pb-6">
          <p className="text-white/60 mb-0.5" style={{ fontSize: '11px', fontWeight: 500 }}>VNS PickleTrack</p>
          <h1 className="text-white" style={{ fontSize: '22px', fontWeight: 800 }}>Báo cáo</h1>
          <p className="text-white/55 mt-0.5" style={{ fontSize: '12px' }}>Tháng 04/2026</p>
        </div>

        {/* summary strip */}
        <div className="grid border-t border-white/15 divide-x divide-white/15"
             style={{ gridTemplateColumns: isAdmin ? 'repeat(4,1fr)' : 'repeat(3,1fr)' }}>
          {[
            { val: '42',  label: 'Học viên',    color: 'white',   show: true    },
            { val: '328', label: 'Buổi học',    color: 'white',   show: true    },
            { val: '12M', label: 'Doanh thu',   color: '#FFD4A8', show: isAdmin },
            { val: '5',   label: 'Cần gia hạn', color: '#FFB3A0', show: true    },
          ].filter(s => s.show).map((s, i) => (
            <div key={i} className="py-3 text-center">
              <p className="text-white" style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1, color: s.color }}>{s.val}</p>
              <p className="text-white/50" style={{ fontSize: '9px', marginTop: 2 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* ── Quick Report Cards ── */}
        <div>
          <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Báo cáo nhanh
          </p>

          {/* Sắp hết buổi */}
          <button
            onClick={() => nav('report-expiring')}
            className="w-full flex items-center gap-3.5 bg-card rounded-2xl border overflow-hidden mb-3 active:scale-[0.98] transition-all shadow-sm"
            style={{ borderColor: 'rgba(231,111,81,0.3)' }}
          >
            <div
              className="w-1.5 self-stretch flex-shrink-0"
              style={{ background: 'linear-gradient(180deg,#F4A261,#E76F51)' }}
            />
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 my-3.5"
              style={{ background: 'rgba(231,111,81,0.12)' }}
            >
              <AlertTriangle style={{ width: 20, height: 20, color: '#E76F51' }} />
            </div>
            <div className="flex-1 text-left py-3.5">
              <div className="flex items-center gap-2 mb-0.5">
                <p style={{ fontSize: '14px', fontWeight: 700 }}>Học viên sắp hết buổi</p>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(231,111,81,0.15)', color: '#E76F51' }}
                >
                  5 HV
                </span>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Còn từ 0 đến 2 buổi · Cần nhắc gia hạn</p>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#E76F51', marginRight: 14, flexShrink: 0 }} />
          </button>

          {/* Doanh thu tháng — Admin only */}
          {isAdmin && (
          <button
            onClick={() => nav('report-revenue')}
            className="w-full flex items-center gap-3.5 bg-card rounded-2xl border overflow-hidden active:scale-[0.98] transition-all shadow-sm"
            style={{ borderColor: 'rgba(14,124,123,0.28)' }}
          >
            <div
              className="w-1.5 self-stretch flex-shrink-0"
              style={{ background: 'linear-gradient(180deg,#0E7C7B,#2A9D8F)' }}
            />
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 my-3.5"
              style={{ background: 'rgba(14,124,123,0.12)' }}
            >
              <DollarSign style={{ width: 20, height: 20, color: '#0E7C7B' }} />
            </div>
            <div className="flex-1 text-left py-3.5">
              <div className="flex items-center gap-2 mb-0.5">
                <p style={{ fontSize: '14px', fontWeight: 700 }}>Doanh thu tháng</p>
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{ fontSize: '10px', fontWeight: 700, background: 'rgba(14,124,123,0.12)', color: '#0E7C7B' }}
                >
                  Admin
                </span>
              </div>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>12.000.000₫ · 6 giao dịch · Tháng 04/2026</p>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#0E7C7B', marginRight: 14, flexShrink: 0 }} />
          </button>
          )}

          {/* Lượt học tháng */}
          <button
            onClick={() => nav('monthly-report')}
            className="w-full flex items-center gap-3.5 bg-card rounded-2xl border overflow-hidden mt-3 active:scale-[0.98] transition-all shadow-sm"
            style={{ borderColor: 'rgba(42,157,143,0.28)' }}
          >
            <div className="w-1.5 self-stretch flex-shrink-0" style={{ background: 'linear-gradient(180deg,#2A9D8F,#0E7C7B)' }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 my-3.5" style={{ background: 'rgba(42,157,143,0.12)' }}>
              <BarChart3 style={{ width: 20, height: 20, color: '#2A9D8F' }} />
            </div>
            <div className="flex-1 text-left py-3.5">
              <p style={{ fontSize: '14px', fontWeight: 700 }}>Lượt học tháng</p>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>60 buổi · Tỷ lệ 88% · Tháng 04/2026</p>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#2A9D8F', marginRight: 14, flexShrink: 0 }} />
          </button>

          {/* Báo cáo theo lớp */}
          <button
            onClick={() => nav('class-report')}
            className="w-full flex items-center gap-3.5 bg-card rounded-2xl border overflow-hidden mt-3 active:scale-[0.98] transition-all shadow-sm"
            style={{ borderColor: 'rgba(129,90,213,0.28)' }}
          >
            <div className="w-1.5 self-stretch flex-shrink-0" style={{ background: 'linear-gradient(180deg,#815AD5,#6B46C1)' }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 my-3.5" style={{ background: 'rgba(129,90,213,0.12)' }}>
              <Users style={{ width: 20, height: 20, color: '#815AD5' }} />
            </div>
            <div className="flex-1 text-left py-3.5">
              <p style={{ fontSize: '14px', fontWeight: 700 }}>Báo cáo theo lớp</p>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Xem chi tiết từng lớp · Ranking học viên</p>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#815AD5', marginRight: 14, flexShrink: 0 }} />
          </button>

          {/* Báo cáo học viên */}
          <button
            onClick={() => nav('student-report')}
            className="w-full flex items-center gap-3.5 bg-card rounded-2xl border overflow-hidden mt-3 active:scale-[0.98] transition-all shadow-sm"
            style={{ borderColor: 'rgba(244,162,97,0.28)' }}
          >
            <div className="w-1.5 self-stretch flex-shrink-0" style={{ background: 'linear-gradient(180deg,#F4A261,#E9C46A)' }} />
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 my-3.5" style={{ background: 'rgba(244,162,97,0.12)' }}>
              <UserCircle style={{ width: 20, height: 20, color: '#F4A261' }} />
            </div>
            <div className="flex-1 text-left py-3.5">
              <p style={{ fontSize: '14px', fontWeight: 700 }}>Báo cáo học viên</p>
              <p className="text-muted-foreground" style={{ fontSize: '11px' }}>Lịch sử điểm danh cá nhân · Tư vấn học viên</p>
            </div>
            <ChevronRight style={{ width: 16, height: 16, color: '#F4A261', marginRight: 14, flexShrink: 0 }} />
          </button>
        </div>

        {/* ── Attendance rate ── */}
        <div>
          <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Tỷ lệ điểm danh tháng 4
          </p>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Trung bình</p>
                <p style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1, color: '#2A9D8F' }}>92%</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Có mặt</p>
                <p style={{ fontSize: '18px', fontWeight: 700 }}>302</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Vắng</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#E76F51' }}>26</p>
              </div>
            </div>
            <div className="h-2.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{ width: '92%', background: 'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }}
              />
            </div>
          </div>
        </div>

        {/* ── Top classes ── */}
        <div>
          <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Lớp học phổ biến
          </p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {[
              { name: 'Beginner A',      count: 14, pct: 85, color: '#0E7C7B' },
              { name: 'Intermediate B',  count: 11, pct: 70, color: '#2A9D8F' },
              { name: 'Advanced C',      count: 8,  pct: 55, color: '#F4A261' },
            ].map((cls, i) => (
              <div key={i} className={`px-4 py-3.5 ${i < 2 ? 'border-b border-border/60' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar style={{ width: 14, height: 14, color: cls.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{cls.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: cls.color }}>{cls.count} HV</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${cls.pct}%`, background: cls.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Monthly trend — Admin only ── */}
        {isAdmin && (
        <div>
          <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Xu hướng 4 tháng
          </p>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-end gap-3 h-24">
              {[
                { month: 'T1', val: 8.5,  pct: 70 },
                { month: 'T2', val: 9.2,  pct: 76 },
                { month: 'T3', val: 10.8, pct: 88 },
                { month: 'T4', val: 12.0, pct: 100 },
              ].map((b, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <span className="text-muted-foreground" style={{ fontSize: '10px', fontWeight: i === 3 ? 700 : 400, color: i === 3 ? '#0E7C7B' : undefined }}>
                    {b.val}M
                  </span>
                  <div className="w-full flex-1 flex items-end">
                    <div
                      className="w-full rounded-t-xl"
                      style={{
                        height: `${b.pct}%`, minHeight: 8,
                        background: i === 3 ? 'linear-gradient(180deg,#0E7C7B,#2A9D8F)' : 'rgba(14,124,123,0.2)',
                        boxShadow: i === 3 ? '0 -2px 8px rgba(14,124,123,0.3)' : 'none',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: i === 3 ? 700 : 400, color: i === 3 ? '#0E7C7B' : 'var(--muted-foreground)' }}>
                    {b.month}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/60">
              <span className="text-muted-foreground" style={{ fontSize: '12px' }}>Tổng 4 tháng</span>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0E7C7B' }}>40.500.000₫</span>
            </div>
          </div>
        </div>
        )}

        {/* ── Full report btn — Admin only ── */}
        {isAdmin && (
        <button
          onClick={() => nav('report-revenue')}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white active:opacity-85 transition-opacity"
          style={{
            background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
            boxShadow: '0 4px 16px rgba(14,124,123,0.36)',
            fontSize: '14px', fontWeight: 700,
          }}
        >
          <BarChart3 style={{ width: 18, height: 18 }} />
          Xem báo cáo doanh thu chi tiết
        </button>
        )}
      </div>
    </div>
  );
}