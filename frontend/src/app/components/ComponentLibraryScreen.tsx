/**
 * ComponentLibraryScreen — VNS PickleTrack
 * Showcase of all design system components
 */

import { useState }            from 'react';
import {
  ArrowLeft, Calendar, AlertTriangle, DollarSign, Users,
  CheckCircle2, Plus, Phone, GraduationCap, Search, Hash, MapPin
} from 'lucide-react';

import { PKButton }                                   from './pickletrack/PKButton';
import { PKStatusButton, PKStatusRow, AttendanceStatus } from './pickletrack/PKStatusButton';
import { PKMetricCard }                               from './pickletrack/PKMetricCard';
import { PKStudentCard }                              from './pickletrack/PKStudentCard';
import { PKClassCard }                                from './pickletrack/PKClassCard';
import { PKSessionCard }                              from './pickletrack/PKSessionCard';
import { PKBadge, BadgeVariant }                      from './pickletrack/PKBadge';
import { PKInputField }                               from './pickletrack/PKInputField';
import { PKDropdownField }                            from './pickletrack/PKDropdownField';
import { PKBottomNav, NavTab }                        from './pickletrack/PKBottomNav';

interface ComponentLibraryScreenProps {
  onBack: () => void;
}

/* ── Section header ── */
function SectionHeader({
  index, title, count, color = '#0E7C7B',
}: { index: number; title: string; count?: string; color?: string }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: color + '18', border: `1.5px solid ${color}30` }}
      >
        <span style={{ fontSize: 12, fontWeight: 900, color }}>{index < 10 ? `0${index}` : index}</span>
      </div>
      <div className="flex-1">
        <h2 style={{ fontSize: 15, fontWeight: 800, margin: 0, lineHeight: 1 }}>{title}</h2>
        {count && <p className="text-muted-foreground" style={{ fontSize: 11, margin: 0 }}>{count}</p>}
      </div>
      {count && (
        <span
          className="px-2 py-0.5 rounded-full"
          style={{ fontSize: 10, fontWeight: 700, background: color + '14', color }}
        >
          {count}
        </span>
      )}
    </div>
  );
}

/* ── Variant label ── */
function VLabel({ text }: { text: string }) {
  return (
    <p className="text-muted-foreground text-center" style={{ fontSize: 10, fontWeight: 600, margin: '6px 0 0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {text}
    </p>
  );
}

/* ── Card wrapper for sections ── */
function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-card rounded-2xl border border-border p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

/* ── Divider ── */
function Divider() {
  return <div className="h-px bg-border my-6" />;
}

/* ════════════════════════════════════════
   MAIN SCREEN
════════════════════════════════════════ */
export function ComponentLibraryScreen({ onBack }: ComponentLibraryScreenProps) {
  /* interactive state */
  const [statusVal,    setStatusVal]    = useState<AttendanceStatus | null>('present');
  const [navTab,       setNavTab]       = useState<NavTab>('home');
  const [inputVal,     setInputVal]     = useState('');
  const [dropVal,      setDropVal]      = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const sections = [
    { id: 'buttons',    label: 'Buttons',          color: '#0E7C7B' },
    { id: 'status',     label: 'Status Buttons',   color: '#2A9D8F' },
    { id: 'metric',     label: 'Metric Cards',     color: '#F4A261' },
    { id: 'student',    label: 'Student Card',     color: '#815AD5' },
    { id: 'class',      label: 'Class Card',       color: '#E76F51' },
    { id: 'session',    label: 'Session Card',     color: '#E9C46A' },
    { id: 'badge',      label: 'Badges',           color: '#6B7280' },
    { id: 'input',      label: 'Input Field',      color: '#0E7C7B' },
    { id: 'dropdown',   label: 'Dropdown Field',   color: '#2A9D8F' },
    { id: 'bottomnav',  label: 'Bottom Nav',       color: '#264653' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#F7F9FA' }}>

      {/* ── Header ── */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 55%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/4 pointer-events-none" />
        <div className="absolute top-16 -right-4 w-24 h-24 rounded-full bg-white/3 pointer-events-none" />

        <div className="flex items-center gap-3 px-4 pt-10 pb-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:bg-white/25 flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-white/55" style={{ fontSize: 11, margin: 0 }}>VNS PickleTrack</p>
            <h1 className="text-white" style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>Component Library</h1>
          </div>
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.13)' }}
          >
            <span className="text-white/70" style={{ fontSize: 11, fontWeight: 700 }}>11 components</span>
          </div>
        </div>

        {/* quick jump chips */}
        <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => {
                setActiveSection(s.id);
                document.getElementById(`section-${s.id}`)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex-shrink-0 px-3 py-1.5 rounded-full transition-all"
              style={{
                fontSize:   11,
                fontWeight: activeSection === s.id ? 700 : 500,
                background: activeSection === s.id ? s.color : 'rgba(255,255,255,0.13)',
                color:      'white',
                border:     activeSection === s.id ? `1px solid ${s.color}` : '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="px-4 py-5 space-y-8 pb-16">

          {/* ══════════════════════════
              01 · PRIMARY BUTTON
          ══════════════════════════ */}
          <section id="section-buttons">
            <SectionHeader index={1} title="Primary Button" color="#0E7C7B" count="3 states · icon optional" />
            <SectionCard>
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Primary</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-1">
                  <PKButton label="Lưu" variant="primary" state="default" />
                  <VLabel text="Default" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <PKButton label="Lưu" variant="primary" state="pressed" />
                  <VLabel text="Pressed" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <PKButton label="Lưu" variant="primary" state="disabled" />
                  <VLabel text="Disabled" />
                </div>
              </div>

              <div className="h-px bg-border my-4" />
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>With Icon</p>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col items-center gap-1">
                  <PKButton label="Thêm học viên" icon={<Plus style={{ width: 16, height: 16 }} />} variant="primary" />
                  <VLabel text="Icon + Label" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <PKButton label="Điểm danh" icon={<CheckCircle2 style={{ width: 16, height: 16 }} />} variant="primary" size="sm" />
                  <VLabel text="Small" />
                </div>
              </div>

              <div className="h-px bg-border my-4" />
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Full Width</p>
              <PKButton label="Lưu thay đổi" variant="primary" fullWidth />
            </SectionCard>

            {/* ── Secondary ── */}
            <div className="mt-3">
              <SectionCard>
                <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Secondary</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex flex-col items-center gap-1">
                    <PKButton label="Hủy" variant="secondary" state="default" />
                    <VLabel text="Default" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <PKButton label="Hủy" variant="secondary" state="pressed" />
                    <VLabel text="Pressed" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <PKButton label="Hủy" variant="secondary" state="disabled" />
                    <VLabel text="Disabled" />
                  </div>
                </div>
                <div className="h-px bg-border my-4" />
                <div className="flex gap-3">
                  <PKButton label="Hủy" variant="secondary" fullWidth />
                  <PKButton label="Xác nhận" variant="primary" fullWidth />
                </div>
              </SectionCard>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════
              03 · STATUS BUTTON
          ══════════════════════════ */}
          <section id="section-status">
            <SectionHeader index={3} title="Status Button" color="#2A9D8F" count="5 types · selected / unselected" />
            <SectionCard>
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Unselected</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(['present','late','makeup','absent','leave'] as AttendanceStatus[]).map(s => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <PKStatusButton status={s} selected={false} />
                  </div>
                ))}
              </div>

              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(['present','late','makeup','absent','leave'] as AttendanceStatus[]).map(s => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <PKStatusButton status={s} selected={true} />
                  </div>
                ))}
              </div>

              <div className="h-px bg-border my-4" />
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive — tap to select</p>
              <PKStatusRow value={statusVal} onChange={setStatusVal} />
              {statusVal && (
                <p className="mt-2 text-muted-foreground" style={{ fontSize: 11 }}>
                  Đã chọn: <span style={{ fontWeight: 700, color: '#0E7C7B' }}>{statusVal}</span>
                </p>
              )}
            </SectionCard>
          </section>

          <Divider />

          {/* ══════════════════════════
              04 · METRIC CARD
          ══════════════════════════ */}
          <section id="section-metric">
            <SectionHeader index={4} title="Dashboard Metric Card" color="#F4A261" count="5 color variants" />
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <PKMetricCard
                  number="3"
                  label="Lớp hôm nay"
                  icon={<Calendar style={{ width: 18, height: 18 }} />}
                  variant="primary"
                  sub="Ngày 30/04"
                  trend={{ value: '+1', up: true }}
                />
                <VLabel text="Primary" />
              </div>
              <div className="flex flex-col gap-1">
                <PKMetricCard
                  number="42"
                  label="Tổng học viên"
                  icon={<Users style={{ width: 18, height: 18 }} />}
                  variant="success"
                  trend={{ value: '+3', up: true }}
                />
                <VLabel text="Success" />
              </div>
              <div className="flex flex-col gap-1">
                <PKMetricCard
                  number="12M"
                  label="Doanh thu"
                  icon={<DollarSign style={{ width: 18, height: 18 }} />}
                  variant="accent"
                  sub="Tháng 04/2026"
                />
                <VLabel text="Accent" />
              </div>
              <div className="flex flex-col gap-1">
                <PKMetricCard
                  number="5"
                  label="Sắp hết buổi"
                  icon={<AlertTriangle style={{ width: 18, height: 18 }} />}
                  variant="warning"
                />
                <VLabel text="Warning" />
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-1">
              <PKMetricCard
                number="2"
                label="Đã hết buổi · Cần gia hạn"
                icon={<AlertTriangle style={{ width: 18, height: 18 }} />}
                variant="danger"
                sub="Cần liên hệ ngay"
                trend={{ value: 'Khẩn', up: false }}
              />
              <VLabel text="Danger" />
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════
              05 · STUDENT CARD
          ══════════════════════════ */}
          <section id="section-student">
            <SectionHeader index={5} title="Student Card" color="#815AD5" count="4 badge variants" />
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <PKStudentCard
                  name="Nguyễn Văn An"
                  phone="0912 345 678"
                  className="Beginner A"
                  totalSessions={20}
                  usedSessions={18}
                  remainingSessions={2}
                  badgeStatus="expiring"
                />
                <VLabel text="Sắp hết buổi — 2 buổi còn" />
              </div>
              <div className="flex flex-col gap-1">
                <PKStudentCard
                  name="Trần Thị Bình"
                  phone="0987 654 321"
                  className="Intermediate B"
                  totalSessions={20}
                  usedSessions={20}
                  remainingSessions={0}
                  badgeStatus="expired"
                />
                <VLabel text="Hết buổi" />
              </div>
              <div className="flex flex-col gap-1">
                <PKStudentCard
                  name="Lê Quốc Cường"
                  phone="0934 111 222"
                  className="Advanced C"
                  totalSessions={20}
                  usedSessions={8}
                  remainingSessions={12}
                  badgeStatus="active"
                />
                <VLabel text="Đang học — còn nhiều buổi" />
              </div>
              <div className="flex flex-col gap-1">
                <PKStudentCard
                  name="Phạm Hồng Duyên"
                  phone="0961 777 888"
                  className="Beginner A"
                  totalSessions={10}
                  usedSessions={3}
                  remainingSessions={7}
                  badgeStatus="break"
                />
                <VLabel text="Tạm nghỉ" />
              </div>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════
              06 · CLASS CARD
          ══════════════════════════ */}
          <section id="section-class">
            <SectionHeader index={6} title="Class Card" color="#E76F51" count="3 level variants" />
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <PKClassCard
                  name="Beginner A"
                  schedule="Thứ 2 · 07:00 – 08:30"
                  court="Sân 1"
                  coach="Coach Minh"
                  studentCount={10}
                  maxStudents={12}
                  level="Cơ bản"
                  colorAccent="#0E7C7B"
                />
                <VLabel text="Cơ bản · Teal" />
              </div>
              <div className="flex flex-col gap-1">
                <PKClassCard
                  name="Intermediate B"
                  schedule="Thứ 4 · 09:00 – 10:30"
                  court="Sân 2"
                  coach="Coach Hùng"
                  studentCount={8}
                  maxStudents={10}
                  level="Trung cấp"
                  colorAccent="#F4A261"
                />
                <VLabel text="Trung cấp · Cam" />
              </div>
              <div className="flex flex-col gap-1">
                <PKClassCard
                  name="Advanced C"
                  schedule="Thứ 6 · 17:00 – 18:30"
                  court="Sân 3"
                  coach="Coach Lan"
                  studentCount={6}
                  maxStudents={6}
                  level="Nâng cao"
                  colorAccent="#815AD5"
                />
                <VLabel text="Nâng cao · Tím · Full" />
              </div>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════
              07 · SESSION CARD
          ══════════════════════════ */}
          <section id="section-session">
            <SectionHeader index={7} title="Session Card" color="#E9C46A" count="3 session states" />
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <PKSessionCard
                  time="07:00 – 08:30"
                  className="Beginner A"
                  court="Sân 1"
                  coach="Coach Minh"
                  checkedIn={6}
                  total={10}
                  sessionState="upcoming"
                />
                <VLabel text="Upcoming — sắp diễn ra" />
              </div>
              <div className="flex flex-col gap-1">
                <PKSessionCard
                  time="09:00 – 10:30"
                  className="Intermediate B"
                  court="Sân 2"
                  coach="Coach Hùng"
                  checkedIn={5}
                  total={8}
                  sessionState="in-progress"
                />
                <VLabel text="In-progress — đang diễn ra" />
              </div>
              <div className="flex flex-col gap-1">
                <PKSessionCard
                  time="07:00 – 08:30"
                  className="Advanced C"
                  court="Sân 3"
                  coach="Coach Lan"
                  checkedIn={6}
                  total={6}
                  sessionState="done"
                />
                <VLabel text="Done — đã hoàn thành" />
              </div>
            </div>
          </section>

          <Divider />

          {/* ══════════════════════════
              08 · WARNING BADGE
          ══════════════════════════ */}
          <section id="section-badge">
            <SectionHeader index={8} title="Warning Badge" color="#6B7280" count="5 variants · 2 sizes" />
            <SectionCard>
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size MD</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(['expiring','expired','active','break','quit'] as BadgeVariant[]).map(v => (
                  <PKBadge key={v} variant={v} size="md" />
                ))}
              </div>

              <div className="h-px bg-border my-4" />
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size SM</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {(['expiring','expired','active','break','quit'] as BadgeVariant[]).map(v => (
                  <PKBadge key={v} variant={v} size="sm" />
                ))}
              </div>

              <div className="h-px bg-border my-4" />
              <p className="text-muted-foreground mb-3" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>No icon</p>
              <div className="flex flex-wrap gap-2">
                {(['expiring','expired','active','break','quit'] as BadgeVariant[]).map(v => (
                  <PKBadge key={v} variant={v} size="md" showIcon={false} />
                ))}
              </div>
            </SectionCard>
          </section>

          <Divider />

          {/* ══════════════════════════
              09 · INPUT FIELD
          ══════════════════════════ */}
          <section id="section-input">
            <SectionHeader index={9} title="Input Field" color="#0E7C7B" count="4 states" />
            <SectionCard>
              <div className="space-y-4">
                {/* Default */}
                <div>
                  <PKInputField
                    label="Tên học viên"
                    placeholder="Nhập họ và tên..."
                    value={inputVal}
                    onChange={setInputVal}
                    required
                  />
                  <VLabel text="Default + Required" />
                </div>

                {/* With icon */}
                <div>
                  <PKInputField
                    label="Số điện thoại"
                    placeholder="0912 345 678"
                    icon={<Phone style={{ width: 16, height: 16 }} />}
                    type="tel"
                  />
                  <VLabel text="With leading icon" />
                </div>

                {/* Hint */}
                <div>
                  <PKInputField
                    label="Lớp học"
                    placeholder="VD: Beginner A"
                    icon={<GraduationCap style={{ width: 16, height: 16 }} />}
                    hint="Chọn lớp phù hợp với trình độ học viên."
                  />
                  <VLabel text="Hint text" />
                </div>

                {/* Error */}
                <div>
                  <PKInputField
                    label="Số buổi học"
                    placeholder="VD: 20"
                    value="abc"
                    error="Vui lòng nhập số hợp lệ (tối đa 100 buổi)."
                    icon={<Hash style={{ width: 16, height: 16 }} />}
                    type="number"
                  />
                  <VLabel text="Error state" />
                </div>

                {/* Disabled */}
                <div>
                  <PKInputField
                    label="Mã học viên"
                    placeholder="HV-2024-001"
                    value="HV-2026-042"
                    disabled
                    hint="Mã được tạo tự động, không thể chỉnh sửa."
                  />
                  <VLabel text="Disabled" />
                </div>
              </div>
            </SectionCard>
          </section>

          <Divider />

          {/* ══════════════════════════
              10 · DROPDOWN FIELD
          ══════════════════════════ */}
          <section id="section-dropdown">
            <SectionHeader index={10} title="Dropdown Field" color="#2A9D8F" count="4 states" />
            <SectionCard>
              <div className="space-y-4">
                {/* Default */}
                <div>
                  <PKDropdownField
                    label="Chọn lớp học"
                    options={['Beginner A','Intermediate B','Advanced C','Beginner B']}
                    value={dropVal}
                    placeholder="Chọn lớp..."
                    onChange={setDropVal}
                    required
                  />
                  <VLabel text="Default · Interactive" />
                </div>

                {/* With icon + selected */}
                <div>
                  <PKDropdownField
                    label="Sân tập"
                    options={['Sân 1','Sân 2','Sân 3','Sân VIP']}
                    value="Sân 2"
                    icon={<MapPin style={{ width: 16, height: 16 }} />}
                    hint="Chọn sân phù hợp với lịch học."
                  />
                  <VLabel text="With icon + value selected" />
                </div>

                {/* Error */}
                <div>
                  <PKDropdownField
                    label="Coach phụ trách"
                    options={['Coach Minh','Coach Hùng','Coach Lan']}
                    value=""
                    placeholder="Chọn coach..."
                    error="Vui lòng chọn coach phụ trách lớp."
                  />
                  <VLabel text="Error state" />
                </div>

                {/* Disabled */}
                <div>
                  <PKDropdownField
                    label="Trạng thái"
                    options={['Đang học','Tạm nghỉ','Đã nghỉ']}
                    value="Đang học"
                    disabled
                    hint="Không thể thay đổi trạng thái này."
                  />
                  <VLabel text="Disabled" />
                </div>
              </div>
            </SectionCard>
          </section>

          <Divider />

          {/* ══════════════════════════
              11 · BOTTOM NAVIGATION
          ══════════════════════════ */}
          <section id="section-bottomnav">
            <SectionHeader index={11} title="Bottom Navigation" color="#264653" count="5 tabs · badge support" />
            <SectionCard>
              {/* Tab home */}
              <p className="text-muted-foreground mb-2" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active: Trang chủ</p>
              <div className="rounded-xl overflow-hidden border border-border">
                <PKBottomNav activeTab="home" onTabChange={() => {}} />
              </div>

              <div className="h-px bg-border my-4" />
              <p className="text-muted-foreground mb-2" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active: Báo cáo + Badges</p>
              <div className="rounded-xl overflow-hidden border border-border">
                <PKBottomNav
                  activeTab="reports"
                  onTabChange={() => {}}
                  badges={{ reports: 5, attendance: 0 }}
                />
              </div>

              <div className="h-px bg-border my-4" />
              <p className="text-muted-foreground mb-2" style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Interactive</p>
              <div className="rounded-xl overflow-hidden border border-border">
                <PKBottomNav
                  activeTab={navTab}
                  onTabChange={setNavTab}
                  badges={{ reports: 2 }}
                />
              </div>
              <p className="text-center mt-2 text-muted-foreground" style={{ fontSize: 11 }}>
                Active: <span style={{ fontWeight: 700, color: '#0E7C7B' }}>{navTab}</span>
              </p>
            </SectionCard>
          </section>

          {/* ══ footer ══ */}
          <div
            className="rounded-2xl p-5 text-center"
            style={{ background: 'linear-gradient(135deg,rgba(14,124,123,0.08),rgba(42,157,143,0.05))' , border: '1px solid rgba(14,124,123,0.2)' }}
          >
            <p style={{ fontSize: 13, fontWeight: 700, color: '#0E7C7B' }}>VNS PickleTrack · Design System</p>
            <p className="text-muted-foreground" style={{ fontSize: 11 }}>
              11 components · Auto Layout · Mobile-first 390×844
            </p>
            <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
              {['#0E7C7B','#2A9D8F','#F4A261','#E9C46A','#E76F51','#815AD5','#264653'].map(c => (
                <div key={c} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: c }} />
                  <span style={{ fontSize: 9, fontWeight: 600, color: '#6B7280', fontFamily: 'monospace' }}>{c}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="h-6" />
        </div>
      </div>
    </div>
  );
}
