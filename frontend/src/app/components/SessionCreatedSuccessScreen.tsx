import { useEffect, useState } from 'react';
import {
  CheckCircle2, ClipboardList, ArrowLeft,
  Clock, MapPin, Users, CalendarDays, BookOpen, Sparkles
} from 'lucide-react';

/* ─── Props ────────────────────────────────────────────── */
export interface SessionCreatedSuccessScreenProps {
  className:    string;   // "Beginner A"
  level?:       string;   // "Cơ bản"
  date:         string;   // "01/05/2026"
  timeStart:    string;   // "18:00"
  timeEnd:      string;   // "19:30"
  court:        string;   // "Sân 1"
  coach?:       string;   // "Coach Nam"
  students:     number;   // 8
  accentColor?: string;   // "#2A9D8F"
  onAttendance: () => void;
  onBack:       () => void;
}

/* ─── Default mock (for standalone prototype route) ───── */
const MOCK: SessionCreatedSuccessScreenProps = {
  className:  'Beginner A',
  level:      'Cơ bản',
  date:       '01/05/2026',
  timeStart:  '18:00',
  timeEnd:    '19:30',
  court:      'Sân 1',
  coach:      'Coach Nam',
  students:   8,
  accentColor:'#2A9D8F',
  onAttendance: () => {},
  onBack:       () => {},
};

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export function SessionCreatedSuccessScreen(props: Partial<SessionCreatedSuccessScreenProps> & {
  onAttendance: () => void;
  onBack:       () => void;
}) {
  const p: SessionCreatedSuccessScreenProps = { ...MOCK, ...props };
  const accent = p.accentColor ?? '#0E7C7B';

  /* staggered mount animation */
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);   // check circle
    const t2 = setTimeout(() => setPhase(2), 450);   // title + message
    const t3 = setTimeout(() => setPhase(3), 700);   // info card
    const t4 = setTimeout(() => setPhase(4), 900);   // buttons
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const INFO = [
    { icon: <CalendarDays style={{ width:14, height:14 }} />, label:'Ngày',       value: p.date },
    { icon: <Clock        style={{ width:14, height:14 }} />, label:'Giờ học',    value:`${p.timeStart} – ${p.timeEnd}`, bold:true },
    { icon: <MapPin       style={{ width:14, height:14 }} />, label:'Sân',        value: p.court },
    { icon: <Users        style={{ width:14, height:14 }} />, label:'Học viên',   value:`${p.students} người` },
    ...(p.coach ? [{ icon: <BookOpen style={{ width:14, height:14 }} />, label:'Coach', value: p.coach }] : []),
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background:'#F7F9FA' }}>

      {/* ════════════════════════════════════════
          HERO — gradient bg + animated check
      ════════════════════════════════════════ */}
      <div
        className="relative flex flex-col items-center justify-center flex-shrink-0"
        style={{
          minHeight: 300,
          background: `radial-gradient(ellipse 80% 70% at 50% 0%, ${accent}22 0%, #F7F9FA 100%)`,
          paddingTop: 56,
          paddingBottom: 32,
        }}
      >
        {/* subtle dot grid decoration */}
        {[
          { top:36, left:28  }, { top:52, left:68  }, { top:80, left:22  },
          { top:36, right:28 }, { top:52, right:68 }, { top:80, right:22 },
          { top:180,left:36  }, { top:200,left:72  },
          { top:180,right:36 }, { top:200,right:72 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{ width:5, height:5, background: accent, opacity: 0.15 + (i % 3) * 0.07, ...s }}
          />
        ))}

        {/* sparkle icons */}
        <div className="absolute" style={{ top:44, left:52, opacity: phase >= 1 ? 0.6 : 0, transition:'opacity 0.5s 0.6s' }}>
          <Sparkles style={{ width:18, height:18, color: accent }} />
        </div>
        <div className="absolute" style={{ top:44, right:52, opacity: phase >= 1 ? 0.5 : 0, transition:'opacity 0.5s 0.7s' }}>
          <Sparkles style={{ width:14, height:14, color: accent }} />
        </div>
        <div className="absolute" style={{ top:190, left:44, opacity: phase >= 2 ? 0.4 : 0, transition:'opacity 0.5s 0.9s' }}>
          <Sparkles style={{ width:12, height:12, color: accent }} />
        </div>

        {/* ── Pulsing rings ── */}
        <div className="absolute flex items-center justify-center" style={{ width:160, height:160 }}>
          {[1,2].map(n => (
            <div
              key={n}
              className="absolute rounded-full"
              style={{
                width: 100 + n * 28,
                height: 100 + n * 28,
                border: `2px solid ${accent}`,
                opacity: phase >= 1 ? 0 : 0,
                animation: phase >= 1 ? `successPulse 2s ease-out ${n * 0.35}s infinite` : 'none',
              }}
            />
          ))}
        </div>

        {/* ── Check circle ── */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: '50%',
            background: `linear-gradient(145deg, ${accent} 0%, ${accent}BB 100%)`,
            boxShadow: `0 12px 40px ${accent}50, 0 4px 12px ${accent}30`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.2)',
            opacity:   phase >= 1 ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* inner white ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border:'3px solid rgba(255,255,255,0.3)' }}
          />
          {/* animated check SVG */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path
              d="M10 25 L20 35 L38 16"
              stroke="white"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="50"
              strokeDashoffset={phase >= 1 ? 0 : 50}
              style={{ transition: 'stroke-dashoffset 0.45s ease 0.3s' }}
            />
          </svg>
        </div>

        {/* ── Created badge ── */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mt-5"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            opacity:   phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.4s ease',
          }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: accent }} />
          <span style={{ fontSize:11, fontWeight:800, color: accent, letterSpacing:'0.04em' }}>
            BUỔI HỌC ĐÃ ĐƯỢC TẠO
          </span>
        </div>
      </div>

      {/* ════════════════════════════════════════
          CONTENT
      ════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto px-5 pt-1 pb-6">

        {/* ── Title + message ── */}
        <div
          className="text-center mb-5"
          style={{
            opacity:   phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.45s ease 0.05s',
          }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#1F2933',
              lineHeight: 1.2,
              marginBottom: 10,
            }}
          >
            Đã tạo buổi học 🎉
          </h1>
          <p style={{ fontSize:15, color:'#6B7280', lineHeight:1.6 }}>
            Buổi học{' '}
            <span style={{ fontWeight:800, color: accent }}>{p.className}</span>{' '}
            đã được tạo cho hôm nay.
          </p>
        </div>

        {/* ── Info summary card ── */}
        <div
          className="rounded-2xl overflow-hidden mb-4"
          style={{
            background: 'white',
            border: '1.5px solid rgba(0,0,0,0.09)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            opacity:   phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(24px)',
            transition: 'all 0.45s ease',
          }}
        >
          {/* card header — class name */}
          <div
            className="px-4 py-3.5 flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${accent}12, ${accent}06)`, borderBottom: `1px solid ${accent}20` }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: `${accent}20` }}
              >
                <BookOpen style={{ width:16, height:16, color: accent }} />
              </div>
              <div>
                <p style={{ fontSize:16, fontWeight:900, color:'#1F2933' }}>{p.className}</p>
                {p.level && (
                  <p style={{ fontSize:11, color: accent, fontWeight:700 }}>{p.level}</p>
                )}
              </div>
            </div>
            <CheckCircle2 style={{ width:20, height:20, color: accent }} />
          </div>

          {/* info rows */}
          {INFO.map((row, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 px-4 py-3.5"
              style={{ borderBottom: idx < INFO.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background:`${accent}12`, color: accent }}
              >
                {row.icon}
              </div>
              <span className="flex-shrink-0" style={{ fontSize:13, color:'#9CA3AF', width:68 }}>
                {row.label}
              </span>
              <span
                className="flex-1 text-right"
                style={{ fontSize:14, fontWeight: row.bold ? 800 : 600, color:'#1F2933' }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>

        {/* ── Status timeline ── */}
        <div
          className="flex items-center gap-0 mb-6 px-1"
          style={{
            opacity:   phase >= 3 ? 1 : 0,
            transform: phase >= 3 ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.45s ease 0.1s',
          }}
        >
          {[
            { label:'Đã tạo',   done: true  },
            { label:'Điểm danh', done: false },
            { label:'Hoàn tất', done: false },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                  style={{
                    background: step.done ? accent : 'rgba(0,0,0,0.08)',
                    boxShadow:  step.done ? `0 3px 10px ${accent}40` : 'none',
                  }}
                >
                  {step.done
                    ? <CheckCircle2 style={{ width:14, height:14, color:'white' }} />
                    : <div className="w-2 h-2 rounded-full bg-gray-300" />
                  }
                </div>
                <span style={{ fontSize:10, fontWeight: step.done ? 800 : 500, color: step.done ? accent : '#9CA3AF', marginTop:4, textAlign:'center', lineHeight:1.2 }}>
                  {step.label}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div
                  className="flex-1 h-0.5 mx-1 mb-4"
                  style={{ background: step.done ? `${accent}40` : 'rgba(0,0,0,0.08)' }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── Action buttons ── */}
        <div
          className="flex flex-col gap-3"
          style={{
            opacity:   phase >= 4 ? 1 : 0,
            transform: phase >= 4 ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.4s ease',
          }}
        >
          {/* Primary — Điểm danh ngay */}
          <button
            onClick={p.onAttendance}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl active:scale-[0.98] transition-all"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)`,
              boxShadow:  `0 8px 24px ${accent}45`,
              color: 'white',
            }}
          >
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center"
              style={{ background:'rgba(255,255,255,0.22)' }}
            >
              <ClipboardList style={{ width:15, height:15, color:'white' }} />
            </div>
            <span style={{ fontSize:16, fontWeight:800 }}>Điểm danh ngay</span>
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center ml-auto"
              style={{ background:'rgba(255,255,255,0.18)' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 4l3 3-3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>

          {/* Secondary — Quay lại */}
          <button
            onClick={p.onBack}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.98] transition-all"
            style={{
              background: 'white',
              border:     '1.5px solid rgba(0,0,0,0.12)',
              color:      '#374151',
              boxShadow:  '0 2px 8px rgba(0,0,0,0.06)',
            }}
          >
            <ArrowLeft style={{ width:16, height:16, color:'#6B7280' }} />
            <span style={{ fontSize:15, fontWeight:700, color:'#374151' }}>Quay lại lớp hôm nay</span>
          </button>
        </div>
      </div>

      {/* ── CSS animations ── */}
      <style>{`
        @keyframes successPulse {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0;    }
        }
      `}</style>
    </div>
  );
}
