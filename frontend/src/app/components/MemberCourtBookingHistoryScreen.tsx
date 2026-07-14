import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronRight, Clock3, History, MapPin, SlidersHorizontal } from 'lucide-react';
import {
  formatBookingCompactDate,
  formatBookingDayShort,
  loadCourtBookingHistory,
  saveCourtBookingHistory,
  type CourtBookingHistoryItem,
} from './memberCourtBooking';
import { getCourtBookingHistory } from '../services/memberCourtBookingService';

interface MemberCourtBookingHistoryScreenProps {
  onBack: () => void;
}

type HistoryFilter = 'all' | CourtBookingHistoryItem['action'];

function actionLabel(action: CourtBookingHistoryItem['action']) {
  if (action === 'booked') return 'Đã đặt';
  if (action === 'rescheduled') return 'Đổi lịch';
  if (action === 'completed') return 'Hoàn thành';
  if (action === 'no_show') return 'No-show';
  if (action === 'checked_in') return 'Đã check-in';
  return 'Đã hủy';
}

function actionColor(action: CourtBookingHistoryItem['action']) {
  if (action === 'booked') return '#0E7C7B';
  if (action === 'rescheduled') return '#E8832A';
  if (action === 'completed') return '#2563EB';
  if (action === 'no_show') return '#C2410C';
  if (action === 'checked_in') return '#7C3AED';
  return '#E76F51';
}

function getCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekDay = first.getDay();

  const days = [];
  for (let index = 0; index < startWeekDay; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const current = new Date(year, month, day);
    const dateISO = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    days.push({
      day,
      dateISO,
      shortLabel: formatBookingDayShort(dateISO),
    });
  }

  return days;
}

export function MemberCourtBookingHistoryScreen({ onBack }: MemberCourtBookingHistoryScreenProps) {
  const [bookingHistory, setBookingHistory] = useState<CourtBookingHistoryItem[]>(() => loadCourtBookingHistory());
  const [selectedAction, setSelectedAction] = useState<HistoryFilter>('all');
  const [selectedCourt, setSelectedCourt] = useState<string>('all');
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [monthCursor, setMonthCursor] = useState(() => {
    const latestDateISO = bookingHistory[0]?.dateISO;
    return latestDateISO ? new Date(latestDateISO) : new Date();
  });

  useEffect(() => {
    async function loadHistory() {
      setIsLoadingHistory(true);

      try {
        const history = await getCourtBookingHistory();
        setBookingHistory(history);
        saveCourtBookingHistory(history);
      } catch {
        setBookingHistory(loadCourtBookingHistory());
      } finally {
        setIsLoadingHistory(false);
      }
    }

    void loadHistory();
  }, []);

  const availableCourts = useMemo(
    () => Array.from(new Set(bookingHistory.map(item => item.court))),
    [bookingHistory],
  );

  const datesWithHistory = useMemo(
    () => new Set(bookingHistory.map(item => item.dateISO)),
    [bookingHistory],
  );

  const calendarDays = useMemo(() => getCalendarDays(monthCursor), [monthCursor]);

  const filteredHistory = useMemo(() => {
    return bookingHistory.filter((item) => {
      if (selectedAction !== 'all' && item.action !== selectedAction) return false;
      if (selectedCourt !== 'all' && item.court !== selectedCourt) return false;
      if (selectedDateISO && item.dateISO !== selectedDateISO) return false;
      return true;
    });
  }, [bookingHistory, selectedAction, selectedCourt, selectedDateISO]);

  const latestFiveHistory = filteredHistory.slice(0, 5);
  const visibleHistory = selectedDateISO ? filteredHistory : latestFiveHistory;

  const monthLabel = `Tháng ${monthCursor.getMonth() + 1}/${monthCursor.getFullYear()}`;
  const summaryLabel = selectedDateISO
    ? `Đang xem ${filteredHistory.length} lịch sử của ngày ${formatBookingCompactDate(selectedDateISO)}`
    : `Đang hiện 5 lịch sử gần nhất${filteredHistory.length > 5 ? ` trong ${filteredHistory.length} mục phù hợp` : ''}`;

  return (
    <div className="min-h-screen" style={{ background: '#F0F4F5' }}>
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 30%,#075E5D 60%,#0E7C7B 85%,#1A8E87 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: -36, right: -28, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="relative px-5 pt-14 pb-6">
          <div className="flex items-start justify-between gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ChevronRight style={{ width: 18, height: 18, color: 'white', transform: 'rotate(180deg)' }} />
            </button>
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <History style={{ width: 18, height: 18, color: 'white' }} />
            </div>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.05em' }}>
            LỊCH SỬ GIỮ CHỖ SÂN
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 4 }}>
            Theo dõi các lần giữ chỗ sân
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', fontWeight: 500, marginTop: 6, lineHeight: 1.5 }}>
            Xem 5 lịch sử gần nhất, lọc nhanh theo trạng thái hoặc sân, và chọn ngày có dấu chấm để xem chi tiết.
          </p>
        </div>
      </div>

      <div className="px-4 pt-4 pb-8 space-y-4">
        <div
          className="rounded-3xl p-4"
          style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                NHẬT KÝ ĐẶT SÂN
              </p>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                {isLoadingHistory ? 'Đang tải lịch sử...' : summaryLabel}
              </p>
            </div>
            <span className="rounded-xl px-2.5 py-1" style={{ background: 'rgba(14,124,123,0.10)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>
                {bookingHistory.length} mục
              </span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(14,124,123,0.06)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <CalendarDays style={{ width: 13, height: 13, color: '#0E7C7B' }} />
                <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Mặc định</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>5 lịch sử gần nhất</p>
            </div>
            <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(244,162,97,0.08)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <SlidersHorizontal style={{ width: 13, height: 13, color: '#E8832A' }} />
                <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Lọc nhanh</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 900, color: '#E8832A' }}>Theo ngày, sân, trạng thái</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl p-4"
          style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>BỘ LỌC</p>
            {(selectedAction !== 'all' || selectedCourt !== 'all' || selectedDateISO) && (
              <button
                onClick={() => {
                  setSelectedAction('all');
                  setSelectedCourt('all');
                  setSelectedDateISO(null);
                }}
                className="rounded-xl px-2.5 py-1 active:opacity-70"
                style={{ background: 'rgba(14,124,123,0.10)' }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>Xóa lọc</span>
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, marginBottom: 8 }}>TRẠNG THÁI</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'booked', label: 'Đã đặt' },
                  { id: 'rescheduled', label: 'Đổi lịch' },
                  { id: 'checked_in', label: 'Đã check-in' },
                  { id: 'completed', label: 'Hoàn thành' },
                  { id: 'no_show', label: 'No-show' },
                  { id: 'cancelled', label: 'Đã hủy' },
                ].map((filter) => {
                  const active = selectedAction === filter.id;
                  return (
                    <button
                      key={filter.id}
                      onClick={() => setSelectedAction(filter.id as HistoryFilter)}
                      className="rounded-2xl px-3 py-2 whitespace-nowrap active:scale-[0.99]"
                      style={{
                        background: active ? 'rgba(14,124,123,0.10)' : '#F8FAFB',
                        border: active ? '1px solid rgba(14,124,123,0.20)' : '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 800, color: active ? '#0E7C7B' : '#6B7280' }}>{filter.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, marginBottom: 8 }}>SÂN</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {['all', ...availableCourts].map((court) => {
                  const active = selectedCourt === court;
                  const label = court === 'all' ? 'Tất cả sân' : court;
                  return (
                    <button
                      key={court}
                      onClick={() => setSelectedCourt(court)}
                      className="rounded-2xl px-3 py-2 whitespace-nowrap active:scale-[0.99]"
                      style={{
                        background: active ? 'rgba(244,162,97,0.10)' : '#F8FAFB',
                        border: active ? '1px solid rgba(244,162,97,0.24)' : '1px solid rgba(0,0,0,0.06)',
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 800, color: active ? '#E8832A' : '#6B7280' }}>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl p-4"
          style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>LỊCH XEM THEO NGÀY</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                Ngày có dấu chấm là ngày có lịch sử giữ chỗ sân.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() - 1, 1))}
                className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-95"
                style={{ background: '#F8FAFB', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <ChevronRight style={{ width: 16, height: 16, color: '#6B7280', transform: 'rotate(180deg)' }} />
              </button>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#1F2933' }}>{monthLabel}</span>
              <button
                onClick={() => setMonthCursor(new Date(monthCursor.getFullYear(), monthCursor.getMonth() + 1, 1))}
                className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-95"
                style={{ background: '#F8FAFB', border: '1px solid rgba(0,0,0,0.06)' }}
              >
                <ChevronRight style={{ width: 16, height: 16, color: '#6B7280' }} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((label) => (
              <div key={label} className="text-center">
                <span style={{ fontSize: 10, fontWeight: 800, color: '#9CA3AF' }}>{label}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((item, index) => {
              if (!item) return <div key={`blank-${index}`} style={{ height: 42 }} />;

              const active = selectedDateISO === item.dateISO;
              const hasHistory = datesWithHistory.has(item.dateISO);

              return (
                <button
                  key={item.dateISO}
                  onClick={() => setSelectedDateISO(current => current === item.dateISO ? null : item.dateISO)}
                  className="rounded-2xl flex flex-col items-center justify-center active:scale-[0.99]"
                  style={{
                    height: 42,
                    background: active ? 'rgba(14,124,123,0.10)' : hasHistory ? 'rgba(244,162,97,0.08)' : '#F8FAFB',
                    border: active
                      ? '1px solid rgba(14,124,123,0.24)'
                      : hasHistory
                        ? '1px solid rgba(244,162,97,0.18)'
                        : '1px solid rgba(0,0,0,0.04)',
                  }}
                >
                  <span style={{ fontSize: 11, fontWeight: 800, color: active ? '#0E7C7B' : '#1F2933' }}>{item.day}</span>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      marginTop: 2,
                      background: hasHistory ? (active ? '#0E7C7B' : '#E8832A') : 'transparent',
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-3">
          {visibleHistory.length > 0 ? visibleHistory.map(item => (
            <div
              key={item.id}
              className="rounded-3xl p-4"
              style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p style={{ fontSize: 14, fontWeight: 900, color: '#1F2933' }}>{item.court}</p>
                    <span
                      className="px-2 py-0.5 rounded-lg"
                      style={{ fontSize: 9, fontWeight: 900, color: actionColor(item.action), background: `${actionColor(item.action)}14` }}
                    >
                      {actionLabel(item.action)}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-lg"
                      style={{ fontSize: 9, fontWeight: 900, color: '#0E7C7B', background: 'rgba(14,124,123,0.10)' }}
                    >
                      {item.slotCount} khung giờ
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-lg"
                      style={{ fontSize: 9, fontWeight: 900, color: '#E8832A', background: 'rgba(244,162,97,0.12)' }}
                    >
                      {item.playerCount} người
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <MapPin style={{ width: 12, height: 12, color: '#6B7280' }} />
                    <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 700 }}>
                      {item.dateLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock3 style={{ width: 12, height: 12, color: '#6B7280' }} />
                    <span style={{ fontSize: 13, color: '#1F2933', fontWeight: 800 }}>
                      {item.timeStart} - {item.timeEnd}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700 }}>Đã ghi</p>
                  <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 800, marginTop: 2 }}>
                    {formatBookingCompactDate(item.createdAtISO.slice(0, 10))}
                  </p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, marginTop: 2 }}>
                    {item.createdAtISO.slice(11, 16)}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div
              className="rounded-3xl p-5 text-center"
              style={{ background: 'white', border: '1.5px dashed rgba(14,124,123,0.18)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(14,124,123,0.10)' }}
              >
                <History style={{ width: 20, height: 20, color: '#0E7C7B' }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 900, color: '#1F2933' }}>
                Không có lịch sử phù hợp
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginTop: 4 }}>
                Hãy đổi ngày hoặc bỏ bớt bộ lọc để xem thêm lịch sử giữ chỗ sân.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
