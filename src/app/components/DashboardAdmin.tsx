import { Calendar, Users, Award, AlertCircle, Plus, DollarSign, CheckCircle, Database, ChevronRight } from 'lucide-react';

interface DashboardAdminProps {
  onNavigate: (screen: string) => void;
}

export function DashboardAdmin({ onNavigate }: DashboardAdminProps) {
  const daysSinceBackup = 8; // Demo: 8 days since last backup

  return (
    <div className="flex flex-col gap-4 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-1">
          <div className="flex-1">
            <h1 className="text-xl font-medium mb-1">Xin chào, Admin</h1>
            <p className="text-sm opacity-90">Hôm nay: 29/04/2026</p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <span className="text-lg font-bold">A</span>
          </div>
        </div>
      </div>

      <div className="px-4">
        {/* Backup Warning Banner */}
        {daysSinceBackup >= 7 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive mb-1">Cảnh báo sao lưu</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Bạn chưa sao lưu dữ liệu trong hơn {daysSinceBackup} ngày
                </p>
                <button
                  onClick={() => onNavigate('settings')}
                  className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-all"
                >
                  Sao lưu ngay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards 2x2 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">3</p>
            <p className="text-sm text-muted-foreground">Lớp hôm nay</p>
          </div>

          <div className="bg-card border border-warning/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-warning/10 p-2 rounded-lg">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
            </div>
            <p className="text-3xl font-bold text-warning mb-1">5</p>
            <p className="text-sm text-muted-foreground">Sắp hết buổi</p>
          </div>

          <div className="bg-card border border-success/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-success/10 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold text-success mb-1">12.0M</p>
            <p className="text-sm text-muted-foreground">Doanh thu tháng</p>
          </div>

          <div className="bg-card border border-accent/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-accent/10 p-2 rounded-lg">
                <CheckCircle className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-3xl font-bold text-accent mb-1">86</p>
            <p className="text-sm text-muted-foreground">Lượt học tháng</p>
          </div>
        </div>

        {/* Quick Actions */}
        <h2 className="text-base font-medium mb-3">Thao tác nhanh</h2>
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => onNavigate('today-classes')}
            className="bg-primary text-primary-foreground rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Điểm danh hôm nay</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('add-student')}
            className="bg-success text-success-foreground rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 p-3 rounded-full">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Thêm học viên</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('renew-package')}
            className="bg-accent text-accent-foreground rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 p-3 rounded-full">
                <Award className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Gia hạn gói</span>
            </div>
          </button>

          <button
            onClick={() => onNavigate('report-expiring')}
            className="bg-warning text-warning-foreground rounded-xl p-4 shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <div className="flex flex-col items-center gap-2">
              <div className="bg-white/20 p-3 rounded-full">
                <AlertCircle className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Học viên sắp hết buổi</span>
            </div>
          </button>
        </div>

        {/* Today's Classes */}
        <h2 className="text-base font-medium mb-3">Lớp học hôm nay</h2>
        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-1">Lớp Cơ bản A1</h3>
                <p className="text-sm text-muted-foreground">07:00 - 08:30 • Sân 1 • Coach Minh</p>
              </div>
              <span className="bg-success/10 text-success text-xs px-3 py-1.5 rounded-full font-medium">
                8/10
              </span>
            </div>
            <button
              onClick={() => onNavigate('today-classes')}
              className="w-full bg-primary/10 text-primary py-2.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Điểm danh
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-1">Lớp Nâng cao B2</h3>
                <p className="text-sm text-muted-foreground">09:00 - 10:30 • Sân 2 • Coach Minh</p>
              </div>
              <span className="bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
                6/8
              </span>
            </div>
            <button
              onClick={() => onNavigate('today-classes')}
              className="w-full bg-primary/10 text-primary py-2.5 rounded-lg text-sm font-medium hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Điểm danh
            </button>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-medium mb-1">Lớp Cơ bản A2</h3>
                <p className="text-sm text-muted-foreground">17:00 - 18:30 • Sân 1 • Coach Hùng</p>
              </div>
              <span className="bg-muted text-muted-foreground text-xs px-3 py-1.5 rounded-full font-medium">
                10/10
              </span>
            </div>
            <button className="w-full bg-muted text-muted-foreground py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
              Chưa bắt đầu
            </button>
          </div>
        </div>

        {/* See All Classes */}
        <button
          onClick={() => onNavigate('class-list')}
          className="w-full mt-4 bg-card border border-border rounded-xl p-3 text-sm text-primary font-medium hover:bg-muted transition-colors flex items-center justify-center gap-2"
        >
          Xem tất cả lớp học
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}