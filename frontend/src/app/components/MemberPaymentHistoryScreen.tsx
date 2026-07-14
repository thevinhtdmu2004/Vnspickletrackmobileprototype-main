import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock, FileText, Receipt, Wallet } from 'lucide-react';
import {
  DEFAULT_PAYMENT_HISTORY,
  loadMemberMembershipPaymentHistory,
  mapMembershipPaymentsFromApi,
  type MemberMembershipAction,
  type MemberMembershipPaymentHistoryEntry,
  type MemberMembershipPaymentStatus,
} from './memberMembership';
import { getMembershipPaymentHistory } from '../services/memberMembershipService';

interface MemberPaymentHistoryScreenProps {
  onBack?: () => void;
  onViewRequestHistory?: () => void;
}

const STATUS_CFG: Record<MemberMembershipPaymentStatus, { label: string; color: string; bg: string; Icon: React.FC<{ style?: React.CSSProperties }> }> = {
  paid: { label: 'Đã thanh toán', color: '#2A9D8F', bg: 'rgba(42,157,143,0.12)', Icon: CheckCircle2 },
  pending: { label: 'Chờ xác nhận', color: '#E9C46A', bg: 'rgba(233,196,106,0.18)', Icon: Clock },
};

function parseAmount(value: string) {
  const amount = Number.parseInt(value.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(amount) ? amount : 0;
}

function actionLabel(action: MemberMembershipAction) {
  if (action === 'renew') return 'Gia hạn';
  if (action === 'upgrade') return 'Nâng hạng';
  if (action === 'downgrade') return 'Chuyển gói';
  return 'Đăng ký mới';
}

export function MemberPaymentHistoryScreen({ onBack, onViewRequestHistory }: MemberPaymentHistoryScreenProps) {
  const [payments, setPayments] = useState<MemberMembershipPaymentHistoryEntry[]>(loadMemberMembershipPaymentHistory());

  useEffect(() => {
    let cancelled = false;

    async function loadPayments() {
      try {
        const response = await getMembershipPaymentHistory();

        if (!cancelled) {
          setPayments(mapMembershipPaymentsFromApi(response));
        }
      } catch {
        if (!cancelled) {
          setPayments(loadMemberMembershipPaymentHistory() || DEFAULT_PAYMENT_HISTORY);
        }
      }
    }

    void loadPayments();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalPaid = payments
    .filter((payment) => payment.status === 'paid')
    .reduce((sum, payment) => sum + parseAmount(payment.amount), 0);

  return (
    <div className="flex flex-col min-h-screen pb-28" style={{ background: '#F7F9FA' }}>
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#0E7C7B 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: -20, right: -10, width: 110, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="px-4 pt-12 pb-5">
          <button
            onClick={onBack}
            className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl active:scale-95 transition-transform"
            style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
          >
            <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
          </button>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 600, letterSpacing: '0.04em' }}>LỊCH SỬ</p>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: 'white' }}>Lịch sử thanh toán</h1>
        </div>
      </div>

      <div className="flex-shrink-0 px-4 py-4">
        <div
          className="rounded-3xl px-5 py-5"
          style={{ background: 'linear-gradient(145deg,#1B4332 0%,#2D6A4F 50%,#40916C 100%)', boxShadow: '0 8px 28px rgba(40,167,69,0.25)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet style={{ width: 15, height: 15, color: 'rgba(255,255,255,0.7)' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.04em' }}>TỔNG ĐÃ THANH TOÁN</span>
          </div>
          <p style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: '-0.5px' }}>
            {totalPaid.toLocaleString('vi-VN')} đ
          </p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4, fontWeight: 600 }}>
            {payments.length} giao dịch đã được ghi nhận
          </p>
        </div>
      </div>

      <div className="flex-1 px-4 space-y-3">
        {onViewRequestHistory && (
          <button
            onClick={onViewRequestHistory}
            className="w-full rounded-2xl bg-white px-4 py-3 text-left active:scale-[0.99] transition-all"
            style={{ border: '1.5px solid rgba(244,162,97,0.18)', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <FileText style={{ width: 15, height: 15, color: '#E8832A' }} />
              <p style={{ fontSize: 14, fontWeight: 900, color: '#E8832A' }}>Xem lịch sử yêu cầu hội viên</p>
            </div>
            <p style={{ fontSize: 11, color: '#6B7280', marginTop: 6, lineHeight: 1.45 }}>
              Kiểm tra yêu cầu nào đang chờ duyệt, đã duyệt hoặc bị từ chối.
            </p>
          </button>
        )}

        <p style={{ fontSize: 13, fontWeight: 800, color: '#1F2933', marginBottom: 4 }}>LỊCH SỬ GIAO DỊCH</p>

        {payments.map((payment) => {
          const cfg = STATUS_CFG[payment.status];

          return (
            <div
              key={payment.id}
              className="bg-white rounded-3xl overflow-hidden"
              style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
            >
              <div
                className="flex items-center gap-2.5 px-4 py-3"
                style={{ background: cfg.bg, borderBottom: '1px solid rgba(0,0,0,0.05)' }}
              >
                <cfg.Icon style={{ width: 13, height: 13, color: cfg.color }} />
                <span style={{ fontSize: 11, fontWeight: 800, color: cfg.color }}>{cfg.label}</span>
                <div className="flex-1" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>{payment.date}</span>
              </div>

              <div className="px-4 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 900, color: '#1F2933' }}>{payment.planName}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <Receipt style={{ width: 11, height: 11, color: '#9CA3AF' }} />
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{actionLabel(payment.action)}</span>
                      <span style={{ fontSize: 10, color: '#D1D5DB' }}>·</span>
                      <span style={{ fontSize: 11, color: '#9CA3AF' }}>{payment.method}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#B0B7C3', marginTop: 8, lineHeight: 1.45 }}>{payment.note}</p>
                  </div>
                  <p style={{ fontSize: 18, fontWeight: 900, color: payment.status === 'paid' ? '#2A9D8F' : '#C08A00' }}>
                    {payment.amount}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {payments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-4" style={{ background: 'rgba(129,90,213,0.08)' }}>
              <Wallet style={{ width: 32, height: 32, color: '#815AD5' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: '#1F2933' }}>Chưa có giao dịch hội viên</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4, textAlign: 'center', maxWidth: 220 }}>
              Khi bạn đăng ký hoặc gia hạn gói hội viên, lịch sử sẽ hiển thị tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
