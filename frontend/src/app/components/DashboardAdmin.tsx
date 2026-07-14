import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Clock3,
  DollarSign,
  Handshake,
  LayoutGrid,
  MapPin,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  AppListItem,
  AppMetricCard,
  AppPage,
  AppPageContent,
  AppSectionLabel,
} from './AppMobileUI';
import {
  getAdminDashboard,
  type AdminDashboard,
} from '../services/adminService';

interface DashboardAdminProps {
  onNavigate: (screen: string) => void;
}

export function DashboardAdmin({ onNavigate }: DashboardAdminProps) {
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getAdminDashboard()
      .then(setDashboard)
      .catch((requestError: unknown) => {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Không thể tải dashboard.',
        );
      });
  }, []);

  if (error) {
    return <LoadState message={error} onRetry={() => window.location.reload()} />;
  }

  if (!dashboard) {
    return <LoadState message="Đang tải dữ liệu chủ sân..." />;
  }

  return (
    <AppPage>
      <section className="relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-primary to-primary-dark px-6 pb-6 pt-10 text-primary-foreground shadow-lg">
        <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute right-10 top-6 h-28 w-28 rounded-full bg-white/[0.03]" />
        <div className="pointer-events-none absolute -right-4 top-16 h-20 w-20 rounded-full bg-white/4" />

        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white/80">Xin chào, {dashboard.ownerName}</p>
            <h1 className="mt-1 text-[28px] font-black leading-tight">Trang chủ</h1>
            <p className="mt-2 text-sm leading-6 text-white/90">
              Hôm nay: {dashboard.localDate}
            </p>
            <p className="mt-1 text-xs leading-5 text-white/70">
              Theo dõi lịch sân, booking sắp diễn ra và các cảnh báo vận hành trong ngày.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-base font-black">
            {dashboard.ownerName.charAt(0)}
          </div>
        </div>
      </section>

      <AppPageContent className="space-y-5 pt-5">
        <div className="grid grid-cols-2 gap-3">
          <AppMetricCard
            icon={Calendar}
            value={dashboard.todayCoachUsageCount}
            label="Lịch sân HLV hôm nay"
            tone="primary"
          />
          <AppMetricCard
            icon={AlertCircle}
            value={dashboard.coachConflictCount}
            label="Xung đột lịch"
            tone="warning"
          />
          <AppMetricCard
            icon={Calendar}
            value={dashboard.todayBookingCount}
            label="Booking hôm nay"
            tone="success"
          />
          <AppMetricCard
            icon={Clock3}
            value={`${dashboard.monthlyCoachUsageHours.toLocaleString('vi-VN')} giờ`}
            label="Sử dụng sân tháng"
            tone="neutral"
          />
        </div>

        <AppSectionLabel>Thao tác nhanh</AppSectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <QuickAction
            icon={Calendar}
            label="Lịch vận hành"
            className="bg-primary"
            onClick={() => onNavigate('coach-operations-schedule')}
          />
          <QuickAction
            icon={MapPin}
            label="Lịch sân"
            className="bg-success"
            onClick={() => onNavigate('court-booking')}
          />
          <QuickAction
            icon={Handshake}
            label="Đối soát"
            className="bg-accent"
            onClick={() => onNavigate('finance-reconciliation')}
          />
          <QuickAction
            icon={DollarSign}
            label="Công nợ"
            className="bg-warning"
            onClick={() => onNavigate('finance-debts')}
          />
        </div>

        <button
          onClick={() => onNavigate('owner-operations')}
          className="flex w-full items-center gap-3 rounded-2xl p-4 text-left text-white shadow-md active:scale-[0.99]"
          style={{ background: 'linear-gradient(135deg,#054A49,#0E7C7B)' }}
          type="button"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <LayoutGrid className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold">Trung tâm vận hành chủ sân</p>
            <p className="mt-1 text-xs text-white/65">
              Quản lý sân, xung đột lịch và vận hành ca trực
            </p>
          </div>
          <ChevronRight className="h-5 w-5" />
        </button>

        <section className="space-y-3">
          <AppSectionLabel>Hoạt động sân của HLV hôm nay</AppSectionLabel>
          {dashboard.todayCoachOperations.map((operation) => (
            <AppListItem
              key={operation.id}
              title={operation.coachName}
              description={`${operation.timeRange} • ${operation.courtName} • ${operation.durationHours} giờ`}
              icon={Calendar}
              iconTone={
                operation.hasConflict
                  ? 'danger'
                  : operation.status === 'inProgress'
                    ? 'success'
                    : 'primary'
              }
              status={(
                <span
                  className={`${operation.hasConflict ? 'bg-rose-50 text-rose-600' : 'bg-primary/10 text-primary'} whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-black`}
                >
                  {operation.hasConflict
                    ? 'Xung đột'
                    : operation.status === 'inProgress'
                      ? 'Đang sử dụng'
                      : operation.status === 'completed'
                        ? 'Hoàn thành'
                        : 'Đã xếp lịch'}
                </span>
              )}
              onClick={() => onNavigate('coach-operations-schedule')}
            />
          ))}
        </section>

        <button
          onClick={() => onNavigate('coach-operations-schedule')}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card p-3 text-sm font-medium text-primary"
          type="button"
        >
          Xem lịch vận hành HLV
          <ChevronRight className="h-4 w-4" />
        </button>
      </AppPageContent>
    </AppPage>
  );
}

function QuickAction({
  icon: Icon,
  label,
  className,
  onClick,
}: {
  icon: typeof Calendar;
  label: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`${className} rounded-xl p-4 text-white shadow-md active:scale-95`}
      type="button"
    >
      <Icon className="mx-auto mb-2 h-6 w-6" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function LoadState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-lg bg-primary px-4 py-2 text-sm text-white"
          type="button"
        >
          Thử lại
        </button>
      )}
    </div>
  );
}
