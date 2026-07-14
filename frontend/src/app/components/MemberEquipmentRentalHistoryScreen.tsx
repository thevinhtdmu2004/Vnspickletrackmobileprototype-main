import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CalendarDays, ChevronRight, History, Package, SlidersHorizontal } from 'lucide-react';
import {
  type RentalHistoryItem,
  type RentalStatus,
} from './memberEquipmentRental';
import { getEquipmentRentalHistory } from '../services/memberEquipmentRentalService';

interface MemberEquipmentRentalHistoryScreenProps {
  onBack: () => void;
}

type HistoryFilter = 'all' | RentalStatus;

function statusLabel(status: RentalStatus) {
  if (status === 'requested') return 'ÄĂ£ gá»­i yĂªu cáº§u';
  if (status === 'received') return 'ÄĂ£ nháº­n Ä‘á»“';
  if (status === 'returned') return 'ÄĂ£ tráº£ Ä‘á»“';
  if (status === 'lost') return 'Máº¥t Ä‘á»“';
  if (status === 'surcharge') return 'Phá»¥ phĂ­';
  return 'ÄĂ£ há»§y';
}

function statusColor(status: RentalStatus) {
  if (status === 'requested') return '#0E7C7B';
  if (status === 'received') return '#E8832A';
  if (status === 'returned') return '#2A9D8F';
  if (status === 'lost') return '#E76F51';
  if (status === 'surcharge') return '#B7791F';
  return '#9CA3AF';
}

function getCalendarDays(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const startWeekDay = first.getDay();

  const days: Array<{ day: number; dateISO: string } | null> = [];
  for (let index = 0; index < startWeekDay; index += 1) {
    days.push(null);
  }

  for (let day = 1; day <= last.getDate(); day += 1) {
    const current = new Date(year, month, day);
    const dateISO = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`;
    days.push({ day, dateISO });
  }

  return days;
}

export function MemberEquipmentRentalHistoryScreen({ onBack }: MemberEquipmentRentalHistoryScreenProps) {
  const [rentalHistory, setRentalHistory] = useState<RentalHistoryItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<HistoryFilter>('all');
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [monthCursor, setMonthCursor] = useState(new Date());

  useEffect(() => {
    let cancelled = false;

    async function loadHistory() {
      setIsLoadingHistory(true);
      try {
        const history = await getEquipmentRentalHistory();
        if (cancelled) return;
        setRentalHistory(history);
        if (history[0]?.dateISO) {
          setMonthCursor(new Date(`${history[0].dateISO}T00:00:00`));
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistory(false);
        }
      }
    }

    void loadHistory();
    return () => {
      cancelled = true;
    };
  }, []);

  const datesWithHistory = useMemo(
    () => new Set(rentalHistory.map((item) => item.dateISO)),
    [rentalHistory],
  );

  const filteredHistory = useMemo(() => rentalHistory.filter((item) => {
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (selectedDateISO && item.dateISO !== selectedDateISO) return false;
    return true;
  }), [rentalHistory, selectedStatus, selectedDateISO]);

  const visibleHistory = selectedDateISO ? filteredHistory : filteredHistory.slice(0, 5);
  const calendarDays = useMemo(() => getCalendarDays(monthCursor), [monthCursor]);

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
            Lá»CH Sá»¬ THUĂ Äá»’
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 4 }}>
            Theo dĂµi cĂ¡c láº§n thuĂª Ä‘á»“ táº¡i sĂ¢n
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', fontWeight: 500, marginTop: 6, lineHeight: 1.5 }}>
            Xem 5 lá»‹ch sá»­ gáº§n nháº¥t, lá»c theo tráº¡ng thĂ¡i, vĂ  theo dĂµi riĂªng cĂ¡c trÆ°á»ng há»£p máº¥t Ä‘á»“ hoáº·c phĂ¡t sinh phá»¥ phĂ­.
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
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>NHáº¬T KĂ THUĂ Äá»’</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                {isLoadingHistory
                  ? 'Äang táº£i lá»‹ch sá»­ thuĂª Ä‘á»“...'
                  : selectedDateISO ? `Äang xem theo ngĂ y ${selectedDateISO}` : 'Äang hiá»‡n 5 lá»‹ch sá»­ gáº§n nháº¥t'}
              </p>
            </div>
            <span className="rounded-xl px-2.5 py-1" style={{ background: 'rgba(14,124,123,0.10)' }}>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>{rentalHistory.length} má»¥c</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(14,124,123,0.06)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Package style={{ width: 13, height: 13, color: '#0E7C7B' }} />
                <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Máº·c Ä‘á»‹nh</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>5 lá»‹ch sá»­ gáº§n nháº¥t</p>
            </div>
            <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(244,162,97,0.08)' }}>
              <div className="flex items-center gap-1.5 mb-1.5">
                <SlidersHorizontal style={{ width: 13, height: 13, color: '#E8832A' }} />
                <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Lá»c nhanh</span>
              </div>
              <p style={{ fontSize: 13, fontWeight: 900, color: '#E8832A' }}>Theo ngĂ y vĂ  tráº¡ng thĂ¡i</p>
            </div>
          </div>
        </div>

        <div
          className="rounded-3xl p-4"
          style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
        >
          <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em', marginBottom: 8 }}>TRáº NG THĂI</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {[
              { id: 'all', label: 'Táº¥t cáº£' },
              { id: 'requested', label: 'ÄĂ£ gá»­i yĂªu cáº§u' },
              { id: 'received', label: 'ÄĂ£ nháº­n Ä‘á»“' },
              { id: 'returned', label: 'ÄĂ£ tráº£ Ä‘á»“' },
              { id: 'lost', label: 'Máº¥t Ä‘á»“' },
              { id: 'surcharge', label: 'Phá»¥ phĂ­' },
              { id: 'cancelled', label: 'ÄĂ£ há»§y' },
            ].map((filter) => {
              const active = selectedStatus === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedStatus(filter.id as HistoryFilter)}
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

        <div
          className="rounded-3xl p-4"
          style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>Lá»CH XEM THEO NGĂ€Y</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                NgĂ y cĂ³ dáº¥u cháº¥m lĂ  ngĂ y cĂ³ lá»‹ch sá»­ thuĂª Ä‘á»“.
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
              <span style={{ fontSize: 12, fontWeight: 800, color: '#1F2933' }}>{`ThĂ¡ng ${monthCursor.getMonth() + 1}/${monthCursor.getFullYear()}`}</span>
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
                  onClick={() => setSelectedDateISO((current) => (current === item.dateISO ? null : item.dateISO))}
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
          {visibleHistory.length > 0 ? visibleHistory.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl p-4"
              style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p style={{ fontSize: 14, fontWeight: 900, color: '#1F2933' }}>{item.requestCode}</p>
                    <span
                      className="px-2 py-0.5 rounded-lg"
                      style={{ fontSize: 9, fontWeight: 900, color: statusColor(item.status), background: `${statusColor(item.status)}14` }}
                    >
                      {statusLabel(item.status)}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-lg"
                      style={{ fontSize: 9, fontWeight: 900, color: '#0E7C7B', background: 'rgba(14,124,123,0.10)' }}
                    >
                      {item.totalItems} mĂ³n
                    </span>
                    {item.surchargeAmountLabel && (
                      <span
                        className="px-2 py-0.5 rounded-lg"
                        style={{ fontSize: 9, fontWeight: 900, color: '#B7791F', background: 'rgba(183,121,31,0.12)' }}
                      >
                        Phá»¥ phĂ­ {item.surchargeAmountLabel}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CalendarDays style={{ width: 12, height: 12, color: '#6B7280' }} />
                    <span style={{ fontSize: 12, color: '#4B5563', fontWeight: 700 }}>{item.dateLabel}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.items.map((rentalItem) => (
                      <span
                        key={`${item.id}-${rentalItem.itemId}`}
                        className="px-2 py-1 rounded-xl"
                        style={{ fontSize: 10, fontWeight: 800, color: '#6B7280', background: '#F8FAFB' }}
                      >
                        {rentalItem.name} x{rentalItem.quantity} {rentalItem.unitLabel}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.items.map((rentalItem) => (
                      <span
                        key={`${item.id}-${rentalItem.itemId}-check`}
                        className="px-2 py-1 rounded-xl"
                        style={{ fontSize: 10, fontWeight: 800, color: '#0E7C7B', background: 'rgba(14,124,123,0.08)' }}
                      >
                        Nháº­n {rentalItem.receivedQuantity} â€¢ Tráº£ {rentalItem.returnedQuantity} â€¢ Máº¥t {rentalItem.lostQuantity}
                      </span>
                    ))}
                  </div>

                  {(item.status === 'lost' || item.status === 'surcharge') && (
                    <div
                      className="mt-3 rounded-2xl px-3 py-2"
                      style={{ background: 'rgba(231,111,81,0.08)', border: '1px solid rgba(231,111,81,0.12)' }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle style={{ width: 14, height: 14, color: '#E76F51', marginTop: 1 }} />
                        <p style={{ fontSize: 11, color: '#C85A3D', lineHeight: 1.45 }}>
                          {item.note}
                        </p>
                      </div>
                    </div>
                  )}

                  {item.status !== 'lost' && item.status !== 'surcharge' && (
                    <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 8 }}>{item.note}</p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <p style={{ fontSize: 16, color: '#1F2933', fontWeight: 900 }}>{item.totalAmountLabel}</p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, marginTop: 4 }}>ÄĂ£ ghi</p>
                  <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 800, marginTop: 2 }}>{item.createdAtISO.slice(11, 16)}</p>
                  <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, marginTop: 6 }}>
                    {item.items.reduce((sum, rentalItem) => sum + rentalItem.quantity, 0)} mĂ³n
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
                {isLoadingHistory ? 'Äang táº£i lá»‹ch sá»­ thuĂª Ä‘á»“' : 'KhĂ´ng cĂ³ lá»‹ch sá»­ phĂ¹ há»£p'}
              </p>
              <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginTop: 4 }}>
                {isLoadingHistory
                  ? 'H? th?ng ?ang t?i l?ch s? thu? ?? cho h?i vi?n.'
                  : 'H?y ??i ng?y ho?c b?t b? l?c ?? xem th?m l?ch s? thu? ??.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

