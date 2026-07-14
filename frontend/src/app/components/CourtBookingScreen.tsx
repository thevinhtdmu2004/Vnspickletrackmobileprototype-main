import {
  CalendarDays,
  Check,
  ChevronLeft,
  Clock3,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from 'lucide-react';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import {
  AdminCourt,
  AdminCourtBooking,
  AdminCourtScheduleItem,
  AdminCourtOperations,
  AdminBookingInvoice,
  createAdminCourtBooking,
  getAdminCourtBooking,
  getAdminCourtBookingInvoice,
  getAdminCourtOperations,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';
import { MobileDatePicker } from './mobile/MobileDatePicker';
import { MobileSelectSheet } from './mobile/MobileSelectSheet';
import { MobileTimePicker } from './mobile/MobileTimePicker';

interface CourtBookingScreenProps {
  onBack: () => void;
  initialBookingId?: string | null;
  onInitialBookingConsumed?: () => void;
}

type ScreenMode =
  | { type: 'schedule' }
  | { type: 'create'; court: AdminCourt; date: string; startTime: string }
  | { type: 'detail'; booking: AdminCourtBooking }
  | { type: 'usage-detail'; item: AdminCourtScheduleItem };

const START_HOUR = 5;
const END_HOUR = 23;
const SLOT_MINUTES = 30;
const SLOT_HEIGHT = 34;
const COURT_WIDTH = 112;
const TIME_WIDTH = 48;

const money = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

const statusStyle: Record<
  AdminCourtBooking['status'],
  { label: string; color: string; background: string; border: string }
> = {
  pending: {
    label: 'Chờ xác nhận',
    color: '#A86600',
    background: '#FFF3D8',
    border: '#F4A261',
  },
  confirmed: {
    label: 'Đã xác nhận',
    color: '#0E7C7B',
    background: '#DFF4F3',
    border: '#2A9D8F',
  },
  playing: {
    label: 'Đang chơi',
    color: '#075E5D',
    background: '#CDEBE9',
    border: '#0E7C7B',
  },
  completed: {
    label: 'Đã hoàn thành',
    color: '#4B5563',
    background: '#E9EDF1',
    border: '#9CA3AF',
  },
  cancelled: {
    label: 'Đã hủy',
    color: '#B0442D',
    background: '#FCE8E4',
    border: '#E76F51',
  },
  maintenance: {
    label: 'Bảo trì',
    color: '#9F2D35',
    background: '#FDE8EA',
    border: '#D84A55',
  },
};

function canCreateBookingOnCourt(court: AdminCourt) {
  return court.status === 'available' || court.status === 'reserved' || court.status === 'occupied';
}

export function CourtBookingScreen({
  onBack,
  initialBookingId,
  onInitialBookingConsumed,
}: CourtBookingScreenProps) {
  const today = toIsoDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [data, setData] = useState<AdminCourtOperations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<ScreenMode>({ type: 'schedule' });

  const loadSchedule = useCallback(async (date: string) => {
    setLoading(true);
    setError('');
    try {
      setData(await getAdminCourtOperations(date));
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Không thể tải lịch đặt sân.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSchedule(selectedDate);
  }, [loadSchedule, selectedDate]);

  useEffect(() => {
    if (!initialBookingId) return;
    let active = true;
    getAdminCourtBooking(initialBookingId)
      .then(booking => {
        if (active) setMode({ type: 'detail', booking });
      })
      .finally(() => onInitialBookingConsumed?.());
    return () => { active = false; };
  }, [initialBookingId, onInitialBookingConsumed]);

  if (mode.type === 'create' && data) {
    return (
      <CreateBookingScreen
        court={mode.court}
        courts={data.courts}
        date={mode.date}
        startTime={mode.startTime}
        onBack={() => setMode({ type: 'schedule' })}
        onCreated={async booking => {
          await loadSchedule(selectedDate);
          setMode({ type: 'detail', booking });
        }}
      />
    );
  }

  if (mode.type === 'detail') {
    return (
      <BookingDetailScreen
        booking={mode.booking}
        onBack={() => setMode({ type: 'schedule' })}
      />
    );
  }

  if (mode.type === 'usage-detail') {
    return (
      <CourtUsageDetailScreen
        item={mode.item}
        onBack={() => setMode({ type: 'schedule' })}
      />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <div>
        <AppScreenHeader
          title="Lịch đặt sân"
          eyebrow="Quản lý sân"
          onBack={onBack}
          variant="list"
          action={<button
            onClick={() => data && setMode({
              type: 'create',
              court: data.courts[0],
              date: selectedDate,
              startTime: '17:00',
            })}
            disabled={!data}
            className="flex h-9 items-center gap-1.5 rounded-xl bg-white/15 px-3 text-xs font-bold text-white disabled:opacity-40"
          >
            <Plus className="w-4 h-4" /> Booking
          </button>}
        />

        {data && (
          <div className="grid grid-cols-3 gap-2 px-4 pt-3">
            <Metric label="Sân trống" value={`${data.availableCourtCount}/${data.courtCount}`} />
            <Metric label="Booking" value={data.bookingCount} />
            <Metric
              label="Dự thu"
              value={`${Math.round(data.expectedRevenue / 1000).toLocaleString('vi-VN')}K`}
            />
          </div>
        )}
      </div>

      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <DateStrip
          selectedDate={selectedDate}
          onSelect={date => {
            setMode({ type: 'schedule' });
            setSelectedDate(date);
          }}
        />

        <Legend />

        {loading ? (
          <div className="h-80 flex flex-col items-center justify-center text-muted-foreground">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
            <p className="text-sm mt-3">Đang tải lịch sân...</p>
          </div>
        ) : error || !data ? (
          <div className="h-80 flex flex-col items-center justify-center text-center">
            <p className="text-sm text-destructive">{error || 'Không có dữ liệu lịch.'}</p>
            <button
              onClick={() => void loadSchedule(selectedDate)}
              className="mt-3 px-4 py-2 rounded-xl bg-primary text-white text-sm font-bold"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <ScheduleGrid
            data={data}
            onEmptySlot={(court, startTime) =>
              setMode({ type: 'create', court, date: selectedDate, startTime })
            }
            onScheduleItem={item => {
              if (item.sourceType === 'booking') {
                const booking = data.bookings.find(row => row.id === item.sourceId);
                if (booking) {
                  setMode({ type: 'detail', booking });
                  return;
                }
              }
              setMode({ type: 'usage-detail', item });
            }}
          />
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-3">
      <p className="text-lg font-extrabold text-primary leading-none">{value}</p>
      <p className="text-[10px] text-muted-foreground mt-1.5">{label}</p>
    </div>
  );
}

function DateStrip({
  selectedDate,
  onSelect,
}: {
  selectedDate: string;
  onSelect: (date: string) => void;
}) {
  const selected = fromIsoDate(selectedDate);
  const dates = Array.from({ length: 7 }, (_, index) => addDays(selected, index - 3));
  const monthLabel = selected.toLocaleDateString('vi-VN', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">Ngày đang chọn</p>
          <h2 className="font-extrabold capitalize">{monthLabel}</h2>
        </div>
        <button
          onClick={() => onSelect(toIsoDate(new Date()))}
          className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold"
        >
          Hôm nay
        </button>
      </div>
      <MobileDatePicker
        label="Chọn ngày, tháng, năm"
        value={selectedDate}
        onChange={onSelect}
      />
      <div className="grid grid-cols-7 gap-1.5">
        {dates.map(date => {
          const iso = toIsoDate(date);
          const active = iso === selectedDate;
          return (
            <button
              key={iso}
              onClick={() => onSelect(iso)}
              className="rounded-xl py-2 border text-center"
              style={{
                color: active ? 'white' : 'var(--foreground)',
                background: active ? '#0E7C7B' : 'var(--card)',
                borderColor: active ? '#0E7C7B' : 'var(--border)',
              }}
            >
              <span className="block text-[9px] opacity-70">
                {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
              </span>
              <strong className="block text-xs mt-0.5">{date.getDate()}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Legend() {
  const items: Array<[string, string]> = [
    ['Còn trống', '#E8F7F3'],
    ['Chờ xác nhận', statusStyle.pending.background],
    ['Đã xác nhận', statusStyle.confirmed.background],
    ['Đang chơi', statusStyle.playing.background],
    ['Hoàn thành', statusStyle.completed.background],
    ['Đã hủy', statusStyle.cancelled.background],
    ['Bảo trì', statusStyle.maintenance.background],
  ];

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-2 py-4" aria-label="Chú thích trạng thái">
      {items.map(([label, color]) => (
        <span key={label} className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded-sm border border-black/5" style={{ background: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

function ScheduleGrid({
  data,
  onEmptySlot,
  onScheduleItem,
}: {
  data: AdminCourtOperations;
  onEmptySlot: (court: AdminCourt, startTime: string) => void;
  onScheduleItem: (item: AdminCourtScheduleItem) => void;
}) {
  const slots = useMemo(() => {
    const count = ((END_HOUR - START_HOUR) * 60) / SLOT_MINUTES;
    return Array.from({ length: count }, (_, index) => {
      const totalMinutes = START_HOUR * 60 + index * SLOT_MINUTES;
      return minutesToTime(totalMinutes);
    });
  }, []);
  const canvasWidth = TIME_WIDTH + data.courts.length * COURT_WIDTH;
  const canvasHeight = slots.length * SLOT_HEIGHT;

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="text-sm font-extrabold">Lịch theo khung giờ</h2>
          <p className="text-[10px] text-muted-foreground">
            Chạm ô trống để tạo booking · kéo ngang để xem đủ sân
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-auto max-h-[620px]">
          <div style={{ width: canvasWidth, minWidth: '100%' }}>
            <div
              className="sticky top-0 z-30 flex bg-card border-b border-border"
              style={{ height: 42 }}
            >
              <div
                className="sticky left-0 z-40 bg-card border-r border-border flex items-center justify-center"
                style={{ width: TIME_WIDTH, minWidth: TIME_WIDTH }}
              >
                <Clock3 className="w-4 h-4 text-muted-foreground" />
              </div>
              {data.courts.map(court => (
                <div
                  key={court.id}
                  className="border-r border-border flex flex-col items-center justify-center"
                  style={{ width: COURT_WIDTH, minWidth: COURT_WIDTH }}
                >
                  <strong className="text-xs">{court.name}</strong>
                  <span className="text-[9px] text-muted-foreground">
                    {Math.round(court.hourlyRate / 1000)}K/giờ
                  </span>
                </div>
              ))}
            </div>

            <div className="relative" style={{ width: canvasWidth, height: canvasHeight }}>
              <div
                className="sticky left-0 z-20 bg-card border-r border-border"
                style={{ width: TIME_WIDTH, height: canvasHeight }}
              >
                {slots.map((time, index) => (
                  <div
                    key={time}
                    className="absolute left-0 w-full text-[9px] text-muted-foreground text-center border-b border-border/50"
                    style={{ top: index * SLOT_HEIGHT, height: SLOT_HEIGHT }}
                  >
                    <span className="-translate-y-1/2 inline-block bg-card px-1">
                      {time.endsWith(':00') ? time : ''}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="absolute top-0"
                style={{ left: TIME_WIDTH, width: data.courts.length * COURT_WIDTH, height: canvasHeight }}
              >
                {data.courts.map((court, courtIndex) =>
                  slots.map((time, slotIndex) => {
                    const now = new Date();
                    const isToday = data.selectedDate === toIsoDate(now);
                    const isPast = isToday &&
                      timeToMinutes(time) < now.getHours() * 60 + now.getMinutes();
                    const isBlockedCourt = !canCreateBookingOnCourt(court);
                    return <button
                      key={`${court.id}-${time}`}
                      onClick={() => onEmptySlot(court, time)}
                      disabled={isPast || isBlockedCourt}
                      className="absolute border-r border-b border-border/50 bg-emerald-50/30 active:bg-emerald-100 disabled:bg-slate-100/80 disabled:cursor-not-allowed"
                      style={{
                        left: courtIndex * COURT_WIDTH,
                        top: slotIndex * SLOT_HEIGHT,
                        width: COURT_WIDTH,
                        height: SLOT_HEIGHT,
                      }}
                      aria-label={`Tạo booking ${court.name} lúc ${time}`}
                    />;
                  }),
                )}

                {data.scheduleItems.map(item => {
                  const courtIndex = data.courts.findIndex(court => court.id === item.courtId);
                  if (courtIndex < 0) return null;
                  const startMinutes = timeToMinutes(item.startTime);
                  const endMinutes = timeToMinutes(item.endTime);
                  const top = ((startMinutes - START_HOUR * 60) / SLOT_MINUTES) * SLOT_HEIGHT;
                  const height = ((endMinutes - startMinutes) / SLOT_MINUTES) * SLOT_HEIGHT;
                  const style = statusStyle[item.status];

                  return (
                    <button
                      key={`${item.sourceType}-${item.id}`}
                      onClick={() => onScheduleItem(item)}
                      className="absolute z-10 rounded-lg border-l-[3px] p-2 text-left overflow-hidden shadow-sm"
                      style={{
                        left: courtIndex * COURT_WIDTH + 3,
                        top: top + 2,
                        width: COURT_WIDTH - 6,
                        height: Math.max(28, height - 4),
                        color: style.color,
                        background: style.background,
                        borderColor: style.border,
                      }}
                      aria-label={`${item.ownerName}, ${item.purpose}, ${item.courtName}, ${item.timeRange}, ${style.label}`}
                    >
                      <strong className="block text-[10px] leading-tight truncate">
                        {item.ownerName}
                      </strong>
                      <span className="block truncate text-[8px] font-semibold opacity-80">
                        {item.purpose}
                      </span>
                      <span className="block text-[9px] mt-1 opacity-80">{item.timeRange}</span>
                      {height >= SLOT_HEIGHT * 2 && (
                        <span className="block text-[8px] mt-1 font-bold">
                          {item.scheduleType} · {style.label}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CreateBookingScreen({
  court,
  courts,
  date,
  startTime,
  onBack,
  onCreated,
}: {
  court: AdminCourt;
  courts: AdminCourt[];
  date: string;
  startTime: string;
  onBack: () => void;
  onCreated: (booking: AdminCourtBooking) => void;
}) {
  const [courtId, setCourtId] = useState(court.id);
  const [bookingDate, setBookingDate] = useState(date);
  const [bookingStartTime, setBookingStartTime] = useState(startTime);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerType, setCustomerType] = useState<AdminCourtBooking['customerType']>('guest');
  const [endTime, setEndTime] = useState(
    minutesToTime(Math.min(END_HOUR * 60, timeToMinutes(startTime) + 90)),
  );
  const [status, setStatus] = useState<'pending' | 'confirmed'>('pending');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const selectedCourt = courts.find(item => item.id === courtId) ?? court;
  const today = toIsoDate(new Date());
  const now = new Date();
  const roundedNow = minutesToTime(Math.min(
    END_HOUR * 60,
    Math.max(START_HOUR * 60, Math.ceil((now.getHours() * 60 + now.getMinutes()) / SLOT_MINUTES) * SLOT_MINUTES),
  ));
  const minimumStartTime = bookingDate === today ? roundedNow : '05:00';
  const durationHours = Math.max(
    0,
    (timeToMinutes(endTime) - timeToMinutes(bookingStartTime)) / 60,
  );
  const amount = selectedCourt.hourlyRate * durationHours;

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const booking = await createAdminCourtBooking({
        courtId,
        date: bookingDate,
        startTime: bookingStartTime,
        endTime,
        customerName,
        customerPhone,
        customerType,
        status,
      });
      onCreated(booking);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Không thể tạo booking.',
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Tạo booking" onBack={onBack} variant="form" />
      <form id="create-court-booking" onSubmit={submit} className="min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-[calc(7rem+env(safe-area-inset-bottom))] space-y-4">
        <Field label="Khách hàng / Hội viên">
          <input
            required
            value={customerName}
            onChange={event => setCustomerName(event.target.value)}
            placeholder="Nhập tên khách hàng"
            className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-primary"
          />
        </Field>
        <Field label="Số điện thoại">
          <input
            required
            value={customerPhone}
            onChange={event => setCustomerPhone(event.target.value)}
            placeholder="Nhập số điện thoại"
            className="w-full bg-card border border-border rounded-xl px-3 py-3 text-sm outline-none focus:border-primary"
          />
        </Field>
        <Field label="Loại khách">
          <div className="grid grid-cols-4 gap-1.5">
            {([
              ['guest', 'Khách lẻ'],
              ['member', 'Hội viên'],
              ['student', 'Học viên'],
              ['coach', 'HLV'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setCustomerType(value)}
                className={`rounded-xl border px-1 py-2 text-[9px] font-bold ${
                  customerType === value ? 'border-primary bg-primary text-white' : 'border-border bg-card'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>
        <MobileSelectSheet
          title="Chọn sân"
          value={courtId}
          onChange={setCourtId}
          options={courts.map(item => ({
            value: item.id,
            label: item.name,
            description: `${money.format(item.hourlyRate)}/giờ`,
          }))}
        />
        <MobileDatePicker
          label="Ngày bắt đầu"
          value={bookingDate}
          minDate={today}
          onChange={value => {
            setBookingDate(value);
            if (value === today && timeToMinutes(bookingStartTime) < timeToMinutes(roundedNow)) {
              setBookingStartTime(roundedNow);
              setEndTime(minutesToTime(Math.min(END_HOUR * 60, timeToMinutes(roundedNow) + 90)));
            }
          }}
        />
        <div className="grid grid-cols-2 gap-2">
          <MobileTimePicker
            label="Giờ bắt đầu"
            value={bookingStartTime}
            minTime={minimumStartTime}
            maxTime="22:30"
            onChange={value => {
              setBookingStartTime(value);
              if (timeToMinutes(endTime) <= timeToMinutes(value)) {
                setEndTime(minutesToTime(Math.min(END_HOUR * 60, timeToMinutes(value) + 30)));
              }
            }}
          />
          <MobileTimePicker
            label="Giờ kết thúc"
            value={endTime}
            minTime={minutesToTime(timeToMinutes(bookingStartTime) + 30)}
            onChange={setEndTime}
          />
        </div>
        <Field label="Trạng thái ban đầu">
          <div className="grid grid-cols-2 gap-2">
            {([
              ['pending', 'Chờ xác nhận'],
              ['confirmed', 'Đã xác nhận'],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStatus(value)}
                className="rounded-xl border py-3 text-xs font-bold"
                style={{
                  color: status === value ? 'white' : 'var(--foreground)',
                  background: status === value ? '#0E7C7B' : 'var(--card)',
                  borderColor: status === value ? '#0E7C7B' : 'var(--border)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </Field>

        <div className="rounded-2xl bg-primary text-white p-4 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-white/65">Tổng thanh toán dự kiến</p>
            <p className="text-2xl font-black mt-1">{money.format(amount)}</p>
          </div>
          <div className="text-right text-[10px] text-white/70">
            <p>{durationHours.toLocaleString('vi-VN')} giờ</p>
            <p>{money.format(selectedCourt.hourlyRate)}/giờ</p>
          </div>
        </div>

        {error && (
          <p className="rounded-xl bg-destructive/10 text-destructive px-3 py-2 text-xs">
            {error}
          </p>
        )}
      </form>
      <div className="border-t border-border bg-background p-4">
        <button
          type="submit"
          form="create-court-booking"
          disabled={saving}
          className="w-full rounded-xl bg-primary text-white py-3.5 text-sm font-bold disabled:opacity-50"
        >
          {saving ? 'Đang tạo booking...' : 'Xác nhận booking'}
        </button>
      </div>
    </div>
  );
}

function CourtUsageDetailScreen({
  item,
  onBack,
}: {
  item: AdminCourtScheduleItem;
  onBack: () => void;
}) {
  const style = statusStyle[item.status];

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Chi tiết lịch sử dụng sân" onBack={onBack} variant="detail" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                {item.scheduleType}
              </p>
              <h2 className="mt-1 text-lg font-extrabold">{item.ownerName}</h2>
              <p className="mt-1 text-xs text-muted-foreground">{item.purpose}</p>
            </div>
            <span
              className="rounded-full px-2.5 py-1 text-[10px] font-bold"
              style={{ color: style.color, background: style.background }}
            >
              {style.label}
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <DetailRow icon={MapPin} label="Sân" value={item.courtName} />
            <DetailRow icon={CalendarDays} label="Ngày" value={formatDate(item.date)} />
            <DetailRow icon={Clock3} label="Khung giờ" value={item.timeRange} />
            <DetailRow icon={UserRound} label="Người phụ trách" value={item.ownerName} />
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <p className="text-sm font-bold text-primary">Lịch đã chiếm dụng sân</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Booking mới trùng {item.courtName} trong khung {item.timeRange} sẽ bị backend từ chối.
          </p>
        </section>
      </main>
      <div className="border-t border-border bg-background p-4">
        <button onClick={onBack} className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white">
          Quay lại lịch sân
        </button>
      </div>
    </div>
  );
}

function BookingDetailScreen({
  booking,
  onBack,
}: {
  booking: AdminCourtBooking;
  onBack: () => void;
}) {
  const style = statusStyle[booking.status];
  const [invoice, setInvoice] = useState<AdminBookingInvoice | null>(null);
  const [invoiceError, setInvoiceError] = useState('');

  const loadInvoice = useCallback(() => {
    let active = true;
    setInvoiceError('');
    getAdminCourtBookingInvoice(booking.id)
      .then(result => { if (active) setInvoice(result); })
      .catch(reason => { if (active) setInvoiceError(reason instanceof Error ? reason.message : 'Không thể tải hóa đơn.'); });
    return () => { active = false; };
  }, [booking.id]);

  useEffect(() => loadInvoice(), [loadInvoice]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-background">
      <ScreenHeader title="Chi tiết booking" onBack={onBack} variant="detail" />
      <main className="min-h-0 flex-1 overflow-y-auto px-4 py-5 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-muted-foreground">MÃ BOOKING</p>
            <h2 className="font-extrabold mt-1">{booking.bookingCode}</h2>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{ color: style.color, background: style.background }}
          >
            {style.label}
          </span>
        </div>

        <div className="flex items-center mt-6">
          {['Đặt chỗ', 'Xác nhận', 'Check-in', 'Đang chơi', 'Hoàn tất'].map((label, index) => {
            const progress = booking.status === 'completed' ? 5 :
              booking.status === 'playing' ? 4 :
                booking.status === 'confirmed' ? 2 : 1;
            const done = index < progress;
            return (
              <div key={label} className="flex-1 flex flex-col items-center relative">
                {index > 0 && (
                  <span
                    className="absolute right-1/2 top-3 h-0.5 w-full"
                    style={{ background: done ? '#0E7C7B' : 'var(--border)' }}
                  />
                )}
                <span
                  className="relative z-10 w-6 h-6 rounded-full flex items-center justify-center border"
                  style={{
                    color: done ? 'white' : 'var(--muted-foreground)',
                    background: done ? '#0E7C7B' : 'var(--card)',
                    borderColor: done ? '#0E7C7B' : 'var(--border)',
                  }}
                >
                  {done ? <Check className="w-3 h-3" /> : index + 1}
                </span>
                <span className="text-[8px] text-muted-foreground mt-1 text-center">{label}</span>
              </div>
            );
          })}
        </div>

        <section className="bg-card border border-border rounded-2xl p-4 mt-6 shadow-sm">
          <h3 className="font-extrabold">{booking.customerName}</h3>
          <p className="text-xs text-muted-foreground mt-1">
            {customerTypeLabel(booking.customerType)} · {formatDate(booking.date)} · {booking.timeRange}
          </p>
          <div className="space-y-3 mt-5">
            <DetailRow icon={MapPin} label="Sân" value={booking.courtName} />
            <DetailRow icon={Clock3} label="Khung giờ" value={booking.timeRange} />
            <DetailRow icon={Phone} label="Liên hệ" value={booking.customerPhone} />
            <DetailRow icon={WalletCards} label="Tổng hóa đơn" value={money.format(invoice?.totalAmount ?? booking.amount)} highlight />
          </div>
        </section>

        <section className="bg-card border border-border rounded-2xl p-4 mt-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold">Chi tiết hóa đơn</h3>
            {invoice && <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${invoice.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : invoice.paymentStatus === 'partial' ? 'bg-sky-50 text-sky-700' : 'bg-amber-50 text-amber-700'}`}>
              {invoice.paymentStatus === 'paid' ? 'Đã thanh toán' : invoice.paymentStatus === 'partial' ? 'Thanh toán một phần' : 'Chưa thanh toán'}
            </span>}
          </div>
          {!invoice && !invoiceError && <p className="mt-3 text-xs text-muted-foreground">Đang tải hóa đơn...</p>}
          {invoiceError && <p className="mt-3 rounded-xl bg-destructive/10 px-3 py-2 text-xs text-destructive">{invoiceError}</p>}
          {invoice && (
            <div className="mt-4 space-y-2 text-xs">
              <InvoiceLine label="Tiền sân theo bảng giá" value={invoice.courtAmountBeforeBenefit} />
              {invoice.membershipBenefitApplied && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800">
                  <p className="font-extrabold">Tiền sân được miễn: {money.format(invoice.courtBenefitDiscount)}</p>
                  <p className="mt-1 leading-5">
                    Áp dụng {invoice.membershipPackageName ?? 'gói hội viên'}
                    {invoice.membershipBenefitExpiresAt ? ` · hiệu lực đến ${invoice.membershipBenefitExpiresAt}` : ''}
                    {invoice.membershipBenefitUsesRemainingAfterApply !== null
                      ? ` · còn ${invoice.membershipBenefitUsesRemainingAfterApply} lượt sau lần này`
                      : ''}
                  </p>
                  {invoice.membershipBenefitNote && <p className="mt-1 leading-5">{invoice.membershipBenefitNote}</p>}
                </div>
              )}
              <InvoiceLine label="Tiền sân phải trả" value={invoice.courtAmount} />

              {invoice.sales.flatMap(sale => sale.items).length > 0 && (
                <InvoiceItemGroup title="Hàng hóa và vật dụng">
                  {invoice.sales.flatMap(sale => sale.items).map((item, index) => (
                    <InvoiceItemRow
                      key={`${item.itemId}-${index}`}
                      name={item.name}
                      quantity={item.quantity}
                      unitAmount={item.unitPrice}
                      totalAmount={item.lineTotal}
                    />
                  ))}
                </InvoiceItemGroup>
              )}

              {invoice.charges.filter(item => item.chargeType !== 'discount').length > 0 && (
                <InvoiceItemGroup title="Dịch vụ, thuê vật dụng và phụ thu">
                  {invoice.charges.filter(item => item.chargeType !== 'discount').map(item => (
                    <InvoiceItemRow
                      key={item.id}
                      name={item.description}
                      quantity={item.quantity}
                      unitAmount={item.unitAmount}
                      totalAmount={item.totalAmount}
                    />
                  ))}
                </InvoiceItemGroup>
              )}

              {invoice.charges.filter(item => item.chargeType === 'discount').length > 0 && (
                <InvoiceItemGroup title="Chi tiết giảm giá">
                  {invoice.charges.filter(item => item.chargeType === 'discount').map(item => (
                    <InvoiceItemRow
                      key={item.id}
                      name={item.description}
                      quantity={item.quantity}
                      unitAmount={-item.unitAmount}
                      totalAmount={-item.totalAmount}
                    />
                  ))}
                </InvoiceItemGroup>
              )}
              <InvoiceLine label="Tổng trước giảm" value={invoice.subtotal} strong />
              <InvoiceLine label="Giảm giá / ưu đãi" value={-invoice.discountAmount} />
              <InvoiceLine label="Tổng thanh toán" value={invoice.totalAmount} strong />
              <InvoiceLine label="Đã thu" value={invoice.paidAmount} />
              <InvoiceLine label="Còn nợ" value={invoice.outstandingAmount} strong danger={invoice.outstandingAmount > 0} />
              <div className="rounded-xl bg-muted/60 p-3 text-[10px] text-muted-foreground">
                <p>Phương thức: <strong className="text-foreground">{invoice.paymentMethod ?? 'Chưa thanh toán'}</strong></p>
                <p className="mt-1">Phiếu thu: <strong className="text-foreground">{invoice.receiptCode ?? 'Chưa phát hành'}</strong></p>
              </div>
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Lịch sử thanh toán / hoàn tiền</p>
                {invoice.payments.map(payment => (
                  <div key={payment.id} className="mt-2 flex items-start justify-between rounded-xl border border-border p-3">
                    <div>
                      <p className="font-bold">{payment.receiptCode}</p>
                      <p className="mt-1 text-[9px] text-muted-foreground">{payment.paidAt} · {payment.method} · {payment.createdBy}</p>
                      {payment.note && <p className="mt-1 text-[9px] text-muted-foreground">{payment.note}</p>}
                    </div>
                    <strong className={payment.transactionType === 'refund' ? 'text-amber-600' : 'text-primary'}>
                      {payment.transactionType === 'refund' ? '-' : '+'}{money.format(payment.amount)}
                    </strong>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Giao dịch đối soát</p>
                {invoice.financeEntries.map(entry => (
                  <div key={entry.id} className="mt-2 flex items-center justify-between rounded-xl border border-border p-3">
                    <div><p className="font-bold">{entry.code}</p><p className="mt-1 text-[9px] text-muted-foreground">{entry.occurredAt} · {entry.method}</p></div>
                    <span className="text-right"><strong className={entry.type === 'refund' ? 'text-amber-600' : 'text-primary'}>{money.format(entry.amount)}</strong><small className="block mt-1 text-[8px] text-muted-foreground">{entry.reconciliationStatus}</small></span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-primary/20 bg-primary/5 p-4 mt-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-bold">Lịch đã được giữ trên hệ thống</p>
              <p className="text-xs text-muted-foreground mt-1 leading-5">
                API đã kiểm tra không có booking giao nhau trên {booking.courtName}.
              </p>
            </div>
          </div>
        </section>
      </main>
      <div className="border-t border-border bg-background p-4">
        <button onClick={onBack} className="w-full rounded-xl bg-primary text-white py-3.5 text-sm font-bold">
          Quay lại lịch sân
        </button>
      </div>
    </div>
  );
}

function InvoiceLine({ label, value, strong, danger }: { label: string; value: number; strong?: boolean; danger?: boolean }) {
  return (
    <div className={`flex items-center justify-between border-b border-border py-2 ${strong ? 'font-extrabold' : ''}`}>
      <span>{label}</span>
      <span className={danger ? 'text-destructive' : 'text-primary'}>{money.format(value)}</span>
    </div>
  );
}

function InvoiceItemGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-2">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InvoiceItemRow({
  name,
  quantity,
  unitAmount,
  totalAmount,
}: {
  name: string;
  quantity: number;
  unitAmount: number;
  totalAmount: number;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-3">
      <div className="flex items-start justify-between gap-3">
        <strong>{name}</strong>
        <strong className="text-primary">{money.format(totalAmount)}</strong>
      </div>
      <p className="mt-1 text-[10px] text-muted-foreground">
        Số lượng: {quantity} · Đơn giá: {money.format(unitAmount)}
      </p>
    </div>
  );
}

function ScreenHeader({
  title,
  onBack,
  variant = 'detail',
}: {
  title: string;
  onBack: () => void;
  variant?: 'list' | 'detail' | 'form';
}) {
  return <AppScreenHeader title={title} onBack={onBack} variant={variant} />;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1.5">
        {label}
      </span>
      {children}
    </label>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <Field label={label}>
      <div className="bg-muted/60 border border-border rounded-xl px-2 py-3 text-sm">{value}</div>
    </Field>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  highlight = false,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="w-4 h-4 text-primary" />
      <span className="text-xs text-muted-foreground flex-1">{label}</span>
      <strong className={`text-xs ${highlight ? 'text-primary' : ''}`}>{value}</strong>
    </div>
  );
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function endTimeOptions(startTime: string) {
  const start = timeToMinutes(startTime);
  const values: string[] = [];
  for (let minutes = start + SLOT_MINUTES; minutes <= END_HOUR * 60; minutes += SLOT_MINUTES) {
    values.push(minutesToTime(minutes));
  }
  return values;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function fromIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatDate(value: string) {
  return fromIsoDate(value).toLocaleDateString('vi-VN');
}

function customerTypeLabel(value: AdminCourtBooking['customerType']) {
  return {
    guest: 'Khách lẻ',
    member: 'Hội viên',
    student: 'Học viên',
    coach: 'HLV',
  }[value];
}
