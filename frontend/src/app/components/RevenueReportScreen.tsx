import {
  ArrowLeft, ChevronLeft, ChevronRight, Download,
  TrendingUp, TrendingDown, CreditCard, Banknote,
  MoreHorizontal, Users, RefreshCw, Layers,
  Receipt, BarChart3, Lock
} from 'lucide-react';
import { useState } from 'react';

interface RevenueReportScreenProps {
  onBack: () => void;
}

/* ── types ── */
type PayMethod = 'transfer' | 'cash' | 'other';
type TabType   = 'transactions' | 'analysis';

interface Transaction {
  id: number;
  date: string;       // DD/MM/YYYY
  dateSort: string;   // YYYY-MM-DD for sorting
  student: string;
  package: string;
  amount: number;
  method: PayMethod;
}

/* ── per-month data ── */
interface MonthData {
  label: string;       // "Tháng 04/2026"
  short: string;       // "T4/26"
  revenue: number;
  payments: number;
  renewals: number;
  transactions: Transaction[];
}

const MONTHS: MonthData[] = [
  {
    label: 'Tháng 01/2026', short: 'T1/26',
    revenue: 8_500_000, payments: 4, renewals: 3,
    transactions: [
      { id: 101, date: '25/01/2026', dateSort: '2026-01-25', student: 'Lê Minh C',   package: 'Gói 12 buổi', amount: 2_400_000, method: 'transfer' },
      { id: 102, date: '18/01/2026', dateSort: '2026-01-18', student: 'Trần Thị B',  package: 'Gói 8 buổi',  amount: 1_600_000, method: 'cash'     },
      { id: 103, date: '10/01/2026', dateSort: '2026-01-10', student: 'Phạm Thị D',  package: 'Gói 16 buổi', amount: 3_200_000, method: 'transfer' },
      { id: 104, date: '03/01/2026', dateSort: '2026-01-03', student: 'Hoàng Văn E', package: 'Gói 8 buổi',  amount: 1_300_000, method: 'cash'     },
    ],
  },
  {
    label: 'Tháng 02/2026', short: 'T2/26',
    revenue: 9_200_000, payments: 4, renewals: 4,
    transactions: [
      { id: 201, date: '22/02/2026', dateSort: '2026-02-22', student: 'Nguyễn Văn A', package: 'Gói 12 buổi', amount: 2_400_000, method: 'transfer' },
      { id: 202, date: '15/02/2026', dateSort: '2026-02-15', student: 'Lê Minh C',    package: 'Gói 8 buổi',  amount: 1_600_000, method: 'cash'     },
      { id: 203, date: '08/02/2026', dateSort: '2026-02-08', student: 'Trần Thị B',   package: 'Gói 16 buổi', amount: 3_200_000, method: 'transfer' },
      { id: 204, date: '02/02/2026', dateSort: '2026-02-02', student: 'Hoàng Văn E',  package: 'Gói 8 buổi',  amount: 2_000_000, method: 'other'    },
    ],
  },
  {
    label: 'Tháng 03/2026', short: 'T3/26',
    revenue: 10_800_000, payments: 5, renewals: 4,
    transactions: [
      { id: 301, date: '28/03/2026', dateSort: '2026-03-28', student: 'Phạm Thị D',   package: 'Gói 16 buổi', amount: 3_200_000, method: 'transfer' },
      { id: 302, date: '20/03/2026', dateSort: '2026-03-20', student: 'Nguyễn Văn A',  package: 'Gói 12 buổi', amount: 2_400_000, method: 'transfer' },
      { id: 303, date: '14/03/2026', dateSort: '2026-03-14', student: 'Hoàng Văn E',   package: 'Gói 8 buổi',  amount: 1_600_000, method: 'cash'     },
      { id: 304, date: '07/03/2026', dateSort: '2026-03-07', student: 'Trần Thị B',    package: 'Gói 12 buổi', amount: 2_400_000, method: 'cash'     },
      { id: 305, date: '01/03/2026', dateSort: '2026-03-01', student: 'Lê Minh C',     package: 'Gói 8 buổi',  amount: 1_200_000, method: 'other'    },
    ],
  },
  {
    label: 'Tháng 04/2026', short: 'T4/26',
    revenue: 12_000_000, payments: 6, renewals: 5,
    transactions: [
      { id: 401, date: '29/04/2026', dateSort: '2026-04-29', student: 'Nguyễn Văn A', package: 'Gói 12 buổi', amount: 2_400_000, method: 'transfer' },
      { id: 402, date: '28/04/2026', dateSort: '2026-04-28', student: 'Trần Thị B',   package: 'Gói 8 buổi',  amount: 1_600_000, method: 'cash'     },
      { id: 403, date: '25/04/2026', dateSort: '2026-04-25', student: 'Lê Minh C',    package: 'Gói 16 buổi', amount: 3_200_000, method: 'transfer' },
      { id: 404, date: '20/04/2026', dateSort: '2026-04-20', student: 'Phạm Thị D',   package: 'Gói 8 buổi',  amount: 1_600_000, method: 'cash'     },
      { id: 405, date: '15/04/2026', dateSort: '2026-04-15', student: 'Hoàng Văn E',  package: 'Gói 12 buổi', amount: 2_400_000, method: 'transfer' },
      { id: 406, date: '10/04/2026', dateSort: '2026-04-10', student: 'Nguyễn Văn A', package: 'Gói 8 buổi',  amount: 800_000,   method: 'cash'     },
    ],
  },
];

function formatVND(n: number) {
  return n.toLocaleString('vi-VN') + '₫';
}

function formatVNDShort(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K';
  return String(n);
}

const METHOD_CFG: Record<PayMethod, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  transfer: { label: 'Chuyển khoản', color: '#0E7C7B', bg: 'rgba(14,124,123,0.12)', icon: <CreditCard  style={{ width: 13, height: 13 }} /> },
  cash:     { label: 'Tiền mặt',     color: '#2A9D8F', bg: 'rgba(42,157,143,0.12)', icon: <Banknote    style={{ width: 13, height: 13 }} /> },
  other:    { label: 'Khác',         color: '#F4A261', bg: 'rgba(244,162,97,0.12)', icon: <MoreHorizontal style={{ width: 13, height: 13 }} /> },
};

/* package breakdown */
function buildPackageStats(txns: Transaction[]) {
  const map: Record<string, { count: number; total: number; color: string }> = {
    'Gói 8 buổi':  { count: 0, total: 0, color: '#2A9D8F' },
    'Gói 12 buổi': { count: 0, total: 0, color: '#0E7C7B' },
    'Gói 16 buổi': { count: 0, total: 0, color: '#F4A261' },
  };
  for (const t of txns) {
    if (map[t.package]) {
      map[t.package].count++;
      map[t.package].total += t.amount;
    }
  }
  const grand = txns.reduce((s, t) => s + t.amount, 0);
  return Object.entries(map).map(([pkg, v]) => ({
    pkg, ...v,
    pct: grand > 0 ? Math.round((v.total / grand) * 100) : 0,
  }));
}

/* mini bar chart data */
function buildBarData(monthIdx: number) {
  const start = Math.max(0, monthIdx - 3);
  return MONTHS.slice(start, monthIdx + 1).map(m => ({
    short: m.short,
    revenue: m.revenue,
    isCurrent: m.label === MONTHS[monthIdx].label,
  }));
}

export function RevenueReportScreen({ onBack }: RevenueReportScreenProps) {
  const [monthIdx, setMonthIdx] = useState(3); // default Tháng 04/2026
  const [tab, setTab]           = useState<TabType>('transactions');

  const current  = MONTHS[monthIdx];
  const prev     = MONTHS[monthIdx - 1];
  const growth   = prev ? ((current.revenue - prev.revenue) / prev.revenue) * 100 : null;
  const diffAmt  = prev ? current.revenue - prev.revenue : null;
  const barData  = buildBarData(monthIdx);
  const maxRev   = Math.max(...barData.map(b => b.revenue));
  const pkgStats = buildPackageStats(current.transactions);

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ══ Header ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #054A49 0%, #075E5D 45%, #0E7C7B 100%)' }}
      >
        {/* decorative */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-14 -right-4 w-24 h-24 rounded-full bg-white/4 pointer-events-none" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full bg-black/8 pointer-events-none" />

        {/* top bar */}
        <div className="flex items-center gap-3 px-4 pt-10 pb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Doanh thu tháng</h1>
            <div className="flex items-center gap-1 text-white/50" style={{ fontSize: '10px' }}>
              <Lock className="w-3 h-3" />
              <span>Chỉ dành cho Admin</span>
            </div>
          </div>
          <button
            className="flex items-center gap-1.5 bg-white/15 rounded-xl px-3 py-2 active:bg-white/25 transition-colors"
            style={{ fontSize: '11px', fontWeight: 600, color: 'white' }}
          >
            <Download className="w-3.5 h-3.5" />
            Xuất
          </button>
        </div>

        {/* ── Month Selector ── */}
        <div className="flex items-center justify-between px-4 py-1 mb-1">
          <button
            onClick={() => setMonthIdx(i => Math.max(0, i - 1))}
            disabled={monthIdx === 0}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <span className="text-white" style={{ fontSize: '15px', fontWeight: 700 }}>
            {current.label}
          </span>
          <button
            onClick={() => setMonthIdx(i => Math.min(MONTHS.length - 1, i + 1))}
            disabled={monthIdx === MONTHS.length - 1}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>

        {/* ── Big revenue ── */}
        <div className="px-4 pb-2 text-center">
          <p className="text-white/60" style={{ fontSize: '12px', fontWeight: 500 }}>Tổng thu</p>
          <p className="text-white" style={{ fontSize: '40px', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-1px' }}>
            {formatVND(current.revenue)}
          </p>
          {growth !== null && diffAmt !== null && (
            <div className="flex items-center justify-center gap-1.5 mt-1">
              {growth >= 0
                ? <TrendingUp  className="w-3.5 h-3.5 text-emerald-300" />
                : <TrendingDown className="w-3.5 h-3.5 text-red-300" />
              }
              <span
                style={{ fontSize: '12px', fontWeight: 600, color: growth >= 0 ? '#6EE7B7' : '#FCA5A5' }}
              >
                {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% so với tháng trước
              </span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                ({growth >= 0 ? '+' : ''}{formatVNDShort(diffAmt)})
              </span>
            </div>
          )}
        </div>

        {/* ── 3 stats ── */}
        <div className="grid grid-cols-3 gap-2.5 px-4 pb-5 mt-3">
          {[
            { icon: Receipt,   value: current.payments, label: 'Lượt thanh toán' },
            { icon: RefreshCw, value: current.renewals, label: 'Học viên gia hạn' },
            { icon: BarChart3, value: formatVNDShort(Math.round(current.revenue / current.renewals)), label: 'TB/học viên' },
          ].map(({ icon: Icon, value, label }, i) => (
            <div key={i} className="bg-white/12 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
              <div className="flex items-center gap-1 mb-1">
                <Icon className="w-3 h-3 text-white/60" />
                <span className="text-white/60" style={{ fontSize: '9px', fontWeight: 500 }}>{label}</span>
              </div>
              <p className="text-white" style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="flex-shrink-0 bg-card border-b border-border px-4 pt-1">
        <div className="flex gap-0">
          {([
            { id: 'transactions', label: 'Giao dịch',  icon: Receipt   },
            { id: 'analysis',     label: 'Phân tích',  icon: BarChart3 },
          ] as { id: TabType; label: string; icon: React.ElementType }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors"
              style={{
                borderColor: tab === t.id ? '#0E7C7B' : 'transparent',
                color: tab === t.id ? '#0E7C7B' : 'var(--muted-foreground)',
              }}
            >
              <t.icon style={{ width: 15, height: 15 }} />
              <span style={{ fontSize: '13px', fontWeight: tab === t.id ? 700 : 400 }}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto">

        {tab === 'transactions' ? (
          /* ── Transaction list ── */
          <div className="px-4 py-4 space-y-3">
            {/* count label */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                {current.transactions.length} giao dịch
              </span>
              <span className="text-primary" style={{ fontSize: '12px', fontWeight: 600 }}>
                Mới nhất trước
              </span>
            </div>

            {current.transactions.map((txn, idx) => {
              const mc  = METHOD_CFG[txn.method];
              const isFirst = idx === 0;

              return (
                <div
                  key={txn.id}
                  className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm"
                  style={isFirst ? { borderColor: 'rgba(14,124,123,0.3)', boxShadow: '0 2px 12px rgba(14,124,123,0.1)' } : {}}
                >
                  {isFirst && (
                    <div className="flex items-center gap-1.5 px-4 py-1.5 border-b border-border/50"
                      style={{ background: 'rgba(14,124,123,0.06)' }}>
                      <span style={{ fontSize: '10px', fontWeight: 700, color: '#0E7C7B' }}>⭐ Gần nhất</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 px-4 py-3.5">
                    {/* Date badge */}
                    <div
                      className="flex-shrink-0 w-12 rounded-xl flex flex-col items-center py-2 border"
                      style={{ background: 'rgba(14,124,123,0.07)', borderColor: 'rgba(14,124,123,0.2)' }}
                    >
                      <span className="text-primary" style={{ fontSize: '16px', fontWeight: 800, lineHeight: 1 }}>
                        {txn.date.slice(0, 2)}
                      </span>
                      <span className="text-muted-foreground" style={{ fontSize: '9px', fontWeight: 500 }}>
                        /{txn.date.slice(3, 5)}
                      </span>
                    </div>

                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(14,124,123,0.12)' }}
                    >
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#0E7C7B' }}>
                        {txn.student.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate" style={{ fontSize: '14px', fontWeight: 700 }}>{txn.student}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Layers className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{txn.package}</span>
                      </div>
                    </div>

                    {/* Right: amount + method */}
                    <div className="text-right flex-shrink-0">
                      <p style={{ fontSize: '15px', fontWeight: 800, color: '#0E7C7B' }}>
                        {formatVND(txn.amount)}
                      </p>
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full mt-1"
                        style={{ fontSize: '10px', fontWeight: 600, background: mc.bg, color: mc.color }}
                      >
                        {mc.icon}
                        {mc.label}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* ── Monthly total footer ── */}
            <div
              className="rounded-2xl p-4 border"
              style={{ background: 'rgba(14,124,123,0.06)', borderColor: 'rgba(14,124,123,0.25)' }}
            >
              <div className="flex items-center justify-between mb-2">
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Tổng {current.label}</span>
                <span style={{ fontSize: '20px', fontWeight: 900, color: '#0E7C7B' }}>
                  {formatVND(current.revenue)}
                </span>
              </div>

              {/* Method breakdown */}
              <div className="flex gap-2 flex-wrap">
                {(['transfer','cash','other'] as PayMethod[]).map(m => {
                  const mc    = METHOD_CFG[m];
                  const txns  = current.transactions.filter(t => t.method === m);
                  const total = txns.reduce((s, t) => s + t.amount, 0);
                  if (!total) return null;
                  return (
                    <div
                      key={m}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                      style={{ background: mc.bg }}
                    >
                      <span style={{ color: mc.color }}>{mc.icon}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: mc.color }}>
                        {formatVNDShort(total)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="h-4" />
          </div>
        ) : (
          /* ── Analysis tab ── */
          <div className="px-4 py-4 space-y-4">

            {/* Trend bar chart */}
            <div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Xu hướng doanh thu
              </p>
              <div className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                <div className="flex items-end gap-3 h-32">
                  {barData.map((b, i) => {
                    const heightPct = Math.round((b.revenue / maxRev) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                        {/* value */}
                        <span
                          style={{ fontSize: '10px', fontWeight: 700, color: b.isCurrent ? '#0E7C7B' : 'var(--muted-foreground)', whiteSpace: 'nowrap' }}
                        >
                          {formatVNDShort(b.revenue)}
                        </span>
                        {/* bar */}
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className="w-full rounded-t-xl transition-all"
                            style={{
                              height: `${heightPct}%`,
                              minHeight: '8px',
                              background: b.isCurrent
                                ? 'linear-gradient(180deg,#0E7C7B,#2A9D8F)'
                                : 'rgba(14,124,123,0.18)',
                              boxShadow: b.isCurrent ? '0 -2px 8px rgba(14,124,123,0.35)' : 'none',
                            }}
                          />
                        </div>
                        {/* label */}
                        <span style={{ fontSize: '10px', fontWeight: b.isCurrent ? 700 : 400, color: b.isCurrent ? '#0E7C7B' : 'var(--muted-foreground)' }}>
                          {b.short}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Package breakdown */}
            <div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Phân tích theo gói học
              </p>
              <div className="bg-card rounded-2xl border border-border p-4 shadow-sm space-y-3.5">
                {pkgStats.map(s => (
                  <div key={s.pkg}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                        <span style={{ fontSize: '13px', fontWeight: 600 }}>{s.pkg}</span>
                        <span className="text-muted-foreground" style={{ fontSize: '11px' }}>
                          ({s.count} lượt)
                        </span>
                      </div>
                      <div className="text-right">
                        <span style={{ fontSize: '13px', fontWeight: 700, color: s.color }}>
                          {formatVND(s.total)}
                        </span>
                        <span className="text-muted-foreground ml-1.5" style={{ fontSize: '11px' }}>
                          {s.pct}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${s.pct}%`, background: s.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment method breakdown */}
            <div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Phương thức thanh toán
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {(['transfer','cash','other'] as PayMethod[]).map(m => {
                  const mc    = METHOD_CFG[m];
                  const txns  = current.transactions.filter(t => t.method === m);
                  const total = txns.reduce((s, t) => s + t.amount, 0);
                  const pct   = current.revenue > 0 ? Math.round((total / current.revenue) * 100) : 0;
                  return (
                    <div
                      key={m}
                      className="rounded-2xl p-3 border"
                      style={{ background: mc.bg, borderColor: mc.color + '30' }}
                    >
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                        style={{ background: mc.color + '20', color: mc.color }}
                      >
                        {mc.icon}
                      </div>
                      <p style={{ fontSize: '18px', fontWeight: 800, color: mc.color, lineHeight: 1 }}>{pct}%</p>
                      <p style={{ fontSize: '10px', fontWeight: 600, color: mc.color, opacity: 0.8, marginTop: 2 }}>
                        {mc.label}
                      </p>
                      <p className="text-muted-foreground mt-1" style={{ fontSize: '10px' }}>
                        {formatVNDShort(total)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary table */}
            <div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tổng quan {current.label}
              </p>
              <div
                className="rounded-2xl border p-4"
                style={{ background: 'rgba(14,124,123,0.05)', borderColor: 'rgba(14,124,123,0.2)' }}
              >
                {[
                  { label: 'Tổng thu',           value: formatVND(current.revenue),                               bold: true,  highlight: '#0E7C7B' },
                  { label: 'Số lượt thanh toán',  value: `${current.payments} giao dịch`,                        bold: false, highlight: '' },
                  { label: 'Học viên gia hạn',    value: `${current.renewals} học viên`,                          bold: false, highlight: '' },
                  { label: 'TB/học viên',          value: formatVND(Math.round(current.revenue / current.renewals)), bold: false, highlight: '' },
                  ...(growth !== null && diffAmt !== null ? [{
                    label: 'So với tháng trước',
                    value: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% (${growth >= 0 ? '+' : ''}${formatVNDShort(diffAmt)})`,
                    bold: true,
                    highlight: growth >= 0 ? '#2A9D8F' : '#E76F51',
                  }] : []),
                ].map((row, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2.5 border-b border-border/40 last:border-0"
                  >
                    <span className="text-muted-foreground" style={{ fontSize: '13px' }}>{row.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: row.bold ? 700 : 500, color: row.highlight || 'var(--foreground)' }}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Coach performance */}
            <div>
              <p className="text-muted-foreground mb-3" style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Học viên gia hạn nhiều nhất
              </p>
              <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
                {Object.entries(
                  current.transactions.reduce((acc, t) => {
                    acc[t.student] = (acc[t.student] || 0) + t.amount;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([name, total], i) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-0"
                    >
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white"
                        style={{ fontSize: '11px', fontWeight: 800, background: i === 0 ? '#F4A261' : i === 1 ? '#9CA3AF' : '#CD7F32' }}
                      >
                        {i + 1}
                      </span>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(14,124,123,0.12)' }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0E7C7B' }}>{name.charAt(0)}</span>
                      </div>
                      <span className="flex-1" style={{ fontSize: '13px', fontWeight: 600 }}>{name}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0E7C7B' }}>{formatVND(total)}</span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
