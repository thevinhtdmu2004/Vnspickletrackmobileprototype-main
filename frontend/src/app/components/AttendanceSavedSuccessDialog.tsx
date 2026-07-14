import React from 'react';
import { CheckCircle2, Calendar, Users, X } from 'lucide-react';

interface AttendanceSummary {
  className: string;
  date: string;
  totalStudents: number;
  attended: number;
  present: number;
  late: number;
  makeup: number;
  absent: number;
  leave: number;
}

interface AttendanceSavedSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDetail: () => void;
  onBackToClasses: () => void;
  summary?: AttendanceSummary;
}

export function AttendanceSavedSuccessDialog({
  isOpen,
  onClose,
  onViewDetail,
  onBackToClasses,
  summary = {
    className: 'Beginner A',
    date: '29/04/2026',
    totalStudents: 8,
    attended: 8,
    present: 4,
    late: 1,
    makeup: 0,
    absent: 2,
    leave: 1
  }
}: AttendanceSavedSuccessDialogProps) {
  if (!isOpen) return null;

  const statItems = [
    { label: 'Có mặt', value: summary.present, color: '#2A9D8F', bg: 'rgba(42,157,143,0.1)' },
    { label: 'Trễ', value: summary.late, color: '#E9C46A', bg: 'rgba(233,196,106,0.1)' },
    { label: 'Học bù', value: summary.makeup, color: '#815AD5', bg: 'rgba(129,90,213,0.1)' },
    { label: 'Vắng', value: summary.absent, color: '#E76F51', bg: 'rgba(231,111,81,0.1)' },
    { label: 'Nghỉ phép', value: summary.leave, color: '#6B7280', bg: 'rgba(107,116,128,0.1)' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-[100] animate-fade-in"
        onClick={onClose}
      />

      {/* Dialog - Centered */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-3xl w-full max-w-[358px] shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="pt-8 pb-6">
            {/* Success Icon */}
            <div className="flex justify-center mb-4">
              <div className="relative">
                {/* Outer ring */}
                <div className="w-20 h-20 rounded-full bg-[#0E7C7B]/10 flex items-center justify-center">
                  {/* Middle ring */}
                  <div className="w-16 h-16 rounded-full bg-[#0E7C7B]/20 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-[#0E7C7B]" strokeWidth={2.5} />
                  </div>
                </div>
                {/* Shine effect */}
                <div className="absolute top-0 right-0 w-3 h-3 bg-[#2A9D8F] rounded-full opacity-60 blur-sm" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-center text-xl font-bold text-[#0E7C7B] mb-1">
              Đã lưu điểm danh
            </h2>
            <p className="text-center text-sm text-gray-500 mb-6">
              Điểm danh hoàn tất thành công
            </p>

            {/* Summary Card */}
            <div className="mx-6 mb-6">
              {/* Class & Date Info */}
              <div className="bg-gradient-to-br from-[#0E7C7B]/5 to-[#2A9D8F]/5 rounded-2xl p-4 mb-4 border border-[#0E7C7B]/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0E7C7B]" />
                    <span className="text-xs text-gray-500">Lớp học</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{summary.className}</span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#0E7C7B]" />
                    <span className="text-xs text-gray-500">Ngày</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{summary.date}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#0E7C7B]" />
                    <span className="text-xs text-gray-500">Đã điểm danh</span>
                  </div>
                  <span className="text-sm font-bold text-[#0E7C7B]">
                    {summary.attended}/{summary.totalStudents} học viên
                  </span>
                </div>
              </div>

              {/* Attendance Stats Grid */}
              <div className="grid grid-cols-3 gap-2">
                {statItems.map((item, index) => (
                  <div
                    key={index}
                    className="rounded-xl p-3 text-center transition-transform active:scale-95"
                    style={{ backgroundColor: item.bg }}
                  >
                    <div 
                      className="text-lg font-bold mb-0.5" 
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </div>
                    <div className="text-xs text-gray-600 font-medium leading-tight">
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 space-y-3">
              {/* Primary Action */}
              <button
                onClick={onViewDetail}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] 
                  text-white font-semibold shadow-lg shadow-[#0E7C7B]/25
                  hover:shadow-xl hover:shadow-[#0E7C7B]/30 active:scale-[0.98] transition-all"
              >
                Xem chi tiết buổi học
              </button>

              {/* Secondary Action */}
              <button
                onClick={onBackToClasses}
                className="w-full h-12 rounded-xl bg-gray-100 text-gray-700 font-semibold
                  hover:bg-gray-200 active:bg-gray-300 transition-colors"
              >
                Quay lại lớp hôm nay
              </button>
            </div>

            {/* Optional: Success indicator */}
            <div className="flex items-center justify-center gap-2 mt-4 px-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F] animate-pulse" />
              <p className="text-xs text-gray-400">
                Dữ liệu đã được lưu thành công
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
