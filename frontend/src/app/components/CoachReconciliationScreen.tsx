import {
  Banknote,
  CheckCircle2,
  Clock3,
  Handshake,
  LoaderCircle,
  ReceiptText,
  TriangleAlert,
  WalletCards,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  AdminCoachReconciliation,
  confirmAdminCoachSettlement,
  getAdminCoachReconciliations,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';

interface CoachReconciliationScreenProps {
  onBack: () => void;
  onOpenDebts: () => void;
}

const money = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
const reconciliationLabel = {
  pending: 'Chờ đối soát',
  partial: 'Đã thu một phần',
  reconciled: 'Đã đối soát',
} as const;

export function CoachReconciliationScreen({ onBack, onOpenDebts }: CoachReconciliationScreenProps) {
  const [rows, setRows] = useState<AdminCoachReconciliation[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getAdminCoachReconciliations();
      setRows(data.reconciliations);
      setSelectedId(current => current || data.reconciliations[0]?.coachId || '');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu đối soát HLV.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const selected = rows.find(item => item.coachId === selectedId);
  const totals = useMemo(() => rows.reduce((result, item) => ({
    hours: result.hours + item.usageHours,
    fee: result.fee + item.courtFee,
    revenue: result.revenue + item.revenueShareAmount,
    paid: result.paid + item.paidAmount,
    outstanding: result.outstanding + item.outstandingAmount,
  }), { hours: 0, fee: 0, revenue: 0, paid: 0, outstanding: 0 }), [rows]);

  const confirmSettlement = async () => {
    if (!selected?.settlementId || selected.isConfirmed) return;
    setSaving(true);
    setError('');
    try {
      await confirmAdminCoachSettlement(selected.settlementId);
      setNotice(`Đã chốt kỳ ${selected.period} của ${selected.coachName}. Công nợ còn lại đã được chuyển sang trang Công nợ HLV.`);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể xác nhận kỳ đối soát.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && rows.length === 0) {
    return <StatePage><LoaderCircle className="h-7 w-7 animate-spin" /><p>Đang tải dữ liệu đối soát...</p></StatePage>;
  }

  if (error && rows.length === 0) {
    return <StatePage><TriangleAlert className="h-8 w-8 text-rose-500" /><p className="font-bold">Không thể tải đối soát HLV</p><p>{error}</p></StatePage>;
  }

  return (
    <div className="flex h-screen flex-col bg-[#F4F7F7] text-[#172323]">
      <AppScreenHeader title="Đối soát HLV" eyebrow="ADMIN · CHỐT SỐ LIỆU THEO KỲ" onBack={onBack} variant="hero" />
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {notice && <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">{notice}</p>}
        {error && <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{error}</p>}

        <section className="mt-3 grid grid-cols-2 gap-3">
          <Metric icon={Clock3} label="Tổng giờ sử dụng" value={`${totals.hours.toLocaleString('vi-VN')} giờ`} />
          <Metric icon={WalletCards} label="Phí sân phát sinh" value={money(totals.fee)} danger />
          <Metric icon={Banknote} label="Đã thu" value={money(totals.paid)} />
          <Metric icon={ReceiptText} label="Còn phải thu" value={money(totals.outstanding)} warning />
        </section>

        <section className="mt-3 rounded-2xl bg-[#075B5A] p-4 text-white">
          <p className="text-[10px] text-white/65">Doanh thu cần chia sẻ</p>
          <p className="mt-1 text-xl font-black">{money(totals.revenue)}</p>
        </section>

        <section className="mt-4">
          <h2 className="text-xs font-black">Danh sách HLV cần đối soát</h2>
          <div className="mt-3 space-y-2">
            {rows.map(item => (
              <button key={item.coachId} onClick={() => setSelectedId(item.coachId)} className={`w-full rounded-2xl border bg-white p-4 text-left shadow-sm ${selectedId === item.coachId ? 'border-[#075B5A]' : 'border-slate-100'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-black">{item.coachName}</p>
                    <p className="mt-1 text-[9px] text-slate-400">Kỳ {item.period} · {item.usageHours} giờ · Phí sân {money(item.courtFee)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[8px] font-bold ${item.isConfirmed ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {item.isConfirmed ? 'Đã chốt' : reconciliationLabel[item.reconciliationStatus]}
                  </span>
                </div>
                <div className="mt-3 flex justify-between text-[10px]"><span className="text-slate-400">Còn phải thu</span><strong className="text-amber-600">{money(item.outstandingAmount)}</strong></div>
              </button>
            ))}
          </div>
        </section>

        {selected && (
          <section className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
            <div className="flex items-center justify-between">
              <div><h2 className="text-xs font-black">Chi tiết kỳ {selected.period}</h2><p className="mt-1 text-[9px] text-slate-400">{selected.coachName}</p></div>
              <Handshake className="h-5 w-5 text-[#075B5A]" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Detail label="Số giờ" value={`${selected.usageHours} giờ`} />
              <Detail label="Đơn giá sân" value={money(selected.hourlyCourtRate)} />
              <Detail label="Phí sân" value={money(selected.courtFee)} />
              <Detail label="Doanh thu làm căn cứ" value={money(selected.grossRevenue)} />
              <Detail label="Doanh thu cần chia sẻ" value={money(selected.revenueShareAmount)} />
              <Detail label="Đã thu" value={money(selected.paidAmount)} />
              <Detail label="Còn phải thu" value={money(selected.outstandingAmount)} warning />
            </div>

            {selected.isConfirmed ? (
              <div className="mt-4 rounded-xl bg-emerald-50 p-3">
                <p className="flex items-center gap-2 text-[10px] font-bold text-emerald-700"><CheckCircle2 className="h-4 w-4" />Kỳ đối soát đã được chốt</p>
                <p className="mt-1 text-[9px] text-emerald-600">{selected.confirmedBy} · {selected.confirmedAt}</p>
              </div>
            ) : (
              <button disabled={saving || !selected.settlementId} onClick={() => void confirmSettlement()} className="mt-4 h-11 w-full rounded-xl bg-[#075B5A] text-xs font-black text-white disabled:opacity-50">
                {saving ? 'Đang xác nhận...' : 'Xác nhận chốt đối soát'}
              </button>
            )}

            <button onClick={onOpenDebts} className="mt-3 h-11 w-full rounded-xl border border-[#075B5A] text-xs font-black text-[#075B5A]">
              Mở Công nợ HLV
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({ icon: Icon, label, value, danger, warning }: {
  icon: typeof Clock3;
  label: string;
  value: string;
  danger?: boolean;
  warning?: boolean;
}) {
  return <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><Icon className="h-4 w-4 text-[#075B5A]" /><p className="mt-3 text-[9px] text-slate-400">{label}</p><p className={`mt-1 text-base font-black ${danger ? 'text-rose-500' : warning ? 'text-amber-600' : 'text-[#075B5A]'}`}>{value}</p></div>;
}

function Detail({ label, value, warning }: { label: string; value: string; warning?: boolean }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[9px] text-slate-400">{label}</p><p className={`mt-1 text-[11px] font-black ${warning ? 'text-amber-600' : 'text-slate-700'}`}>{value}</p></div>;
}

function StatePage({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#F4F7F7] px-8 text-center text-xs text-[#075B5A]">{children}</div>;
}
