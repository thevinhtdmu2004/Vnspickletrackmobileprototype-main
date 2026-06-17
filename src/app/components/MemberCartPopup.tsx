import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, CheckCircle2, Clock, History, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  priceStr: string;
  image: string;
  category: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface PurchaseRecord {
  id: string;
  date: string;
  items: string;
  amount: string;
  status: string;
}

interface MemberCartPopupProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: number, change: number) => void;
  onRemove: (productId: number) => void;
  onCheckout: () => void;
  isOrdered: boolean;
  onResetOrder: () => void;
  purchaseHistory?: PurchaseRecord[];
}

const DEFAULT_PURCHASE_HISTORY: PurchaseRecord[] = [
  { id: 'INV-902', date: '15/06/2026', items: '2 Nước Aquafina, 1 Bóng Franklin', amount: '75.000đ', status: 'Đã nhận hàng' },
  { id: 'INV-765', date: '10/06/2026', items: '1 Nước điện giải Revive', amount: '20.000đ', status: 'Đã nhận hàng' }
];

export function MemberCartPopup({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemove,
  onCheckout,
  isOrdered,
  onResetOrder,
  purchaseHistory
}: MemberCartPopupProps) {
  const [activeTab, setActiveTab] = useState<'cart' | 'history'>('cart');

  if (!isOpen) return null;

  const totalAmount = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300"
        style={{
          background: 'white',
          boxShadow: '0 -12px 48px rgba(0,0,0,0.18)',
          maxHeight: '82vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.12)' }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-teal-700" />
            <h3 className="font-black text-[#1F2933] text-base">Chi tiết giỏ hàng</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-150 flex items-center justify-center active:scale-90 transition-transform">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Sub-tabs inside cart popup */}
        <div className="flex px-5 py-2 border-b border-gray-50">
          <button
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all ${
              activeTab === 'cart' ? 'border-teal-700 text-teal-700' : 'border-transparent text-gray-400'
            }`}
          >
            Sản phẩm đã chọn ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-center text-xs font-bold border-b-2 transition-all ${
              activeTab === 'history' ? 'border-teal-700 text-teal-700' : 'border-transparent text-gray-400'
            }`}
          >
            Lịch sử mua hàng
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-5 overflow-y-auto max-h-[50vh] min-h-[30vh]">
          {activeTab === 'cart' ? (
            /* ========================================================
               TAB: CURRENT CART ITEMS
               ======================================================== */
            isOrdered ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 border border-teal-100">
                  <CheckCircle2 size={26} />
                </div>
                <h4 className="font-black text-teal-900 text-sm">Đặt hàng thành công!</h4>
                <p className="text-[11px] text-gray-500 max-w-[260px] leading-relaxed">
                  Đơn hàng của bạn đã được ghi nhận. Vui lòng nhận nước/bóng và thanh toán tại quầy lễ tân sân Pickleball.
                </p>
                <button
                  onClick={onResetOrder}
                  className="bg-teal-750 text-white text-xs font-bold px-4 py-2 rounded-xl active:scale-95"
                >
                  Mua tiếp
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400">
                <ShoppingBag size={36} className="text-gray-300 mb-2" />
                <p className="text-xs font-semibold">Giỏ hàng của bạn đang trống.</p>
                <p className="text-[10px] text-gray-400 mt-1">Vui lòng chọn sản phẩm ở cửa hàng phía dưới.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.product.image}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-800 leading-tight">{item.product.name}</p>
                        <p className="text-[10px] font-semibold text-teal-600 mt-0.5">{item.product.priceStr}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, -1)}
                        className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, 1)}
                        className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center active:bg-gray-200"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onRemove(item.product.id)}
                        className="w-5 h-5 bg-red-50 text-red-500 rounded-full flex items-center justify-center ml-1 active:bg-red-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Tổng thanh toán:</span>
                  <span className="text-base font-black text-red-500">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-teal-700 active:bg-teal-800 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md active:scale-95 transition-transform"
                >
                  Xác nhận Thanh toán tại Sân
                </button>
              </div>
            )
          ) : (
            /* ========================================================
               TAB: PURCHASE HISTORY
               ======================================================== */
            <div className="space-y-3">
              {(purchaseHistory || DEFAULT_PURCHASE_HISTORY).map(hist => (
                <div key={hist.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <div>
                    <h5 className="text-xs font-bold text-gray-800 leading-tight">{hist.items}</h5>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock size={10} />
                      Ngày mua: {hist.date} • Mã: {hist.id}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-teal-800">{hist.amount}</p>
                    <span className="text-[9px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                      {hist.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
