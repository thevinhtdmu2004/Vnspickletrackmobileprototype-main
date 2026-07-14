import {
  ArrowLeft, CloudUpload, Share2, Shield, Clock,
  CheckCircle2, AlertTriangle, Database, Users,
  CreditCard, CalendarDays, ClipboardList,
  HardDrive, ChevronRight, RefreshCw, FileText,
  Info, Lock, History, AlertCircle
} from 'lucide-react';
import { useState } from 'react';

interface BackupScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

type BackupState = 'idle' | 'backing-up' | 'success' | 'error';

interface BackupRecord {
  id: number;
  filename: string;
  date: string;
  time: string;
  size: string;
  status: 'ok' | 'warn';
}

const BACKUP_HISTORY: BackupRecord[] = [
  { id: 1, filename: 'pickletrack_backup_20260422_183000.db3', date: '22/04/2026', time: '18:30', size: '2.4 MB', status: 'ok'  },
  { id: 2, filename: 'pickletrack_backup_20260415_090000.db3', date: '15/04/2026', time: '09:00', size: '2.1 MB', status: 'ok'  },
  { id: 3, filename: 'pickletrack_backup_20260408_143500.db3', date: '08/04/2026', time: '14:35', size: '1.9 MB', status: 'ok' },
];

const STEPS = [
  'Kiểm tra dữ liệu...',
  'Nén học viên & lớp học...',
  'Mã hoá giao dịch...',
  'Tạo file .db3...',
  'Hoàn tất!',
];

export function BackupScreen({ onBack, onNavigate }: BackupScreenProps) {
  const [backupState, setBackupState] = useState<BackupState>('idle');
  const [stepIdx,     setStepIdx]     = useState(0);
  const [progress,    setProgress]    = useState(0);
  const [history,     setHistory]     = useState<BackupRecord[]>(BACKUP_HISTORY);
  const [shareToast,  setShareToast]  = useState(false);

  // Calculate days since last backup
  const latestBackup = history[0];
  const daysSinceBackup = 7; // Mock: 7 ngày chưa backup

  /* ── start backup ── */
  function startBackup() {
    if (backupState === 'backing-up') return;
    setBackupState('backing-up');
    setStepIdx(0);
    setProgress(0);

    let step = 0;
    const totalSteps = STEPS.length;

    const tick = setInterval(() => {
      step++;
      setStepIdx(step);
      setProgress(Math.round((step / totalSteps) * 100));

      if (step >= totalSteps) {
        clearInterval(tick);
        setTimeout(() => {
          // Navigate to success screen instead of showing inline success
          if (onNavigate) {
            onNavigate('backup-success');
          }
        }, 400);
      }
    }, 520);
  }

  function handleShare() {
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  }

  function handleViewHistory() {
    console.log('View backup history');
  }

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">

      {/* ── Share toast ── */}
      {shareToast && (
        <div
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-lg"
          style={{ background: 'rgba(14,124,123,0.1)', borderColor: 'rgba(14,124,123,0.3)', color: '#0E7C7B', width: 300 }}
        >
          <Share2 className="w-4 h-4 flex-shrink-0" />
          <span style={{ fontSize: '13px', fontWeight: 600 }}>Đã sao chép tên file vào clipboard</span>
        </div>
      )}

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
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Sao lưu dữ liệu</h1>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <Lock className="w-3 h-3 text-white/70" />
            <span className="text-white/70" style={{ fontSize: '10px', fontWeight: 600 }}>Mã hoá</span>
          </div>
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6">

        {/* ── Status Card ── */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">LẦN SAO LƯU GẦN NHẤT</p>
              <h2 className="text-lg font-bold text-gray-900">
                {latestBackup.date} {latestBackup.time}
              </h2>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E7C7B]/10 to-[#0E7C7B]/20 flex items-center justify-center">
              <Database className="w-6 h-6 text-[#0E7C7B]" />
            </div>
          </div>

          {/* Status badges */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#E9C46A]/10 border border-[#E9C46A]/30">
              <AlertCircle className="w-4 h-4 text-[#A07B10]" />
              <span className="text-sm font-bold text-[#A07B10]">Cần sao lưu</span>
            </div>
          </div>

          {/* Days counter */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">
              <span className="font-bold text-[#E76F51]">{daysSinceBackup} ngày</span> chưa sao lưu
            </span>
          </div>
        </div>

        {/* ── Warning Card ── */}
        <div
          className="rounded-2xl border p-4 flex items-start gap-3 mb-4"
          style={{ background: 'rgba(233,196,106,0.08)', borderColor: 'rgba(233,196,106,0.35)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(233,196,106,0.2)' }}
          >
            <Shield className="w-5 h-5" style={{ color: '#A07B10' }} />
          </div>
          <div className="flex-1">
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#A07B10', marginBottom: 6 }}>
              Lưu ý quan trọng
            </p>
            <p className="mb-2" style={{ fontSize: '12px', lineHeight: 1.6, color: '#7A5A00' }}>
              File backup chứa <span style={{ fontWeight: 700 }}>dữ liệu học viên, số điện thoại, lịch sử học và thanh toán</span>.
            </p>
            <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#7A5A00' }}>
              Vui lòng <span style={{ fontWeight: 700 }}>lưu file ở nơi an toàn</span> và không chia sẻ cho người không có thẩm quyền.
            </p>
          </div>
        </div>

        {/* ── Backup file preview ── */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
              FILE BACKUP GẦN NHẤT
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p
                className="truncate text-gray-900 mb-1"
                style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600 }}
              >
                {latestBackup.filename}
              </p>
              <p className="text-xs text-gray-500">
                {latestBackup.size} • SQLite database
              </p>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(14,124,123,0.1)' }}
            >
              <span className="text-xs font-bold text-[#0E7C7B]">.db3</span>
            </div>
          </div>
        </div>

        {/* ── Primary Action: Sao lưu ngay ── */}
        {backupState === 'backing-up' ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-4">
            {/* Progress bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-900">Đang sao lưu...</span>
                <span className="text-sm font-bold text-[#0E7C7B]">{progress}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg,#0E7C7B,#2A9D8F)',
                  }}
                />
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2">
              {STEPS.map((s, i) => {
                const done    = i < stepIdx;
                const active  = i === stepIdx - 1;
                return (
                  <div key={i} className="flex items-center gap-2.5">
                    {done ? (
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: '#2A9D8F' }} />
                    ) : active ? (
                      <div
                        className="w-4 h-4 rounded-full border-2 border-t-transparent flex-shrink-0 animate-spin"
                        style={{ borderColor: 'rgba(14,124,123,0.3)', borderTopColor: '#0E7C7B' }}
                      />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    )}
                    <span style={{
                      fontSize: '12px',
                      fontWeight: active ? 700 : done ? 600 : 400,
                      color: active ? '#0E7C7B' : done ? '#1f2937' : '#9ca3af',
                    }}>
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <button
            onClick={startBackup}
            className="w-full h-14 rounded-2xl text-white font-bold shadow-lg shadow-[#0E7C7B]/30
              hover:shadow-xl hover:shadow-[#0E7C7B]/40 active:scale-[0.98] transition-all
              flex items-center justify-center gap-3 mb-4"
            style={{
              background: backupState === 'success'
                ? 'linear-gradient(135deg,#2A9D8F,#0E7C7B)'
                : 'linear-gradient(135deg,#0E7C7B,#075E5D)',
              fontSize: '15px',
            }}
          >
            {backupState === 'success' ? (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Sao lưu thành công!</span>
              </>
            ) : (
              <>
                <CloudUpload className="w-6 h-6" />
                <span>Sao lưu ngay</span>
              </>
            )}
          </button>
        )}

        {/* ── Secondary Actions ── */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Chia sẻ file */}
          <button
            onClick={handleShare}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-gray-200
              active:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#0E7C7B]/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-[#0E7C7B]" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Chia sẻ file</span>
            <span className="text-xs text-gray-500">Backup gần nhất</span>
          </button>

          {/* Xem lịch sử */}
          <button
            onClick={handleViewHistory}
            className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white border border-gray-200
              active:bg-gray-50 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-[#815AD5]/10 flex items-center justify-center">
              <History className="w-5 h-5 text-[#815AD5]" />
            </div>
            <span className="text-xs font-semibold text-gray-900">Lịch sử</span>
            <span className="text-xs text-gray-500">Xem backup cũ</span>
          </button>
        </div>

        {/* ── Backup History List ── */}
        <div className="mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
            Lịch sử sao lưu
          </p>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            {history.map((rec, i) => (
              <div
                key={rec.id}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < history.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                {/* icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: rec.status === 'ok' ? 'rgba(42,157,143,0.12)' : 'rgba(233,196,106,0.15)',
                  }}
                >
                  {rec.status === 'ok'
                    ? <CheckCircle2 className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: '#2A9D8F' }} />
                    : <AlertTriangle className="w-4.5 h-4.5" style={{ width: 18, height: 18, color: '#A07B10' }} />
                  }
                </div>

                {/* text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900">{rec.date}</span>
                    <span className="text-xs text-gray-500">{rec.time}</span>
                    {i === 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded-full"
                        style={{ fontSize: '9px', fontWeight: 700, background: 'rgba(14,124,123,0.12)', color: '#0E7C7B' }}
                      >
                        Mới nhất
                      </span>
                    )}
                  </div>
                  <p
                    className="text-gray-500 truncate"
                    style={{ fontSize: '10px', fontFamily: 'monospace' }}
                  >
                    {rec.filename}
                  </p>
                </div>

                {/* size + action */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ fontSize: '10px', fontWeight: 600, background: 'rgba(14,124,123,0.08)', color: '#0E7C7B' }}
                  >
                    {rec.size}
                  </span>
                  <button
                    onClick={handleShare}
                    className="w-7 h-7 flex items-center justify-center rounded-lg active:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Info Tips ── */}
        <div
          className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: 'rgba(14,124,123,0.05)', border: '1px solid rgba(14,124,123,0.15)' }}
        >
          <Info className="w-4 h-4 text-[#0E7C7B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="mb-1.5" style={{ fontSize: '12px', lineHeight: 1.6, color: '#0E7C7B', fontWeight: 700 }}>
              Khuyến nghị sao lưu
            </p>
            <p className="text-gray-600" style={{ fontSize: '12px', lineHeight: 1.6 }}>
              Nên sao lưu <span style={{ fontWeight: 600, color: '#0E7C7B' }}>ít nhất 1 lần/tuần</span> để đảm bảo an toàn dữ liệu học viên và lịch sử thanh toán.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}