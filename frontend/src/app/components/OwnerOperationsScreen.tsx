import {
  ClipboardList,
  Dumbbell,
  LayoutGrid,
} from 'lucide-react';
import { AppListItem, AppPage, AppPageContent, AppSectionLabel } from './AppMobileUI';
import { AppScreenHeader } from './AppScreenHeader';

interface OwnerOperationsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

const modules = [
  {
    title: 'Quản lý sân',
    description:
      'Danh sách sân, trạng thái vận hành, mặt sân, giờ hoạt động và cấu hình giá áp dụng.',
    icon: Dumbbell,
    color: '#0E7C7B',
    background: 'rgba(14,124,123,0.12)',
    action: 'court-management',
  },
  {
    title: 'Xung đột lịch sân',
    description:
      'Đối chiếu lịch trùng, chuyển sân, đổi giờ và xử lý các trường hợp cần điều phối.',
    icon: ClipboardList,
    color: '#E76F51',
    background: 'rgba(231,111,81,0.12)',
    action: 'booking-conflicts',
  },
  {
    title: 'Nhân viên & ca trực',
    description: 'Lịch trực, bàn giao ca và nhật ký vận hành trong ngày.',
    icon: ClipboardList,
    color: '#F4A261',
    background: 'rgba(244,162,97,0.14)',
    action: 'staff-operations',
  },
] as const;

export function OwnerOperationsScreen({
  onBack,
  onNavigate,
}: OwnerOperationsScreenProps) {
  return (
    <AppPage>
      <div className="bg-gradient-to-br from-[#043F3E] via-[#065A58] to-[#0E7C7B] pb-6 text-white">
        <AppScreenHeader
          title="Trung tâm vận hành"
          eyebrow="ADMIN · CHỦ SÂN"
          onBack={onBack}
          variant="hero"
          action={(
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <LayoutGrid className="h-6 w-6" />
            </div>
          )}
        />
      </div>

      <AppPageContent>
        <AppSectionLabel>Nghiệp vụ vận hành sân</AppSectionLabel>

        <div className="space-y-3 pt-1">
          {modules.map((module) => {
            return (
              <AppListItem
                key={module.title}
                title={module.title}
                description={module.description}
                icon={module.icon}
                iconTone={
                  module.action === 'court-management'
                    ? 'primary'
                    : module.action === 'booking-conflicts'
                      ? 'danger'
                      : 'warning'
                }
                onClick={() => onNavigate(module.action)}
              />
            );
          })}
        </div>
      </AppPageContent>
    </AppPage>
  );
}
