import {
  BarChart3,
  CalendarDays,
  Clock3,
  LoaderCircle,
  TriangleAlert,
  UsersRound,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AdminOwnerReport,
  getAdminOwnerReports,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';

interface OwnerReportsScreenProps {
  onBack: () => void;
}

export function OwnerReportsScreen({ onBack }: OwnerReportsScreenProps) {
  const [period, setPeriod] = useState<AdminOwnerReport['period']>('month');
  const [data, setData] = useState<AdminOwnerReport | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setError('');
    getAdminOwnerReports(period)
      .then(result => {
        if (active) setData(result);
      })
      .catch(reason => {
        if (active) {
          setError(reason instanceof Error ? reason.message : 'Không thể tải báo cáo vận hành.');
        }
      });
    return () => {
      active = false;
    };
  }, [period]);

  return (
    <div className="min-h-screen bg-[#F4F7F7] pb-24">
      <AppScreenHeader
        title="Vận hành sân và HLV"
        eyebrow="BÁO CÁO · VẬN HÀNH"
        onBack={onBack}
        variant="hero"
      />

      <main className="space-y-5 px-4 py-4">
        <div className="grid grid-cols-3 rounded-xl bg-white p-1 shadow-sm">
          {([
            ['day', 'Ngày'],
            ['week', 'Tuần'],
            ['month', 'Tháng'],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setPeriod(value)}
              className={`h-10 rounded-lg text-xs font-bold ${
                period === value ? 'bg-[#075B5A] text-white' : 'text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {!data && !error && (
          <State icon={<LoaderCircle className="h-7 w-7 animate-spin" />} text="Đang tổng hợp vận hành..." />
        )}
        {error && (
          <State icon={<TriangleAlert className="h-7 w-7 text-rose-500" />} text={error} />
        )}
        {data && !error && (
          <>
            <p className="text-[10px] text-slate-400">
              {data.fromDate} - {data.toDate}
            </p>
            <section className="grid grid-cols-2 gap-3">
              <Metric icon={CalendarDays} label="Booking" value={data.bookingCount.toLocaleString('vi-VN')} />
              <Metric icon={Clock3} label="Giờ sử dụng" value={`${data.totalUsageHours.toLocaleString('vi-VN')} giờ`} />
              <Metric icon={BarChart3} label="Tỷ lệ sử dụng" value={`${data.courtUtilizationRate.toLocaleString('vi-VN')}%`} />
              <Metric icon={UsersRound} label="Buổi HLV" value={data.coachSessionCount.toLocaleString('vi-VN')} />
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black">Khung giờ cao điểm</p>
              <p className="mt-2 text-lg font-black text-[#075B5A]">{data.peakHour}</p>
              <p className="mt-1 text-[10px] text-slate-400">
                Hội viên mới: {data.newMemberCount} · Sắp hết hạn: {data.expiringMemberCount}
              </p>
            </section>

            <section>
              <h2 className="mb-3 text-xs font-black">Mức sử dụng theo sân</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white">
                {data.courts.map(court => (
                  <article
                    key={court.courtName}
                    className="flex items-center justify-between border-b border-slate-100 p-4 last:border-0"
                  >
                    <div>
                      <p className="text-xs font-bold">{court.courtName}</p>
                      <p className="mt-1 text-[9px] text-slate-400">
                        {court.bookingCount} booking · {court.coachSessionCount} buổi HLV
                      </p>
                    </div>
                    <strong className="text-xs text-[#075B5A]">
                      {court.usedHours.toLocaleString('vi-VN')} giờ
                    </strong>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <Icon className="h-4 w-4 text-[#075B5A]" />
      <p className="mt-2 text-[9px] text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-black text-[#075B5A]">{value}</p>
    </div>
  );
}

function State({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl bg-white text-center text-xs text-slate-500">
      {icon}
      {text}
    </div>
  );
}
