import {
    ArrowLeft, Search, Trophy, Clock, User2, MapPin,
    ChevronRight, Filter, Star, Info, ReceiptText
} from 'lucide-react';
import { useState } from 'react';

interface MemberCourseListScreenProps {
    onBack: () => void;
    onCourseDetail: (courseId: number) => void;
    onPurchaseHistory?: () => void;
}

type Level = 'beginner' | 'intermediate' | 'advanced';

interface CourseItem {
    id: number;
    name: string;
    level: Level;
    scheduleLabel: string;
    time: string;
    court: string;
    coach: string;
    students: number;
    maxStudents: number;
    price: string;
    rating: number;
    reviews: number;
    image: string;
}

const COURSES: CourseItem[] = [
    {
        id: 1,
        name: 'Khóa Pickleball Cơ bản A',
        level: 'beginner',
        scheduleLabel: 'Thứ 2 · 4 · 6',
        time: '18:00 – 19:30',
        court: 'Sân 1',
        coach: 'Coach Nam',
        students: 8,
        maxStudents: 12,
        price: '1.200.000đ',
        rating: 4.8,
        reviews: 24,
        image: 'https://media.istockphoto.com/id/2023549916/vi/anh/pickleball-v%E1%BB%A3t-v%C3%A0-b%C3%B3ng.jpg?s=612x612&w=0&k=20&c=jW1aF_O6DXdTbq14BTGVcuz194E9lfbMQolZ95z2LS8=',
    },
    {
        id: 2,
        name: 'Pickleball Trung cấp B',
        level: 'intermediate',
        scheduleLabel: 'Thứ 3 · 5 · 7',
        time: '19:30 – 21:00',
        court: 'Sân 2',
        coach: 'Coach Hùng',
        students: 6,
        maxStudents: 10,
        price: '1.500.000đ',
        rating: 4.9,
        reviews: 18,
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzLuzvX-kl3tZNDl26A7OI6JXRp657FK9Ktw&s',
    },
    {
        id: 3,
        name: 'Kỹ thuật Smash & Volley',
        level: 'advanced',
        scheduleLabel: 'Thứ 2 · 4 · 6',
        time: '17:00 – 18:30',
        court: 'Sân 3',
        coach: 'Coach Linh',
        students: 5,
        maxStudents: 8,
        price: '2.000.000đ',
        rating: 5.0,
        reviews: 12,
        image: 'https://cdn.shopvnb.com/uploads/images/bai_viet/anh-pickleball-16-1749431315.webp',
    },
    {
        id: 4,
        name: 'Pickleball Cơ bản B',
        level: 'beginner',
        scheduleLabel: 'Thứ 3 · 5 · 7',
        time: '07:00 – 08:30',
        court: 'Sân 1',
        coach: 'Coach Nam',
        students: 10,
        maxStudents: 10,
        price: '1.200.000đ',
        rating: 4.7,
        reviews: 15,
        image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3jrMICqVPy3QZbigHK1H9z1LKvWxZf8d4uYaC2HY_UxurM5NFD0UqN-sC4vUptBMijU_laqwiAyGY_98zecMqGn2h45mLMhWlDYh5de6o8mqxJuBhI9w5DA38R6CaTl1ZmUp8gkNEGZZRHOEpwXxoklVjUMoBnYZcd2uAOxkjOYcr5cHs4JUYuLnZZ_E/s16000-rw/Anh-san-Pickleball.jpg',
    },
];

const LEVEL_CONFIG = {
    beginner: { label: 'Cơ bản', color: '#2A9D8F', bg: 'rgba(42,157,143,0.12)' },
    intermediate: { label: 'Trung cấp', color: '#F4A261', bg: 'rgba(244,162,97,0.12)' },
    advanced: { label: 'Nâng cao', color: '#E76F51', bg: 'rgba(231,111,81,0.12)' },
};

export function MemberCourseListScreen({ onBack, onCourseDetail, onPurchaseHistory }: MemberCourseListScreenProps) {
    const [search, setSearch] = useState('');
    const [activeLevel, setActiveLevel] = useState<'all' | Level>('all');

    const filtered = COURSES.filter(c => {
        const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.coach.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = activeLevel === 'all' || c.level === activeLevel;
        return matchesSearch && matchesLevel;
    });

    return (
        <div className="flex flex-col h-screen bg-muted/20">
            {/* ── Header ── */}
            <div
                className="relative overflow-hidden flex-shrink-0"
                style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 28%,#075E5D 58%,#0E7C7B 82%,#1A8E87 100%)' }}
            >
                <div className="absolute pointer-events-none" style={{ top: -40, right: -30, width: 170, height: 170, borderRadius: '50%', background: 'rgba(255,255,255,0.042)' }} />
                <div className="absolute pointer-events-none" style={{ bottom: -18, left: -14, width: 120, height: 120, borderRadius: '50%', background: 'rgba(42,157,143,0.09)' }} />

                <div className="relative px-5 pt-14 pb-5 flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-white/20 active:bg-white/20 transition-all text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.48)', fontWeight: 700, letterSpacing: '0.06em' }}>
                            HỘI VIÊN
                        </p>
                        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white', letterSpacing: '-0.4px', marginTop: 1 }}>
                            Khám phá khóa học
                        </h1>
                    </div>
                    <button
                        onClick={onPurchaseHistory}
                        className="flex items-center gap-1.5 px-3.5 h-10 rounded-full bg-white/10 border border-white/20 active:bg-white/20 transition-all text-white"
                    >
                        <ReceiptText className="w-4 h-4" />
                        <span style={{ fontSize: 11, fontWeight: 800 }}>Lịch sử mua</span>
                    </button>
                </div>
            </div>

            {/* ── Search & Filter Panel ── */}
            <div className="bg-white px-5 py-4 border-b border-border/40 flex-shrink-0 space-y-3 shadow-sm z-10">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Tìm tên khóa học hoặc huấn luyện viên..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-muted/40 rounded-xl border-none text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>

                {/* Level Filters */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setActiveLevel(lvl as any)}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${activeLevel === lvl
                                ? 'bg-primary border-primary text-white shadow-md'
                                : 'bg-white border-border text-muted-foreground'
                                }`}
                        >
                            {lvl === 'all' ? 'Tất cả' : LEVEL_CONFIG[lvl as Level].label}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── List Content ── */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Info className="w-12 h-12 mb-3 opacity-20" />
                        <p style={{ fontSize: '15px' }}>Không tìm thấy khóa học phù hợp</p>
                    </div>
                ) : (
                    filtered.map(course => {
                        const lvl = LEVEL_CONFIG[course.level];
                        const isFull = course.students >= course.maxStudents;

                        return (
                            <div
                                key={course.id}
                                onClick={() => onCourseDetail(course.id)}
                                className="bg-white rounded-3xl overflow-hidden border border-border/50 shadow-sm active:scale-[0.98] transition-all"
                            >
                                {/* Course Image */}
                                <div className="relative h-40">
                                    <img
                                        src={course.image}
                                        alt={course.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span
                                            className="px-2.5 py-1 rounded-full text-[10px] font-bold shadow-sm"
                                            style={{ background: lvl.bg, color: lvl.color, backdropFilter: 'blur(4px)' }}
                                        >
                                            {lvl.label}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 text-orange-400 fill-orange-400" />
                                        <span className="text-[11px] font-bold">{course.rating}</span>
                                    </div>
                                </div>

                                {/* Course Info */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-extrabold text-[17px] leading-tight flex-1 mr-2">{course.name}</h3>
                                        <span className="text-primary font-black text-[16px]">{course.price}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-4">
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <User2 className="w-3.5 h-3.5 text-primary/70" />
                                            <span className="text-[12px] font-medium">{course.coach}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5 text-primary/70" />
                                            <span className="text-[12px] font-medium">{course.scheduleLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <MapPin className="w-3.5 h-3.5 text-primary/70" />
                                            <span className="text-[12px] font-medium">{course.court}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground">
                                            <Clock className="w-3.5 h-3.5 text-primary/70" />
                                            <span className="text-[12px] font-medium">{course.time}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-dashed border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="flex -space-x-2">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-muted flex items-center justify-center overflow-hidden">
                                                        <img src={`https://i.pravatar.cc/100?u=${course.id + i}`} alt="avatar" />
                                                    </div>
                                                ))}
                                            </div>
                                            <span className="text-[11px] text-muted-foreground font-medium">
                                                {isFull ? 'Đã đầy' : `Còn ${course.maxStudents - course.students} chỗ`}
                                            </span>
                                        </div>
                                        <button
                                            className="flex items-center gap-1 text-primary font-bold text-[13px]"
                                        >
                                            Chi tiết
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}