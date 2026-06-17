import React, { useState } from 'react';
import { ArrowLeft, Clock, User, Calendar, CheckCircle2, AlertCircle, BookOpen, MessageSquare, Info } from 'lucide-react';

interface MemberMakeupRegisterScreenProps {
  onBack: () => void;
  onSubmitMakeupRequest?: (request: {
    id: string;
    courseName: string;
    missedDate: string;
    desiredDate: string;
    desiredTime: string;
    note: string;
    studentName: string;
  }) => void;
}

interface MissedSession {
  id: string;
  courseName: string;
  date: string;
  status: string;
}

export const MemberMakeupRegisterScreen: React.FC<MemberMakeupRegisterScreenProps> = ({ onBack, onSubmitMakeupRequest }) => {
  const [selectedCourse, setSelectedCourse] = useState<string>('Beginner A');
  const [selectedMissedSession, setSelectedMissedSession] = useState<string | null>(null);
  
  // New input fields for student desired makeup session
  const [desiredDate, setDesiredDate] = useState<string>('2026-05-20');
  const [desiredTime, setDesiredTime] = useState<string>('18:00 – 19:30');
  const [studentNote, setStudentNote] = useState<string>('');
  
  const [makeupAbsencesCount, setMakeupAbsencesCount] = useState<number>(1);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const courseList = [
    { name: 'Beginner A', coach: 'Coach Nam' },
    { name: 'Beginner B', coach: 'Coach Linh' }
  ];

  const currentCourseInfo = courseList.find(c => c.name === selectedCourse) || courseList[0];
  const currentCoach = currentCourseInfo.coach;

  const allMissedSessions: MissedSession[] = [
    { id: 'm1', courseName: 'Beginner A', date: '15/05/2026', status: 'Vắng' },
    { id: 'm2', courseName: 'Beginner B', date: '18/05/2026', status: 'Vắng' }
  ];

  const missedSessions = allMissedSessions.filter(s => s.courseName === selectedCourse);
  const isBlockedByPenalty = makeupAbsencesCount >= 2;
  const canRegister = missedSessions.length > 0 && !isBlockedByPenalty;

  const getPastMakeupHistory = (count: number) => {
    const base = [
      { id: 'pm1', date: '05/05/2026', courseName: 'Beginner A', status: 'Đã học', coach: 'Coach Nam' }
    ];
    if (count >= 1) {
      base.push({ id: 'pm2', date: '12/05/2026', courseName: 'Beginner A', status: 'Vắng học bù', coach: 'Coach Nam' });
    }
    if (count >= 2) {
      base.push({ id: 'pm3', date: '19/05/2026', courseName: 'Beginner A', status: 'Vắng học bù', coach: 'Coach Nam' });
    }
    return base;
  };

  const handleCourseChange = (courseName: string) => {
    setSelectedCourse(courseName);
    setSelectedMissedSession(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMissedSession || !desiredDate) return;

    const missedSessionObj = missedSessions.find(s => s.id === selectedMissedSession);
    
    if (onSubmitMakeupRequest) {
      onSubmitMakeupRequest({
        id: 'req_' + Date.now(),
        courseName: selectedCourse,
        missedDate: missedSessionObj?.date || '',
        desiredDate: desiredDate,
        desiredTime: desiredTime,
        note: studentNote,
        studentName: 'Nguyễn Văn A'
      });
    }

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col h-screen items-center justify-center px-8" style={{ background: '#F0F4F5' }}>
        <div
          className="flex items-center justify-center rounded-full mb-6"
          style={{
            width: 96,
            height: 96,
            background: 'rgba(42,157,143,0.12)',
            border: '2.5px solid rgba(42,157,143,0.22)',
            boxShadow: '0 8px 20px rgba(42,157,143,0.15)',
          }}
        >
          <div className="flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: 'rgba(42,157,143,0.2)' }}>
            <CheckCircle2 style={{ width: 34, height: 34, color: '#2A9D8F' }} />
          </div>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0E7C7B', textAlign: 'center' }}>Đã gửi yêu cầu!</h2>
        <p style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', marginTop: 8, lineHeight: 1.6, maxWidth: 280 }}>
          Yêu cầu đăng ký học bù của bạn đã được chuyển cho <strong>{currentCoach}</strong> phê duyệt. Thông báo kết quả sẽ được gửi sau khi HLV xác nhận lịch.
        </p>
        <button
          onClick={onBack}
          className="mt-8 w-full max-w-[200px] py-3.5 rounded-2xl active:scale-95 transition-all text-center"
          style={{
            background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
            boxShadow: '0 8px 24px rgba(14,124,123,0.35)',
          }}
        >
          <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Đóng</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#F0F4F5]">
      {/* Header */}
      <div className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#032C2C 0%,#0E7C7B 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top: -20, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="flex items-center gap-3 px-4 pt-12 pb-5">
          <button onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            style={{ background: 'rgba(255,255,255,0.18)' }}>
            <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
          </button>
          <div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>ĐĂNG KÝ HỌC BÙ</p>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>Xin buổi học bù</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-10 space-y-6 mt-4">
        {/* UAT Simulator */}
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-amber-900">Bảng mô phỏng UAT (Trạng thái học viên)</p>
              <p className="text-[10px] text-amber-700">Thay đổi số buổi vắng học bù để test tự động khóa học bù</p>
            </div>
            <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-2 py-0.5 rounded-lg">Demo</span>
          </div>
          <div className="flex gap-2">
            {[0, 1, 2].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setMakeupAbsencesCount(num);
                  setSelectedMissedSession(null);
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                  makeupAbsencesCount === num
                    ? 'bg-amber-700 border-amber-700 text-white shadow-sm'
                    : 'bg-white border-amber-200 text-amber-800 hover:bg-amber-100/50 shadow-sm'
                }`}
              >
                {num} lần vắng {num >= 2 ? '❌ (Khóa)' : '✅ (Mở)'}
              </button>
            ))}
          </div>
        </div>

        {/* Course Select */}
        <section className="space-y-2">
          <h2 className="text-[13px] font-black text-[#1F2933] uppercase tracking-wider flex items-center gap-2">
            <BookOpen size={14} className="text-[#0E7C7B]" />
            Chọn khóa học hiện tại
          </h2>
          <div className="flex gap-2">
            {courseList.map(c => (
              <button
                key={c.name}
                onClick={() => handleCourseChange(c.name)}
                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold border-2 transition-all ${
                  selectedCourse === c.name
                    ? 'bg-[#E6F2F2] border-[#0E7C7B] text-[#0E7C7B]'
                    : 'bg-white border-transparent text-gray-500 shadow-sm'
                }`}
              >
                {c.name}
                <span className="block text-[10px] opacity-80 font-normal mt-0.5">{c.coach}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Status Card */}
        <div
          className="p-5 rounded-[28px] text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #032C2C 0%, #0E7C7B 100%)', boxShadow: '0 4px 14px rgba(14,124,123,0.15)' }}
        >
          <div className="relative z-10">
            <p className="text-[10px] font-bold opacity-80 uppercase tracking-wider mb-1">Lớp học: {selectedCourse}</p>
            <p className="text-base font-black mb-1">HLV giảng dạy: {currentCoach}</p>
            
            <div className="space-y-1 mb-3">
              <p className="text-xs font-bold opacity-90">Vắng chính khóa: <span className="font-extrabold">{missedSessions.length} buổi</span></p>
              <p className="text-xs font-bold opacity-90">Vắng khi học bù: <span className={makeupAbsencesCount >= 2 ? "font-extrabold text-red-300" : "font-extrabold text-yellow-300"}>{makeupAbsencesCount} / 2 buổi</span></p>
            </div>

            <div className="flex items-center gap-2 bg-white/10 py-1.5 px-3 rounded-xl w-fit">
              {isBlockedByPenalty ? (
                <>
                  <AlertCircle size={14} className="text-red-300" />
                  <span className="text-xs font-bold italic text-red-300">Quyền đăng ký học bù bị khóa</span>
                </>
              ) : canRegister ? (
                <>
                  <CheckCircle2 size={14} className="text-white" />
                  <span className="text-xs font-bold italic">Có thể gửi yêu cầu học bù đến {currentCoach}</span>
                </>
              ) : (
                <>
                  <AlertCircle size={14} className="text-orange-300" />
                  <span className="text-xs font-bold italic text-orange-300">Chưa có buổi vắng cần bù</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Input Form */}
        {isBlockedByPenalty ? (
          <div className="bg-red-50 border border-red-100 p-5 rounded-3xl text-center space-y-2.5">
            <AlertCircle className="mx-auto text-red-500" size={32} />
            <p className="text-sm font-bold text-red-950">Quyền tự đăng ký học bù đã bị khóa</p>
            <p className="text-xs text-red-800 leading-relaxed font-medium">
              Bạn đã vắng mặt không phép quá **{makeupAbsencesCount} buổi** khi đi học bù. Theo quy định, quyền tự chọn lịch đã bị khóa. Vui lòng liên hệ Coach để được xếp bù bằng tay.
            </p>
          </div>
        ) : (
          <>
            {missedSessions.length > 0 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* 1. Chọn buổi vắng */}
                <div className="space-y-2">
                  <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} className="text-[#0E7C7B]" />
                    1. Chọn buổi vắng cần bù
                  </h2>
                  <div className="space-y-2">
                    {missedSessions.map(session => (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => setSelectedMissedSession(session.id)}
                        className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                          selectedMissedSession === session.id
                            ? 'border-[#0E7C7B] bg-[#E6F2F2]'
                            : 'border-white bg-white'
                        }`}
                        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedMissedSession === session.id ? 'bg-[#0E7C7B] text-white' : 'bg-gray-100 text-gray-500'}`}>
                            <Calendar size={18} />
                          </div>
                          <div className="text-left">
                            <p className="text-xs font-bold text-gray-800">Buổi học ngày {session.date}</p>
                            <p className="text-[10px] text-red-500 font-bold">Lớp: {session.courseName}</p>
                          </div>
                        </div>
                        {selectedMissedSession === session.id && <CheckCircle2 size={18} className="text-[#0E7C7B]" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Ngày & ca mong muốn */}
                {selectedMissedSession && (
                  <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-teal-900 uppercase tracking-wider">
                      2. Thông tin lịch học bù mong muốn
                    </h3>

                    {/* Chọn ngày mong muốn */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Ngày mong muốn học bù</label>
                      <input
                        type="date"
                        value={desiredDate}
                        onChange={e => setDesiredDate(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#0E7C7B]"
                        required
                      />
                    </div>

                    {/* Chọn ca mong muốn */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Ca học mong muốn</label>
                      <select
                        value={desiredTime}
                        onChange={e => setDesiredTime(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#0E7C7B]"
                      >
                        <option value="07:00 – 08:30">Ca 1: 07:00 – 08:30 (Sáng)</option>
                        <option value="09:00 – 10:30">Ca 2: 09:00 – 10:30 (Sáng)</option>
                        <option value="18:00 – 19:30">Ca 3: 18:00 – 19:30 (Tối)</option>
                        <option value="19:30 – 21:00">Ca 4: 19:30 – 21:00 (Tối)</option>
                      </select>
                    </div>

                    {/* Ghi chú */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-500">Lời nhắn gửi Coach (Tùy chọn)</label>
                      <textarea
                        value={studentNote}
                        onChange={e => setStudentNote(e.target.value)}
                        placeholder="Ví dụ: Em chỉ rảnh ca tối của ngày này..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-700 focus:outline-none focus:border-[#0E7C7B] min-h-[70px]"
                      />
                    </div>

                    <div className="flex gap-2.5 bg-teal-50/50 p-3 rounded-xl border border-teal-100/50">
                      <Info className="text-[#0E7C7B] shrink-0" size={16} />
                      <p className="text-[10px] text-teal-800 leading-normal font-semibold">
                        Lịch mong muốn của bạn sẽ được chuyển đến HLV duyệt. HLV sẽ căn cứ vào tình hình thực tế của sân để xác nhận hoặc đề xuất ngày bù chính thức.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 active:scale-98 transition-all text-white font-bold text-sm rounded-2xl shadow-md"
                    >
                      Gửi Yêu Cầu Học Bù
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div className="bg-white p-6 rounded-3xl text-center shadow-sm">
                <CheckCircle2 className="mx-auto text-teal-500 mb-2" size={28} />
                <p className="text-sm font-bold text-gray-800">Không có buổi vắng</p>
                <p className="text-xs text-gray-500 mt-1">Lớp Beginner A của bạn hiện đã tham gia đầy đủ, không có buổi vắng nào cần bù.</p>
              </div>
            )}
          </>
        )}

        {/* Lịch sử */}
        <section className="space-y-3">
          <h2 className="text-[13px] font-black text-gray-800 uppercase tracking-wider">
            Lịch sử học bù đã đăng ký
          </h2>
          <div className="space-y-2">
            {getPastMakeupHistory(makeupAbsencesCount).map(hist => (
              <div key={hist.id} className="bg-white p-4 rounded-3xl flex items-center justify-between border border-gray-100 shadow-sm">
                <div>
                  <p className="text-xs font-bold text-gray-800">Buổi bù ngày {hist.date}</p>
                  <p className="text-[10px] text-gray-400">HLV: {hist.coach} · {hist.courseName}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold ${
                  hist.status === 'Đã học'
                    ? 'bg-teal-50 text-teal-700'
                    : 'bg-red-50 text-red-600'
                }`}>
                  {hist.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};