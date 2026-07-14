import {
  createDateLabel,
  formatCurrency,
  mapCategoryMeta,
  normalizeRentalStatus,
  type RentalCatalogItem,
  type RentalHistoryItem,
  type RentalSelection,
} from '../components/memberEquipmentRental';
import { apiRequest, apiRequestNullable } from './apiClient';

interface EquipmentCatalogItemDto {
  equipmentId: string;
  code: string;
  name: string;
  category: string;
  unitLabel: string;
  maxQuantityPerOrder: number;
  availableQuantity: number;
  rentalFeeAmount: number;
  originalRentalFeeAmount?: number | null;
  discountPercent?: number | null;
  appliedBenefitLabel?: string | null;
  lostFeeAmount: number;
  surchargePolicyNote?: string | null;
}

interface MemberEquipmentRentalItemDto {
  orderItemId: string;
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  unitLabel: string;
  requestedQuantity: number;
  receivedQuantity: number;
  returnedQuantity: number;
  lostQuantity: number;
  itemStatus: string;
  unitFeeAmount: number;
  lineFeeAmount: number;
  surchargeAmount: number;
  note?: string | null;
}

interface MemberEquipmentRentalCurrentDto {
  orderId: string;
  requestCode: string;
  rentalDate: string;
  status: string;
  totalRentalFeeAmount: number;
  totalSurchargeAmount: number;
  note?: string | null;
  relatedCourtBookingId?: string | null;
  createdAtUtc: string;
  receivedAtUtc?: string | null;
  returnedAtUtc?: string | null;
  items: MemberEquipmentRentalItemDto[];
}

interface MemberEquipmentRentalHistoryItemDto {
  orderId: string;
  requestCode: string;
  rentalDate: string;
  status: string;
  totalRentalFeeAmount: number;
  totalSurchargeAmount: number;
  note?: string | null;
  createdAtUtc: string;
  items: MemberEquipmentRentalItemDto[];
}

export interface CurrentEquipmentRentalViewModel extends RentalHistoryItem {
  relatedCourtBookingId?: string | null;
}

export async function getEquipmentRentalCatalog(): Promise<RentalCatalogItem[]> {
  const catalog = await apiRequest<EquipmentCatalogItemDto[]>('/member/equipment-rentals/catalog');

  return catalog.map((item) => {
    const meta = mapCategoryMeta(item.category);
    const hasDiscount = typeof item.originalRentalFeeAmount === 'number' &&
      item.originalRentalFeeAmount > item.rentalFeeAmount;

    return {
      id: item.equipmentId,
      code: item.code,
      name: item.name,
      desc: item.surchargePolicyNote?.trim() ||
        `Thuộc nhóm ${item.category.toLowerCase()} • đơn vị ${item.unitLabel}`,
      unitLabel: item.unitLabel,
      unitPriceLabel: formatCurrency(item.rentalFeeAmount),
      unitPrice: item.rentalFeeAmount,
      originalUnitPrice: hasDiscount ? item.originalRentalFeeAmount ?? undefined : undefined,
      originalUnitPriceLabel: hasDiscount && typeof item.originalRentalFeeAmount === 'number'
        ? formatCurrency(item.originalRentalFeeAmount)
        : undefined,
      discountPercent: item.discountPercent ?? undefined,
      appliedBenefitLabel: item.appliedBenefitLabel?.trim() || undefined,
      lostFeeLabel: formatCurrency(item.lostFeeAmount),
      lostFeeAmount: item.lostFeeAmount,
      maxQuantity: item.maxQuantityPerOrder,
      availableQuantity: item.availableQuantity,
      note: item.surchargePolicyNote ?? undefined,
      icon: meta.icon,
      accent: meta.accent,
    };
  });
}

function mapHistoryItem(
  order: MemberEquipmentRentalCurrentDto | MemberEquipmentRentalHistoryItemDto,
): CurrentEquipmentRentalViewModel {
  const totalSurcharge = order.totalSurchargeAmount;
  const status = normalizeRentalStatus(order.status, totalSurcharge);

  return {
    id: order.orderId,
    requestCode: order.requestCode,
    dateISO: order.rentalDate,
    dateLabel: createDateLabel(order.rentalDate),
    status,
    totalItems: order.items.reduce((sum, item) => sum + item.requestedQuantity, 0),
    totalAmount: order.totalRentalFeeAmount,
    totalAmountLabel: formatCurrency(order.totalRentalFeeAmount),
    surchargeAmount: totalSurcharge > 0 ? totalSurcharge : undefined,
    surchargeAmountLabel: totalSurcharge > 0 ? formatCurrency(totalSurcharge) : undefined,
    note: order.note?.trim() || (
      status === 'requested'
        ? 'Yêu cầu thuê đồ đang chờ quầy sân xác nhận.'
        : status === 'received'
          ? 'Quầy sân đã giao đồ và đang chờ hội viên trả lại.'
          : status === 'lost'
            ? 'Đơn thuê đã đóng với ghi nhận mất đồ hoặc bồi hoàn.'
            : status === 'surcharge'
              ? 'Đơn thuê đã hoàn tất nhưng có phát sinh phụ phí.'
              : status === 'returned'
                ? 'Đơn thuê đã được trả lại đầy đủ.'
                : 'Đơn thuê đã bị hủy.'
    ),
    createdAtISO: order.createdAtUtc,
    relatedCourtBookingId: 'relatedCourtBookingId' in order ? order.relatedCourtBookingId : null,
    items: order.items.map((item) => ({
      itemId: item.equipmentId,
      name: item.equipmentName,
      quantity: item.requestedQuantity,
      unitLabel: item.unitLabel,
      unitPrice: item.unitFeeAmount,
      unitPriceLabel: formatCurrency(item.unitFeeAmount),
      status: normalizeRentalStatus(item.itemStatus, item.surchargeAmount),
      receivedQuantity: item.receivedQuantity,
      returnedQuantity: item.returnedQuantity,
      lostQuantity: item.lostQuantity,
      surchargeAmount: item.surchargeAmount,
      surchargeAmountLabel: item.surchargeAmount > 0 ? formatCurrency(item.surchargeAmount) : undefined,
      note: item.note ?? undefined,
    })),
  };
}

export async function getCurrentEquipmentRental() {
  const order = await apiRequestNullable<MemberEquipmentRentalCurrentDto>(
    '/member/equipment-rentals/current',
  );

  return order ? mapHistoryItem(order) : null;
}

export async function getEquipmentRentalHistory() {
  const history = await apiRequest<MemberEquipmentRentalHistoryItemDto[]>(
    '/member/equipment-rentals/history',
  );

  return history.map(mapHistoryItem);
}

export async function createEquipmentRentalOrder(
  selections: RentalSelection[],
  note?: string,
) {
  const order = await apiRequest<MemberEquipmentRentalCurrentDto>(
    '/member/equipment-rentals/',
    {
      method: 'POST',
      body: JSON.stringify({
        items: selections
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            equipmentId: item.itemId,
            quantity: item.quantity,
          })),
        note: note?.trim() || undefined,
      }),
    },
  );

  return mapHistoryItem(order);
}
