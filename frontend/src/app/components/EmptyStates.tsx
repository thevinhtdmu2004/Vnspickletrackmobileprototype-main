/**
 * VNS PickleTrack — Empty States
 * Reusable EmptyState component + 6 preset variants
 */

import {
  Users, CalendarDays, ClipboardList,
  CheckCircle2, Wallet, History,
  Plus, Sparkles, ArrowLeft, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useState } from 'react';

/* ══════════════════════════════════════════════
   Core EmptyState component
   ══════════════════════════════════════════════ */

interface EmptyStateProps {
  icon:         React.ReactNode;
  iconBg:       string;          // CSS gradient / color string
  iconRing:     string;          // border color rgba
  accentColor:  string;          // hex color for CTA, dots, etc.
  title:        string;
  message:      string;
  ctaLabel?:    string;
  ctaIcon?:     React.ReactNode;
  onCta?:       () => void;
  /** Extra content below message (optional) */
  extra?:       React.ReactNode;
}

export function EmptyState({
  icon, iconBg, iconRing, accentColor,
  title, message, ctaLabel, ctaIcon, onCta, extra,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-8 py-10 text-center select-none">

      {/* ── Illustration area ── */}
      <div className="relative mb-8">
        {/* Outermost ring — very subtle */}
        <div
          className="w-36 h-36 rounded-full flex items-center justify-center"
          style={{ background: `${accentColor}08`, border: `1.5px dashed ${accentColor}25` }}
        >
          {/* Middle ring */}
          <div
            className="w-28 h-28 rounded-full flex items-center justify-center"
            style={{ background: `${accentColor}12`, border: `1.5px solid ${accentColor}22` }}
          >
            {/* Inner filled circle */}
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: iconBg,
                border: `2px solid ${iconRing}`,
                boxShadow: `0 8px 32px ${accentColor}25`,
              }}
            >
              {icon}
            </div>
          </div>
        </div>

        {/* Floating sparkle dots */}
        <div
          className="absolute top-1 right-2 w-3 h-3 rounded-full"
          style={{ background: `${accentColor}35` }}
        />
        <div
          className="absolute bottom-2 left-3 w-2 h-2 rounded-full"
          style={{ background: `${accentColor}25` }}
        />
        <div
          className="absolute top-6 left-0 w-1.5 h-1.5 rounded-full"
          style={{ background: `${accentColor}30` }}
        />
      </div>

      {/* ── Text ── */}
      <h3
        className="text-gray-900 mb-2"
        style={{ fontSize: '18px', fontWeight: 800, lineHeight: 1.3 }}
      >
        {title}
      </h3>
      <p
        className="text-gray-500 max-w-[260px] leading-relaxed"
        style={{ fontSize: '13px' }}
      >
        {message}
      </p>

      {/* ── Extra slot ── */}
      {extra && <div className="mt-4 w-full max-w-[280px]">{extra}</div>}

      {/* ── CTA button ── */}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-7 flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white transition-all active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}CC 100%)`,
            fontSize: '14px',
            fontWeight: 700,
            boxShadow: `0 6px 20px ${accentColor}40`,
          }}
        >
          {ctaIcon ?? <Plus className="w-4 h-4" />}
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   6 Preset empty-state configs
   ══════════════════════════════════════════════ */

export const EMPTY_STATE_CONFIGS = {

  /* 1 ── Chưa có học viên */
  students: {
    icon:        <Users className="w-9 h-9 text-[#0E7C7B]" />,
    iconBg:      'linear-gradient(145deg,rgba(14,124,123,0.18) 0%,rgba(42,157,143,0.12) 100%)',
    iconRing:    'rgba(14,124,123,0.25)',
    accentColor: '#0E7C7B',
    title:       'Chưa có học viên nào',
    message:     'Hãy thêm học viên đầu tiên để bắt đầu quản lý lớp học.',
    ctaLabel:    'Thêm học viên',
    ctaIcon:     <Plus className="w-4 h-4" />,
  },

  /* 2 ── Chưa có lớp học */
  classes: {
    icon:        <CalendarDays className="w-9 h-9 text-[#264653]" />,
    iconBg:      'linear-gradient(145deg,rgba(38,70,83,0.16) 0%,rgba(38,70,83,0.08) 100%)',
    iconRing:    'rgba(38,70,83,0.22)',
    accentColor: '#264653',
    title:       'Chưa có lớp học nào',
    message:     'Tạo lớp học để sắp xếp lịch và điểm danh học viên.',
    ctaLabel:    'Thêm lớp học',
    ctaIcon:     <Plus className="w-4 h-4" />,
  },

  /* 3 ── Hôm nay chưa có buổi học */
  todaySessions: {
    icon:        <ClipboardList className="w-9 h-9 text-[#F4A261]" />,
    iconBg:      'linear-gradient(145deg,rgba(244,162,97,0.22) 0%,rgba(244,162,97,0.10) 100%)',
    iconRing:    'rgba(244,162,97,0.35)',
    accentColor: '#F4A261',
    title:       'Hôm nay chưa có buổi học',
    message:     'Tạo buổi học từ lớp để bắt đầu điểm danh hôm nay.',
    ctaLabel:    'Tạo buổi học hôm nay',
    ctaIcon:     <Plus className="w-4 h-4" />,
  },

  /* 4 ── Không có học viên sắp hết buổi (positive state) */
  noExpiring: {
    icon:        <CheckCircle2 className="w-9 h-9 text-[#2A9D8F]" />,
    iconBg:      'linear-gradient(145deg,rgba(42,157,143,0.20) 0%,rgba(42,157,143,0.08) 100%)',
    iconRing:    'rgba(42,157,143,0.30)',
    accentColor: '#2A9D8F',
    title:       'Không có học viên sắp hết buổi',
    message:     'Tình hình lớp học đang ổn định. Tốt lắm!',
    ctaLabel:    undefined,
    ctaIcon:     undefined,
  },

  /* 5 ── Chưa có thanh toán */
  payments: {
    icon:        <Wallet className="w-9 h-9 text-[#815AD5]" />,
    iconBg:      'linear-gradient(145deg,rgba(129,90,213,0.18) 0%,rgba(129,90,213,0.08) 100%)',
    iconRing:    'rgba(129,90,213,0.25)',
    accentColor: '#815AD5',
    title:       'Chưa có lịch sử thanh toán',
    message:     'Khi học viên gia hạn gói học, giao dịch sẽ hiển thị tại đây.',
    ctaLabel:    undefined,
    ctaIcon:     undefined,
  },

  /* 6 ── Chưa có lịch sử điểm danh */
  attendance: {
    icon:        <History className="w-9 h-9 text-[#5C7FA3]" />,
    iconBg:      'linear-gradient(145deg,rgba(92,127,163,0.18) 0%,rgba(92,127,163,0.08) 100%)',
    iconRing:    'rgba(92,127,163,0.25)',
    accentColor: '#5C7FA3',
    title:       'Chưa có lịch sử điểm danh',
    message:     'Lịch sử sẽ xuất hiện sau khi học viên tham gia buổi học.',
    ctaLabel:    undefined,
    ctaIcon:     undefined,
  },
} as const;

/* ══════════════════════════════════════════════
   Showcase screen — browse all 6 states
   ══════════════════════════════════════════════ */

const SLIDES = [
  {
    key: 'students'      as const,
    tag: 'Học viên',
    tagColor: '#0E7C7B',
    desc: 'Students list — no students yet',
  },
  {
    key: 'classes'       as const,
    tag: 'Lớp học',
    tagColor: '#264653',
    desc: 'Class list — no classes yet',
  },
  {
    key: 'todaySessions' as const,
    tag: 'Hôm nay',
    tagColor: '#F4A261',
    desc: 'Today screen — no sessions today',
  },
  {
    key: 'noExpiring'    as const,
    tag: 'Sắp hết buổi',
    tagColor: '#2A9D8F',
    desc: 'Report screen — nothing expiring',
  },
  {
    key: 'payments'      as const,
    tag: 'Thanh toán',
    tagColor: '#815AD5',
    desc: 'Payment history — empty',
  },
  {
    key: 'attendance'    as const,
    tag: 'Điểm danh',
    tagColor: '#5C7FA3',
    desc: 'Attendance history — empty',
  },
];

interface EmptyStatesScreenProps {
  onBack:          () => void;
  onAddStudent?:   () => void;
  onAddClass?:     () => void;
  onCreateSession?: () => void;
}

export function EmptyStatesScreen({
  onBack, onAddStudent, onAddClass, onCreateSession,
}: EmptyStatesScreenProps) {
  const [idx, setIdx] = useState(0);

  const slide  = SLIDES[idx];
  const cfg    = EMPTY_STATE_CONFIGS[slide.key];

  const ctaMap: Record<string, (() => void) | undefined> = {
    students:      onAddStudent,
    classes:       onAddClass,
    todaySessions: onCreateSession,
  };

  function prev() { setIdx(i => (i - 1 + SLIDES.length) % SLIDES.length); }
  function next() { setIdx(i => (i + 1) % SLIDES.length); }

  return (
    <div className="flex flex-col h-screen bg-[#F7F9FA]">

      {/* ══ Header ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-14 -right-3 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />

        <div className="flex items-center gap-3 px-4 pt-10 pb-5">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-white/60" style={{ fontSize: '11px' }}>Component Library</p>
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>
              Empty States
            </h1>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white/80" />
            <span className="text-white/80" style={{ fontSize: '11px', fontWeight: 700 }}>
              {idx + 1} / {SLIDES.length}
            </span>
          </div>
        </div>
      </div>

      {/* ══ Pill tabs ══ */}
      <div className="flex-shrink-0 px-4 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.key}
              onClick={() => setIdx(i)}
              className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs transition-all"
              style={{
                background: i === idx ? s.tagColor : 'rgba(0,0,0,0.05)',
                color:      i === idx ? 'white'    : '#6B7280',
                fontWeight: i === idx ? 700         : 500,
                boxShadow:  i === idx ? `0 4px 12px ${s.tagColor}40` : 'none',
              }}
            >
              {s.tag}
            </button>
          ))}
        </div>
      </div>

      {/* ══ Main preview card ══ */}
      <div className="flex-1 flex flex-col px-4 pb-4 overflow-hidden">
        <div
          className="flex-1 bg-white rounded-3xl overflow-hidden flex flex-col"
          style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.05)' }}
        >
          {/* Card top label */}
          <div
            className="flex items-center gap-2 px-5 py-3.5 border-b"
            style={{ borderColor: 'rgba(0,0,0,0.05)' }}
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ background: slide.tagColor }}
            />
            <p className="text-xs text-gray-500 flex-1" style={{ fontWeight: 600 }}>
              {slide.desc}
            </p>
            <div
              className="px-2.5 py-1 rounded-lg"
              style={{ background: `${slide.tagColor}12` }}
            >
              <span style={{ fontSize: '10px', fontWeight: 800, color: slide.tagColor }}>
                #{idx + 1}
              </span>
            </div>
          </div>

          {/* Empty state content */}
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              {...cfg}
              onCta={ctaMap[slide.key]}
            />
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center gap-4 mt-4 px-1">
          {/* Prev */}
          <button
            onClick={prev}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center
              active:bg-gray-50 transition-colors flex-shrink-0"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          {/* Dots */}
          <div className="flex-1 flex items-center justify-center gap-2">
            {SLIDES.map((s, i) => (
              <button
                key={s.key}
                onClick={() => setIdx(i)}
                className="transition-all rounded-full"
                style={{
                  width:   i === idx ? 24 : 8,
                  height:  8,
                  background: i === idx ? s.tagColor : 'rgba(0,0,0,0.12)',
                }}
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="w-11 h-11 rounded-2xl bg-white border border-gray-100 flex items-center justify-center
              active:bg-gray-50 transition-colors flex-shrink-0"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

    </div>
  );
}

/* ══════════════════════════════════════════════
   Quick-use preset wrappers (drop-in per screen)
   ══════════════════════════════════════════════ */

export function EmptyStudents({ onAdd }: { onAdd?: () => void }) {
  const c = EMPTY_STATE_CONFIGS.students;
  return <EmptyState {...c} onCta={onAdd} />;
}

export function EmptyClasses({ onAdd }: { onAdd?: () => void }) {
  const c = EMPTY_STATE_CONFIGS.classes;
  return <EmptyState {...c} onCta={onAdd} />;
}

export function EmptyTodaySessions({ onCreate }: { onCreate?: () => void }) {
  const c = EMPTY_STATE_CONFIGS.todaySessions;
  return <EmptyState {...c} onCta={onCreate} />;
}

export function EmptyNoExpiring() {
  const c = EMPTY_STATE_CONFIGS.noExpiring;
  return <EmptyState {...c} />;
}

export function EmptyPayments() {
  const c = EMPTY_STATE_CONFIGS.payments;
  return <EmptyState {...c} />;
}

export function EmptyAttendance() {
  const c = EMPTY_STATE_CONFIGS.attendance;
  return <EmptyState {...c} />;
}
