/*
 * AccessDeniedScreen.tsx — VNS PickleTrack
 * Màn hình từ chối truy cập · Mobile 390 × 844
 */
import { ShieldOff, ArrowLeft, Lock } from 'lucide-react';

interface AccessDeniedScreenProps {
  onBack?:    () => void;
  /** Tên role hiện tại để hiển thị trong message */
  roleName?:  string;
  /** Tên tính năng bị chặn (tuỳ chọn) */
  featureName?: string;
}

export function AccessDeniedScreen({ onBack, roleName, featureName }: AccessDeniedScreenProps) {
  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ── Top bar ── */}
      <div
        className="flex items-center gap-3 px-4 pt-10 pb-4"
        style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-95 transition-transform"
          style={{ background: 'rgba(0,0,0,0.05)' }}
        >
          <ArrowLeft style={{ width: 18, height: 18, color: '#1F2933' }} />
        </button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#1F2933' }}>Quyền truy cập</span>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-16">

        {/* Illustration */}
        <div className="relative mb-8">
          {/* outer ring */}
          <div
            className="w-32 h-32 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(231,111,81,0.08)', border: '2px dashed rgba(231,111,81,0.25)' }}
          >
            {/* inner circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(231,111,81,0.12)' }}
            >
              <ShieldOff style={{ width: 36, height: 36, color: '#E76F51' }} />
            </div>
          </div>
          {/* Lock badge */}
          <div
            className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full flex items-center justify-center border-2 border-white"
            style={{ background: 'rgba(231,111,81,0.18)' }}
          >
            <Lock style={{ width: 15, height: 15, color: '#E76F51' }} />
          </div>
        </div>

        {/* Text */}
        <h1
          className="text-center mb-3"
          style={{ fontSize: 22, fontWeight: 900, color: '#1F2933', lineHeight: 1.25 }}
        >
          Không có quyền truy cập
        </h1>

        <p
          className="text-center mb-2"
          style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.65, maxWidth: 280 }}
        >
          Bạn không có quyền xem chức năng này
          {featureName ? <><br /><span style={{ fontWeight: 600, color: '#E76F51' }}>"{featureName}"</span></> : ''}.
        </p>

        {roleName && (
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full mt-1 mb-6"
            style={{ background: 'rgba(231,111,81,0.10)', border: '1px solid rgba(231,111,81,0.22)' }}
          >
            <ShieldOff style={{ width: 13, height: 13, color: '#E76F51' }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: '#E76F51' }}>
              Vai trò hiện tại: {roleName}
            </span>
          </div>
        )}

        {!roleName && <div className="mb-6" />}

        {/* Hint card */}
        <div
          className="w-full rounded-2xl p-4 mb-8"
          style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}
        >
          <p className="text-center" style={{ fontSize: 13, color: '#0E7C7B', lineHeight: 1.6 }}>
            Liên hệ <span style={{ fontWeight: 700 }}>Admin</span> nếu bạn cần quyền truy cập tính năng này.
          </p>
        </div>

        {/* Button */}
        <button
          onClick={onBack}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-white active:scale-[0.98] transition-transform"
          style={{
            background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
            boxShadow: '0 4px 16px rgba(14,124,123,0.30)',
            fontSize: 15,
            fontWeight: 700,
          }}
        >
          <ArrowLeft style={{ width: 18, height: 18 }} />
          Quay lại
        </button>
      </div>
    </div>
  );
}
