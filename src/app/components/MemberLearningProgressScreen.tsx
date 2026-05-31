import React, { useState } from 'react';
import {
    ArrowLeft, Upload, Video, Image, CheckCircle2, AlertCircle,
    Trash2, Play, Calendar, User, ChevronDown, ChevronUp, MessageSquare, Clock
} from 'lucide-react';

interface MemberLearningProgressScreenProps {
    onBack: () => void;
    onNavigate?: (screen: string) => void;
}

interface LearningSession {
    id: string;
    sessionNumber: number;
    date: string;
    attendanceStatus: 'Có mặt' | 'Trễ' | 'Học bù' | 'Vắng' | 'Nghỉ phép' | 'Chưa diễn ra';
    coach: string;
    time: string;
    uploadedMedia?: {
        id: string;
        type: 'video' | 'image';
        fileName: string;
        fileSize: string;
        uploadDate: string;
        status: 'pending' | 'approved' | 'rejected';
        notes?: string;
        feedback?: string;
    };
}

interface Course {
    id: string;
    name: string;
    schedule: string;
    coach: string;
    totalSessions: number;
}

export const MemberLearningProgressScreen: React.FC<MemberLearningProgressScreenProps> = ({ onBack, onNavigate }) => {
    // List of courses for the member
    const courses: Course[] = [
        { id: 'course-1', name: 'Beginner A', schedule: 'Thứ 2 - Thứ 4 - Thứ 6 (18:00 - 19:30)', coach: 'Coach Nam', totalSessions: 14 },
        { id: 'course-2', name: 'Intermediate B', schedule: 'Thứ 3 - Thứ 5 (19:30 - 21:00)', coach: 'Coach Tuấn', totalSessions: 10 }
    ];

    const [selectedCourseId, setSelectedCourseId] = useState<string>('course-1');

    // Complete list of all sessions in the course (both past, present, and future)
    const [sessionsData, setSessionsData] = useState<Record<string, LearningSession[]>>({
        'course-1': [
            {
                id: 'sess-14',
                sessionNumber: 14,
                date: '03/06/2026',
                attendanceStatus: 'Chưa diễn ra',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-13',
                sessionNumber: 13,
                date: '01/06/2026',
                attendanceStatus: 'Chưa diễn ra',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-12',
                sessionNumber: 12,
                date: '29/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-11',
                sessionNumber: 11,
                date: '27/05/2026',
                attendanceStatus: 'Học bù',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
                uploadedMedia: {
                    id: 'media-1',
                    type: 'video',
                    fileName: 'Buoi_giao_bong_27_05_2026.mp4',
                    fileSize: '142 MB',
                    uploadDate: '27/05/2026 20:15',
                    status: 'approved',
                    notes: 'Em tập kỹ thuật giao bóng xoáy và di chuyển chân.',
                    feedback: 'Kỹ thuật giao bóng tốt, lực đánh khá đều. Chú ý bước đệm trước khi di chuyển sang trái.'
                }
            },
            {
                id: 'sess-10',
                sessionNumber: 10,
                date: '25/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
                uploadedMedia: {
                    id: 'media-2',
                    type: 'video',
                    fileName: 'Dap_bong_25_05_2026.mp4',
                    fileSize: '89 MB',
                    uploadDate: '25/05/2026 19:40',
                    status: 'pending',
                    notes: 'Hôm nay học đập bóng cao sâu.'
                }
            },
            {
                id: 'sess-9',
                sessionNumber: 9,
                date: '22/05/2026',
                attendanceStatus: 'Trễ',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-8',
                sessionNumber: 8,
                date: '20/05/2026',
                attendanceStatus: 'Vắng',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-7',
                sessionNumber: 7,
                date: '18/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
                uploadedMedia: {
                    id: 'media-7',
                    type: 'image',
                    fileName: 'Bo_tri_san_dau_18_05.jpg',
                    fileSize: '2.4 MB',
                    uploadDate: '18/05/2026 19:45',
                    status: 'approved',
                    notes: 'Em vẽ lại sơ đồ di chuyển đôi nam nữ.',
                    feedback: 'Sơ đồ rất chuẩn xác, nhớ áp dụng đúng cự ly khi vào trận đấu thực tế.'
                }
            },
            {
                id: 'sess-6',
                sessionNumber: 6,
                date: '15/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-5',
                sessionNumber: 5,
                date: '13/05/2026',
                attendanceStatus: 'Nghỉ phép',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-4',
                sessionNumber: 4,
                date: '11/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-3',
                sessionNumber: 3,
                date: '08/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-2',
                sessionNumber: 2,
                date: '06/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            },
            {
                id: 'sess-1',
                sessionNumber: 1,
                date: '04/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Nam',
                time: '18:00 - 19:30',
            }
        ],
        'course-2': [
            {
                id: 'sess-2-10',
                sessionNumber: 10,
                date: '04/06/2026',
                attendanceStatus: 'Chưa diễn ra',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-9',
                sessionNumber: 9,
                date: '02/06/2026',
                attendanceStatus: 'Chưa diễn ra',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-8',
                sessionNumber: 8,
                date: '28/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-7',
                sessionNumber: 7,
                date: '26/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-6',
                sessionNumber: 6,
                date: '21/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-5',
                sessionNumber: 5,
                date: '19/05/2026',
                attendanceStatus: 'Vắng',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-4',
                sessionNumber: 4,
                date: '14/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-3',
                sessionNumber: 3,
                date: '12/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-2',
                sessionNumber: 2,
                date: '07/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            },
            {
                id: 'sess-2-1',
                sessionNumber: 1,
                date: '05/05/2026',
                attendanceStatus: 'Có mặt',
                coach: 'Coach Tuấn',
                time: '19:30 - 21:00',
            }
        ]
    });

    // Accordion state (expanded session ids)
    const [expandedSessionIds, setExpandedSessionIds] = useState<Record<string, boolean>>({
        'sess-12': true, // Open the current active one (May 29) by default
    });

    // Upload state helper for each session id
    const [selectedFiles, setSelectedFiles] = useState<Record<string, File>>({});
    const [uploadNotes, setUploadNotes] = useState<Record<string, string>>({});
    const [uploadingSessionId, setUploadingSessionId] = useState<string | null>(null);

    const activeCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
    const activeSessions = sessionsData[selectedCourseId] || [];

    const toggleSession = (id: string) => {
        setExpandedSessionIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleFileChange = (sessionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFiles(prev => ({
                ...prev,
                [sessionId]: file
            }));
        }
    };

    const handleNotesChange = (sessionId: string, val: string) => {
        setUploadNotes(prev => ({
            ...prev,
            [sessionId]: val
        }));
    };

    const handleUploadMedia = (sessionId: string) => {
        const file = selectedFiles[sessionId];
        if (!file) {
            alert('Vui lòng chọn file video hoặc ảnh!');
            return;
        }

        setUploadingSessionId(sessionId);

        // Mock upload process
        setTimeout(() => {
            const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.mov');

            const updatedSessions = sessionsData[selectedCourseId].map(sess => {
                if (sess.id === sessionId) {
                    return {
                        ...sess,
                        uploadedMedia: {
                            id: Date.now().toString(),
                            type: (isVideo ? 'video' : 'image') as 'video' | 'image',
                            fileName: file.name,
                            fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
                            uploadDate: new Date().toLocaleString('vi-VN'),
                            status: 'pending' as const,
                            notes: uploadNotes[sessionId] || ''
                        }
                    };
                }
                return sess;
            });

            setSessionsData({
                ...sessionsData,
                [selectedCourseId]: updatedSessions
            });

            // Reset local inputs
            const updatedFiles = { ...selectedFiles };
            delete updatedFiles[sessionId];
            setSelectedFiles(updatedFiles);

            const updatedNotes = { ...uploadNotes };
            delete updatedNotes[sessionId];
            setUploadNotes(updatedNotes);

            setUploadingSessionId(null);
            alert('Tải lên thành công! Video/Ảnh đang chờ HLV phê duyệt.');
        }, 1500);
    };

    const handleDeleteMedia = (sessionId: string) => {
        if (confirm('Bạn có chắc muốn xóa video/ảnh đã tải lên này?')) {
            const updatedSessions = sessionsData[selectedCourseId].map(sess => {
                if (sess.id === sessionId) {
                    const { uploadedMedia, ...rest } = sess;
                    return rest;
                }
                return sess;
            });
            setSessionsData({
                ...sessionsData,
                [selectedCourseId]: updatedSessions
            });
        }
    };

    const getAttendanceStyle = (status: string) => {
        switch (status) {
            case 'Có mặt':
            case 'Trễ':
                return { bg: 'rgba(42,157,143,0.12)', color: '#2A9D8F', label: 'Đã điểm danh' };
            case 'Học bù':
                return { bg: 'rgba(239,68,68,0.12)', color: '#EF4444', label: 'Học bù' };
            case 'Nghỉ phép':
            case 'Vắng':
                return { bg: 'rgba(107,114,128,0.12)', color: '#6B7280', label: 'Nghỉ' };
            case 'Chưa diễn ra':
                return { bg: '#F3F4F6', color: '#9CA3AF', label: 'Chưa diễn ra' };
            default:
                return { bg: '#E5E7EB', color: '#4B5563', label: status };
        }
    };

    const getMediaStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return { bg: '#D1FAE5', color: '#065F46', text: 'Đã duyệt' };
            case 'rejected': return { bg: '#FEE2E2', color: '#991B1B', text: 'Từ chối' };
            case 'pending': return { bg: '#FEF3C7', color: '#92400E', text: 'Chờ duyệt' };
            default: return { bg: '#F3F4F6', color: '#374151', text: 'Không rõ' };
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
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>THEO DÕI QUÁ TRÌNH HỌC</p>
                        <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white' }}>Quá trình học tập</h1>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <div className="px-4 py-4 space-y-4">
                    {/* Course Selection Card - Beautifully Redesigned */}
                    <div className="space-y-2">
                        <label style={{ fontSize: 11, fontWeight: 900, color: '#0E7C7B' }} className="block uppercase tracking-widest pl-1">
                            Khóa học của bạn
                        </label>

                        {/* Horizontal Scrolling Course Cards */}
                        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none">
                            {courses.map(course => {
                                const isSelected = course.id === selectedCourseId;
                                return (
                                    <div
                                        key={course.id}
                                        onClick={() => {
                                            setSelectedCourseId(course.id);
                                            const sessions = sessionsData[course.id] || [];
                                            const currentSess = sessions.find(s => s.attendanceStatus !== 'Chưa diễn ra') || sessions[0];
                                            if (currentSess) {
                                                setExpandedSessionIds({ [currentSess.id]: true });
                                            } else {
                                                setExpandedSessionIds({});
                                            }
                                        }}
                                        className={`flex-shrink-0 w-[240px] rounded-3xl p-4 border transition-all duration-300 cursor-pointer relative overflow-hidden select-none ${isSelected
                                                ? 'bg-gradient-to-br from-white to-teal-50/20 border-teal-500 shadow-md shadow-teal-500/5 scale-[1.02]'
                                                : 'bg-white border-gray-100 hover:border-gray-200 opacity-90'
                                            }`}
                                    >
                                        {/* Glow effect for selected */}
                                        {isSelected && (
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -mr-6 -mt-6 pointer-events-none" />
                                        )}

                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-extrabold tracking-wider uppercase ${isSelected ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                Đang học
                                            </span>
                                            {isSelected && (
                                                <div className="w-5 h-5 rounded-full bg-teal-500 flex items-center justify-center">
                                                    <CheckCircle2 size={12} className="text-white" />
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="font-black text-gray-900 text-base tracking-tight truncate">
                                            {course.name}
                                        </h3>

                                        <div className="flex items-center gap-1.5 mt-1.5">
                                            <div className="w-5 h-5 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                                <User size={10} className="text-gray-400" />
                                            </div>
                                            <p className="text-xs font-bold text-gray-500 truncate">
                                                {course.coach}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Selected Course Schedule & Details Panel */}
                        <div className="bg-[#EBF7F6] border border-teal-600/10 rounded-3xl p-4 flex justify-between items-center gap-3">
                            <div className="space-y-1.5 flex-1 min-w-0">
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-teal-800 uppercase tracking-widest">
                                    <Clock size={11} className="text-teal-700" />
                                    <span>Lịch học cố định</span>
                                </div>
                                <p className="text-xs font-bold text-teal-950 truncate pl-4">
                                    {activeCourse.schedule}
                                </p>
                            </div>
                            <div className="text-right shrink-0 border-l border-teal-600/10 pl-4">
                                <div className="text-[10px] font-black text-teal-800 uppercase tracking-widest mb-0.5">
                                    Thời lượng
                                </div>
                                <p className="text-sm font-black text-teal-700">
                                    {activeCourse.totalSessions} Buổi
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Instruction Alert */}
                    <div className="bg-teal-50/70 border border-teal-100/50 p-4 rounded-3xl flex gap-3">
                        <AlertCircle className="text-teal-600 shrink-0 mt-0.5" size={18} />
                        <div>
                            <p className="text-[13px] font-bold text-teal-900">Báo cáo quá trình học qua Video/Ảnh</p>
                            <p className="text-xs text-teal-800/80 mt-1 leading-relaxed">
                                Danh sách hiển thị **tất cả các buổi học** trong lộ trình khóa học. Bạn có thể chọn buổi đã học để tải lên video/ảnh thực hành hoặc xem nhận xét của Coach!
                            </p>
                        </div>
                    </div>

                    {/* Session List Title */}
                    <div className="flex items-center justify-between pt-1">
                        <h2 className="text-[13px] font-black text-gray-700 uppercase tracking-wider">
                            Lịch trình khóa học ({activeCourse.name})
                        </h2>
                        <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                            {activeSessions.length} buổi học
                        </span>
                    </div>

                    {/* Sessions Accordion List */}
                    <div className="space-y-3">
                        {activeSessions.length === 0 ? (
                            <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 text-gray-400">
                                <Calendar className="mx-auto mb-2 opacity-50" size={32} />
                                <p className="text-sm font-semibold">Chưa có lịch trình cho khóa học này</p>
                            </div>
                        ) : (
                            activeSessions.map((session) => {
                                const isExpanded = !!expandedSessionIds[session.id];
                                const hasMedia = !!session.uploadedMedia;
                                const attStyle = getAttendanceStyle(session.attendanceStatus);
                                const isFuture = session.attendanceStatus === 'Chưa diễn ra';

                                return (
                                    <div
                                        key={session.id}
                                        className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${isExpanded ? 'border-teal-500/30 ring-4 ring-teal-500/5' : 'border-gray-100'
                                            } ${isFuture ? 'opacity-75' : ''}`}
                                        style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}
                                    >
                                        {/* Card Header (Click to expand) */}
                                        <div
                                            onClick={() => toggleSession(session.id)}
                                            className="px-4 py-4 flex items-center justify-between cursor-pointer active:bg-gray-50/50 select-none"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Session Index Badge */}
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${isFuture
                                                    ? 'bg-gray-50 text-gray-400 border-gray-100'
                                                    : 'bg-teal-50 text-teal-700 border-teal-100'
                                                    }`}>
                                                    B{session.sessionNumber}
                                                </div>

                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900" style={{ fontSize: 14 }}>
                                                            {session.date}
                                                        </span>
                                                        <span
                                                            className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold"
                                                            style={{ background: attStyle.bg, color: attStyle.color }}
                                                        >
                                                            {attStyle.label}
                                                        </span>
                                                    </div>
                                                    <span style={{ fontSize: 11, color: '#9CA3AF' }} className="font-semibold block mt-0.5">
                                                        {session.time} · {session.coach} {session.attendanceStatus === 'Học bù' && ' (HLV sắp xếp)'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {/* Media status indicator */}
                                                {hasMedia ? (
                                                    <div
                                                        className="px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1"
                                                        style={{
                                                            background: getMediaStatusBadge(session.uploadedMedia!.status).bg,
                                                            color: getMediaStatusBadge(session.uploadedMedia!.status).color
                                                        }}
                                                    >
                                                        {session.uploadedMedia!.type === 'video' ? <Video size={10} /> : <Image size={10} />}
                                                        <span>{getMediaStatusBadge(session.uploadedMedia!.status).text}</span>
                                                    </div>
                                                ) : isFuture ? (
                                                    <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-gray-400">
                                                        Chưa học
                                                    </div>
                                                ) : (session.attendanceStatus === 'Vắng' || session.attendanceStatus === 'Nghỉ phép') ? (
                                                    <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-50 text-gray-400">
                                                        Không úp
                                                    </div>
                                                ) : (
                                                    <div className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#E76F51]/10 text-[#E76F51]">
                                                        Chưa úp
                                                    </div>
                                                )}

                                                {isExpanded ? (
                                                    <ChevronUp size={18} className="text-gray-400" />
                                                ) : (
                                                    <ChevronDown size={18} className="text-gray-400" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Card Content (Expandable) */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-1 border-t border-gray-50 bg-gray-50/30">
                                                {isFuture ? (
                                                    /* CASE 0: Future session (Cannot upload yet) */
                                                    <div className="p-4 mt-2 bg-white rounded-2xl border border-gray-100 text-center text-xs text-gray-400 font-semibold">
                                                        <Clock className="mx-auto text-gray-300 mb-1" size={20} />
                                                        Buổi học chưa diễn ra. Bạn chỉ có thể tải lên video tập luyện sau khi buổi học bắt đầu.
                                                    </div>
                                                ) : (session.attendanceStatus === 'Vắng' || session.attendanceStatus === 'Nghỉ phép') && !hasMedia ? (
                                                    /* CASE 0.5: Absent sessions with no media */
                                                    <div className="p-4 mt-2 bg-white rounded-2xl border border-gray-100 text-center text-xs text-gray-400 font-semibold flex flex-col items-center gap-3">
                                                        <div className="flex flex-col items-center">
                                                            <AlertCircle className="text-gray-300 mb-1" size={20} />
                                                            <p style={{ color: '#6B7280' }}>Bạn đã nghỉ học buổi học này.</p>
                                                        </div>
                                                        <button
                                                            onClick={() => onNavigate?.('member-makeup-register')}
                                                            className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-xl font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5 shadow-sm"
                                                        >
                                                            <Calendar size={13} />
                                                            Xin học bù
                                                        </button>
                                                    </div>
                                                ) : hasMedia ? (
                                                    /* CASE 1: Video / Image is already uploaded */
                                                    <div className="space-y-3 mt-2">
                                                        <div className="bg-white rounded-2xl p-3 border border-gray-100 flex gap-3">
                                                            {/* Media visual block */}
                                                            <div
                                                                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                                                                style={{
                                                                    background: session.uploadedMedia!.type === 'video' ? 'rgba(129,90,213,0.08)' : 'rgba(14,124,123,0.08)',
                                                                    border: '1px solid rgba(0,0,0,0.05)'
                                                                }}
                                                            >
                                                                {session.uploadedMedia!.type === 'video' ? (
                                                                    <>
                                                                        <Play size={18} className="text-purple-600 z-10" />
                                                                        {/* Mock video cover line */}
                                                                        <div className="absolute inset-0 bg-purple-900/5" />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Image size={18} className="text-teal-600 z-10" />
                                                                        {/* Mock image cover */}
                                                                        <div className="absolute inset-0 bg-teal-900/5" />
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="text-[13px] font-bold text-gray-800 truncate">
                                                                    {session.uploadedMedia!.fileName}
                                                                </h4>
                                                                <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400 font-medium">
                                                                    <span>{session.uploadedMedia!.fileSize}</span>
                                                                    <span>•</span>
                                                                    <span>Đã úp: {session.uploadedMedia!.uploadDate.split(' ')[0]}</span>
                                                                </div>
                                                            </div>

                                                            {/* Action buttons on uploaded media */}
                                                            {session.uploadedMedia!.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleDeleteMedia(session.id)}
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors self-center shrink-0 border border-gray-100"
                                                                    title="Xóa video"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            )}
                                                        </div>

                                                        {/* User Notes */}
                                                        {session.uploadedMedia!.notes && (
                                                            <div className="p-3 bg-white rounded-2xl border border-gray-100/50">
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mb-1">
                                                                    <MessageSquare size={12} />
                                                                    <span>GHI CHÚ HỌC VIÊN</span>
                                                                </div>
                                                                <p className="text-xs text-gray-700 font-medium leading-relaxed">
                                                                    {session.uploadedMedia!.notes}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Coach Feedback */}
                                                        {session.uploadedMedia!.status === 'approved' && session.uploadedMedia!.feedback && (
                                                            <div className="p-3 bg-teal-50/50 border border-teal-100 rounded-2xl">
                                                                <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold mb-1">
                                                                    <CheckCircle2 size={12} className="text-teal-600" />
                                                                    <span>PHẢN HỒI TỪ COACH</span>
                                                                </div>
                                                                <p className="text-xs text-teal-900 font-semibold leading-relaxed">
                                                                    {session.uploadedMedia!.feedback}
                                                                </p>
                                                            </div>
                                                        )}

                                                        {/* Rejected Feedback */}
                                                        {session.uploadedMedia!.status === 'rejected' && (
                                                            <div className="p-3 bg-red-50 border border-red-100 rounded-2xl text-xs text-red-800">
                                                                <div className="font-bold flex items-center gap-1 mb-1">
                                                                    <AlertCircle size={12} />
                                                                    <span>CẦN TẢI LẠI VIDEO</span>
                                                                </div>
                                                                <p className="font-medium">Video bị lỗi hoặc không rõ góc quay. Vui lòng thử tải lại video tập luyện rõ hơn.</p>
                                                            </div>
                                                        )}

                                                        {/* Pending State Feedback Message */}
                                                        {session.uploadedMedia!.status === 'pending' && (
                                                            <div className="p-3 bg-amber-50/50 border border-amber-100 rounded-2xl text-xs text-amber-800 flex gap-2">
                                                                <Clock size={14} className="shrink-0 text-amber-600 mt-0.5" />
                                                                <p className="font-medium">Đang chờ Coach phê duyệt và nhận xét. Bạn có thể xóa video này để tải lên video khác nếu cần.</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    /* CASE 2: No media uploaded yet (Show Upload Form) */
                                                    <div className="space-y-3 mt-2 bg-white p-4 rounded-2xl border border-gray-100">
                                                        <p className="text-[11px] font-black text-gray-400 uppercase tracking-wide">
                                                            Tải lên video/ảnh của buổi học này
                                                        </p>

                                                        {/* Media File Picker Box */}
                                                        <div
                                                            onClick={() => document.getElementById(`file-picker-${session.id}`)?.click()}
                                                            className="border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors"
                                                            style={{
                                                                borderColor: selectedFiles[session.id] ? '#0E7C7B' : '#E5E7EB',
                                                                background: selectedFiles[session.id] ? 'rgba(14,124,123,0.02)' : '#FAFAFA'
                                                            }}
                                                        >
                                                            <input
                                                                id={`file-picker-${session.id}`}
                                                                type="file"
                                                                accept="video/*,image/*"
                                                                onChange={(e) => handleFileChange(session.id, e)}
                                                                className="hidden"
                                                            />

                                                            <div className="flex flex-col items-center gap-1.5">
                                                                <div
                                                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                                                    style={{ background: selectedFiles[session.id] ? 'rgba(14,124,123,0.1)' : 'rgba(0,0,0,0.03)' }}
                                                                >
                                                                    {selectedFiles[session.id] && selectedFiles[session.id].type.startsWith('image/') ? (
                                                                        <Image size={18} className="text-teal-600" />
                                                                    ) : (
                                                                        <Video size={18} className={selectedFiles[session.id] ? "text-teal-600" : "text-gray-400"} />
                                                                    )}
                                                                </div>

                                                                <div className="text-center">
                                                                    <p className="text-xs font-bold text-gray-800 max-w-[200px] truncate mx-auto">
                                                                        {selectedFiles[session.id] ? selectedFiles[session.id].name : 'Nhấn vào đây để tải file lên'}
                                                                    </p>
                                                                    <p className="text-[10px] text-gray-400 mt-1">
                                                                        {selectedFiles[session.id]
                                                                            ? `${(selectedFiles[session.id].size / 1024 / 1024).toFixed(1)} MB`
                                                                            : 'Hỗ trợ Video (MP4, MOV) hoặc Ảnh (PNG, JPG)'
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Optional note input */}
                                                        {selectedFiles[session.id] && (
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400">GHI CHÚ KÈM THEO</label>
                                                                <input
                                                                    type="text"
                                                                    value={uploadNotes[session.id] || ''}
                                                                    onChange={(e) => handleNotesChange(session.id, e.target.value)}
                                                                    placeholder="Mô tả động tác tập sai, thắc mắc nhờ Coach sửa..."
                                                                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-teal-500 font-medium"
                                                                />
                                                            </div>
                                                        )}

                                                        {/* Submit Button */}
                                                        <button
                                                            onClick={() => handleUploadMedia(session.id)}
                                                            disabled={!selectedFiles[session.id] || uploadingSessionId === session.id}
                                                            className="w-full py-2.5 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                                                            style={{
                                                                background: selectedFiles[session.id] ? '#0E7C7B' : '#E5E7EB',
                                                                cursor: selectedFiles[session.id] ? 'pointer' : 'default'
                                                            }}
                                                        >
                                                            {uploadingSessionId === session.id ? (
                                                                <>
                                                                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                    <span>Đang tải lên...</span>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Upload size={14} />
                                                                    <span>Tải lên cho ngày {session.date}</span>
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};