import { Home, ClipboardCheck, Users, BarChart3, Settings } from 'lucide-react';

interface BottomNavigationProps {
  currentTab:  string;
  onTabChange: (tab: string) => void;
}

const TABS = [
  { id: 'home',          label: 'Trang chủ', icon: Home,          dot: false },
  { id: 'today-classes', label: 'Điểm danh', icon: ClipboardCheck, dot: false },
  { id: 'students-list', label: 'Học viên',  icon: Users,          dot: false },
  { id: 'reports',       label: 'Báo cáo',   icon: BarChart3,      dot: true  },
  { id: 'settings',      label: 'Cài đặt',   icon: Settings,       dot: false },
];

export function BottomNavigation({ currentTab, onTabChange }: BottomNavigationProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30"
      style={{ background: 'var(--card)', borderTop: '1px solid var(--border)', boxShadow: '0 -4px 20px rgba(0,0,0,0.06)' }}
    >
      <div className="max-w-[390px] mx-auto grid grid-cols-5 h-16">
        {TABS.map((tab) => {
          const Icon     = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center gap-0.5 transition-colors active:scale-95"
            >
              {/* active indicator */}
              {isActive && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-full"
                  style={{ width: 24, height: 3, background: '#0E7C7B' }}
                />
              )}

              {/* icon wrapper */}
              <div className="relative">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    background: isActive ? 'rgba(14,124,123,0.12)' : 'transparent',
                  }}
                >
                  <Icon
                    style={{
                      width: 20, height: 20,
                      color: isActive ? '#0E7C7B' : 'var(--muted-foreground)',
                      strokeWidth: isActive ? 2.5 : 2,
                    }}
                  />
                </div>

                {/* notification dot */}
                {tab.dot && !isActive && (
                  <div
                    className="absolute -top-0.5 -right-0.5 rounded-full border-2 border-card"
                    style={{ width: 8, height: 8, background: '#E76F51' }}
                  />
                )}
              </div>

              <span
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 700 : 400,
                  color: isActive ? '#0E7C7B' : 'var(--muted-foreground)',
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
