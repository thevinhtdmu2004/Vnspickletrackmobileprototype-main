import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  ChevronRight,
  Clock3,
  History,
  Minus,
  Package,
  Plus,
  TimerReset,
} from 'lucide-react';
import {
  formatCurrency,
  RENTAL_RULES,
  type RentalCatalogItem,
  type RentalHistoryItem,
  type RentalSelection,
} from './memberEquipmentRental';
import {
  getCurrentEquipmentRental,
  getEquipmentRentalCatalog,
} from '../services/memberEquipmentRentalService';

interface MemberEquipmentRentalScreenProps {
  onBack: () => void;
  onConfirm: (selections: RentalSelection[]) => Promise<void> | void;
  onViewHistory?: () => void;
}

export function MemberEquipmentRentalScreen({
  onBack,
  onConfirm,
  onViewHistory,
}: MemberEquipmentRentalScreenProps) {
  const [catalog, setCatalog] = useState<RentalCatalogItem[]>([]);
  const [currentOrder, setCurrentOrder] = useState<RentalHistoryItem | null>(null);
  const [selections, setSelections] = useState<RentalSelection[]>([]);
  const [warning, setWarning] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setIsLoading(true);
      try {
        const [catalogItems, activeOrder] = await Promise.all([
          getEquipmentRentalCatalog(),
          getCurrentEquipmentRental(),
        ]);

        if (cancelled) return;
        setCatalog(catalogItems);
        setCurrentOrder(activeOrder);
        setWarning(null);
      } catch (error) {
        if (cancelled) return;
        setWarning(
          error instanceof Error
            ? error.message
            : 'Không tải được dữ liệu thuê đồ từ hệ thống.',
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedItems = useMemo(
    () => selections
      .map((selection) => {
        const item = catalog.find((catalogItem) => catalogItem.id === selection.itemId);
        if (!item || selection.quantity <= 0) return null;
        return { ...item, quantity: selection.quantity };
      })
      .filter((item): item is RentalCatalogItem & { quantity: number } => item !== null),
    [catalog, selections],
  );

  const totalAmountLabel = useMemo(() => {
    const total = selectedItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
    return formatCurrency(total);
  }, [selectedItems]);

  const totalQuantity = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectedItems],
  );

  const hasAnyDiscount = useMemo(
    () => catalog.some((item) => typeof item.discountPercent === 'number' && item.discountPercent > 0),
    [catalog],
  );

  function getQuantity(itemId: string) {
    return selections.find((selection) => selection.itemId === itemId)?.quantity ?? 0;
  }

  function changeQuantity(itemId: string, nextQuantity: number) {
    setSelections((current) => {
      const item = catalog.find((catalogItem) => catalogItem.id === itemId);
      if (!item) return current;

      const limitByAvailability = item.availableQuantity > 0
        ? Math.min(item.maxQuantity, item.availableQuantity)
        : item.maxQuantity;
      const clamped = Math.max(0, Math.min(limitByAvailability, nextQuantity));
      const nextSelections = current.filter((selection) => selection.itemId !== itemId);
      if (clamped === 0) return nextSelections;
      return [...nextSelections, { itemId, quantity: clamped }];
    });
  }

  async function handleSubmit() {
    if (selectedItems.length === 0 || isSubmitting) return;
    if (currentOrder) {
      setWarning('Bạn đang có 1 đơn thuê đồ chưa hoàn tất. Hãy chờ quầy sân xử lý xong đơn hiện tại.');
      return;
    }

    setIsSubmitting(true);
    setWarning(null);
    try {
      await onConfirm(selections);
    } catch (error) {
      setWarning(
        error instanceof Error
          ? error.message
          : 'Không gửi được yêu cầu thuê đồ lúc này.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#F0F4F5' }}>
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 30%,#075E5D 60%,#0E7C7B 85%,#1A8E87 100%)' }}
      >
        <div
          className="absolute pointer-events-none"
          style={{ top: -26, right: -18, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
        />
        <div className="relative px-5 pt-14 pb-5">
          <div className="flex items-start justify-between gap-3 mb-5">
            <button
              onClick={onBack}
              className="w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={onViewHistory}
                className="w-11 h-11 rounded-2xl flex items-center justify-center active:scale-95 transition-transform"
                style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
              >
                <History style={{ width: 18, height: 18, color: 'white' }} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <Package style={{ width: 24, height: 24, color: 'white' }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.05em' }}>
                THUÊ ĐỒ TẠI SÂN
              </p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 3 }}>
                Chọn đồ dùng cho buổi chơi
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.68)', fontWeight: 500, marginTop: 4, lineHeight: 1.5 }}>
                Mỗi món có giới hạn số lượng riêng và lịch sử sẽ theo dõi đủ các trạng thái nhận, trả, mất đồ hoặc phụ phí.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="px-4 pt-4 space-y-4">
          <div className="rounded-3xl p-4" style={{ background: 'white', border: '1.5px solid rgba(14,124,123,0.15)', boxShadow: '0 6px 20px rgba(14,124,123,0.08)' }}>
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(14,124,123,0.10)' }}
              >
                <BadgeCheck style={{ width: 20, height: 20, color: '#0E7C7B' }} />
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 900, color: '#1F2933' }}>Quy trình thuê đồ</p>
                <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 1.5 }}>
                  Chọn món và số lượng, gửi yêu cầu, nhận xác nhận từ quầy, rồi đối soát lại khi trả đồ hoặc phát sinh phụ phí.
                </p>
              </div>
            </div>
          </div>

          {hasAnyDiscount && (
            <div className="rounded-3xl p-4" style={{ background: 'rgba(14,124,123,0.08)', border: '1.5px solid rgba(14,124,123,0.18)' }}>
              <p style={{ fontSize: 12, fontWeight: 900, color: '#0E7C7B' }}>Ưu đãi hội viên đang được áp dụng</p>
              <p style={{ fontSize: 11, color: '#45606A', marginTop: 4, lineHeight: 1.5 }}>
                Giá hiển thị dưới đây đã tự động áp dụng quyền lợi của gói hội viên hiện tại.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-3xl p-4" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>Tổng số món</p>
              <p style={{ fontSize: 20, color: '#0E7C7B', fontWeight: 900, marginTop: 6 }}>{totalQuantity}</p>
            </div>
            <div className="rounded-3xl p-4" style={{ background: 'white', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>Tạm tính</p>
              <p style={{ fontSize: 20, color: '#E8832A', fontWeight: 900, marginTop: 6 }}>{totalAmountLabel}</p>
            </div>
          </div>

          {currentOrder && (
            <div className="rounded-3xl p-4" style={{ background: 'white', border: '1.5px solid rgba(14,124,123,0.16)', boxShadow: '0 6px 20px rgba(14,124,123,0.08)' }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>ĐƠN THUÊ ĐANG MỞ</p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#1F2933', marginTop: 4 }}>{currentOrder.requestCode}</p>
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, marginTop: 4 }}>
                    {currentOrder.note}
                  </p>
                </div>
                <span className="px-2.5 py-1 rounded-xl" style={{ background: 'rgba(14,124,123,0.10)' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>
                    {currentOrder.status === 'received' ? 'Đã nhận đồ' : 'Đang chờ xác nhận'}
                  </span>
                </span>
              </div>
            </div>
          )}

          {warning && (
            <div className="rounded-3xl p-4" style={{ background: 'rgba(231,111,81,0.08)', border: '1.5px solid rgba(231,111,81,0.16)' }}>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#C85A3D' }}>{warning}</p>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>
                DANH SÁCH ĐỒ THUÊ
              </p>
              <span
                className="px-2.5 py-1 rounded-lg"
                style={{ fontSize: 10, fontWeight: 800, color: '#0E7C7B', background: 'rgba(14,124,123,0.10)' }}
              >
                {selectedItems.length} món đang chọn
              </span>
            </div>

            <div className="space-y-3">
              {catalog.map((item) => {
                const quantity = getQuantity(item.id);
                const selected = quantity > 0;
                const limitByAvailability = item.availableQuantity > 0
                  ? Math.min(item.maxQuantity, item.availableQuantity)
                  : item.maxQuantity;

                return (
                  <div
                    key={item.id}
                    className="w-full rounded-3xl p-4"
                    style={{
                      background: selected ? 'rgba(14,124,123,0.07)' : 'white',
                      border: selected ? '1.5px solid rgba(14,124,123,0.26)' : '1.5px solid rgba(0,0,0,0.06)',
                      boxShadow: selected ? '0 8px 20px rgba(14,124,123,0.08)' : '0 2px 10px rgba(0,0,0,0.04)',
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                          style={{ background: `${item.accent}14` }}
                        >
                          <item.icon style={{ width: 20, height: 20, color: item.accent }} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p style={{ fontSize: 14, fontWeight: 900, color: '#1F2933' }}>{item.name}</p>
                            {selected && (
                              <span
                                className="px-2 py-0.5 rounded-lg"
                                style={{ fontSize: 9, fontWeight: 900, color: item.accent, background: `${item.accent}14` }}
                              >
                                Đã chọn
                              </span>
                            )}
                            {item.discountPercent && (
                              <span
                                className="px-2 py-0.5 rounded-lg"
                                style={{ fontSize: 9, fontWeight: 900, color: '#0E7C7B', background: 'rgba(14,124,123,0.10)' }}
                              >
                                -{item.discountPercent}% hội viên
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 1.4 }}>{item.desc}</p>
                          {item.appliedBenefitLabel && (
                            <p style={{ fontSize: 10, color: '#0E7C7B', marginTop: 4, fontWeight: 700 }}>
                              {item.appliedBenefitLabel}
                            </p>
                          )}
                          <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 5, fontWeight: 700 }}>
                            Tối đa {item.maxQuantity} {item.unitLabel} mỗi yêu cầu • Còn {item.availableQuantity}
                          </p>
                          <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 2, fontWeight: 700 }}>
                            Phí mất đồ {item.lostFeeLabel}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p style={{ fontSize: 12, fontWeight: 900, color: item.accent }}>{item.unitPriceLabel}</p>
                        {item.originalUnitPriceLabel && (
                          <p style={{ fontSize: 10, color: '#9CA3AF', textDecoration: 'line-through', marginTop: 2 }}>
                            {item.originalUnitPriceLabel}
                          </p>
                        )}
                        <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, marginTop: 2 }}>
                          / món
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => changeQuantity(item.id, quantity - 1)}
                          className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-95"
                          style={{ background: '#F8FAFB', border: '1px solid rgba(0,0,0,0.06)' }}
                        >
                          <Minus style={{ width: 15, height: 15, color: '#6B7280' }} />
                        </button>
                        <div
                          className="min-w-[58px] rounded-2xl px-3 py-2 text-center"
                          style={{ background: 'rgba(0,0,0,0.03)' }}
                        >
                          <span style={{ fontSize: 14, fontWeight: 900, color: '#1F2933' }}>{quantity}</span>
                        </div>
                        <button
                          onClick={() => changeQuantity(item.id, quantity + 1)}
                          disabled={quantity >= limitByAvailability}
                          className="w-9 h-9 rounded-2xl flex items-center justify-center active:scale-95 disabled:opacity-50"
                          style={{ background: '#F8FAFB', border: '1px solid rgba(0,0,0,0.06)' }}
                        >
                          <Plus style={{ width: 15, height: 15, color: '#6B7280' }} />
                        </button>
                      </div>

                      <div className="text-right">
                        <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700 }}>Thành tiền</p>
                        <p style={{ fontSize: 13, fontWeight: 900, color: item.accent }}>
                          {formatCurrency(item.unitPrice * quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isLoading && (
                <div className="rounded-3xl p-5 text-center" style={{ background: 'white', border: '1.5px dashed rgba(14,124,123,0.18)' }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#0E7C7B' }}>Đang tải danh mục thuê đồ...</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl p-4" style={{ background: 'white', border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div className="flex items-center gap-2 mb-3">
              <TimerReset style={{ width: 16, height: 16, color: '#0E7C7B' }} />
              <p style={{ fontSize: 12, fontWeight: 900, color: '#1F2933' }}>Lưu ý nhanh</p>
            </div>
            <div className="space-y-2">
              {RENTAL_RULES.map((rule) => (
                <div key={rule} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5" style={{ background: '#0E7C7B' }} />
                  <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5 }}>{rule}</p>
                </div>
              ))}
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
            onClick={() => void handleSubmit()}
            disabled={selectedItems.length === 0 || isSubmitting || isLoading || Boolean(currentOrder)}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.99] transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow: '0 10px 24px rgba(14,124,123,0.24)',
            }}
          >
            <Clock3 style={{ width: 18, height: 18, color: 'white' }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>
              {currentOrder ? 'Đang có đơn thuê active' : isSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu thuê đồ'}
            </span>
            <ChevronRight style={{ width: 16, height: 16, color: 'white' }} />
          </button>
        </div>
      </div>
    </div>
  );
}
