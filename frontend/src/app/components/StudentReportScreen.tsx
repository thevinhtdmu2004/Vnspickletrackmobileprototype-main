import React, { useState } from 'react';
import {
  ArrowLeft, Search, Users, Calendar, CheckCircle, Clock,
  UserX, FileDown, ChevronDown, TrendingUp, BookOpen,
  XCircle, CalendarCheck
} from 'lucide-react';

interface StudentReportScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

interface AttendanceRecord {
  date: string;
  status: 'present' | 'late' | 'absent' | 'leave' | 'makeup';
  note?: string;
}

export function StudentReportScreen({ onBack, onNavigate }: StudentReportScreenProps) {
  const [selectedStudent, setSelectedStudent] = useState('Nguyễn Văn A');

  // Mock data
  const studentData = {
    name: 'Nguyễn Văn A',
    class: 'Beginner A',
    totalSessions: 12,
    attended: 5,
    remaining: 7,
  };

  const metrics = {
    present: 4,
    late: 1,
    makeup: 0,
    absent: 1,
    leave: 1,
    attendanceRate: 83,
  };

  const timeline: AttendanceRecord[] = [
    { date: '29/04/2026', status: 'present' },
    { date: '27/04/2026', status: 'late', note: 'Đến trễ 10 phút' },
    { date: '25/04/2026', status: 'leave', note: 'Xin nghỉ có phép' },
    { date: '23/04/2026', status: 'absent', note: 'Vắng không phép' },
    { date: '21/04/2026', status: 'present' },
    { date: '19/04/2026', status: 'present' },
    { date: '17/04/2026', status: 'present' },
  ];

  const handleExportReport = () => {
    console.log('Export student history');
    // Navigate to export screen or trigger download
  };

  const getStatusConfig = (status: AttendanceRecord['status']) => {
    switch (status) {
      case 'present':
        return {
          label: 'Có mặt',
          icon: CheckCircle,
          color: '#2A9D8F',
          bgColor: 'rgba(42,157,143,0.1)',
          borderColor: 'rgba(42,157,143,0.2)',
        };
      case 'late':
        return {
          label: 'Trễ',
          icon: Clock,
          color: '#E9C46A',
          bgColor: 'rgba(233,196,106,0.1)',
          borderColor: 'rgba(233,196,106,0.2)',
        };
      case 'absent':
        return {
          label: 'Vắng',
          icon: XCircle,
          color: '#E76F51',
          bgColor: 'rgba(231,111,81,0.1)',
          borderColor: 'rgba(231,111,81,0.2)',
        };
      case 'leave':
        return {
          label: 'Nghỉ phép',
          icon: Calendar,
          color: '#6B7280',
          bgColor: 'rgba(107,116,128,0.1)',
          borderColor: 'rgba(107,116,128,0.2)',
        };
      case 'makeup':
        return {
          label: 'Học bù',
          icon: CalendarCheck,
          color: '#815AD5',
          bgColor: 'rgba(129,90,213,0.1)',
          borderColor: 'rgba(129,90,213,0.2)',
        };
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">
      {/* Header */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
      >
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-14 -right-3 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />

        <div className="px-4 pt-10 pb-6">
          {/* Title row */}
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1">
              <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
                Báo cáo học viên
              </h1>
            </div>
          </div>

          {/* Student Selector */}
          <div className="relative">
            <button className="w-full h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-between px-4 active:bg-white/15 transition-colors">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-white/80" />
                <span className="text-white text-sm font-semibold">
                  {selectedStudent}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {/* Student Summary Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {studentData.name}
              </h2>
              <div className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#815AD5]" />
                <span className="text-sm text-gray-600">{studentData.class}</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E7C7B] to-[#2A9D8F] flex items-center justify-center shadow-lg shadow-[#0E7C7B]/20">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#0E7C7B]/5 to-[#0E7C7B]/10 border border-[#0E7C7B]/15">
              <p className="text-2xl font-bold text-[#0E7C7B] mb-0.5">
                {studentData.totalSessions}
              </p>
              <p className="text-xs text-gray-600">Tổng</p>
            </div>

            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#2A9D8F]/5 to-[#2A9D8F]/10 border border-[#2A9D8F]/15">
              <p className="text-2xl font-bold text-[#2A9D8F] mb-0.5">
                {studentData.attended}
              </p>
              <p className="text-xs text-gray-600">Đã học</p>
            </div>

            <div className="text-center p-3 rounded-xl bg-gradient-to-br from-[#F4A261]/5 to-[#F4A261]/10 border border-[#F4A261]/15">
              <p className="text-2xl font-bold text-[#F4A261] mb-0.5">
                {studentData.remaining}
              </p>
              <p className="text-xs text-gray-600">Còn lại</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Tiến độ học tập</span>
              <span className="text-xs font-bold text-[#2A9D8F]">
                {Math.round((studentData.attended / studentData.totalSessions) * 100)}%
              </span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F]"
                style={{ width: `${(studentData.attended / studentData.totalSessions) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          Thống kê điểm danh
        </h3>

        {/* Attendance Rate */}
        <div className="bg-gradient-to-br from-[#2A9D8F]/10 to-[#0E7C7B]/10 rounded-xl p-4 shadow-sm border border-[#2A9D8F]/20 mb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#2A9D8F]/15 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#2A9D8F]" />
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-0.5">Tỷ lệ tham gia</p>
                <p className="text-2xl font-bold text-[#2A9D8F]">
                  {metrics.attendanceRate}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">
                {metrics.present + metrics.late}/{studentData.attended} buổi
              </p>
            </div>
          </div>
        </div>

        {/* Detailed Stats Grid */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 mb-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Present */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#2A9D8F]/5 border border-[#2A9D8F]/10">
              <div className="w-10 h-10 rounded-xl bg-[#2A9D8F]/15 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#2A9D8F]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#2A9D8F]">{metrics.present}</p>
                <p className="text-xs text-gray-600">Có mặt</p>
              </div>
            </div>

            {/* Late */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E9C46A]/5 border border-[#E9C46A]/10">
              <div className="w-10 h-10 rounded-xl bg-[#E9C46A]/15 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#E9C46A]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#E9C46A]">{metrics.late}</p>
                <p className="text-xs text-gray-600">Trễ</p>
              </div>
            </div>

            {/* Makeup */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#815AD5]/5 border border-[#815AD5]/10">
              <div className="w-10 h-10 rounded-xl bg-[#815AD5]/15 flex items-center justify-center">
                <CalendarCheck className="w-5 h-5 text-[#815AD5]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#815AD5]">{metrics.makeup}</p>
                <p className="text-xs text-gray-600">Học bù</p>
              </div>
            </div>

            {/* Absent */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E76F51]/5 border border-[#E76F51]/10">
              <div className="w-10 h-10 rounded-xl bg-[#E76F51]/15 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-[#E76F51]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#E76F51]">{metrics.absent}</p>
                <p className="text-xs text-gray-600">Vắng</p>
              </div>
            </div>

            {/* Leave - Span 2 columns */}
            <div className="col-span-2 flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-700">{metrics.leave}</p>
                <p className="text-xs text-gray-600">Nghỉ phép</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">
            Lịch sử điểm danh
          </h3>
          <span className="text-xs text-gray-500">
            {timeline.length} buổi gần nhất
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          {timeline.map((record, index) => {
            const config = getStatusConfig(record.status);
            const Icon = config.icon;

            return (
              <div
                key={index}
                className="border-b border-gray-100 last:border-0"
              >
                <div className="p-4 flex items-center gap-3">
                  {/* Timeline Indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: config.bgColor,
                        border: `2px solid ${config.borderColor}`,
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ color: config.color }} />
                    </div>
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-900">
                          {record.date}
                        </span>
                      </div>
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg"
                        style={{
                          background: config.bgColor,
                          color: config.color,
                        }}
                      >
                        {config.label}
                      </span>
                    </div>
                    {record.note && (
                      <p className="text-xs text-gray-500 mt-1">
                        {record.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportReport}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-[#0E7C7B] to-[#2A9D8F] 
            text-white font-semibold shadow-lg shadow-[#0E7C7B]/25
            hover:shadow-xl hover:shadow-[#0E7C7B]/30 active:scale-[0.98] transition-all
            flex items-center justify-center gap-2"
        >
          <FileDown className="w-5 h-5" />
          Xuất lịch sử học viên
        </button>
      </div>
    </div>
  );
}
