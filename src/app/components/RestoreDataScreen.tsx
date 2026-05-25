import {
  ArrowLeft, Database, RefreshCw, AlertTriangle, Info,
  FileText, Lock, Zap
} from 'lucide-react';

interface RestoreDataScreenProps {
  onBack: () => void;
}

export function RestoreDataScreen({ onBack }: RestoreDataScreenProps) {
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
              Khôi phục dữ liệu
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <Zap className="w-3 h-3 text-white/70" />
            <span className="text-white/70" style={{ fontSize: '10px', fontWeight: 600 }}>Beta</span>
          </div>
        </div>
      </div>

      {/* ══ Body ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col items-center justify-center">
        
        {/* Coming Soon Icon */}
        <div className="mb-6">
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(129,90,213,0.08) 0%, rgba(129,90,213,0.12) 100%)',
              border: '8px solid rgba(129,90,213,0.12)',
            }}
          >
            {/* Rotating ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, transparent 0%, rgba(129,90,213,0.25) 50%, transparent 100%)',
                animation: 'rotate-slow 4s linear infinite',
              }}
            />
            
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(129,90,213,0.15)' }}
            >
              <div className="relative">
                <Database className="w-10 h-10 text-[#815AD5]" />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-white flex items-center justify-center"
                  style={{ border: '2px solid #815AD5' }}
                >
                  <RefreshCw className="w-3 h-3 text-[#815AD5]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Chức năng sắp có
          </h2>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#815AD5]/10 mb-4">
            <span className="text-xs font-bold text-[#815AD5]">Đang phát triển</span>
          </div>
        </div>

        {/* Message */}
        <p className="text-center text-gray-600 mb-8 px-4" style={{ fontSize: '14px', lineHeight: 1.6 }}>
          Khôi phục dữ liệu từ file backup sẽ được hỗ trợ trong phiên bản tiếp theo.
        </p>

        {/* Warning Cards */}
        <div className="w-full space-y-3 mb-6">
          {/* Warning 1 */}
          <div
            className="rounded-2xl border p-4 flex items-start gap-3"
            style={{ background: 'rgba(231,111,81,0.06)', borderColor: 'rgba(231,111,81,0.25)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(231,111,81,0.15)' }}
            >
              <AlertTriangle className="w-5 h-5 text-[#E76F51]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#C35A3D] mb-1">
                Lưu ý quan trọng
              </p>
              <p className="text-xs text-gray-700" style={{ lineHeight: 1.6 }}>
                Việc khôi phục sẽ <span className="font-bold">ghi đè toàn bộ dữ liệu hiện tại</span> trong ứng dụng.
              </p>
            </div>
          </div>

          {/* Warning 2 */}
          <div
            className="rounded-2xl border p-4 flex items-start gap-3"
            style={{ background: 'rgba(14,124,123,0.06)', borderColor: 'rgba(14,124,123,0.2)' }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(14,124,123,0.12)' }}
            >
              <Info className="w-5 h-5 text-[#0E7C7B]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#0E7C7B] mb-1">
                Khuyến nghị
              </p>
              <p className="text-xs text-gray-700" style={{ lineHeight: 1.6 }}>
                Trước khi khôi phục, bạn cần <span className="font-bold">sao lưu dữ liệu hiện tại</span> để đảm bảo an toàn.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Preview */}
        <div className="w-full bg-white rounded-2xl border border-gray-200 p-4 mb-8">
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              Tính năng sắp có
            </span>
          </div>

          <div className="space-y-2.5">
            {[
              'Chọn file backup từ thiết bị',
              'Xác thực file backup hợp lệ',
              'Xem trước dữ liệu sẽ khôi phục',
              'Khôi phục an toàn với xác nhận',
            ].map((feature, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Lock className="w-3 h-3 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Disabled Button */}
        <button
          disabled
          className="w-full h-12 rounded-xl bg-gray-100 border border-gray-200
            text-gray-400 font-semibold cursor-not-allowed
            flex items-center justify-center gap-2 mb-3 relative"
        >
          <Database className="w-4 h-4" />
          Chọn file backup
          <span
            className="absolute -top-2 -right-2 px-2 py-1 rounded-lg text-xs font-bold bg-[#815AD5] text-white shadow-sm"
          >
            Sắp có
          </span>
        </button>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] 
            text-white font-semibold shadow-lg shadow-[#0E7C7B]/25
            hover:shadow-xl hover:shadow-[#0E7C7B]/30 active:scale-[0.98] transition-all
            flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Cài đặt
        </button>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes rotate-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
