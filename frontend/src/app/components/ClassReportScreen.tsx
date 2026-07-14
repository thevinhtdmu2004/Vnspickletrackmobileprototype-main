import React, { useState } from 'react';
import {
  ArrowLeft, Calendar, Users, MapPin, User, TrendingUp,
  CheckCircle, Clock, UserX, FileDown, ChevronDown,
  Trophy, Medal, Award
} from 'lucide-react';

interface ClassReportScreenProps {
  onBack: () => void;
  onNavigate?: (screen: string) => void;
}

interface StudentRanking {
  rank: number;
  name: string;
  attended: number;
  total: number;
  percentage: number;
}

export function ClassReportScreen({ onBack, onNavigate }: ClassReportScreenProps) {
  const [selectedMonth, setSelectedMonth] = useState('04/2026');
  const [selectedClass, setSelectedClass] = useState('Beginner A');

  // Mock data
  const classData = {
    name: 'Beginner A',
    coach: 'Coach Nam',
    court: 'Sân 1',
    totalStudents: 8,
    totalSessions: 12,
  };

  const metrics = {
    totalAttendances: 38,
    present: 30,
    late: 4,
    absent: 3,
    leave: 1,
    attendanceRate: 89,
  };

  const rankings: StudentRanking[] = [
    { rank: 1, name: 'Nguyễn Văn A', attended: 8, total: 8, percentage: 100 },
    { rank: 2, name: 'Trần Thị B', attended: 7, total: 8, percentage: 88 },
    { rank: 3, name: 'Lê Văn C', attended: 5, total: 8, percentage: 63 },
  ];

  const handleExportReport = () => {
    console.log('Export class report');
    // Navigate to export screen or trigger download
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
                Báo cáo theo lớp
              </h1>
            </div>
          </div>

          {/* Month Filter */}
          <div className="relative">
            <button className="w-full h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-between px-4 active:bg-white/15 transition-colors">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white/80" />
                <span className="text-white text-sm font-semibold">
                  Tháng {selectedMonth}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24">
        {/* Class Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-700 mb-2">
            Chọn lớp học
          </label>
          <button className="w-full h-12 rounded-xl bg-white border-2 border-gray-200 flex items-center justify-between px-4 active:border-[#0E7C7B] transition-colors shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0E7C7B]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#0E7C7B]" />
              </div>
              <span className="text-sm font-bold text-gray-900">
                {selectedClass}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">
                {classData.name}
              </h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2A9D8F]" />
                <span className="text-xs text-gray-600">Đang hoạt động</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0E7C7B] to-[#2A9D8F] flex items-center justify-center shadow-lg shadow-[#0E7C7B]/20">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#815AD5]/10 flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-[#815AD5]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Coach</p>
                <p className="text-sm font-bold text-gray-900">{classData.coach}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#F4A261]/10 flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-[#F4A261]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Địa điểm</p>
                <p className="text-sm font-bold text-gray-900">{classData.court}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#2A9D8F]/10 flex items-center justify-center">
                <Users className="w-3.5 h-3.5 text-[#2A9D8F]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Học viên</p>
                <p className="text-sm font-bold text-gray-900">{classData.totalStudents} người</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E9C46A]/10 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-[#E9C46A]" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Buổi học</p>
                <p className="text-sm font-bold text-gray-900">{classData.totalSessions} buổi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <h3 className="text-sm font-bold text-gray-900 mb-3">
          Thống kê điểm danh
        </h3>

        {/* Total Attendances & Rate */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#0E7C7B]/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-[#0E7C7B]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-0.5">
              {metrics.totalAttendances}
            </p>
            <p className="text-xs text-gray-600">Tổng lượt học</p>
          </div>

          <div className="bg-gradient-to-br from-[#2A9D8F]/10 to-[#0E7C7B]/10 rounded-xl p-4 shadow-sm border border-[#2A9D8F]/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-[#2A9D8F]/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#2A9D8F]" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2A9D8F] mb-0.5">
              {metrics.attendanceRate}%
            </p>
            <p className="text-xs text-gray-600">Tỷ lệ tham gia</p>
          </div>
        </div>

        {/* Detailed Stats */}
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

            {/* Absent */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#E76F51]/5 border border-[#E76F51]/10">
              <div className="w-10 h-10 rounded-xl bg-[#E76F51]/15 flex items-center justify-center">
                <UserX className="w-5 h-5 text-[#E76F51]" />
              </div>
              <div>
                <p className="text-xl font-bold text-[#E76F51]">{metrics.absent}</p>
                <p className="text-xs text-gray-600">Vắng</p>
              </div>
            </div>

            {/* Leave */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200">
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

        {/* Student Ranking */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-900">
            Xếp hạng học viên
          </h3>
          <span className="text-xs text-gray-500">
            Top {rankings.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-4">
          {rankings.map((student, index) => {
            const isFirst = student.rank === 1;
            const isSecond = student.rank === 2;
            const isThird = student.rank === 3;

            let rankIcon = null;
            let rankColor = '';

            if (isFirst) {
              rankIcon = <Trophy className="w-5 h-5" />;
              rankColor = '#F4A261';
            } else if (isSecond) {
              rankIcon = <Medal className="w-5 h-5" />;
              rankColor = '#6B7280';
            } else if (isThird) {
              rankIcon = <Award className="w-5 h-5" />;
              rankColor = '#CD7F32';
            }

            return (
              <div
                key={student.rank}
                className="flex items-center gap-3 p-4 border-b border-gray-100 last:border-0"
                style={
                  isFirst
                    ? { background: 'linear-gradient(to right, rgba(244,162,97,0.08), transparent)' }
                    : {}
                }
              >
                {/* Rank Badge */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: rankColor ? `${rankColor}15` : 'rgba(0,0,0,0.05)',
                    color: rankColor || '#6B7280',
                  }}
                >
                  {rankIcon || (
                    <span className="text-sm font-bold">{student.rank}</span>
                  )}
                </div>

                {/* Student Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 mb-0.5">
                    {student.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {student.attended}/{student.total} buổi
                  </p>
                </div>

                {/* Percentage Badge */}
                <div
                  className="px-3 py-1.5 rounded-lg flex-shrink-0"
                  style={{
                    background:
                      student.percentage >= 90
                        ? 'rgba(42,157,143,0.12)'
                        : student.percentage >= 70
                        ? 'rgba(233,196,106,0.12)'
                        : 'rgba(231,111,81,0.12)',
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{
                      color:
                        student.percentage >= 90
                          ? '#2A9D8F'
                          : student.percentage >= 70
                          ? '#E9C46A'
                          : '#E76F51',
                    }}
                  >
                    {student.percentage}%
                  </span>
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
          Xuất báo cáo lớp
        </button>
      </div>
    </div>
  );
}
