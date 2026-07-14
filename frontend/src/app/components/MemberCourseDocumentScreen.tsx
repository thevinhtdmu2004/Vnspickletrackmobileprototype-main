import React from 'react';
import { ArrowLeft, FileText, BookOpen, User, CalendarDays, Download, ScrollText } from 'lucide-react';

interface MemberCourseDocumentScreenProps {
    onBack: () => void;
    title: string;
    courseName: string;
    coachName: string;
    contentType: 'pdf' | 'doc';
}

export const MemberCourseDocumentScreen: React.FC<MemberCourseDocumentScreenProps> = ({
    onBack,
    title,
    courseName,
    coachName,
    contentType,
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
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>ĐỌC TÀI LIỆU</p>
                        <h1 className="truncate" style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>{title}</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24 px-5 py-4 space-y-4">
                <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start gap-4">
                        <div
                            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                            style={{ background: contentType === 'pdf' ? 'rgba(231,111,81,0.10)' : 'rgba(42,157,143,0.10)' }}
                        >
                            {contentType === 'pdf' ? (
                                <FileText style={{ width: 24, height: 24, color: '#E76F51' }} />
                            ) : (
                                <BookOpen style={{ width: 24, height: 24, color: '#2A9D8F' }} />
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
                                {contentType === 'pdf' ? 'PDF / Tài liệu tham khảo' : 'DOC / Giáo trình thực hành'}
                            </p>
                            <h2 className="mt-1 text-lg font-black text-slate-900 leading-tight">{title}</h2>
                            <p className="mt-1 text-sm text-slate-500 font-medium">
                                {courseName} · {coachName}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5" style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-center gap-2">
                        <ScrollText style={{ width: 18, height: 18, color: '#0E7C7B' }} />
                        <h3 className="font-black text-slate-900">Trang 1 / 8</h3>
                    </div>
                    <div className="mt-4 rounded-3xl border border-gray-100 bg-[#FBFCFD] p-4">
                        <div className="h-[380px] rounded-2xl bg-white border border-gray-100 p-4 overflow-hidden">
                            <div className="flex items-center justify-between">
                                <div className="w-24 h-3 rounded-full bg-slate-200" />
                                <div className="w-12 h-3 rounded-full bg-slate-200" />
                            </div>
                            <div className="mt-4 space-y-3">
                                <div className="h-4 w-3/4 rounded-full bg-slate-900/10" />
                                <div className="h-4 w-full rounded-full bg-slate-900/10" />
                                <div className="h-4 w-5/6 rounded-full bg-slate-900/10" />
                                <div className="h-4 w-2/3 rounded-full bg-slate-900/10" />
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-teal-50 p-3 border border-teal-100">
                                    <div className="h-3 w-20 rounded-full bg-teal-700/20" />
                                    <div className="mt-3 space-y-2">
                                        <div className="h-3 w-full rounded-full bg-teal-700/10" />
                                        <div className="h-3 w-5/6 rounded-full bg-teal-700/10" />
                                    </div>
                                </div>
                                <div className="rounded-2xl bg-amber-50 p-3 border border-amber-100">
                                    <div className="h-3 w-16 rounded-full bg-amber-700/20" />
                                    <div className="mt-3 space-y-2">
                                        <div className="h-3 w-full rounded-full bg-amber-700/10" />
                                        <div className="h-3 w-4/5 rounded-full bg-amber-700/10" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 space-y-2">
                                <div className="h-4 w-full rounded-full bg-slate-900/10" />
                                <div className="h-4 w-11/12 rounded-full bg-slate-900/10" />
                                <div className="h-4 w-10/12 rounded-full bg-slate-900/10" />
                                <div className="h-4 w-9/12 rounded-full bg-slate-900/10" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button className="h-12 rounded-2xl bg-teal-700 text-white font-black active:bg-teal-800 transition-colors">
                        Trang trước / sau
                    </button>
                    <button className="h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center gap-2 text-slate-700 font-black active:bg-gray-50 transition-colors">
                        <Download style={{ width: 18, height: 18 }} />
                        Tải xuống
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
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
                    <div className="bg-white rounded-2xl p-3" style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}>
                        <BookOpen style={{ width: 16, height: 16, color: '#0E7C7B' }} />
                        <p className="mt-2 text-[11px] text-gray-400 font-semibold">Loại</p>
                        <p className="text-sm font-black text-slate-900 uppercase">{contentType}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};