import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock3, FileText, RefreshCw, ShieldAlert, Wallet, XCircle } from 'lucide-react';
import { getMembershipRequestHistory } from '../services/memberMembershipService';
import { mapMembershipRequestsFromApi, type MembershipRequestHistoryEntry } from './memberMembership';

interface MemberMembershipRequestHistoryScreenProps {
  onBack?: () => void;
  onViewPaymentHistory?: () => void;
  onCreateRequest?: () => void;
  onViewOverview?: () => void;
}

const STATUS_CONFIG = {
  pending: {
    label: 'Đang chờ duyệt',
    helper: 'Yêu cầu đã gửi lên hệ thống và đang chờ Admin xử lý.',
    color: '#D97706',
    bg: 'rgba(217,119,6,0.12)',
    Icon: Clock3,
  },
  approved: {
    label: 'Đã duyệt',
    helper: 'Yêu cầu đã được chấp nhận và sẽ được áp dụng theo xử lý của Admin.',
    color: '#0E7C7B',
    bg: 'rgba(14,124,123,0.12)',
    Icon: CheckCircle2,
  },
  rejected: {
    label: 'Bị từ chối',
    helper: 'Yêu cầu chưa được chấp nhận. Hãy xem ghi chú để biết thêm lý do.',
    color: '#DC2626',
    bg: 'rgba(220,38,38,0.10)',
    Icon: XCircle,
  },
} as const;

function actionLabel(action: MembershipRequestHistoryEntry['action']) {
  if (action === 'renew') return 'Gia hạn';
  if (action === 'upgrade') return 'Nâng hạng';
  if (action === 'downgrade') return 'Chuyển gói';
  return 'Đăng ký mới';
}

export function MemberMembershipRequestHistoryScreen({
  onBack,
  onViewPaymentHistory,
  onCreateRequest,
  onViewOverview,
}: MemberMembershipRequestHistoryScreenProps) {
  const [requests, setRequests] = useState<MembershipRequestHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadRequests() {
      setLoading(true);
      setLoadError(null);

      try {
        const response = await getMembershipRequestHistory();

        if (!cancelled) {
          setRequests(mapMembershipRequestsFromApi(response));
        }
      } catch (error) {
        if (!cancelled) {
          setRequests([]);
          setLoadError(error instanceof Error ? error.message : 'Không thể tải lịch sử yêu cầu hội viên.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadRequests();

    return () => {
      cancelled = true;
    };
  }, []);

  const summary = useMemo(() => ({
    pending: requests.filter((item) => item.statusKey === 'pending').length,
    approved: requests.filter((item) => item.statusKey === 'approved').length,
    rejected: requests.filter((item) => item.statusKey === 'rejected').length,
  }), [requests]);

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#F7F9FA' }}>
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#032C2C 0%,#075E5D 60%,#0E7C7B 100%)' }}
      >
        <div className="absolute pointer-events-none" style={{ top: -24, right: -12, width: 130, height: 130, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div className="px-4 pt-12 pb-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              onClick={onBack}
              className="flex h-11 w-11 items-center justify-center rounded-2xl active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
            </button>
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <FileText style={{ width: 18, height: 18, color: 'white' }} />
            </div>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.05em' }}>
            HỘI VIÊN
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 3 }}>
            Lịch sử yêu cầu hội viên
          </h1>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5, marginTop: 8 }}>
            Theo dõi rõ từng yêu cầu đăng ký, gia hạn, nâng hạng hoặc chuyển gói của bạn.
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-24 pt-4">
        <div className="mb-4 grid grid-cols-3 gap-2.5">
          {[
            { label: 'Chờ duyệt', value: summary.pending, color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
            { label: 'Đã duyệt', value: summary.approved, color: '#0E7C7B', bg: 'rgba(14,124,123,0.10)' },
            { label: 'Từ chối', value: summary.rejected, color: '#DC2626', bg: 'rgba(220,38,38,0.08)' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-2xl px-3 py-4 text-center"
              style={{ background: item.bg, border: '1px solid rgba(0,0,0,0.04)' }}
            >
              <p style={{ fontSize: 18, fontWeight: 900, color: item.color }}>{item.value}</p>
              <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginTop: 4 }}>{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3">
          {onViewOverview && (
            <button
              onClick={onViewOverview}
              className="rounded-2xl bg-white px-4 py-3 text-left active:scale-[0.99] transition-all"
              style={{ border: '1.5px solid rgba(14,124,123,0.14)', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}
            >
              <p style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>Về tổng quan hội viên</p>
              <p style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>Quay lại màn gói hội viên hiện tại.</p>
            </button>
          )}

          {onCreateRequest && (
            <button
              onClick={onCreateRequest}
              className="rounded-2xl bg-white px-4 py-3 text-left active:scale-[0.99] transition-all"
              style={{ border: '1.5px solid rgba(244,162,97,0.18)', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}
            >
              <p style={{ fontSize: 13, fontWeight: 900, color: '#E8832A' }}>Tạo yêu cầu mới</p>
              <p style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>Đăng ký, gia hạn hoặc đổi gói.</p>
            </button>
          )}
        </div>

        {onViewPaymentHistory && (
          <button
            onClick={onViewPaymentHistory}
            className="mb-4 w-full rounded-2xl bg-white px-4 py-3 text-left active:scale-[0.99] transition-all"
            style={{ border: '1.5px solid rgba(14,124,123,0.14)', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}
          >
            <div className="flex items-center gap-2">
              <Wallet style={{ width: 15, height: 15, color: '#0E7C7B' }} />
              <p style={{ fontSize: 14, fontWeight: 900, color: '#0E7C7B' }}>Xem lịch sử thanh toán</p>
            </div>
            <p style={{ fontSize: 11, color: '#6B7280', marginTop: 6, lineHeight: 1.45 }}>
              Tách riêng giao dịch thanh toán và trạng thái duyệt yêu cầu để dễ theo dõi hơn.
            </p>
          </button>
        )}

        {loadError && (
          <div
            className="mb-4 rounded-2xl px-4 py-3"
            style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.16)' }}
          >
            <p style={{ fontSize: 13, fontWeight: 800, color: '#B42318' }}>Không tải được lịch sử yêu cầu</p>
            <p style={{ fontSize: 11, color: '#7A271A', marginTop: 4, lineHeight: 1.45 }}>{loadError}</p>
          </div>
        )}

        {loading && (
          <div
            className="mb-4 rounded-2xl px-4 py-4"
            style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.10)' }}
          >
            <div className="flex items-center gap-2">
              <RefreshCw style={{ width: 15, height: 15, color: '#0E7C7B' }} />
              <p style={{ fontSize: 13, fontWeight: 800, color: '#0E7C7B' }}>Đang tải lịch sử yêu cầu...</p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {requests.map((request) => {
            const config = STATUS_CONFIG[request.statusKey];

            return (
              <div
                key={request.id}
                className="overflow-hidden rounded-3xl bg-white"
                style={{ border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="flex items-center gap-2.5 px-4 py-3"
                  style={{ background: config.bg, borderBottom: '1px solid rgba(0,0,0,0.05)' }}
                >
                  <config.Icon style={{ width: 14, height: 14, color: config.color }} />
                  <span style={{ fontSize: 11, fontWeight: 800, color: config.color }}>{config.label}</span>
                  <div className="flex-1" />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#6B7280' }}>{request.date}</span>
                </div>

                <div className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p style={{ fontSize: 16, fontWeight: 900, color: '#1F2933' }}>{request.planName}</p>
                      <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700, marginTop: 3 }}>
                        {actionLabel(request.action)}
                      </p>
                      <p style={{ fontSize: 11, color: '#6B7280', lineHeight: 1.5, marginTop: 8 }}>
                        {config.helper}
                      </p>
                      <p style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.55, marginTop: 10 }}>
                        {request.note}
                      </p>
                    </div>

                    {request.statusKey === 'rejected' && (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-2xl flex-shrink-0"
                        style={{ background: 'rgba(220,38,38,0.08)' }}
                      >
                        <ShieldAlert style={{ width: 18, height: 18, color: '#DC2626' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!loading && requests.length === 0 && !loadError && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full" style={{ background: 'rgba(14,124,123,0.08)' }}>
              <FileText style={{ width: 32, height: 32, color: '#0E7C7B' }} />
            </div>
            <p style={{ fontSize: 15, fontWeight: 800, color: '#1F2933' }}>Chưa có yêu cầu hội viên</p>
            <p style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 1.55, marginTop: 6, textAlign: 'center', maxWidth: 240 }}>
              Khi bạn đăng ký, gia hạn hoặc đổi gói hội viên, lịch sử yêu cầu sẽ hiển thị tại đây.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
