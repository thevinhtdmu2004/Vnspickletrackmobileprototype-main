import { getSessionIdentity } from '../services/apiClient';

export const COURT_BOOKING_STORAGE_KEY = 'vns-pickletrack-member-court-booking-v2';
export const COURT_BOOKING_HISTORY_STORAGE_KEY = 'vns-pickletrack-member-court-booking-history-v2';

export const COURT_NAMES = ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'] as const;

export const FACILITY_OPEN_HOUR = 6;
export const FACILITY_CLOSE_HOUR = 22;
export const BOOKING_DURATION_MINUTES = 60;
export const BOOKING_REMINDER_MINUTES = 30;
export const MAX_BOOKING_ADVANCE_DAYS = 14;
export const QUICK_BOOKING_DATE_DAYS = 7;
export const MAX_BOOKING_SLOTS = 2;
export const MAX_BOOKING_COURTS = 1;
export const MAX_BOOKING_PLAYERS = 4;
export const DEFAULT_BOOKING_PLAYER_COUNT = 2;
export const BOOKING_PLAYER_OPTIONS = [2, 4] as const;
export const MAX_BOOKING_RESCHEDULES = 2;
export const MAX_ACTIVE_BOOKINGS_PER_MEMBER = 1;
export const MAX_ACTIVE_BOOKING_MINUTES_PER_DAY = MAX_BOOKING_SLOTS * BOOKING_DURATION_MINUTES;
export const BOOKING_CHANGE_LOCK_MINUTES = 60;
export const BOOKING_CHECK_IN_OPEN_MINUTES = 30;
export const BOOKING_AUTO_RELEASE_MINUTES = 15;

export const MEMBER_PRIORITY_WINDOWS = [
  { start: '17:00', end: '19:00', label: '17:00 - 19:00' },
] as const;

export interface CourtBookingSlot {
  id: string;
  court: string;
  timeStart: string;
  timeEnd: string;
  isAvailable: boolean;
  isPriorityWindow: boolean;
  priorityWindowLabel?: string;
}

export interface CourtBooking {
  court: string;
  dateISO: string;
  dateLabel: string;
  timeStart: string;
  timeEnd: string;
  playerCount: number;
  reminderMinutes: number;
  createdAtISO: string;
  slotCount: number;
  rescheduleCount: number;
  slots: CourtBookingSlot[];
  priorityWindowLabel?: string;
  status?: string;
  lifecycleStatus?: string;
  canModify?: boolean;
  minutesUntilStart?: number;
  modifyRuleMessage?: string;
  checkInStatus?: string;
  canCheckIn?: boolean;
  checkInMessage?: string;
}

export interface CourtBookingHistoryItem {
  id: string;
  action: 'booked' | 'rescheduled' | 'cancelled' | 'completed' | 'no_show' | 'checked_in';
  court: string;
  dateISO: string;
  dateLabel: string;
  timeStart: string;
  timeEnd: string;
  playerCount: number;
  slotCount: number;
  createdAtISO: string;
}

export interface CourtSlot {
  id: string;
  court: string;
  dateISO: string;
  dateLabel: string;
  timeStart: string;
  timeEnd: string;
  isAvailable: boolean;
  isRecommended: boolean;
  isSoon: boolean;
  isPriorityWindow: boolean;
  priorityWindowLabel?: string;
  note: string;
}

export interface FacilityStatus {
  isOpen: boolean;
  label: string;
  detail: string;
  badge: string;
  minutesUntilOpen: number;
  minutesUntilClose: number;
}

export interface BookingCountdown {
  label: string;
  detail: string;
  isUrgent: boolean;
  isLive: boolean;
}

export interface BookingChangePolicy {
  canModify: boolean;
  minutesUntilStart: number;
  reason: string;
}

export interface DateOption {
  label: string;
  subLabel: string;
  dateISO: string;
  isToday: boolean;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

function getScopedStorageKey(baseKey: string) {
  const identity = getSessionIdentity();
  return identity ? `${baseKey}:${identity}` : baseKey;
}

function toStartOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function createDateFromISO(dateISO: string) {
  const [year, month, day] = dateISO.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function minutesOfDay(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${pad(hours)}:${pad(minutes)}`;
}

function formatDateLabel(date: Date) {
  return `${['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()]}, ${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatCompactDateLabel(date: Date) {
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

function formatDayShort(date: Date) {
  return ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()];
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function differenceInDays(a: Date, b: Date) {
  const diff = toStartOfDay(a).getTime() - toStartOfDay(b).getTime();
  return Math.round(diff / 86400000);
}

function sortSlotsByTime<T extends { timeStart: string }>(slots: T[]) {
  return [...slots].sort((left, right) => timeToMinutes(left.timeStart) - timeToMinutes(right.timeStart));
}

function isPriorityWindow(start: string, end: string) {
  const startMinutes = timeToMinutes(start);
  const endMinutes = timeToMinutes(end);
  return MEMBER_PRIORITY_WINDOWS.some(window => {
    const windowStart = timeToMinutes(window.start);
    const windowEnd = timeToMinutes(window.end);
    return startMinutes >= windowStart && endMinutes <= windowEnd;
  });
}

function buildDemoReservations(dayOffset: number) {
  if (dayOffset <= 0) {
    return [
      { court: 'Sân 1', start: '07:00' },
      { court: 'Sân 1', start: '08:00' },
      { court: 'Sân 2', start: '19:00' },
      { court: 'Sân 3', start: '20:00' },
      { court: 'Sân 4', start: '17:00' },
    ];
  }

  if (dayOffset === 1) {
    return [
      { court: 'Sân 1', start: '18:00' },
      { court: 'Sân 2', start: '19:00' },
      { court: 'Sân 3', start: '20:00' },
    ];
  }

  if (dayOffset <= 6) {
    return [
      { court: 'Sân 2', start: '18:00' },
      { court: 'Sân 4', start: '19:00' },
    ];
  }

  return [
    { court: 'Sân 1', start: '18:00' },
  ];
}

function normalizeLegacyBooking(raw: unknown) {
  if (!raw || typeof raw !== 'object') return null;

  const booking = raw as Partial<CourtBooking> & {
    court?: string;
    dateISO?: string;
    dateLabel?: string;
    timeStart?: string;
    timeEnd?: string;
    reminderMinutes?: number;
    createdAtISO?: string;
    slots?: CourtBookingSlot[];
  };

  if (!booking.court || !booking.dateISO || !booking.timeStart || !booking.timeEnd) {
    return null;
  }

  const normalizedSlots = Array.isArray(booking.slots) && booking.slots.length > 0
    ? sortSlotsByTime(booking.slots).map(slot => ({
      id: slot.id ?? `${booking.dateISO}-${slot.court}-${slot.timeStart}`,
      court: slot.court ?? booking.court!,
      timeStart: slot.timeStart,
      timeEnd: slot.timeEnd,
      isAvailable: typeof slot.isAvailable === 'boolean' ? slot.isAvailable : true,
      isPriorityWindow: typeof slot.isPriorityWindow === 'boolean'
        ? slot.isPriorityWindow
        : isPriorityWindow(slot.timeStart, slot.timeEnd),
      priorityWindowLabel: slot.priorityWindowLabel,
    }))
    : [{
      id: `${booking.dateISO}-${booking.court}-${booking.timeStart}`,
      court: booking.court,
      timeStart: booking.timeStart,
      timeEnd: booking.timeEnd,
      isAvailable: true,
      isPriorityWindow: isPriorityWindow(booking.timeStart, booking.timeEnd),
      priorityWindowLabel: booking.priorityWindowLabel,
    }];

  return {
    court: booking.court,
    dateISO: booking.dateISO,
    dateLabel: booking.dateLabel ?? formatBookingDateLabel(booking.dateISO),
    timeStart: normalizedSlots[0].timeStart,
    timeEnd: normalizedSlots[normalizedSlots.length - 1].timeEnd,
    playerCount: booking.playerCount ?? DEFAULT_BOOKING_PLAYER_COUNT,
    reminderMinutes: booking.reminderMinutes ?? BOOKING_REMINDER_MINUTES,
    createdAtISO: booking.createdAtISO ?? new Date().toISOString(),
    slotCount: normalizedSlots.length,
    rescheduleCount: booking.rescheduleCount ?? 0,
    priorityWindowLabel: booking.priorityWindowLabel,
    slots: normalizedSlots,
  } satisfies CourtBooking;
}

export function formatBookingDateLabel(dateISO: string) {
  return formatDateLabel(createDateFromISO(dateISO));
}

export function formatBookingCompactDate(dateISO: string) {
  return formatCompactDateLabel(createDateFromISO(dateISO));
}

export function formatBookingDayShort(dateISO: string) {
  return formatDayShort(createDateFromISO(dateISO));
}

function parseDateISOFromLabel(dateLabel: string) {
  const match = dateLabel.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (!match) return null;
  const [, day, month, year] = match;
  return `${year}-${month}-${day}`;
}

export function getBookingDateBounds(now = new Date()) {
  const minDate = toStartOfDay(now);
  const maxDate = addDays(minDate, MAX_BOOKING_ADVANCE_DAYS);

  return {
    minDateISO: `${minDate.getFullYear()}-${pad(minDate.getMonth() + 1)}-${pad(minDate.getDate())}`,
    maxDateISO: `${maxDate.getFullYear()}-${pad(maxDate.getMonth() + 1)}-${pad(maxDate.getDate())}`,
  };
}

export function isDateWithinBookingWindow(dateISO: string, now = new Date()) {
  const selected = createDateFromISO(dateISO);
  const { minDateISO, maxDateISO } = getBookingDateBounds(now);
  return selected >= createDateFromISO(minDateISO) && selected <= createDateFromISO(maxDateISO);
}

export function getDateOptions(now = new Date(), totalDays = QUICK_BOOKING_DATE_DAYS): DateOption[] {
  return Array.from({ length: totalDays }, (_, offset) => {
    const date = addDays(now, offset);
    return {
      label: offset === 0 ? 'Hôm nay' : offset === 1 ? 'Ngày mai' : `+${offset} ngày`,
      subLabel: `${formatCompactDateLabel(date)} · ${formatDayShort(date)}`,
      dateISO: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`,
      isToday: offset === 0,
    };
  });
}

export function getMemberPriorityWindowLabels() {
  return MEMBER_PRIORITY_WINDOWS.map(window => window.label);
}

export function getFacilityStatus(now = new Date()): FacilityStatus {
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), FACILITY_OPEN_HOUR, 0, 0, 0);
  const close = new Date(now.getFullYear(), now.getMonth(), now.getDate(), FACILITY_CLOSE_HOUR, 0, 0, 0);
  const minutesNow = minutesOfDay(now);
  const openMinutes = FACILITY_OPEN_HOUR * 60;
  const closeMinutes = FACILITY_CLOSE_HOUR * 60;

  if (now < start) {
    return {
      isOpen: false,
      label: 'Đang đóng cửa',
      detail: `Mở cửa lúc ${minutesToTime(openMinutes)}`,
      badge: `Mở sau ${Math.max(1, Math.ceil((start.getTime() - now.getTime()) / 60000))} phút`,
      minutesUntilOpen: Math.max(1, Math.ceil((start.getTime() - now.getTime()) / 60000)),
      minutesUntilClose: Math.max(0, closeMinutes - minutesNow),
    };
  }

  if (now >= close) {
    return {
      isOpen: false,
      label: 'Đã đóng cửa',
      detail: 'Hẹn đặt sân vào ngày mai',
      badge: 'Mở lại 06:00',
      minutesUntilOpen: Math.max(1, (24 * 60 - minutesNow) + openMinutes),
      minutesUntilClose: 0,
    };
  }

  const minutesUntilClose = Math.max(1, Math.ceil((close.getTime() - now.getTime()) / 60000));
  return {
    isOpen: true,
    label: 'Đang mở cửa',
    detail: `Còn ${minutesUntilClose} phút nữa đóng cửa`,
    badge: minutesUntilClose <= 60 ? 'Sắp đóng cửa' : 'Đang phục vụ',
    minutesUntilOpen: 0,
    minutesUntilClose,
  };
}

export function getSuggestedSlots(dateISO: string, now = new Date()) {
  if (!isDateWithinBookingWindow(dateISO, now)) return [] as CourtSlot[];

  const selectedDate = createDateFromISO(dateISO);
  const today = toStartOfDay(now);
  const dayOffset = differenceInDays(selectedDate, today);
  const reservations = buildDemoReservations(dayOffset);
  const currentMinutes = minutesOfDay(now);
  const desiredMinutes = dayOffset <= 0 ? Math.max(currentMinutes + 60, 18 * 60) : 18 * 60;
  const items: CourtSlot[] = [];

  COURT_NAMES.forEach((court, courtIndex) => {
    for (let startMinutes = FACILITY_OPEN_HOUR * 60; startMinutes < (FACILITY_CLOSE_HOUR * 60); startMinutes += BOOKING_DURATION_MINUTES) {
      const start = minutesToTime(startMinutes);
      const end = minutesToTime(startMinutes + BOOKING_DURATION_MINUTES);
      const isPast = dayOffset <= 0 && startMinutes < currentMinutes + 30;
      const isReserved = reservations.some(item => item.court === court && item.start === start);
      if (isPast || isReserved) continue;

      const priority = isPriorityWindow(start, end);
      const distanceScore = Math.abs(startMinutes - desiredMinutes);
      const courtScore = courtIndex * 12;
      const eveningBias = startMinutes >= 17 * 60 ? -18 : 0;

      items.push({
        id: `${dateISO}-${court}-${start}`,
        court,
        dateISO,
        dateLabel: formatBookingDateLabel(dateISO),
        timeStart: start,
        timeEnd: end,
        isRecommended: distanceScore <= 60 || (dayOffset === 0 && startMinutes <= currentMinutes + 120),
        isSoon: dayOffset === 0 && startMinutes <= currentMinutes + 120,
        isAvailable: true,
        isPriorityWindow: priority,
        note: buildSlotNote(startMinutes, currentMinutes, dayOffset, priority),
      });
    }
  });

  return items.sort((left, right) => {
    const leftMinutes = timeToMinutes(left.timeStart);
    const rightMinutes = timeToMinutes(right.timeStart);
    const leftScore = Math.abs(leftMinutes - desiredMinutes)
      + COURT_NAMES.indexOf(left.court as typeof COURT_NAMES[number]) * 12
      + (leftMinutes >= 17 * 60 ? -18 : 0);
    const rightScore = Math.abs(rightMinutes - desiredMinutes)
      + COURT_NAMES.indexOf(right.court as typeof COURT_NAMES[number]) * 12
      + (rightMinutes >= 17 * 60 ? -18 : 0);

    return leftScore - rightScore || leftMinutes - rightMinutes;
  });
}

function buildSlotNote(startMinutes: number, currentMinutes: number, dayOffset: number, priority: boolean) {
  if (priority) return 'Khung giờ ưu tiên Hội viên';
  if (dayOffset > 0) return 'Sẵn sàng cho ngày này';
  const delta = startMinutes - currentMinutes;
  if (delta <= 60) return 'Rất gần giờ hiện tại';
  if (delta <= 120) return 'Đề xuất đặt nhanh';
  return 'Khung giờ còn trống';
}

export function buildCourtBooking(
  slots: CourtSlot[],
  reminderMinutes = BOOKING_REMINDER_MINUTES,
  playerCount = DEFAULT_BOOKING_PLAYER_COUNT,
  rescheduleCount = 0,
): CourtBooking {
  const orderedSlots = sortSlotsByTime(slots);
  const firstSlot = orderedSlots[0];
  const lastSlot = orderedSlots[orderedSlots.length - 1];
  const courtSummary = getCourtSummaryFromSlots(orderedSlots);

  return {
    court: courtSummary,
    dateISO: firstSlot.dateISO,
    dateLabel: firstSlot.dateLabel,
    timeStart: firstSlot.timeStart,
    timeEnd: lastSlot.timeEnd,
    playerCount,
    reminderMinutes,
    createdAtISO: new Date().toISOString(),
    slotCount: orderedSlots.length,
    rescheduleCount,
    slots: orderedSlots.map(slot => ({
      id: slot.id,
      court: slot.court,
      timeStart: slot.timeStart,
      timeEnd: slot.timeEnd,
      isAvailable: true,
      isPriorityWindow: slot.isPriorityWindow,
      priorityWindowLabel: slot.priorityWindowLabel,
    })),
    priorityWindowLabel: orderedSlots.find(slot => slot.priorityWindowLabel)?.priorityWindowLabel,
  };
}

export function getBookingDurationMinutes(booking: CourtBooking) {
  return booking.slotCount * BOOKING_DURATION_MINUTES;
}

export function getBookingStartDateTime(booking: CourtBooking) {
  const bookingDate = createDateFromISO(booking.dateISO);
  const [hours, minutes] = booking.timeStart.split(':').map(Number);
  return new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate(),
    hours,
    minutes,
    0,
    0,
  );
}

export function getBookingChangePolicy(booking: CourtBooking, now = new Date()): BookingChangePolicy {
  const start = getBookingStartDateTime(booking);
  const diff = start.getTime() - now.getTime();
  const minutesUntilStart = Math.ceil(diff / 60000);

  if (minutesUntilStart <= 0) {
    return {
      canModify: false,
      minutesUntilStart,
      reason: `Đã tới giờ sử dụng sân. Từ lúc bắt đầu, booking cần xử lý theo check-in hoặc no-show thay vì tự đổi/hủy trên app.`,
    };
  }

  if (minutesUntilStart <= BOOKING_CHANGE_LOCK_MINUTES) {
    return {
      canModify: false,
      minutesUntilStart,
      reason: `Trong vòng ${BOOKING_CHANGE_LOCK_MINUTES} phút trước giờ chơi, hội viên không thể tự đổi hoặc hủy để tránh giữ sân rồi nhả sát giờ.`,
    };
  }

  return {
    canModify: true,
    minutesUntilStart,
    reason: `Có thể tự đổi hoặc hủy trên app cho tới trước giờ chơi ${BOOKING_CHANGE_LOCK_MINUTES} phút.`,
  };
}

export function getBookingCountdown(booking: CourtBooking, now = new Date()): BookingCountdown {
  const bookingDate = createDateFromISO(booking.dateISO);
  const start = new Date(
    bookingDate.getFullYear(),
    bookingDate.getMonth(),
    bookingDate.getDate(),
    Number(booking.timeStart.split(':')[0]),
    Number(booking.timeStart.split(':')[1]),
    0,
    0,
  );
  const diff = start.getTime() - now.getTime();
  const minutes = Math.max(0, Math.ceil(diff / 60000));

  if (diff <= 0) {
    return {
      label: 'Đã đến giờ sử dụng',
      detail: 'Hãy ra sân hoặc cập nhật lại lịch nếu bạn đổi kế hoạch.',
      isUrgent: true,
      isLive: true,
    };
  }

  if (minutes <= booking.reminderMinutes) {
    return {
      label: `Nhắc sân trong ${minutes} phút`,
      detail: `Hệ thống sẽ nhắc trước ${booking.reminderMinutes} phút.`,
      isUrgent: true,
      isLive: false,
    };
  }

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return {
    label: hours > 0 ? `Còn ${hours} giờ ${rest} phút` : `Còn ${rest} phút`,
    detail: `Đơn đang giữ ${booking.slotCount} khung giờ tại ${getBookingCourtSummary(booking)} cho ${booking.playerCount} người.`,
    isUrgent: false,
    isLive: false,
  };
}

export function loadCourtBooking() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(getScopedStorageKey(COURT_BOOKING_STORAGE_KEY));
    if (!raw) return null;
    return normalizeLegacyBooking(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveCourtBooking(booking: CourtBooking) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getScopedStorageKey(COURT_BOOKING_STORAGE_KEY), JSON.stringify(booking));
}

export function clearCourtBooking() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(getScopedStorageKey(COURT_BOOKING_STORAGE_KEY));
}

export function getBookingDateTimeLabel(booking: CourtBooking) {
  const timeLabel = booking.slotCount > 1
    ? `${booking.timeStart} - ${booking.timeEnd} · ${booking.slotCount} khung giờ`
    : `${booking.timeStart} - ${booking.timeEnd}`;

  return `${booking.dateLabel} · ${getBookingCourtSummary(booking)} · ${timeLabel} · ${booking.playerCount} người`;
}

export function getBookingSlotSummary(booking: CourtBooking) {
  return booking.slots.map(slot => `${slot.timeStart} - ${slot.timeEnd}`).join(' · ');
}

function getCourtSummaryFromSlots(slots: Array<{ court: string }>) {
  const uniqueCourts = Array.from(new Set(slots.map(slot => slot.court)));
  return uniqueCourts.join(' · ');
}

export function getBookingCourtSummary(booking: CourtBooking) {
  if (Array.isArray(booking.slots) && booking.slots.length > 0) {
    return getCourtSummaryFromSlots(booking.slots);
  }
  return booking.court;
}

export function loadCourtBookingHistory() {
  if (typeof window === 'undefined') return [] as CourtBookingHistoryItem[];
  try {
    const raw = window.localStorage.getItem(getScopedStorageKey(COURT_BOOKING_HISTORY_STORAGE_KEY));
    if (!raw) return [] as CourtBookingHistoryItem[];
    const parsed = JSON.parse(raw) as Array<Partial<CourtBookingHistoryItem>>;
    if (!Array.isArray(parsed)) return [] as CourtBookingHistoryItem[];

    return parsed
      .map((item) => {
        if (!item.id || !item.action || !item.court || !item.dateLabel || !item.timeStart || !item.timeEnd || !item.createdAtISO) {
          return null;
        }

        return {
          id: item.id,
          action: item.action,
          court: item.court,
          dateISO: item.dateISO ?? parseDateISOFromLabel(item.dateLabel) ?? item.createdAtISO.slice(0, 10),
          dateLabel: item.dateLabel,
          timeStart: item.timeStart,
          timeEnd: item.timeEnd,
          playerCount: item.playerCount ?? DEFAULT_BOOKING_PLAYER_COUNT,
          slotCount: item.slotCount ?? 1,
          createdAtISO: item.createdAtISO,
        } satisfies CourtBookingHistoryItem;
      })
      .filter((item): item is CourtBookingHistoryItem => item !== null);
  } catch {
    return [] as CourtBookingHistoryItem[];
  }
}

export function saveCourtBookingHistory(items: CourtBookingHistoryItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(getScopedStorageKey(COURT_BOOKING_HISTORY_STORAGE_KEY), JSON.stringify(items));
}

export function addCourtBookingHistoryItem(item: Omit<CourtBookingHistoryItem, 'id' | 'createdAtISO'>) {
  const currentItems = loadCourtBookingHistory();
  const nextItems: CourtBookingHistoryItem[] = [
    {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAtISO: new Date().toISOString(),
    },
    ...currentItems,
  ];
  saveCourtBookingHistory(nextItems);
  return nextItems;
}
