import {
  ArrowLeft, FileText, Users, CreditCard, ClipboardCheck,
  GraduationCap, Calendar, Share2, CheckCircle2, Download,
  Check, Info
} from 'lucide-react';
import { useState } from 'react';

interface ExportCSVScreenProps {
  onBack: () => void;
}

type ExportOption = 'students' | 'payments' | 'attendance' | 'classes';

interface ExportOptionData {
  id: ExportOption;
  icon: React.ElementType;
  label: string;
  description: string;
  color: string;
  bg: string;
}

const EXPORT_OPTIONS: ExportOptionData[] = [
  {
    id: 'students',
    icon: Users,
    label: 'Danh sách học viên',
    description: 'Bao gồm họ tên, SĐT, lớp, tổng buổi, đã học, còn lại',
    color: '#0E7C7B',
    bg: 'rgba(14,124,123,0.1)',
  },
  {
    id: 'payments',
    icon: CreditCard,
    label: 'Lịch sử thanh toán',
    description: 'Bao gồm ngày thanh toán, học viên, gói học, số tiền',
    color: '#F4A261',
    bg: 'rgba(244,162,97,0.1)',
  },
  {
    id: 'attendance',
    icon: ClipboardCheck,
    label: 'Lịch sử điểm danh',
    description: 'Bao gồm ngày học, lớp, học viên, trạng thái điểm danh',
    color: '#2A9D8F',
    bg: 'rgba(42,157,143,0.1)',
  },
  {
    id: 'classes',
    icon: GraduationCap,
    label: 'Danh sách lớp học',
    description: 'Bao gồm tên lớp, coach, sân, lịch học',
    color: '#815AD5',
    bg: 'rgba(129,90,213,0.1)',
  },
];

export function ExportCSVScreen({ onBack }: ExportCSVScreenProps) {
  const [selectedOptions, setSelectedOptions] = useState<ExportOption[]>([]);
  const [fromDate, setFromDate] = useState('2026-01-01');
  const [toDate, setToDate] = useState('2026-04-29');
  const [exportState, setExportState] = useState<'idle' | 'exporting' | 'success'>('idle');
  const [exportedFile, setExportedFile] = useState('');

  function toggleOption(id: ExportOption) {
    setSelectedOptions(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  }

  function handleExport() {
    if (selectedOptions.length === 0) return;

    setExportState('exporting');
    
    // Simulate export
    setTimeout(() => {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const filename = `vns_export_${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}.csv`;
      
      setExportedFile(filename);
      setExportState('success');
    }, 2000);
  }

  function handleShare() {
    console.log('Share CSV file:', exportedFile);
    // In real app: trigger native share
  }

  function resetExport() {
    setExportState('idle');
    setExportedFile('');
    setSelectedOptions([]);
  }

  const canExport = selectedOptions.length > 0;

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
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Xuất dữ liệu CSV</h1>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <FileText className="w-3 h-3 text-white/70" />
            <span className="text-white/70" style={{ fontSize: '10px', fontWeight: 600 }}>Excel</span>
          </div>
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-6">

        {exportState === 'success' ? (
          /* ── Success State ── */
          <div className="flex flex-col items-center justify-center py-8">
            {/* Success Icon */}
            <div className="mb-6">
              <div
                className="relative w-24 h-24 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(42,157,143,0.1) 0%, rgba(14,124,123,0.15) 100%)',
                  border: '6px solid rgba(42,157,143,0.15)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(42,157,143,0.2)' }}
                >
                  <CheckCircle2 className="w-10 h-10 text-[#2A9D8F]" />
                </div>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Xuất file thành công
            </h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Dữ liệu đã được xuất ra file CSV
            </p>

            {/* File card */}
            <div className="w-full bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                <FileText className="w-4 h-4 text-[#0E7C7B]" />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  File CSV
                </span>
                <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2A9D8F]/10">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-pulse" />
                  <span className="text-xs font-bold text-[#2A9D8F]">Mới</span>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Tên file</p>
                <p
                  className="text-gray-900 break-all"
                  style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: 600, lineHeight: 1.5 }}
                >
                  {exportedFile}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Dữ liệu xuất</p>
                  <p className="text-sm font-bold text-gray-900">
                    {selectedOptions.length} loại
                  </p>
                </div>
                <div className="flex-1 px-3 py-2 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500">Định dạng</p>
                  <p className="text-sm font-bold text-gray-900">.csv</p>
                </div>
              </div>
            </div>

            {/* Info */}
            <div
              className="w-full rounded-xl p-3 flex items-start gap-2.5 mb-6"
              style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}
            >
              <Info className="w-4 h-4 text-[#0E7C7B] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700" style={{ lineHeight: 1.5 }}>
                File CSV có thể mở bằng <span className="font-semibold">Excel, Google Sheets</span> hoặc phần mềm quản lý dữ liệu.
              </p>
            </div>

            {/* Buttons */}
            <div className="w-full space-y-3">
              <button
                onClick={handleShare}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] 
                  text-white font-semibold shadow-lg shadow-[#0E7C7B]/25
                  hover:shadow-xl hover:shadow-[#0E7C7B]/30 active:scale-[0.98] transition-all
                  flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Chia sẻ file
              </button>

              <button
                onClick={resetExport}
                className="w-full h-12 rounded-xl bg-white border border-gray-200
                  text-gray-700 font-semibold
                  hover:bg-gray-50 active:scale-[0.98] transition-all
                  flex items-center justify-center gap-2"
              >
                Xuất file khác
              </button>
            </div>
          </div>
        ) : (
          /* ── Form State ── */
          <>
            {/* Description */}
            <div className="mb-5">
              <p className="text-sm text-gray-600" style={{ lineHeight: 1.6 }}>
                Chọn loại dữ liệu cần xuất ra file CSV để lưu trữ hoặc mở bằng Excel/Google Sheets.
              </p>
            </div>

            {/* Export Options */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Chọn dữ liệu xuất
              </p>
              <div className="space-y-2.5">
                {EXPORT_OPTIONS.map(option => {
                  const Icon = option.icon;
                  const isSelected = selectedOptions.includes(option.id);

                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleOption(option.id)}
                      className="w-full bg-white rounded-2xl border-2 transition-all active:scale-[0.98] p-4"
                      style={{
                        borderColor: isSelected ? option.color : '#E5E7EB',
                        background: isSelected ? option.bg : 'white',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Checkbox */}
                        <div
                          className="w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                          style={{
                            borderColor: isSelected ? option.color : '#D1D5DB',
                            background: isSelected ? option.color : 'white',
                          }}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                        </div>

                        {/* Icon */}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: option.bg }}
                        >
                          <Icon className="w-5 h-5" style={{ color: option.color }} />
                        </div>

                        {/* Text */}
                        <div className="flex-1 text-left">
                          <p className="text-sm font-bold text-gray-900 mb-0.5">
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-600" style={{ lineHeight: 1.5 }}>
                            {option.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-5">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">
                Khoảng thời gian
              </p>
              <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-3">
                {/* From Date */}
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700">Từ ngày</span>
                  </label>
                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900
                      focus:outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-700">Đến ngày</span>
                  </label>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900
                      focus:outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            {selectedOptions.length > 0 && (
              <div
                className="rounded-xl p-3.5 flex items-start gap-2.5 mb-5"
                style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}
              >
                <Info className="w-4 h-4 text-[#0E7C7B] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-bold text-[#0E7C7B] mb-1">
                    Sẽ xuất {selectedOptions.length} loại dữ liệu
                  </p>
                  <p className="text-xs text-gray-700" style={{ lineHeight: 1.5 }}>
                    Thời gian: {new Date(fromDate).toLocaleDateString('vi-VN')} - {new Date(toDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            )}

            {/* Export Button */}
            <button
              onClick={handleExport}
              disabled={!canExport || exportState === 'exporting'}
              className="w-full h-14 rounded-2xl text-white font-bold shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed
                active:scale-[0.98] transition-all
                flex items-center justify-center gap-3"
              style={{
                background: canExport
                  ? 'linear-gradient(135deg,#0E7C7B,#075E5D)'
                  : '#D1D5DB',
                boxShadow: canExport ? '0 6px 20px rgba(14,124,123,0.35)' : 'none',
              }}
            >
              {exportState === 'exporting' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xuất...</span>
                </>
              ) : (
                <>
                  <Download className="w-6 h-6" />
                  <span>Xuất file CSV</span>
                </>
              )}
            </button>

            {!canExport && (
              <p className="text-center text-xs text-gray-500 mt-3">
                Vui lòng chọn ít nhất 1 loại dữ liệu
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
