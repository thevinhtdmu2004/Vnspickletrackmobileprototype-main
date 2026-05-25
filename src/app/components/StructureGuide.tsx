import { ArrowLeft, FileText, Code, Layout, Database } from 'lucide-react';

interface StructureGuideProps {
  onBack: () => void;
}

export function StructureGuide({ onBack }: StructureGuideProps) {
  return (
    <div className="flex flex-col h-screen pb-20">
      <div className="bg-gradient-to-br from-primary to-primary-dark text-primary-foreground p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-1 hover:bg-white/20 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl">Hướng dẫn cấu trúc</h1>
        </div>
        <p className="text-sm opacity-90">Tài liệu cho Developer .NET MAUI</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Layout className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-medium">Cấu trúc Screens</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <span className="font-medium text-foreground">21+ màn hình chính</span></p>
            <p>• <span className="font-medium text-foreground">10 navigation flows</span></p>
            <p>• <span className="font-medium text-foreground">5 bottom tabs</span></p>
            <p>• <span className="font-medium text-foreground">3 empty states</span></p>
            <p>• <span className="font-medium text-foreground">4+ dialog types</span></p>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-accent/10 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-medium">Danh sách Screens</h2>
          </div>
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-medium mb-2">Authentication (3)</h3>
              <div className="space-y-1 text-sm text-muted-foreground pl-3">
                <p>1. SplashScreen.tsx</p>
                <p>2. LoginScreen.tsx</p>
                <p>3. DashboardAdmin / DashboardCoach.tsx</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Main Tabs (5)</h3>
              <div className="space-y-1 text-sm text-muted-foreground pl-3">
                <p>4. HomePage.tsx</p>
                <p>5. AttendancePage.tsx</p>
                <p>6. StudentsPage.tsx</p>
                <p>7. ReportsPage.tsx</p>
                <p>8. SettingsPage.tsx</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Student Management (4)</h3>
              <div className="space-y-1 text-sm text-muted-foreground pl-3">
                <p>9. AddStudentScreen.tsx</p>
                <p>10. EditStudentScreen.tsx (tương tự Add)</p>
                <p>11. StudentDetailScreen.tsx</p>
                <p>12. RenewPackageScreen.tsx</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Class Management (4)</h3>
              <div className="space-y-1 text-sm text-muted-foreground pl-3">
                <p>13. ClassListScreen.tsx</p>
                <p>14. AddClassScreen.tsx (tương tự Student)</p>
                <p>15. ClassDetailScreen.tsx (tương tự Student)</p>
                <p>16. AssignStudentsScreen.tsx</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Reports (2)</h3>
              <div className="space-y-1 text-sm text-muted-foreground pl-3">
                <p>17. ReportExpiringScreen.tsx</p>
                <p>18. RevenueReportScreen.tsx</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Utilities (3)</h3>
              <div className="space-y-1 text-sm text-muted-foreground pl-3">
                <p>19. EmptyStateStudents.tsx</p>
                <p>20. ConfirmDialog.tsx</p>
                <p>21. Sitemap.tsx (documentation)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <Code className="w-5 h-5 text-success" />
            </div>
            <h2 className="font-medium">Components tái sử dụng</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium mb-1">BottomNavigation.tsx</p>
              <p className="text-xs text-muted-foreground">5 tabs: Home, Điểm danh, Học viên, Báo cáo, Cài đặt</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium mb-1">ConfirmDialog.tsx</p>
              <p className="text-xs text-muted-foreground">3 types: success, warning, error</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="font-medium mb-1">EmptyState components</p>
              <p className="text-xs text-muted-foreground">Cho Students, Classes, Reports</p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-warning/10 p-2 rounded-lg">
              <Database className="w-5 h-5 text-warning" />
            </div>
            <h2 className="font-medium">Data Models cần thiết</h2>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• <span className="font-medium text-foreground">User:</span> Id, Name, Email, Role (Admin/Coach)</p>
            <p>• <span className="font-medium text-foreground">Student:</span> Id, Name, Phone, Email, PackageId, RemainingSession</p>
            <p>• <span className="font-medium text-foreground">Package:</span> Id, Name, SessionCount, Price</p>
            <p>• <span className="font-medium text-foreground">Class:</span> Id, Name, Level, Schedule, CoachId</p>
            <p>• <span className="font-medium text-foreground">Attendance:</span> Id, StudentId, ClassId, Date, Status</p>
            <p>• <span className="font-medium text-foreground">Payment:</span> Id, StudentId, Amount, Date, Method</p>
          </div>
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h3 className="text-sm font-medium mb-2">Navigation Flow chính</h3>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p><span className="font-medium text-foreground">Admin:</span> Login → Dashboard Admin → Bottom Tabs → Thao tác nhanh</p>
            <p><span className="font-medium text-foreground">Coach:</span> Login → Dashboard Coach → Điểm danh → Hoàn tất</p>
            <p><span className="font-medium text-foreground">Add Student:</span> Dashboard → Add → Form → Save → Success</p>
            <p><span className="font-medium text-foreground">Renew:</span> Student Detail → Renew → Select Package → Payment → Confirm</p>
          </div>
        </div>
      </div>
    </div>
  );
}
