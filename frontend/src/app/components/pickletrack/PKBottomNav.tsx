/**
 * PKBottomNav — VNS PickleTrack
 * Bottom navigation bar — 5 tabs
 * Tabs: home | attendance | students | reports | settings
 */

import { Home, ClipboardCheck, Users, BarChart3, Settings } from 'lucide-react';

export type NavTab = 'home' | 'attendance' | 'students' | 'reports' | 'settings';

export interface PKBottomNavProps {
  activeTab:   NavTab;
  onTabChange: (tab: NavTab) => void;
  /** Map of tab id → notification count (0 = dot only) */
  badges?:     Partial<Record<NavTab, number>>;
}

const TABS: { id: NavTab; label: string; Icon: React.FC<React.SVGProps<SVGSVGElement>> }[] = [
  { id: 'home',       label: 'Trang chủ', Icon: Home           },
  { id: 'attendance', label: 'Điểm danh', Icon: ClipboardCheck },
  { id: 'students',   label: 'Học viên',  Icon: Users          },
  { id: 'reports',    label: 'Báo cáo',   Icon: BarChart3      },
  { id: 'settings',   label: 'Cài đặt',   Icon: Settings       },
];

export function PKBottomNav({ activeTab, onTabChange, badges = {} }: PKBottomNavProps) {
  return (
    <div
      style={{
        width:       '100%',
        height:      64,
        background:  '#FFFFFF',
        borderTop:   '1px solid rgba(0,0,0,0.08)',
        display:     'grid',
        gridTemplateColumns: 'repeat(5,1fr)',
        boxShadow:   '0 -4px 20px rgba(0,0,0,0.06)',
      }}
    >
      {TABS.map(({ id, label, Icon }) => {
        const isActive  = activeTab === id;
        const badge     = badges[id];
        const showBadge = badge !== undefined;

        return (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            style={{
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            2,
              position:       'relative',
              background:     'transparent',
              border:         'none',
              cursor:         'pointer',
              transition:     'all 120ms ease',
            }}
          >
            {/* top indicator */}
            {isActive && (
              <div style={{
                position:     'absolute',
                top:          0,
                left:         '50%',
                transform:    'translateX(-50%)',
                width:        24,
                height:       3,
                borderRadius: '0 0 3px 3px',
                background:   '#0E7C7B',
              }} />
            )}

            {/* icon container */}
            <div style={{ position: 'relative' }}>
              <div style={{
                width:          32,
                height:         32,
                borderRadius:   12,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     isActive ? 'rgba(14,124,123,0.12)' : 'transparent',
                transition:     'all 120ms ease',
              }}>
                <Icon style={{
                  width:       20,
                  height:      20,
                  color:       isActive ? '#0E7C7B' : '#9CA3AF',
                  strokeWidth: isActive ? 2.5 : 2,
                }} />
              </div>

              {/* badge */}
              {showBadge && (
                <div style={{
                  position:       'absolute',
                  top:            -2,
                  right:          -2,
                  minWidth:       badge! > 0 ? 16 : 8,
                  height:         badge! > 0 ? 16 : 8,
                  borderRadius:   8,
                  background:     '#E76F51',
                  border:         '2px solid #FFFFFF',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontSize:        9,
                  fontWeight:      800,
                  color:           '#FFFFFF',
                  lineHeight:      1,
                }}>
                  {badge! > 0 ? (badge! > 9 ? '9+' : badge) : ''}
                </div>
              )}
            </div>

            {/* label */}
            <span style={{
              fontSize:   10,
              fontWeight: isActive ? 700 : 400,
              color:      isActive ? '#0E7C7B' : '#9CA3AF',
              lineHeight: 1,
            }}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
