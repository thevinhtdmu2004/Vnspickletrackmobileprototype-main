import { CheckCircle2, Share2, ArrowLeft, FileText, Calendar, HardDrive, Info } from 'lucide-react';

interface BackupSuccessScreenProps {
  onShare: () => void;
  onBack: () => void;
}

export function BackupSuccessScreen({ onShare, onBack }: BackupSuccessScreenProps) {
  // Mock data - would come from props in real app
  const backupFile = {
    filename: 'pickletrack_backup_20260429_183000.db3',
    date: '29/04/2026',
    time: '18:30',
    size: '2.4 MB',
  };

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">
      {/* Content centered */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Success Icon */}
        <div className="mb-6">
          <div
            className="relative w-28 h-28 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(42,157,143,0.1) 0%, rgba(14,124,123,0.15) 100%)',
              border: '8px solid rgba(42,157,143,0.15)',
            }}
          >
            {/* Pulse animation ring */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(42,157,143,0.2)',
                animation: 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
            
            <div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(42,157,143,0.2)' }}
            >
              <CheckCircle2 className="w-12 h-12 text-[#2A9D8F]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Sao lưu thành công
        </h1>

        {/* Message */}
        <p className="text-center text-gray-600 mb-8" style={{ fontSize: '14px', lineHeight: 1.5 }}>
          Dữ liệu đã được sao lưu thành file backup.
        </p>

        {/* File Card */}
        <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-[#0E7C7B]" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              File backup
            </span>
            <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2A9D8F]/10">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-pulse" />
              <span className="text-xs font-bold text-[#2A9D8F]">Mới</span>
            </div>
          </div>

          {/* Filename */}
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1">Tên file</p>
            <p
              className="text-gray-900 break-all"
              style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, lineHeight: 1.5 }}
            >
              {backupFile.filename}
            </p>
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Date & Time */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <Calendar className="w-4 h-4 text-[#815AD5]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Thời gian</p>
                <p className="text-sm font-bold text-gray-900">{backupFile.date}</p>
                <p className="text-xs text-gray-600">{backupFile.time}</p>
              </div>
            </div>

            {/* Size */}
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-gray-50">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                <HardDrive className="w-4 h-4 text-[#F4A261]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-0.5">Dung lượng</p>
                <p className="text-sm font-bold text-gray-900">{backupFile.size}</p>
                <p className="text-xs text-gray-600">SQLite DB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info tip */}
        <div
          className="w-full rounded-xl p-3 flex items-start gap-2.5 mb-8"
          style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}
        >
          <Info className="w-4 h-4 text-[#0E7C7B] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700" style={{ lineHeight: 1.5 }}>
            <span className="font-bold text-[#0E7C7B]">Khuyến nghị:</span> Chia sẻ file backup đến email hoặc cloud storage để bảo vệ dữ liệu khỏi mất mát.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3">
          {/* Primary: Share */}
          <button
            onClick={onShare}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] 
              text-white font-semibold shadow-lg shadow-[#0E7C7B]/25
              hover:shadow-xl hover:shadow-[#0E7C7B]/30 active:scale-[0.98] transition-all
              flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            Chia sẻ file backup
          </button>

          {/* Secondary: Back to Settings */}
          <button
            onClick={onBack}
            className="w-full h-12 rounded-xl bg-white border border-gray-200
              text-gray-700 font-semibold
              hover:bg-gray-50 active:scale-[0.98] transition-all
              flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Cài đặt
          </button>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
