import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface Student {
  name: string;
  className: string;
  sessionsRemaining: number;
}

interface OutOfSessionsWarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  student?: Student;
}

export function OutOfSessionsWarningDialog({
  isOpen,
  onClose,
  onConfirm,
  student = { name: 'Lê Văn C', className: 'Beginner A', sessionsRemaining: 0 }
}: OutOfSessionsWarningDialogProps) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
      handleClose();
    }
  };

  const handleClose = () => {
    setIsConfirmed(false);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] animate-fade-in"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-2xl w-full max-w-[342px] shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-6">
            {/* Warning Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-[#E76F51]/10 flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-[#E76F51]" strokeWidth={2.5} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-bold text-center text-gray-900 mb-3">
              Học viên đã hết buổi
            </h2>

            {/* Warning Message */}
            <div className="bg-[#E76F51]/5 border border-[#E76F51]/20 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-semibold text-[#E76F51]">{student.name}</span> hiện còn{' '}
                <span className="font-bold text-[#E76F51]">{student.sessionsRemaining} buổi</span>. 
                Nếu tiếp tục điểm danh <span className="font-semibold">Có mặt</span>, 
                học viên sẽ <span className="font-semibold text-[#E76F51]">học vượt gói</span>.
              </p>
            </div>

            {/* Student Info Card */}
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Học viên</span>
                  <span className="text-sm font-semibold text-gray-900">{student.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Lớp học</span>
                  <span className="text-sm font-medium text-gray-700">{student.className}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Còn lại</span>
                  <span className="text-sm font-bold text-[#E76F51]">
                    {student.sessionsRemaining} buổi
                  </span>
                </div>
              </div>
            </div>

            {/* Confirmation Checkbox */}
            <label className="flex items-start gap-3 p-4 bg-[#E9C46A]/10 border border-[#E9C46A]/30 rounded-xl mb-6 cursor-pointer hover:bg-[#E9C46A]/15 transition-colors">
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="mt-0.5 w-5 h-5 rounded border-2 border-[#E9C46A] text-[#E9C46A] 
                  focus:ring-2 focus:ring-[#E9C46A]/30 focus:ring-offset-0 cursor-pointer
                  transition-all"
              />
              <span className="text-sm font-medium text-gray-700 leading-snug flex-1">
                Tôi đã xác nhận cho học viên học tiếp
              </span>
            </label>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 h-12 rounded-xl bg-gray-100 text-gray-700 font-semibold
                  hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                disabled={!isConfirmed}
                className={`flex-1 h-12 rounded-xl font-semibold transition-all
                  ${isConfirmed 
                    ? 'bg-[#E76F51] text-white hover:bg-[#E76F51]/90 active:bg-[#E76F51]/80 shadow-lg shadow-[#E76F51]/25' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Vẫn lưu điểm danh
              </button>
            </div>

            {/* Helper Text */}
            {!isConfirmed && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Vui lòng xác nhận để tiếp tục
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}