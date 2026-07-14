import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, X, CheckCircle2, Clock, History, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  priceStr: string;
  image: string;
  category: string;
  isRental?: boolean;
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
            isOrdered ? (
              <div className="flex flex-col items-center justify-center py-6 text-center space-y-3.5">
                <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 border border-amber-100">
                  <Clock size={26} />
                </div>
                <h4 className="font-black text-amber-900 text-sm">Đơn hàng chờ nhận đồ!</h4>
                
                {/* Order Details */}
                <div className="bg-slate-50 rounded-2xl p-4 w-full border border-slate-100 space-y-2 text-left">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Mã đơn hàng:</span>
                    <span className="text-teal-700 font-black">{purchaseHistory && purchaseHistory[0] ? purchaseHistory[0].id : 'ORD-982'}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 font-medium">Trạng thái:</span>
                    <span className="text-amber-600 font-extrabold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">Chưa lấy đồ</span>
                  </div>
                </div>

                <p className="text-[11px] text-gray-500 max-w-[280px] leading-relaxed">
                  Đơn hàng đã được ghi nhận trên hệ thống. Quý khách vui lòng tới quầy nhận đồ. Nhân viên/chủ sân sẽ giao đồ và xác nhận trạng thái đơn hàng của bạn thành <strong className="text-teal-700">"Đã lấy đồ"</strong>.
                </p>
                <button
                  onClick={onResetOrder}
                  className="bg-teal-750 text-white text-xs font-bold px-4 py-2.5 rounded-xl active:scale-95 transition-all"
                >
                  Mua / Thuê tiếp
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
                {/* Categorize cart items */}
                {(() => {
                  const purchaseItems = cartItems.filter(item => !item.product.isRental);
                  const rentalItems = cartItems.filter(item => item.product.isRental);

                  return (
                    <>
                      {/* PURCHASE SECTION */}
                      {purchaseItems.length > 0 && (
                        <div className="space-y-2">
                          <h5 className="text-[11px] font-black text-teal-800 tracking-wider">🛒 SẢN PHẨM MUA</h5>
                          <div className="space-y-3 bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                            {purchaseItems.map(item => (
                              <div key={item.product.id} className="flex items-center justify-between border-b border-gray-150/50 pb-2.5 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{item.product.image}</span>
                                  <div>
                                    <p className="text-[11px] font-bold text-gray-800 leading-tight">{item.product.name}</p>
                                    <p className="text-[10px] font-semibold text-teal-600 mt-0.5">{item.product.priceStr}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                    className="w-5 h-5 bg-white border rounded-full flex items-center justify-center active:bg-gray-150"
                                  >
                                    <Minus className="w-2.5 h-2.5 text-gray-600" />
                                  </button>
                                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    className="w-5 h-5 bg-white border rounded-full flex items-center justify-center active:bg-gray-150"
                                  >
                                    <Plus className="w-2.5 h-2.5 text-gray-600" />
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
                          </div>
                        </div>
                      )}

                      {/* RENTAL SECTION */}
                      {rentalItems.length > 0 && (
                        <div className="space-y-2 mt-3">
                          <div className="flex justify-between items-center">
                            <h5 className="text-[11px] font-black text-orange-800 tracking-wider">🏓 ĐỒ THUÊ TẠI SÂN</h5>
                            <span className="text-[8px] font-extrabold bg-orange-50 border border-orange-200 text-orange-700 px-1.5 py-0.5 rounded-md">
                              Hết hạn khi trả sân
                            </span>
                          </div>
                          <div className="space-y-3 bg-orange-50/20 p-3 rounded-2xl border border-orange-100/50">
                            {rentalItems.map(item => (
                              <div key={item.product.id} className="flex items-center justify-between border-b border-orange-100/30 pb-2.5 last:border-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{item.product.image}</span>
                                  <div>
                                    <p className="text-[11px] font-bold text-gray-800 leading-tight">{item.product.name}</p>
                                    <p className="text-[10px] font-semibold text-orange-700 mt-0.5">{item.product.priceStr}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                    className="w-5 h-5 bg-white border border-orange-200/55 rounded-full flex items-center justify-center active:bg-orange-100"
                                  >
                                    <Minus className="w-2.5 h-2.5 text-gray-600" />
                                  </button>
                                  <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    className="w-5 h-5 bg-white border border-orange-200/55 rounded-full flex items-center justify-center active:bg-orange-100"
                                  >
                                    <Plus className="w-2.5 h-2.5 text-gray-600" />
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
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}

                <div className="border-t border-gray-155 pt-3 flex justify-between items-center">
                  <span className="text-xs font-bold text-gray-500">Tổng thanh toán:</span>
                  <span className="text-base font-black text-red-500">{totalAmount.toLocaleString('vi-VN')}đ</span>
                </div>

                <button
                  onClick={onCheckout}
                  className="w-full bg-teal-700 active:bg-teal-800 text-white py-3.5 rounded-2xl font-bold text-xs shadow-md active:scale-95 transition-transform"
                >
                  Xác nhận
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
