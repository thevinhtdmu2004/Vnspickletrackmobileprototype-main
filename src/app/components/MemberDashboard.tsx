/**
 * MemberDashboard — VNS PickleTrack
 * Trang chủ Hội viên · Android 390 × 844
 */
import {
  Bell, Calendar, Clock, MapPin, ChevronRight,
  TrendingUp, BookOpen, MessageCircle,
  RefreshCw, AlertTriangle, User, Award, Percent,
  PauseCircle, XCircle
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const MEMBER = {
  name:        'Nguyễn Văn A',
  initials:    'NA',
  role:        'Hội viên Pickleball',
  remaining:   7,
  total:       12,
  packageName: 'Gói 12 buổi',
  status:      'active' as 'active' | 'suspended' | 'quit',
};

const NEXT_CLASS = {
  className: 'Beginner A',
  dayLabel:  'Thứ Tư',
  date:      '29/04/2026',
  dayNum:    '29',
  month:     'Th.4',
  timeStart: '18:00',
  timeEnd:   '19:30',
  court:     'Sân 1',
  coach:     'Coach Nam',
};

const MONTHLY_STATS = [
  { label: 'Đã học tháng này', value: 5,    unit: 'buổi', icon: BookOpen,     color: '#0E7C7B', bg: 'rgba(14,124,123,0.09)'   },
  { label: 'Tỷ lệ tham gia',   value: '90', unit: '%',    icon: Percent,      color: '#2A9D8F', bg: 'rgba(42,157,143,0.09)'   },
  { label: 'Buổi nghỉ phép',   value: 1,    unit: 'buổi', icon: PauseCircle,  color: '#E9C46A', bg: 'rgba(233,196,106,0.14)'  },
  { label: 'Buổi vắng',        value: 0,    unit: 'buổi', icon: XCircle,      color: '#9CA3AF', bg: 'rgba(156,163,175,0.10)'  },
];

/* Status config */
const STATUS_CFG = {
  active:    { label:'Đang học',  color:'#2A9D8F', bg:'rgba(42,157,143,0.15)',   dot:'#2A9D8F'  },
  suspended: { label:'Tạm nghỉ', color:'#E9C46A', bg:'rgba(233,196,106,0.20)',  dot:'#E9C46A'  },
  quit:      { label:'Đã nghỉ',  color:'#E76F51', bg:'rgba(231,111,81,0.15)',   dot:'#E76F51'  },
};

/* Sessions remaining urgency */
function getSessionUrgency(n: number) {
  if (n === 0) return { color:'#E76F51', gradient:'linear-gradient(135deg,#C62828 0%,#E76F51 100%)', shadow:'rgba(231,111,81,0.40)', label:'Đã hết buổi!',       alertBg:'rgba(231,111,81,0.15)', alertBorder:'rgba(231,111,81,0.35)', alertColor:'#C85A3D' };
  if (n <= 2)  return { color:'#E76F51', gradient:'linear-gradient(135deg,#C62828 0%,#E76F51 100%)', shadow:'rgba(231,111,81,0.38)', label:'Sắp hết buổi',       alertBg:'rgba(231,111,81,0.12)', alertBorder:'rgba(231,111,81,0.30)', alertColor:'#C85A3D' };
  if (n <= 5)  return { color:'#F4A261', gradient:'linear-gradient(135deg,#E76F51 0%,#F4A261 100%)', shadow:'rgba(244,162,97,0.35)', label:'Sắp hết — gia hạn sớm', alertBg:'rgba(244,162,97,0.12)', alertBorder:'rgba(244,162,97,0.30)', alertColor:'#9E5A00' };
  return               { color:'#2A9D8F', gradient:'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)', shadow:'rgba(14,124,123,0.30)', label:'',                   alertBg:'', alertBorder:'', alertColor:'' };
}

/* ══════════════════════════════════════════════════════
   PROPS
══════════════════════════════════════════════════════ */
interface MemberDashboardProps {
  onNavigate:      (screen: string) => void;
  onNotification?: () => void;
}

/* ══════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════ */
export function MemberDashboard({ onNavigate, onNotification }: MemberDashboardProps) {
  const urgency    = getSessionUrgency(MEMBER.remaining);
  const statusCfg  = STATUS_CFG[MEMBER.status];
  const progress   = MEMBER.remaining / MEMBER.total;   // remaining / total (buổi còn lại)
  const isLow      = MEMBER.remaining <= 5;
  const isCritical = MEMBER.remaining <= 2;

  return (
    <div className="flex flex-col min-h-screen" style={{ background:'#F0F4F5' }}>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background:'linear-gradient(148deg,#032C2C 0%,#053E3E 30%,#075E5D 60%,#0E7C7B 85%,#1A8E87 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute pointer-events-none" style={{ top:-36, right:-28, width:160, height:160, borderRadius:'50%', background:'rgba(255,255,255,0.045)' }} />
        <div className="absolute pointer-events-none" style={{ top:10, right:36, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.03)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-16, left:-12, width:110, height:110, borderRadius:'50%', background:'rgba(42,157,143,0.10)' }} />

        <div className="relative px-5 pt-14 pb-6">
          <div className="flex items-center justify-between">

            {/* Left: avatar + greeting */}
            <div className="flex items-center gap-3.5">
              {/* Avatar */}
              <div
                className="flex items-center justify-center rounded-2xl flex-shrink-0"
                style={{
                  width: 52, height: 52,
                  background: 'rgba(255,255,255,0.20)',
                  border:     '2.5px solid rgba(255,255,255,0.35)',
                  fontSize:   16, fontWeight: 900, color: 'white',
                  boxShadow:  '0 4px 14px rgba(0,0,0,0.18)',
                  letterSpacing: '0.02em',
                }}
              >
                {MEMBER.initials}
              </div>

              {/* Greeting */}
              <div>
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.52)', fontWeight:600, lineHeight:1.3 }}>
                  Xin chào 👋
                </p>
                <p style={{ fontSize:18, fontWeight:900, color:'white', lineHeight:1.25, letterSpacing:'-0.3px' }}>
                  {MEMBER.name}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Award style={{ width:11, height:11, color:'rgba(255,255,255,0.5)' }} />
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>
                    {MEMBER.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: bell */}
            <button
              onClick={onNotification}
              className="relative flex items-center justify-center rounded-2xl active:scale-90 transition-transform"
              style={{ width:44, height:44, background:'rgba(255,255,255,0.14)', border:'1.5px solid rgba(255,255,255,0.22)' }}
            >
              <Bell style={{ width:20, height:20, color:'rgba(255,255,255,0.85)' }} />
              {isCritical && (
                <span
                  className="absolute flex items-center justify-center rounded-full"
                  style={{ top:7, right:7, width:9, height:9, background:'#F4A261', border:'2px solid rgba(7,94,93,0.8)' }}
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SCROLLABLE BODY
      ════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-4 pt-4 space-y-4">

          {/* ─────────────────────────────────────────
              MAIN CARD — Sessions remaining
          ───────────────────────────────────────── */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: urgency.gradient,
              boxShadow:  `0 10px 40px ${urgency.shadow}`,
            }}
          >
            {/* Card body */}
            <div className="px-5 pt-5 pb-4">
              {/* Top row: label + status */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:700, letterSpacing:'0.05em' }}>
                    SỐ BUỔI CÒN LẠI
                  </p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', fontWeight:600, marginTop:1 }}>
                    {MEMBER.packageName}
                  </p>
                </div>

                {/* Status chip */}
                <div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
                  style={{ background:statusCfg.bg, border:`1.5px solid ${statusCfg.bg.replace('0.15','0.4').replace('0.20','0.45')}` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background: statusCfg.dot }} />
                  <span style={{ fontSize:11, fontWeight:800, color: statusCfg.color }}>{statusCfg.label}</span>
                </div>
              </div>

              {/* Big number + unit */}
              <div className="flex items-end gap-2 mb-4">
                <span
                  style={{
                    fontSize:76, fontWeight:900, color:'white', lineHeight:1,
                    letterSpacing:'-4px', textShadow:'0 4px 20px rgba(0,0,0,0.2)',
                  }}
                >
                  {MEMBER.remaining}
                </span>
                <div className="mb-2">
                  <span style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.75)' }}> / {MEMBER.total}</span>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', fontWeight:600, marginTop:1 }}>buổi</p>
                </div>

                {/* "Sắp hết buổi" badge — only when ≤2 */}
                {isCritical && (
                  <div
                    className="ml-auto mb-2 flex items-center gap-1.5 px-3 py-2 rounded-xl"
                    style={{ background:'rgba(255,255,255,0.22)', border:'1.5px solid rgba(255,255,255,0.35)', backdropFilter:'blur(6px)' }}
                  >
                    <AlertTriangle style={{ width:13, height:13, color:'white' }} />
                    <span style={{ fontSize:11, fontWeight:900, color:'white' }}>Sắp hết buổi</span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>Buổi còn lại</span>
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.7)', fontWeight:700 }}>
                    {MEMBER.remaining} / {MEMBER.total} buổi
                  </span>
                </div>
                <div
                  className="rounded-full overflow-hidden"
                  style={{ height:8, background:'rgba(255,255,255,0.18)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progress * 100}%`,
                      background: 'rgba(255,255,255,0.72)',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Renew CTA strip (only when low) */}
            {isLow && (
              <button
                onClick={() => onNavigate('member-renew-request')}
                className="flex items-center justify-center gap-2.5 w-full py-3.5 active:opacity-80 transition-opacity"
                style={{ background:'rgba(0,0,0,0.18)', borderTop:'1px solid rgba(255,255,255,0.14)' }}
              >
                <RefreshCw style={{ width:15, height:15, color:'rgba(255,255,255,0.85)' }} />
                <span style={{ fontSize:13, fontWeight:800, color:'white' }}>
                  Yêu cầu gia hạn gói học
                </span>
                <ChevronRight style={{ width:15, height:15, color:'rgba(255,255,255,0.6)' }} />
              </button>
            )}
          </div>

          {/* ─────────────────────────────────────────
              BUỔI HỌC TIẾP THEO
          ───────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p style={{ fontSize:12, fontWeight:800, color:'#374151', letterSpacing:'0.04em' }}>
                BUỔI HỌC TIẾP THEO
              </p>
              <button
                onClick={() => onNavigate('member-schedule')}
                className="flex items-center gap-1 active:opacity-60"
              >
                <span style={{ fontSize:11, fontWeight:700, color:'#0E7C7B' }}>Xem lịch</span>
                <ChevronRight style={{ width:13, height:13, color:'#0E7C7B' }} />
              </button>
            </div>

            <div
              className="bg-white rounded-3xl overflow-hidden"
              style={{ border:'1.5px solid rgba(14,124,123,0.16)', boxShadow:'0 4px 22px rgba(14,124,123,0.10)' }}
            >
              {/* Teal top accent line */}
              <div style={{ height:3, background:'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 100%)' }} />

              <div className="flex items-center gap-4 px-4 py-4">

                {/* Date block */}
                <div
                  className="flex flex-col items-center justify-center rounded-2xl flex-shrink-0"
                  style={{
                    width:60, height:66,
                    background:'linear-gradient(145deg,#0E7C7B,#2A9D8F)',
                    boxShadow:'0 6px 18px rgba(14,124,123,0.32)',
                  }}
                >
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.65)', fontWeight:700, letterSpacing:'0.02em' }}>
                    {NEXT_CLASS.dayLabel}
                  </span>
                  <span style={{ fontSize:28, fontWeight:900, color:'white', lineHeight:1.1 }}>
                    {NEXT_CLASS.dayNum}
                  </span>
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.6)', fontWeight:600 }}>
                    {NEXT_CLASS.month}
                  </span>
                </div>

                {/* Class info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p style={{ fontSize:17, fontWeight:900, color:'#1F2933' }}>
                      {NEXT_CLASS.className}
                    </p>
                    <span
                      className="px-2 py-0.5 rounded-lg"
                      style={{ fontSize:9, fontWeight:800, background:'rgba(14,124,123,0.10)', color:'#0E7C7B' }}
                    >
                      Sắp tới
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Clock style={{ width:12, height:12, color:'#6B7280' }} />
                    <span style={{ fontSize:13, color:'#4B5563', fontWeight:700 }}>
                      {NEXT_CLASS.timeStart} – {NEXT_CLASS.timeEnd}
                    </span>
                  </div>

                  {/* Court + Coach */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <MapPin style={{ width:11, height:11, color:'#9CA3AF' }} />
                      <span style={{ fontSize:11, color:'#6B7280', fontWeight:600 }}>{NEXT_CLASS.court}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User style={{ width:11, height:11, color:'#9CA3AF' }} />
                      <span style={{ fontSize:11, color:'#6B7280', fontWeight:600 }}>{NEXT_CLASS.coach}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ─────────────────────────────────────────
              QUICK ACTIONS
          ───────────────────────────────────────── */}
          <div>
            <p style={{ fontSize:12, fontWeight:800, color:'#374151', letterSpacing:'0.04em', marginBottom:10 }}>
              THAO TÁC NHANH
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label:    'Xem lịch học',
                  sub:      'Lịch Thứ 3 & Thứ 6',
                  icon:     Calendar,
                  iconBg:   'rgba(14,124,123,0.10)',
                  iconColor:'#0E7C7B',
                  border:   'rgba(14,124,123,0.18)',
                  screen:   'member-schedule',
                },
                {
                  label:    'Lịch sử học',
                  sub:      'Điểm danh chi tiết',
                  icon:     TrendingUp,
                  iconBg:   'rgba(42,157,143,0.10)',
                  iconColor:'#2A9D8F',
                  border:   'rgba(42,157,143,0.18)',
                  screen:   'member-attendance-history',
                },
                {
                  label:    'Yêu cầu gia hạn',
                  sub:      'Mua thêm buổi học',
                  icon:     RefreshCw,
                  iconBg:   'rgba(244,162,97,0.14)',
                  iconColor:'#E8832A',
                  border:   'rgba(244,162,97,0.30)',
                  screen:   'member-renew-request',
                },
                {
                  label:    'Liên hệ Coach',
                  sub:      'Gửi tin nhắn',
                  icon:     MessageCircle,
                  iconBg:   'rgba(129,90,213,0.10)',
                  iconColor:'#815AD5',
                  border:   'rgba(129,90,213,0.20)',
                  screen:   'member-contact',
                },
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => onNavigate(action.screen)}
                  className="flex flex-col gap-3 p-4 bg-white rounded-2xl text-left active:scale-95 transition-all"
                  style={{
                    border:     `1.5px solid ${action.border}`,
                    boxShadow:  '0 2px 12px rgba(0,0,0,0.05)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center rounded-xl"
                    style={{ width:40, height:40, background: action.iconBg }}
                  >
                    <action.icon style={{ width:18, height:18, color: action.iconColor }} />
                  </div>
                  {/* Label */}
                  <div>
                    <p style={{ fontSize:13, fontWeight:800, color:'#1F2933', lineHeight:1.25 }}>
                      {action.label}
                    </p>
                    <p style={{ fontSize:10, color:'#9CA3AF', fontWeight:500, marginTop:2 }}>
                      {action.sub}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────
              THỐNG KÊ THÁNG NÀY
          ───────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p style={{ fontSize:12, fontWeight:800, color:'#374151', letterSpacing:'0.04em' }}>
                THÁNG NÀY
              </p>
              <button
                onClick={() => onNavigate('member-attendance-history')}
                className="flex items-center gap-1 active:opacity-60"
              >
                <span style={{ fontSize:11, fontWeight:700, color:'#0E7C7B' }}>Chi tiết</span>
                <ChevronRight style={{ width:13, height:13, color:'#0E7C7B' }} />
              </button>
            </div>

            {/* 2 × 2 grid */}
            <div className="grid grid-cols-2 gap-3">
              {MONTHLY_STATS.map((stat, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl px-4 py-4"
                  style={{
                    border:    '1px solid rgba(0,0,0,0.06)',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Icon + value row */}
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{ width:36, height:36, background: stat.bg }}
                    >
                      <stat.icon style={{ width:16, height:16, color: stat.color }} />
                    </div>
                    <div className="text-right">
                      <span style={{ fontSize:28, fontWeight:900, color: stat.color, lineHeight:1, letterSpacing:'-1px' }}>
                        {stat.value}
                      </span>
                      <span style={{ fontSize:11, fontWeight:600, color: stat.color, opacity:0.7, marginLeft:2 }}>
                        {stat.unit}
                      </span>
                    </div>
                  </div>
                  {/* Label */}
                  <p style={{ fontSize:11, fontWeight:700, color:'#6B7280', lineHeight:1.3 }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────
              Gói học — bottom link
          ───────────────────────────────────────── */}
          <button
            onClick={() => onNavigate('member-package')}
            className="flex items-center gap-4 w-full bg-white rounded-2xl px-4 py-4 active:scale-95 transition-all"
            style={{
              border:    '1.5px solid rgba(14,124,123,0.15)',
              boxShadow: '0 3px 14px rgba(14,124,123,0.08)',
            }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width:44, height:44, background:'rgba(14,124,123,0.09)' }}
            >
              <BookOpen style={{ width:20, height:20, color:'#0E7C7B' }} />
            </div>

            {/* Info */}
            <div className="flex-1 text-left">
              <p style={{ fontSize:14, fontWeight:800, color:'#1F2933' }}>{MEMBER.packageName}</p>
              <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:500, marginTop:1 }}>
                Còn <strong style={{ color:'#0E7C7B' }}>{MEMBER.remaining} buổi</strong> · Xem chi tiết gói học
              </p>
            </div>

            {/* Arrow */}
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width:32, height:32, background:'rgba(14,124,123,0.08)' }}
            >
              <ChevronRight style={{ width:16, height:16, color:'#0E7C7B' }} />
            </div>
          </button>

        </div>{/* /px-4 */}
      </div>{/* /scrollable */}

    </div>
  );
}