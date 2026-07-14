import { apiRequest, apiRequestNullable } from './apiClient';

export interface MembershipPlanDto {
  id: string;
  code: string;
  name: string;
  durationMonths: number;
  monthlyPrice: number;
  canRegisterStudent: boolean;
  hasPriorityCourtWindow: boolean;
  highlightBenefits: string[];
}

export interface CurrentMembershipDto {
  subscriptionId: string;
  planId: string;
  planCode: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: string;
  isCurrent: boolean;
}

export interface MembershipPaymentHistoryDto {
  paymentId: string;
  planId: string;
  planName: string;
  amount: number;
  paymentMethod: string;
  paymentStatus: string;
  paymentDate: string;
  referenceCode?: string | null;
}

export interface MembershipRequestHistoryDto {
  requestId: string;
  planId: string;
  planName: string;
  requestType: string;
  status: string;
  requestedStartDate?: string | null;
  createdAtUtc: string;
  note?: string | null;
  reviewNote?: string | null;
}

export interface CreateMembershipRequestPayload {
  membershipPlanId: string;
  requestType: 1 | 2 | 3 | 4;
  requestedStartDate?: string | null;
  note?: string | null;
}

export function getMembershipPlans() {
  return apiRequest<MembershipPlanDto[]>('/member/membership/plans');
}

export function getCurrentMembership() {
  return apiRequestNullable<CurrentMembershipDto>('/member/membership/current');
}

export function getMembershipPaymentHistory() {
  return apiRequest<MembershipPaymentHistoryDto[]>('/member/membership/payments');
}

export function getMembershipRequestHistory() {
  return apiRequest<MembershipRequestHistoryDto[]>('/member/membership/requests');
}

export function createMembershipRequest(payload: CreateMembershipRequestPayload) {
  return apiRequest('/member/membership/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
