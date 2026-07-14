import { apiRequest, apiRequestNullable } from './apiClient';
import {
  BOOKING_REMINDER_MINUTES,
  formatBookingDateLabel,
  type CourtBooking,
  type CourtBookingHistoryItem,
  type CourtSlot,
} from '../components/memberCourtBooking';

interface CourtAvailabilitySlotDto {
  courtId: string;
  courtCode: string;
  courtName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  isPriorityWindow: boolean;
  priorityWindowLabel?: string | null;
  isRecommended: boolean;
  isSoon: boolean;
  note: string;
}

interface MemberCurrentCourtBookingDto {
  bookingId: string;
  bookingCode: string;
  courtId: string;
  courtCode: string;
  courtName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  slotCount: number;
  totalMinutes: number;
  playerCount: number;
  rescheduleCount: number;
  status: string;
  lifecycleStatus: string;
  canModify: boolean;
  minutesUntilStart: number;
  modifyRuleMessage: string;
  hasPriorityWindow: boolean;
  priorityWindowLabel?: string | null;
  checkInStatus: string;
  canCheckIn: boolean;
  checkInMessage: string;
}

interface MemberCourtBookingHistoryItemDto {
  historyId: string;
  bookingId: string;
  action: string;
  courtName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  slotCount: number;
  playerCount: number;
  createdAtUtc: string;
}

export type CourtAvailabilityViewModel = CourtSlot & {
  courtId: string;
};

export interface CurrentCourtBookingViewModel extends CourtBooking {
  status: string;
  lifecycleStatus: string;
  canModify: boolean;
  minutesUntilStart: number;
  modifyRuleMessage: string;
  checkInStatus: string;
  canCheckIn: boolean;
  checkInMessage: string;
}

export interface SaveCourtBookingPayload {
  courtId: string;
  bookingDate: string;
  startTime: string;
  slotCount: number;
  playerCount: number;
  note?: string;
}

function normalizeTime(time: string) {
  return time.slice(0, 5);
}

function toApiTime(time: string) {
  return time.length === 5 ? `${time}:00` : time;
}

function addMinutes(time: string, minutes: number) {
  const [hours, mins] = normalizeTime(time).split(':').map(Number);
  const date = new Date(2000, 0, 1, hours, mins + minutes, 0, 0);
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function buildBookingSlots(
  dateISO: string,
  courtName: string,
  startTime: string,
  slotCount: number,
  hasPriorityWindow: boolean,
  priorityWindowLabel?: string | null,
) {
  return Array.from({ length: slotCount }, (_, index) => {
    const slotStart = addMinutes(startTime, index * 60);
    const slotEnd = addMinutes(slotStart, 60);
    return {
      id: `${dateISO}-${courtName}-${slotStart}`,
      court: courtName,
      timeStart: slotStart,
      timeEnd: slotEnd,
      isPriorityWindow: hasPriorityWindow,
      priorityWindowLabel: priorityWindowLabel ?? undefined,
    };
  });
}

function mapCurrentBooking(dto: MemberCurrentCourtBookingDto): CurrentCourtBookingViewModel {
  const dateISO = dto.bookingDate;
  const normalizedStart = normalizeTime(dto.startTime);
  const slots = buildBookingSlots(
    dateISO,
    dto.courtName,
    normalizedStart,
    dto.slotCount,
    dto.hasPriorityWindow,
    dto.priorityWindowLabel,
  );

  return {
    court: dto.courtName,
    dateISO,
    dateLabel: formatBookingDateLabel(dateISO),
    timeStart: slots[0]?.timeStart ?? normalizedStart,
    timeEnd: slots.at(-1)?.timeEnd ?? normalizeTime(dto.endTime),
    playerCount: dto.playerCount,
    reminderMinutes: BOOKING_REMINDER_MINUTES,
    createdAtISO: new Date().toISOString(),
    slotCount: dto.slotCount,
    rescheduleCount: dto.rescheduleCount,
    priorityWindowLabel: dto.priorityWindowLabel ?? undefined,
    slots,
    status: dto.status,
    lifecycleStatus: dto.lifecycleStatus,
    canModify: dto.canModify,
    minutesUntilStart: dto.minutesUntilStart,
    modifyRuleMessage: dto.modifyRuleMessage,
    checkInStatus: dto.checkInStatus,
    canCheckIn: dto.canCheckIn,
    checkInMessage: dto.checkInMessage,
  };
}

function mapHistoryAction(action: string): CourtBookingHistoryItem['action'] {
  const normalized = action.toLowerCase();
  if (normalized === 'booked') return 'booked';
  if (normalized === 'rescheduled') return 'rescheduled';
  if (normalized === 'completed') return 'completed';
  if (normalized === 'noshow') return 'no_show';
  if (normalized === 'checkedin') return 'checked_in';
  return 'cancelled';
}

function mapHistoryItem(dto: MemberCourtBookingHistoryItemDto): CourtBookingHistoryItem {
  return {
    id: dto.historyId,
    action: mapHistoryAction(dto.action),
    court: dto.courtName,
    dateISO: dto.bookingDate,
    dateLabel: formatBookingDateLabel(dto.bookingDate),
    timeStart: normalizeTime(dto.startTime),
    timeEnd: normalizeTime(dto.endTime),
    playerCount: dto.playerCount,
    slotCount: dto.slotCount,
    createdAtISO: dto.createdAtUtc,
  };
}

function mapAvailabilitySlot(dto: CourtAvailabilitySlotDto): CourtAvailabilityViewModel {
  const normalizedStart = normalizeTime(dto.startTime);
  const normalizedEnd = normalizeTime(dto.endTime);

  return {
    courtId: dto.courtId,
    id: `${dto.bookingDate}-${dto.courtName}-${normalizedStart}`,
    court: dto.courtName,
    dateISO: dto.bookingDate,
    dateLabel: formatBookingDateLabel(dto.bookingDate),
    timeStart: normalizedStart,
    timeEnd: normalizedEnd,
    isAvailable: dto.isAvailable,
    isRecommended: dto.isRecommended,
    isSoon: dto.isSoon,
    isPriorityWindow: dto.isPriorityWindow,
    priorityWindowLabel: dto.priorityWindowLabel ?? undefined,
    note: dto.note,
  };
}

export async function getCourtBookingAvailability(dateISO: string) {
  const slots = await apiRequest<CourtAvailabilitySlotDto[]>(
    `/member/court-bookings/availability?date=${dateISO}`,
  );
  return slots.map(mapAvailabilitySlot);
}

export async function getCurrentCourtBooking() {
  const booking = await apiRequestNullable<MemberCurrentCourtBookingDto>(
    '/member/court-bookings/current',
  );
  return booking ? mapCurrentBooking(booking) : null;
}

export async function getCourtBookingHistory() {
  const history = await apiRequest<MemberCourtBookingHistoryItemDto[]>(
    '/member/court-bookings/history',
  );
  return history.map(mapHistoryItem);
}

export async function createCourtBooking(payload: SaveCourtBookingPayload) {
  const booking = await apiRequest<MemberCurrentCourtBookingDto>(
    '/member/court-bookings/',
    {
      method: 'POST',
      body: JSON.stringify({
        courtId: payload.courtId,
        bookingDate: payload.bookingDate,
        startTime: toApiTime(payload.startTime),
        slotCount: payload.slotCount,
        playerCount: payload.playerCount,
        note: payload.note?.trim() || undefined,
      }),
    },
  );

  return mapCurrentBooking(booking);
}

export async function rescheduleCurrentCourtBooking(payload: SaveCourtBookingPayload) {
  const booking = await apiRequest<MemberCurrentCourtBookingDto>(
    '/member/court-bookings/current/reschedule',
    {
      method: 'PUT',
      body: JSON.stringify({
        courtId: payload.courtId,
        bookingDate: payload.bookingDate,
        startTime: toApiTime(payload.startTime),
        slotCount: payload.slotCount,
        playerCount: payload.playerCount,
        note: payload.note?.trim() || undefined,
      }),
    },
  );

  return mapCurrentBooking(booking);
}

export async function cancelCurrentCourtBooking(note?: string) {
  await apiRequest<string>('/member/court-bookings/current/cancel', {
    method: 'POST',
    body: JSON.stringify({
      note: note?.trim() || undefined,
    }),
  });
}

export async function checkInCurrentCourtBooking(note?: string) {
  const booking = await apiRequest<MemberCurrentCourtBookingDto>(
    '/member/court-bookings/current/check-in',
    {
      method: 'POST',
      body: JSON.stringify({
        note: note?.trim() || undefined,
      }),
    },
  );

  return mapCurrentBooking(booking);
}
