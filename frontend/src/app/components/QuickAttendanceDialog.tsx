import React, { useState } from 'react';
import { X, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface QuickAttendanceDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (action: QuickAttendanceAction) => void;
}

export type QuickAttendanceAction =
  | 'mark-all-present'
  | 'mark-unselected-present'
  | 'clear-all'
  | 'filter-unmarked'
  | 'filter-low-sessions';

export default function QuickAttendanceDialog({ isOpen, onClose, onApply }: QuickAttendanceDialogProps) {
  const [selectedAction, setSelectedAction] = useState<QuickAttendanceAction>('mark-all-present');

  if (!isOpen) return null;

  const options: { value: QuickAttendanceAction; label: string; icon: React.ReactNode; color: string }[] = [
    {
      value: 'mark-all-present',
      label: 'Đánh dấu tất cả là Có mặt',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-[#0E7C7B]'
    },
    {
      value: 'mark-unselected-present',
      label: 'Đánh dấu tất cả chưa chọn là Có mặt',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'text-[#0E7C7B]'
    },
    {
      value: 'clear-all',
      label: 'Xóa lựa chọn điểm danh',
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-gray-600'
    },
    {
      value: 'filter-unmarked',
      label: 'Chỉ hiển thị học viên chưa điểm danh',
      icon: <Users className="w-5 h-5" />,
      color: 'text-[#F4A261]'
    },
    {
      value: 'filter-low-sessions',
      label: 'Chỉ hiển thị học viên sắp hết buổi',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-[#E9C46A]'
    }
  ];

  const handleApply = () => {
    onApply(selectedAction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet - 60% height */}
      <div className="relative w-full max-w-[390px] bg-white rounded-t-3xl shadow-2xl animate-slide-up"
           style={{ height: '60vh', maxHeight: '506px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0E7C7B]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#0E7C7B]" />
            </div>
            <h2 className="font-semibold text-gray-900">Điểm danh nhanh</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Scroll Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Options List */}
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedAction(option.value)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                  selectedAction === option.value
                    ? 'border-[#0E7C7B] bg-[#0E7C7B]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Radio Button */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedAction === option.value
                    ? 'border-[#0E7C7B]'
                    : 'border-gray-300'
                }`}>
                  {selectedAction === option.value && (
                    <div className="w-3 h-3 rounded-full bg-[#0E7C7B]" />
                  )}
                </div>

                {/* Icon */}
                <div className={option.color}>
                  {option.icon}
                </div>

                {/* Label */}
                <span className={`flex-1 text-left ${
                  selectedAction === option.value ? 'font-medium text-gray-900' : 'text-gray-700'
                }`}>
                  {option.label}
                </span>
              </button>
            ))}
          </div>

          {/* Warning Message */}
          <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Bạn vẫn có thể chỉnh từng học viên sau khi áp dụng.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-100 px-5 py-4 bg-white">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 rounded-xl border-2 border-gray-300 font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-3.5 rounded-xl bg-[#0E7C7B] font-medium text-white hover:bg-[#0c6a69] transition-colors shadow-lg shadow-[#0E7C7B]/20"
            >
              Áp dụng
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
