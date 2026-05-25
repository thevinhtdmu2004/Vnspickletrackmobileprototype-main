import {
  ArrowLeft, Plus, Users, Clock, MapPin, ChevronRight,
  PlayCircle, BookOpen, Trophy, User2, Zap, Filter
} from 'lucide-react';
import { useState } from 'react';

interface ClassListScreenProps {
  onBack: () => void;
  onAddClass: () => void;
  onClassDetail: () => void;
  onCreateSession?: () => void;
}

type FilterType = 'all' | 'today' | 'available';
type Level = 'beginner' | 'intermediate' | 'advanced';

interface ClassItem {
  id: number;
  name: string;
  level: Level;
  scheduleDays: string;      // "2-4-6"
  scheduleLabel: string;     // "T2 · T4 · T6"
  todayDays: number[];       // [2,4,6] → Thu=5, so today is in [3,5,7]
  time: string;
  court: string;
  coach: string;
  students: number;
  maxStudents: number;
  hasToday: boolean;
  color: string;
  bgLight: string;
}

// Today = Thursday April 30 2026 → T5 = day index 4 (0=Sun,1=Mon,...,4=Thu)
// Vietnamese day notation: T2=Mon(1), T3=Tue(2), T4=Wed(3), T5=Thu(4), T6=Fri(5), T7=Sat(6)
const TODAY_VN_DAY = 5; // Thursday = T5

const CLASSES: ClassItem[] = [
  {
    id: 1,
    name: 'Beginner A',
    level: 'beginner',
    scheduleDays: '2-4-6',
    scheduleLabel: 'T2 · T4 · T6',
    todayDays: [2, 4, 6],
    time: '18:00 – 19:30',
    court: 'Sân 1',
    coach: 'Coach Nam',
    students: 8,
    maxStudents: 12,
    hasToday: [2, 4, 6].includes(TODAY_VN_DAY),
    color: '#2A9D8F',
    bgLight: 'rgba(42,157,143,0.1)',
  },
  {
    id: 2,
    name: 'Intermediate B',
    level: 'intermediate',
    scheduleDays: '3-5-7',
    scheduleLabel: 'T3 · T5 · T7',
    todayDays: [3, 5, 7],
    time: '19:30 – 21:00',
    court: 'Sân 2',
    coach: 'Coach Hùng',
    students: 6,
    maxStudents: 10,
    hasToday: [3, 5, 7].includes(TODAY_VN_DAY),
    color: '#F4A261',
    bgLight: 'rgba(244,162,97,0.1)',
  },
  {
    id: 3,
    name: 'Beginner B',
    level: 'beginner',
    scheduleDays: '3-5-7',
    scheduleLabel: 'T3 · T5 · T7',
    todayDays: [3, 5, 7],
    time: '07:00 – 08:30',
    court: 'Sân 1',
    coach: 'Coach Nam',
    students: 10,
    maxStudents: 10,
    hasToday: [3, 5, 7].includes(TODAY_VN_DAY),
    color: '#2A9D8F',
    bgLight: 'rgba(42,157,143,0.1)',
  },
  {
    id: 4,
    name: 'Advanced C',
    level: 'advanced',
    scheduleDays: '2-4-6',
    scheduleLabel: 'T2 · T4 · T6',
    todayDays: [2, 4, 6],
    time: '17:00 – 18:30',
    court: 'Sân 3',
    coach: 'Coach Linh',
    students: 5,
    maxStudents: 8,
    hasToday: [2, 4, 6].includes(TODAY_VN_DAY),
    color: '#E76F51',
    bgLight: 'rgba(231,111,81,0.1)',
  },
];

const LEVEL_CONFIG = {
  beginner:     { label: 'Beginner',     color: '#2A9D8F', bg: 'rgba(42,157,143,0.12)',  textClass: 'text-success' },
  intermediate: { label: 'Intermediate', color: '#F4A261', bg: 'rgba(244,162,97,0.12)', textClass: 'text-accent' },
  advanced:     { label: 'Advanced',     color: '#E76F51', bg: 'rgba(231,111,81,0.12)', textClass: 'text-destructive' },
};

const DAY_LABELS: Record<number, string> = { 2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7' };

export function ClassListScreen({ onBack, onAddClass, onClassDetail, onCreateSession }: ClassListScreenProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [creatingSession, setCreatingSession] = useState<number | null>(null);

  const totalStudents = CLASSES.reduce((s, c) => s + c.students, 0);
  const todayClasses  = CLASSES.filter(c => c.hasToday).length;
  const availClasses  = CLASSES.filter(c => c.students < c.maxStudents).length;

  const filters: { id: FilterType; label: string; count: number }[] = [
    { id: 'all',       label: 'Tất cả',        count: CLASSES.length },
    { id: 'today',     label: 'Hôm nay',        count: todayClasses },
    { id: 'available', label: 'Còn chỗ',        count: availClasses },
  ];

  const filtered = CLASSES.filter(c => {
    if (activeFilter === 'today')     return c.hasToday;
    if (activeFilter === 'available') return c.students < c.maxStudents;
    return true;
  });

  const handleCreateSession = (classId: number) => {
    setCreatingSession(classId);
    setTimeout(() => {
      setCreatingSession(null);
      onCreateSession?.();
    }, 700);
  };

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ── Header ── */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0E7C7B 0%, #075E5D 70%, #054A49 100%)' }}
      >
        {/* decorative blobs */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-8 -right-2 w-16 h-16 rounded-full bg-white/4 pointer-events-none" />

        {/* top bar */}
        <div className="flex items-center justify-between px-4 pt-10 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white" style={{ fontSize: '20px', fontWeight: 700 }}>Lớp học</h1>
              <p className="text-white/60" style={{ fontSize: '11px' }}>Quản lý tất cả lớp học</p>
            </div>
          </div>
          <button
            onClick={onAddClass}
            className="flex items-center gap-1.5 bg-accent text-white px-3.5 py-2 rounded-xl shadow-lg active:opacity-80 transition-opacity"
            style={{ fontSize: '13px', fontWeight: 600 }}
          >
            <Plus className="w-4 h-4" />
            Thêm lớp
          </button>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-3 gap-2.5 px-4 pb-5">
          {[
            { value: CLASSES.length, label: 'Tổng lớp',   icon: BookOpen },
            { value: totalStudents,  label: 'Học viên',    icon: Users },
            { value: todayClasses,   label: 'Hôm nay',     icon: Zap },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white/12 backdrop-blur-sm rounded-2xl p-3 border border-white/15">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-white/60" />
                  <span className="text-white/60" style={{ fontSize: '10px', fontWeight: 500 }}>{stat.label}</span>
                </div>
                <p className="text-white" style={{ fontSize: '26px', fontWeight: 800, lineHeight: 1 }}>{stat.value}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex-shrink-0 bg-card border-b border-border px-4 py-3">
        <div className="flex gap-2">
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border transition-all active:scale-95 ${
                activeFilter === f.id
                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                  : 'bg-background text-muted-foreground border-border'
              }`}
              style={{ fontSize: '12px', fontWeight: activeFilter === f.id ? 600 : 400 }}
            >
              {f.label}
              <span
                className={`rounded-full w-4 h-4 flex items-center justify-center ${
                  activeFilter === f.id ? 'bg-white/25 text-white' : 'bg-muted text-muted-foreground'
                }`}
                style={{ fontSize: '10px', fontWeight: 700 }}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Class List ── */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-3">
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <BookOpen className="w-12 h-12 mb-3 opacity-30" />
              <p style={{ fontSize: '15px' }}>Không có lớp nào</p>
            </div>
          )}

          {filtered.map(cls => {
            const lvl = LEVEL_CONFIG[cls.level];
            const isFull = cls.students >= cls.maxStudents;
            const fillPct = Math.round((cls.students / cls.maxStudents) * 100);
            const isCreating = creatingSession === cls.id;

            return (
              <div
                key={cls.id}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
              >
                {/* ── Today indicator strip ── */}
                {cls.hasToday && (
                  <div
                    className="flex items-center gap-1.5 px-4 py-1.5"
                    style={{ background: 'rgba(244,162,97,0.12)', borderBottom: '1px solid rgba(244,162,97,0.2)' }}
                  >
                    <Zap className="w-3 h-3 text-accent" />
                    <span className="text-accent" style={{ fontSize: '11px', fontWeight: 600 }}>
                      Có lịch hôm nay — {cls.time}
                    </span>
                  </div>
                )}

                {/* ── Card body ── */}
                <div className="p-4">
                  {/* Row 1: name + badges */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      {/* Level color block */}
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: lvl.bg }}
                      >
                        <Trophy className="w-5 h-5" style={{ color: lvl.color }} />
                      </div>
                      <div>
                        <h3 className="text-foreground" style={{ fontSize: '16px', fontWeight: 700 }}>
                          {cls.name}
                        </h3>
                        <span
                          className="inline-block px-2 py-0.5 rounded-full"
                          style={{ fontSize: '10px', fontWeight: 600, background: lvl.bg, color: lvl.color }}
                        >
                          {lvl.label}
                        </span>
                      </div>
                    </div>

                    {/* Capacity badge */}
                    <span
                      className={`px-2.5 py-1 rounded-xl border ${
                        isFull
                          ? 'bg-destructive/10 text-destructive border-destructive/20'
                          : 'bg-success/10 text-success border-success/20'
                      }`}
                      style={{ fontSize: '12px', fontWeight: 600 }}
                    >
                      {isFull ? 'Đầy lớp' : 'Còn chỗ'}
                    </span>
                  </div>

                  {/* Row 2: Info pills */}
                  <div className="space-y-2 mb-3">
                    {/* Schedule + Time */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Day pills */}
                      <div className="flex items-center gap-1">
                        {cls.todayDays.map(d => (
                          <span
                            key={d}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border ${
                              d === TODAY_VN_DAY
                                ? 'bg-primary text-primary-foreground border-primary'
                                : 'bg-muted text-muted-foreground border-border'
                            }`}
                            style={{ fontSize: '10px', fontWeight: 700 }}
                          >
                            {DAY_LABELS[d]}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" />
                        <span style={{ fontSize: '13px', fontWeight: 500 }}>{cls.time}</span>
                      </div>
                    </div>

                    {/* Court + Coach */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary/60" />
                        <span style={{ fontSize: '13px' }}>{cls.court}</span>
                      </div>
                      <div className="w-1 h-1 rounded-full bg-border" />
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <User2 className="w-3.5 h-3.5 text-primary/60" />
                        <span style={{ fontSize: '13px' }}>{cls.coach}</span>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Capacity bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                          {cls.students} học viên
                        </span>
                      </div>
                      <span
                        className={`${isFull ? 'text-destructive' : 'text-muted-foreground'}`}
                        style={{ fontSize: '12px', fontWeight: 600 }}
                      >
                        {cls.students}/{cls.maxStudents}
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${fillPct}%`,
                          background: isFull ? '#E76F51' : fillPct >= 80 ? '#E9C46A' : '#2A9D8F',
                        }}
                      />
                    </div>
                  </div>

                  {/* ── Action buttons ── */}
                  <div className="flex gap-2">
                    {/* Chi tiết */}
                    <button
                      onClick={onClassDetail}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-primary/30 bg-primary/6 text-primary active:bg-primary/15 transition-colors"
                      style={{ fontSize: '13px', fontWeight: 500 }}
                    >
                      Chi tiết
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Tạo buổi hôm nay */}
                    <button
                      onClick={() => handleCreateSession(cls.id)}
                      disabled={!cls.hasToday}
                      className={`flex-[1.6] flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all active:scale-95 ${
                        cls.hasToday
                          ? isCreating
                            ? 'bg-success text-white shadow-md'
                            : 'bg-accent text-white shadow-sm active:shadow-md'
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                      style={{ fontSize: '13px', fontWeight: 600 }}
                    >
                      {isCreating ? (
                        <>
                          <span>✓</span>
                          <span>Đã tạo!</span>
                        </>
                      ) : (
                        <>
                          <PlayCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{cls.hasToday ? 'Tạo buổi hôm nay' : 'Không có lịch'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Bottom spacer */}
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}
