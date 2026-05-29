import React, { useState } from 'react';
import { ArrowLeft, Clock, MapPin, User, ChevronRight, CheckCircle2, AlertCircle, Calendar, Info, BookOpen } from 'lucide-react';

interface MemberMakeupRegisterScreenProps {
    onBack: () => void;
}

interface MakeupSession {
    id: string;
    courseName: string;
    date: string; // YYYY-MM-DD format
    dayLabel: string; // 02, 05, etc.
    dayOfWeek: string;
    month: string;
    time: string;
    location: string;
    coach: string;
    slots: number;
    isFull?: boolean;
}

interface MissedSession {
    id: string;
    courseName: string;
    date: string;
    status: string;
}

export const MemberMakeupRegisterScreen: React.FC<MemberMakeupRegisterScreenProps> = ({ onBack }) => {
    // State quản lý khóa học được chọn
    const [selectedCourse, setSelectedCourse] = useState<string>('Beginner A');
    const [selectedMissedSession, setSelectedMissedSession] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('2026-05-02');
    const [selectedMakeupSession, setSelectedMakeupSession] = useState<string | null>(null);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

    // Danh sách khóa học học viên đăng ký
    const courseList = [
        { name: 'Beginner A', coach: 'Coach Nam' },
        { name: 'Beginner B', coach: 'Coach Linh' }
    ];

    const currentCourseInfo = courseList.find(c => c.name === selectedCourse) || courseList[0];
    const currentCoach = currentCourseInfo.coach;

    // Danh sách các buổi vắng theo từng khóa học
    const allMissedSessions: MissedSession[] = [
        { id: 'm1', courseName: 'Beginner A', date: '15/05/2026', status: 'Vắng' },
        { id: 'm2', courseName: 'Beginner B', date: '18/05/2026', status: 'Vắng' }
    ];

    // Lọc buổi vắng của khóa học đang chọn
    const missedSessions = allMissedSessions.filter(s => s.courseName === selectedCourse);

    // Tất cả các buổi học bù do trung tâm sắp xếp (Các ngày học bù sau ngày vắng 15/05/2026 và 18/05/2026)
    const allAvailableSessions: MakeupSession[] = [
        {
            id: '1',
            courseName: "Beginner A",
            date: '2026-05-20',
            dayLabel: '20',
            dayOfWeek: 'Thứ 4',
            month: 'Th.5',
            time: '18:00 – 19:30',
            location: 'Sân 1',
            coach: 'Coach Nam',
            slots: 3
        },
        {
            id: '2',
            courseName: "Beginner A",
            date: '2026-05-22',
            dayLabel: '22',
            dayOfWeek: 'Thứ 6',
            month: 'Th.5',
            time: '19:00 – 20:30',
            location: 'Sân 2',
            coach: 'Coach Hùng', // Giáo viên khác, sẽ bị lọc bỏ
            slots: 1
        },
        {
            id: '3',
            courseName: "Beginner A",
            date: '2026-05-23',
            dayLabel: '23',
            dayOfWeek: 'Thứ 7',
            month: 'Th.5',
            time: '18:00 – 19:30',
            location: 'Sân 1',
            coach: 'Coach Nam',
            slots: 0,
            isFull: true
        },
        {
            id: '4',
            courseName: "Beginner A",
            date: '2026-05-27',
            dayLabel: '27',
            dayOfWeek: 'Thứ 4',
            month: 'Th.5',
            time: '18:00 – 19:30',
            location: 'Sân 1',
            coach: 'Coach Nam',
            slots: 2
        },
        {
            id: '5',
            courseName: "Beginner B",
            date: '2026-05-24',
            dayLabel: '24',
            dayOfWeek: 'CN',
            month: 'Th.5',
            time: '17:00 – 18:30',
            location: 'Sân 1',
            coach: 'Coach Linh',
            slots: 1
        },
        {
            id: '6',
            courseName: "Beginner B",
            date: '2026-05-31',
            dayLabel: '31',
            dayOfWeek: 'CN',
            month: 'Th.5',
            time: '17:00 – 18:30',
            location: 'Sân 1',
            coach: 'Coach Linh',
            slots: 2
        }
    ];

    // Lọc lịch học bù theo giảng viên của khóa học đang chọn (Đúng thầy đúng khóa)
    const coachSessions = allAvailableSessions.filter(session => session.coach === currentCoach);

    // Tìm thông tin buổi vắng đang được chọn để lọc ngày học bù phải SAU ngày vắng đó
    const selectedMissedSessionObj = missedSessions.find(s => s.id === selectedMissedSession);

    // Hàm chuyển đổi 'DD/MM/YYYY' sang 'YYYY-MM-DD' để so sánh ngày chuẩn xác
    const convertDateToISO = (dateStr: string) => {
        const parts = dateStr.split('/');
        if (parts.length === 3) {
            return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return '';
    };

    const missedDateISO = selectedMissedSessionObj ? convertDateToISO(selectedMissedSessionObj.date) : '';

    // Lọc các buổi học bù có ngày diễn ra sau ngày vắng đã chọn
    const validMakeupSessions = coachSessions.filter(session => {
        if (!missedDateISO) return true; // Nếu chưa chọn buổi vắng, tạm thời hiển thị tất cả
        return session.date > missedDateISO;
    });

    // Lọc tiếp theo ngày học bù được học viên click chọn trên Lịch Selector
    const filteredSessions = validMakeupSessions.filter(session => session.date === selectedDate);

    // Danh sách các ngày học bù khả dụng (và hợp lệ sau ngày vắng) để hiện trên Calendar Selector
    const uniqueDates = Array.from(new Set(validMakeupSessions.map(s => s.date))).sort();

    const canRegister = missedSessions.length > 0 && missedSessions.length < 2;

    const handleCourseChange = (courseName: string) => {
        setSelectedCourse(courseName);
        setSelectedMissedSession(null);
        setSelectedMakeupSession(null);
        setSelectedDate('');
    };

    const handleSelectMissedSession = (sessionId: string) => {
        setSelectedMissedSession(sessionId);
        setSelectedMakeupSession(null);

        // Tự động tìm ngày học bù hợp lệ đầu tiên sau ngày vắng này để gán làm mặc định
        const missedSession = missedSessions.find(s => s.id === sessionId);
        if (missedSession) {
            const isoMissed = convertDateToISO(missedSession.date);
            const firstValidSession = coachSessions.find(s => s.date > isoMissed);
            if (firstValidSession) {
                setSelectedDate(firstValidSession.date);
            } else {
                setSelectedDate('');
            }
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F7F9FA]">
            {/* Header */}
            <div className="flex-shrink-0 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg,#054A49 0%,#0E7C7B 100%)' }}>
                <div className="absolute pointer-events-none" style={{ top: -20, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div className="flex items-center gap-3 px-4 pt-12 pb-5">
                    <button onClick={onBack}
                        className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                        style={{ background: 'rgba(255,255,255,0.18)' }}>
                        <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
                    </button>
                    <div>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>ĐĂNG KÝ HỌC BÙ</p>
                        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>Chọn buổi học bù</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-6 mt-4">

                {/* Chọn Khóa Học */}
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
                                className={`flex-1 py-3 px-4 rounded-2xl text-sm font-bold border-2 transition-all ${selectedCourse === c.name
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

                {/* Tình trạng đăng ký */}
                <div
                    className="p-6 rounded-[32px] text-white relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #0E7C7B 0%, #166464 100%)' }}
                >
                    <div className="relative z-10">
                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-wider mb-1">Khóa học: {selectedCourse}</p>
                        <p className="text-lg font-black mb-1">Giảng viên: {currentCoach}</p>
                        <p className="text-sm font-bold opacity-90 mb-4">Số buổi vắng: {missedSessions.length} / 2</p>

                        <div className="flex items-center gap-2 bg-white/10 py-2 px-3 rounded-xl w-fit">
                            {canRegister ? (
                                <>
                                    <CheckCircle2 size={16} className="text-white" />
                                    <span className="text-sm font-bold italic">Có thể đăng ký bù lớp của {currentCoach}</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle size={16} className="text-orange-300" />
                                    <span className="text-sm font-bold italic text-orange-300">Không đủ điều kiện học bù</span>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
                        <User size={24} className="text-white opacity-80" />
                    </div>
                </div>

                {/* Warning if has missed sessions */}
                {missedSessions.length > 0 && (
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-2xl flex gap-3">
                        <AlertCircle className="text-orange-500 shrink-0" size={20} />
                        <div>
                            <p className="text-sm font-bold text-orange-800">Yêu cầu chọn buổi vắng</p>
                            <p className="text-xs text-orange-700 mt-0.5">Vui lòng chọn 1 buổi vắng bên dưới để đối chiếu trước khi đăng ký.</p>
                        </div>
                    </div>
                )}

                {/* Chọn buổi vắng để bù */}
                {missedSessions.length > 0 ? (
                    <section className="space-y-3">
                        <h2 className="text-[13px] font-black text-[#1F2933] uppercase tracking-wider flex items-center gap-2">
                            <Calendar size={14} className="text-[#0E7C7B]" />
                            1. Chọn buổi vắng cần bù
                        </h2>
                        <div className="space-y-2">
                            {missedSessions.map(session => (
                                <button
                                    key={session.id}
                                    onClick={() => {
                                        setSelectedMissedSession(session.id);
                                        setSelectedMakeupSession(null);
                                    }}
                                    className={`w-full p-4 rounded-2xl flex items-center justify-between border-2 transition-all ${selectedMissedSession === session.id
                                        ? 'border-[#0E7C7B] bg-[#E6F2F2]'
                                        : 'border-white bg-white'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMissedSession === session.id ? 'bg-[#0E7C7B] text-white' : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            <Calendar size={20} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-[#1F2933]">Buổi học ngày {session.date}</p>
                                            <p className="text-xs text-red-500 font-medium">Trạng thái: {session.status}</p>
                                        </div>
                                    </div>
                                    {selectedMissedSession === session.id && <CheckCircle2 size={20} className="text-[#0E7C7B]" />}
                                </button>
                            ))}
                        </div>
                    </section>
                ) : (
                    <div className="bg-white p-5 rounded-2xl text-center shadow-sm">
                        <CheckCircle2 className="mx-auto text-teal-500 mb-1.5" size={24} />
                        <p className="text-sm font-bold text-gray-800">Tuyệt vời!</p>
                        <p className="text-xs text-gray-500">Khóa học {selectedCourse} không có buổi vắng nào cần bù.</p>
                    </div>
                )}

                {/* Chọn ngày học bù (Calendar Selector) */}
                {missedSessions.length > 0 && uniqueDates.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-[13px] font-black text-[#1F2933] uppercase tracking-wider flex items-center gap-2">
                            <Calendar size={14} className="text-[#0E7C7B]" />
                            2. Chọn ngày đăng ký học bù (Lịch {currentCoach})
                        </h2>

                        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                            {uniqueDates.map(dateStr => {
                                const isSelected = selectedDate === dateStr;
                                const sessionOnDate = coachSessions.find(s => s.date === dateStr);
                                const isFull = sessionOnDate?.isFull;

                                return (
                                    <button
                                        key={dateStr}
                                        onClick={() => {
                                            setSelectedDate(dateStr);
                                            setSelectedMakeupSession(null);
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[70px] border-2 transition-all shrink-0 ${isSelected
                                            ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white'
                                            : isFull
                                                ? 'border-red-100 bg-red-50/50 text-red-400'
                                                : 'border-white bg-white text-gray-700'
                                            }`}
                                    >
                                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                                            {sessionOnDate?.dayOfWeek}
                                        </span>
                                        <span className="text-lg font-black leading-none my-0.5">
                                            {sessionOnDate?.dayLabel}
                                        </span>
                                        <span className={`text-[10px] font-bold ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                                            {sessionOnDate?.month}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase tracking-tighter mt-1 ${isSelected ? 'text-white/90' : isFull ? 'text-red-400' : 'text-[#0E7C7B]'
                                            }`}>
                                            {isFull ? 'Hết chỗ' : `${sessionOnDate?.slots} chỗ`}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>
                )}

                {/* Danh sách buổi học bù trong ngày đã chọn */}
                {missedSessions.length > 0 && (
                    <section className="space-y-3">
                        <h2 className="text-[13px] font-black text-[#1F2933] uppercase tracking-wider">
                            3. Lịch học bù khả dụng trong ngày
                        </h2>

                        <div className="space-y-3">
                            {filteredSessions.length > 0 ? (
                                filteredSessions.map(session => (
                                    <button
                                        key={session.id}
                                        disabled={session.isFull || !selectedMissedSession}
                                        onClick={() => setSelectedMakeupSession(session.id)}
                                        className={`w-full bg-white rounded-3xl p-4 flex items-center gap-4 border-2 transition-all relative ${session.isFull
                                            ? 'opacity-60 border-transparent grayscale'
                                            : selectedMakeupSession === session.id
                                                ? 'border-[#0E7C7B] bg-[#E6F2F2]'
                                                : 'border-transparent active:border-[#0E7C7B]'
                                            }`}
                                        style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
                                    >
                                        {/* Date Badge */}
                                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center shrink-0 ${session.isFull ? 'bg-red-50' : 'bg-[#E6F2F2]'
                                            }`}>
                                            <span className={`text-[10px] font-bold ${session.isFull ? 'text-red-400' : 'text-[#0E7C7B]'}`}>{session.dayOfWeek}</span>
                                            <span className={`text-2xl font-black leading-none my-0.5 ${session.isFull ? 'text-red-500' : 'text-[#0E7C7B]'}`}>{session.dayLabel}</span>
                                            <span className={`text-[10px] font-bold ${session.isFull ? 'text-red-400' : 'text-[#0E7C7B]'}`}>{session.month}</span>
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-left">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-black text-[#1F2933]">{session.courseName}</h3>
                                                {session.isFull && (
                                                    <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-500 text-[10px] font-bold">Đầy</span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 gap-y-1">
                                                <div className="flex items-center gap-1.5 text-[#6B7280] text-xs">
                                                    <Clock size={12} />
                                                    <span>{session.time}</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-[#6B7280] text-xs">
                                                        <MapPin size={12} />
                                                        <span className="font-bold text-[#1F2933]">{session.location} còn trống</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[#6B7280] text-xs">
                                                        <User size={12} />
                                                        <span className="font-bold text-[#0E7C7B]">{session.coach}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Slots */}
                                        <div className="text-center pr-2">
                                            <p className={`text-xl font-black ${session.isFull ? 'text-gray-300' : 'text-[#0E7C7B]'}`}>
                                                {session.slots}
                                            </p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">chỗ trống</p>
                                        </div>

                                        {selectedMakeupSession === session.id ? (
                                            <CheckCircle2 size={20} className="text-[#0E7C7B]" />
                                        ) : (
                                            <ChevronRight size={18} className="text-gray-300 ml-auto" />
                                        )}

                                        {/* Overlay if no missed session selected */}
                                        {!selectedMissedSession && !session.isFull && (
                                            <div className="absolute inset-0 bg-white/40 flex items-center justify-center rounded-3xl backdrop-blur-[1px]">
                                                <p className="text-[10px] font-bold text-[#0E7C7B] bg-white px-3 py-1 rounded-full border border-[#0E7C7B]/20 shadow-sm">
                                                    Chọn buổi vắng trước
                                                </p>
                                            </div>
                                        )}
                                    </button>
                                ))
                            ) : (
                                <div className="bg-white p-8 rounded-3xl text-center border border-dashed border-gray-200">
                                    <AlertCircle className="mx-auto text-gray-300 mb-2" size={32} />
                                    <p className="text-sm font-bold text-[#1F2933]">Không có lịch dạy bù nào</p>
                                    <p className="text-xs text-[#6B7280] mt-1">{currentCoach} không có lịch dạy bù nào vào ngày này.</p>
                                </div>
                            )}
                        </div>
                    </section>
                )}

                {/* Quy định */}
                <section className="space-y-3">
                    <h2 className="text-[13px] font-black text-[#1F2933] uppercase tracking-wider">
                        Quy định học bù
                    </h2>

                    <div className="space-y-3">
                        <div className="bg-white p-5 rounded-3xl flex gap-4 shadow-sm border border-gray-50">
                            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                                <AlertCircle size={20} className="text-red-500" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-[#1F2933] mb-0.5">Đến trễ quá nửa buổi</h4>
                                <p className="text-xs text-[#6B7280] leading-relaxed">
                                    Nếu đến trễ quá 45 phút, buổi học bù đó sẽ bị hủy và không được đăng ký lại.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-3xl flex gap-4 shadow-sm border border-gray-50">
                            <div className="w-10 h-10 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0 border border-teal-100">
                                <Info size={20} className="text-[#0E7C7B]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-[#1F2933] mb-0.5">Quy trình phê duyệt</h4>
                                <p className="text-xs text-[#6B7280] leading-relaxed">
                                    Sau khi bạn gửi đăng ký học bù, Coach phụ trách lớp sẽ phê duyệt yêu cầu dựa trên tình hình thực tế của sân và số lượng học viên hiện tại.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </div>

            {/* Footer Button - Only show if selection is complete */}
            {selectedMissedSession && selectedMakeupSession && (
                <div className="p-5 bg-white border-t border-gray-100 animate-in slide-in-from-bottom duration-300">
                    <button
                        className="w-full py-4 rounded-2xl bg-[#0E7C7B] text-white font-bold text-lg shadow-lg shadow-teal-900/10 active:scale-[0.98] transition-all"
                        onClick={() => {
                            alert("Yêu cầu đăng ký học bù đã được gửi thành công! Vui lòng chờ Coach phê duyệt.");
                            onBack();
                        }}
                    >
                        Gửi yêu cầu học bù
                    </button>
                </div>
            )}
        </div>
    );
};