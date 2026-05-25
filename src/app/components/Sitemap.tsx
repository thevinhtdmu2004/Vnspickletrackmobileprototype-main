import { ArrowRight, Circle, Book } from 'lucide-react';

interface SitemapProps {
  onNavigate?: (screen: string) => void;
}

export function Sitemap({ onNavigate }: SitemapProps) {
  const flows = [
    {
      title: 'Authentication Flow',
      screens: ['Splash Screen', 'Login', 'Dashboard (Admin/Coach)'],
      color: 'primary'
    },
    {
      title: 'Admin Main Flow',
      screens: ['Dashboard Admin', 'Bottom Navigation (5 tabs)', 'Quick Actions', 'Thao tác nhanh'],
      color: 'accent'
    },
    {
      title: 'Coach Main Flow',
      screens: ['Dashboard Coach', 'Lớp hôm nay', 'Điểm danh nhanh', 'Xem lịch sử'],
      color: 'success'
    },
    {
      title: 'Student Management',
      screens: ['Danh sách học viên', 'Tìm kiếm & Filter', 'Thêm học viên', 'Chi tiết học viên', 'Sửa học viên', 'Xóa học viên', 'Lịch sử điểm danh'],
      color: 'primary'
    },
    {
      title: 'Package Renewal',
      screens: ['Gia hạn gói học', 'Chọn gói mới', 'Chọn thanh toán', 'Xác nhận', 'Thành công'],
      color: 'accent'
    },
    {
      title: 'Class Management',
      screens: ['Danh sách lớp học', 'Thêm lớp học', 'Sửa lớp học', 'Chi tiết lớp', 'Gán học viên', 'Quản lý lịch học'],
      color: 'primary'
    },
    {
      title: 'Attendance Flow',
      screens: ['Chọn lớp hôm nay', 'Danh sách học viên', 'Điểm danh (Có/Vắng)', 'Xác nhận', 'Hoàn tất'],
      color: 'success'
    },
    {
      title: 'Reports & Analytics',
      screens: ['Báo cáo tổng quan', 'Báo cáo học viên sắp hết buổi', 'Báo cáo doanh thu tháng', 'Thống kê lớp học', 'Xuất Excel/PDF'],
      color: 'primary'
    },
    {
      title: 'Settings & System',
      screens: ['Cài đặt', 'Thông tin cá nhân', 'Đổi mã PIN', 'Thông báo', 'Sao lưu dữ liệu', 'Trợ giúp', 'Đăng xuất'],
      color: 'secondary'
    },
    {
      title: 'Empty States',
      screens: ['Empty: Chưa có học viên', 'Empty: Chưa có lớp học', 'Empty: Chưa có báo cáo'],
      color: 'warning'
    }
  ];

  const bottomNav = [
    'Trang chủ',
    'Điểm danh',
    'Học viên',
    'Báo cáo',
    'Cài đặt'
  ];

  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className="text-xl mb-1">Sitemap & Structure</h1>
            <p className="text-sm opacity-90">VNS PickleTrack Mobile App</p>
          </div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('structure-guide')}
              className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors"
            >
              <Book className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="px-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
            <h2 className="text-sm font-medium text-accent-foreground mb-2">Tổng màn hình</h2>
            <p className="text-3xl font-bold text-accent">21+</p>
            <p className="text-xs text-muted-foreground mt-1">Bao gồm dialogs</p>
          </div>
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
            <h2 className="text-sm font-medium text-primary mb-2">Navigation flows</h2>
            <p className="text-3xl font-bold text-primary">10</p>
            <p className="text-xs text-muted-foreground mt-1">Luồng chính</p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <h3 className="text-sm font-medium mb-3">Bottom Navigation (5 tabs)</h3>
          <div className="space-y-2">
            {bottomNav.map((tab, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Circle className="w-2 h-2 fill-primary text-primary" />
                <span>{tab}</span>
              </div>
            ))}
          </div>
        </div>

        <h2 className="text-base mb-3">Navigation Flows</h2>
        <div className="space-y-3">
          {flows.map((flow, index) => {
            const getColorClasses = (color: string) => {
              const colors: Record<string, { border: string; text: string; bg: string; fill: string }> = {
                primary: { border: 'border-primary/20', text: 'text-primary', bg: 'bg-primary/5', fill: 'fill-primary' },
                accent: { border: 'border-accent/20', text: 'text-accent', bg: 'bg-accent/5', fill: 'fill-accent' },
                success: { border: 'border-success/20', text: 'text-success', bg: 'bg-success/5', fill: 'fill-success' },
                warning: { border: 'border-warning/20', text: 'text-warning', bg: 'bg-warning/5', fill: 'fill-warning' },
                secondary: { border: 'border-secondary/20', text: 'text-secondary', bg: 'bg-secondary/5', fill: 'fill-secondary' },
              };
              return colors[color] || colors.primary;
            };

            const colorClasses = getColorClasses(flow.color);

            return (
              <div key={index} className={`bg-card border ${colorClasses.border} rounded-xl p-4 shadow-sm ${colorClasses.bg}`}>
                <h3 className={`font-medium mb-3 ${colorClasses.text}`}>{flow.title}</h3>
                <div className="space-y-2">
                  {flow.screens.map((screen, screenIndex) => (
                    <div key={screenIndex} className="flex items-start gap-2">
                      {screenIndex > 0 && (
                        <ArrowRight className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      {screenIndex === 0 && (
                        <Circle className={`w-2 h-2 ${colorClasses.fill} ${colorClasses.text} mt-1.5 flex-shrink-0`} />
                      )}
                      <span className="text-sm text-muted-foreground">{screen}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 bg-card border border-border rounded-xl p-4">
          <h3 className="font-medium mb-3">Special Screens</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-warning text-warning" />
              <span className="text-muted-foreground">Empty State: Không có học viên</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-warning text-warning" />
              <span className="text-muted-foreground">Empty State: Không có lớp học</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-success text-success" />
              <span className="text-muted-foreground">Dialog: Xác nhận điểm danh</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-success text-success" />
              <span className="text-muted-foreground">Dialog: Xác nhận xóa</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-destructive text-destructive" />
              <span className="text-muted-foreground">Dialog: Lỗi kết nối</span>
            </div>
            <div className="flex items-center gap-2">
              <Circle className="w-2 h-2 fill-destructive text-destructive" />
              <span className="text-muted-foreground">Dialog: Thất bại</span>
            </div>
          </div>
        </div>

        <div className="mt-4 bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h3 className="font-medium mb-2 text-sm">Key User Journeys</h3>
          <div className="space-y-3 text-xs text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">1. Điểm danh nhanh (Coach)</p>
              <p>Login → Dashboard Coach → Lớp hôm nay → Điểm danh → Xong</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">2. Thêm học viên mới (Admin)</p>
              <p>Dashboard → Thêm học viên → Điền form → Chọn gói → Lưu</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">3. Gia hạn gói học (Admin)</p>
              <p>Dashboard → Học viên sắp hết → Chọn HV → Gia hạn → Thanh toán</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
