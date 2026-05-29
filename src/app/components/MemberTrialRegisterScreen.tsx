import React, { useState } from 'react';
import {
    ArrowLeft, CheckCircle2, Clock, Calendar, User,
    MapPin, Sparkles, Phone, ChevronRight, ShieldCheck,
    Gift, ArrowRight
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
            {/* Banner */}
            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-5 text-white shadow-lg shadow-orange-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                <div className="relative z-10 flex gap-4 items-center">
                    <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md border border-white/30">
                        <Gift size={28} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black mb-1">Trải nghiệm miễn phí!</h2>
                        <p className="text-sm font-medium text-white/90 leading-tight">
                            Đăng ký ngay 1 buổi học thử cùng HLV chuyên nghiệp. Không phát sinh chi phí.
                        </p>
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
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-300 to-orange-500 rounded-full mb-4 shadow-lg shadow-orange-500/30">
                    <Sparkles size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                    Bạn thấy buổi học<br />hôm nay thế nào?
                </h2>
                <p className="text-gray-500 text-sm px-4">
                    Cảm ơn bạn đã tham gia buổi học thử tại VNS PickleTrack.
                </p>
            </div>

            {/* Special Offer Card */}
            <div className="bg-gradient-to-br from-[#054A49] to-[#0E7C7B] rounded-3xl p-6 text-white shadow-xl shadow-teal-900/20 relative overflow-hidden mb-6">
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                <div className="inline-block px-3 py-1 bg-amber-400 text-amber-950 text-[10px] font-black rounded-lg uppercase tracking-wider mb-4 shadow-sm">
                    Ưu đãi độc quyền
                </div>

                <h3 className="text-3xl font-black mb-2 leading-tight">
                    Giảm ngay 10%<br />Gói học chính thức
                </h3>

                <p className="text-teal-100 text-sm font-medium mb-6 leading-relaxed">
                    Đăng ký gói học ngay hôm nay để nhận ưu đãi và giữ lịch tập yêu thích của bạn với Coach!
                </p>

                <div className="space-y-3 bg-black/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 mb-6">
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
                    onClick={() => onNavigate('member-renew-request')}
                    className="w-full py-4 rounded-xl bg-amber-400 text-amber-950 font-black text-[15px] active:scale-[0.98] transition-transform flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                >
                    GIA HẠN GÓI HỌC NGAY <ChevronRight size={18} />
                </button>
            </div>

            <button
                onClick={onBack}
                className="w-full py-4 rounded-2xl bg-white text-gray-600 font-bold text-sm active:bg-gray-50 transition-colors border border-gray-200"
            >
                Để sau
            </button>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-[#F7F9FA]">
            {/* Header (Only for form) */}
            {step === 'form' && (
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