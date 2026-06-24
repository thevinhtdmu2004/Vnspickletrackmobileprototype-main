import {
    ArrowLeft, Star, Clock, User2, MapPin, CheckCircle2,
    Calendar, ShieldCheck, Zap, Info, Play, MessageSquare,
    Gift, BookOpen, Sparkles
} from 'lucide-react';

interface MemberCourseDetailScreenProps {
    onBack: () => void;
    onRegister: () => void;
}

export function MemberCourseDetailScreen({ onBack, onRegister }: MemberCourseDetailScreenProps) {
    return (
        <div className="flex flex-col h-screen bg-white">
            {/* ── Sticky Header ── */}
            <div className="absolute top-12 left-4 z-10">
                <button
                    onClick={onBack}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-md text-white active:bg-black/40 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                {/* ── Hero Image ── */}
                <div className="relative h-72">
                    <img
                        src="https://media.istockphoto.com/id/2023549916/vi/anh/pickleball-v%E1%BB%A3t-v%C3%A0-b%C3%B3ng.jpg?s=612x612&w=0&k=20&c=jW1aF_O6DXdTbq14BTGVcuz194E9lfbMQolZ95z2LS8="
                        alt="Course Hero"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex gap-2 mb-2">
                            <span className="px-2.5 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                                Cơ bản
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                                8/12 Học viên
                            </span>
                        </div>
                        <h1 className="text-white text-2xl font-black leading-tight">Khóa Pickleball Cơ bản A</h1>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="px-6 py-6 space-y-8">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Star className="w-5 h-5 text-primary fill-primary" />
                            </div>
                            <div>
                                <p className="text-[13px] font-black">4.8</p>
                                <p className="text-[10px] text-muted-foreground font-medium">Đánh giá</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/30">
                            <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-[13px] font-black">90 phút</p>
                                <p className="text-[10px] text-muted-foreground font-medium">Mỗi buổi</p>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-[18px] font-black mb-3">Giới thiệu khóa học</h2>
                        <p className="text-muted-foreground text-[14px] leading-relaxed">
                            Khóa học được thiết kế dành riêng cho người mới bắt đầu. Bạn sẽ được học từ cách cầm vợt, di chuyển cơ bản đến các kỹ thuật giao bóng và đánh bóng qua lưới chuẩn xác nhất.
                        </p>
                    </div>

                    {/* Schedule & Location */}
                    <div className="p-5 rounded-3xl bg-muted/20 border border-border/50">
                        <h3 className="text-[15px] font-extrabold mb-4 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-primary" />
                            Thông tin lớp học
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-[13px] font-bold">Thứ 2 · 4 · 6 (18:00 – 19:30)</p>
                                    <p className="text-[11px] text-muted-foreground">3 buổi mỗi tuần</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                                <div>
                                    <p className="text-[13px] font-bold">Sân Pickleball VNS - Sân 1</p>
                                    <p className="text-[11px] text-muted-foreground">Lô A2, Đường số 5, TP. Thủ Dầu Một</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Coach */}
                    <div>
                        <h2 className="text-[18px] font-black mb-4">Huấn luyện viên</h2>
                        <div className="flex items-center gap-4 p-4 rounded-3xl bg-white border border-border shadow-sm">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-muted">
                                <img src="https://i.pravatar.cc/150?u=coach_nam" alt="Coach" />
                            </div>
                            <div className="flex-1">
                                <p className="font-extrabold text-[15px]">Coach Nam</p>
                                <p className="text-[11px] text-muted-foreground font-medium">5 năm kinh nghiệm · Cấp chứng chỉ quốc tế</p>
                            </div>
                            <button className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary active:bg-primary/20 transition-colors">
                                <MessageSquare className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* What you will learn */}
                    <div>
                        <h2 className="text-[18px] font-black mb-4">Bạn sẽ học được gì?</h2>
                        <div className="space-y-3">
                            {[
                                'Luật thi đấu Pickleball chuẩn quốc tế',
                                'Kỹ thuật cầm vợt và di chuyển cơ bản',
                                'Giao bóng và trả bóng ổn định',
                                'Chiến thuật đánh đơn và đánh đôi',
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                                    <span className="text-[14px] font-medium text-foreground/80">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Gift & Course Materials */}
                    <div className="p-5 rounded-3xl bg-indigo-50 border border-indigo-100 space-y-4">
                        <h3 className="text-[16px] font-black text-indigo-900 flex items-center gap-2">
                            <Gift className="w-5 h-5 text-indigo-600 animate-bounce" />
                            Quà Tặng & Tài Liệu Kèm Theo
                        </h3>

                        <p className="text-[12px] text-indigo-700 font-medium leading-relaxed">
                            Khi đăng ký khóa học này, bạn sẽ nhận được bộ tài liệu và quà tặng độc quyền trị giá hơn <strong className="text-indigo-900">500.000đ</strong> hoàn toàn miễn phí:
                        </p>

                        <div className="space-y-3.5 pt-1">
                            {[
                                {
                                    title: 'Giáo trình "Pickleball Căn Bản Toàn Diện"',
                                    desc: 'Ebook độc quyền do HLV VNS biên soạn chi tiết từ A-Z.',
                                    icon: BookOpen,
                                    badge: 'Ebook'
                                },
                                {
                                    title: 'Bộ 15 Video Bài Tập Bổ Trợ Phản Xạ',
                                    desc: 'Video hướng dẫn học viên tự tập luyện kỹ thuật tại nhà.',
                                    icon: Play,
                                    badge: 'Video HD'
                                },
                                {
                                    title: 'Áo thun thi đấu VNS Pickleball Club',
                                    desc: 'Áo thun thể thao cao cấp thấm hút mồ hôi cực tốt.',
                                    icon: Sparkles,
                                    badge: 'Hiện vật'
                                },
                                {
                                    title: 'Voucher mua vợt ưu đãi 10%',
                                    desc: 'Áp dụng khi mua các dòng vợt thi đấu tại hệ thống VNS Store.',
                                    icon: Gift,
                                    badge: 'Voucher'
                                }
                            ].map((gift, i) => (
                                <div key={i} className="flex gap-3 bg-white p-3 rounded-2xl border border-indigo-100/50 shadow-sm">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                                        <gift.icon className="w-4.5 h-4.5 text-indigo-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <p className="text-[13px] font-extrabold text-slate-800 truncate">{gift.title}</p>
                                            <span className="px-1.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 text-[8px] font-extrabold shrink-0">
                                                {gift.badge}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-500 leading-normal font-medium">{gift.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Bottom Action ── */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-border flex items-center justify-between gap-6 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                <div>
                    <p className="text-[11px] text-muted-foreground font-bold uppercase tracking-tight">Tổng chi phí</p>
                    <p className="text-[20px] font-black text-primary leading-tight">1.200.000đ</p>
                </div>
                <button
                    onClick={onRegister}
                    className="flex-1 bg-primary text-white h-14 rounded-2xl font-black text-[15px] shadow-lg shadow-primary/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Zap className="w-5 h-5" />
                    Đăng ký ngay
                </button>
            </div>
        </div>
    );
}