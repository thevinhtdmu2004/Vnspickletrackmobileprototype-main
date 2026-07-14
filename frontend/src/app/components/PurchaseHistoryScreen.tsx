import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Inbox,
  Search,
  CircleCheck,
  TimerReset,
} from 'lucide-react';

type PurchaseStatus = 'all' | 'in-progress' | 'completed';

interface PurchaseItem {
  id: number;
  courseName: string;
  coach: string;
  purchasedAt: string;
  pricePaid: string;
  status: Exclude<PurchaseStatus, 'all'>;
  sessions: string;
  nextSchedule: string;
  actionLabel: string;
}

interface PurchaseHistoryScreenProps {
  onBack: () => void;
  onCourseDetail?: (courseId: number) => void;
  onViewSchedule?: (courseId: number) => void;
  onContinueLearning?: (courseId: number) => void;
}

const FILTERS: { key: PurchaseStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'in-progress', label: 'Đang học' },
  { key: 'completed', label: 'Đã học' },
];

const STATUS_META: Record<Exclude<PurchaseStatus, 'all'>, {
  label: string;
  color: string;
  bg: string;
  icon: typeof CircleCheck;
}> = {
  'in-progress': {
    label: 'Đang học',
    color: '#0E7C7B',
    bg: 'rgba(14,124,123,0.12)',
    icon: TimerReset,
  },
  completed: {
    label: 'Đã học xong',
    color: '#2A9D8F',
    bg: 'rgba(42,157,143,0.12)',
    icon: CircleCheck,
  },
};

const PURCHASES: PurchaseItem[] = [
  {
    id: 1,
    courseName: 'Khóa Pickleball Cơ bản A',
    coach: 'Coach Nam',
    purchasedAt: '15/06/2026',
    pricePaid: '1.200.000đ',
    status: 'in-progress',
    sessions: '8/12 buổi đã dùng',
    nextSchedule: 'Thứ 2 · 18:00',
    actionLabel: 'Tiếp tục học',
  },
  {
    id: 2,
    courseName: 'Pickleball Trung cấp B',
    coach: 'Coach Hùng',
    purchasedAt: '20/04/2026',
    pricePaid: '1.500.000đ',
    status: 'completed',
    sessions: '12/12 buổi đã dùng',
    nextSchedule: 'Đã hoàn tất',
    actionLabel: 'Xem chi tiết quá trình đã học',
  },
];

function EmptyState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-3xl bg-teal-50 flex items-center justify-center mb-4 shadow-sm">
        <Inbox className="w-8 h-8 text-teal-700" />
      </div>
      <h3 className="text-[16px] font-black text-slate-800">
        {query ? 'Không tìm thấy khóa học' : 'Chưa có lịch sử mua'}
      </h3>
      <p className="text-[12px] text-slate-500 font-medium mt-2 leading-relaxed max-w-[260px]">
        {query
          ? 'Thử đổi từ khóa tìm kiếm hoặc bỏ bộ lọc để xem các khóa học đã mua.'
          : 'Lịch sử mua khóa học của bạn sẽ hiển thị tại đây.'}
      </p>
    </div>
  );
}

export function PurchaseHistoryScreen({
  onBack,
  onCourseDetail,
  onViewSchedule,
  onContinueLearning,
}: PurchaseHistoryScreenProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<PurchaseStatus>('all');

  const filteredPurchases = useMemo(() => {
    const q = search.trim().toLowerCase();
    return PURCHASES.filter(item => {
      const matchesSearch =
        item.courseName.toLowerCase().includes(q) ||
        item.coach.toLowerCase().includes(q);
      const matchesFilter = activeFilter === 'all' || item.status === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [search, activeFilter]);

  const handlePrimaryAction = (item: PurchaseItem) => {
    if (item.status === 'in-progress') return onViewSchedule?.(item.id);
    if (item.status === 'completed') return onContinueLearning?.(item.id);
    return onCourseDetail?.(item.id);
  };

  return (
    <div className="flex flex-col h-screen bg-[#F4F7F7]">
      {/* Header */}
      <div className="relative overflow-hidden flex-shrink-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, #063B3A 0%, #0B6664 38%, #0E7C7B 68%, #11A39E 100%)',
          }}
        />
        <div className="absolute -top-10 -right-8 w-36 h-36 rounded-full bg-white/8 blur-2xl" />
        <div className="absolute -bottom-12 -left-10 w-40 h-40 rounded-full bg-teal-300/10 blur-2xl" />
        <div className="relative px-4 pt-14 pb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/12 border border-white/15 backdrop-blur-sm flex items-center justify-center active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[0.12em] text-white/65">
                HỘI VIÊN
              </p>
              <h1 className="text-[21px] font-black text-white leading-tight drop-shadow-sm">
                Lịch sử mua khóa học
              </h1>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/12 border border-white/15 backdrop-blur-sm px-3 py-2 text-white">
              <p className="text-[10px] text-white/70">Đang học</p>
              <p className="text-[16px] font-black">{PURCHASES.filter(p => p.status === 'in-progress').length}</p>
            </div>
            <div className="rounded-2xl bg-white/12 border border-white/15 backdrop-blur-sm px-3 py-2 text-white">
              <p className="text-[10px] text-white/70">Đã học xong</p>
              <p className="text-[16px] font-black">{PURCHASES.filter(p => p.status === 'completed').length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm khóa học hoặc HLV..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl border border-border/60 text-sm outline-none focus:ring-2 focus:ring-teal-700/10 shadow-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="px-4 pt-4 pb-2 flex-shrink-0">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(filter => {
            const active = activeFilter === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key)}
                className={`px-4 py-1.5 rounded-full text-[12px] font-bold whitespace-nowrap border transition-all ${
                  active
                    ? 'bg-teal-700 text-white border-teal-700 shadow-md'
                    : 'bg-white text-slate-500 border-border/70'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2">
        {filteredPurchases.length === 0 ? (
          <EmptyState query={search} />
        ) : (
          <div className="space-y-4">
            {filteredPurchases.map(item => {
              const meta = STATUS_META[item.status];
              const StatusIcon = meta.icon;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-[28px] border border-border/60 shadow-sm overflow-hidden"
                >
                  <div className="flex gap-3 p-3">
                    <div className="w-[62px] shrink-0">
                      <div className="w-[62px] h-[72px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-center leading-tight">
                        <span className="text-[10px] font-black text-slate-500">
                          {item.purchasedAt.split('/')[1]}
                        </span>
                        <span className="text-[22px] font-black text-slate-400">
                          {item.purchasedAt.split('/')[0]}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400">
                          2026
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 border-l border-border/60 pl-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="text-[15px] font-black text-slate-900 leading-tight">
                            {item.courseName}
                          </h3>
                          <div className="mt-1 flex items-center gap-2 text-[12px] text-slate-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{item.purchasedAt}</span>
                            <span>•</span>
                            <span>{item.coach}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[15px] font-black text-teal-700">
                            {item.pricePaid}
                          </p>
                          <span
                            className="inline-flex mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold items-center gap-1"
                            style={{
                              background: meta.bg,
                              color: meta.color,
                            }}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {meta.label}
                          </span>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="text-[12px] text-slate-500 font-medium">
                          {item.sessions}
                        </div>

                        <button
                          onClick={() => handlePrimaryAction(item)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-teal-700 text-white text-[12px] font-bold active:scale-95 transition-transform"
                        >
                          {item.actionLabel}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}