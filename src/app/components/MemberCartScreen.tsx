/**
 * MemberCartScreen — VNS PickleTrack
 * Mua hàng tại sân · Hội viên / Học viên
 * Android 390 × 844
 */
import React from 'react';
import { ShoppingCart, ShoppingBag } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  priceStr: string;
  image: string;
  category: string;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Nước suối Aquafina 500ml', price: 15000, priceStr: '15.000đ', image: '💧', category: 'Đồ uống' },
  { id: 2, name: 'Nước điện giải Revive 500ml', price: 20000, priceStr: '20.000đ', image: '⚡', category: 'Đồ uống' },
  { id: 3, name: 'Bóng Pickleball Franklin X-40 (Quả lẻ)', price: 45000, priceStr: '45.000đ', image: '🥎', category: 'Dụng cụ' },
  { id: 4, name: 'Vợt Pickleball Carbon T700', price: 850000, priceStr: '850.000đ', image: '🏓', category: 'Dụng cụ' },
  { id: 5, name: 'Dịch vụ Thuê Vợt (1 buổi)', price: 30000, priceStr: '30.000đ', image: '🤝', category: 'Dịch vụ' },
  { id: 6, name: 'Áo thun thể thao VNS Pickleball', price: 150000, priceStr: '150.000đ', image: '👕', category: 'Thời trang' },
];

interface MemberCartScreenProps {
  onAddToCart?: (product: Product) => void;
  onOpenCart?: () => void;
  cartItemsCount?: number;
}

export function MemberCartScreen({
  onAddToCart = () => {},
  onOpenCart = () => {},
  cartItemsCount = 0
}: MemberCartScreenProps) {
  return (
    <div className="flex flex-col h-screen" style={{ background: '#F0F4F5' }}>
      {/* Header */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#032C2C 0%,#0E7C7B 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: -20, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="flex items-center justify-between px-4 pt-12 pb-5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-white w-6 h-6" />
            <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.3px' }}>Cửa hàng & Căn tin</h1>
          </div>
          <button
            onClick={onOpenCart}
            className="relative flex items-center justify-center rounded-2xl active:scale-90 transition-transform"
            style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.14)', border: '1.5px solid rgba(255,255,255,0.22)' }}
          >
            <ShoppingCart className="text-white w-5 h-5" />
            {cartItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-red-500 text-white rounded-full text-[9px] font-bold w-4 h-4 flex items-center justify-center animate-pulse">
                {cartItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main product list */}
      <div className="flex-1 overflow-y-auto pb-28 px-4 pt-4">
        <h2 className="text-sm font-extrabold text-teal-900 mb-3 flex items-center gap-1.5">
          <span>🥤</span> Sản phẩm bán lẻ tại quầy
        </h2>
        <div className="grid grid-cols-2 gap-3">
          {PRODUCTS.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm flex flex-col justify-between" style={{ border: '1.5px solid rgba(0,0,0,0.04)' }}>
              <div className="relative">
                <div className="w-full h-20 bg-teal-50/50 rounded-xl flex items-center justify-center text-4xl mb-2">
                  {product.image}
                </div>
                <span className="absolute top-1 left-1 bg-teal-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md">
                  {product.category}
                </span>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-gray-800 leading-tight min-h-[32px] line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                  <span className="text-xs font-extrabold text-teal-750">{product.priceStr}</span>
                  <button
                    onClick={() => onAddToCart(product)}
                    className="text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-lg active:scale-90 transition-transform"
                    style={{
                      background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
                      boxShadow: '0 4px 12px rgba(14,124,123,0.35)'
                    }}
                  >
                    Thêm +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
