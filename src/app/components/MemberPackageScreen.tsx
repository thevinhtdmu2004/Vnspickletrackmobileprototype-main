/**
 * MemberPackageScreen — VNS PickleTrack
 * Gói học của tôi · Read-only · Học viên / Hội viên
 * Android 390 × 844
 */
import { useState } from 'react';
import {
  BookOpen, Calendar, CheckCircle2, Clock,
  RefreshCw, AlertTriangle, ChevronRight,
  Zap, Info, Send, Star, Shield, TrendingUp
} from 'lucide-react';

/* ══════════════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════════════ */
const PACKAGE = {
  name:      'Gói 12 buổi',
  total:     12,
  attended:  5,
  remaining: 7,
  startDate: '01/04/2026',
  coach:     'Coach Nam',
  class:     'Beginner A',
};

/* ── Status logic ──────────────────────────────────── */
function getStatus(remaining: number) {
  if (remaining === 0) return {
    label: 'Đã hết buổi', color: '#E76F51', bg: 'rgba(231,111,81,0.14)',
    border: 'rgba(231,111,81,0.32)', dot: '#E76F51',
    gradient: 'linear-gradient(135deg,#C62828 0%,#E76F51 100%)',
    shadow: 'rgba(231,111,81,0.40)', cardBg: 'linear-gradient(135deg,#C62828 0%,#E76F51 100%)',
    alert: true,
  };
  if (remaining <= 2) return {
    label: 'Sắp hết buổi', color: '#E76F51', bg: 'rgba(231,111,81,0.12)',
    border: 'rgba(231,111,81,0.28)', dot: '#E76F51',
    gradient: 'linear-gradient(135deg,#C62828 0%,#E76F51 100%)',
    shadow: 'rgba(231,111,81,0.38)', cardBg: 'linear-gradient(135deg,#BF360C 0%,#E76F51 100%)',
    alert: true,
  };
  return {
    label: 'Đang hoạt động', color: '#2A9D8F', bg: 'rgba(42,157,143,0.13)',
    border: 'rgba(42,157,143,0.28)', dot: '#2A9D8F',
    gradient: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
    shadow: 'rgba(14,124,123,0.32)', cardBg: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
    alert: false,
  };
}

/* ── Package suggestions ──────────────────────────── */
const SUGGESTIONS = [
  {
    id: 1, name: 'Gói 8 buổi',  sessions: 8,  price: '1.600.000đ',
    priceNum: 1600000, perSession: '200.000đ/buổi',
    tag: '', highlight: false,
  },
  {
    id: 2, name: 'Gói 12 buổi', sessions: 12, price: '2.400.000đ',
    priceNum: 2400000, perSession: '200.000đ/buổi',
    tag: 'Đang dùng', highlight: true,
  },
  {
    id: 3, name: 'Gói 16 buổi', sessions: 16, price: '3.000.000đ',
    priceNum: 3000000, perSession: '187.500đ/buổi',
    tag: 'Tiết kiệm nhất', highlight: false,
  },
];

/* ══════════════════════════════════════════════════════
   RENEW BOTTOM SHEET  (modal-like overlay)
══════════════════════════════════════════════════════ */
interface RenewSheetProps {
  onClose:  () => void;
  onSubmit: (pkg: typeof SUGGESTIONS[0]) => void;
}
function RenewSheet({ onClose, onSubmit }: RenewSheetProps) {
  const [selected, setSelected] = useState<number>(2); // default Gói 12
  const pkg = SUGGESTIONS.find(s => s.id === selected)!;

  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl overflow-hidden"
        style={{ background: 'white', boxShadow: '0 -12px 48px rgba(0,0,0,0.18)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.12)' }} />
        </div>

        <div className="px-5 pb-8">
          {/* Title */}
          <div className="flex items-center gap-3 mb-5 mt-2">
            <div className="flex items-center justify-center rounded-2xl"
                 style={{ width:42, height:42, background:'rgba(14,124,123,0.10)' }}>
              <RefreshCw style={{ width:18, height:18, color:'#0E7C7B' }} />
            </div>
            <div>
              <p style={{ fontSize:17, fontWeight:900, color:'#1F2933' }}>Yêu cầu gia hạn</p>
              <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:500 }}>Chọn gói phù hợp</p>
            </div>
          </div>

          {/* Package options */}
          <div className="space-y-2.5 mb-5">
            {SUGGESTIONS.map(pkg => {
              const isSelected = selected === pkg.id;
              const isCurrent  = pkg.tag === 'Đang dùng';
              return (
                <button
                  key={pkg.id}
                  onClick={() => setSelected(pkg.id)}
                  className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-left transition-all active:scale-98"
                  style={{
                    border:     isSelected ? '2px solid #0E7C7B' : '1.5px solid rgba(0,0,0,0.09)',
                    background: isSelected ? 'rgba(14,124,123,0.06)' : 'white',
                    boxShadow:  isSelected ? '0 4px 16px rgba(14,124,123,0.14)' : 'none',
                  }}
                >
                  {/* Radio */}
                  <div
                    className="flex items-center justify-center rounded-full flex-shrink-0"
                    style={{
                      width: 22, height: 22,
                      border: isSelected ? '2px solid #0E7C7B' : '2px solid #D1D5DB',
                      background: isSelected ? '#0E7C7B' : 'white',
                    }}
                  >
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'white' }} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize:14, fontWeight:800, color: isSelected ? '#0E7C7B' : '#1F2933' }}>
                        {pkg.name}
                      </span>
                      {pkg.tag && (
                        <span
                          className="px-2 py-0.5 rounded-lg"
                          style={{
                            fontSize:   9,
                            fontWeight: 800,
                            background: isCurrent ? 'rgba(14,124,123,0.10)' : 'rgba(244,162,97,0.18)',
                            color:      isCurrent ? '#0E7C7B'               : '#C06030',
                          }}
                        >
                          {pkg.tag}
                        </span>
                      )}
                    </div>
                    <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:500, marginTop:1 }}>
                      {pkg.sessions} buổi · {pkg.perSession}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p style={{ fontSize:15, fontWeight:900, color: isSelected ? '#0E7C7B' : '#374151' }}>
                      {pkg.price}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Notice */}
          <div
            className="flex items-start gap-2.5 px-4 py-3.5 rounded-2xl mb-5"
            style={{ background:'rgba(233,196,106,0.12)', border:'1.5px solid rgba(233,196,106,0.30)' }}
          >
            <Info style={{ width:14, height:14, color:'#B8860B', marginTop:1, flexShrink:0 }} />
            <p style={{ fontSize:11, color:'#7A5C00', fontWeight:500, lineHeight:1.6 }}>
              Yêu cầu gia hạn sẽ được gửi cho Admin xác nhận.{' '}
              <strong>Buổi học sẽ được cộng sau khi Admin duyệt</strong>, không phải thanh toán chính thức.
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={() => onSubmit(pkg)}
            className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl active:opacity-80 transition-all"
            style={{
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow:  '0 8px 24px rgba(14,124,123,0.36)',
            }}
          >
            <Send style={{ width:16, height:16, color:'white' }} />
            <span style={{ fontSize:15, fontWeight:900, color:'white' }}>
              Gửi yêu cầu — {pkg.name}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SUCCESS TOAST
══════════════════════════════════════════════════════ */
function SuccessToast({ pkg, onDismiss }: { pkg: typeof SUGGESTIONS[0]; onDismiss: () => void }) {
  return (
    <div
      className="absolute bottom-28 left-4 right-4 z-50 flex items-center gap-3 px-4 py-4 rounded-2xl"
      style={{
        background:  'linear-gradient(135deg,#065F5E,#0E7C7B)',
        boxShadow:   '0 12px 36px rgba(14,124,123,0.45)',
        border:      '1.5px solid rgba(255,255,255,0.18)',
      }}
    >
      <div className="flex items-center justify-center rounded-xl flex-shrink-0"
           style={{ width:38, height:38, background:'rgba(255,255,255,0.18)' }}>
        <CheckCircle2 style={{ width:18, height:18, color:'white' }} />
      </div>
      <div className="flex-1">
        <p style={{ fontSize:13, fontWeight:900, color:'white' }}>Đã gửi yêu cầu gia hạn!</p>
        <p style={{ fontSize:11, color:'rgba(255,255,255,0.65)', fontWeight:500, marginTop:1 }}>
          {pkg.name} · Chờ Admin xác nhận
        </p>
      </div>
      <button onClick={onDismiss} className="active:scale-90">
        <span style={{ fontSize:18, color:'rgba(255,255,255,0.5)', fontWeight:300 }}>×</span>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
interface MemberPackageScreenProps {
  onNavigate?: (screen: string) => void;
}

export function MemberPackageScreen({ onNavigate }: MemberPackageScreenProps) {
  const [showSheet,   setShowSheet]   = useState(false);
  const [sentPkg,     setSentPkg]     = useState<typeof SUGGESTIONS[0] | null>(null);

  const status   = getStatus(PACKAGE.remaining);
  const progress = PACKAGE.attended / PACKAGE.total;   // used / total

  function handleSubmit(pkg: typeof SUGGESTIONS[0]) {
    setShowSheet(false);
    setSentPkg(pkg);
    setTimeout(() => setSentPkg(null), 4200);
  }

  return (
    <div className="relative flex flex-col min-h-screen" style={{ background: '#F0F4F5' }}>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background:'linear-gradient(148deg,#032C2C 0%,#053E3E 28%,#075E5D 58%,#0E7C7B 82%,#1A8E87 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top:-40,right:-30,width:170,height:170,borderRadius:'50%',background:'rgba(255,255,255,0.042)' }} />
        <div className="absolute pointer-events-none" style={{ top:14, right:50, width:80,height:80,borderRadius:'50%',background:'rgba(255,255,255,0.028)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-18,left:-14,width:120,height:120,borderRadius:'50%',background:'rgba(42,157,143,0.09)' }} />

        <div className="relative px-5 pt-14 pb-6">
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.48)', fontWeight:700, letterSpacing:'0.06em' }}>
            HỘI VIÊN
          </p>
          <h1 style={{ fontSize:24, fontWeight:900, color:'white', letterSpacing:'-0.5px', marginTop:2 }}>
            Gói học của tôi
          </h1>
        </div>
      </div>

      {/* ════════════════════════════════════════
          SCROLLABLE BODY
      ════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-4 pt-4 space-y-4">

          {/* ─────────────────────────────────────────
              CURRENT PACKAGE CARD
          ───────────────────────────────────────── */}
          <div
            className="rounded-3xl overflow-hidden"
            style={{
              background: status.cardBg,
              boxShadow:  `0 12px 40px ${status.shadow}`,
            }}
          >
            {/* Card content */}
            <div className="px-5 pt-5 pb-5">

              {/* Top row: label + status badge */}
              <div className="flex items-start justify-between mb-1">
                <div>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,0.52)', fontWeight:700, letterSpacing:'0.06em' }}>
                    GÓI HIỆN TẠI
                  </p>
                  <p style={{ fontSize:22, fontWeight:900, color:'white', letterSpacing:'-0.4px', marginTop:2 }}>
                    {PACKAGE.name}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 px-3 py-2 rounded-2xl flex-shrink-0 mt-1"
                  style={{ background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.28)' }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ background:'white' }} />
                  <span style={{ fontSize:11, fontWeight:900, color:'white' }}>{status.label}</span>
                </div>
              </div>

              {/* Start date */}
              <div className="flex items-center gap-1.5 mb-5">
                <Calendar style={{ width:12, height:12, color:'rgba(255,255,255,0.55)' }} />
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>
                  Ngày bắt đầu: {PACKAGE.startDate}
                </span>
              </div>

              {/* Stats row */}
              <div
                className="grid grid-cols-3 gap-0 rounded-2xl overflow-hidden mb-5"
                style={{ background:'rgba(0,0,0,0.14)' }}
              >
                {[
                  { label:'Tổng buổi', value: PACKAGE.total,     unit:'buổi', dimmer: false },
                  { label:'Đã học',    value: PACKAGE.attended,  unit:'buổi', dimmer: false },
                  { label:'Còn lại',   value: PACKAGE.remaining, unit:'buổi', dimmer: false },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center py-4"
                    style={{
                      borderRight: i < 2 ? '1px solid rgba(255,255,255,0.12)' : 'none',
                    }}
                  >
                    <span style={{ fontSize:30, fontWeight:900, color:'white', lineHeight:1, letterSpacing:'-1.5px' }}>
                      {stat.value}
                    </span>
                    <span style={{ fontSize:10, color:'rgba(255,255,255,0.55)', fontWeight:600, marginTop:3 }}>
                      {stat.unit}
                    </span>
                    <span style={{ fontSize:9, color:'rgba(255,255,255,0.38)', fontWeight:700, marginTop:2, letterSpacing:'0.04em' }}>
                      {stat.label.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize:10, color:'rgba(255,255,255,0.50)', fontWeight:700, letterSpacing:'0.04em' }}>
                    TIẾN ĐỘ SỬ DỤNG
                  </span>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.72)', fontWeight:800 }}>
                    {PACKAGE.attended}/{PACKAGE.total} buổi đã dùng
                  </span>
                </div>

                {/* Track */}
                <div className="relative rounded-full overflow-hidden" style={{ height:10, background:'rgba(255,255,255,0.16)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width:      `${progress * 100}%`,
                      background: 'rgba(255,255,255,0.72)',
                    }}
                  />
                </div>

                {/* Ticks */}
                <div className="flex justify-between mt-1.5">
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontWeight:600 }}>0</span>
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontWeight:600 }}>{Math.round(PACKAGE.total / 2)}</span>
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.35)', fontWeight:600 }}>{PACKAGE.total}</span>
                </div>
              </div>
            </div>

            {/* Alert banner for low/empty */}
            {status.alert && (
              <div
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ background:'rgba(0,0,0,0.20)', borderTop:'1px solid rgba(255,255,255,0.12)' }}
              >
                <AlertTriangle style={{ width:15, height:15, color:'rgba(255,255,255,0.85)', flexShrink:0 }} />
                <p style={{ fontSize:12, color:'rgba(255,255,255,0.85)', fontWeight:600, lineHeight:1.5 }}>
                  {PACKAGE.remaining === 0
                    ? 'Bạn đã hết buổi học. Hãy yêu cầu gia hạn để tiếp tục.'
                    : `Chỉ còn ${PACKAGE.remaining} buổi! Hãy gia hạn để không bị gián đoạn.`}
                </p>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────
              RENEW CTA BUTTON
          ───────────────────────────────────────── */}
          <button
            onClick={() => setShowSheet(true)}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl active:scale-98 transition-all"
            style={{
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow:  '0 8px 28px rgba(14,124,123,0.32)',
              border:     '1.5px solid rgba(255,255,255,0.15)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl"
              style={{ width:34, height:34, background:'rgba(255,255,255,0.18)' }}
            >
              <RefreshCw style={{ width:16, height:16, color:'white' }} />
            </div>
            <span style={{ fontSize:16, fontWeight:900, color:'white' }}>
              Yêu cầu gia hạn gói
            </span>
            <ChevronRight style={{ width:18, height:18, color:'rgba(255,255,255,0.6)' }} />
          </button>

          {/* ─────────────────────────────────────────
              PACKAGE SUGGESTIONS
          ───────────────────────────────────────── */}
          <div>
            {/* Section header */}
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="flex items-center justify-center rounded-xl"
                style={{ width:28, height:28, background:'rgba(14,124,123,0.10)' }}
              >
                <BookOpen style={{ width:13, height:13, color:'#0E7C7B' }} />
              </div>
              <p style={{ fontSize:12, fontWeight:900, color:'#1F2933', letterSpacing:'0.04em' }}>
                CÁC GÓI HỌC
              </p>
            </div>

            <div className="space-y-3">
              {SUGGESTIONS.map((pkg) => {
                const isCurrent = pkg.id === 2;
                const isBest    = pkg.id === 3;
                return (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-3xl overflow-hidden"
                    style={{
                      border:    isCurrent ? '2px solid rgba(14,124,123,0.35)' : '1.5px solid rgba(0,0,0,0.07)',
                      boxShadow: isCurrent ? '0 6px 24px rgba(14,124,123,0.12)' : '0 2px 10px rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Accent top bar for current */}
                    {isCurrent && (
                      <div style={{ height:3, background:'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 100%)' }} />
                    )}

                    <div className="flex items-center gap-4 px-5 py-4">
                      {/* Icon */}
                      <div
                        className="flex items-center justify-center rounded-2xl flex-shrink-0"
                        style={{
                          width:  50, height:50,
                          background: isCurrent ? 'linear-gradient(135deg,#0E7C7B,#2A9D8F)'
                                    : isBest    ? 'rgba(244,162,97,0.12)'
                                    :             'rgba(0,0,0,0.06)',
                          boxShadow: isCurrent ? '0 6px 16px rgba(14,124,123,0.28)' : 'none',
                        }}
                      >
                        <span style={{
                          fontSize:   22, fontWeight:900, lineHeight:1,
                          color:      isCurrent ? 'white' : isBest ? '#E8832A' : '#9CA3AF',
                        }}>
                          {pkg.sessions}
                        </span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p style={{ fontSize:16, fontWeight:900, color: isCurrent ? '#0E7C7B' : '#1F2933' }}>
                            {pkg.name}
                          </p>
                          {pkg.tag && (
                            <span
                              className="px-2 py-1 rounded-xl"
                              style={{
                                fontSize:  9, fontWeight:800,
                                background: isCurrent ? 'rgba(14,124,123,0.10)' : 'rgba(244,162,97,0.18)',
                                color:      isCurrent ? '#0E7C7B'               : '#C06030',
                              }}
                            >
                              {isCurrent ? '✓ ' : '★ '}{pkg.tag}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize:12, color:'#9CA3AF', fontWeight:500, marginTop:2 }}>
                          {pkg.sessions} buổi · {pkg.perSession}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="text-right flex-shrink-0">
                        <p style={{
                          fontSize:   17, fontWeight:900,
                          color:      isCurrent ? '#0E7C7B' : '#1F2933',
                          letterSpacing: '-0.3px',
                        }}>
                          {pkg.price}
                        </p>
                        {isBest && (
                          <p style={{ fontSize:9, color:'#E8832A', fontWeight:700, marginTop:1 }}>
                            Rẻ hơn 6%
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─────────────────────────────────────────
              NOTE CARD
          ───────────────────────────────────────── */}
          <div
            className="flex items-start gap-3.5 px-4 py-4 rounded-2xl"
            style={{
              background: 'rgba(233,196,106,0.10)',
              border:     '1.5px solid rgba(233,196,106,0.32)',
            }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0 mt-0.5"
              style={{ width:34, height:34, background:'rgba(233,196,106,0.22)' }}
            >
              <Shield style={{ width:15, height:15, color:'#B8860B' }} />
            </div>
            <div>
              <p style={{ fontSize:12, fontWeight:800, color:'#7A5C00', marginBottom:4 }}>
                Lưu ý quan trọng
              </p>
              <ul style={{ fontSize:11, color:'#7A5C00', fontWeight:500, lineHeight:1.8 }}>
                <li>• Yêu cầu gia hạn sẽ được gửi cho Admin xác nhận.</li>
                <li>• Buổi học được cộng sau khi Admin duyệt.</li>
                <li>• Đây không phải thanh toán chính thức.</li>
                <li>• Liên hệ Coach nếu cần hỗ trợ thêm.</li>
              </ul>
            </div>
          </div>

          {/* ─────────────────────────────────────────
              CLASS INFO strip
          ───────────────────────────────────────── */}
          <div
            className="flex items-center gap-4 px-4 py-3.5 rounded-2xl"
            style={{ background:'rgba(14,124,123,0.07)', border:'1.5px solid rgba(14,124,123,0.14)' }}
          >
            <div
              className="flex items-center justify-center rounded-xl flex-shrink-0"
              style={{ width:36, height:36, background:'rgba(14,124,123,0.12)' }}
            >
              <TrendingUp style={{ width:16, height:16, color:'#0E7C7B' }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize:13, fontWeight:800, color:'#0E7C7B' }}>{PACKAGE.class}</p>
              <p style={{ fontSize:11, color:'#6B7280', fontWeight:500, marginTop:1 }}>
                {PACKAGE.coach} · Thứ 3 & Thứ 6 · 18:00 – 19:30
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ background:'#2A9D8F' }} />
              <span style={{ fontSize:10, fontWeight:700, color:'#2A9D8F' }}>Đang học</span>
            </div>
          </div>

        </div>
      </div>

      {/* ════════════════════════════════════════
          RENEW BOTTOM SHEET
      ════════════════════════════════════════ */}
      {showSheet && (
        <RenewSheet
          onClose={() => setShowSheet(false)}
          onSubmit={handleSubmit}
        />
      )}

      {/* ════════════════════════════════════════
          SUCCESS TOAST
      ════════════════════════════════════════ */}
      {sentPkg && (
        <SuccessToast pkg={sentPkg} onDismiss={() => setSentPkg(null)} />
      )}

    </div>
  );
}
