/**
 * DevHandoffScreen — VNS PickleTrack
 * Developer handoff document for .NET MAUI Android
 * Tabs: Screens · Components · Tokens · XAML Guide
 */

import { useState } from 'react';
import {
  ArrowLeft, Copy, Check, Monitor, Layers, Palette,
  Code2, ChevronRight, Circle, Square, Type, Hash,
  Smartphone, GitBranch, FileText, Info, AlertCircle,
  Layout, Box, AlignLeft, Sliders
} from 'lucide-react';

interface DevHandoffScreenProps {
  onBack: () => void;
}

/* ── tiny copy button ── */
function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {});
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      title="Copy"
      style={{
        width: 24, height: 24,
        borderRadius: 6,
        background: copied ? 'rgba(42,157,143,0.15)' : 'rgba(0,0,0,0.06)',
        border: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        transition: 'all 150ms',
      }}
    >
      {copied
        ? <Check style={{ width: 12, height: 12, color: '#2A9D8F' }} />
        : <Copy style={{ width: 12, height: 12, color: '#6B7280' }} />
      }
    </button>
  );
}

/* ── mono code chip ── */
function Code({ children, color }: { children: string; color?: string }) {
  return (
    <span style={{
      fontFamily: '"JetBrains Mono","Fira Mono","Consolas",monospace',
      fontSize: 11,
      background: color ? color + '15' : 'rgba(0,0,0,0.06)',
      color: color ?? '#374151',
      padding: '2px 6px',
      borderRadius: 5,
      fontWeight: 600,
      letterSpacing: '-0.01em',
    }}>
      {children}
    </span>
  );
}

/* ── section title ── */
function STitle({ icon, label, sub }: { icon: React.ReactNode; label: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: 'rgba(14,124,123,0.1)', border: '1.5px solid rgba(14,124,123,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#0E7C7B', flexShrink: 0,
      }}>{icon}</div>
      <div>
        <p style={{ fontSize: 15, fontWeight: 800, margin: 0, lineHeight: 1 }}>{label}</p>
        {sub && <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{sub}</p>}
      </div>
    </div>
  );
}

/* ── card ── */
function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid rgba(0,0,0,0.09)',
      borderRadius: 16,
      padding: '14px 16px',
      boxShadow: '0 1px 6px rgba(0,0,0,0.05)',
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── divider ── */
function HDivider() {
  return <div style={{ height: 1, background: 'rgba(0,0,0,0.07)', margin: '10px 0' }} />;
}

/* ═══════════════════════════
   TAB 1 · SCREENS
═══════════════════════════ */
const SCREENS = [
  { code: '01', name: 'Login',             route: 'LoginPage',               desc: 'Email + Password, role selector',         components: ['Input/Text','Button/Primary'] },
  { code: '02', name: 'Dashboard_Admin',   route: 'AdminDashboardPage',      desc: 'Metric cards, quick actions, class list',  components: ['Card/DashboardMetric','Button/Primary'] },
  { code: '03', name: 'Dashboard_Coach',   route: 'CoachDashboardPage',      desc: 'Today schedule, check-in summary',         components: ['Card/Session','Badge/Status'] },
  { code: '04', name: 'Today_Sessions',    route: 'TodaySessionsPage',       desc: 'List of classes for today',                components: ['Card/Session','Button/Primary'] },
  { code: '05', name: 'Attendance',        route: 'AttendancePage',          desc: 'Student roll + status selector per row',   components: ['Badge/Status','Button/Primary','Button/Secondary'] },
  { code: '06', name: 'Student_List',      route: 'StudentListPage',         desc: 'Searchable student list with filters',     components: ['Card/Student','Badge/Warning','Input/Text'] },
  { code: '07', name: 'Student_Form',      route: 'StudentFormPage',         desc: 'Add / edit student form',                  components: ['Input/Text','Input/Dropdown','Button/Primary'] },
  { code: '08', name: 'Student_Detail',    route: 'StudentDetailPage',       desc: 'Profile, session history, renew button',   components: ['Card/Student','Badge/Warning','Button/Primary'] },
  { code: '09', name: 'Class_List',        route: 'ClassListPage',           desc: 'All classes, filter by coach/day',         components: ['Card/Class','Button/Primary'] },
  { code: '10', name: 'Class_Form',        route: 'ClassFormPage',           desc: 'Add / edit class form',                    components: ['Input/Text','Input/Dropdown','Button/Primary'] },
  { code: '11', name: 'Assign_Students',   route: 'AssignStudentsPage',      desc: 'Multi-select students for a class',        components: ['Card/Student','Button/Primary','Button/Secondary'] },
  { code: '12', name: 'Payment_Form',      route: 'PaymentFormPage',         desc: 'Package renewal, payment amount',          components: ['Input/Text','Input/Dropdown','Button/Primary'] },
  { code: '13', name: 'Report_Low_Balance',route: 'ReportLowBalancePage',    desc: 'Students with ≤2 sessions remaining',      components: ['Card/Student','Badge/Warning','Button/Primary'] },
  { code: '14', name: 'Report_Revenue',    route: 'ReportRevenuePage',       desc: 'Monthly revenue, transaction list',        components: ['Card/DashboardMetric'] },
  { code: '15', name: 'Settings',          route: 'SettingsPage',            desc: 'Profile, notifications, app config',       components: ['Input/Text','Button/Primary'] },
  { code: '16', name: 'Backup',            route: 'BackupPage',              desc: 'Cloud backup / restore controls',          components: ['Button/Primary','Button/Secondary'] },
];

const SCREEN_COLORS: Record<string, string> = {
  '01': '#0E7C7B', '02': '#0E7C7B', '03': '#2A9D8F',
  '04': '#2A9D8F', '05': '#E9C46A', '06': '#815AD5',
  '07': '#815AD5', '08': '#F4A261', '09': '#E76F51',
  '10': '#E76F51', '11': '#264653', '12': '#0E7C7B',
  '13': '#E76F51', '14': '#2A9D8F', '15': '#6B7280', '16': '#6B7280',
};

function TabScreens() {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <STitle icon={<Monitor style={{ width: 17, height: 17 }} />} label="Screen Inventory" sub="16 màn hình · format: XX_ScreenName" />

      {/* naming rule */}
      <Card style={{ marginBottom: 14, background: 'rgba(14,124,123,0.05)', borderColor: 'rgba(14,124,123,0.2)' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#0E7C7B', margin: '0 0 6px' }}>📐 Naming Convention</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            ['Prefix', '01 – 16'],
            ['Separator', '_'],
            ['Name', 'PascalCase'],
            ['MAUI', 'XxxPage.xaml'],
            ['ViewModel', 'XxxViewModel.cs'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: '#FFFFFF', borderRadius: 8, padding: '4px 10px', border: '1px solid rgba(14,124,123,0.15)' }}>
              <p style={{ fontSize: 9, color: '#6B7280', margin: 0, fontWeight: 600 }}>{k}</p>
              <p style={{ fontSize: 11, fontWeight: 700, color: '#0E7C7B', margin: 0, fontFamily: 'monospace' }}>{v}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* screens list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SCREENS.map(s => {
          const color = SCREEN_COLORS[s.code];
          const isOpen = expanded === s.code;
          return (
            <div key={s.code} style={{ borderRadius: 14, overflow: 'hidden', border: `1px solid ${isOpen ? color + '40' : 'rgba(0,0,0,0.09)'}`, background: '#FFF', boxShadow: isOpen ? `0 4px 16px ${color}18` : '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 200ms' }}>
              <button
                onClick={() => setExpanded(isOpen ? null : s.code)}
                style={{ width: '100%', padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                {/* code badge */}
                <div style={{ width: 34, height: 34, borderRadius: 10, background: color + '16', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 900, color, fontFamily: 'monospace' }}>{s.code}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: 0, lineHeight: 1, fontFamily: '"JetBrains Mono","Fira Mono",monospace' }}>
                    {s.code}_{s.name}
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {s.desc}
                  </p>
                </div>
                <ChevronRight style={{ width: 15, height: 15, color: '#9CA3AF', transition: 'transform 200ms', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }} />
              </button>

              {isOpen && (
                <div style={{ padding: '0 14px 14px', borderTop: `1px solid ${color}20` }}>
                  {/* MAUI names */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
                    {[
                      { k: 'XAML File', v: `${s.route}.xaml` },
                      { k: 'ViewModel', v: `${s.route.replace('Page','')}ViewModel.cs` },
                      { k: 'Figma Name', v: `${s.code}_${s.name}` },
                      { k: 'Shell Route', v: `/${s.name.toLowerCase().replace('_','/')}` },
                    ].map(({ k, v }) => (
                      <div key={k} style={{ background: 'rgba(0,0,0,0.03)', borderRadius: 8, padding: '6px 10px' }}>
                        <p style={{ fontSize: 9, color: '#9CA3AF', margin: 0, fontWeight: 600, textTransform: 'uppercase' }}>{k}</p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 2 }}>
                          <p style={{ fontSize: 11, fontWeight: 700, margin: 0, color: '#374151', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</p>
                          <CopyBtn text={v} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* components used */}
                  <div style={{ marginTop: 10 }}>
                    <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', margin: '0 0 6px' }}>Components dùng</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {s.components.map(c => (
                        <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: color + '14', color, border: `1px solid ${color}25` }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════
   TAB 2 · COMPONENTS
═══════════════════════════ */
const COMPONENTS = [
  {
    group: 'Button',
    color: '#0E7C7B',
    items: [
      { name: 'Button/Primary',   maui: 'Button',   props: 'Text, IsEnabled, Command',     note: 'Style="PrimaryBtn" — gradient teal, height 48, radius 14' },
      { name: 'Button/Secondary', maui: 'Button',   props: 'Text, IsEnabled, Command',     note: 'Style="SecondaryBtn" — outlined teal border, transparent bg' },
    ],
  },
  {
    group: 'Card',
    color: '#2A9D8F',
    items: [
      { name: 'Card/Student',        maui: 'Border + Grid',        props: 'Name, Phone, Class, Sessions, Status', note: 'BindingContext=StudentViewModel, CollectionView item' },
      { name: 'Card/Class',          maui: 'Border + StackLayout', props: 'Name, Schedule, Court, Coach, Count',  note: 'Accent color bar top via BoxView' },
      { name: 'Card/Session',        maui: 'Border + Grid',        props: 'Time, Class, Court, Coach, State',     note: 'State: upcoming|in-progress|done; triggers CTABtn change' },
      { name: 'Card/DashboardMetric',maui: 'Border + VerticalStackLayout', props: 'Number, Label, Icon, Variant', note: 'Variant = teal|success|accent|warning|danger' },
    ],
  },
  {
    group: 'Badge',
    color: '#F4A261',
    items: [
      { name: 'Badge/Warning', maui: 'Border + Label',  props: 'Variant: expiring|expired|active|break|quit', note: 'Border radius 999, dynamic color from variant' },
      { name: 'Badge/Status',  maui: 'Border + Label',  props: 'Status: present|late|makeup|absent|leave',    note: 'Used inside Attendance row, toggle selected state' },
    ],
  },
  {
    group: 'Input',
    color: '#815AD5',
    items: [
      { name: 'Input/Text',     maui: 'Entry',  props: 'Label, Placeholder, Value, Error, IsEnabled', note: 'FocusColor=#0E7C7B, ErrorColor=#E76F51, border radius 14' },
      { name: 'Input/Dropdown', maui: 'Picker', props: 'Label, Options, Value, Error, IsEnabled',     note: 'Wrap Picker in Border, ChevronDown icon via Image' },
    ],
  },
  {
    group: 'Navigation',
    color: '#264653',
    items: [
      { name: 'Navigation/BottomTab', maui: 'Shell TabBar', props: 'ActiveTab, Tabs[5], Badges',  note: 'Shell.TabBar.Items = 5 ShellContent; active indicator via custom renderer' },
    ],
  },
];

function TabComponents() {
  const [expanded, setExpanded] = useState<string | null>('Button');
  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <STitle icon={<Layers style={{ width: 17, height: 17 }} />} label="Component Naming" sub="Slash notation · MAUI equivalents" />

      {/* naming rule */}
      <Card style={{ marginBottom: 14, background: 'rgba(14,124,123,0.05)', borderColor: 'rgba(14,124,123,0.2)' }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#0E7C7B', margin: '0 0 6px' }}>📐 Naming Format</p>
        <p style={{ fontSize: 12, margin: 0, fontFamily: 'monospace', color: '#374151' }}>
          <span style={{ color: '#E76F51' }}>Category</span>
          <span style={{ color: '#9CA3AF' }}>/</span>
          <span style={{ color: '#0E7C7B' }}>Variant</span>
          <span style={{ color: '#9CA3AF' }}> · e.g. </span>
          <span style={{ fontWeight: 700 }}>Button/Primary</span>
        </p>
      </Card>

      {COMPONENTS.map(group => {
        const isOpen = expanded === group.group;
        return (
          <div key={group.group} style={{ marginBottom: 8, borderRadius: 14, overflow: 'hidden', border: `1px solid ${isOpen ? group.color + '35' : 'rgba(0,0,0,0.09)'}`, background: '#FFF' }}>
            <button
              onClick={() => setExpanded(isOpen ? null : group.group)}
              style={{ width: '100%', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ width: 32, height: 32, borderRadius: 9, background: group.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: group.color }}>
                  {group.items.length}
                </span>
              </div>
              <div style={{ flex: 1, textAlign: 'left' }}>
                <p style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#1F2933' }}>{group.group}</p>
                <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{group.items.map(i => i.name.split('/')[1]).join(' · ')}</p>
              </div>
              <ChevronRight style={{ width: 15, height: 15, color: '#9CA3AF', transition: 'transform 200ms', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
            </button>

            {isOpen && (
              <div style={{ borderTop: `1px solid ${group.color}20` }}>
                {group.items.map((item, idx) => (
                  <div key={item.name} style={{ padding: '12px 14px', borderBottom: idx < group.items.length - 1 ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    {/* component name */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 6, height: 6, borderRadius: 2, background: group.color }} />
                        <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace', color: '#1F2933' }}>{item.name}</span>
                      </div>
                      <CopyBtn text={item.name} />
                    </div>

                    {/* MAUI info grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '6px 10px', marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', alignSelf: 'center' }}>MAUI</span>
                      <Code color={group.color}>{item.maui}</Code>

                      <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Props</span>
                      <span style={{ fontSize: 11, color: '#374151' }}>{item.props}</span>
                    </div>

                    {/* note */}
                    <div style={{ background: group.color + '0C', borderRadius: 8, padding: '6px 10px', border: `1px solid ${group.color}1A` }}>
                      <p style={{ fontSize: 11, color: group.color, margin: 0 }}>💡 {item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════
   TAB 3 · TOKENS
═══════════════════════════ */
const COLOR_TOKENS = [
  { token: 'Primary',      hex: '#0E7C7B', maui: 'Color.FromArgb("#0E7C7B")',  usage: 'Button, Header, Active'      },
  { token: 'PrimaryDark',  hex: '#075E5D', maui: 'Color.FromArgb("#075E5D")',  usage: 'Pressed state, gradient'     },
  { token: 'Success',      hex: '#2A9D8F', maui: 'Color.FromArgb("#2A9D8F")',  usage: 'Positive metric, online'     },
  { token: 'Accent',       hex: '#F4A261', maui: 'Color.FromArgb("#F4A261")',  usage: 'Highlight, CTA accent'       },
  { token: 'Warning',      hex: '#E9C46A', maui: 'Color.FromArgb("#E9C46A")',  usage: 'Alert badge, low sessions'   },
  { token: 'Danger',       hex: '#E76F51', maui: 'Color.FromArgb("#E76F51")',  usage: 'Error, expired, delete'      },
  { token: 'Purple',       hex: '#815AD5', maui: 'Color.FromArgb("#815AD5")',  usage: 'Makeup status, advanced'     },
  { token: 'Background',   hex: '#F7F9FA', maui: 'Color.FromArgb("#F7F9FA")',  usage: 'App background, Page.Background' },
  { token: 'Surface',      hex: '#FFFFFF', maui: 'Colors.White',               usage: 'Card, Modal background'     },
  { token: 'TextPrimary',  hex: '#1F2933', maui: 'Color.FromArgb("#1F2933")',  usage: 'Heading, body text'          },
  { token: 'TextSecondary',hex: '#6B7280', maui: 'Color.FromArgb("#6B7280")',  usage: 'Subtitle, caption'           },
  { token: 'Border',       hex: '#E5E7EB', maui: 'Color.FromArgb("#E5E7EB")',  usage: 'Card border, separator'      },
  { token: 'Muted',        hex: '#E5E7EB', maui: 'Color.FromArgb("#E5E7EB")',  usage: 'Disabled bg, progress track' },
];

const TYPO_TOKENS = [
  { token: 'Display',   size: 28, weight: 900, lh: '1.15', usage: 'Metric numbers'         },
  { token: 'Heading1',  size: 22, weight: 800, lh: '1.2',  usage: 'Page title'             },
  { token: 'Heading2',  size: 18, weight: 700, lh: '1.3',  usage: 'Section title'          },
  { token: 'Heading3',  size: 16, weight: 700, lh: '1.4',  usage: 'Card title, name'       },
  { token: 'Body',      size: 14, weight: 400, lh: '1.5',  usage: 'Paragraph, description' },
  { token: 'BodyMed',   size: 14, weight: 600, lh: '1.5',  usage: 'Emphasized body'        },
  { token: 'Label',     size: 13, weight: 600, lh: '1.4',  usage: 'Form label, chip'       },
  { token: 'Small',     size: 12, weight: 400, lh: '1.5',  usage: 'Sub-caption, meta'      },
  { token: 'Caption',   size: 11, weight: 500, lh: '1.4',  usage: 'Badge, tab label'       },
  { token: 'Micro',     size: 10, weight: 700, lh: '1.2',  usage: 'Code badge, counter'    },
];

const SPACING_TOKENS = [
  { token: 'Spacing.XS',   value: 4,  px: '4px'  },
  { token: 'Spacing.SM',   value: 8,  px: '8px'  },
  { token: 'Spacing.MD',   value: 12, px: '12px' },
  { token: 'Spacing.Base', value: 16, px: '16px' },
  { token: 'Spacing.LG',   value: 20, px: '20px' },
  { token: 'Spacing.XL',   value: 24, px: '24px' },
  { token: 'Spacing.2XL',  value: 32, px: '32px' },
  { token: 'Spacing.3XL',  value: 40, px: '40px' },
  { token: 'Spacing.4XL',  value: 48, px: '48px' },
];

const RADIUS_TOKENS = [
  { token: 'Radius.SM',  value: 8,   usage: 'Chip, small badge'     },
  { token: 'Radius.MD',  value: 10,  usage: 'Button small, tag'     },
  { token: 'Radius.LG',  value: 14,  usage: 'Button default, input' },
  { token: 'Radius.XL',  value: 18,  usage: 'Card default'          },
  { token: 'Radius.2XL', value: 24,  usage: 'Sheet, modal, header'  },
  { token: 'Radius.Full',value: 999, usage: 'Pill badge, avatar'    },
];

const SHADOW_TOKENS = [
  { token: 'Shadow.SM',      css: '0 1px 3px rgba(0,0,0,0.08)',         maui: 'Shadow Offset="0,1" Opacity="0.08" Radius="3"' },
  { token: 'Shadow.MD',      css: '0 2px 8px rgba(0,0,0,0.08)',         maui: 'Shadow Offset="0,2" Opacity="0.08" Radius="8"' },
  { token: 'Shadow.LG',      css: '0 4px 16px rgba(0,0,0,0.10)',        maui: 'Shadow Offset="0,4" Opacity="0.10" Radius="16"' },
  { token: 'Shadow.Primary', css: '0 4px 14px rgba(14,124,123,0.38)',   maui: 'Shadow Color="#0E7C7B" Opacity="0.38" Radius="14"' },
  { token: 'Shadow.Danger',  css: '0 4px 14px rgba(231,111,81,0.35)',   maui: 'Shadow Color="#E76F51" Opacity="0.35" Radius="14"' },
];

function TabTokens() {
  const [tab, setTab] = useState<'color'|'typo'|'space'|'radius'|'shadow'>('color');
  const tabs: { id: typeof tab; label: string; icon: React.ReactNode }[] = [
    { id: 'color',  label: 'Color',    icon: <Circle style={{ width: 13, height: 13 }} /> },
    { id: 'typo',   label: 'Type',     icon: <Type style={{ width: 13, height: 13 }} /> },
    { id: 'space',  label: 'Space',    icon: <Hash style={{ width: 13, height: 13 }} /> },
    { id: 'radius', label: 'Radius',   icon: <Square style={{ width: 13, height: 13 }} /> },
    { id: 'shadow', label: 'Shadow',   icon: <Sliders style={{ width: 13, height: 13 }} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* sub tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px 0', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 5,
              height: 34, paddingInline: 12, borderRadius: 10, flexShrink: 0,
              background: tab === t.id ? '#0E7C7B' : 'rgba(0,0,0,0.06)',
              color: tab === t.id ? '#FFFFFF' : '#6B7280',
              border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
              transition: 'all 150ms',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px 80px' }}>

        {/* COLOR */}
        {tab === 'color' && (
          <div>
            <STitle icon={<Palette style={{ width: 17, height: 17 }} />} label="Color Tokens" sub="13 tokens · MAUI Color.FromArgb" />
            {/* palette strip */}
            <div style={{ display: 'flex', height: 40, borderRadius: 12, overflow: 'hidden', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {COLOR_TOKENS.slice(0, 7).map(c => (
                <div key={c.token} style={{ flex: 1, background: c.hex }} title={c.token} />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {COLOR_TOKENS.map(c => (
                <Card key={c.token} style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* swatch */}
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: c.hex, flexShrink: 0, boxShadow: `0 2px 8px ${c.hex}50`, border: '1px solid rgba(0,0,0,0.08)' }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{c.token}</span>
                        <Code>{c.hex}</Code>
                        <CopyBtn text={c.hex} />
                      </div>
                      <p style={{ fontSize: 11, color: '#6B7280', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.usage}</p>
                    </div>
                  </div>
                  <HDivider />
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, flexShrink: 0 }}>MAUI</span>
                    <code style={{ fontSize: 10, color: '#374151', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.maui}</code>
                    <CopyBtn text={c.maui} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TYPOGRAPHY */}
        {tab === 'typo' && (
          <div>
            <STitle icon={<Type style={{ width: 17, height: 17 }} />} label="Typography Tokens" sub="10 styles · Inter / Roboto" />
            <Card style={{ marginBottom: 12, background: 'rgba(14,124,123,0.05)', borderColor: 'rgba(14,124,123,0.2)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0E7C7B', margin: '0 0 4px' }}>Font Stack</p>
              <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151', margin: 0 }}>Android: <strong>Roboto</strong> (system default)</p>
              <p style={{ fontSize: 11, fontFamily: 'monospace', color: '#374151', margin: '2px 0 0' }}>MAUI: FontFamily="Roboto"</p>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {TYPO_TOKENS.map(t => (
                <Card key={t.token} style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Code color="#0E7C7B">{t.token}</Code>
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>{t.usage}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: t.size, fontWeight: t.weight, lineHeight: t.lh, color: '#1F2933', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        Pickleball VN
                      </p>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <p style={{ fontSize: 18, fontWeight: 800, color: '#0E7C7B', margin: 0, lineHeight: 1 }}>{t.size}</p>
                      <p style={{ fontSize: 9, color: '#9CA3AF', margin: '2px 0 0' }}>W{t.weight}</p>
                    </div>
                  </div>
                  <HDivider />
                  <div style={{ display: 'flex', gap: 12 }}>
                    {[
                      { k: 'FontSize', v: `${t.size}` },
                      { k: 'FontAttributes', v: t.weight >= 700 ? 'Bold' : 'None' },
                      { k: 'LineHeight', v: t.lh },
                    ].map(({ k, v }) => (
                      <div key={k}>
                        <p style={{ fontSize: 9, color: '#9CA3AF', margin: 0, fontWeight: 700 }}>{k}</p>
                        <p style={{ fontSize: 11, fontWeight: 700, margin: 0, fontFamily: 'monospace', color: '#374151' }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SPACING */}
        {tab === 'space' && (
          <div>
            <STitle icon={<Hash style={{ width: 17, height: 17 }} />} label="Spacing Tokens" sub="4px grid · 9 levels" />
            <Card style={{ marginBottom: 12, background: 'rgba(14,124,123,0.05)', borderColor: 'rgba(14,124,123,0.2)' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#0E7C7B', margin: '0 0 4px' }}>Base Grid: 4px</p>
              <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>MAUI: Padding, Margin, Spacing attributes</p>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {SPACING_TOKENS.map(s => (
                <Card key={s.token} style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* visual bar */}
                    <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', width: 56 }}>
                      <div style={{ height: 12, borderRadius: 3, background: 'linear-gradient(90deg,#0E7C7B,#2A9D8F)', width: Math.max(s.value, 4), maxWidth: 56 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Code color="#0E7C7B">{s.token}</Code>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1F2933' }}>{s.px}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'monospace' }}>{s.value}</span>
                      <CopyBtn text={String(s.value)} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* RADIUS */}
        {tab === 'radius' && (
          <div>
            <STitle icon={<Square style={{ width: 17, height: 17 }} />} label="Radius Tokens" sub="6 levels · MAUI CornerRadius" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {RADIUS_TOKENS.map(r => (
                <Card key={r.token} style={{ padding: '10px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {/* visual */}
                    <div style={{
                      width: 44, height: 44, flexShrink: 0,
                      background: 'rgba(14,124,123,0.12)',
                      border: '2px solid rgba(14,124,123,0.3)',
                      borderRadius: Math.min(r.value, 22),
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        <Code color="#0E7C7B">{r.token}</Code>
                        <span style={{ fontSize: 12, fontWeight: 700 }}>{r.value === 999 ? '999' : r.value + 'px'}</span>
                      </div>
                      <p style={{ fontSize: 11, color: '#6B7280', margin: 0 }}>{r.usage}</p>
                    </div>
                    <div style={{ flexShrink: 0 }}>
                      <p style={{ fontSize: 9, color: '#9CA3AF', margin: 0, fontWeight: 700 }}>MAUI</p>
                      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
                        <code style={{ fontSize: 10, fontFamily: 'monospace', color: '#374151' }}>CornerRadius="{r.value === 999 ? '24' : r.value}"</code>
                        <CopyBtn text={`CornerRadius="${r.value === 999 ? '24' : r.value}"`} />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* SHADOW */}
        {tab === 'shadow' && (
          <div>
            <STitle icon={<Sliders style={{ width: 17, height: 17 }} />} label="Shadow Tokens" sub="5 levels · MAUI Shadow" />
            <Card style={{ marginBottom: 12, background: 'rgba(233,196,106,0.08)', borderColor: 'rgba(233,196,106,0.3)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <AlertCircle style={{ width: 14, height: 14, color: '#A07B10', flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 11, color: '#A07B10', margin: 0 }}>
                  .NET MAUI <strong>Shadow</strong> property requires Android API ≥ 21. Fallback: elevation hoặc BoxShadow trong .NET 9.
                </p>
              </div>
            </Card>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {SHADOW_TOKENS.map(s => (
                <Card key={s.token} style={{ boxShadow: s.css }}>
                  <div style={{ marginBottom: 8 }}>
                    <Code color="#0E7C7B">{s.token}</Code>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 20px', gap: '4px 8px', alignItems: 'center' }}>
                    <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 700 }}>CSS</span>
                    <code style={{ fontSize: 10, color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.css}</code>
                    <CopyBtn text={s.css} />

                    <span style={{ fontSize: 9, color: '#9CA3AF', fontWeight: 700 }}>MAUI</span>
                    <code style={{ fontSize: 10, color: '#0E7C7B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.maui}</code>
                    <CopyBtn text={s.maui} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ═══════════════════════════
   TAB 4 · XAML GUIDE
═══════════════════════════ */
const XAML_SNIPPETS = [
  {
    title:   'ResourceDictionary — Colors',
    color:   '#0E7C7B',
    id:      'colors',
    code: `<!-- App.xaml -->
<ResourceDictionary>
  <Color x:Key="Primary">#0E7C7B</Color>
  <Color x:Key="PrimaryDark">#075E5D</Color>
  <Color x:Key="Success">#2A9D8F</Color>
  <Color x:Key="Accent">#F4A261</Color>
  <Color x:Key="Warning">#E9C46A</Color>
  <Color x:Key="Danger">#E76F51</Color>
  <Color x:Key="Background">#F7F9FA</Color>
  <Color x:Key="Surface">#FFFFFF</Color>
  <Color x:Key="TextPrimary">#1F2933</Color>
  <Color x:Key="TextSecondary">#6B7280</Color>
  <Color x:Key="Border">#E5E7EB</Color>
</ResourceDictionary>`,
  },
  {
    title:   'Button/Primary Style',
    color:   '#2A9D8F',
    id:      'btnprimary',
    code: `<Style x:Key="PrimaryBtn" TargetType="Button">
  <Setter Property="BackgroundColor" Value="{StaticResource Primary}" />
  <Setter Property="TextColor" Value="White" />
  <Setter Property="FontSize" Value="14" />
  <Setter Property="FontAttributes" Value="Bold" />
  <Setter Property="HeightRequest" Value="48" />
  <Setter Property="CornerRadius" Value="14" />
  <Setter Property="Shadow">
    <Setter.Value>
      <Shadow Brush="{StaticResource Primary}"
              Offset="0,4" Opacity="0.38" Radius="14" />
    </Setter.Value>
  </Setter>
  <Setter Property="VisualStateManager.VisualStateGroups">
    <VisualStateGroupList>
      <VisualStateGroup x:Name="CommonStates">
        <VisualState x:Name="Disabled">
          <VisualState.Setters>
            <Setter Property="BackgroundColor" Value="#C4CECE" />
            <Setter Property="TextColor" Value="#8FA5A5" />
          </VisualState.Setters>
        </VisualState>
      </VisualStateGroup>
    </VisualStateGroupList>
  </Setter>
</Style>`,
  },
  {
    title:   'Card/Student Layout',
    color:   '#815AD5',
    id:      'studentcard',
    code: `<!-- StudentCardView.xaml -->
<Border Stroke="{StaticResource Border}"
        StrokeThickness="1"
        StrokeShape="RoundRectangle 18"
        BackgroundColor="{StaticResource Surface}">
  <Grid RowDefinitions="Auto,Auto" Padding="16">

    <!-- Row 0: Avatar + Info + Chevron -->
    <Grid ColumnDefinitions="44,*,16" ColumnSpacing="12">
      <!-- Avatar -->
      <Border StrokeShape="RoundRectangle 12"
              BackgroundColor="#1A0E7C7B">
        <Label Text="{Binding Initials}"
               FontSize="15" FontAttributes="Bold"
               HorizontalOptions="Center"
               VerticalOptions="Center" />
      </Border>

      <!-- Name + Badge + Phone -->
      <VerticalStackLayout Grid.Column="1" Spacing="2">
        <HorizontalStackLayout Spacing="8">
          <Label Text="{Binding Name}"
                 FontSize="15" FontAttributes="Bold"
                 TextColor="{StaticResource TextPrimary}" />
          <views:PKBadge VariantType="{Binding BadgeStatus}" />
        </HorizontalStackLayout>
        <Label Text="{Binding Phone}"
               FontSize="11"
               TextColor="{StaticResource TextSecondary}" />
      </VerticalStackLayout>

      <!-- Chevron -->
      <Image Grid.Column="2" Source="chevron_right.png"
             WidthRequest="16" HeightRequest="16"
             VerticalOptions="Center" />
    </Grid>

    <!-- Row 1: Session progress bar -->
    <Grid Grid.Row="1" RowDefinitions="Auto,Auto,6"
          Margin="0,12,0,0">
      <BoxView HeightRequest="1"
               Color="{StaticResource Border}" />
      <HorizontalStackLayout Grid.Row="1" Margin="0,8,0,4">
        <Label Text="{Binding SessionText}" FontSize="11"
               TextColor="{StaticResource TextSecondary}" />
        <Label Text="{Binding RemainingText}" FontSize="11"
               FontAttributes="Bold" HorizontalOptions="EndAndExpand" />
      </HorizontalStackLayout>
      <ProgressBar Grid.Row="2"
                   Progress="{Binding SessionProgress}"
                   ProgressColor="{Binding ProgressColor}"
                   BackgroundColor="#12000000" />
    </Grid>
  </Grid>
</Border>`,
  },
  {
    title:   'Input/Text Field',
    color:   '#E76F51',
    id:      'input',
    code: `<!-- Reusable control: PKInputField.xaml -->
<ContentView>
  <VerticalStackLayout Spacing="6">

    <!-- Label row -->
    <HorizontalStackLayout Spacing="4">
      <Label Text="{Binding Label}"
             FontSize="13" FontAttributes="Bold"
             TextColor="{StaticResource TextPrimary}" />
      <Label Text="*" FontSize="12"
             TextColor="{StaticResource Danger}"
             IsVisible="{Binding IsRequired}" />
    </HorizontalStackLayout>

    <!-- Entry wrapper -->
    <Border StrokeShape="RoundRectangle 14"
            Stroke="{Binding BorderColor}"
            StrokeThickness="1.5"
            BackgroundColor="{StaticResource Surface}">
      <Entry Placeholder="{Binding Placeholder}"
             Text="{Binding Value, Mode=TwoWay}"
             IsEnabled="{Binding IsEnabled}"
             FontSize="14" Margin="14,0"
             HeightRequest="48" />
    </Border>

    <!-- Error row -->
    <HorizontalStackLayout Spacing="5"
                           IsVisible="{Binding HasError}">
      <Image Source="alert_circle.png"
             WidthRequest="13" HeightRequest="13" />
      <Label Text="{Binding ErrorMessage}"
             FontSize="12"
             TextColor="{StaticResource Danger}" />
    </HorizontalStackLayout>
  </VerticalStackLayout>
</ContentView>`,
  },
  {
    title:   'Navigation/BottomTab — Shell',
    color:   '#264653',
    id:      'bottomnav',
    code: `<!-- AppShell.xaml -->
<Shell xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
       Shell.TabBarBackgroundColor="{StaticResource Surface}"
       Shell.TabBarUnselectedColor="{StaticResource TextSecondary}"
       Shell.TabBarTitleColor="{StaticResource Primary}">

  <TabBar>
    <ShellContent Title="Trang chủ"
                  Icon="ic_home.png"
                  Route="dashboard"
                  ContentTemplate="{DataTemplate views:DashboardPage}" />
    <ShellContent Title="Điểm danh"
                  Icon="ic_checklist.png"
                  Route="attendance"
                  ContentTemplate="{DataTemplate views:TodaySessionsPage}" />
    <ShellContent Title="Học viên"
                  Icon="ic_students.png"
                  Route="students"
                  ContentTemplate="{DataTemplate views:StudentListPage}" />
    <ShellContent Title="Báo cáo"
                  Icon="ic_chart.png"
                  Route="reports"
                  ContentTemplate="{DataTemplate views:ReportsPage}" />
    <ShellContent Title="Cài đặt"
                  Icon="ic_settings.png"
                  Route="settings"
                  ContentTemplate="{DataTemplate views:SettingsPage}" />
  </TabBar>
</Shell>`,
  },
  {
    title:   'Badge/Warning Control',
    color:   '#F4A261',
    id:      'badge',
    code: `<!-- BadgeVariant enum -->
public enum BadgeVariant {
  Expiring, Expired, Active, Break, Quit
}

<!-- PKBadge.xaml.cs — code-behind logic -->
public static Color GetBadgeColor(BadgeVariant v) => v switch {
  BadgeVariant.Expiring => Color.FromArgb("#D4762A"),
  BadgeVariant.Expired  => Color.FromArgb("#C85A3D"),
  BadgeVariant.Active   => Color.FromArgb("#1A7B6E"),
  BadgeVariant.Break    => Color.FromArgb("#A07B10"),
  BadgeVariant.Quit     => Color.FromArgb("#6B7280"),
  _ => Colors.Gray
};

<!-- PKBadge.xaml -->
<Border StrokeShape="RoundRectangle 999"
        Stroke="{Binding BorderColor}"
        StrokeThickness="1"
        BackgroundColor="{Binding BackgroundColor}"
        Padding="10,3">
  <HorizontalStackLayout Spacing="4">
    <Image Source="{Binding IconSource}"
           WidthRequest="11" HeightRequest="11" />
    <Label Text="{Binding LabelText}"
           FontSize="11" FontAttributes="Bold"
           TextColor="{Binding TextColor}" />
  </HorizontalStackLayout>
</Border>`,
  },
];

const DEV_NOTES = [
  { icon: '📱', title: 'Target Platform', body: 'Android API 26+ (Android 8.0). Min SDK 26 để hỗ trợ Shadow API, VectorDrawable và RoundedRectangle đầy đủ.' },
  { icon: '🎨', title: 'Gradient Background', body: 'Header dùng LinearGradientBrush thay vì Gradient background. MAUI hỗ trợ từ .NET 7+. Tránh dùng gradient trong danh sách dài (performance).' },
  { icon: '📋', title: 'List Performance', body: 'Dùng CollectionView thay ListView cho tất cả danh sách. Đặt ItemsLayout="VerticalList" và tắt SelectionMode khi không cần select.' },
  { icon: '✨', title: 'Animation', body: 'Giữ animation đơn giản: FadeTo, ScaleTo, TranslateTo. Không dùng Lottie nếu không cần. Success dialog dùng ScaleTo(1.05) + FadeTo(0).' },
  { icon: '🔤', title: 'Font', body: 'Android system font Roboto là đủ. Nếu cần custom font, embed vào Resources/Fonts và đăng ký trong MauiProgram.cs.' },
  { icon: '📐', title: 'Safe Area', body: 'Thêm Padding="0,{StaticResource StatusBarHeight},0,0" cho ContentPage có status bar. Dùng Shell.NavBarIsVisible="False" cho tất cả page nội bộ.' },
  { icon: '🗂️', title: 'MVVM Pattern', body: 'Tất cả ViewModel kế thừa BaseViewModel (INotifyPropertyChanged). Commands dùng AsyncRelayCommand từ CommunityToolkit.Mvvm.' },
  { icon: '💾', title: 'Local Data', body: 'Dùng SQLite-net-pcl cho local database. Mỗi entity có Id (int, autoincrement). Backup xuất sang JSON và lưu vào Android Downloads.' },
];

function TabXAML() {
  const [expanded, setExpanded] = useState<string | null>('colors');
  return (
    <div style={{ padding: '16px 16px 80px' }}>
      <STitle icon={<Code2 style={{ width: 17, height: 17 }} />} label="XAML Guide" sub=".NET MAUI · MVVM · Android" />

      {/* platform note */}
      <Card style={{ marginBottom: 14, background: 'rgba(14,124,123,0.05)', borderColor: 'rgba(14,124,123,0.2)' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <Smartphone style={{ width: 16, height: 16, color: '#0E7C7B', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#0E7C7B', margin: '0 0 4px' }}>
              .NET MAUI Android — Handoff Notes
            </p>
            <p style={{ fontSize: 11, color: '#374151', margin: 0, lineHeight: 1.5 }}>
              App thiết kế cho <strong>390×844dp</strong> (Samsung A series). UI đơn giản, không hiệu ứng phức tạp, ưu tiên dễ chuyển sang XAML. Layout dùng Grid và VerticalStackLayout.
            </p>
          </div>
        </div>
      </Card>

      {/* XAML code snippets */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 10px' }}>Code Snippets</p>
      {XAML_SNIPPETS.map(s => {
        const isOpen = expanded === s.id;
        return (
          <div
            key={s.id}
            style={{ marginBottom: 8, borderRadius: 14, overflow: 'hidden', border: `1px solid ${isOpen ? s.color + '35' : 'rgba(0,0,0,0.09)'}`, background: '#FFF' }}
          >
            <button
              onClick={() => setExpanded(isOpen ? null : s.id)}
              style={{ width: '100%', padding: '11px 14px', display: 'flex', alignItems: 'center', gap: 10, background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <div style={{ width: 6, height: 24, borderRadius: 3, background: s.color, flexShrink: 0 }} />
              <span style={{ flex: 1, textAlign: 'left', fontSize: 13, fontWeight: 700, color: '#1F2933' }}>{s.title}</span>
              <ChevronRight style={{ width: 15, height: 15, color: '#9CA3AF', transition: 'transform 200ms', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
            </button>

            {isOpen && (
              <div style={{ borderTop: `1px solid ${s.color}20` }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 8, right: 10, zIndex: 1 }}>
                    <CopyBtn text={s.code} />
                  </div>
                  <pre style={{
                    margin: 0, padding: '12px 14px',
                    background: '#1E2430',
                    fontSize: 10.5,
                    color: '#ABB2BF',
                    fontFamily: '"JetBrains Mono","Fira Mono","Consolas",monospace',
                    lineHeight: 1.6,
                    overflowX: 'auto',
                    whiteSpace: 'pre',
                  }}>
                    {s.code.split('\n').map((line, i) => {
                      /* very simple XML syntax highlight */
                      const colored = line
                        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                        .replace(/(&lt;\/?[\w:\.]+)/g, '<span style="color:#E06C75">$1</span>')
                        .replace(/([\w:\.]+)=/g, '<span style="color:#ABB2BF">$1</span>=')
                        .replace(/"([^"]*)"/g, '"<span style="color:#98C379">$1</span>"')
                        .replace(/(#[A-F0-9]{3,8})/gi, '<span style="color:#E5C07B">$1</span>')
                        .replace(/(&lt;!--.*?--&gt;)/g, '<span style="color:#5C6370;font-style:italic">$1</span>');
                      return <div key={i} dangerouslySetInnerHTML={{ __html: colored }} />;
                    })}
                  </pre>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* dev notes */}
      <p style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '20px 0 10px' }}>Developer Notes</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {DEV_NOTES.map((n, i) => (
          <Card key={i} style={{ padding: '10px 12px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, margin: '0 0 3px', color: '#1F2933' }}>{n.title}</p>
                <p style={{ fontSize: 12, color: '#6B7280', margin: 0, lineHeight: 1.5 }}>{n.body}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════
   MAIN EXPORT
═══════════════════════════ */
export function DevHandoffScreen({ onBack }: DevHandoffScreenProps) {
  const [activeTab, setActiveTab] = useState<'screens'|'components'|'tokens'|'xaml'>('screens');

  const tabs: { id: typeof activeTab; label: string; icon: React.ReactNode }[] = [
    { id: 'screens',    label: 'Screens',     icon: <Monitor   style={{ width: 14, height: 14 }} /> },
    { id: 'components', label: 'Components',  icon: <Layers    style={{ width: 14, height: 14 }} /> },
    { id: 'tokens',     label: 'Tokens',      icon: <Palette   style={{ width: 14, height: 14 }} /> },
    { id: 'xaml',       label: 'XAML',        icon: <Code2     style={{ width: 14, height: 14 }} /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F7F9FA', overflow: 'hidden' }}>

      {/* ── TOP HEADER ── */}
      <div style={{ flexShrink: 0, background: 'linear-gradient(145deg,#054A49 0%,#075E5D 55%,#0E7C7B 100%)', paddingBottom: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '40px 16px 12px' }}>
          <button
            onClick={onBack}
            style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', flexShrink: 0 }}
          >
            <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
          </button>

          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', margin: 0 }}>VNS PickleTrack</p>
            <h1 style={{ fontSize: 18, fontWeight: 800, color: 'white', margin: 0, lineHeight: 1.2 }}>Developer Handoff</h1>
          </div>

          {/* version badge */}
          <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '5px 10px', border: '1px solid rgba(255,255,255,0.2)' }}>
            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', margin: 0, fontWeight: 700 }}>VERSION</p>
            <p style={{ fontSize: 12, color: 'white', margin: 0, fontWeight: 800, fontFamily: 'monospace' }}>v1.0.0</p>
          </div>
        </div>

        {/* stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', borderTop: '1px solid rgba(255,255,255,0.12)', borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
          {[
            { n: '16', l: 'Screens'    },
            { n: '11', l: 'Components' },
            { n: '40+', l: 'Tokens'   },
            { n: 'MAUI', l: 'Platform' },
          ].map(s => (
            <div key={s.l} style={{ padding: '8px 0', textAlign: 'center' }}>
              <p style={{ fontSize: 15, fontWeight: 900, color: 'white', margin: 0, lineHeight: 1 }}>{s.n}</p>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0', fontWeight: 600 }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* tab bar */}
        <div style={{ display: 'flex' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                flex: 1, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 12, fontWeight: activeTab === t.id ? 700 : 500,
                color: activeTab === t.id ? 'white' : 'rgba(255,255,255,0.5)',
                borderBottom: activeTab === t.id ? '2px solid white' : '2px solid transparent',
                transition: 'all 150ms',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── TAB CONTENT ── */}
      <div style={{ flex: 1, overflow: 'auto' }} className="no-scrollbar">
        {activeTab === 'screens'    && <TabScreens />}
        {activeTab === 'components' && <TabComponents />}
        {activeTab === 'tokens'     && <TabTokens />}
        {activeTab === 'xaml'       && <TabXAML />}
      </div>
    </div>
  );
}
