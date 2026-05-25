/**
 * MemberPaymentHistoryScreen — VNS PickleTrack
 * Lịch sử thanh toán của học viên
 */
import { CheckCircle2, Clock, Wallet, Receipt, ChevronRight } from 'lucide-react';

type PayStatus = 'paid' | 'pending';

const PAYMENTS = [
  { id:1, pkg:'Gói 20 buổi', date:'01/02/2026', amount:'2,000,000 ₫', method:'Chuyển khoản',    status:'paid'    as PayStatus, note:'BIDV · ****1234' },
  { id:2, pkg:'Gói 10 buổi', date:'01/11/2025', amount:'1,100,000 ₫', method:'Tiền mặt',         status:'paid'    as PayStatus, note:'Thu tiền trực tiếp' },
  { id:3, pkg:'Gói 10 buổi', date:'01/08/2025', amount:'1,100,000 ₫', method:'Chuyển khoản',    status:'paid'    as PayStatus, note:'Momo · ****5678' },
];

const TOTAL = PAYMENTS.reduce((s, p) => s + parseInt(p.amount.replace(/[^0-9]/g, '')), 0);

const STATUS_CFG: Record<PayStatus, { label:string; color:string; bg:string; Icon: React.FC<{style?:React.CSSProperties}> }> = {
  paid:    { label:'Đã thanh toán', color:'#2A9D8F', bg:'rgba(42,157,143,0.12)',  Icon: CheckCircle2 },
  pending: { label:'Chờ xác nhận', color:'#E9C46A', bg:'rgba(233,196,106,0.18)', Icon: Clock        },
};

export function MemberPaymentHistoryScreen() {
  return (
    <div className="flex flex-col min-h-screen pb-28" style={{ background:'#F7F9FA' }}>

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(145deg,#054A49 0%,#0E7C7B 100%)' }}>
        <div className="absolute pointer-events-none" style={{ top:-20,right:-10,width:110,height:110,borderRadius:'50%',background:'rgba(255,255,255,0.05)' }} />
        <div className="px-4 pt-12 pb-5">
          <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:600, letterSpacing:'0.04em' }}>LỊCH SỬ</p>
          <h1 style={{ fontSize:22, fontWeight:900, color:'white' }}>Thanh toán</h1>
        </div>
      </div>

      {/* ── Total summary ── */}
      <div className="flex-shrink-0 px-4 py-4">
        <div
          className="rounded-3xl px-5 py-5"
          style={{ background:'linear-gradient(145deg,#1B4332 0%,#2D6A4F 50%,#40916C 100%)', boxShadow:'0 8px 28px rgba(40,167,69,0.25)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet style={{ width:15, height:15, color:'rgba(255,255,255,0.7)' }} />
            <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.65)', letterSpacing:'0.04em' }}>TỔNG ĐÃ THANH TOÁN</span>
          </div>
          <p style={{ fontSize:30, fontWeight:900, color:'white', letterSpacing:'-0.5px' }}>
            {TOTAL.toLocaleString('vi-VN')} ₫
          </p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.55)', marginTop:4, fontWeight:600 }}>
            {PAYMENTS.length} giao dịch · Từ {PAYMENTS[PAYMENTS.length-1].date}
          </p>
        </div>
      </div>

      {/* ── Transaction list ── */}
      <div className="flex-1 px-4 space-y-3">
        <p style={{ fontSize:13, fontWeight:800, color:'#1F2933', marginBottom:4 }}>LỊCH SỬ GIAO DỊCH</p>

        {PAYMENTS.map((p, i) => {
          const cfg = STATUS_CFG[p.status];
          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl overflow-hidden"
              style={{ border:'1px solid rgba(0,0,0,0.06)', boxShadow:'0 2px 10px rgba(0,0,0,0.04)' }}
            >
              {/* Top colored strip */}
              <div
                className="flex items-center gap-2.5 px-4 py-3"
                style={{ background: cfg.bg, borderBottom:'1px solid rgba(0,0,0,0.05)' }}
              >
                <cfg.Icon style={{ width:13, height:13, color: cfg.color }} />
                <span style={{ fontSize:11, fontWeight:800, color: cfg.color }}>{cfg.label}</span>
                <div className="flex-1" />
                <span style={{ fontSize:11, fontWeight:700, color:'#6B7280' }}>{p.date}</span>
              </div>

              {/* Body */}
              <div className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontSize:16, fontWeight:900, color:'#1F2933' }}>{p.pkg}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Receipt style={{ width:11, height:11, color:'#9CA3AF' }} />
                      <span style={{ fontSize:11, color:'#9CA3AF' }}>{p.method}</span>
                      {p.note && (
                        <>
                          <span style={{ fontSize:10, color:'#D1D5DB' }}>·</span>
                          <span style={{ fontSize:11, color:'#B0B7C3' }}>{p.note}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize:18, fontWeight:900, color:'#2A9D8F' }}>{p.amount}</p>
                </div>
              </div>
            </div>
          );
        })}

        {PAYMENTS.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background:'rgba(129,90,213,0.08)' }}>
              <Wallet style={{ width:32, height:32, color:'#815AD5' }} />
            </div>
            <p style={{ fontSize:15, fontWeight:700, color:'#1F2933' }}>Chưa có giao dịch</p>
            <p style={{ fontSize:12, color:'#9CA3AF', marginTop:4, textAlign:'center', maxWidth:220 }}>
              Khi bạn gia hạn gói học, giao dịch sẽ hiển thị tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
