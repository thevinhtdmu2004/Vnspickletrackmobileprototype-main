/**
 * MemberSessionWarningScreen — VNS PickleTrack
 * Thông báo sắp hết buổi học
 */
import { AlertTriangle, RefreshCw, X, Calendar, Clock, ChevronRight } from 'lucide-react';

const MEMBER_NAME = 'Nguyễn Thị Mai';
const REMAINING   = 3;
const CLASS_NAME  = 'Beginner A';
const NEXT_DATE   = 'Thứ Sáu, 02/05/2026';

interface MemberSessionWarningScreenProps {
  onRenew:   () => void;
  onDismiss: () => void;
}

export function MemberSessionWarningScreen({ onRenew, onDismiss }: MemberSessionWarningScreenProps) {
  const isUrgent = REMAINING <= 2;
  const isCritical = REMAINING === 0;

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: isUrgent ? 'linear-gradient(180deg,#FFF5F0 0%,#F7F9FA 100%)' : 'linear-gradient(180deg,#FFFBF0 0%,#F7F9FA 100%)' }}
    >

      {/* ── Header / Icon area ── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background: isUrgent ? 'linear-gradient(145deg,#7A1F0D 0%,#C62828 35%,#E76F51 100%)' : 'linear-gradient(145deg,#926A00 0%,#C99A10 50%,#E9C46A 100%)' }}
      >
        {/* decorative blobs */}
        <div className="absolute pointer-events-none" style={{ top:-30,right:-20, width:150,height:150, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-20,left:-10, width:100,height:100, borderRadius:'50%', background:'rgba(0,0,0,0.06)' }} />

        {/* Dismiss */}
        <div className="flex justify-end px-4 pt-12">
          <button
            onClick={onDismiss}
            className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
            style={{ background:'rgba(255,255,255,0.2)' }}
          >
            <X style={{ width:18, height:18, color:'white' }} />
          </button>
        </div>

        {/* Central alert icon */}
        <div className="flex flex-col items-center pb-8 pt-2 px-6">
          {/* 3-layer icon */}
          <div
            className="flex items-center justify-center rounded-full mb-5"
            style={{ width:100, height:100, background:'rgba(255,255,255,0.12)', border:'1.5px solid rgba(255,255,255,0.22)' }}
          >
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width:78, height:78, background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.3)' }}
            >
              <div
                className="flex items-center justify-center rounded-full"
                style={{ width:60, height:60, background:'rgba(255,255,255,0.28)' }}
              >
                <AlertTriangle style={{ width:28, height:28, color:'white' }} />
              </div>
            </div>
          </div>

          {/* Big number */}
          <div
            className="flex flex-col items-center px-8 py-4 rounded-3xl mb-4"
            style={{ background:'rgba(255,255,255,0.18)', border:'1.5px solid rgba(255,255,255,0.28)', backdropFilter:'blur(8px)' }}
          >
            <span style={{ fontSize:72, fontWeight:900, color:'white', lineHeight:1, letterSpacing:'-3px' }}>
              {isCritical ? '0' : REMAINING}
            </span>
            <span style={{ fontSize:14, fontWeight:700, color:'rgba(255,255,255,0.7)', marginTop:2 }}>buổi còn lại</span>
          </div>

          {/* Title */}
          <p style={{ fontSize:22, fontWeight:900, color:'white', textAlign:'center', lineHeight:1.3 }}>
            {isCritical ? 'Bạn đã hết buổi học!' : `Chỉ còn ${REMAINING} buổi học!`}
          </p>
          <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', textAlign:'center', marginTop:6, maxWidth:260, lineHeight:1.6 }}>
            {isCritical
              ? `${MEMBER_NAME} ơi, hãy gia hạn ngay để tiếp tục lớp ${CLASS_NAME}.`
              : `${MEMBER_NAME} ơi, hãy gia hạn sớm để không gián đoạn lịch học lớp ${CLASS_NAME}.`
            }
          </p>
        </div>
      </div>

      {/* ── Info cards ── */}
      <div className="flex-1 px-4 py-5 space-y-3">

        {/* Next session */}
        {!isCritical && (
          <div
            className="bg-white rounded-2xl px-4 py-4"
            style={{ border:'1.5px solid rgba(14,124,123,0.2)', boxShadow:'0 4px 16px rgba(14,124,123,0.10)' }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background:'rgba(14,124,123,0.10)' }}>
                <Calendar style={{ width:16, height:16, color:'#0E7C7B' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>Buổi học gần nhất</p>
                <p style={{ fontSize:14, fontWeight:800, color:'#0E7C7B' }}>{NEXT_DATE}</p>
              </div>
              <div
                className="px-2.5 py-1 rounded-lg"
                style={{ background:'rgba(14,124,123,0.1)' }}
              >
                <span style={{ fontSize:10, fontWeight:800, color:'#0E7C7B' }}>Còn {REMAINING} buổi</span>
              </div>
            </div>
          </div>
        )}

        {/* Info box */}
        <div
          className="rounded-2xl px-4 py-4"
          style={{ background: isUrgent ? 'rgba(231,111,81,0.07)' : 'rgba(233,196,106,0.1)', border:`1.5px solid ${isUrgent ? 'rgba(231,111,81,0.2)' : 'rgba(233,196,106,0.3)'}` }}
        >
          <p style={{ fontSize:11, fontWeight:800, color: isUrgent ? '#C85A3D' : '#926A00', letterSpacing:'0.04em', marginBottom:10 }}>
            THÔNG TIN
          </p>
          {[
            { icon: Clock,    text: 'Thời gian gia hạn: 1–2 ngày làm việc' },
            { icon: Calendar, text: `Lớp: ${CLASS_NAME} · Thứ 3 & Thứ 6 · 18:00–19:30` },
          ].map((row, i) => (
            <div key={i} className="flex items-center gap-2.5 mb-2 last:mb-0">
              <row.icon style={{ width:12, height:12, color: isUrgent ? '#E76F51' : '#E9C46A', flexShrink:0 }} />
              <p style={{ fontSize:12, color: isUrgent ? '#9E3D1E' : '#7A5700', lineHeight:1.5 }}>{row.text}</p>
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <button
          onClick={onRenew}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl active:scale-95 transition-all"
          style={{
            background: isUrgent ? 'linear-gradient(135deg,#C62828 0%,#E76F51 100%)' : 'linear-gradient(135deg,#926A00 0%,#E9C46A 100%)',
            boxShadow:  isUrgent ? '0 8px 28px rgba(231,111,81,0.45)' : '0 8px 28px rgba(233,196,106,0.45)',
          }}
        >
          <RefreshCw style={{ width:18, height:18, color:'white' }} />
          <span style={{ fontSize:16, fontWeight:900, color:'white' }}>Gia hạn ngay</span>
        </button>

        <button
          onClick={onDismiss}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl active:scale-95 transition-all"
          style={{ background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.08)' }}
        >
          <span style={{ fontSize:14, fontWeight:700, color:'#6B7280' }}>Để sau</span>
        </button>

      </div>
    </div>
  );
}
