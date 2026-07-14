import {
  ArrowLeft, Plus, Edit2, Calendar, DollarSign, Layers,
  CheckCircle2, XCircle, Info
} from 'lucide-react';

interface PackageManagementScreenProps {
  onBack: () => void;
  onAddPackage: () => void;
  onEditPackage: (id: number) => void;
}

interface Package {
  id: number;
  name: string;
  sessions: number;
  price: number;
  validityDays: number;
  status: 'active' | 'inactive';
}

const PACKAGES: Package[] = [
  {
    id: 1,
    name: 'Gói 8 buổi',
    sessions: 8,
    price: 1600000,
    validityDays: 60,
    status: 'active',
  },
  {
    id: 2,
    name: 'Gói 12 buổi',
    sessions: 12,
    price: 2400000,
    validityDays: 90,
    status: 'active',
  },
  {
    id: 3,
    name: 'Gói 16 buổi',
    sessions: 16,
    price: 3000000,
    validityDays: 120,
    status: 'active',
  },
  {
    id: 4,
    name: 'Gói cũ 10 buổi',
    sessions: 10,
    price: 2000000,
    validityDays: 75,
    status: 'inactive',
  },
];

export function PackageManagementScreen({ 
  onBack, 
  onAddPackage, 
  onEditPackage 
}: PackageManagementScreenProps) {
  
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  const activePackages = PACKAGES.filter(p => p.status === 'active');
  const inactivePackages = PACKAGES.filter(p => p.status === 'inactive');

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">
      {/* ══ Header ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-14 -right-3 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />

        <div className="flex items-center gap-3 px-4 pt-10 pb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              Gói học
            </h1>
            <p className="text-white/60" style={{ fontSize: '11px' }}>
              {activePackages.length} gói đang dùng
            </p>
          </div>
          <button
            onClick={onAddPackage}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6">
        
        {/* Info banner */}
        <div
          className="rounded-xl p-3.5 flex items-start gap-2.5 mb-4"
          style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}
        >
          <Info className="w-4 h-4 text-[#0E7C7B] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700" style={{ lineHeight: 1.6 }}>
            Gói học <span className="font-bold">đang dùng</span> sẽ hiển thị khi gia hạn cho học viên. Gói <span className="font-bold">ngưng dùng</span> sẽ bị ẩn.
          </p>
        </div>

        {/* Active Packages */}
        {activePackages.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
              Gói đang dùng ({activePackages.length})
            </p>
            <div className="space-y-3">
              {activePackages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onEdit={() => onEditPackage(pkg.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Inactive Packages */}
        {inactivePackages.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
              Gói ngưng dùng ({inactivePackages.length})
            </p>
            <div className="space-y-3">
              {inactivePackages.map(pkg => (
                <PackageCard
                  key={pkg.id}
                  package={pkg}
                  onEdit={() => onEditPackage(pkg.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Package Card Component ── */
interface PackageCardProps {
  package: Package;
  onEdit: () => void;
}

function PackageCard({ package: pkg, onEdit }: PackageCardProps) {
  const isActive = pkg.status === 'active';
  
  function formatPrice(price: number): string {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  }

  return (
    <div
      className="bg-white rounded-2xl border shadow-sm overflow-hidden transition-all"
      style={{
        borderColor: isActive ? '#E5E7EB' : '#F3F4F6',
        opacity: isActive ? 1 : 0.7,
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {pkg.name}
            </h3>
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
              style={{
                background: isActive ? 'rgba(42,157,143,0.1)' : 'rgba(156,163,175,0.15)',
              }}
            >
              {isActive ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#2A9D8F]" />
                  <span className="text-xs font-bold text-[#2A9D8F]">Đang dùng</span>
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5 text-gray-500" />
                  <span className="text-xs font-bold text-gray-500">Ngưng dùng</span>
                </>
              )}
            </div>
          </div>

          <button
            onClick={onEdit}
            className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200
              flex items-center justify-center transition-colors flex-shrink-0"
          >
            <Edit2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Price - Large display */}
        <div className="mb-3">
          <div className="flex items-baseline gap-1">
            <span
              className="font-bold"
              style={{
                fontSize: '28px',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #0E7C7B, #2A9D8F)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {formatPrice(pkg.price)}
            </span>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Sessions */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(14,124,123,0.12)' }}
            >
              <Layers className="w-4 h-4 text-[#0E7C7B]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Số buổi</p>
              <p className="text-sm font-bold text-gray-900">{pkg.sessions}</p>
            </div>
          </div>

          {/* Validity */}
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(244,162,97,0.12)' }}
            >
              <Calendar className="w-4 h-4 text-[#F4A261]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500">Hiệu lực</p>
              <p className="text-sm font-bold text-gray-900">{pkg.validityDays} ngày</p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit button footer */}
      <div
        className="px-4 py-2.5 border-t flex items-center justify-center gap-2"
        style={{ background: 'rgba(249,250,251,0.8)', borderColor: '#F3F4F6' }}
      >
        <button
          onClick={onEdit}
          className="text-sm font-semibold text-[#0E7C7B] hover:text-[#075E5D] active:scale-95 transition-all
            flex items-center gap-1.5"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Chỉnh sửa
        </button>
      </div>
    </div>
  );
}
