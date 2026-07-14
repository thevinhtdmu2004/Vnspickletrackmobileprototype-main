import type {
  CurrentMembershipDto,
  MembershipPaymentHistoryDto,
  MembershipPlanDto,
  MembershipRequestHistoryDto,
} from '../services/memberMembershipService';

export const MEMBER_MEMBERSHIP_PAYMENT_HISTORY_STORAGE_KEY = 'vns-pickletrack-member-membership-payment-history-v1';

export type MemberMembershipAction = 'register' | 'renew' | 'upgrade' | 'downgrade';
export type MemberMembershipPaymentStatus = 'paid' | 'pending';

export type MembershipPlan = {
  id: number;
  code: string;
  name: string;
  duration: string;
  durationMonths: number;
  price: string;
  highlight?: string;
  iconBg: string;
  iconColor: string;
  summaryBenefits: string;
  benefits: string[];
};

export type CurrentMembership = {
  id: number;
  name: string;
  remaining: string;
  startDate: string;
  status: string;
  note: string;
  totalMonths: number;
  usedMonths: number;
  remainingMonths: number;
};

export type MemberMembershipPaymentHistoryEntry = {
  id: string;
  action: MemberMembershipAction;
  planId: number | string;
  planName: string;
  date: string;
  amount: string;
  method: string;
  status: MemberMembershipPaymentStatus;
  note: string;
};

export const MEMBER_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 1,
    code: 'pkg-day',
    name: 'Gói Hội viên Ngày',
    duration: '1 ngày',
    durationMonths: 0.03,
    price: '50.000đ',
    iconBg: 'rgba(14,124,123,0.10)',
    iconColor: '#0E7C7B',
    summaryBenefits: 'Thích hợp cho trải nghiệm chơi lẻ và đặt lịch ngắn hạn',
    benefits: [
      'Đặt sân trong vòng 24 giờ',
      'Đăng ký dịch vụ sân tập cơ bản',
    ],
  },
  {
    id: 2,
    code: 'pkg-month',
    name: 'Gói Hội viên Tháng',
    duration: '1 tháng',
    durationMonths: 1,
    price: '500.000đ',
    highlight: 'Ưu đãi 10%',
    iconBg: 'rgba(42,157,143,0.10)',
    iconColor: '#2A9D8F',
    summaryBenefits: 'Tiết kiệm 10% · Giờ vàng ưu tiên đặt lịch chơi',
    benefits: [
      'Có toàn bộ quyền lợi đặt sân trong tháng',
      'Được ưu tiên đặt sớm hơn 3 ngày',
      'Giảm giá 10% khi thuê vợt/bóng tại cửa hàng',
    ],
  },
  {
    id: 3,
    code: 'pkg-year',
    name: 'Gói Hội viên Năm',
    duration: '1 năm',
    durationMonths: 12,
    price: '4.000.000đ',
    highlight: 'Ưu đãi 20%',
    iconBg: 'rgba(244,162,97,0.14)',
    iconColor: '#E8832A',
    summaryBenefits: 'Tiết kiệm 20% · Khung giờ cố định · Ưu tiên cao nhất',
    benefits: [
      'Có toàn bộ quyền lợi hội viên trọn vẹn cả năm',
      'Được cố định giờ chơi hàng tuần',
      'Ưu đãi giảm giá 20% thuê vợt/bóng tại cửa hàng',
    ],
  },
];

export const CURRENT_MEMBERSHIP: CurrentMembership = {
  id: 2,
  name: 'Hội viên Nâng cao',
  remaining: '21 ngày',
  startDate: '01/04/2026',
  status: 'Đang hoạt động',
  note: 'Có thể đăng ký học viên · Mở đặt sớm hơn gói Cơ bản',
  totalMonths: 3,
  usedMonths: 2,
  remainingMonths: 1,
};

export type MembershipRequestHistoryEntry = {
  id: string;
  action: MemberMembershipAction;
  planName: string;
  date: string;
  statusKey: 'pending' | 'approved' | 'rejected';
  status: string;
  note: string;
};

export const DEFAULT_PAYMENT_HISTORY: MemberMembershipPaymentHistoryEntry[] = [
  {
    id: 'membership-payment-20260401',
    action: 'renew',
    planId: 2,
    planName: 'Hội viên Nâng cao',
    date: '01/04/2026',
    amount: '699.000đ',
    method: 'Chuyển khoản',
    status: 'paid',
    note: 'Gia hạn 3 tháng · BIDV ****1234',
  },
  {
    id: 'membership-payment-20260101',
    action: 'register',
    planId: 1,
    planName: 'Hội viên Cơ bản',
    date: '01/01/2026',
    amount: '299.000đ',
    method: 'Tiền mặt',
    status: 'paid',
    note: 'Đăng ký mới · Thu tại quầy',
  },
];

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function getMembershipPlanById(planId: number) {
  return MEMBER_MEMBERSHIP_PLANS.find((plan) => plan.id === planId) ?? MEMBER_MEMBERSHIP_PLANS[0];
}

export function loadMemberMembershipPaymentHistory() {
  if (!canUseStorage()) return DEFAULT_PAYMENT_HISTORY;

  const raw = window.localStorage.getItem(MEMBER_MEMBERSHIP_PAYMENT_HISTORY_STORAGE_KEY);
  if (!raw) return DEFAULT_PAYMENT_HISTORY;

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_PAYMENT_HISTORY;
    return parsed as MemberMembershipPaymentHistoryEntry[];
  } catch {
    return DEFAULT_PAYMENT_HISTORY;
  }
}

export function saveMemberMembershipPaymentHistory(entries: MemberMembershipPaymentHistoryEntry[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(MEMBER_MEMBERSHIP_PAYMENT_HISTORY_STORAGE_KEY, JSON.stringify(entries));
}

export function appendMemberMembershipPaymentHistoryEntry(
  action: MemberMembershipAction,
  plan: MembershipPlan,
) {
  const now = new Date();
  const date = now.toLocaleDateString('vi-VN');
  const entries = loadMemberMembershipPaymentHistory();

  const nextEntry: MemberMembershipPaymentHistoryEntry = {
    id: `membership-${action}-${now.getTime()}`,
    action,
    planId: plan.id,
    planName: plan.name,
    date,
    amount: plan.price,
    method: 'Chờ Admin xác nhận',
    status: 'pending',
    note: action === 'renew'
      ? `Yêu cầu gia hạn ${plan.duration} đang chờ xác nhận`
      : `Yêu cầu đăng ký ${plan.duration} đang chờ xác nhận`,
  };

  const nextEntries = [nextEntry, ...entries];
  saveMemberMembershipPaymentHistory(nextEntries);
  return nextEntry;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('vi-VN');
}

function formatCurrency(value: number) {
  return `${value.toLocaleString('vi-VN')}đ`;
}

function sentenceCaseStatus(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
}

export function mapMembershipPlansFromApi(plans: MembershipPlanDto[]): MembershipPlan[] {
  return plans.map((plan, index) => {
    const highlightBenefits = Array.isArray(plan.highlightBenefits)
      ? plan.highlightBenefits.filter(Boolean)
      : [];

    const fallbackBenefits = [
      plan.canRegisterStudent ? 'Có thể đăng ký học viên' : 'Chưa hỗ trợ đăng ký học viên',
      plan.hasPriorityCourtWindow ? 'Có khung giờ ưu tiên hội viên' : 'Không có khung giờ ưu tiên',
    ];

    const benefits = highlightBenefits.length > 0 ? highlightBenefits : fallbackBenefits;

    return {
      id: index + 1,
      code: plan.id,
      name: plan.name,
      duration: `${plan.durationMonths} tháng`,
      durationMonths: plan.durationMonths,
      price: formatCurrency(plan.monthlyPrice),
      highlight: index === 1 ? 'Phổ biến nhất' : index === 2 ? 'Ưu đãi nhiều nhất' : undefined,
      iconBg: index === 0 ? 'rgba(14,124,123,0.10)' : index === 1 ? 'rgba(42,157,143,0.10)' : 'rgba(244,162,97,0.14)',
      iconColor: index === 0 ? '#0E7C7B' : index === 1 ? '#2A9D8F' : '#E8832A',
      summaryBenefits: benefits.join(' · ') || 'Đang cập nhật quyền lợi hội viên',
      benefits,
    };
  });
}

export function mapCurrentMembershipFromApi(
  currentMembership: CurrentMembershipDto | null,
  plans: MembershipPlan[],
): CurrentMembership | null {
  if (!currentMembership) {
    return null;
  }

  const plan =
    plans.find((item) => item.code === currentMembership.planId || item.name === currentMembership.planName) ??
    plans.find((item) => item.name === currentMembership.planName);

  const startDate = new Date(currentMembership.startDate);
  const endDate = new Date(currentMembership.endDate);
  const totalMonths = plan?.durationMonths ?? Math.max(1, (endDate.getFullYear() - startDate.getFullYear()) * 12 + endDate.getMonth() - startDate.getMonth() + 1);
  const usedMonths = Math.max(
    0,
    Math.min(
      totalMonths,
      (new Date().getFullYear() - startDate.getFullYear()) * 12 +
        new Date().getMonth() -
        startDate.getMonth() +
        (new Date().getDate() >= startDate.getDate() ? 1 : 0),
    ),
  );
  const remainingMonths = Math.max(0, totalMonths - usedMonths);
  const remainingDays = Math.max(0, Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));

  return {
    id: plan?.id ?? 1,
    name: currentMembership.planName,
    remaining: `${remainingDays} ngày`,
    startDate: formatDate(currentMembership.startDate),
    status: currentMembership.status,
    note: plan?.summaryBenefits ?? 'Quyền lợi hội viên đang được áp dụng theo gói hiện tại.',
    totalMonths,
    usedMonths: Math.max(1, usedMonths),
    remainingMonths,
  };
}

export function mapMembershipPaymentsFromApi(
  payments: MembershipPaymentHistoryDto[],
): MemberMembershipPaymentHistoryEntry[] {
  return payments.map((payment) => ({
    id: payment.paymentId,
    action: 'renew',
    planId: payment.planId,
    planName: payment.planName,
    date: formatDate(payment.paymentDate),
    amount: formatCurrency(payment.amount),
    method: payment.paymentMethod,
    status: payment.paymentStatus.toLowerCase() === 'confirmed' ? 'paid' : 'pending',
    note: payment.referenceCode
      ? `Mã giao dịch: ${payment.referenceCode}`
      : 'Giao dịch hội viên',
  }));
}

export function mapMembershipRequestsFromApi(
  requests: MembershipRequestHistoryDto[],
): MembershipRequestHistoryEntry[] {
  return requests.map((request) => ({
    id: request.requestId,
    action:
      request.requestType.toLowerCase() === 'register'
        ? 'register'
        : request.requestType.toLowerCase() === 'upgrade'
          ? 'upgrade'
          : request.requestType.toLowerCase() === 'downgrade'
            ? 'downgrade'
            : 'renew',
    planName: request.planName,
    date: formatDate(request.requestedStartDate ?? request.createdAtUtc),
    statusKey:
      request.status.toLowerCase() === 'approved'
        ? 'approved'
        : request.status.toLowerCase() === 'rejected'
          ? 'rejected'
          : 'pending',
    status:
      request.status.toLowerCase() === 'approved'
        ? 'Đã duyệt'
        : request.status.toLowerCase() === 'rejected'
          ? 'Bị từ chối'
          : 'Đang chờ duyệt',
    note: request.reviewNote ?? request.note ?? 'Yêu cầu hội viên',
  }));
}
