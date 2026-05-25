import {
  ArrowLeft, Layers, DollarSign, Calendar, CheckCircle2,
  Info, Trash2, FileText, Sparkles, XCircle
} from 'lucide-react';
import { useState } from 'react';

interface PackageFormScreenProps {
  onBack: () => void;
  onSave: () => void;
  packageId?: number; // undefined = add mode, number = edit mode
}

export function PackageFormScreen({ onBack, onSave, packageId }: PackageFormScreenProps) {
  const isEditMode = packageId !== undefined;

  // Mock initial data for edit mode
  const [name, setName] = useState(isEditMode ? 'Gói 12 buổi' : '');
  const [sessions, setSessions] = useState(isEditMode ? '12' : '');
  const [price, setPrice] = useState(isEditMode ? '2400000' : '');
  const [validityDays, setValidityDays] = useState(isEditMode ? '90' : '');
  const [status, setStatus] = useState<'active' | 'inactive'>(isEditMode ? 'active' : 'active');
  const [notes, setNotes] = useState(isEditMode ? 'Gói phổ biến nhất' : '');

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Validation
  const nameError = name.trim() === '';
  const sessionsError = !sessions || Number(sessions) <= 0;
  const priceError = !price || Number(price) < 0;

  const canSave = !nameError && !sessionsError && !priceError && validityDays;

  // Calculate price per session
  const pricePerSession = sessions && price && Number(sessions) > 0
    ? Math.round(Number(price) / Number(sessions))
    : 0;

  function handleSave() {
    if (!canSave) return;
    console.log('Save package:', { name, sessions, price, validityDays, status, notes });
    onSave();
  }

  function handleDelete() {
    console.log('Delete package:', packageId);
    onBack();
  }

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
              {isEditMode ? 'Sửa gói học' : 'Thêm gói học'}
            </h1>
          </div>
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        
        {/* Info banner */}
        <div
          className="rounded-xl p-3.5 flex items-start gap-2.5 mb-4"
          style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}
        >
          <Info className="w-4 h-4 text-[#0E7C7B] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-700" style={{ lineHeight: 1.6 }}>
            Gói học sẽ hiển thị khi Admin gia hạn cho học viên. Bạn có thể tạm ngưng gói mà không cần xóa.
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          {/* 1. Package Name * */}
          <div className="p-4 border-b border-gray-100">
            <label className="block mb-2">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Tên gói <span className="text-[#E76F51]">*</span>
              </span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Gói 12 buổi"
              className="w-full px-4 py-3 rounded-xl border text-sm font-semibold text-gray-900
                placeholder:text-gray-400
                focus:outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
              style={{ borderColor: nameError && name ? '#E76F51' : '#E5E7EB' }}
            />
            {nameError && name && (
              <p className="mt-1.5 text-xs text-[#E76F51]">Tên gói không được để trống</p>
            )}
          </div>

          {/* 2. Sessions * */}
          <div className="p-4 border-b border-gray-100">
            <label className="flex items-center gap-2 mb-2">
              <Layers className="w-4 h-4 text-[#0E7C7B]" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Số buổi <span className="text-[#E76F51]">*</span>
              </span>
            </label>
            <input
              type="number"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              placeholder="12"
              className="w-full px-4 py-3 rounded-xl border text-sm font-semibold text-gray-900
                placeholder:text-gray-400
                focus:outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
              style={{ borderColor: sessionsError && sessions ? '#E76F51' : '#E5E7EB' }}
            />
            {sessionsError && sessions && (
              <p className="mt-1.5 text-xs text-[#E76F51]">Số buổi phải lớn hơn 0</p>
            )}
          </div>

          {/* 3. Price * */}
          <div className="p-4 border-b border-gray-100">
            <label className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-[#F4A261]" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Giá gói <span className="text-[#E76F51]">*</span>
              </span>
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="2400000"
              className="w-full px-4 py-3 rounded-xl border text-sm font-semibold text-gray-900
                placeholder:text-gray-400
                focus:outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
              style={{ borderColor: priceError && price ? '#E76F51' : '#E5E7EB' }}
            />
            {price && Number(price) >= 0 && (
              <p className="mt-1.5 text-xs text-gray-500">
                {new Intl.NumberFormat('vi-VN').format(Number(price))}đ
              </p>
            )}
            {priceError && price && (
              <p className="mt-1.5 text-xs text-[#E76F51]">Giá gói không được âm</p>
            )}
          </div>

          {/* 4. Validity Days */}
          <div className="p-4 border-b border-gray-100">
            <label className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-[#815AD5]" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Số ngày hiệu lực
              </span>
            </label>
            <input
              type="number"
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
              placeholder="90"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-900
                placeholder:text-gray-400
                focus:outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
            />
            {validityDays && Number(validityDays) > 0 && (
              <p className="mt-1.5 text-xs text-gray-500">
                ≈ {Math.round(Number(validityDays) / 30)} tháng
              </p>
            )}
          </div>

          {/* 5. Status */}
          <div className="p-4 border-b border-gray-100">
            <label className="block mb-3">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Trạng thái
              </span>
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setStatus('active')}
                className="flex-1 px-4 py-3 rounded-xl border-2 transition-all active:scale-95"
                style={{
                  borderColor: status === 'active' ? '#2A9D8F' : '#E5E7EB',
                  background: status === 'active' ? 'rgba(42,157,143,0.1)' : 'white',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle2
                    className="w-4 h-4"
                    style={{ color: status === 'active' ? '#2A9D8F' : '#9CA3AF' }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: status === 'active' ? '#2A9D8F' : '#6B7280' }}
                  >
                    Đang dùng
                  </span>
                </div>
              </button>

              <button
                onClick={() => setStatus('inactive')}
                className="flex-1 px-4 py-3 rounded-xl border-2 transition-all active:scale-95"
                style={{
                  borderColor: status === 'inactive' ? '#9CA3AF' : '#E5E7EB',
                  background: status === 'inactive' ? 'rgba(156,163,175,0.1)' : 'white',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <XCircle
                    className="w-4 h-4"
                    style={{ color: status === 'inactive' ? '#6B7280' : '#9CA3AF' }}
                  />
                  <span
                    className="text-sm font-bold"
                    style={{ color: status === 'inactive' ? '#6B7280' : '#9CA3AF' }}
                  >
                    Ngưng dùng
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 6. Notes */}
          <div className="p-4">
            <label className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                Ghi chú
              </span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Thông tin bổ sung về gói học..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900
                placeholder:text-gray-400 resize-none
                focus:outline-none focus:border-[#0E7C7B] focus:ring-2 focus:ring-[#0E7C7B]/20"
            />
          </div>
        </div>

        {/* Preview Card */}
        {name && sessions && price && validityDays && (
          <div
            className="rounded-2xl border-2 overflow-hidden mb-4 relative"
            style={{
              background: 'linear-gradient(145deg, rgba(14,124,123,0.04), rgba(42,157,143,0.08))',
              borderColor: '#0E7C7B',
            }}
          >
            {/* Preview label */}
            <div
              className="flex items-center gap-2 px-3 py-2 border-b"
              style={{ background: 'rgba(14,124,123,0.08)', borderColor: 'rgba(14,124,123,0.2)' }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0E7C7B]" />
              <span className="text-xs font-bold text-[#0E7C7B] uppercase tracking-wide">
                Preview gói học
              </span>
            </div>

            {/* Preview content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {name}
                  </h3>
                  <div
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{
                      background: status === 'active' ? 'rgba(42,157,143,0.15)' : 'rgba(156,163,175,0.15)',
                    }}
                  >
                    {status === 'active' ? (
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
              </div>

              {/* Price */}
              <div className="mb-3">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className="font-bold"
                    style={{
                      fontSize: '32px',
                      lineHeight: 1,
                      background: 'linear-gradient(135deg, #0E7C7B, #2A9D8F)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {new Intl.NumberFormat('vi-VN').format(Number(price))}đ
                  </span>
                </div>
                {pricePerSession > 0 && (
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-bold text-[#F4A261]">
                      {new Intl.NumberFormat('vi-VN').format(pricePerSession)}đ
                    </span>
                    {' '}/buổi
                  </p>
                )}
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/60">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(14,124,123,0.15)' }}
                  >
                    <Layers className="w-4 h-4 text-[#0E7C7B]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Số buổi</p>
                    <p className="text-sm font-bold text-gray-900">{sessions}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/60">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(129,90,213,0.15)' }}
                  >
                    <Calendar className="w-4 h-4 text-[#815AD5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-600">Hiệu lực</p>
                    <p className="text-sm font-bold text-gray-900">{validityDays} ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Button (Edit mode only) */}
        {isEditMode && (
          <div className="mb-4">
            {showDeleteConfirm ? (
              <div className="bg-white rounded-2xl border-2 border-[#E76F51] p-4">
                <p className="text-sm font-bold text-gray-900 mb-3">
                  Xác nhận xóa gói học này?
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDelete}
                    className="flex-1 h-11 rounded-xl bg-[#E76F51] text-white font-semibold
                      active:scale-95 transition-all"
                  >
                    Xóa gói
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 h-11 rounded-xl bg-gray-100 text-gray-700 font-semibold
                      active:scale-95 transition-all"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="w-full h-12 rounded-xl border-2 border-gray-200
                  text-gray-600 font-semibold
                  hover:border-[#E76F51] hover:text-[#E76F51]
                  active:scale-95 transition-all
                  flex items-center justify-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Xóa gói học
              </button>
            )}
          </div>
        )}

        <div className="h-20" />
      </div>

      {/* ══ Fixed Footer ══ */}
      <div
        className="flex-shrink-0 px-4 py-3 border-t bg-white"
        style={{ borderColor: '#E5E7EB' }}
      >
        <div className="flex gap-3">
          {/* Cancel */}
          <button
            onClick={onBack}
            className="flex-1 h-12 rounded-xl border-2 border-gray-200
              text-gray-700 font-semibold
              active:scale-95 transition-all
              flex items-center justify-center gap-2"
          >
            Hủy
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 h-12 rounded-xl text-white font-semibold
              disabled:opacity-50 disabled:cursor-not-allowed
              active:scale-95 transition-all
              flex items-center justify-center gap-2"
            style={{
              background: canSave
                ? 'linear-gradient(135deg,#0E7C7B,#2A9D8F)'
                : '#D1D5DB',
            }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Lưu gói học
          </button>
        </div>
      </div>
    </div>
  );
}
