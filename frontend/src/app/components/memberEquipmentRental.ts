import { BookOpen, Package, Shirt, Sparkles, type LucideIcon } from 'lucide-react';

export type RentalStatus =
  | 'requested'
  | 'received'
  | 'returned'
  | 'lost'
  | 'surcharge'
  | 'cancelled';

export type RentalCatalogItem = {
  id: string;
  code: string;
  name: string;
  desc: string;
  unitLabel: string;
  unitPriceLabel: string;
  unitPrice: number;
  originalUnitPrice?: number;
  originalUnitPriceLabel?: string;
  discountPercent?: number;
  appliedBenefitLabel?: string;
  lostFeeLabel: string;
  lostFeeAmount: number;
  maxQuantity: number;
  availableQuantity: number;
  note?: string;
  icon: LucideIcon;
  accent: string;
};

export type RentalSelection = {
  itemId: string;
  quantity: number;
};

export type RentalHistoryItem = {
  id: string;
  requestCode: string;
  dateISO: string;
  dateLabel: string;
  status: RentalStatus;
  totalItems: number;
  totalAmount: number;
  totalAmountLabel: string;
  surchargeAmount?: number;
  surchargeAmountLabel?: string;
  note: string;
  createdAtISO: string;
  items: Array<{
    itemId: string;
    name: string;
    quantity: number;
    unitLabel: string;
    unitPrice: number;
    unitPriceLabel: string;
    status: RentalStatus;
    receivedQuantity: number;
    returnedQuantity: number;
    lostQuantity: number;
    surchargeAmount: number;
    surchargeAmountLabel?: string;
    note?: string;
  }>;
};

const CATEGORY_META: Record<string, { icon: LucideIcon; accent: string }> = {
  Paddle: { icon: BookOpen, accent: '#0E7C7B' },
  Ball: { icon: Package, accent: '#2A9D8F' },
  Accessory: { icon: Shirt, accent: '#E8832A' },
  Other: { icon: Sparkles, accent: '#815AD5' },
};

export const RENTAL_RULES = [
  'Hội viên chỉ gửi yêu cầu thuê, quầy sân sẽ xác nhận khi giao đồ thực tế.',
  'Mỗi món có giới hạn số lượng riêng để tránh giữ đồ quá mức trong giờ cao điểm.',
  'Lịch sử sẽ theo dõi rõ các trạng thái: đã nhận, đã trả, mất đồ hoặc phát sinh phụ phí.',
  'Nếu có mất đồ hoặc trả trễ, phụ phí sẽ được tách riêng để dễ đối soát sau này.',
];

export function formatCurrency(amount: number) {
  return `${amount.toLocaleString('vi-VN')}đ`;
}

export function mapCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META.Other;
}

export function createDateLabel(dateISO: string) {
  const date = new Date(`${dateISO}T00:00:00`);
  return `${['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'][date.getDay()]}, ${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

export function normalizeRentalStatus(
  status: string,
  surchargeAmount: number,
): RentalStatus {
  const normalized = status.toLowerCase();
  if (surchargeAmount > 0 && normalized === 'returned') return 'surcharge';
  if (normalized === 'requested') return 'requested';
  if (normalized === 'received') return 'received';
  if (normalized === 'returned') return 'returned';
  if (normalized === 'lostclosed' || normalized === 'lost') return 'lost';
  return 'cancelled';
}
