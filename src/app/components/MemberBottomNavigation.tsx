import { Home, Calendar, Archive, History, User } from 'lucide-react';

const TABS = [
  { id: 'member-dashboard',           icon: Home,     label: 'Trang chủ' },
  { id: 'member-schedule',            icon: Calendar, label: 'Lịch học'  },
  { id: 'member-package',             icon: Archive,  label: 'Gói học'   },
  { id: 'member-attendance-history',  icon: History,  label: 'Lịch sử'   },
  { id: 'member-profile',             icon: User,     label: 'Cá nhân'   },
] as const;

type TabId = (typeof TABS)[number]['id'];

interface MemberBottomNavigationProps {
  currentTab: string;
  onTabChange: (id: TabId) => void;
}

export function MemberBottomNavigation({ currentTab, onTabChange }: MemberBottomNavigationProps) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-30"
      style={{
        background:   'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop:    '1px solid rgba(0,0,0,0.08)',
        boxShadow:    '0 -4px 20px rgba(0,0,0,0.07)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <div className="flex">
        {TABS.map(tab => {
          const active = currentTab === tab.id;
          const Icon   = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-3 transition-all active:scale-95"
            >
              <div
                className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
                style={{
                  background: active ? 'rgba(14,124,123,0.12)' : 'transparent',
                }}
              >
                <Icon
                  style={{
                    width:  20,
                    height: 20,
                    color:  active ? '#0E7C7B' : '#9CA3AF',
                    strokeWidth: active ? 2.2 : 1.7,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize:   '9px',
                  fontWeight: active ? 800 : 500,
                  color:      active ? '#0E7C7B' : '#9CA3AF',
                  letterSpacing: '0.01em',
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
