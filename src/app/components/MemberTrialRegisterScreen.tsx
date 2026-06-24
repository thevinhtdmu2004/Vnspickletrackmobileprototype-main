import React, { useState } from 'react';
import {
    ArrowLeft, CheckCircle2, Clock, Calendar, User,
    MapPin, Sparkles, Phone, ChevronRight, ShieldCheck,
    Gift, ArrowRight, Award, BookOpen, Info
} from 'lucide-react';

interface MemberTrialRegisterScreenProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
}

export const MemberTrialRegisterScreen: React.FC<MemberTrialRegisterScreenProps> = ({ onBack, onNavigate }) => {
    const [step, setStep] = useState<'form' | 'success' | 'post-trial'>('form');

    // Form state
    const [name, setName] = useState('Nguyễn Văn A');
    const [phone, setPhone] = useState('0901234567');
    const [selectedDate, setSelectedDate] = useState('2026-06-05');
    const [selectedTime, setSelectedTime] = useState('18:00');
    const [selectedLevel, setSelectedLevel] = useState('beginner');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setStep('success');
        }, 1200);
    };

    const renderForm = () => (
        <div className="p-4 space-y-5">
            {/* Banner đồng bộ với bên ngoài */}
            <div
                className="w-full relative overflow-hidden rounded-[28px] text-left"
                style={{
                    background: 'linear-gradient(135deg, #111827 0%, #312E81 45%, #7C3AED 100%)',
                    boxShadow: '0 16px 36px rgba(49,46,129,0.22)',
                }}
            >
                <div className="absolute inset-0 opacity-30" style={{ background: 'radial-gradient(circle at top right, rgba(255,255,255,0.34), transparent 32%), radial-gradient(circle at bottom left, rgba(34,211,238,0.24), transparent 28%)' }} />
                <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-white/12 blur-2xl" />
                <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-fuchsia-400/20 blur-2xl" />

                <div className="relative p-5 text-white">
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/14 text-[10px] font-bold tracking-wide border border-white/15 backdrop-blur-sm">
                                <Calendar size={10} />
                                Học thử 1 ngày
                            </div>
                            <h2 className="mt-3 text-[18px] font-black leading-tight tracking-[-0.02em]">
                                Trải nghiệm Pickleball, đặt lịch trong 30 giây
                            </h2>
                            <p className="mt-1 text-[12px] text-white/78 font-medium leading-relaxed max-w-[230px]">
                                Lớp học thử thiết kế hiện đại, linh hoạt, phù hợp người mới bắt đầu.
                            </p>
                        </div>
                        <div className="shrink-0 w-12 h-12 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center backdrop-blur-sm">
                            <Award className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 text-[12px] font-bold text-white/90">
                        <BookOpen className="w-4 h-4" />
                        Đăng ký ngay
                        <ChevronRight className="w-4 h-4" />
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-white/70 font-semibold">
                        <Info className="w-3.5 h-3.5" />
                        Đồng bộ giao diện với banner ngoài Dashboard
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-wider mb-4">
                        Thông tin đăng ký
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <User size={14} /> Họ và tên
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-800 font-bold focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <Phone size={14} /> Số điện thoại
                            </label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-800 font-bold focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <Sparkles size={14} /> Trình độ của bạn
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedLevel('beginner')}
                                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${selectedLevel === 'beginner'
                                            ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm'
                                            : 'bg-white border-gray-200 text-gray-500'
                                        }`}
                                >
                                    Chưa biết chơi
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedLevel('intermediate')}
                                    className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${selectedLevel === 'intermediate'
                                            ? 'bg-teal-50 border-teal-500 text-teal-700 shadow-sm'
                                            : 'bg-white border-gray-200 text-gray-500'
                                        }`}
                                >
                                    Đã biết chơi cơ bản
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                    <h3 className="text-[13px] font-black text-gray-800 uppercase tracking-wider mb-4">
                        Chọn lịch học thử
                    </h3>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <Calendar size={14} /> Ngày mong muốn
                            </label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-800 font-bold focus:outline-none focus:border-teal-500 focus:bg-white transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                <Clock size={14} /> Giờ mong muốn
                            </label>
                            <select
                                value={selectedTime}
                                onChange={(e) => setSelectedTime(e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50/50 text-gray-800 font-bold focus:outline-none focus:border-teal-500 focus:bg-white transition-colors appearance-none"
                            >
                                <option value="08:00">08:00 - 09:30 (Sáng)</option>
                                <option value="18:00">18:00 - 19:30 (Tối)</option>
                                <option value="19:30">19:30 - 21:00 (Tối)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-teal-600 text-white font-black text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-teal-500/30"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ĐANG XỬ LÝ...
                        </>
                    ) : (
                        <>
                            XÁC NHẬN ĐĂNG KÝ HỌC THỬ <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="flex justify-center mt-6 mb-2">
                <button
                    onClick={() => setStep('post-trial')}
                    className="text-xs font-bold text-gray-400 underline decoration-dashed underline-offset-4"
                >
                    [Mô phỏng: Đi đến màn hình Sau khi học thử]
                </button>
            </div>
        </div>
    );

    const renderSuccess = () => (
        <div className="p-5 flex flex-col items-center justify-center h-full pt-12">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-50" />
                <CheckCircle2 size={48} className="text-green-500 relative z-10" />
            </div>

            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">Đăng ký thành công!</h2>
            <p className="text-center text-gray-500 text-sm mb-8 px-4 leading-relaxed">
                Yêu cầu học thử của bạn đã được ghi nhận. HLV sẽ liên hệ với bạn qua số điện thoại
                <span className="font-bold text-gray-800 mx-1">{phone}</span> để xác nhận lịch học chính thức.
            </p>

            <div className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-4 mb-8">
                <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">
                    Thông tin dự kiến
                </h3>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600">
                        <Calendar size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Ngày học</p>
                        <p className="text-sm font-bold text-gray-800">{selectedDate.split('-').reverse().join('/')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                        <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Thời gian</p>
                        <p className="text-sm font-bold text-gray-800">{selectedTime} - {selectedTime === '08:00' ? '09:30' : (selectedTime === '18:00' ? '19:30' : '21:00')}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Địa điểm</p>
                        <p className="text-sm font-bold text-gray-800">Sân VNS PickleTrack Center</p>
                    </div>
                </div>
            </div>

            <button
                onClick={onBack}
                className="w-full py-4 rounded-2xl bg-gray-900 text-white font-black text-sm active:scale-[0.98] transition-all"
            >
                VỀ TRANG CHỦ
            </button>

            <div className="mt-8">
                <button
                    onClick={() => setStep('post-trial')}
                    className="text-xs font-bold text-teal-600 underline decoration-dashed underline-offset-4"
                >
                    [Mô phỏng: Đi đến màn hình Sau khi học thử]
                </button>
            </div>
        </div>
    );

    const renderPostTrial = () => (
        <div className="p-4 flex flex-col pt-8">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg shadow-orange-500/30 bg-gradient-to-br from-amber-300 to-orange-500">
                    <Sparkles size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                    Bạn thấy buổi học<br />hôm nay thế nào?
                </h2>
                <p className="text-gray-500 text-sm px-4">
                    Cảm ơn bạn đã tham gia buổi học thử tại VNS PickleTrack.
                </p>
            </div>

            <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-[#054A49] to-[#0E7C7B] p-6 text-white shadow-xl shadow-teal-900/20">
                <div className="pointer-events-none absolute top-0 right-0 -mr-10 -mt-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

                <div className="mb-4 inline-block rounded-lg bg-amber-400 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-950 shadow-sm">
                    Ưu đãi độc quyền
                </div>

                <h3 className="mb-2 text-3xl font-black leading-tight">
                    Giảm ngay 10%<br />Gói học chính thức
                </h3>

                <p className="mb-6 text-sm font-medium leading-relaxed text-teal-100">
                    Đăng ký gói học ngay hôm nay để nhận ưu đãi và giữ lịch tập yêu thích của bạn với Coach!
                </p>

                <div className="mb-6 space-y-3 rounded-2xl border border-white/10 bg-black/10 p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-amber-400" />
                        <span className="text-sm font-bold">Cam kết chất lượng đầu ra</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-amber-400" />
                        <span className="text-sm font-bold">Linh hoạt học bù khi vắng</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User size={16} className="text-amber-400" />
                        <span className="text-sm font-bold">HLV theo sát lộ trình</span>
                    </div>
                </div>

                <button
                    onClick={() => onNavigate('member-course-list')}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white py-4 text-[15px] font-black text-[#054A49] shadow-lg shadow-black/10 transition-transform active:scale-[0.98]"
                >
                    ĐĂNG KÝ GÓI HỌC NGAY <ChevronRight size={18} />
                </button>
            </div>

            <button
                onClick={onBack}
                className="w-full rounded-2xl border border-teal-100 bg-white py-4 text-sm font-bold text-[#054A49] shadow-sm transition-colors active:bg-teal-50"
            >
                Để sau
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#F7F9FA]">
            {/* Header (Only for form) */}
            {step === 'form' && (
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
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-sm transition-transform active:scale-[0.98]"
                            aria-label="Quay lại"
                        >
                            <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
                        </button>
                        <div>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>CHƯƠNG TRÌNH ĐẶC BIỆT</p>
                            <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>Đăng ký học thử</h1>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto pb-24">
                {step === 'form' && renderForm()}
                {step === 'success' && renderSuccess()}
                {step === 'post-trial' && renderPostTrial()}
            </div>
        </div>
    );
};