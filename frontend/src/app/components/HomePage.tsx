import { Bell, Calendar, Users, Award, AlertCircle } from 'lucide-react';

export function HomePage() {
  return (
    <div className="flex flex-col gap-4 pb-20">
      <div className="bg-primary text-primary-foreground p-6 rounded-b-3xl shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl mb-1">Xin chào, Coach Minh</h1>
            <p className="text-sm opacity-90">Thứ Ba, 29/04/2026</p>
          </div>
          <button className="bg-white/20 p-2 rounded-full">
            <Bell className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Users className="w-6 h-6 mb-2" />
            <p className="text-2xl font-semibold">24</p>
            <p className="text-xs opacity-90">Học viên hôm nay</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <Calendar className="w-6 h-6 mb-2" />
            <p className="text-2xl font-semibold">3</p>
            <p className="text-xs opacity-90">Lớp học hôm nay</p>
          </div>
        </div>
      </div>

      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-warning" />
          <h2 className="text-base">Cần chú ý</h2>
        </div>

        <div className="bg-warning/10 border border-warning/30 rounded-xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="bg-warning/20 p-2 rounded-lg">
              <Award className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-foreground mb-1">5 học viên sắp hết buổi</p>
              <p className="text-xs text-muted-foreground">Cần thông báo gia hạn gói học</p>
            </div>
          </div>
        </div>

        <h2 className="text-base mb-3">Lịch hôm nay</h2>

        <div className="space-y-3">
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-medium">Lớp Cơ bản A1</h3>
                <p className="text-sm text-muted-foreground">07:00 - 08:30</p>
              </div>
              <span className="bg-success/10 text-success text-xs px-3 py-1 rounded-full">8/10 học viên</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sân 1 • Coach Minh</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-medium">Lớp Nâng cao B2</h3>
                <p className="text-sm text-muted-foreground">09:00 - 10:30</p>
              </div>
              <span className="bg-primary/10 text-primary text-xs px-3 py-1 rounded-full">6/8 học viên</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sân 2 • Coach Minh</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-base font-medium">Lớp Cơ bản A2</h3>
                <p className="text-sm text-muted-foreground">17:00 - 18:30</p>
              </div>
              <span className="bg-muted text-muted-foreground text-xs px-3 py-1 rounded-full">Chưa bắt đầu</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3.5 h-3.5" />
              <span>Sân 1 • Coach Hùng</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
