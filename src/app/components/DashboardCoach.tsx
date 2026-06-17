import React, { useState } from 'react';
import { Calendar, Users, AlertCircle, CheckCircle, ClipboardCheck, Clock, BookOpen } from 'lucide-react';

interface MakeupRequest {
  id: string;
  courseName: string;
  missedDate: string;
  desiredDate: string;
  desiredTime: string;
  note: string;
  studentName: string;
  status: 'pending' | 'approved';
}

interface DashboardCoachProps {
  onNavigate: (screen: string) => void;
  makeupRequests?: MakeupRequest[];
  onApproveMakeupRequest?: (id: string, approvedDate: string) => void;
}

export function DashboardCoach({ onNavigate, makeupRequests = [], onApproveMakeupRequest }: DashboardCoachProps) {
  const [approvedDates, setApprovedDates] = useState<Record<string, string>>({});

  const pendingRequests = makeupRequests.filter(r => r.status === 'pending');

  const handleDateChange = (id: string, value: string) => {
    setApprovedDates(prev => ({ ...prev, [id]: value }));
  };

  const handleApprove = (id: string, defaultDate: string) => {
    const finalDate = approvedDates[id] || defaultDate;
    if (onApproveMakeupRequest) {
      onApproveMakeupRequest(id, finalDate);
    }
  };

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1">
            <h1 className="text-xl font-medium mb-1">Xin chào, Coach Nam</h1>
            <p className="text-sm opacity-90">Hôm nay: 29/04/2026</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">N</span>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-6">
        {/* Metric Cards 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card border border-primary/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary mb-1">3</p>
            <p className="text-sm text-muted-foreground">Lớp hôm nay</p>
          </div>

          <div className="bg-card border border-success/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-success/10 p-2 rounded-lg">
                <Users className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-3xl font-bold text-success mb-1">18</p>
            <p className="text-sm text-muted-foreground">Học viên cần điểm danh</p>
          </div>

          <div className="bg-card border border-warning/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-warning/10 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-3xl font-bold text-warning mb-1">
              {5 + pendingRequests.length}
            </p>
            <p className="text-sm text-muted-foreground">Yêu cầu cần xử lý</p>
          </div>

          <div className="bg-card border border-accent/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-accent/10 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-3xl font-bold text-accent mb-1">86</p>
            <p className="text-sm text-muted-foreground">Lượt học tháng</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-base font-medium mb-3">Thao tác nhanh</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => onNavigate('attendance-today')}
              className="bg-primary text-primary-foreground rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white/20 p-2.5 rounded-full">
                  <ClipboardCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-center leading-tight">Điểm danh hôm nay</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('students')}
              className="bg-success text-success-foreground rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white/20 p-2.5 rounded-full">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-center leading-tight">Xem học viên</span>
              </div>
            </button>

            <button
              onClick={() => onNavigate('class-list')}
              className="bg-accent text-accent-foreground rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white/20 p-2.5 rounded-full">
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium text-center leading-tight">Lớp hôm nay</span>
              </div>
            </button>
          </div>
        </div>

        {/* Section: Duyệt học bù */}
        <div>
          <h2 className="text-base font-bold text-teal-900 mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-700" />
            Yêu cầu duyệt học bù ({pendingRequests.length})
          </h2>
          {pendingRequests.length === 0 ? (
            <div className="bg-gray-50 border border-gray-100 rounded-2xl py-6 px-4 text-center text-xs text-gray-500">
              Không có yêu cầu học bù nào đang chờ duyệt.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(req => {
                const tempDate = approvedDates[req.id] || req.desiredDate;
                return (
                  <div key={req.id} className="bg-white border border-teal-100 rounded-2xl p-4 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-teal-50 text-teal-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                          Lớp: {req.courseName}
                        </span>
                        <h4 className="text-sm font-black text-gray-800 mt-1">
                          Học viên: {req.studentName}
                        </h4>
                      </div>
                      <span className="text-[10px] text-red-500 font-extrabold bg-red-50 px-2 py-0.5 rounded-md">
                        Vắng ngày: {req.missedDate}
                      </span>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-xl space-y-1.5 text-xs text-gray-600">
                      <p className="font-bold flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-teal-600" />
                        Lịch mong muốn: <span className="text-teal-800">{req.desiredDate} ({req.desiredTime})</span>
                      </p>
                      {req.note && (
                        <p className="italic text-gray-400">
                          Lời nhắn: "{req.note}"
                        </p>
                      )}
                    </div>

                    {/* Set official date input */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 whitespace-nowrap">Ngày bù chính thức:</span>
                      <input
                        type="date"
                        value={tempDate}
                        onChange={e => handleDateChange(req.id, e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold text-gray-700 focus:outline-none focus:border-primary flex-1"
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => handleApprove(req.id, req.desiredDate)}
                        className="flex-1 bg-teal-700 active:bg-teal-800 text-white py-2 rounded-xl text-xs font-bold shadow active:scale-95 transition-transform"
                      >
                        Phê Duyệt
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Today's Classes */}
        <div>
          <h2 className="text-base font-medium mb-3">Lớp học của bạn hôm nay</h2>
          <div className="space-y-3">
            {/* Class 1 - Completed */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Lớp Cơ bản A1</h3>
                  <p className="text-sm text-muted-foreground">07:00 - 08:30 • Sân 1</p>
                </div>
                <span className="bg-success/10 text-success text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Đã điểm danh
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">8/10 học viên</span>
                <button className="text-primary text-sm font-medium hover:underline">
                  Xem chi tiết
                </button>
              </div>
            </div>

            {/* Class 2 - Active */}
            <div className="bg-card border-2 border-primary rounded-xl p-4 shadow-lg">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Lớp Nâng cao B2</h3>
                  <p className="text-sm text-muted-foreground mb-2">09:00 - 10:30 • Sân 2</p>
                  <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    Đang diễn ra
                  </span>
                </div>
                <span className="bg-warning/10 text-warning text-xs px-3 py-1.5 rounded-full font-medium">
                  0/8 học viên
                </span>
              </div>
              <button
                onClick={() => onNavigate('attendance')}
                className="w-full mt-3 bg-primary text-primary-foreground py-3 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 font-medium"
              >
                <ClipboardCheck className="w-5 h-5" />
                Điểm danh ngay
              </button>
            </div>

            {/* Class 3 - Upcoming */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-medium mb-1">Lớp Cơ bản A2</h3>
                  <p className="text-sm text-muted-foreground">17:00 - 18:30 • Sân 1</p>
                </div>
                <span className="bg-muted text-muted-foreground text-xs px-3 py-1.5 rounded-full font-medium">
                  Chưa bắt đầu
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">10 học viên</span>
                <button className="text-primary text-sm font-medium hover:underline">
                  Xem danh sách
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Coach Tip */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-1 text-primary">Mẹo cho Coach</p>
              <p className="text-xs text-muted-foreground">
                Điểm danh ngay khi bắt đầu lớp để theo dõi chính xác số buổi học của học viên. Nhấn "Điểm danh ngay" để bắt đầu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
