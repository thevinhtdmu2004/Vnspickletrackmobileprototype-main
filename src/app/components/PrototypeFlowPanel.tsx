import { useState } from 'react';
import {
  Play, X, ChevronRight, LogIn, ClipboardCheck,
  UserPlus, RefreshCw, BarChart3, CloudUpload, Users,
  Maximize2, Minimize2, Award, FileText
} from 'lucide-react';

export type Screen =
  | 'splash' | 'login' | 'dashboard' | 'dashboard-coach'
  | 'home' | 'today-classes' | 'attendance-check'
  | 'students-list' | 'add-student' | 'student-detail'
  | 'renew-package' | 'reports' | 'report-expiring'
  | 'report-revenue' | 'settings' | 'backup'
  | 'class-list' | 'add-class' | 'dialogs-showcase'
  | 'component-library' | 'dev-handoff' | 'sitemap'
  | 'select-class-session' | 'session-detail' | 'complete-session'
  | 'session-created-success' | 'cancel-session-dialog'
  | 'complete-session-dialog'
  | 'edit-class' | 'class-detail' | 'assign-students'
  | 'edit-student' | 'payment-history' | 'attendance-history'
  | 'monthly-report' | 'export-csv' | 'restore-data'
  | 'package-management' | 'package-form' | 'user-management'
  | 'change-pin' | 'confirm-dialogs' | 'suspend-class-dialog'
  | 'adjust-sessions' | 'change-student-status' | 'attendance-dialogs-demo'
  | 'class-report' | 'student-report' | 'backup-success' | 'add-user'
  | 'empty-states'
  /* Member / Student role screens */
  | 'member-dashboard' | 'member-profile' | 'member-schedule'
  | 'member-package' | 'member-attendance-history' | 'member-payment-history'
  | 'member-renew-request' | 'member-session-warning' | 'member-contact'
  /* Documentation */
  | 'screen-flow-doc';

interface Flow {
  id:      number;
  name:    string;
  desc:    string;
  color:   string;
  icon:    React.ReactNode;
  steps:   { screen: Screen; label: string }[];
}

const FLOWS: Flow[] = [
  {
    id: 1, name: 'Đăng nhập', desc: 'Splash → Login → Dashboard Admin',
    color: '#0E7C7B',
    icon: <LogIn style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'splash',    label: 'Splash Screen'    },
      { screen: 'login',     label: 'Đăng nhập'        },
      { screen: 'dashboard', label: 'Dashboard Admin'  },
    ],
  },
  {
    id: 2, name: 'Điểm danh', desc: 'Dashboard → Lớp hôm nay → Điểm danh',
    color: '#2A9D8F',
    icon: <ClipboardCheck style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'dashboard',        label: 'Dashboard Admin'   },
      { screen: 'today-classes',    label: 'Lớp hôm nay'       },
      { screen: 'attendance-check', label: 'Điểm danh học viên'},
    ],
  },
  {
    id: 3, name: 'Thêm học viên', desc: 'Dashboard → Học viên → Thêm → Chi tiết',
    color: '#F4A261',
    icon: <UserPlus style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'dashboard',      label: 'Dashboard Admin'   },
      { screen: 'students-list',  label: 'Danh sách học viên'},
      { screen: 'add-student',    label: 'Thêm học viên'     },
      { screen: 'student-detail', label: 'Chi tiết học viên' },
    ],
  },
  {
    id: 4, name: 'Gia hạn gói', desc: 'Chi tiết → Gia hạn → Thanh toán',
    color: '#E9C46A',
    icon: <RefreshCw style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'student-detail', label: 'Chi tiết học viên' },
      { screen: 'renew-package',  label: 'Gia hạn gói học'  },
      { screen: 'student-detail', label: 'Chi tiết học viên' },
    ],
  },
  {
    id: 5, name: 'Báo cáo hết buổi', desc: 'Dashboard → Báo cáo → Sắp hết buổi → Gia hạn',
    color: '#E76F51',
    icon: <BarChart3 style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'dashboard',       label: 'Dashboard Admin'       },
      { screen: 'reports',         label: 'Báo cáo'               },
      { screen: 'report-expiring', label: 'Sắp hết buổi'          },
      { screen: 'renew-package',   label: 'Gia hạn gói học'       },
    ],
  },
  {
    id: 6, name: 'Sao lưu', desc: 'Dashboard → Cài đặt → Sao lưu ngay',
    color: '#815AD5',
    icon: <CloudUpload style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'dashboard', label: 'Dashboard Admin'  },
      { screen: 'settings',  label: 'Cài đặt'          },
      { screen: 'backup',    label: 'Sao lưu dữ liệu'  },
    ],
  },
  {
    id: 7, name: 'Coach', desc: 'Login → Dashboard Coach → Điểm danh',
    color: '#264653',
    icon: <Users style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'login',            label: 'Đăng nhập'         },
      { screen: 'dashboard-coach',  label: 'Dashboard Coach'   },
      { screen: 'today-classes',    label: 'Lớp hôm nay'       },
      { screen: 'attendance-check', label: 'Điểm danh học viên'},
    ],
  },
  {
    id: 8, name: 'Tạo buổi học', desc: 'Lớp hôm nay → Chọn lớp → Xác nhận → Thành công',
    color: '#F4A261',
    icon: <Play style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'today-classes',           label: 'Lớp hôm nay'          },
      { screen: 'select-class-session',    label: 'Tạo buổi học hôm nay' },
      { screen: 'session-created-success', label: 'Tạo thành công'       },
      { screen: 'session-detail',          label: 'Chi tiết buổi học'    },
      { screen: 'cancel-session-dialog',   label: 'Dialog hủy buổi học'  },
      { screen: 'complete-session-dialog', label: 'Dialog hoàn tất'      },
    ],
  },
  {
    id: 9, name: 'Quản lý lớp', desc: 'Chi tiết lớp → Gán HV → Dialog Ngưng',
    color: '#E76F51',
    icon: <BarChart3 style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'class-detail',         label: 'Chi tiết lớp học'     },
      { screen: 'assign-students',      label: 'Gán học viên'         },
      { screen: 'suspend-class-dialog', label: 'Dialog ngưng lớp'     },
    ],
  },
  {
    id: 10, name: 'Điều chỉnh buổi', desc: 'Chi tiết HV → Sửa → Điều chỉnh số buổi',
    color: '#264653',
    icon: <RefreshCw style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'student-detail',  label: 'Chi tiết học viên'   },
      { screen: 'edit-student',    label: 'Sửa học viên'        },
      { screen: 'adjust-sessions', label: 'Điều chỉnh số buổi'  },
    ],
  },
  {
    id: 11, name: 'Đổi trạng thái', desc: 'Chi tiết HV → Đổi trạng thái học viên',
    color: '#E76F51',
    icon: <Users style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'student-detail',          label: 'Chi tiết học viên'        },
      { screen: 'change-student-status',   label: 'Dialog đổi trạng thái'   },
    ],
  },
  {
    id: 12, name: 'Thêm người dùng', desc: 'Quản lý ND → Thêm người dùng',
    color: '#815AD5',
    icon: <Users style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'user-management', label: 'Quản lý người dùng' },
      { screen: 'add-user',        label: 'Thêm người dùng'    },
    ],
  },
  {
    id: 13, name: 'Đổi mã PIN', desc: 'Cài đặt → Đổi mã PIN',
    color: '#0E7C7B',
    icon: <Play style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'settings',    label: 'Cài đặt'      },
      { screen: 'change-pin',  label: 'Đổi mã PIN'   },
    ],
  },
  {
    id: 14, name: 'Empty States', desc: 'Bộ 6 trạng thái trống',
    color: '#2A9D8F',
    icon: <Play style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'empty-states', label: 'Empty States' },
    ],
  },
  {
    id: 15, name: 'Dialog Xác nhận', desc: 'Dialogs cảnh báo & xác nhận quan trọng',
    color: '#E76F51',
    icon: <Play style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'attendance-dialogs-demo', label: 'Dialogs Điểm danh' },
      { screen: 'dialogs-showcase',        label: 'Dialog Showcase'   },
      { screen: 'confirm-dialogs',         label: 'Confirm Dialogs'   },
    ],
  },
  {
    id: 16, name: 'Dev Handoff', desc: 'Tài liệu bàn giao & Component Library',
    color: '#264653',
    icon: <Play style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'sitemap',           label: 'Sitemap'           },
      { screen: 'component-library', label: 'Component Library' },
      { screen: 'dev-handoff',       label: 'Dev Handoff'       },
    ],
  },
  {
    id: 17, name: 'Học viên — Tổng quan', desc: 'Đăng nhập → Dashboard → Gói học → Cảnh báo',
    color: '#2A9D8F',
    icon: <Play style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'member-dashboard',         label: 'Dashboard HV'       },
      { screen: 'member-package',           label: 'Gói học'            },
      { screen: 'member-session-warning',   label: 'Cảnh báo hết buổi' },
      { screen: 'member-renew-request',     label: 'Gia hạn gói'       },
    ],
  },
  {
    id: 18, name: 'Học viên — Lịch & Hồ sơ', desc: 'Lịch học · Lịch sử · Liên hệ · Cá nhân',
    color: '#815AD5',
    icon: <Play style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'member-schedule',              label: 'Lịch học'           },
      { screen: 'member-attendance-history',    label: 'Lịch sử học'       },
      { screen: 'member-payment-history',       label: 'Thanh toán'        },
      { screen: 'member-contact',               label: 'Liên hệ Coach'     },
      { screen: 'member-profile',               label: 'Hồ sơ cá nhân'    },
    ],
  },
  {
    id: 19, name: 'Học viên — Thành tích', desc: 'Dashboard → Thành tích học viên',
    color: '#F4A261',
    icon: <Award style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'member-dashboard', label: 'Dashboard HV' },
      { screen: 'student-report',   label: 'Thành tích học viên' },
    ],
  },
  {
    id: 20, name: 'Screen Flow Doc', desc: 'Tài liệu luồng màn hình · Sitemap · Permission Matrix',
    color: '#264653',
    icon: <FileText style={{ width: 14, height: 14 }} />,
    steps: [
      { screen: 'screen-flow-doc', label: 'Screen Flow Document' },
    ],
  },
];

interface PrototypeFlowPanelProps {
  currentScreen: Screen;
  onJump:        (screen: Screen, role?: 'admin' | 'coach' | 'member') => void;
}

export function PrototypeFlowPanel({ currentScreen, onJump }: PrototypeFlowPanelProps) {
  const [open,        setOpen]        = useState(false);
  const [activeFlow,  setActiveFlow]  = useState<number | null>(null);
  const [minimised,   setMinimised]   = useState(false);

  /* detect which flow the current screen belongs to */
  const matchedFlow = FLOWS.find(f => f.steps.some(s => s.screen === currentScreen));

  function startFlow(flow: Flow) {
    const first = flow.steps[0];
    const role: 'admin' | 'coach' | 'member' =
      flow.id === 7                  ? 'coach'  :
      flow.id === 17 || flow.id === 18 || flow.id === 19 ? 'member' :
      'admin';
    setActiveFlow(flow.id);
    setOpen(false);
    onJump(first.screen, role);
  }

  const current = activeFlow ? FLOWS.find(f => f.id === activeFlow) : matchedFlow;
  const currentStepIdx = current
    ? current.steps.findIndex(s => s.screen === currentScreen)
    : -1;

  if (minimised) {
    return (
      <button
        onClick={() => setMinimised(false)}
        className="fixed bottom-24 right-3 z-40 w-11 h-11 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: current?.color ?? '#0E7C7B' }}
      >
        <Play style={{ width: 16, height: 16, color: 'white', marginLeft: 2 }} />
      </button>
    );
  }

  return (
    <>
      {/* ── Overlay backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40"
          style={{ background: 'rgba(0,0,0,0.46)', backdropFilter: 'blur(2px)' }}
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Bottom drawer ── */}
      {open && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 max-w-[390px] mx-auto bg-card rounded-t-3xl overflow-hidden"
          style={{ boxShadow: '0 -12px 48px rgba(0,0,0,0.22)', animation: 'slideUpIn 250ms ease both' }}
        >
          {/* handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* header */}
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(14,124,123,0.12)' }}
            >
              <Play style={{ width: 14, height: 14, color: '#0E7C7B', marginLeft: 1 }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: '14px', fontWeight: 700 }}>Prototype Flows</p>
              <p className="text-muted-foreground" style={{ fontSize: '10px' }}>
                20 flows · 46+ màn hình · 3 vai trò
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="w-7 h-7 rounded-full flex items-center justify-center bg-muted/60">
              <X style={{ width: 14, height: 14 }} />
            </button>
          </div>

          {/* flow list */}
          <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: 400 }}>
            {FLOWS.map(flow => {
              const isActive = activeFlow === flow.id || (!activeFlow && matchedFlow?.id === flow.id);
              return (
                <div
                  key={flow.id}
                  className="flex items-center gap-3 px-5 py-3.5 border-b border-border/50 last:border-0"
                  style={isActive ? { background: flow.color + '0C' } : {}}
                >
                  {/* flow badge */}
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: flow.color + '18', color: flow.color }}
                  >
                    {flow.icon}
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="rounded-full px-1.5 py-0.5 flex-shrink-0"
                        style={{ fontSize: '9px', fontWeight: 800, background: flow.color, color: 'white' }}
                      >
                        F{flow.id}
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: 700 }}>{flow.name}</span>
                      {isActive && (
                        <span
                          className="px-1.5 py-0.5 rounded-full"
                          style={{ fontSize: '9px', fontWeight: 700, background: flow.color + '20', color: flow.color }}
                        >
                          Đang xem
                        </span>
                      )}
                    </div>
                    {/* step chips */}
                    <div className="flex items-center gap-1 flex-wrap">
                      {flow.steps.map((s, i) => (
                        <span key={i} className="flex items-center gap-1">
                          <span
                            className="px-1.5 py-0.5 rounded"
                            style={{
                              fontSize: '9px',
                              fontWeight: s.screen === currentScreen ? 700 : 400,
                              background: s.screen === currentScreen ? flow.color + '25' : 'var(--muted)',
                              color: s.screen === currentScreen ? flow.color : 'var(--muted-foreground)',
                            }}
                          >
                            {s.label}
                          </span>
                          {i < flow.steps.length - 1 && (
                            <ChevronRight style={{ width: 8, height: 8, color: 'var(--muted-foreground)', flexShrink: 0 }} />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* start btn */}
                  <button
                    onClick={() => startFlow(flow)}
                    className="flex-shrink-0 flex items-center gap-1 px-3 py-2 rounded-xl active:opacity-80 transition-opacity"
                    style={{ background: flow.color, fontSize: '11px', fontWeight: 700, color: 'white' }}
                  >
                    <Play style={{ width: 10, height: 10, marginLeft: 1 }} />
                    Bắt đầu
                  </button>
                </div>
              );
            })}
          </div>

          <div className="h-safe-bottom pb-4" />
        </div>
      )}

      {/* ── Floating trigger pill ── */}
      {!open && (
        <div className="fixed bottom-20 right-3 z-40 flex flex-col items-end gap-1.5">
          {/* minimise btn */}
          <button
            onClick={() => setMinimised(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center bg-card border border-border shadow-sm active:scale-95"
          >
            <Minimize2 style={{ width: 12, height: 12, color: 'var(--muted-foreground)' }} />
          </button>

          {/* main pill */}
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 pl-2.5 pr-3.5 h-10 rounded-full shadow-lg active:scale-95 transition-transform"
            style={{
              background: current ? current.color : '#0E7C7B',
              boxShadow: `0 4px 20px ${current ? current.color : '#0E7C7B'}60`,
            }}
          >
            <div className="w-5 h-5 bg-white/25 rounded-full flex items-center justify-center">
              <Play style={{ width: 10, height: 10, color: 'white', marginLeft: 1 }} />
            </div>
            <div className="text-left">
              {current ? (
                <>
                  <p className="text-white" style={{ fontSize: '10px', fontWeight: 800, lineHeight: 1 }}>
                    F{current.id} · {current.name}
                  </p>
                  {currentStepIdx >= 0 && (
                    <p className="text-white/60" style={{ fontSize: '9px', lineHeight: 1, marginTop: 1 }}>
                      Bước {currentStepIdx + 1}/{current.steps.length}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-white" style={{ fontSize: '10px', fontWeight: 700 }}>Prototype Flows</p>
              )}
            </div>
          </button>

          {/* step dots */}
          {current && currentStepIdx >= 0 && (
            <div className="flex items-center gap-1 justify-center">
              {current.steps.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all"
                  style={{
                    width:  i === currentStepIdx ? 12 : 5,
                    height: 5,
                    background: i <= currentStepIdx ? current.color : 'rgba(0,0,0,0.15)',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}