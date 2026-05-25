import { useState } from 'react';
import {
  ArrowLeft, RefreshCw, CheckCircle2, ChevronDown, ChevronUp,
  Banknote, Building2, Package, Plus, CalendarDays,
  Phone, TrendingUp, Wallet, FileText, Receipt,
  CreditCard, ArrowUpRight, Clock
} from 'lucide-react';

/* ─── Helpers ────────────────────────────────────────────────── */
function fmt(n: number) {
  return n.toLocaleString('vi-VN') + ' đ';
}

/* ─── Types ─────────────────────────────────────────────────── */
interface Payment {
  id:        number;
  txCode:    string;
  date:      string;   // DD/MM/YYYY
  dayOfWeek: string;
  package:   string;
  sessions:  number;
  amount:    number;
  method:    'bank' | 'cash';
  note?:     string;
  recordedBy:string;
}

/* ─── Data ───────────────────────────────────────────────────── */
const STUDENT = {
  name:      'Nguyễn Văn A',
  initials:  'NA',
  phone:     '0901 234 567',
  class:     'Beginner A',
  remaining: 7,
};

const PAYMENTS: Payment[] = [
  {
    id:        1,
    txCode:    'TX-0002',
    date:      '29/04/2026',
    dayOfWeek: 'Thứ Tư',
    package:   'Gói 12 buổi',
    sessions:  12,
    amount:    2_400_000,
    method:    'bank',
    note:      'Gia hạn tháng 4',
    recordedBy:'Admin Linh',
  },
  {
    id:        2,
    txCode:    'TX-0001',
    date:      '01/04/2026',
    dayOfWeek: 'Thứ Tư',
    package:   'Gói 8 buổi',
    sessions:  8,
    amount:    1_600_000,
    method:    'cash',
    recordedBy:'Admin Linh',
  },
];

const TOTAL_AMOUNT   = PAYMENTS.reduce((s, p) => s + p.amount, 0);
const TOTAL_SESSIONS = PAYMENTS.reduce((s, p) => s + p.sessions, 0);
const AVG_PER_SESSION= Math.round(TOTAL_AMOUNT / TOTAL_SESSIONS);

/* ─── Method config ─────────────────────────────────────────── */
const METHOD_CFG = {
  bank: {
    label:'Chuyển khoản', Icon:Building2,
    color:'#1A5FA8', bg:'rgba(26,95,168,0.1)', border:'rgba(26,95,168,0.25)',
  },
  cash: {
    label:'Tiền mặt', Icon:Banknote,
    color:'#1A7B6E', bg:'rgba(42,157,143,0.1)', border:'rgba(42,157,143,0.3)',
  },
};

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
═══════════════════════════════════════════════════════════════ */
interface Props {
  onBack:   () => void;
  onRenew?: () => void;
}

export function PaymentHistoryScreen({ onBack, onRenew }: Props) {
  const [expanded, setExpanded] = useState<number | null>(1); // first open by default

  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* ══ HEADER ══ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(150deg,#032E2E 0%,#054A49 35%,#0E7C7B 75%,#2A9D8F 100%)' }}>
        {/* deco circles */}
        <div className="absolute pointer-events-none" style={{ top:-30, right:-20, width:120, height:120, borderRadius:'50%', background:'rgba(255,255,255,0.05)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:-10, left:-15, width:70, height:70, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />

        <div className="relative px-4 pt-12 pb-5">
          {/* top nav row */}
          <div className="flex items-center gap-3 mb-5">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width:18, height:18, color:'white' }} />
            </button>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.04em' }}>
                {STUDENT.name}
              </p>
              <h1 style={{ fontSize:19, fontWeight:900, color:'white', lineHeight:1.2 }}>
                Lịch sử thanh toán
              </h1>
            </div>
            {/* receipt icon */}
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(255,255,255,0.16)', border:'1.5px solid rgba(255,255,255,0.25)' }}>
              <Receipt style={{ width:17, height:17, color:'white' }} />
            </div>
          </div>

          {/* Hero total */}
          <div className="flex flex-col items-center py-5 px-4 rounded-2xl mb-0"
               style={{ background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.18)' }}>
            <p style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.55)', letterSpacing:'0.06em', marginBottom:6 }}>
              TỔNG ĐÃ THANH TOÁN
            </p>
            <div className="flex items-end gap-1.5">
              <span style={{ fontSize:38, fontWeight:900, color:'white', lineHeight:1, letterSpacing:'-0.02em' }}>
                {(TOTAL_AMOUNT / 1_000_000).toFixed(1)}
              </span>
              <span style={{ fontSize:18, fontWeight:700, color:'rgba(255,255,255,0.7)', paddingBottom:4 }}>
                triệu đồng
              </span>
            </div>
            <p style={{ fontSize:12, color:'rgba(255,255,255,0.45)', marginTop:4 }}>
              {fmt(TOTAL_AMOUNT)}
            </p>

            {/* sub stats */}
            <div className="flex gap-4 mt-4 pt-4 w-full justify-center"
                 style={{ borderTop:'1px solid rgba(255,255,255,0.15)' }}>
              {[
                { icon:Package,      label:'Tổng buổi mua',  value:`${TOTAL_SESSIONS} buổi` },
                { icon:CreditCard,   label:'Số giao dịch',   value:`${PAYMENTS.length}`      },
                { icon:TrendingUp,   label:'Đơn giá TB',     value:`${(AVG_PER_SESSION/1000).toFixed(0)}k/buổi` },
              ].map(({ icon: Icon, label, value }, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span style={{ fontSize:16, fontWeight:900, color:'white', lineHeight:1 }}>{value}</span>
                  <span style={{ fontSize:9, color:'rgba(255,255,255,0.5)', fontWeight:600 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ SCROLLABLE BODY ══ */}
      <div className="flex-1 overflow-y-auto pb-28">
        <div className="px-4 pt-4 space-y-4">

          {/* ─── Student summary card ─── */}
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center gap-3.5 px-4 py-4">
              {/* avatar */}
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                   style={{ background:'rgba(14,124,123,0.1)', border:'2px solid rgba(14,124,123,0.2)', fontSize:14, fontWeight:900, color:'#0E7C7B' }}>
                {STUDENT.initials}
              </div>

              <div className="flex-1 min-w-0">
                <p style={{ fontSize:16, fontWeight:900, color:'#1F2933' }}>{STUDENT.name}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Phone style={{ width:11, height:11, color:'#9CA3AF' }} />
                  <p style={{ fontSize:12, color:'#9CA3AF' }}>{STUDENT.phone}</p>
                </div>
              </div>

              {/* remaining badge */}
              <div className="flex flex-col items-center px-3 py-2.5 rounded-2xl flex-shrink-0"
                   style={{ background:'rgba(14,124,123,0.1)', border:'2px solid rgba(14,124,123,0.25)' }}>
                <span style={{ fontSize:20, fontWeight:900, color:'#0E7C7B', lineHeight:1 }}>
                  {STUDENT.remaining}
                </span>
                <span style={{ fontSize:9, color:'#2A9D8F', fontWeight:700, marginTop:2 }}>còn lại</span>
              </div>
            </div>

            {/* class info strip */}
            <div className="flex items-center gap-2 px-4 py-2.5"
                 style={{ background:'rgba(14,124,123,0.04)', borderTop:'1px solid rgba(0,0,0,0.07)' }}>
              <Package style={{ width:11, height:11, color:'#9CA3AF' }} />
              <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>
                {STUDENT.class} · {PAYMENTS.length} giao dịch · trung bình {fmt(AVG_PER_SESSION)}/buổi
              </span>
            </div>
          </div>

          {/* ─── Section label ─── */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock style={{ width:12, height:12, color:'#9CA3AF' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.04em' }}>
                LỊCH SỬ GIAO DỊCH · MỚI NHẤT TRƯỚC
              </span>
            </div>
            <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>2026</span>
          </div>

          {/* ─── Payment cards ─── */}
          {PAYMENTS.map((p, idx) => {
            const isOpen = expanded === p.id;
            const mc     = METHOD_CFG[p.method];
            const pricePerSession = Math.round(p.amount / p.sessions);
            const isLatest = idx === 0;

            return (
              <div key={p.id} className="relative">
                {/* "Mới nhất" badge */}
                {isLatest && (
                  <div className="absolute -top-2.5 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                       style={{ background:'#F4A261', boxShadow:'0 2px 8px rgba(244,162,97,0.4)' }}>
                    <ArrowUpRight style={{ width:9, height:9, color:'white' }} />
                    <span style={{ fontSize:9, fontWeight:900, color:'white' }}>Mới nhất</span>
                  </div>
                )}

                <div className="bg-white rounded-2xl overflow-hidden transition-all"
                     style={{
                       border:`1.5px solid ${isOpen ? 'rgba(14,124,123,0.3)' : 'rgba(0,0,0,0.09)'}`,
                       boxShadow: isOpen ? '0 6px 24px rgba(14,124,123,0.12)' : '0 2px 10px rgba(0,0,0,0.05)',
                       marginTop: isLatest ? 6 : 0,
                     }}>

                  {/* ── Top color strip ── */}
                  <div className="h-1" style={{ background:`linear-gradient(90deg,#0E7C7B,#2A9D8F,#F4A261)` }} />

                  {/* ── Card header (always visible) ── */}
                  <button className="w-full text-left px-4 pt-4 pb-4" onClick={() => setExpanded(isOpen ? null : p.id)}>
                    <div className="flex items-start justify-between gap-3">
                      {/* left: date + tx code */}
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
                               style={{ background:'rgba(14,124,123,0.08)', border:'1px solid rgba(14,124,123,0.18)' }}>
                            <CalendarDays style={{ width:10, height:10, color:'#0E7C7B' }} />
                            <span style={{ fontSize:11, fontWeight:800, color:'#0E7C7B' }}>{p.date}</span>
                          </div>
                          <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>{p.dayOfWeek}</span>
                        </div>
                        <p style={{ fontSize:15, fontWeight:900, color:'#1F2933' }}>{p.package}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {/* sessions added badge */}
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
                               style={{ background:'rgba(42,157,143,0.12)', border:'1px solid rgba(42,157,143,0.28)' }}>
                            <Plus style={{ width:10, height:10, color:'#2A9D8F' }} />
                            <span style={{ fontSize:11, fontWeight:900, color:'#2A9D8F' }}>
                              {p.sessions} buổi
                            </span>
                          </div>
                          {/* method chip */}
                          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl"
                               style={{ background:mc.bg, border:`1px solid ${mc.border}` }}>
                            <mc.Icon style={{ width:10, height:10, color:mc.color }} />
                            <span style={{ fontSize:10, fontWeight:700, color:mc.color }}>{mc.label}</span>
                          </div>
                        </div>
                      </div>

                      {/* right: amount hero */}
                      <div className="flex flex-col items-end flex-shrink-0">
                        <div className="flex flex-col items-end px-3 py-2.5 rounded-2xl mb-2"
                             style={{ background:'rgba(14,124,123,0.07)', border:'1.5px solid rgba(14,124,123,0.18)' }}>
                          <span style={{ fontSize:22, fontWeight:900, color:'#0E7C7B', lineHeight:1, letterSpacing:'-0.02em' }}>
                            {(p.amount / 1_000_000).toFixed(1)}M
                          </span>
                          <span style={{ fontSize:9, color:'#9CA3AF', fontWeight:600, marginTop:2 }}>
                            {fmt(p.amount)}
                          </span>
                        </div>
                        {/* paid badge */}
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg"
                             style={{ background:'rgba(42,157,143,0.1)' }}>
                          <CheckCircle2 style={{ width:9, height:9, color:'#2A9D8F' }} />
                          <span style={{ fontSize:9, fontWeight:800, color:'#2A9D8F' }}>Đã thanh toán</span>
                        </div>
                      </div>
                    </div>

                    {/* expand toggle */}
                    <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop:'1px dashed rgba(0,0,0,0.1)' }}>
                      <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600 }}>
                        {p.txCode} · {fmt(pricePerSession)}/buổi
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span style={{ fontSize:11, color:'#0E7C7B', fontWeight:700 }}>
                          {isOpen ? 'Thu gọn' : 'Xem chi tiết'}
                        </span>
                        {isOpen
                          ? <ChevronUp style={{ width:14, height:14, color:'#0E7C7B' }} />
                          : <ChevronDown style={{ width:14, height:14, color:'#9CA3AF' }} />
                        }
                      </div>
                    </div>
                  </button>

                  {/* ── Expanded detail ── */}
                  {isOpen && (
                    <div style={{ borderTop:'1px solid rgba(0,0,0,0.07)' }}>

                      {/* receipt-style detail rows */}
                      <div className="px-4 py-4 space-y-0">
                        <p style={{ fontSize:10, fontWeight:800, color:'#9CA3AF', letterSpacing:'0.06em', marginBottom:12 }}>
                          CHI TIẾT GIAO DỊCH
                        </p>

                        {/* dashed receipt rows */}
                        {[
                          { label:'Mã giao dịch',     value:p.txCode,                       mono:true  },
                          { label:'Ngày thanh toán',   value:`${p.dayOfWeek}, ${p.date}`,    mono:false },
                          { label:'Gói dịch vụ',       value:p.package,                      mono:false },
                          { label:'Số buổi',           value:`+${p.sessions} buổi`,          mono:false },
                          { label:'Phương thức',       value:mc.label,                        mono:false },
                          { label:'Đơn giá/buổi',      value:fmt(pricePerSession),            mono:false },
                          { label:'Người ghi nhận',    value:p.recordedBy,                    mono:false },
                        ].map(({ label, value, mono }, i) => (
                          <div key={i}
                               className="flex items-center justify-between py-2.5"
                               style={{ borderBottom:'1px dashed rgba(0,0,0,0.07)' }}>
                            <span style={{ fontSize:12, color:'#9CA3AF', fontWeight:600 }}>{label}</span>
                            <span style={{ fontSize:12, fontWeight: mono ? 700 : 600, color: mono ? '#374151' : '#6B7280', fontFamily: mono ? 'monospace' : 'inherit' }}>
                              {value}
                            </span>
                          </div>
                        ))}

                        {/* total row */}
                        <div className="flex items-center justify-between py-3">
                          <span style={{ fontSize:13, fontWeight:800, color:'#1F2933' }}>Tổng thanh toán</span>
                          <span style={{ fontSize:17, fontWeight:900, color:'#0E7C7B' }}>{fmt(p.amount)}</span>
                        </div>
                      </div>

                      {/* note */}
                      {p.note && (
                        <div className="mx-4 mb-4 flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
                             style={{ background:'rgba(244,162,97,0.09)', border:'1px solid rgba(244,162,97,0.28)' }}>
                          <FileText style={{ width:13, height:13, color:'#C97B38', flexShrink:0, marginTop:1 }} />
                          <div>
                            <p style={{ fontSize:10, fontWeight:800, color:'#C97B38', letterSpacing:'0.04em', marginBottom:2 }}>GHI CHÚ</p>
                            <p style={{ fontSize:12, color:'#92620A', lineHeight:1.5 }}>{p.note}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* ─── Summary card ─── */}
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border:'1.5px solid rgba(14,124,123,0.2)', boxShadow:'0 2px 12px rgba(14,124,123,0.08)' }}>

            <div className="flex items-center gap-2 px-4 py-3"
                 style={{ background:'rgba(14,124,123,0.06)', borderBottom:'1px solid rgba(14,124,123,0.15)' }}>
              <TrendingUp style={{ width:13, height:13, color:'#0E7C7B' }} />
              <span style={{ fontSize:11, fontWeight:800, color:'#0E7C7B', letterSpacing:'0.04em' }}>
                TỔNG KẾT
              </span>
            </div>

            <div className="p-4">
              {/* big total */}
              <div className="flex items-center justify-between py-3 px-4 rounded-2xl mb-3"
                   style={{ background:'rgba(14,124,123,0.07)', border:'1.5px solid rgba(14,124,123,0.18)' }}>
                <div>
                  <p style={{ fontSize:11, color:'#9CA3AF', fontWeight:700 }}>Tổng đã thanh toán</p>
                  <p style={{ fontSize:24, fontWeight:900, color:'#0E7C7B', lineHeight:1.2, marginTop:3 }}>
                    {fmt(TOTAL_AMOUNT)}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                     style={{ background:'rgba(14,124,123,0.15)' }}>
                  <Wallet style={{ width:22, height:22, color:'#0E7C7B' }} />
                </div>
              </div>

              {/* stat grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label:'Tổng buổi mua',  value:`${TOTAL_SESSIONS}`,           sub:'buổi',     color:'#1F2933' },
                  { label:'Số giao dịch',   value:`${PAYMENTS.length}`,           sub:'lần',      color:'#6B7280' },
                  { label:'Đơn giá TB',     value:`${(AVG_PER_SESSION/1000).toFixed(0)}k`, sub:'/buổi', color:'#2A9D8F' },
                ].map((s, i) => (
                  <div key={i} className="flex flex-col items-center py-3 px-2 rounded-xl"
                       style={{ background:'rgba(0,0,0,0.04)' }}>
                    <div className="flex items-end gap-0.5">
                      <span style={{ fontSize:20, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</span>
                      <span style={{ fontSize:10, color:'#9CA3AF', fontWeight:600, paddingBottom:1 }}>{s.sub}</span>
                    </div>
                    <span style={{ fontSize:9, color:'#9CA3AF', marginTop:4, fontWeight:600, textAlign:'center' }}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-2" />
        </div>
      </div>

      {/* ══ FIXED FOOTER ══ */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-20 px-4 pb-8 pt-3"
           style={{ background:'white', borderTop:'1px solid rgba(0,0,0,0.09)', boxShadow:'0 -8px 28px rgba(0,0,0,0.09)' }}>

        {/* remaining sessions info strip */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl mb-3"
             style={{ background:'rgba(14,124,123,0.07)', border:'1px solid rgba(14,124,123,0.2)' }}>
          <Package style={{ width:12, height:12, color:'#0E7C7B' }} />
          <span style={{ fontSize:11, color:'#0E7C7B', fontWeight:700, flex:1 }}>
            Còn lại: <strong>{STUDENT.remaining} buổi</strong> · {STUDENT.class}
          </span>
          <div className="flex gap-1">
            {Array.from({ length: Math.min(7, STUDENT.remaining) }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full" style={{ background:'#2A9D8F' }} />
            ))}
          </div>
        </div>

        {/* Renew button */}
        <button
          onClick={onRenew}
          className="w-full flex items-center justify-between px-5 rounded-2xl active:scale-98 transition-all"
          style={{
            paddingTop:16, paddingBottom:16,
            background:'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
            boxShadow:'0 8px 24px rgba(14,124,123,0.35)',
          }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background:'rgba(255,255,255,0.2)' }}>
              <RefreshCw style={{ width:16, height:16, color:'white' }} />
            </div>
            <div className="text-left">
              <p style={{ fontSize:15, fontWeight:900, color:'white' }}>Gia hạn gói mới</p>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.65)' }}>Mua thêm buổi cho {STUDENT.name}</p>
            </div>
          </div>
          <div className="px-2.5 py-2 rounded-xl" style={{ background:'rgba(255,255,255,0.2)' }}>
            <Plus style={{ width:16, height:16, color:'white' }} />
          </div>
        </button>
      </div>
    </div>
  );
}
