import React, { useState } from 'react';
import { ArrowLeft, FileText, FileVideo, Download, PlayCircle, BookOpen, User, Calendar, Search } from 'lucide-react';

interface MemberCourseMaterialsScreenProps {
    onBack: () => void;
}

export const MemberCourseMaterialsScreen: React.FC<MemberCourseMaterialsScreenProps> = ({ onBack }) => {
    const [selectedCourse, setSelectedCourse] = useState<string>('Beginner A');
    const [searchTerm, setSearchTerm] = useState('');

    const courses = ['Beginner A', 'Beginner B'];

    const allMaterials = [
        {
            id: 1,
            course: 'Beginner A',
            title: 'Luật chơi Pickleball cơ bản 2026',
            type: 'pdf',
            size: '2.4 MB',
            date: '25/04/2026',
            coach: 'Coach Nam',
            description: 'Tài liệu bắt buộc đọc trước khi ra sân buổi đầu tiên.'
        },
        {
            id: 2,
            course: 'Beginner A',
            title: 'Hướng dẫn kỹ thuật Giao bóng (Serve)',
            type: 'video',
            size: '15.1 MB',
            date: '26/04/2026',
            coach: 'Coach Nam',
            description: 'Video mô phỏng động tác giao bóng đúng chuẩn.'
        },
        {
            id: 3,
            course: 'Beginner A',
            title: 'Giáo trình thực hành Tuần 1-4',
            type: 'doc',
            size: '1.2 MB',
            date: '28/04/2026',
            coach: 'Coach Nam',
            description: 'Tổng hợp các bài tập rèn luyện thể lực và phản xạ.'
        },
        {
            id: 4,
            course: 'Beginner B',
            title: 'Chiến thuật đánh đôi (Nâng cao)',
            type: 'video',
            size: '22 MB',
            date: '10/05/2026',
            coach: 'Coach Linh',
            description: 'Cách di chuyển và phối hợp cùng đồng đội.'
        },
        {
            id: 5,
            course: 'Beginner B',
            title: 'Lỗi thường gặp và cách khắc phục',
            type: 'pdf',
            size: '3.1 MB',
            date: '12/05/2026',
            coach: 'Coach Linh',
            description: 'Phân tích các lỗi sai phổ biến của người mới chơi.'
        },
    ];

    const filteredMaterials = allMaterials.filter(m =>
        m.course === selectedCourse &&
        m.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getIconForType = (type: string) => {
        switch (type) {
            case 'pdf': return <FileText style={{ color: '#E76F51' }} />;
            case 'doc': return <BookOpen style={{ color: '#2A9D8F' }} />;
            case 'video': return <FileVideo style={{ color: '#815AD5' }} />;
            default: return <FileText style={{ color: '#9CA3AF' }} />;
        }
    };

    const getBgForType = (type: string) => {
        switch (type) {
            case 'pdf': return 'rgba(231,111,81,0.1)';
            case 'doc': return 'rgba(42,157,143,0.1)';
            case 'video': return 'rgba(129,90,213,0.1)';
            default: return 'rgba(156,163,175,0.1)';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F7F9FA]">
            {/* ── HEADER ── */}
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
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>TÀI LIỆU KHÓA HỌC</p>
                        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>Tài liệu tham khảo</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">

                {/* ── COURSE SELECTOR ── */}
                <div className="bg-white px-5 py-4 border-b border-gray-100">
                    <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                        {courses.map(course => (
                            <button
                                key={course}
                                onClick={() => setSelectedCourse(course)}
                                className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-colors ${selectedCourse === course
                                    ? 'bg-teal-700 text-white shadow-md'
                                    : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                                    }`}
                                style={{ fontSize: 14 }}
                            >
                                Lớp {course}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── SEARCH BAR ── */}
                <div className="px-5 py-4">
                    <div
                        className="flex items-center bg-white rounded-2xl px-4 py-3"
                        style={{ border: '1px solid #E5E7EB', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
                    >
                        <Search style={{ width: 18, height: 18, color: '#9CA3AF', marginRight: 10 }} />
                        <input
                            type="text"
                            placeholder="Tìm kiếm tài liệu..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 font-medium"
                            style={{ fontSize: 15 }}
                        />
                    </div>
                </div>

                {/* ── MATERIALS LIST ── */}
                <div className="px-5 space-y-4">
                    {filteredMaterials.length > 0 ? (
                        filteredMaterials.map(material => (
                            <div
                                key={material.id}
                                className="bg-white rounded-2xl p-4 active:scale-[0.98] transition-transform"
                                style={{
                                    border: '1px solid rgba(14,124,123,0.1)',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
                                }}
                            >
                                <div className="flex gap-4">
                                    {/* Icon */}
                                    <div
                                        className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-2xl"
                                        style={{ background: getBgForType(material.type) }}
                                    >
                                        {getIconForType(material.type)}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900 leading-tight mb-1" style={{ fontSize: 15 }}>
                                            {material.title}
                                        </h3>
                                        <p className="text-gray-500 line-clamp-2" style={{ fontSize: 12, lineHeight: 1.4, marginBottom: 8 }}>
                                            {material.description}
                                        </p>

                                        {/* Metadata */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                            <div className="flex items-center gap-1.5">
                                                <User style={{ width: 12, height: 12, color: '#9CA3AF' }} />
                                                <span className="text-gray-600 font-semibold" style={{ fontSize: 11 }}>{material.coach}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar style={{ width: 12, height: 12, color: '#9CA3AF' }} />
                                                <span className="text-gray-500 font-medium" style={{ fontSize: 11 }}>{material.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px w-full bg-gray-100 my-4" />

                                {/* Actions */}
                                <div className="flex gap-3">
                                    {material.type === 'video' ? (
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-bold active:bg-teal-100" style={{ fontSize: 14 }}>
                                            <PlayCircle style={{ width: 18, height: 18 }} />
                                            Xem Video
                                        </button>
                                    ) : (
                                        <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal-50 text-teal-700 font-bold active:bg-teal-100" style={{ fontSize: 14 }}>
                                            <BookOpen style={{ width: 18, height: 18 }} />
                                            Đọc tài liệu
                                        </button>
                                    )}
                                    <button className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold flex items-center justify-center active:bg-gray-50">
                                        <Download style={{ width: 18, height: 18 }} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                            <FileText style={{ width: 64, height: 64, marginBottom: 16, color: '#9CA3AF' }} />
                            <p className="font-bold text-gray-700" style={{ fontSize: 16 }}>Không tìm thấy tài liệu</p>
                            <p className="text-gray-500 mt-1" style={{ fontSize: 13 }}>Chưa có tài liệu nào phù hợp với tìm kiếm của bạn.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};