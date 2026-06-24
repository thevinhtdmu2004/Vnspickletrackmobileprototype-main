import React from 'react';
import { ArrowLeft, PlayCircle, Clock3, User, CalendarDays, Download, Maximize2 } from 'lucide-react';

interface MemberCourseVideoScreenProps {
    onBack: () => void;
    title: string;
    courseName: string;
    coachName: string;
}

export const MemberCourseVideoScreen: React.FC<MemberCourseVideoScreenProps> = ({
    onBack,
    title,
    courseName,
    coachName,
}) => {
    return (
        <div className="flex flex-col h-full bg-[#F7F9FA]">
            <div
                className="flex-shrink-0 relative overflow-hidden"
                style={{ background: 'linear-gradient(145deg,#054A49 0%,#0E7C7B 100%)' }}
            >
                <div
                    className="absolute pointer-events-none"
                    style={{ top: -20, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
                />
                <div className="flex items-center gap-3 px-4 pt-12 pb-5">
                    <button
                        onClick={onBack}
                        className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                        style={{ background: 'rgba(255,255,255,0.18)' }}
                    >
                        <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
                    </button>
                    <div className="min-w-0">
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>VIDEO KHÓA HỌC</p>
                        <h1 className="truncate" style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>{title}</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 px-5 py-4 space-y-4">
                <div
                    className="rounded-3xl overflow-hidden bg-slate-950 shadow-lg relative"
                    style={{ boxShadow: '0 18px 40px rgba(15,23,42,0.18)' }}
                >
                    <div className="aspect-video flex items-center justify-center relative bg-[linear-gradient(135deg,#0f172a_0%,#111827_55%,#0b5d5b_100%)]">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.2),transparent_32%)]" />
                        <div className="flex flex-col items-center text-center px-6 relative">
                            <div className="w-20 h-20 rounded-full bg-white/14 border border-white/20 flex items-center justify-center shadow-xl">
                                <PlayCircle style={{ width: 44, height: 44, color: 'white' }} />
                            </div>
                            <p className="mt-4 text-white font-black text-lg">Hướng dẫn kỹ thuật giao bóng</p>
                            <p className="mt-1 text-white/70 text-sm font-medium max-w-[240px]">
                                Khung phát video mẫu để thử nghiệm trải nghiệm học trực quan cho hội viên.
                            </p>
                            <div className="mt-5 flex items-center gap-2 text-[11px] text-white/70 font-semibold">
                                <span className="px-2 py-1 rounded-full bg-white/10">00:00</span>
                                <div className="w-40 h-1.5 rounded-full bg-white/15 overflow-hidden">
                                    <div className="h-full w-1/3 rounded-full bg-white" />
                                </div>
                                <span className="px-2 py-1 rounded-full bg-white/10">12:45</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-4" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-teal-50 flex items-center justify-center">
                            <PlayCircle style={{ width: 22, height: 22, color: '#0E7C7B' }} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Đang xem</p>
                            <p className="font-black text-slate-900 truncate">{title}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                        <Clock3 style={{ width: 16, height: 16, color: '#0E7C7B' }} />
                        <p className="mt-2 text-[11px] text-gray-400 font-semibold">Thời lượng</p>
                        <p className="text-sm font-black text-slate-900">12:45</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                        <User style={{ width: 16, height: 16, color: '#0E7C7B' }} />
                        <p className="mt-2 text-[11px] text-gray-400 font-semibold">HLV</p>
                        <p className="text-sm font-black text-slate-900 truncate">{coachName}</p>
                    </div>
                    <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                        <CalendarDays style={{ width: 16, height: 16, color: '#0E7C7B' }} />
                        <p className="mt-2 text-[11px] text-gray-400 font-semibold">Khóa</p>
                        <p className="text-sm font-black text-slate-900 truncate">{courseName}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-2">
                        <h3 className="font-black text-slate-900">Các mốc trong video</h3>
                    </div>
                    <div className="mt-4 space-y-3">
                        {[
                            ['00:00', 'Giới thiệu nội dung'],
                            ['02:10', 'Tư thế cầm vợt'],
                            ['05:20', 'Động tác giao bóng'],
                            ['09:40', 'Lỗi thường gặp'],
                        ].map(([time, label]) => (
                            <div key={time} className="flex items-center gap-3">
                                <div className="w-14 shrink-0 text-[11px] font-black text-teal-700 bg-teal-50 rounded-full px-2 py-1 text-center">{time}</div>
                                <div className="flex-1 h-10 rounded-2xl bg-slate-50 px-3 flex items-center text-sm font-semibold text-slate-700">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button className="flex-1 h-12 rounded-2xl bg-teal-700 text-white font-black active:bg-teal-800 transition-colors">
                        Tiếp tục xem
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center active:bg-gray-50 transition-colors">
                        <Maximize2 style={{ width: 18, height: 18, color: '#334155' }} />
                    </button>
                    <button className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center active:bg-gray-50 transition-colors">
                        <Download style={{ width: 18, height: 18, color: '#334155' }} />
                    </button>
                </div>
            </div>
        </div>
    );
};
