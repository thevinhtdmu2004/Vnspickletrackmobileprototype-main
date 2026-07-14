import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react';
import { AttendanceSavedSuccessDialog } from './AttendanceSavedSuccessDialog';
import { OutOfSessionsWarningDialog } from './OutOfSessionsWarningDialog';

interface AttendanceDialogsDemoProps {
  onBack: () => void;
}

export function AttendanceDialogsDemo({ onBack }: AttendanceDialogsDemoProps) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showWarningDialog, setShowWarningDialog] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">
      {/* Dialogs */}
      <AttendanceSavedSuccessDialog
        isOpen={showSuccessDialog}
        onClose={() => setShowSuccessDialog(false)}
        onViewDetail={() => {
          console.log('View detail clicked');
          setShowSuccessDialog(false);
        }}
        onBackToClasses={() => {
          console.log('Back to classes clicked');
          setShowSuccessDialog(false);
        }}
        summary={{
          className: 'Beginner A',
          date: '29/04/2026',
          totalStudents: 8,
          attended: 8,
          present: 4,
          late: 1,
          makeup: 0,
          absent: 2,
          leave: 1
        }}
      />

      <OutOfSessionsWarningDialog
        isOpen={showWarningDialog}
        onClose={() => setShowWarningDialog(false)}
        onConfirm={() => {
          console.log('Confirmed!');
          setShowWarningDialog(false);
          // Show success dialog after confirmation
          setTimeout(() => setShowSuccessDialog(true), 300);
        }}
        student={{
          name: 'Lê Văn C',
          className: 'Beginner A',
          sessionsRemaining: 0
        }}
      />

      {/* Header */}
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
              Attendance Dialogs Demo
            </h1>
            <p className="text-white/55" style={{ fontSize: '11px' }}>
              Test các dialog cho điểm danh
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-md mx-auto space-y-4">
          {/* Info Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h2 className="text-base font-bold text-gray-900 mb-2">
              Test Dialog Flow
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Demo các dialog sử dụng trong quy trình điểm danh. Click vào các nút bên dưới để test.
            </p>
          </div>

          {/* Dialog Buttons */}
          <div className="space-y-3">
            {/* Success Dialog */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#2A9D8F]/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-[#2A9D8F]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Lưu điểm danh thành công
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Hiển thị tóm tắt kết quả điểm danh với stats chi tiết (Có mặt, Trễ, Học bù, Vắng, Nghỉ phép)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSuccessDialog(true)}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] 
                  text-white font-semibold shadow-lg shadow-[#0E7C7B]/20
                  hover:shadow-xl hover:shadow-[#0E7C7B]/30 active:scale-[0.98] transition-all"
              >
                Hiển thị Success Dialog
              </button>
            </div>

            {/* Warning Dialog */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-[#E76F51]/20">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#E76F51]/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[#E76F51]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 mb-1">
                    Cảnh báo học viên hết buổi
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Yêu cầu xác nhận bằng checkbox trước khi cho phép điểm danh học viên đã hết buổi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWarningDialog(true)}
                className="w-full h-11 rounded-xl bg-[#E76F51]
                  text-white font-semibold shadow-lg shadow-[#E76F51]/20
                  hover:shadow-xl hover:shadow-[#E76F51]/30 active:scale-[0.98] transition-all"
              >
                Hiển thị Warning Dialog
              </button>
            </div>

            {/* Flow Demo */}
            <div className="bg-gradient-to-br from-[#815AD5]/5 to-[#6B46C1]/5 rounded-2xl p-5 shadow-sm border border-[#815AD5]/20">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                🔄 Test Complete Flow
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Click nút Warning Dialog → Tick checkbox → Click "Vẫn lưu điểm danh" → Xem Success Dialog tự động hiện
              </p>
              <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-[#815AD5]/30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#815AD5] animate-pulse" />
                <p className="text-xs text-gray-600 font-medium">
                  Workflow: Warning → Confirm → Success
                </p>
              </div>
            </div>
          </div>

          {/* Dialog Specs */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200">
            <h3 className="text-sm font-bold text-gray-900 mb-3">
              📋 Dialog Specifications
            </h3>
            
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold text-[#0E7C7B] mb-1">Success Dialog</h4>
                <ul className="text-xs text-gray-600 space-y-1 pl-4">
                  <li className="list-disc">Centered modal với backdrop blur</li>
                  <li className="list-disc">Icon CheckCircle với double ring</li>
                  <li className="list-disc">Summary card: Lớp, Ngày, Tổng học viên</li>
                  <li className="list-disc">Grid 3 cột: 5 stats với màu riêng</li>
                  <li className="list-disc">2 actions: Primary & Secondary</li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#E76F51] mb-1">Warning Dialog</h4>
                <ul className="text-xs text-gray-600 space-y-1 pl-4">
                  <li className="list-disc">Centered modal với cảnh báo rõ ràng</li>
                  <li className="list-disc">Icon AlertTriangle màu Danger</li>
                  <li className="list-disc">Thông tin học viên (tên, lớp, buổi còn lại)</li>
                  <li className="list-disc">Checkbox bắt buộc để enable nút Lưu</li>
                  <li className="list-disc">Prevent accidental click</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
