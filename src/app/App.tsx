import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, PlusCircle, FileText, ArrowLeft } from 'lucide-react';

/* ── Component imports ── */
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/LoginScreen';
import { DashboardAdmin } from './components/DashboardAdmin';
import { DashboardCoach } from './components/DashboardCoach';
import { TodayClassesScreen } from './components/TodayClassesScreen';
import { AttendanceCheckScreen } from './components/AttendanceCheckScreen';
import { StudentsListScreen } from './components/StudentsListScreen';
import { AddStudentScreen } from './components/AddStudentScreen';
import { StudentDetailScreen } from './components/StudentDetailScreen';
import { EditStudentScreen } from './components/EditStudentScreen';
import { RenewPackageScreen } from './components/RenewPackageScreen';
import { PaymentHistoryScreen } from './components/PaymentHistoryScreen';
import { AttendanceHistoryScreen } from './components/AttendanceHistoryScreen';
import { ReportsPage } from './components/ReportsPage';
import { ReportExpiringScreen } from './components/ReportExpiringScreen';
import { RevenueReportScreen } from './components/RevenueReportScreen';
import { SettingsPage } from './components/SettingsPage';
import { BackupScreen } from './components/BackupScreen';
import { ClassListScreen } from './components/ClassListScreen';
import { AddClassScreen } from './components/AddClassScreen';
import { EditClassScreen } from './components/EditClassScreen';
import { ClassDetailScreen } from './components/ClassDetailScreen';
import { AssignStudentsScreen } from './components/AssignStudentsScreen';
import { SelectClassForSessionScreen } from './components/SelectClassForSessionScreen';
import { SessionDetailScreen } from './components/SessionDetailScreen';
import { CompleteSessionScreen } from './components/CompleteSessionScreen';
import { MonthlySessionReportScreen } from './components/MonthlySessionReportScreen';
import { ExportCSVScreen } from './components/ExportCSVScreen';
import { RestoreDataScreen } from './components/RestoreDataScreen';
import { PackageManagementScreen } from './components/PackageManagementScreen';
import { PackageFormScreen } from './components/PackageFormScreen';
import { SessionCreatedSuccessScreen } from './components/SessionCreatedSuccessScreen';
import { ClassReportScreen } from './components/ClassReportScreen';
import { StudentReportScreen } from './components/StudentReportScreen';
import { BackupSuccessScreen } from './components/BackupSuccessScreen';
import { PrototypeFlowPanel } from './components/PrototypeFlowPanel';
import type { Screen } from './components/PrototypeFlowPanel';
import { BottomNavigation } from './components/BottomNavigation';
import { UserManagementScreen } from './components/UserManagementScreen';
import { AddUserScreen } from './components/AddUserScreen';
import { ChangePINScreen } from './components/ChangePINScreen';
import { EmptyStatesScreen } from './components/EmptyStates';
import { AccessDeniedScreen } from './components/AccessDeniedScreen';

/* ── Newly wired screens ── */
import { AdjustSessionsScreen } from './components/AdjustSessionsScreen';
import { ChangeStudentStatusDialogScreen } from './components/ChangeStudentStatusDialog';
import { CancelSessionDialog } from './components/CancelSessionDialog';
import { CompleteSessionDialog } from './components/CompleteSessionDialog';
import { SuspendClassDialog } from './components/SuspendClassDialog';
import { DialogsShowcase } from './components/DialogsShowcase';
import { AttendanceDialogsDemo } from './components/AttendanceDialogsDemo';
import { ImportantConfirmDialogScreen } from './components/ImportantConfirmDialogScreen';
import { ComponentLibraryScreen } from './components/ComponentLibraryScreen';
import { DevHandoffScreen } from './components/DevHandoffScreen';
import { Sitemap } from './components/Sitemap';
import { ScreenFlowDocument } from './components/ScreenFlowDocument';

/* ── Member / Student role screens ── */
import { MemberDashboard } from './components/MemberDashboard';
import { MemberProfileScreen } from './components/MemberProfileScreen';
import { MemberScheduleScreen } from './components/MemberScheduleScreen';
import { MemberPackageScreen } from './components/MemberPackageScreen';
import { MemberCartScreen } from './components/MemberCartScreen';
import { MemberPaymentHistoryScreen } from './components/MemberPaymentHistoryScreen';
import { MemberRenewRequestScreen } from './components/MemberRenewRequestScreen';
import { MemberSessionWarningScreen } from './components/MemberSessionWarningScreen';
import { MemberContactScreen } from './components/MemberContactScreen';
import { MemberMakeupRegisterScreen } from './components/MemberMakeupRegisterScreen';
import { MemberCourseMaterialsScreen } from './components/MemberCourseMaterialsScreen';
import { MemberCourseVideoScreen } from './components/MemberCourseVideoScreen';
import { MemberCourseDocumentScreen } from './components/MemberCourseDocumentScreen';
import { MemberLearningProgressScreen } from './components/MemberLearningProgressScreen';
import { MemberTrialRegisterScreen } from './components/MemberTrialRegisterScreen';
import { MemberBottomNavigation } from './components/MemberBottomNavigation';
import { MemberCartPopup } from './components/MemberCartPopup';
import { MemberCourseListScreen } from './components/MemberCourseListScreen';
import { MemberCourseDetailScreen } from './components/MemberCourseDetailScreen';
import { PurchaseHistoryScreen } from './components/PurchaseHistoryScreen';

/* ── Success Dialog ── */
interface SuccessDialogProps {
  message: string;
  onClose: () => void;
}
function SuccessDialog({ message, onClose }: SuccessDialogProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 1800);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-8"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[280px] bg-card rounded-3xl text-center overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)', animation: 'fadeInScale 200ms ease both' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="pt-8 pb-4 flex justify-center">
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 80, height: 80, background: 'rgba(42,157,143,0.12)', border: '6px solid rgba(42,157,143,0.22)' }}
          >
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 58, height: 58, background: 'rgba(42,157,143,0.22)' }}
            >
              <CheckCircle2 style={{ width: 30, height: 30, color: '#2A9D8F' }} />
            </div>
          </div>
        </div>
        <p style={{ fontSize: '20px', fontWeight: 800, color: '#0E7C7B' }}>Thành công!</p>
        <p className="text-muted-foreground mt-1.5 px-6 pb-2" style={{ fontSize: '13px', lineHeight: 1.5 }}>
          {message}
        </p>
        <div className="flex justify-center pb-6 mt-2">
          <div className="h-1 w-16 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ background: '#0E7C7B', animation: 'progressBar 1.8s linear both' }}
            />
          </div>
        </div>
      </div>
      <style>{`
        @keyframes progressBar {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  );
}

/* ── Tab screens ── */
const TAB_SCREENS: Screen[] = ['dashboard', 'today-classes', 'students-list', 'reports', 'settings'];
type Role = 'admin' | 'coach' | 'member';

const ROUTE_ALIASES: Partial<Record<string, Screen>> = {
  'attendance-today': 'today-classes',
  students: 'students-list',
  attendance: 'attendance-check',
};

const PUBLIC_SCREENS = new Set<string>(['splash', 'login']);

const COACH_ALLOWED_SCREENS = new Set<string>([
  'dashboard-coach',
  'today-classes',
  'attendance-check',
  'students-list',
  'student-detail',
  'attendance-history',
  'reports',
  'report-expiring',
  'class-report',
  'student-report',
  'settings',
  'change-pin',
  'class-list',
  'class-detail',
  'select-class-session',
  'session-detail',
  'complete-session',
  'monthly-report',
  'cancel-session-dialog',
  'complete-session-dialog',
  'attendance-dialogs-demo',
]);

const ADMIN_BLOCKED_SCREENS = new Set<string>([
  'dashboard-coach',
  'member-dashboard',
  'member-profile',
  'member-schedule',
  'member-package',
  'member-attendance-history',
  'member-payment-history',
  'member-renew-request',
  'member-session-warning',
  'member-contact',
]);

const SCREEN_LABELS: Partial<Record<Screen, string>> = {
  dashboard: 'Dashboard Admin',
  'dashboard-coach': 'Dashboard Coach',
  'today-classes': 'Lớp hôm nay',
  'attendance-check': 'Điểm danh học viên',
  'students-list': 'Danh sách học viên',
  'add-student': 'Thêm học viên',
  'student-detail': 'Chi tiết học viên',
  'renew-package': 'Gia hạn gói học',
  reports: 'Báo cáo',
  'report-revenue': 'Doanh thu tháng',
  settings: 'Cài đặt',
  backup: 'Sao lưu dữ liệu',
  'export-csv': 'Xuất CSV',
  'restore-data': 'Khôi phục dữ liệu',
  'package-management': 'Quản lý gói học',
  'user-management': 'Quản lý người dùng',
  'member-dashboard': 'Dashboard Hội viên',
  'member-schedule': 'Lịch học Hội viên',
  'member-package': 'Gói học Hội viên',
  'member-attendance-history': 'Lịch sử học Hội viên',
  'member-payment-history': 'Lịch sử thanh toán Hội viên',
  'member-renew-request': 'Yêu cầu gia hạn',
  'member-makeup-register': 'Đăng ký học bù',
  'member-course-materials': 'Tài liệu khóa học',
  'member-learning-progress': 'Quá trình học',
  'member-trial-register': 'Đăng ký học thử',
  'member-course-list': 'Khám phá khóa học',
  'member-course-detail': 'Chi tiết khóa học',
};

function normalizeScreen(screen: Screen): Screen {
  return ROUTE_ALIASES[screen] ?? screen;
}

function homeForRole(role: Role): Screen {
  if (role === 'coach') return 'dashboard-coach' as Screen;
  if (role === 'member') return 'member-dashboard' as Screen;
  return 'dashboard';
}

function roleDisplayName(role: Role) {
  if (role === 'coach') return 'Huấn luyện viên';
  if (role === 'member') return 'Hội viên';
  return 'Quản trị viên';
}

function canAccessScreen(screen: Screen, role: Role) {
  const normalized = normalizeScreen(screen);
  const screenId = normalized as string;

  if (PUBLIC_SCREENS.has(screenId)) return true;
  if (role === 'member') return screenId.startsWith('member-') || screenId === 'purchase-history';
  if (role === 'coach') return COACH_ALLOWED_SCREENS.has(screenId);
  return !ADMIN_BLOCKED_SCREENS.has(screenId);
}

export default function App() {
  /* ── Navigation stack ── */
  const [stack, setStack] = useState<Screen[]>(['splash']);
  const [dir, setDir] = useState<'forward' | 'back' | 'tab'>('forward');
  const [animKey, setAnimKey] = useState(0);

  /* ── Role ── */
  const [role, setRole] = useState<Role>('admin');

  /* ── Member / Student state simulations ── */
  const [hasActivePackage, setHasActivePackage] = useState(true);
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Hệ thống: Gói học Beginner A (12 buổi) đã được kích hoạt thành công!', time: 'Hôm qua', icon: '🎉', unread: true },
    { id: '2', message: 'Đã điểm danh: Có mặt buổi học ngày 27/04/2026.', time: '2 ngày trước', icon: '✅', unread: false }
  ]);
  const [makeupRequests, setMakeupRequests] = useState<Array<{
    id: string;
    courseName: string;
    missedDate: string;
    desiredDate: string;
    desiredTime: string;
    note: string;
    studentName: string;
    status: 'pending' | 'approved';
  }>>([
    { id: 'req_1', courseName: 'Beginner A', missedDate: '15/05/2026', desiredDate: '20/05/2026', desiredTime: '18:00 – 19:30', note: 'Em xin học bù ca tối', studentName: 'Nguyễn Văn A', status: 'pending' }
  ]);
  type MakeupRequest = (typeof makeupRequests)[number];

  /* ── Canteen / Cart Simulation State ── */
  const [cartItems, setCartItems] = useState<any[]>([
    {
      product: { id: 1, name: 'Nước suối Aquafina 500ml', price: 15000, priceStr: '15.000đ', image: '💧', category: 'Đồ uống' },
      quantity: 2
    },
    {
      product: { id: 3, name: 'Bóng Franklin X-40', price: 45000, priceStr: '45.000đ', image: '🥎', category: 'Dụng cụ' },
      quantity: 1
    }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartOrdered, setIsCartOrdered] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<any[]>([
    { id: 'INV-902', date: '15/06/2026', items: '2 Nước Aquafina, 1 Bóng Franklin', amount: '75.000đ', status: 'Đã nhận hàng' },
    { id: 'INV-765', date: '10/06/2026', items: '1 Nước điện giải Revive', amount: '20.000đ', status: 'Đã nhận hàng' }
  ]);

  const handleAddToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQuantity = (productId: number, change: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + change;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(item => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckoutCart = () => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const itemsDescription = cartItems.map(item => `${item.quantity} ${item.product.name.split(' ')[0]}`).join(', ');
    
    const newPurchase = {
      id: 'INV-' + Math.floor(100 + Math.random() * 900),
      date: new Date().toLocaleDateString('vi-VN'),
      items: itemsDescription,
      amount: total.toLocaleString('vi-VN') + 'đ',
      status: 'Đã nhận hàng'
    };
    
    setPurchaseHistory(prev => [newPurchase, ...prev]);
    setIsCartOrdered(true);
  };

  const handleResetCartOrder = () => {
    setCartItems([]);
    setIsCartOrdered(false);
  };

  const handleApproveMakeupRequest = (requestId: string, approvedDate: string) => {
    setMakeupRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        // Add new notification
        const newNotif = {
          id: 'notif_' + Date.now(),
          message: `HLV đã duyệt yêu cầu học bù của bạn. Buổi học bù chính thức được xếp vào ngày ${approvedDate} (${req.desiredTime}).`,
          time: 'Vừa xong',
          icon: '📅',
          unread: true
        };
        setNotifications(n => [newNotif, ...n]);
        return { ...req, status: 'approved' as 'pending' | 'approved' };
      }
      return req;
    }));
  };

  const handleSubmitMakeupRequest = (newRequest: any) => {
    setMakeupRequests(prev => [
      { ...newRequest, status: 'pending' as const },
      ...prev
    ]);
  };

  const handleMarkNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  /* ── Success dialog ── */
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const successCb = useRef<(() => void) | null>(null);

  /* ── Current screen ── */
  const currentScreen = stack[stack.length - 1];

  function navigate(screen: Screen, replace = false) {
    const target = normalizeScreen(screen);
    setDir('forward');
    setAnimKey(k => k + 1);
    setStack(prev => replace ? [...prev.slice(0, -1), target] : [...prev, target]);
  }

  function goBack() {
    if (stack.length <= 1) return;
    setDir('back');
    setAnimKey(k => k + 1);
    setStack(prev => prev.slice(0, -1));
  }

  function switchTab(screen: Screen) {
    const target = normalizeScreen(screen);
    setDir('tab');
    setAnimKey(k => k + 1);
    setStack([target]);
  }

  function showSuccess(msg: string, cb: () => void) {
    successCb.current = cb;
    setSuccessMsg(msg);
  }

  function onSuccessClose() {
    setSuccessMsg(null);
    successCb.current?.();
    successCb.current = null;
  }

  function logout() {
    setRole('admin');
    setDir('back');
    setAnimKey(k => k + 1);
    setStack(['login']);
  }

  function leaveBlockedRoute() {
    if (stack.length > 1) {
      goBack();
      return;
    }
    switchTab(homeForRole(role));
  }

  /* ── Jump (from flow panel) ── */
  function handleJump(screen: Screen, flowRole?: Role) {
    const target = normalizeScreen(screen);
    if (flowRole) setRole(flowRole);
    if (target === 'dashboard' && flowRole === 'coach') {
      setDir('tab');
      setAnimKey(k => k + 1);
      setStack(['dashboard-coach' as Screen]);
    } else if (target === 'dashboard' && flowRole === 'member') {
      setDir('tab');
      setAnimKey(k => k + 1);
      setStack(['member-dashboard' as Screen]);
    } else {
      setDir('forward');
      setAnimKey(k => k + 1);
      setStack([target]);
    }
  }

  /* ── Auto Splash → Login ── */
  useEffect(() => {
    if (currentScreen === 'splash') {
      const t = setTimeout(() => navigate('login', true), 2500);
      return () => clearTimeout(t);
    }
  }, [currentScreen]);

  /* ── Animation class ── */
  const animClass = dir === 'back' ? 'screen-enter-back' : dir === 'tab' ? 'screen-enter-tab' : 'screen-enter-forward';

  /* ── Show bottom nav ── */
  const showNav = role !== 'member' && (TAB_SCREENS.includes(currentScreen) || currentScreen === ('dashboard-coach' as Screen));

  /* ── Member tab screens ── */
  const MEMBER_TAB_SCREENS: Screen[] = [
    'member-dashboard', 'member-schedule', 'member-package',
    'member-cart', 'member-profile',
  ];
  const showMemberNav = role === 'member' && MEMBER_TAB_SCREENS.includes(currentScreen);

  /* ── Member tab active ── */
  const memberTabActive = currentScreen;

  /* ── Active tab ── */
  const activeTab =
    currentScreen === 'dashboard' || currentScreen === ('dashboard-coach' as Screen)
      ? 'home'
      : TAB_SCREENS.includes(currentScreen)
        ? currentScreen
        : 'home';

  /* ── Render ── */
  function renderScreen() {
    if (!canAccessScreen(currentScreen, role)) {
      return (
        <AccessDeniedScreen
          onBack={leaveBlockedRoute}
          roleName={roleDisplayName(role)}
          featureName={SCREEN_LABELS[currentScreen] ?? currentScreen}
        />
      );
    }

    switch (currentScreen as string) {

      /* ── Onboarding ── */
      case 'splash':
        return <SplashScreen />;

      case 'login':
        return (
          <LoginScreen onLogin={(r) => {
            setRole(r);
            const home = homeForRole(r);
            setDir('forward');
            setAnimKey(k => k + 1);
            setStack([home]);
          }} />
        );

      /* ── Dashboards ── */
      case 'dashboard':
        return (
          <DashboardAdmin onNavigate={(s) => navigate(s as Screen)} />
        );

      case 'dashboard-coach':
        return (
          <DashboardCoach
            onNavigate={(s) => navigate(s as Screen)}
            makeupRequests={makeupRequests}
            onApproveMakeupRequest={handleApproveMakeupRequest}
          />
        );

      /* ── Attendance ── */
      case 'today-classes':
        return (
          <TodayClassesScreen
            onAttendance={() => navigate('session-detail')}
            onCreateClass={() => navigate('select-class-session')}
          />
        );

      case 'attendance-check':
        return (
          <AttendanceCheckScreen
            onBack={goBack}
            onSave={() => showSuccess('Đã lưu điểm danh thành công!', () => navigate('today-classes', true))}
          />
        );

      /* ── Students ── */
      case 'students-list':
        return (
          <StudentsListScreen
            onAddStudent={() => navigate('add-student')}
            onStudentDetail={() => navigate('student-detail')}
          />
        );

      case 'add-student':
        return (
          <AddStudentScreen
            onBack={goBack}
            onSave={() => showSuccess('Đã thêm học viên thành công!', () => navigate('student-detail', true))}
          />
        );

      case 'student-detail':
        return (
          <StudentDetailScreen
            onBack={goBack}
            onEdit={() => navigate('edit-student')}
            onRenew={() => navigate('renew-package')}
            onPaymentHistory={() => navigate('payment-history')}
            onAttendanceHistory={() => navigate('attendance-history')}
          />
        );

      case 'renew-package':
        return (
          <RenewPackageScreen
            onBack={goBack}
            onConfirm={() => showSuccess('Đã gia hạn gói học thành công!', () => navigate('student-detail', true))}
          />
        );

      /* ── Reports ── */
      case 'reports':
        return <ReportsPage role={role} onNavigate={(s) => navigate(s as Screen)} />;

      case 'report-expiring':
        return (
          <ReportExpiringScreen
            onBack={goBack}
            onRenew={() => navigate('renew-package')}
          />
        );

      case 'report-revenue':
        if (role !== 'admin') {
          return (
            <AccessDeniedScreen
              onBack={goBack}
              roleName={role === 'coach' ? 'Huấn luyện viên' : 'Hội viên'}
              featureName="Doanh thu tháng"
            />
          );
        }
        return <RevenueReportScreen onBack={goBack} />;

      case 'class-report':
        return <ClassReportScreen onBack={goBack} onNavigate={(s) => navigate(s as Screen)} />;

      case 'student-report':
        return <StudentReportScreen onBack={goBack} onNavigate={(s) => navigate(s as Screen)} />;

      /* ── Settings ── */
      case 'settings':
        return (
          <SettingsPage
            role={role}
            onNavigate={(s) => navigate(s as Screen)}
            onLogout={logout}
          />
        );

      case 'backup':
        return <BackupScreen onBack={goBack} onNavigate={(s) => navigate(s as Screen)} />;

      case 'backup-success':
        return (
          <BackupSuccessScreen
            onShare={() => {
              console.log('Share backup file');
              // In real app: trigger native share
            }}
            onBack={() => navigate('settings', true)}
          />
        );

      /* ── Classes ── */
      case 'class-list':
        return (
          <ClassListScreen
            onBack={goBack}
            onAddClass={() => navigate('add-class')}
            onClassDetail={() => navigate('class-detail')}
            onCreateSession={() => navigate('session-created-success')}
          />
        );

      case 'add-class':
        return (
          <AddClassScreen
            onBack={goBack}
            onSave={() => showSuccess('Đã thêm lớp học thành công!', goBack)}
          />
        );

      case 'edit-class':
        return (
          <EditClassScreen
            onBack={goBack}
            onSave={() => showSuccess('Đã cập nhật lớp học thành công!', goBack)}
          />
        );

      case 'class-detail':
        return (
          <ClassDetailScreen
            onBack={goBack}
            onEdit={() => navigate('edit-class')}
            onAssignStudents={() => navigate('assign-students')}
            onStudentDetail={() => navigate('student-detail')}
            onCreateSession={() => navigate('session-created-success')}
            onSessionDetail={() => navigate('session-detail')}
          />
        );

      case 'assign-students':
        return (
          <AssignStudentsScreen
            onBack={goBack}
            onConfirm={() => showSuccess('Đã cập nhật danh sách học viên trong lớp!', goBack)}
          />
        );

      /* ── Sessions ── */
      case 'select-class-session':
        return (
          <SelectClassForSessionScreen
            onBack={goBack}
            onSelect={() => navigate('session-detail')}
          />
        );

      case 'session-created-success':
        return (
          <SessionCreatedSuccessScreen
            onAttendance={() => navigate('session-detail')}
            onBack={() => navigate('today-classes', true)}
          />
        );

      case 'session-detail':
        return (
          <SessionDetailScreen
            onBack={goBack}
            onComplete={() => navigate('complete-session')}
            onAttendance={() => navigate('attendance-check')}
          />
        );

      case 'complete-session':
        return (
          <CompleteSessionScreen
            onBack={goBack}
            onComplete={() => showSuccess('Đã hoàn tất buổi học thành công!', () => navigate('today-classes', true))}
            onCancel={() => showSuccess('Đã hủy buổi học.', () => navigate('today-classes', true))}
          />
        );

      /* ── Student extras ── */
      case 'edit-student':
        return (
          <EditStudentScreen
            onBack={goBack}
            onSave={() => showSuccess('Đã cập nhật thông tin học viên!', () => navigate('student-detail', true))}
          />
        );

      case 'adjust-sessions':
        return (
          <AdjustSessionsScreen
            onBack={goBack}
            onConfirm={() => showSuccess('Đã điều chỉnh số buổi thành công!', () => navigate('student-detail', true))}
          />
        );

      case 'change-student-status':
        return (
          <ChangeStudentStatusDialogScreen
            onBack={goBack}
            onConfirm={() => showSuccess('Đã cập nhật trạng thái học viên!', () => navigate('student-detail', true))}
          />
        );

      case 'payment-history':
        return <PaymentHistoryScreen onBack={goBack} onRenew={() => navigate('renew-package')} />;

      case 'attendance-history':
        return <AttendanceHistoryScreen onBack={goBack} />;

      /* ── Session dialogs (standalone demo pages) ── */
      case 'cancel-session-dialog':
        return (
          <div className="relative h-screen flex flex-col items-center justify-end bg-gray-900/60">
            <div className="absolute inset-0 bg-[#F7F9FA]" style={{ filter: 'blur(2px)', opacity: 0.5 }} />
            <CancelSessionDialog
              visible={true}
              onClose={goBack}
              onConfirm={() => showSuccess('Đã hủy buổi học thành công!', () => navigate('today-classes', true))}
            />
          </div>
        );

      case 'complete-session-dialog':
        return (
          <div className="relative h-screen">
            <div className="absolute inset-0 bg-[#F7F9FA]" />
            <CompleteSessionDialog
              visible={true}
              onClose={goBack}
              onConfirm={() => showSuccess('Đã hoàn tất buổi học!', () => navigate('today-classes', true))}
            />
          </div>
        );

      case 'suspend-class-dialog':
        return (
          <div className="relative h-screen">
            <div className="absolute inset-0 bg-[#F7F9FA]" />
            <SuspendClassDialog
              visible={true}
              onClose={goBack}
              onConfirm={() => showSuccess('Đã ngưng lớp học!', () => navigate('class-list', true))}
            />
          </div>
        );

      /* ── Dialog showcases ── */
      case 'dialogs-showcase':
        return (
          <DialogsShowcase onBack={goBack} />
        );

      case 'confirm-dialogs':
        return (
          <ImportantConfirmDialogScreen onBack={goBack} />
        );

      case 'attendance-dialogs-demo':
        return (
          <AttendanceDialogsDemo onBack={goBack} />
        );

      /* ── Dev / design tools ── */
      case 'component-library':
        return (
          <ComponentLibraryScreen onBack={goBack} />
        );

      case 'dev-handoff':
        return (
          <DevHandoffScreen onBack={goBack} />
        );

      case 'sitemap':
        return (
          <Sitemap onNavigate={(s) => navigate(s as Screen)} />
        );

      case 'screen-flow-doc':
        return (
          <ScreenFlowDocument onBack={goBack} />
        );

      /* ── Reports ── */
      case 'monthly-report':
        return <MonthlySessionReportScreen onBack={goBack} />;

      /* ── Data management ── */
      case 'export-csv':
        return <ExportCSVScreen onBack={goBack} />;

      case 'restore-data':
        return <RestoreDataScreen onBack={goBack} />;

      /* ── Settings extras ── */
      case 'package-management':
        return (
          <PackageManagementScreen
            onBack={goBack}
            onAddPackage={() => navigate('package-form')}
            onEditPackage={() => navigate('package-form')}
          />
        );

      case 'package-form':
        return (
          <PackageFormScreen
            onBack={goBack}
            onSave={() => showSuccess('Đã lưu gói học thành công!', goBack)}
          />
        );

      case 'user-management':
        return (
          <UserManagementScreen
            onBack={goBack}
            onAddUser={() => navigate('add-user' as Screen)}
            onEditUser={() => navigate('add-user' as Screen)}
          />
        );

      case 'add-user':
        return (
          <AddUserScreen
            onBack={goBack}
            onSave={() => showSuccess('Đã thêm người dùng thành công!', () => navigate('user-management', true))}
          />
        );

      case 'change-pin':
        return (
          <ChangePINScreen
            onBack={goBack}
            onSave={() => navigate('settings', true)}
          />
        );

      case 'empty-states':
        return (
          <EmptyStatesScreen
            onBack={goBack}
            onAddStudent={() => navigate('add-student')}
            onAddClass={() => navigate('add-class')}
            onCreateSession={() => navigate('select-class-session')}
          />
        );

      /* ══ MEMBER / STUDENT ROLE ══ */
      case 'member-dashboard':
        return (
          <MemberDashboard
            onNavigate={(s) => navigate(s as Screen)}
            onNotification={() => navigate('member-session-warning')}
            hasActivePackage={hasActivePackage}
            notifications={notifications}
            unreadNotifications={notifications.some(n => n.unread)}
            onMarkNotificationsAsRead={handleMarkNotificationsAsRead}
            onOpenCart={() => setIsCartOpen(true)}
            cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          />
        );

      case 'member-profile':
        return (
          <MemberProfileScreen
            onNavigate={(s) => navigate(s as Screen)}
            onLogout={logout}
            purchaseHistory={purchaseHistory}
            hasActivePackage={hasActivePackage}
          />
        );

      case 'member-schedule':
        return <MemberScheduleScreen onNavigate={(s) => navigate(s as Screen)} />;

      case 'member-package':
        return (
          <MemberPackageScreen
            onRenew={() => navigate('member-renew-request')}
            hasActivePackage={hasActivePackage}
          />
        );

      case 'member-cart':
        return (
          <MemberCartScreen
            onAddToCart={handleAddToCart}
            onOpenCart={() => setIsCartOpen(true)}
            cartItemsCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          />
        );

      case 'member-payment-history':
        return <MemberPaymentHistoryScreen />;

      case 'member-renew-request':
        return (
          <MemberRenewRequestScreen
            onBack={goBack}
            onSubmit={() => showSuccess('Yêu cầu gia hạn đã được gửi! Admin sẽ xác nhận sớm.', () => navigate('member-package', true))}
          />
        );

      case 'member-session-warning':
        return (
          <MemberSessionWarningScreen
            onRenew={() => navigate('member-renew-request')}
            onDismiss={goBack}
          />
        );

      case 'member-contact':
        return (
          <MemberContactScreen
            onBack={goBack}
          />
        );

      case 'member-makeup-register':
        return (
          <MemberMakeupRegisterScreen
            onBack={goBack}
            onSubmitMakeupRequest={handleSubmitMakeupRequest}
          />
        );

      case 'member-course-materials':
        return (
          <MemberCourseMaterialsScreen
            onBack={goBack}
            onOpenVideo={(materialId) => navigate(`member-course-video-${materialId}` as Screen)}
            onOpenDocument={(materialId) => navigate(`member-course-document-${materialId}` as Screen)}
          />
        );

      case 'member-course-video-2':
        return <MemberCourseVideoScreen onBack={goBack} title="Hướng dẫn kỹ thuật Giao bóng (Serve)" courseName="Beginner A" coachName="Coach Nam" />;

      case 'member-course-video-4':
        return <MemberCourseVideoScreen onBack={goBack} title="Chiến thuật đánh đôi (Nâng cao)" courseName="Beginner B" coachName="Coach Linh" />;

      case 'member-course-document-1':
        return <MemberCourseDocumentScreen onBack={goBack} title="Luật chơi Pickleball cơ bản 2026" courseName="Beginner A" coachName="Coach Nam" contentType="pdf" />;

      case 'member-course-document-3':
        return <MemberCourseDocumentScreen onBack={goBack} title="Giáo trình thực hành Tuần 1-4" courseName="Beginner A" coachName="Coach Nam" contentType="doc" />;

      case 'member-course-document-5':
        return <MemberCourseDocumentScreen onBack={goBack} title="Lỗi thường gặp và cách khắc phục" courseName="Beginner B" coachName="Coach Linh" contentType="pdf" />;

      case 'member-learning-progress':
        return (
          <MemberLearningProgressScreen
            onBack={goBack}
            onNavigate={(s) => navigate(s as Screen)}
          />
        );

      case 'member-trial-register':
        return (
          <MemberTrialRegisterScreen
            onBack={goBack}
            onNavigate={(s) => navigate(s as Screen)}
          />
        );

       case 'member-course-list':
         return (
           <MemberCourseListScreen
             onBack={goBack}
             onCourseDetail={() => navigate('member-course-detail')}
             onPurchaseHistory={() => navigate('purchase-history')}
           />
         );

      case 'member-course-detail':
        return (
          <MemberCourseDetailScreen
            onBack={goBack}
            onRegister={() => showSuccess('Đăng ký khóa học thành công! HLV sẽ liên hệ sớm.', () => navigate('member-dashboard', true))}
          />
        );

      case 'purchase-history':
        return (
          <PurchaseHistoryScreen
            onBack={goBack}
            onCourseDetail={(courseId) => navigate('member-course-detail')}
            onViewSchedule={() => navigate('member-schedule')}
            onContinueLearning={() => navigate('member-learning-progress')}
          />
        );

      default:
        return <DashboardAdmin onNavigate={(s) => navigate(s as Screen)} />;
    }
  }

  /* ── Tab bar handler ── */
  function handleTabChange(tab: string) {
    const tabMap: Record<string, Screen> = {
      'home': homeForRole(role),
      'today-classes': 'today-classes',
      'students-list': 'students-list',
      'reports': 'reports',
      'settings': 'settings',
    };
    const target = tabMap[tab] ?? (tab as Screen);
    switchTab(target);
  }

  return (
    <div className="min-h-screen bg-muted/30">

      {/* ── Full-width screens (bypass device frame) ── */}
      {currentScreen === 'screen-flow-doc' ? (
        <div className="min-h-screen" style={{ background: '#F7F9FA' }}>
          <ScreenFlowDocument onBack={goBack} />
          <PrototypeFlowPanel
            currentScreen={currentScreen as Screen}
            onJump={handleJump}
          />
        </div>
      ) : (
        /* ── Device frame ── */
        <div
          className="max-w-[390px] mx-auto min-h-screen bg-background relative overflow-hidden shadow-2xl"
          style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.08), 0 8px 40px rgba(0,0,0,0.12)' }}
        >
          {/* ── Screen with transition ── */}
          <div
            key={animKey}
            className={`h-screen overflow-y-auto ${animClass}`}
          >
            {renderScreen()}
          </div>

          {/* ── Bottom nav ── */}
          {showNav && (
            <BottomNavigation
              currentTab={activeTab}
              onTabChange={handleTabChange}
            />
          )}

          {/* ── Member Bottom nav ── */}
          {showMemberNav && (
            <MemberBottomNavigation
              currentTab={memberTabActive}
              onTabChange={(tab) => switchTab(tab as Screen)}
              hasUnreadNotifications={notifications.some(n => n.unread)}
              hasActivePackage={hasActivePackage}
            />
          )}

          {/* ── Member Cart Popup ── */}
          <MemberCartPopup
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemove={handleRemoveFromCart}
            onCheckout={handleCheckoutCart}
            isOrdered={isCartOrdered}
            onResetOrder={handleResetCartOrder}
            purchaseHistory={purchaseHistory}
          />

          {/* ── Success overlay ── */}
          {successMsg && (
            <SuccessDialog message={successMsg} onClose={onSuccessClose} />
          )}

          {/* ── Prototype Flow Panel ── */}
          <PrototypeFlowPanel
            currentScreen={currentScreen as Screen}
            onJump={handleJump}
          />
        </div>
      )}
    </div>
  );
}
