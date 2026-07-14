import {
  AlertTriangle,
  CalendarDays,
  Clock3,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  TriangleAlert,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  AdminCoachOperations,
  getAdminPeopleOperations,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';
import { MobileDatePicker } from './mobile/MobileDatePicker';
import { MobileSelectOption, MobileSelectSheet } from './mobile/MobileSelectSheet';

interface CoachOperationsScheduleScreenProps {
  onBack: () => void;
}

type UsageStatus = AdminCoachOperations['usageHistory'][number]['status'];
type PeriodMode = 'day' | 'week';

const statusLabel: Record<UsageStatus, string> = {
  scheduled: 'Sắp diễn ra',
  inProgress: 'Đang diễn ra',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const statusClass: Record<UsageStatus, string> = {
  scheduled: 'bg-sky-50 text-sky-700',
  inProgress: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
  cancelled: 'bg-rose-50 text-rose-600',
};

const toIsoDate = (value: string) => {
  const [day, month, year] = value.split('/').map(Number);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

const localIsoToday = () => new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
}).format(new Date());

const isSameWeek = (value: string, selected: string) => {
  const date = new Date(`${value}T00:00:00`);
  const target = new Date(`${selected}T00:00:00`);
  const mondayOffset = (target.getDay() + 6) % 7;
  const monday = new Date(target);
  monday.setDate(target.getDate() - mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return date >= monday && date <= sunday;
};

export function CoachOperationsScheduleScreen({ onBack }: CoachOperationsScheduleScreenProps) {
  const [operations, setOperations] = useState<AdminCoachOperations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [coachId, setCoachId] = useState('all');
  const [court, setCourt] = useState('all');
  const [status, setStatus] = useState<'all' | UsageStatus | 'conflict'>('all');
  const [periodMode, setPeriodMode] = useState<PeriodMode>('day');
  const [selectedDate, setSelectedDate] = useState(localIsoToday());

  useEffect(() => {
    getAdminPeopleOperations()
      .then(data => {
        setOperations(data.coachOperations);
        setSelectedDate(toIsoDate(data.localDate));
      })
      .catch(reason => setError(reason instanceof Error ? reason.message : 'Không thể tải lịch vận hành HLV.'))
      .finally(() => setLoading(false));
  }, []);

  const courts = useMemo(() => Array.from(new Set(
    operations.flatMap(item => item.usageHistory.map(usage => usage.courtName)),
  )).sort(), [operations]);
  const coachOptions = useMemo<MobileSelectOption[]>(() => [
    { value: 'all', label: 'Tất cả HLV' },
    ...operations.map(item => ({
      value: item.coachId,
      label: item.coachName,
      description: item.agreementType === 'hourlyRental'
        ? 'Thuê sân theo giờ'
        : item.agreementType === 'revenueShare'
          ? 'Chia sẻ doanh thu'
          : 'Kết hợp thuê sân và chia sẻ',
    })),
  ], [operations]);
  const courtOptions = useMemo<MobileSelectOption[]>(() => [
    { value: 'all', label: 'Tất cả sân' },
    ...courts.map(item => ({ value: item, label: item })),
  ], [courts]);
  const statusOptions = useMemo<MobileSelectOption[]>(() => [
    { value: 'all', label: 'Tất cả' },
    { value: 'scheduled', label: 'Sắp diễn ra' },
    { value: 'inProgress', label: 'Đang diễn ra' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' },
    { value: 'conflict', label: 'Xung đột', description: 'Lịch trùng sân hoặc khung giờ cần xử lý' },
  ], []);

  const rows = useMemo(() => operations.flatMap(coach => coach.usageHistory.map(usage => ({
    ...usage,
    coachId: coach.coachId,
    coachName: coach.coachName,
    isoDate: toIsoDate(usage.date),
  }))).filter(item => {
    const matchesPeriod = periodMode === 'day'
      ? item.isoDate === selectedDate
      : isSameWeek(item.isoDate, selectedDate);
    const matchesQuery = `${item.coachName} ${item.courtName} ${item.purpose}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = status === 'all' ||
      (status === 'conflict' ? item.hasConflict : item.status === status);
    return matchesPeriod &&
      matchesQuery &&
      (coachId === 'all' || item.coachId === coachId) &&
      (court === 'all' || item.courtName === court) &&
      matchesStatus;
  }).sort((a, b) => `${a.isoDate}${a.timeRange}`.localeCompare(`${b.isoDate}${b.timeRange}`)),
  [coachId, court, operations, periodMode, query, selectedDate, status]);

  if (loading) {
    return <StatePage><LoaderCircle className="h-7 w-7 animate-spin" /><p>Đang tải lịch vận hành...</p></StatePage>;
  }

  if (error) {
    return <StatePage><TriangleAlert className="h-8 w-8 text-rose-500" /><p className="font-bold">Không thể tải lịch vận hành</p><p>{error}</p></StatePage>;
  }

  return (
    <div className="flex h-screen flex-col bg-[#F4F7F7] text-[#172323]">
      <AppScreenHeader title="Lịch vận hành" eyebrow="ADMIN · HOẠT ĐỘNG HLV" onBack={onBack} variant="hero" />
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        <section className="mt-3 rounded-2xl border border-slate-100 bg-white p-3">
          <div className="grid grid-cols-2 rounded-xl bg-slate-50 p-1">
            <button onClick={() => setPeriodMode('day')} className={`h-9 rounded-lg text-xs font-bold ${periodMode === 'day' ? 'bg-[#075B5A] text-white' : 'text-slate-400'}`}>Theo ngày</button>
            <button onClick={() => setPeriodMode('week')} className={`h-9 rounded-lg text-xs font-bold ${periodMode === 'week' ? 'bg-[#075B5A] text-white' : 'text-slate-400'}`}>Theo tuần</button>
          </div>
          <MobileDatePicker value={selectedDate} onChange={setSelectedDate} />
        </section>

        <section className="mt-3 space-y-2">
          <label className="flex h-11 items-center gap-2 rounded-xl border border-slate-100 bg-white px-3">
            <Search className="h-4 w-4 text-slate-300" />
            <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm HLV, sân hoặc mục đích" className="flex-1 bg-transparent text-xs outline-none" />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <MobileSelectSheet
              title="Huấn luyện viên"
              value={coachId}
              options={coachOptions}
              onChange={setCoachId}
              icon={UserRound}
            />
            <MobileSelectSheet
              title="Sân"
              value={court}
              options={courtOptions}
              onChange={setCourt}
              icon={MapPin}
            />
          </div>
          <MobileSelectSheet
            title="Trạng thái"
            value={status}
            options={statusOptions}
            onChange={value => setStatus(value as typeof status)}
            icon={SlidersHorizontal}
          />
        </section>

        <div className="mt-4 flex items-center justify-between">
          <h2 className="text-xs font-black">Lịch sử dụng sân</h2>
          <span className="rounded-full bg-[#E3F6EF] px-2.5 py-1 text-[9px] font-bold text-[#087B62]">{rows.length} lịch</span>
        </div>

        <section className="mt-3 space-y-2">
          {rows.map(item => (
            <article key={`${item.coachId}-${item.id}`} className={`rounded-2xl border bg-white p-4 shadow-sm ${item.hasConflict ? 'border-rose-200' : 'border-slate-100'}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-xs font-black"><UserRound className="h-3.5 w-3.5 text-[#075B5A]" />{item.coachName}</p>
                  <p className="mt-1 truncate text-[10px] font-semibold text-slate-600">{item.purpose}</p>
                </div>
                <span className={`whitespace-nowrap rounded-full px-2 py-1 text-[8px] font-bold ${item.hasConflict ? 'bg-rose-50 text-rose-600' : statusClass[item.status]}`}>
                  {item.hasConflict ? 'Xung đột' : statusLabel[item.status]}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-[9px] text-slate-500">
                <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.courtName}</p>
                <p className="flex items-center gap-1"><CalendarDays className="h-3 w-3" />{item.date}</p>
                <p className="col-span-2 flex items-center gap-1"><Clock3 className="h-3 w-3" />{item.timeRange} · {item.durationHours} giờ</p>
              </div>
              {item.hasConflict && <p className="mt-3 flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-[9px] font-bold text-rose-600"><AlertTriangle className="h-3.5 w-3.5" />Trùng lịch sử dụng trên cùng sân.</p>}
            </article>
          ))}
          {rows.length === 0 && <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">Không có lịch phù hợp với bộ lọc.</div>}
        </section>
      </main>
    </div>
  );
}

function StatePage({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen flex-col items-center justify-center gap-3 bg-[#F4F7F7] px-8 text-center text-xs text-[#075B5A]">{children}</div>;
}
