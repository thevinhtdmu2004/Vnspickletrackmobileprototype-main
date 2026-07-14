import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  RefreshCw,
  Sparkles,
  Timer,
  X,
} from 'lucide-react';
import {
  BOOKING_PLAYER_OPTIONS,
  BOOKING_CHANGE_LOCK_MINUTES,
  BOOKING_REMINDER_MINUTES,
  MAX_BOOKING_ADVANCE_DAYS,
  MAX_BOOKING_COURTS,
  MAX_BOOKING_PLAYERS,
  MAX_BOOKING_RESCHEDULES,
  MAX_BOOKING_SLOTS,
  QUICK_BOOKING_DATE_DAYS,
  addCourtBookingHistoryItem,
  clearCourtBooking,
  formatBookingCompactDate,
  formatBookingDateLabel,
  getBookingChangePolicy,
  getBookingCountdown,
  getBookingCourtSummary,
  getBookingDateBounds,
  getBookingDateTimeLabel,
  getBookingSlotSummary,
  getDateOptions,
  getFacilityStatus,
  getSuggestedSlots,
  isDateWithinBookingWindow,
  loadCourtBooking,
  loadCourtBookingHistory,
  saveCourtBooking,
  saveCourtBookingHistory,
  type CourtBooking,
  type CourtBookingHistoryItem,
  type CourtSlot,
} from './memberCourtBooking';
import {
  checkInCurrentCourtBooking,
  cancelCurrentCourtBooking,
  createCourtBooking,
  getCourtBookingAvailability,
  getCourtBookingHistory,
  getCurrentCourtBooking,
  rescheduleCurrentCourtBooking,
  type CourtAvailabilityViewModel,
} from '../services/memberCourtBookingService';

interface MemberCourtBookingScreenProps {
  onBack: () => void;
  onBooked: (booking: CourtBooking) => void;
  onCancelled: () => void;
  onRescheduled: () => void;
  onViewHistory: () => void;
}

function formatTimeStamp(date: Date) {
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function BookingChip({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="rounded-2xl px-3 py-2"
      style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)' }}
    >
      <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', fontWeight: 700 }}>{label}</p>
      <p style={{ fontSize: 13, color: 'white', fontWeight: 800, marginTop: 2 }}>{value}</p>
    </div>
  );
}

function getConsecutiveSlots<T extends CourtSlot>(
  slots: T[],
  startSlotId: string,
  durationSlots: number,
) {
  if (!startSlotId) return [] as T[];

  const ordered = [...slots].sort((left, right) => {
    if (left.court !== right.court) return left.court.localeCompare(right.court);
    return left.timeStart.localeCompare(right.timeStart);
  });

  const startIndex = ordered.findIndex(slot => slot.id === startSlotId);
  if (startIndex < 0) return [] as T[];

  const startSlot = ordered[startIndex];
  if (!startSlot.isAvailable) return [] as T[];
  const sequence = [startSlot];

  for (let index = 1; index < durationSlots; index += 1) {
    const nextSlot = ordered[startIndex + index];
    if (!nextSlot) return [] as T[];
    if (nextSlot.court !== startSlot.court) return [] as T[];
    if (!nextSlot.isAvailable) return [] as T[];

    const expectedHour = Number(sequence[index - 1].timeEnd.split(':')[0]);
    const expectedMinute = Number(sequence[index - 1].timeEnd.split(':')[1]);
    const [nextHour, nextMinute] = nextSlot.timeStart.split(':').map(Number);

    if (nextHour !== expectedHour || nextMinute !== expectedMinute) {
      return [] as T[];
    }

    sequence.push(nextSlot);
  }

  return sequence;
}

function SlotCard({
  slot,
  selected,
  disabled,
  disabledReason,
  onSelect,
}: {
  slot: CourtSlot;
  selected: boolean;
  disabled: boolean;
  disabledReason?: string;
  onSelect: (slot: CourtSlot) => void;
}) {
  return (
    <button
      onClick={() => onSelect(slot)}
      disabled={disabled && !selected}
      className="w-full text-left rounded-3xl px-4 py-4 active:scale-[0.99] transition-all disabled:opacity-80"
      style={{
        background: disabled && !selected
          ? 'rgba(15,23,42,0.03)'
          : selected
            ? 'rgba(14,124,123,0.08)'
            : 'white',
        border: disabled && !selected
          ? '1.5px solid rgba(239,68,68,0.14)'
          : selected
            ? '1.5px solid rgba(14,124,123,0.30)'
            : '1.5px solid rgba(0,0,0,0.06)',
        boxShadow: selected ? '0 8px 22px rgba(14,124,123,0.10)' : '0 2px 10px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p style={{ fontSize: 15, fontWeight: 900, color: '#1F2933' }}>{slot.court}</p>
            {slot.isRecommended && (
              <span
                className="px-2 py-0.5 rounded-lg"
                style={{ fontSize: 9, fontWeight: 900, color: '#0E7C7B', background: 'rgba(14,124,123,0.10)' }}
              >
                Đề xuất
              </span>
            )}
            {slot.isPriorityWindow && (
              <span
                className="px-2 py-0.5 rounded-lg"
                style={{ fontSize: 9, fontWeight: 900, color: '#8A5A00', background: 'rgba(233,196,106,0.22)' }}
              >
                Ưu tiên hội viên
              </span>
            )}
            {!slot.isAvailable && (
              <span
                className="px-2 py-0.5 rounded-lg"
                style={{ fontSize: 9, fontWeight: 900, color: '#C2410C', background: 'rgba(251,146,60,0.18)' }}
              >
                Đã có người giữ
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Clock style={{ width: 12, height: 12, color: '#6B7280' }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>
              {slot.timeStart} - {slot.timeEnd}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Sparkles style={{ width: 11, height: 11, color: '#9CA3AF' }} />
            <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 600 }}>
              {disabled && !selected && disabledReason ? disabledReason : slot.note}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: selected ? 'rgba(14,124,123,0.12)' : 'rgba(0,0,0,0.04)' }}
          >
            <BadgeCheck style={{ width: 16, height: 16, color: selected ? '#0E7C7B' : '#C4C9D4' }} />
          </div>
          <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{slot.dateLabel}</span>
        </div>
      </div>
    </button>
  );
}

export function MemberCourtBookingScreen({
  onBack,
  onBooked,
  onCancelled,
  onRescheduled,
  onViewHistory,
}: MemberCourtBookingScreenProps) {
  type CourtFilter = string;
  type SlotFilter = 'all' | 'priority' | 'recommended' | 'soon';

  const [now, setNow] = useState(() => new Date());
  const [selectedDateISO, setSelectedDateISO] = useState(() => getDateOptions(new Date(), QUICK_BOOKING_DATE_DAYS).find(option => option.isToday)?.dateISO ?? '');
  const [savedBooking, setSavedBooking] = useState<CourtBooking | null>(() => loadCourtBooking());
  const [bookingHistory, setBookingHistory] = useState<CourtBookingHistoryItem[]>(() => loadCourtBookingHistory());
  const [suggestions, setSuggestions] = useState<CourtAvailabilityViewModel[]>([]);
  const [selectedStartSlotId, setSelectedStartSlotId] = useState<string>('');
  const [selectedDurationSlots, setSelectedDurationSlots] = useState<1 | 2>(1);
  const [selectionWarning, setSelectionWarning] = useState<string | null>(null);
  const [showBookingConfirm, setShowBookingConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [selectedCourtFilter, setSelectedCourtFilter] = useState<CourtFilter>('');
  const [selectedSlotFilter, setSelectedSlotFilter] = useState<SlotFilter>('all');
  const [selectedPlayerCount, setSelectedPlayerCount] = useState<number>(() => loadCourtBooking()?.playerCount ?? 2);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isSavingBooking, setIsSavingBooking] = useState(false);
  const [availabilityReloadKey, setAvailabilityReloadKey] = useState(0);
  const previousBookingRef = useRef<CourtBooking | null>(loadCourtBooking());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  async function loadBookingData() {
    try {
      const [currentBooking, history] = await Promise.all([
        getCurrentCourtBooking(),
        getCourtBookingHistory(),
      ]);
      const previousBooking = previousBookingRef.current;

      setSavedBooking(currentBooking);
      previousBookingRef.current = currentBooking;
      if (currentBooking) {
        saveCourtBooking(currentBooking);
      } else {
        clearCourtBooking();
      }

      setBookingHistory(history);
      saveCourtBookingHistory(history);

      if (!currentBooking && previousBooking) {
        const latestAction = history[0]?.action;
        if (latestAction === 'completed') {
          setSelectionWarning('Buổi chơi vừa kết thúc. Lượt giữ chỗ đã được chuyển sang lịch sử đặt sân.');
        } else if (latestAction === 'no_show') {
          setSelectionWarning('Lượt giữ chỗ vừa bị chuyển no-show do quá hạn check-in. Bạn có thể tạo lượt giữ chỗ mới nếu sân còn trống.');
        }
      }
    } catch {
      setSavedBooking(loadCourtBooking());
      setBookingHistory(loadCourtBookingHistory());
    }
  }

  useEffect(() => {
    void loadBookingData();
    const refreshTimer = window.setInterval(() => {
      void loadBookingData();
    }, 60000);

    return () => window.clearInterval(refreshTimer);
  }, []);

  const dateBounds = getBookingDateBounds(now);
  const dateOptions = getDateOptions(now, QUICK_BOOKING_DATE_DAYS);
  const facilityStatus = getFacilityStatus(now);

  useEffect(() => {
    if (savedBooking?.playerCount) {
      setSelectedPlayerCount(savedBooking.playerCount);
    }
  }, [savedBooking]);

  useEffect(() => {
    if (!selectedDateISO || !isDateWithinBookingWindow(selectedDateISO, now)) {
      setSelectedDateISO(dateBounds.minDateISO);
    }
  }, [dateBounds.minDateISO, now, selectedDateISO]);

  useEffect(() => {
    if (!selectedDateISO) {
      setSuggestions([]);
      return;
    }

    let cancelled = false;

    async function loadAvailability() {
      setIsLoadingSuggestions(true);

      try {
        const slots = await getCourtBookingAvailability(selectedDateISO);
        if (!cancelled) {
          setSuggestions(slots);
        }
      } catch {
        if (!cancelled) {
          setSuggestions(
            getSuggestedSlots(selectedDateISO, now).map(slot => ({
              ...slot,
              courtId: '',
            })),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingSuggestions(false);
        }
      }
    }

    void loadAvailability();

    return () => {
      cancelled = true;
    };
  }, [availabilityReloadKey, now, selectedDateISO]);

  const availableCourts = Array.from(new Set(suggestions.map(slot => slot.court)));

  useEffect(() => {
    if (availableCourts.length === 0) {
      setSelectedCourtFilter('');
      return;
    }

    if (!selectedCourtFilter || !availableCourts.includes(selectedCourtFilter)) {
      setSelectedCourtFilter(availableCourts[0]);
    }
  }, [availableCourts, selectedCourtFilter]);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((slot) => {
      if (selectedCourtFilter && slot.court !== selectedCourtFilter) return false;
      if (selectedSlotFilter === 'priority' && !slot.isPriorityWindow) return false;
      if (selectedSlotFilter === 'recommended' && !slot.isRecommended) return false;
      if (selectedSlotFilter === 'soon' && !slot.isSoon) return false;
      return true;
    });
  }, [selectedCourtFilter, selectedSlotFilter, suggestions]);

  const priorityWindowLabels = useMemo(() => {
    const labels = new Set<string>();

    suggestions.forEach((slot) => {
      if (slot.priorityWindowLabel) {
        labels.add(slot.priorityWindowLabel);
      }
    });

    if (savedBooking?.priorityWindowLabel) {
      labels.add(savedBooking.priorityWindowLabel);
    }

    return labels.size > 0 ? Array.from(labels) : ['17:00 - 19:00'];
  }, [savedBooking?.priorityWindowLabel, suggestions]);

  useEffect(() => {
    if (!selectedDateISO) return;
    const validIds = new Set(filteredSuggestions.map(slot => slot.id));

    if (selectedStartSlotId && validIds.has(selectedStartSlotId)) {
      return;
    }

    if (savedBooking && savedBooking.dateISO === selectedDateISO && selectedCourtFilter === savedBooking.court) {
      const bookingStartId = `${savedBooking.dateISO}-${savedBooking.court}-${savedBooking.timeStart}`;
      if (validIds.has(bookingStartId)) {
        setSelectedStartSlotId(bookingStartId);
        setSelectedDurationSlots(savedBooking.slotCount === 2 ? 2 : 1);
        return;
      }
    }

    const fallbackSlotId = filteredSuggestions[0]?.id ?? '';
    setSelectedStartSlotId(fallbackSlotId);
    const canKeepTwoHours = fallbackSlotId
      && getConsecutiveSlots(filteredSuggestions, fallbackSlotId, 2).length === 2;
    setSelectedDurationSlots((previous) => (previous === 2 && canKeepTwoHours ? 2 : 1));
  }, [filteredSuggestions, savedBooking, selectedCourtFilter, selectedDateISO, selectedStartSlotId]);

  const selectedSlots = useMemo(() => {
    return getConsecutiveSlots(filteredSuggestions, selectedStartSlotId, selectedDurationSlots);
  }, [filteredSuggestions, selectedDurationSlots, selectedStartSlotId]);

  const selectedCourt = selectedSlots[0]?.court ?? null;
  const selectedCourts = Array.from(new Set(selectedSlots.map(slot => slot.court)));
  const selectedCourtSummary = selectedCourts.join(' · ');
  const bookingCountdown = savedBooking ? getBookingCountdown(savedBooking, now) : null;
  const bookingChangePolicy = savedBooking ? getBookingChangePolicy(savedBooking, now) : null;
  const bookingRescheduleCount = savedBooking?.rescheduleCount ?? 0;
  const bookingRescheduleLimitReached = bookingRescheduleCount >= MAX_BOOKING_RESCHEDULES;
  const remainingReschedules = Math.max(0, MAX_BOOKING_RESCHEDULES - bookingRescheduleCount);
  const bookingRescheduleWarning = bookingRescheduleLimitReached
    ? `Lượt giữ chỗ này đã dùng hết ${MAX_BOOKING_RESCHEDULES} lần đổi giờ. Muốn đổi tiếp, bạn cần hủy giữ chỗ hiện tại rồi đặt lại nếu sân vẫn còn trống.`
    : null;
  const selectedMatchesBooking = Boolean(
    savedBooking
    && selectedSlots.length === savedBooking.slots.length
    && selectedSlots.every(slot => savedBooking.slots.some(saved => saved.court === slot.court && saved.timeStart === slot.timeStart)),
  );
  const uniqueCourts = new Set(suggestions.map(slot => slot.court)).size;

  async function syncHistoryFromApi(fallbackBooking?: CourtBooking, fallbackAction?: CourtBookingHistoryItem['action']) {
    try {
      const history = await getCourtBookingHistory();
      setBookingHistory(history);
      saveCourtBookingHistory(history);
    } catch {
      if (fallbackBooking && fallbackAction) {
        const nextHistory = addCourtBookingHistoryItem({
          action: fallbackAction,
          court: fallbackBooking.court,
          dateISO: fallbackBooking.dateISO,
          dateLabel: fallbackBooking.dateLabel,
          timeStart: fallbackBooking.timeStart,
          timeEnd: fallbackBooking.timeEnd,
          playerCount: fallbackBooking.playerCount,
          slotCount: fallbackBooking.slotCount,
        });
        setBookingHistory(nextHistory);
      }
    }
  }

  async function applyBooking(slots: CourtAvailabilityViewModel[], mode: 'new' | 'reschedule') {
    const firstSlot = slots[0];
    if (!firstSlot?.courtId) {
      setSelectionWarning('Không lấy được thông tin sân. Hãy tải lại danh sách khung giờ.');
      return;
    }

    setIsSavingBooking(true);
    setSelectionWarning(null);

    try {
      const nextBooking = mode === 'new'
        ? await createCourtBooking({
          courtId: firstSlot.courtId,
          bookingDate: firstSlot.dateISO,
          startTime: firstSlot.timeStart,
          slotCount: slots.length,
          playerCount: selectedPlayerCount,
        })
        : await rescheduleCurrentCourtBooking({
          courtId: firstSlot.courtId,
          bookingDate: firstSlot.dateISO,
          startTime: firstSlot.timeStart,
          slotCount: slots.length,
          playerCount: selectedPlayerCount,
        });

      saveCourtBooking(nextBooking);
      setSavedBooking(nextBooking);
      previousBookingRef.current = nextBooking;
      await syncHistoryFromApi(nextBooking, mode === 'new' ? 'booked' : 'rescheduled');

      if (mode === 'new') {
        onBooked(nextBooking);
      } else {
        onRescheduled();
      }
    } catch (error) {
      setSelectionWarning(
        error instanceof Error
          ? error.message
          : 'Không thể lưu giữ chỗ sân lúc này.',
      );
    } finally {
      setIsSavingBooking(false);
    }
  }

  function handleSelectSlot(slot: CourtAvailabilityViewModel) {
    setSelectionWarning(null);
    setSelectedCourtFilter(slot.court);
    setSelectedStartSlotId(slot.id);

    const twoHourSequence = getConsecutiveSlots(filteredSuggestions, slot.id, 2);
    if (selectedDurationSlots === 2 && twoHourSequence.length < 2) {
      setSelectedDurationSlots(1);
    }
  }

  function handlePrimaryAction() {
    if (selectedSlots.length === 0) {
      setSelectionWarning('Hãy chọn ít nhất 1 khung giờ trống để tiếp tục.');
      return;
    }
    if (selectedMatchesBooking) return;
    if (savedBooking) {
      if (bookingChangePolicy && !bookingChangePolicy.canModify) {
        setSelectionWarning(bookingChangePolicy.reason);
        return;
      }
      if (bookingRescheduleWarning) {
        setSelectionWarning(bookingRescheduleWarning);
        return;
      }
      void applyBooking(selectedSlots, 'reschedule');
      return;
    }
    setShowBookingConfirm(true);
  }

  function handleConfirmBooking() {
    if (selectedSlots.length === 0) return;
    setShowBookingConfirm(false);
    void applyBooking(selectedSlots, 'new');
  }

  async function handleCancelBooking() {
    if (savedBooking && bookingChangePolicy && !bookingChangePolicy.canModify) {
      setSelectionWarning(bookingChangePolicy.reason);
      return;
    }

    setIsSavingBooking(true);

    try {
      await cancelCurrentCourtBooking();
      if (savedBooking) {
        await syncHistoryFromApi(savedBooking, 'cancelled');
      }
      clearCourtBooking();
      setSavedBooking(null);
      previousBookingRef.current = null;
      setAvailabilityReloadKey((previous) => previous + 1);
      onCancelled();
    } catch (error) {
      setSelectionWarning(
        error instanceof Error
          ? error.message
          : 'Không thể hủy giữ chỗ sân lúc này.',
      );
    } finally {
      setIsSavingBooking(false);
    }
  }

  async function handleCheckInBooking() {
    if (!savedBooking?.canCheckIn) {
      setSelectionWarning(savedBooking?.checkInMessage ?? 'Chưa đến thời gian check-in.');
      return;
    }

    setIsSavingBooking(true);
    setSelectionWarning(null);

    try {
      const checkedInBooking = await checkInCurrentCourtBooking();
      saveCourtBooking(checkedInBooking);
      setSavedBooking(checkedInBooking);
      previousBookingRef.current = checkedInBooking;
      await syncHistoryFromApi();
    } catch (error) {
      setSelectionWarning(
        error instanceof Error
          ? error.message
          : 'Không thể check-in lượt giữ chỗ lúc này.',
      );
    } finally {
      setIsSavingBooking(false);
    }
  }

  function handleConfirmCancelBooking() {
    setShowCancelConfirm(false);
    void handleCancelBooking();
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F0F4F5' }}>
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 30%,#075E5D 60%,#0E7C7B 85%,#1A8E87 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: -36, right: -28, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute pointer-events-none" style={{ bottom: -18, left: -10, width: 110, height: 110, borderRadius: '50%', background: 'rgba(42,157,143,0.10)' }} />

        <div className="relative px-5 pt-14 pb-5">
          <div className="flex items-start mb-4">
            <button
              onClick={onBack}
              className="w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ChevronRight style={{ width: 18, height: 18, color: 'white', transform: 'rotate(180deg)' }} />
            </button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <CalendarDays style={{ width: 24, height: 24, color: 'white' }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.05em' }}>
                ĐẶT SÂN TRỰC TUYẾN
              </p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 3 }}>
                Giữ chỗ sân linh hoạt cho Hội viên
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', fontWeight: 500, marginTop: 4, lineHeight: 1.5 }}>
                Chọn ngày rộng hơn, chọn nhiều khung giờ trống, và xem rõ giờ ưu tiên Hội viên.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-4">
            <BookingChip label="Giờ hiện tại" value={formatTimeStamp(now)} />
            <BookingChip label="Cửa sổ đặt trước" value={`${MAX_BOOKING_ADVANCE_DAYS} ngày`} />
          </div>

          <div
            className="rounded-2xl px-3.5 py-3 mb-4"
            style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)' }}
          >
            <p style={{ fontSize: 11, color: 'white', fontWeight: 800 }}>
              Khung giờ ưu tiên chỉ dành cho hội viên giữ sân.
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.76)', lineHeight: 1.45, marginTop: 4 }}>
              Khách vãng lai chỉ có thể tham gia cùng hội viên đã giữ sân, không tự chọn hay tự giữ các khung giờ ưu tiên.
            </p>
          </div>

          <div
            className="rounded-3xl p-4"
            style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)' }}
          >
            <div className="mb-4">
              <p style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.92)', letterSpacing: '0.04em' }}>
                SỐ NGƯỜI DỰ KIẾN
              </p>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5, marginTop: 2 }}>
                Chọn trước số người để hệ thống gợi ý phù hợp hơn và hỗ trợ check-in rõ ràng hơn.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {BOOKING_PLAYER_OPTIONS.map((count) => {
                  const active = selectedPlayerCount === count;
                  const caption = count === 2 ? 'Đánh đơn / ghép đôi' : 'Đánh đôi đủ người';

                  return (
                    <button
                      key={count}
                      onClick={() => setSelectedPlayerCount(count)}
                      className="rounded-2xl px-3 py-3 active:scale-[0.99] transition-all"
                      style={{
                        background: active ? 'white' : 'rgba(255,255,255,0.14)',
                        border: active ? '1.5px solid rgba(255,255,255,0.82)' : '1px solid rgba(255,255,255,0.18)',
                      }}
                    >
                      <p style={{ fontSize: 18, fontWeight: 900, color: active ? '#0E7C7B' : 'white' }}>{count}</p>
                      <p style={{ fontSize: 10, color: active ? '#0E7C7B' : 'rgba(255,255,255,0.88)', fontWeight: 800, marginTop: 2 }}>
                        người
                      </p>
                      <p style={{ fontSize: 10, color: active ? '#4B5563' : 'rgba(255,255,255,0.76)', fontWeight: 600, marginTop: 4, lineHeight: 1.35 }}>
                        {caption}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.72)', fontWeight: 700 }}>
                  Trạng thái cơ sở
                </p>
                <p style={{ fontSize: 18, color: 'white', fontWeight: 900, marginTop: 2 }}>
                  {facilityStatus.label}
                </p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.82)', marginTop: 2, lineHeight: 1.4 }}>
                  {facilityStatus.detail}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: facilityStatus.isOpen ? 'rgba(42,157,143,0.18)' : 'rgba(231,111,81,0.18)' }}
              >
                <Timer style={{ width: 22, height: 22, color: 'white' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 pt-4 space-y-4">
          {savedBooking && (
            <div
              className="rounded-3xl overflow-hidden"
              style={{ background: 'white', border: '1.5px solid rgba(14,124,123,0.16)', boxShadow: '0 6px 20px rgba(14,124,123,0.10)' }}
            >
              <div style={{ height: 3, background: 'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 100%)' }} />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, letterSpacing: '0.05em' }}>
                      SÂN ĐÃ ĐẶT
                    </p>
                    <p style={{ fontSize: 18, color: '#1F2933', fontWeight: 900, marginTop: 2 }}>
                      {getBookingCourtSummary(savedBooking)}
                    </p>
                    <p style={{ fontSize: 13, color: '#4B5563', fontWeight: 600, marginTop: 2 }}>
                      {getBookingDateTimeLabel(savedBooking)}
                    </p>
                  </div>
                  <div
                    className="px-3 py-2 rounded-2xl"
                    style={{ background: bookingCountdown?.isUrgent ? 'rgba(231,111,81,0.10)' : 'rgba(14,124,123,0.10)' }}
                  >
                    <p style={{ fontSize: 10, color: bookingCountdown?.isUrgent ? '#E76F51' : '#0E7C7B', fontWeight: 800 }}>
                      {bookingCountdown?.label}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-2xl p-3" style={{ background: 'rgba(14,124,123,0.06)' }}>
                    <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Nhắc sân</p>
                    <p style={{ fontSize: 13, color: '#0E7C7B', fontWeight: 900, marginTop: 2 }}>
                      Trước {savedBooking.reminderMinutes} phút
                    </p>
                  </div>
                  <div className="rounded-2xl p-3" style={{ background: 'rgba(244,162,97,0.08)' }}>
                    <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Khung giờ</p>
                    <p style={{ fontSize: 13, color: '#E8832A', fontWeight: 900, marginTop: 2 }}>
                      {savedBooking.slotCount} khung giờ
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-2xl px-3 py-3 mb-3"
                  style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.16)' }}
                >
                  <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>Các khung giờ đã giữ</p>
                  <p style={{ fontSize: 12, color: '#1F2933', fontWeight: 800, marginTop: 4, lineHeight: 1.5 }}>
                    {getBookingSlotSummary(savedBooking)}
                  </p>
                </div>

                {bookingCountdown && (
                  <div
                    className="rounded-2xl px-3 py-3 mb-3"
                    style={{
                      background: bookingCountdown.isUrgent ? 'rgba(231,111,81,0.08)' : 'rgba(14,124,123,0.06)',
                      border: `1px solid ${bookingCountdown.isUrgent ? 'rgba(231,111,81,0.18)' : 'rgba(14,124,123,0.16)'}`,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      {bookingCountdown.isUrgent ? (
                        <AlertTriangle style={{ width: 16, height: 16, color: '#E76F51', flexShrink: 0, marginTop: 1 }} />
                      ) : (
                        <Bell style={{ width: 16, height: 16, color: '#0E7C7B', flexShrink: 0, marginTop: 1 }} />
                      )}
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 800, color: bookingCountdown.isUrgent ? '#C85A3D' : '#0E7C7B' }}>
                          {bookingCountdown.label}
                        </p>
                        <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 1.4 }}>
                          {bookingCountdown.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className="rounded-2xl px-3 py-3 mb-3"
                  style={{ background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.16)' }}
                >
                  <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>Số người dự kiến</p>
                  <p style={{ fontSize: 13, color: '#E8832A', fontWeight: 900, marginTop: 4 }}>
                    {savedBooking.playerCount} người / tối đa {MAX_BOOKING_PLAYERS} người trên 1 sân
                  </p>
                </div>

                <div
                  className="rounded-2xl px-3 py-3 mb-3"
                  style={{ background: 'rgba(14,124,123,0.08)', border: '1px solid rgba(14,124,123,0.16)' }}
                >
                  <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>Quyền đổi giờ</p>
                  <p style={{ fontSize: 13, color: '#0E7C7B', fontWeight: 900, marginTop: 4 }}>
                    Đã đổi {bookingRescheduleCount}/{MAX_BOOKING_RESCHEDULES} lần
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 4 }}>
                    {bookingRescheduleLimitReached
                      ? 'Lượt giữ chỗ hiện tại đã chạm giới hạn đổi giờ.'
                      : `Bạn còn ${remainingReschedules} lần đổi giờ và sẽ bị khóa đổi trong ${BOOKING_CHANGE_LOCK_MINUTES} phút trước giờ chơi.`}
                  </p>
                </div>

                {bookingChangePolicy && !bookingChangePolicy.canModify && (
                  <div
                    className="rounded-2xl px-3 py-3 mb-3"
                    style={{ background: 'rgba(231,111,81,0.08)', border: '1px solid rgba(231,111,81,0.18)' }}
                  >
                    <p style={{ fontSize: 11, color: '#C85A3D', fontWeight: 800 }}>Lượt giữ chỗ đang bị khóa đổi / hủy</p>
                    <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 4 }}>
                      {bookingChangePolicy.reason}
                    </p>
                  </div>
                )}

                {bookingRescheduleWarning && (
                  <div
                    className="rounded-2xl px-3 py-3 mb-3"
                    style={{ background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.18)' }}
                  >
                    <p style={{ fontSize: 11, color: '#C46A1A', fontWeight: 800 }}>Đã chạm giới hạn đổi giờ</p>
                    <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 4 }}>
                      {bookingRescheduleWarning}
                    </p>
                  </div>
                )}

                <div
                  className="rounded-2xl px-3 py-3 mb-3"
                  style={{
                    background: savedBooking.canCheckIn ? 'rgba(124,58,237,0.08)' : 'rgba(15,23,42,0.04)',
                    border: `1px solid ${savedBooking.canCheckIn ? 'rgba(124,58,237,0.18)' : 'rgba(15,23,42,0.08)'}`,
                  }}
                >
                  <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>Check-in tại sân</p>
                  <p style={{ fontSize: 13, color: savedBooking.canCheckIn ? '#7C3AED' : '#374151', fontWeight: 900, marginTop: 4 }}>
                    {savedBooking.checkInStatus === 'CheckedIn'
                      ? 'Đã check-in'
                      : savedBooking.canCheckIn
                        ? 'Đang mở check-in'
                        : savedBooking.checkInStatus === 'NoShow'
                          ? 'Đã no-show'
                          : 'Chưa mở / đã đóng'}
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 4 }}>
                    {savedBooking.checkInMessage ?? 'Check-in sẽ mở gần giờ chơi và đóng sau khi quá hạn.'}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => void handleCheckInBooking()}
                    disabled={!savedBooking.canCheckIn || isSavingBooking}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl"
                    style={{
                      background: 'rgba(124,58,237,0.08)',
                      border: '1px solid rgba(124,58,237,0.16)',
                      opacity: !savedBooking.canCheckIn || isSavingBooking ? 0.5 : 1,
                    }}
                  >
                    <CheckCircle2 style={{ width: 15, height: 15, color: '#7C3AED' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#7C3AED' }}>Check-in</span>
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={Boolean(bookingChangePolicy && !bookingChangePolicy.canModify)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl"
                    style={{
                      background: 'rgba(231,111,81,0.08)',
                      border: '1px solid rgba(231,111,81,0.16)',
                      opacity: bookingChangePolicy && !bookingChangePolicy.canModify ? 0.5 : 1,
                    }}
                  >
                    <X style={{ width: 15, height: 15, color: '#E76F51' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#E76F51' }}>Hủy đặt</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCourtFilter(savedBooking.court);
                      setSelectedStartSlotId(`${savedBooking.dateISO}-${savedBooking.court}-${savedBooking.timeStart}`);
                      setSelectedDurationSlots(savedBooking.slotCount === 2 ? 2 : 1);
                    }}
                    disabled={Boolean((bookingChangePolicy && !bookingChangePolicy.canModify) || bookingRescheduleLimitReached)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl"
                    style={{
                      background: 'rgba(14,124,123,0.08)',
                      border: '1px solid rgba(14,124,123,0.16)',
                      opacity: (bookingChangePolicy && !bookingChangePolicy.canModify) || bookingRescheduleLimitReached ? 0.5 : 1,
                    }}
                  >
                    <RefreshCw style={{ width: 15, height: 15, color: '#0E7C7B' }} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0E7C7B' }}>Đổi giờ</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={onViewHistory}
            className="w-full text-left rounded-3xl p-4 active:scale-[0.99] transition-all"
            style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                  LỊCH SỬ ĐẶT SÂN
                </p>
                <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, marginTop: 4 }}>
                  Xem đầy đủ các lần đặt, đổi lịch và hủy sân gần đây trong một màn riêng.
                </p>
                <p style={{ fontSize: 11, color: '#0E7C7B', fontWeight: 800, marginTop: 6 }}>
                  {bookingHistory.length > 0
                    ? `Hiện có ${bookingHistory.length} giao dịch gần nhất`
                    : 'Chưa có giao dịch nào'}
                </p>
              </div>
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,124,123,0.10)' }}
              >
                <ChevronRight style={{ width: 18, height: 18, color: '#0E7C7B' }} />
              </div>
            </div>
          </button>

          <div
            className="rounded-3xl p-4"
            style={{ background: 'rgba(14,124,123,0.07)', border: '1.5px solid rgba(14,124,123,0.16)' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,124,123,0.12)' }}
              >
                <Bell style={{ width: 18, height: 18, color: '#0E7C7B' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>
                  Nguyên tắc giữ chỗ sân cho Hội viên
                </p>
                <div className="space-y-1.5 mt-2">
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Được giữ chỗ trước tối đa {MAX_BOOKING_ADVANCE_DAYS} ngày kể từ hôm nay.
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Mỗi lần giữ chỗ được chọn tối đa {MAX_BOOKING_SLOTS} khung giờ.
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Mỗi lần giữ chỗ chỉ chọn {MAX_BOOKING_COURTS} sân để đảm bảo công bằng giờ đẹp.
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Mỗi lượt giữ chỗ được đổi giờ tối đa {MAX_BOOKING_RESCHEDULES} lần.
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Không thể tự đổi hoặc hủy khi còn dưới {BOOKING_CHANGE_LOCK_MINUTES} phút trước giờ chơi.
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Khung giờ ưu tiên Hội viên: {priorityWindowLabels.join(', ')}.
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Khách vãng lai không tự chọn khung giờ ưu tiên; chỉ hội viên đứng tên lượt giữ sân mới được dùng.
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45 }}>
                    - Nếu đang có giữ chỗ, lần đổi giờ mới sẽ thay thế toàn bộ giữ chỗ hiện tại.
                  </p>
                </div>
              </div>
            </div>
          </div>


          {selectionWarning && (
            <div
              className="rounded-3xl px-4 py-3"
              style={{ background: 'rgba(231,111,81,0.08)', border: '1.5px solid rgba(231,111,81,0.18)' }}
            >
              <div className="flex items-start gap-2">
                <AlertTriangle style={{ width: 16, height: 16, color: '#E76F51', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 12, color: '#C85A3D', fontWeight: 700, lineHeight: 1.45 }}>
                  {selectionWarning}
                </p>
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                  BƯỚC 1 · CHỌN NGÀY
                </p>
                <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  Đặt từ {formatBookingDateLabel(dateBounds.minDateISO)} đến {formatBookingDateLabel(dateBounds.maxDateISO)}.
                </p>
              </div>
              <div
                className="rounded-xl px-2.5 py-1.5"
                style={{ background: 'rgba(14,124,123,0.10)' }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>
                  {facilityStatus.isOpen ? 'Đang mở' : 'Đã đóng'}
                </span>
              </div>
            </div>

            <label
              className="flex items-center gap-3 rounded-3xl px-4 py-3 mb-3"
              style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
            >
              <CalendarDays style={{ width: 16, height: 16, color: '#0E7C7B' }} />
              <div className="flex-1">
                <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Chọn ngày bất kỳ trong cửa sổ đặt trước</p>
                <input
                  type="date"
                  min={dateBounds.minDateISO}
                  max={dateBounds.maxDateISO}
                  value={selectedDateISO}
                  onChange={(event) => {
                    setSelectedDateISO(event.target.value);
                    setSelectionWarning(null);
                  }}
                  className="w-full bg-transparent outline-none"
                  style={{ fontSize: 14, fontWeight: 800, color: '#1F2933', marginTop: 2 }}
                />
              </div>
            </label>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {dateOptions.map(option => {
                const active = option.dateISO === selectedDateISO;
                return (
                  <button
                    key={option.dateISO}
                    onClick={() => {
                      setSelectedDateISO(option.dateISO);
                      setSelectionWarning(null);
                    }}
                    className="min-w-[110px] rounded-3xl px-3 py-3 text-left active:scale-[0.99] transition-all"
                    style={{
                      background: active ? 'rgba(14,124,123,0.08)' : 'white',
                      border: active ? '1.5px solid rgba(14,124,123,0.28)' : '1.5px solid rgba(0,0,0,0.06)',
                      boxShadow: active ? '0 6px 16px rgba(14,124,123,0.10)' : '0 2px 10px rgba(0,0,0,0.04)',
                    }}
                  >
                    <p style={{ fontSize: 11, color: active ? '#0E7C7B' : '#6B7280', fontWeight: 800 }}>{option.label}</p>
                    <p style={{ fontSize: 13, color: '#1F2933', fontWeight: 900, marginTop: 3 }}>
                      {option.subLabel}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-3xl p-4"
            style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                  BƯỚC 2 · CHỌN SÂN
                </p>
                <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, marginTop: 2 }}>
                  Chọn 1 sân trước, sau đó hệ thống sẽ gợi ý giờ bắt đầu và thời lượng phù hợp.
                </p>
              </div>
              {selectedCourtFilter && (
                <span
                  className="rounded-xl px-2.5 py-1"
                  style={{ background: 'rgba(14,124,123,0.10)' }}
                >
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>
                    {selectedCourtFilter}
                  </span>
                </span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto mt-3 pb-1">
              {availableCourts.map((court) => {
                const active = selectedCourtFilter === court;
                return (
                  <button
                    key={court}
                    onClick={() => {
                      setSelectedCourtFilter(court);
                      setSelectionWarning(null);
                    }}
                    className="rounded-2xl px-3 py-2 whitespace-nowrap active:scale-[0.99]"
                    style={{
                      background: active ? 'rgba(14,124,123,0.10)' : '#F8FAFB',
                      border: active ? '1px solid rgba(14,124,123,0.20)' : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <span style={{ fontSize: 11, fontWeight: 800, color: active ? '#0E7C7B' : '#6B7280' }}>{court}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="rounded-3xl p-4"
            style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                  BƯỚC 3 · CHỌN GIỜ BẮT ĐẦU
                </p>
                <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, marginTop: 2 }}>
                  Chỉ cần chọn giờ bắt đầu, sau đó quyết định chơi 1 giờ hay 2 giờ liền mạch.
                </p>
              </div>
              {selectedSlots.length > 0 && (
                <span
                  className="rounded-xl px-2.5 py-1"
                  style={{ background: 'rgba(244,162,97,0.10)' }}
                >
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#E8832A' }}>
                    {selectedDurationSlots} giờ
                  </span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3">
              {[1, 2].map((duration) => {
                const active = selectedDurationSlots === duration;
                const canSelect = duration === 1 || getConsecutiveSlots(filteredSuggestions, selectedStartSlotId, duration).length === duration;

                return (
                  <button
                    key={duration}
                    disabled={!canSelect}
                    onClick={() => {
                      setSelectedDurationSlots(duration as 1 | 2);
                      setSelectionWarning(null);
                    }}
                    className="rounded-2xl px-3 py-3 text-left active:scale-[0.99] disabled:opacity-50"
                    style={{
                      background: active ? 'rgba(244,162,97,0.10)' : '#F8FAFB',
                      border: active ? '1px solid rgba(244,162,97,0.22)' : '1px solid rgba(0,0,0,0.06)',
                    }}
                  >
                    <p style={{ fontSize: 14, fontWeight: 900, color: active ? '#E8832A' : '#1F2933' }}>
                      {duration} giờ
                    </p>
                    <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, marginTop: 4 }}>
                      {duration === 1
                        ? 'Giữ 1 khung giờ'
                        : canSelect
                          ? 'Giữ 2 khung giờ liên tiếp'
                          : 'Không đủ 2 giờ liên tiếp'}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 rounded-2xl px-3 py-3" style={{ background: 'rgba(14,124,123,0.06)' }}>
              <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>TÓM TẮT NHANH</p>
              <p style={{ fontSize: 13, color: '#1F2933', fontWeight: 900, marginTop: 4 }}>
                {selectedSlots.length > 0
                  ? `${selectedCourtSummary} · ${selectedSlots[0].timeStart} - ${selectedSlots[selectedSlots.length - 1].timeEnd}`
                  : 'Chưa chọn giờ bắt đầu'}
              </p>
              <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 4 }}>
                {selectedSlots.length > 0
                  ? `${selectedPlayerCount} người · ${selectedSlots.length}/${MAX_BOOKING_SLOTS} khung giờ`
                  : 'Chọn một giờ bắt đầu để hệ thống tự ghép đúng thời lượng bạn cần.'}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                  KHUNG GIỜ TRỐNG
                </p>
                <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  {isLoadingSuggestions
                  ? 'Đang tải khung giờ sân...'
                    : suggestions.length > 0
                    ? `Có ${filteredSuggestions.length}/${suggestions.length} khung giờ đang hiển thị · ${uniqueCourts} sân khác nhau`
                    : 'Không có khung giờ nào trong ngày này'}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin style={{ width: 12, height: 12, color: '#0E7C7B' }} />
                <span style={{ fontSize: 11, color: '#0E7C7B', fontWeight: 800 }}>
                  Ưu tiên hội viên
                </span>
              </div>
            </div>

            {suggestions.length > 0 ? (
              <div className="space-y-3">
                <div
                  className="rounded-3xl p-3"
                  style={{ background: 'white', border: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <p style={{ fontSize: 10, color: '#6B7280', fontWeight: 700, marginBottom: 8 }}>
                    LỌC THEO KHUNG GIỜ
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {[
                      { id: 'all', label: 'Tất cả' },
                        { id: 'priority', label: 'Ưu tiên hội viên' },
                        { id: 'recommended', label: 'Đề xuất' },
                      { id: 'soon', label: 'Gần nhất' },
                    ].map((filter) => {
                      const active = selectedSlotFilter === filter.id;

                      return (
                        <button
                          key={filter.id}
                          onClick={() => setSelectedSlotFilter(filter.id as SlotFilter)}
                          className="rounded-2xl px-3 py-2 whitespace-nowrap active:scale-[0.99]"
                          style={{
                            background: active ? 'rgba(244,162,97,0.10)' : '#F8FAFB',
                            border: active ? '1px solid rgba(244,162,97,0.20)' : '1px solid rgba(0,0,0,0.06)',
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 800, color: active ? '#E8832A' : '#6B7280' }}>{filter.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {filteredSuggestions.length === 0 && (
                  <div
                    className="rounded-3xl p-5 text-center"
                    style={{ background: 'white', border: '1.5px dashed rgba(14,124,123,0.18)' }}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: 'rgba(14,124,123,0.08)' }}
                    >
                      <Sparkles style={{ width: 20, height: 20, color: '#0E7C7B' }} />
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 900, color: '#1F2933' }}>
                      Không có khung giờ phù hợp với bộ lọc
                    </p>
                    <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginTop: 4 }}>
                      Hãy chuyển sang sân khác hoặc bớt bộ lọc để xem thêm gợi ý trống.
                    </p>
                  </div>
                )}

                {filteredSuggestions.map(slot => {
                  const selected = selectedStartSlotId === slot.id;
                  const canExtendToTwoHours = getConsecutiveSlots(filteredSuggestions, slot.id, 2).length === 2;
                  const disabled = !slot.isAvailable;

                  return (
                    <SlotCard
                      key={slot.id}
                      slot={slot}
                      selected={selected}
                      disabled={disabled}
                      disabledReason={canExtendToTwoHours ? 'Có thể chơi 1 giờ hoặc 2 giờ liền mạch' : 'Chỉ còn trống 1 giờ từ khung này'}
                      onSelect={handleSelectSlot}
                    />
                  );
                })}
              </div>
            ) : (
              <div
                className="rounded-3xl p-5 text-center"
                style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(231,111,81,0.08)' }}
                >
                  <AlertTriangle style={{ width: 20, height: 20, color: '#E76F51' }} />
                </div>
                <p style={{ fontSize: 15, fontWeight: 900, color: '#1F2933' }}>
                  Ngày này không còn sân trống
                </p>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6, marginTop: 4 }}>
                  Hãy chuyển sang ngày khác trong cửa sổ đặt trước {MAX_BOOKING_ADVANCE_DAYS} ngày để xem khung giờ trống khác.
                </p>
              </div>
            )}
          </div>

          <div
            className="rounded-3xl p-4"
            style={{ background: 'rgba(14,124,123,0.07)', border: '1.5px solid rgba(14,124,123,0.16)' }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,124,123,0.12)' }}
              >
                <Bell style={{ width: 18, height: 18, color: '#0E7C7B' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>
                  Thông báo nhắc giờ sử dụng
                </p>
                <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 1.5 }}>
                  Mỗi lần giữ chỗ mới sẽ tự bật nhắc trước {BOOKING_REMINDER_MINUTES} phút để hội viên chủ động ra sân đúng giờ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-30"
        style={{
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(18px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="px-4 py-3">
          <button
            onClick={handlePrimaryAction}
            disabled={selectedSlots.length === 0 || selectedMatchesBooking || isSavingBooking}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.99] transition-all disabled:opacity-50"
            style={{
              background: selectedMatchesBooking ? 'rgba(14,124,123,0.14)' : 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow: selectedMatchesBooking ? 'none' : '0 10px 24px rgba(14,124,123,0.24)',
            }}
          >
            <CheckCircle2 style={{ width: 18, height: 18, color: 'white' }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>
              {savedBooking
                ? selectedMatchesBooking
                  ? 'Đã giữ chỗ'
                  : selectedSlots.length > 0
                    ? selectedDateISO === savedBooking.dateISO
                      ? `Đổi giờ sang ${selectedSlots.length} khung`
                      : 'Đổi sang ngày khác'
                    : 'Đổi lịch'
                : `Giữ chỗ ${selectedSlots.length > 0 ? selectedSlots.length : ''} khung giờ`}
            </span>
          </button>
          <div className="flex items-center justify-between mt-2 px-1 gap-3">
            <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
              {selectedSlots.length > 0 ? `${selectedCourtSummary} · ${selectedSlots.map(slot => `${slot.timeStart}-${slot.timeEnd}`).join(', ')}` : 'Chọn khung giờ để tiếp tục'}
            </p>
            <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>
              {selectedDateISO ? formatBookingDateLabel(selectedDateISO) : ''}
            </p>
          </div>
        </div>
      </div>

      {showBookingConfirm && selectedSlots.length > 0 && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.46)', backdropFilter: 'blur(3px)' }}
        >
          <div
            className="w-full max-w-[390px] rounded-t-[32px] px-5 pt-5 pb-6"
            style={{ background: 'white', boxShadow: '0 -10px 40px rgba(0,0,0,0.18)' }}
          >
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(0,0,0,0.10)' }} />

            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,124,123,0.10)' }}
              >
                <CheckCircle2 style={{ width: 22, height: 22, color: '#0E7C7B' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 17, fontWeight: 900, color: '#1F2933' }}>Xác nhận giữ chỗ sân</p>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginTop: 4 }}>
                  {savedBooking
                    ? selectedDateISO === savedBooking.dateISO
                      ? 'Bạn đang đổi giờ trong cùng ngày. Lượt giữ chỗ cũ sẽ được thay bằng các khung giờ mới đã chọn.'
                        : 'Bạn đang đổi sang ngày khác. Lượt giữ chỗ cũ sẽ được nhả ra và thay bằng lịch mới.'
                    : 'Hội viên có đồng ý giữ chỗ các khung giờ đã chọn không? Hệ thống sẽ lưu theo đúng giới hạn giữ chỗ và bật nhắc giờ tự động.'}
                </p>
              </div>
            </div>

            <div
              className="rounded-3xl p-4 mb-4"
              style={{ background: 'rgba(14,124,123,0.06)', border: '1.5px solid rgba(14,124,123,0.14)' }}
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <p style={{ fontSize: 16, fontWeight: 900, color: '#1F2933' }}>{selectedCourtSummary}</p>
                <span
                  className="px-2 py-0.5 rounded-lg"
                  style={{ fontSize: 9, fontWeight: 900, color: '#0E7C7B', background: 'rgba(14,124,123,0.10)' }}
                >
                  {selectedSlots.length} KHUNG GIỜ · 1 SÂN
                </span>
              </div>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>
                {selectedSlots[0].dateLabel}
              </p>
              <div className="space-y-2 mt-3">
                {selectedSlots.map(slot => (
                  <div
                    key={slot.id}
                    className="rounded-2xl px-3 py-2"
                    style={{ background: slot.isPriorityWindow ? 'rgba(233,196,106,0.18)' : 'white', border: '1px solid rgba(0,0,0,0.06)' }}
                  >
                    <p style={{ fontSize: 12, fontWeight: 900, color: '#1F2933' }}>
                      {slot.timeStart} - {slot.timeEnd}
                    </p>
                    <p style={{ fontSize: 10, color: slot.isPriorityWindow ? '#8A5A00' : '#6B7280', fontWeight: 700, marginTop: 2 }}>
                      {slot.isPriorityWindow ? 'Khung giờ ưu tiên Hội viên' : 'Khung giờ trống tiêu chuẩn'}
                    </p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 8 }}>
                Nhắc sân sẽ được bật trước {BOOKING_REMINDER_MINUTES} phút. Mỗi lần giữ chỗ chỉ tối đa {MAX_BOOKING_SLOTS} khung giờ trên {MAX_BOOKING_COURTS} sân. Mỗi lượt giữ chỗ được đổi giờ tối đa {MAX_BOOKING_RESCHEDULES} lần và sẽ bị khóa đổi khi còn dưới {BOOKING_CHANGE_LOCK_MINUTES} phút trước giờ chơi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowBookingConfirm(false)}
                className="py-3.5 rounded-2xl active:scale-[0.99] transition-all"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: '#6B7280' }}>Chưa đồng ý</span>
              </button>
              <button
                onClick={handleConfirmBooking}
                className="py-3.5 rounded-2xl active:scale-[0.99] transition-all"
                style={{ background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)' }}
              >
                <span style={{ fontSize: 14, fontWeight: 900, color: 'white' }}>Đồng ý giữ chỗ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelConfirm && savedBooking && (
        <div
          className="fixed inset-0 z-40 flex items-end justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.46)', backdropFilter: 'blur(3px)' }}
        >
          <div
            className="w-full max-w-[390px] rounded-t-[32px] px-5 pt-5 pb-6"
            style={{ background: 'white', boxShadow: '0 -10px 40px rgba(0,0,0,0.18)' }}
          >
            <div className="w-12 h-1 rounded-full mx-auto mb-4" style={{ background: 'rgba(0,0,0,0.10)' }} />

            <div className="flex items-start gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(231,111,81,0.10)' }}
              >
                <AlertTriangle style={{ width: 22, height: 22, color: '#E76F51' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 17, fontWeight: 900, color: '#1F2933' }}>Xác nhận hủy giữ chỗ sân</p>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5, marginTop: 4 }}>
                  Hội viên có chắc muốn hủy toàn bộ các khung giờ đã giữ không? Sau khi xác nhận, hệ thống sẽ trả toàn bộ về trạng thái trống.
                </p>
              </div>
            </div>

            <div
              className="rounded-3xl p-4 mb-4"
              style={{ background: 'rgba(231,111,81,0.06)', border: '1.5px solid rgba(231,111,81,0.14)' }}
            >
              <p style={{ fontSize: 16, fontWeight: 900, color: '#1F2933' }}>{getBookingCourtSummary(savedBooking)}</p>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginTop: 6 }}>
                {savedBooking.dateLabel}
              </p>
              <p style={{ fontSize: 14, fontWeight: 900, color: '#E76F51', marginTop: 6 }}>
                {getBookingSlotSummary(savedBooking)}
              </p>
              <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.45, marginTop: 8 }}>
                Banner trang chủ và trạng thái giữ chỗ sẽ được cập nhật ngay sau khi hủy.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="py-3.5 rounded-2xl active:scale-[0.99] transition-all"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: '#6B7280' }}>Giữ lại</span>
              </button>
              <button
                onClick={handleConfirmCancelBooking}
                className="py-3.5 rounded-2xl active:scale-[0.99] transition-all"
                style={{ background: 'linear-gradient(135deg,#E76F51 0%,#F4A261 100%)' }}
              >
                <span style={{ fontSize: 14, fontWeight: 900, color: 'white' }}>Đồng ý hủy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

