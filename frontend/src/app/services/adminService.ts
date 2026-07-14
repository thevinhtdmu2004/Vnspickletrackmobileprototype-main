import { apiRequest } from './apiClient';

export interface AdminTodayCoachOperation {
  id: string;
  timeRange: string;
  courtName: string;
  coachName: string;
  durationHours: number;
  status: 'upcoming' | 'inProgress' | 'completed';
  hasConflict: boolean;
}

export interface AdminDashboard {
  ownerName: string;
  localDate: string;
  todayCoachUsageCount: number;
  coachConflictCount: number;
  monthlyCoachUsageHours: number;
  todayCoachOperations: AdminTodayCoachOperation[];
  courtCount: number;
  availableCourtCount: number;
  occupiedCourtCount: number;
  todayBookingCount: number;
  expiringMemberCount: number;
  lowStockCount: number;
  upcomingBookings: Array<{
    id: string;
    courtName: string;
    customerName: string;
    timeRange: string;
    status: string;
  }>;
}

export interface AdminMember {
  id: string;
  name: string;
  phone: string;
  className: string;
  totalSessions: number;
  attendedSessions: number;
  remainingSessions: number;
  status: 'active' | 'expiring' | 'expired' | 'inactive';
}

export interface AdminCourt {
  id: string;
  name: string;
  surface: string;
  hourlyRate: number;
  status: 'available' | 'reserved' | 'occupied' | 'maintenance' | 'paused' | 'inactive';
  nextChangeAt: string | null;
}

export interface AdminManagedCourt {
  id: string;
  name: string;
  courtType: string;
  surface: string;
  description: string;
  capacity: number;
  opensAt: string;
  closesAt: string;
  hourlyRate: number;
  status: 'available' | 'inUse' | 'maintenance' | 'paused' | 'inactive';
  isActive: boolean;
  bookingCount: number;
  scheduleCount: number;
  classCount: number;
  priceRuleCount: number;
  futureBookingCount: number;
  futureScheduleCount: number;
  canDelete: boolean;
  canDisable: boolean;
  priceRules: AdminCourtPriceRule[];
}

export type UpsertAdminCourtInput = {
  name: string;
  courtType: string;
  surface: string;
  description?: string;
  capacity: number;
  opensAt: string;
  closesAt: string;
  hourlyRate: number;
  status: 'available' | 'maintenance' | 'paused' | 'inactive';
};

export interface AdminCourtBooking {
  id: string;
  bookingCode: string;
  courtId: string;
  courtName: string;
  customerName: string;
  customerPhone: string;
  customerType: 'guest' | 'member' | 'student' | 'coach';
  date: string;
  startTime: string;
  endTime: string;
  timeRange: string;
  amount: number;
  status:
    | 'pending'
    | 'confirmed'
    | 'playing'
    | 'completed'
    | 'cancelled'
    | 'maintenance';
}

export interface AdminCourtScheduleItem {
  id: string;
  sourceType: 'booking' | 'classSession' | 'personal' | 'event' | 'maintenance' | 'blocked';
  sourceId: string;
  courtId: string;
  courtName: string;
  ownerName: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  timeRange: string;
  status: AdminCourtBooking['status'];
  scheduleType: string;
  detailTarget: string;
}

export interface AdminCourtOperations {
  selectedDate: string;
  localDate: string;
  courtCount: number;
  availableCourtCount: number;
  bookingCount: number;
  expectedRevenue: number;
  courts: AdminCourt[];
  bookings: AdminCourtBooking[];
  scheduleItems: AdminCourtScheduleItem[];
}

export interface AdminFinanceTransaction {
  id: string;
  date: string;
  customerName: string;
  description: string;
  amount: number;
  source: 'renewal' | 'booking';
  method: 'transfer' | 'cash' | 'other';
}

export function getAdminDashboard() {
  return apiRequest<AdminDashboard>('/admin/dashboard');
}

export function getAdminMembers() {
  return apiRequest<AdminMember[]>('/admin/members');
}

export function getCoachStudents() {
  return apiRequest<AdminMember[]>('/coach/students');
}

export interface AdminCoachSummary {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'underReview';
  agreementType: 'hourlyRental' | 'revenueShare' | 'hybrid';
  hourlyCourtRate: number;
  revenueSharePercent: number;
  partnershipStartedAtUtc: string;
  todayUsageCount: number;
  upcomingUsageCount: number;
  monthUsageHours: number;
  outstandingAmount: number;
  conflictCount: number;
  avatarUrl: string | null;
  phoneNumber: string | null;
  email: string | null;
  professionalLevel: string | null;
  certificates: string | null;
  experienceYears: number;
  teachingSkills: string | null;
  biography: string | null;
  workingSchedule: string | null;
}

export interface AdminCoachOperations {
  coachId: string;
  coachName: string;
  partnershipStatus: 'active' | 'paused' | 'underReview';
  agreementType: 'hourlyRental' | 'revenueShare' | 'hybrid';
  hourlyCourtRate: number;
  revenueSharePercent: number;
  usageHours: number;
  grossRevenue: number;
  courtFee: number;
  paidAmount: number;
  outstandingAmount: number;
  reconciliationStatus: 'pending' | 'partial' | 'reconciled';
  settlementId: string | null;
  period: string;
  isConfirmed: boolean;
  confirmedBy: string | null;
  confirmedAt: string | null;
  conflictCount: number;
  usageHistory: Array<{
    id: string;
    courtName: string;
    purpose: string;
    date: string;
    timeRange: string;
    durationHours: number;
    status: 'scheduled' | 'inProgress' | 'completed' | 'cancelled';
    hasConflict: boolean;
  }>;
  payments: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export interface AdminMembership {
  id: string;
  name: string;
  phone: string;
  packageName: string;
  packagePrice: number;
  totalSessions: number;
  remainingSessions: number;
  outstandingAmount: number;
  status: 'active' | 'expiring' | 'paymentDue' | 'inactive';
  expiresOn: string | null;
  benefits: Array<{ name: string; detail: string; status: string }>;
  bookings: Array<{
    id: string;
    courtName: string;
    date: string;
    timeRange: string;
    amount: number;
    status: string;
  }>;
  payments: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    status: string;
  }>;
}

export interface AdminPeopleOperations {
  localDate: string;
  coaches: AdminCoachSummary[];
  coachOperations: AdminCoachOperations[];
  members: AdminMembership[];
  popularPackage: {
    id: string;
    name: string;
    price: number;
    sessionCount: number;
  } | null;
}

export function getAdminPeopleOperations() {
  return apiRequest<AdminPeopleOperations>('/admin/people-operations');
}

export function createAdminCoach(input: {
  fullName: string;
  username: string;
  pin: string;
  partnershipStatus: AdminCoachSummary['status'];
  agreementType: AdminCoachSummary['agreementType'];
  hourlyCourtRate: number;
  revenueSharePercent: number;
}) {
  return apiRequest<{
    id: string;
    fullName: string;
    partnershipStatus: string;
    agreementType: string;
    hourlyCourtRate: number;
    revenueSharePercent: number;
    partnershipStartedAtUtc: string;
  }>('/admin/coaches', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdminCoachAgreement(id: string, input: {
  partnershipStatus: AdminCoachSummary['status'];
  agreementType: AdminCoachSummary['agreementType'];
  hourlyCourtRate: number;
  revenueSharePercent: number;
}) {
  return apiRequest<{
    id: string;
    partnershipStatus: string;
    agreementType: string;
    hourlyCourtRate: number;
    revenueSharePercent: number;
  }>(`/admin/coaches/${id}/agreement`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function reconcileAdminCoachSettlement(id: string, paidAmount: number) {
  return apiRequest<{
    id: string;
    paidAmount: number;
    outstandingAmount: number;
    reconciliationStatus: string;
    reconciledAtUtc: string;
  }>(`/admin/coach-settlements/${id}/reconcile`, {
    method: 'POST',
    body: JSON.stringify({ paidAmount }),
  });
}

export function confirmAdminCoachSettlement(id: string) {
  return apiRequest<{
    id: string;
    period: string;
    isConfirmed: boolean;
    confirmedBy: string;
    confirmedAtUtc: string;
    debtId: string | null;
  }>(`/admin/coach-settlements/${id}/confirm`, {
    method: 'POST',
  });
}

export interface AdminCoachReconciliation {
  coachId: string;
  coachName: string;
  agreementType: AdminCoachSummary['agreementType'];
  hourlyCourtRate: number;
  revenueSharePercent: number;
  usageHours: number;
  grossRevenue: number;
  revenueShareAmount: number;
  courtFee: number;
  paidAmount: number;
  outstandingAmount: number;
  reconciliationStatus: 'pending' | 'partial' | 'reconciled';
  settlementId: string | null;
  period: string;
  isConfirmed: boolean;
  confirmedBy: string | null;
  confirmedAt: string | null;
}

export interface AdminCoachReconciliations {
  period: string;
  reconciliations: AdminCoachReconciliation[];
}

export function getAdminCoachReconciliations() {
  return apiRequest<AdminCoachReconciliations>('/admin/coach-reconciliations');
}

export interface AdminDebtPayment {
  id: string;
  code: string;
  amount: number;
  method: string;
  paidAt: string;
}

export interface AdminDebt {
  id: string;
  direction: 'receivable' | 'payable';
  counterpartyType: 'booking' | 'member' | 'coach' | 'supplier' | 'other';
  counterparty: string;
  description: string;
  incurredDate: string;
  dueDate: string;
  amount: number;
  paidAmount: number;
  outstandingAmount: number;
  status: 'open' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  sourceType: string | null;
  sourceId: string | null;
  payments: AdminDebtPayment[];
}

export interface AdminDebts {
  totalReceivable: number;
  totalPayable: number;
  dueSoonAmount: number;
  overdueAmount: number;
  partialAmount: number;
  debts: AdminDebt[];
}

export type AdminCoachDebt = AdminDebt;
export type AdminCoachDebts = AdminDebts;

export function getAdminDebts(category?: AdminDebt['counterpartyType']) {
  const query = category ? `?category=${encodeURIComponent(category)}` : '';
  return apiRequest<AdminDebts>(`/admin/debts${query}`);
}

export function getAdminCoachDebts() {
  return getAdminDebts('coach');
}

export function recordAdminDebtPayment(
  id: string,
  input: { amount: number; method: string; note?: string },
) {
  return apiRequest<{
    id: string;
    paidAmount: number;
    outstandingAmount: number;
    code: string;
  }>(`/admin/debts/${id}/payments`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export const recordAdminCoachDebtPayment = recordAdminDebtPayment;

export interface CreateCourtBookingInput {
  courtId: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  status: 'pending' | 'confirmed';
  customerType?: 'guest' | 'member' | 'student' | 'coach';
}

export function getAdminCourtOperations(date?: string) {
  const query = date ? `?date=${encodeURIComponent(date)}` : '';
  return apiRequest<AdminCourtOperations>(`/admin/court-operations${query}`);
}

export async function getAdminCourts() {
  return (await apiRequest<AdminManagedCourt[] | undefined>('/admin/courts')) ?? [];
}

export function createAdminCourt(input: UpsertAdminCourtInput) {
  return apiRequest<{ id: string }>('/admin/courts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdminCourt(id: string, input: UpsertAdminCourtInput) {
  return apiRequest<{ id: string }>(`/admin/courts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function setAdminCourtStatus(id: string, status: UpsertAdminCourtInput['status']) {
  return apiRequest<{ id: string; status: string }>(`/admin/courts/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

export function deleteAdminCourt(id: string) {
  return apiRequest<void>(`/admin/courts/${id}`, { method: 'DELETE' });
}

export function createAdminCourtBooking(input: CreateCourtBookingInput) {
  return apiRequest<AdminCourtBooking>('/admin/court-bookings', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getAdminCourtBooking(id: string) {
  return apiRequest<AdminCourtBooking>(`/admin/court-bookings/${id}`);
}

export function createAdminCourtScheduleItem(input: {
  courtId: string;
  scheduleType: 'personal' | 'event' | 'maintenance' | 'blocked';
  ownerName: string;
  purpose: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'confirmed' | 'cancelled';
}) {
  return apiRequest<{ id: string }>('/admin/court-schedule-items', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface AdminBookingInvoice {
  bookingId: string;
  bookingCode: string;
  courtName: string;
  customerName: string;
  customerPhone: string;
  customerType: 'guest' | 'member' | 'student' | 'coach';
  bookingStatus: AdminCourtBooking['status'];
  date: string;
  timeRange: string;
  courtAmount: number;
  courtAmountBeforeBenefit: number;
  courtBenefitDiscount: number;
  membershipBenefitApplied: boolean;
  membershipPackageName: string | null;
  membershipBenefitExpiresAt: string | null;
  membershipBenefitUsesRemainingAfterApply: number | null;
  membershipBenefitNote: string | null;
  posAmount: number;
  rentalAmount: number;
  serviceAmount: number;
  surchargeAmount: number;
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingAmount: number;
  paymentMethod: string | null;
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  receiptCode: string | null;
  debtId: string | null;
  charges: Array<{
    id: string;
    chargeType: 'service' | 'rental' | 'surcharge' | 'discount';
    description: string;
    quantity: number;
    unitAmount: number;
    totalAmount: number;
  }>;
  sales: Array<{
    id: string;
    code: string;
    createdAt: string;
    totalAmount: number;
    items: Array<{
      itemId: string;
      name: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
    }>;
  }>;
  payments: Array<{
    id: string;
    receiptCode: string;
    amount: number;
    method: string;
    paidAt: string;
    createdBy: string;
    transactionType: 'payment' | 'refund';
    note: string | null;
  }>;
  financeEntries: Array<{
    id: string;
    code: string;
    type: 'income' | 'refund';
    amount: number;
    method: string;
    reconciliationStatus: 'pending' | 'reconciled' | 'mismatch';
    occurredAt: string;
  }>;
}

export function getAdminCourtBookingInvoice(id: string) {
  return apiRequest<AdminBookingInvoice>(`/admin/court-bookings/${id}/invoice`);
}

export function addAdminCourtBookingCharge(
  id: string,
  input: { chargeType: 'service' | 'rental' | 'discount'; description: string; quantity: number; unitAmount: number },
) {
  return apiRequest<{ id: string; totalAmount: number }>(`/admin/court-bookings/${id}/charges`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function recordAdminCourtBookingPayment(
  id: string,
  input: { amount: number; method: string; note?: string },
) {
  return apiRequest<{ id: string; paidAmount: number; outstandingAmount: number; receiptCode: string }>(
    `/admin/court-bookings/${id}/payments`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export function recordAdminCourtBookingRefund(
  id: string,
  input: { amount: number; method: string; note?: string },
) {
  return apiRequest<{
    id: string;
    bookingCode: string;
    refundCode: string;
    paidAmount: number;
    outstandingAmount: number;
  }>(`/admin/court-bookings/${id}/refunds`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface AdminCourtPriceRule {
  id: string;
  courtId: string;
  courtName: string;
  customerType: 'all' | 'guest' | 'member' | 'coach';
  dayType: 'all' | 'weekday' | 'weekend';
  priceType: 'regular' | 'peak' | 'holiday';
  startTime: string;
  endTime: string;
  hourlyRate: number;
  effectiveFrom: string;
  holidayDates: string[];
  createdBy: string;
  createdAtUtc: string;
  isActive: boolean;
}

export interface AdminCourtPricing {
  courts: Array<{ id: string; name: string; baseHourlyRate: number }>;
  rules: AdminCourtPriceRule[];
}

export function getAdminCourtPricing() {
  return apiRequest<AdminCourtPricing>('/admin/court-pricing');
}

export function createAdminCourtPriceRule(input: {
  courtId: string;
  customerType: AdminCourtPriceRule['customerType'];
  dayType: AdminCourtPriceRule['dayType'];
  priceType: AdminCourtPriceRule['priceType'];
  startTime: string;
  endTime: string;
  hourlyRate: number;
  effectiveFrom: string;
  holidayDates?: string[];
}) {
  return apiRequest<{ id: string }>('/admin/court-pricing', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdminCourtPriceRule(id: string, input: {
  courtId: string;
  customerType: AdminCourtPriceRule['customerType'];
  dayType: AdminCourtPriceRule['dayType'];
  priceType: AdminCourtPriceRule['priceType'];
  startTime: string;
  endTime: string;
  hourlyRate: number;
  effectiveFrom: string;
  holidayDates?: string[];
}) {
  return apiRequest<{ id: string }>(`/admin/court-pricing/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function setAdminCourtPriceRuleStatus(id: string, isActive: boolean) {
  return apiRequest<{ id: string; isActive: boolean }>(`/admin/court-pricing/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ isActive }),
  });
}

export function deleteAdminCourtPriceRule(id: string) {
  return apiRequest<void>(`/admin/court-pricing/${id}`, { method: 'DELETE' });
}

export interface AdminBookingConflict {
  id: string;
  bookingId: string;
  courtName: string;
  type: string;
  coachName: string | null;
  date: string;
  schedules: Array<{ title: string; timeRange: string }>;
}

export function getAdminBookingConflicts() {
  return apiRequest<AdminBookingConflict[]>('/admin/booking-conflicts');
}

export function resolveAdminBookingConflict(
  bookingId: string,
  input: {
    action: 'moveCourt' | 'changeTime' | 'cancel' | 'contactNote';
    note: string;
    courtId?: string;
    date?: string;
    startTime?: string;
    endTime?: string;
  },
) {
  return apiRequest<{ id: string; resolved: boolean }>(
    `/admin/booking-conflicts/${bookingId}/resolve`,
    { method: 'POST', body: JSON.stringify(input) },
  );
}

export interface AdminOwnerReport {
  period: 'day' | 'week' | 'month';
  fromDate: string;
  toDate: string;
  bookingCount: number;
  totalUsageHours: number;
  coachSessionCount: number;
  courtUtilizationRate: number;
  peakHour: string;
  newMemberCount: number;
  expiringMemberCount: number;
  courts: Array<{
    courtName: string;
    bookingCount: number;
    coachSessionCount: number;
    usedHours: number;
  }>;
}

export function getAdminOwnerReports(period: AdminOwnerReport['period']) {
  return apiRequest<AdminOwnerReport>(`/admin/operational-reports?period=${period}`);
}

export interface AdminRenewalOptions {
  members: Array<{
    id: string;
    name: string;
    phone: string;
    currentPackage: string;
    remainingSessions: number;
    status: string;
  }>;
  packages: Array<{
    id: string;
    name: string;
    sessionCount: number;
    price: number;
  }>;
}

export function getAdminRenewalOptions() {
  return apiRequest<AdminRenewalOptions>('/admin/renewal-options');
}

export function createAdminMemberRenewal(input: {
  memberId: string;
  packageId: string;
  sessions: number;
  amount: number;
  paymentMethod: 'cash' | 'transfer' | 'card' | 'debt';
  note?: string;
}) {
  return apiRequest<{ id: string; paymentStatus: string }>('/admin/member-renewals', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdminCoachProfile(id: string, input: {
  avatarUrl?: string;
  phoneNumber?: string;
  email?: string;
  professionalLevel?: string;
  certificates?: string;
  experienceYears: number;
  teachingSkills?: string;
  biography?: string;
  workingSchedule?: string;
}) {
  return apiRequest<{ id: string }>(`/admin/coaches/${id}/profile`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export type FinancePeriod = 'today' | 'week' | 'month';
export type FinanceEntryType = 'income' | 'expense' | 'refund';
export type FinanceDebtDirection = 'receivable' | 'payable';

export interface FinanceOperationFilters {
  period?: FinancePeriod;
  dateFrom?: string;
  dateTo?: string;
  branch?: string;
  transactionType?: string;
  category?: string;
  method?: string;
  status?: string;
  createdBy?: string;
}

export interface AdminFinanceOperationTransaction {
  id: string;
  code: string;
  date: string;
  type: FinanceEntryType;
  category: string;
  categoryLabel: string;
  counterparty: string;
  description: string;
  amount: number;
  actualAmount: number | null;
  difference: number;
  method: string;
  reconciliationStatus: 'pending' | 'reconciled' | 'mismatch';
  referenceCode: string | null;
  branchName: string;
  createdBy: string;
  confirmedBy: string | null;
  confirmedAt: string | null;
}

export interface AdminFinanceDebt {
  id: string;
  direction: FinanceDebtDirection;
  counterpartyType: 'booking' | 'member' | 'coach' | 'supplier' | 'other';
  counterparty: string;
  description: string;
  amount: number;
  paidAmount: number;
  outstandingAmount: number;
  dueDate: string;
  status: 'open' | 'partial' | 'paid' | 'overdue' | 'cancelled';
  sourceType: string | null;
  sourceId: string | null;
}

export interface AdminFinanceOperations {
  period: FinancePeriod;
  summary: {
    revenue: number;
    collected: number;
    expense: number;
    profit: number;
    refunds: number;
    netReceived: number;
    difference: number;
    unresolvedCount: number;
  };
  sources: Array<{
    category: string;
    label: string;
    amount: number;
    percentage: number;
  }>;
  transactions: AdminFinanceOperationTransaction[];
  debtSummary: {
    receivable: number;
    payable: number;
    overdueCount: number;
  };
  debts: AdminFinanceDebt[];
  reconciliationItems: AdminFinanceOperationTransaction[];
}

export interface CreateFinanceEntryInput {
  type: FinanceEntryType;
  category: string;
  counterparty: string;
  amount: number;
  method: string;
  date: string;
  referenceCode?: string;
  note?: string;
  branchName?: string;
}

export interface CreateFinanceDebtInput {
  direction: FinanceDebtDirection;
  counterparty: string;
  description: string;
  amount: number;
  dueDate: string;
}

export function getAdminFinanceOperations(filters: FinancePeriod | FinanceOperationFilters) {
  const normalized = typeof filters === 'string' ? { period: filters } : filters;
  const params = new URLSearchParams();
  Object.entries(normalized).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  return apiRequest<AdminFinanceOperations>(
    `/admin/finance-operations?${params.toString()}`,
  );
}

export function createAdminFinanceEntry(input: CreateFinanceEntryInput) {
  return apiRequest<{ id: string; code: string }>('/admin/finance-entries', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function createAdminFinanceDebt(input: CreateFinanceDebtInput) {
  return apiRequest<{ id: string }>('/admin/debts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdminFinanceDebt(id: string, input: {
  direction: FinanceDebtDirection;
  counterpartyType: AdminFinanceDebt['counterpartyType'];
  counterparty: string;
  description: string;
  amount: number;
  dueDate: string;
}) {
  return apiRequest<{ id: string }>(`/admin/debts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function cancelAdminFinanceDebt(id: string) {
  return apiRequest<{ id: string }>(`/admin/debts/${id}/cancel`, { method: 'POST' });
}

export function reconcileAdminFinanceEntry(id: string, actualAmount: number) {
  return apiRequest<{
    id: string;
    reconciliationStatus: string;
    actualAmount: number;
  }>(`/admin/finance-entries/${id}/reconcile`, {
    method: 'POST',
    body: JSON.stringify({ actualAmount }),
  });
}

export interface AdminStaffShift {
  id: string;
  staffName: string;
  startTime: string;
  endTime: string;
  status: 'onDuty' | 'handedOver' | 'upcoming' | 'absent';
}

export interface AdminStaffMember {
  id: string;
  name: string;
  username: string;
  isActive: boolean;
}

export interface AdminStaffOperations {
  onDutyCount: number;
  absentCount: number;
  nextShift: string | null;
  shifts: AdminStaffShift[];
  handovers: Array<{
    id: string;
    shiftId: string;
    handedOverBy: string;
    receivedBy: string;
    openingCash: number;
    closingCash: number;
    inventoryChecked: boolean;
    incidentNote: string | null;
    completedAt: string;
  }>;
}

export interface AdminInventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'retail' | 'rental';
  salePrice: number;
  costPrice: number;
  quantity: number;
  reorderLevel: number;
  rentalTotal: number;
  rentalInUse: number;
  status: 'inStock' | 'lowStock' | 'outOfStock';
}

export interface AdminInventoryOperations {
  itemCount: number;
  stockValue: number;
  lowStockCount: number;
  outOfStockCount: number;
  items: AdminInventoryItem[];
  bookings: Array<{ id: string; customerName: string; amount: number }>;
  movements: Array<{
    id: string;
    itemName: string;
    movementType: string;
    quantityChange: number;
    referenceCode: string;
    createdAtUtc: string;
    bookingId: string | null;
  }>;
}

export interface AdminExperienceOperations {
  contents: Array<{
    id: string;
    title: string;
    contentType: 'rules' | 'bookingPolicy' | 'video' | 'benefit';
    status: 'approved' | 'pending' | 'rejected';
    packageId: string | null;
    packageName: string | null;
    summary: string;
    createdByName: string;
    createdAtUtc: string;
    reviewedByName: string | null;
    reviewedAtUtc: string | null;
    rejectionReason: string | null;
  }>;
  promotions: Array<{
    id: string;
    name: string;
    memberGroup: string;
    benefitType: 'discount' | 'bonusHours';
    benefitValue: number;
    startDate: string;
    endDate: string;
    conditions: string;
    status: 'active' | 'upcoming' | 'ended';
  }>;
  packages: Array<{ id: string; name: string }>;
  alerts: Array<{
    type: 'bookingConflict' | 'lowStock';
    severity: 'critical' | 'warning' | 'info';
    title: string;
    detail: string;
  }>;
}

export function getAdminStaffOperations() {
  return apiRequest<AdminStaffOperations>('/admin/staff-operations');
}

export function getAdminStaffMembers() {
  return apiRequest<AdminStaffMember[]>('/admin/staff-members');
}

export function createAdminShiftHandover(input: {
  shiftId: string;
  handedOverBy: string;
  receivedBy: string;
  openingCash: number;
  closingCash: number;
  inventoryChecked: boolean;
  incidentNote?: string;
}) {
  return apiRequest<{ id: string }>('/admin/shift-handovers', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function createAdminStaffShift(input: {
  staffUserId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}) {
  return apiRequest<{ id: string }>('/admin/staff-shifts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export interface AdminPackage {
  id: string;
  name: string;
  sessionCount: number;
  price: number;
  isActive: boolean;
  validityDays: number;
  freeCourtUses: number;
  freeCourtMinutesPerUse: number;
}

export function getAdminPackages() {
  return apiRequest<AdminPackage[]>('/admin/packages');
}

export function createAdminPackage(input: Omit<AdminPackage, 'id' | 'isActive'>) {
  return apiRequest<{ id: string }>('/admin/packages', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function updateAdminPackage(id: string, input: Omit<AdminPackage, 'id' | 'isActive'>) {
  return apiRequest<{ id: string }>(`/admin/packages/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function setAdminPackageStatus(id: string, isActive: boolean) {
  return apiRequest<{ id: string; isActive: boolean }>(`/admin/packages/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ isActive }),
  });
}

export function deleteAdminPackage(id: string) {
  return apiRequest<void>(`/admin/packages/${id}`, { method: 'DELETE' });
}

export function updateAdminMember(id: string, input: {
  fullName: string;
  phoneNumber: string;
  skillLevel?: string;
}) {
  return apiRequest<{ id: string }>(`/admin/members/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  });
}

export function setAdminMemberStatus(id: string, isActive: boolean) {
  return apiRequest<{ id: string; isActive: boolean }>(`/admin/members/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ isActive }),
  });
}

export function deleteAdminMember(id: string) {
  return apiRequest<void>(`/admin/members/${id}`, { method: 'DELETE' });
}

export function upgradeAdminMemberToCoach(id: string, input: {
  agreementType: AdminCoachSummary['agreementType'];
  hourlyCourtRate: number;
  revenueSharePercent: number;
}) {
  return apiRequest<{ id: string }>(`/admin/members/${id}/upgrade-coach`, {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function setAdminCoachStatus(id: string, isActive: boolean) {
  return apiRequest<{ id: string; isActive: boolean }>(`/admin/coaches/${id}/status`, {
    method: 'POST',
    body: JSON.stringify({ isActive }),
  });
}

export function downgradeAdminCoach(id: string) {
  return apiRequest<{ id: string }>(`/admin/coaches/${id}/downgrade`, { method: 'POST' });
}

export function deleteAdminCoach(id: string) {
  return apiRequest<void>(`/admin/coaches/${id}`, { method: 'DELETE' });
}

export function getAdminSystemAlerts() {
  return apiRequest<AdminExperienceOperations['alerts']>('/admin/system-alerts');
}

export function getAdminInventoryOperations() {
  return apiRequest<AdminInventoryOperations>('/admin/inventory-operations');
}

export function restockAdminInventoryItem(
  id: string,
  quantity: number,
  details?: { unitCost?: number; paymentMethod?: string; paymentStatus?: string; supplier?: string },
) {
  return apiRequest<{ id: string; quantity: number }>(`/admin/inventory-items/${id}/restock`, {
    method: 'POST',
    body: JSON.stringify({ quantity, ...details }),
  });
}

export function countAdminInventoryItem(id: string, quantity: number) {
  return apiRequest<{ id: string; quantity: number }>(`/admin/inventory-items/${id}/count`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  });
}

export function createAdminPosSale(input: {
  bookingId?: string;
  items: Array<{ itemId: string; quantity: number }>;
  paymentMethod?: string;
  idempotencyKey: string;
}) {
  return apiRequest<{ id: string; code: string; totalAmount: number }>('/admin/pos-sales', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function getAdminExperienceOperations() {
  return apiRequest<AdminExperienceOperations>('/admin/experience-operations');
}

export function createAdminContentItem(input: {
  title: string;
  contentType: string;
  status: string;
  packageId?: string;
  summary: string;
}) {
  return apiRequest<{ id: string }>('/admin/content-items', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export function reviewAdminContentItem(id: string, status: 'approved' | 'rejected', reason?: string) {
  return apiRequest<AdminExperienceOperations['contents'][number]>(`/admin/content-items/${id}/review`, {
    method: 'POST',
    body: JSON.stringify({ status, reason }),
  });
}

export function createAdminPromotion(input: {
  name: string;
  memberGroup: string;
  benefitType: string;
  benefitValue: number;
  startDate: string;
  endDate: string;
  conditions?: string;
}) {
  return apiRequest<{ id: string }>('/admin/promotions', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
