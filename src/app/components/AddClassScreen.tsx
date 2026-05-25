import {
  ArrowLeft, Save, X, AlertCircle, BookOpen,
  Trophy, User2, MapPin, Clock, CalendarDays,
  ToggleLeft, FileText, ChevronDown, CheckCircle2,
  Users, Minus, Plus, Sparkles
} from 'lucide-react';
import { useState, useRef } from 'react';

interface AddClassScreenProps {
  onBack: () => void;
  onSave: () => void;
}

/* ─── Config data ───────────────────────────────────────── */
const LEVEL_OPTIONS = [
  { value: 'beginner',     label: 'Cơ bản',   sub: 'Mới bắt đầu',  color: '#2A9D8F', bg: 'rgba(42,157,143,0.11)'  },
  { value: 'intermediate', label: 'Trung cấp', sub: 'Có kinh nghiệm', color: '#F4A261', bg: 'rgba(244,162,97,0.11)'  },
  { value: 'advanced',     label: 'Nâng cao',  sub: 'Chuyên nghiệp', color: '#E76F51', bg: 'rgba(231,111,81,0.11)'  },
];

const STATUS_OPTIONS = [
  { id: 'open',    label: 'Đang mở',   desc: 'Nhận học viên mới',  color: '#2A9D8F', bg: 'rgba(42,157,143,0.11)'  },
  { id: 'paused',  label: 'Tạm ngưng', desc: 'Tạm dừng hoạt động', color: '#E9C46A', bg: 'rgba(233,196,106,0.15)' },
];

const COACHES = ['Coach Nam', 'Coach Hùng', 'Coach Linh', 'Coach Minh'];
const COURTS  = ['Sân 1', 'Sân 2', 'Sân 3', 'Sân 4'];
const DAYS    = [
  { id: 1, label: 'T2', full: 'Thứ 2'    },
  { id: 2, label: 'T3', full: 'Thứ 3'    },
  { id: 3, label: 'T4', full: 'Thứ 4'    },
  { id: 4, label: 'T5', full: 'Thứ 5'    },
  { id: 5, label: 'T6', full: 'Thứ 6'    },
  { id: 6, label: 'T7', full: 'Thứ 7'    },
  { id: 0, label: 'CN', full: 'Chủ nhật' },
];

/* ─── Utils ─────────────────────────────────────────────── */
function toMin(t: string) {
  if (!t) return 0;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}
function fmtTime(t: string) {
  if (!t) return '';
  const [h, m] = t.split(':').map(Number);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
function durationLabel(start: string, end: string) {
  if (!start || !end) return null;
  const d = toMin(end) - toMin(start);
  if (d <= 0) return null;
  const h = Math.floor(d / 60), min = d % 60;
  return h > 0 ? `${h}h${min > 0 ? min + 'p' : ''}` : `${min}p`;
}

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export function AddClassScreen({ onBack, onSave }: AddClassScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name:        '',
    level:       '' as 'beginner' | 'intermediate' | 'advanced' | '',
    coach:       '',
    court:       '',
    startTime:   '',
    endTime:     '',
    days:        [] as number[],
    maxStudents: 10,
    status:      'open' as 'open' | 'paused',
    notes:       '',
  });

  const [errors,  setErrors]  = useState({ name: '', endTime: '' });
  const [touched, setTouched] = useState({ name: false, endTime: false });
  const [shake,   setShake]   = useState(false);

  /* ── derived ── */
  const dur = durationLabel(form.startTime, form.endTime);
  const selectedDayFull  = DAYS.filter(d => form.days.includes(d.id)).map(d => d.full).join(', ');
  const selectedDayShort = DAYS.filter(d => form.days.includes(d.id)).map(d => d.label).join(' · ');
  const levelCfg         = LEVEL_OPTIONS.find(l => l.value === form.level);

  /* ── completion % ── */
  const completedCount = [
    form.name.trim(),
    form.level,
    form.coach,
    form.court,
    form.startTime,
    form.endTime && !errors.endTime,
    form.days.length > 0,
  ].filter(Boolean).length;
  const completionPct = Math.round((completedCount / 7) * 100);

  /* ── validation ── */
  const validateName    = (v: string) => v.trim() === '' ? 'Vui lòng nhập tên lớp.' : '';
  const validateEndTime = (s: string, e: string) => {
    if (!s || !e) return '';
    return toMin(e) <= toMin(s) ? 'Giờ kết thúc phải lớn hơn giờ bắt đầu.' : '';
  };

  const set = (field: string, value: unknown) => {
    setForm(f => {
      const next = { ...f, [field]: value } as typeof f;
      if (field === 'name' && touched.name)
        setErrors(e => ({ ...e, name: validateName(value as string) }));
      if ((field === 'endTime' || field === 'startTime') && touched.endTime)
        setErrors(e => ({
          ...e,
          endTime: validateEndTime(
            field === 'startTime' ? (value as string) : f.startTime,
            field === 'endTime'   ? (value as string) : f.endTime,
          ),
        }));
      return next;
    });
  };

  const toggleDay = (id: number) =>
    setForm(f => ({
      ...f,
      days: f.days.includes(id) ? f.days.filter(d => d !== id) : [...f.days, id],
    }));

  const clampStudents = (v: number) => Math.max(1, Math.min(50, v));

  const handleBlur = (field: 'name' | 'endTime') => {
    setTouched(t => ({ ...t, [field]: true }));
    if (field === 'name')
      setErrors(e => ({ ...e, name: validateName(form.name) }));
    if (field === 'endTime')
      setErrors(e => ({ ...e, endTime: validateEndTime(form.startTime, form.endTime) }));
  };

  const handleSave = () => {
    const nameErr    = validateName(form.name);
    const endTimeErr = validateEndTime(form.startTime, form.endTime);
    setTouched({ name: true, endTime: true });
    setErrors({ name: nameErr, endTime: endTimeErr });
    if (nameErr || endTimeErr) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    onSave();
  };

  /* ── section header ── */
  const Sec = ({
    n, color, icon, title, done,
  }: { n: number; color: string; icon: React.ReactNode; title: string; done?: boolean }) => (
    <div className="flex items-center gap-2.5 mb-3">
      <div
        className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: done ? color : color + '1A' }}
      >
        {done
          ? <CheckCircle2 style={{ width: 13, height: 13, color: 'white' }} />
          : <span style={{ fontSize: 11, fontWeight: 800, color }}>{n}</span>
        }
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color: done ? color : '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: color + '25' }} />
      {done && (
        <span className="px-2 py-0.5 rounded-full" style={{ fontSize: 10, fontWeight: 800, background: color + '15', color }}>
          ✓
        </span>
      )}
    </div>
  );

  /* ── reusable field wrapper ── */
  const Field = ({ label, required, hint, error, children }: {
    label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
  }) => (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ fontSize: 13, fontWeight: 700, color: error ? '#E76F51' : '#374151' }}>
          {label}
        </span>
        {required && <span style={{ color: '#E76F51', fontSize: 13, lineHeight: 1 }}>*</span>}
        {hint && !error && (
          <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 'auto' }}>{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 mt-2">
          <AlertCircle style={{ width: 13, height: 13, color: '#E76F51', flexShrink: 0 }} />
          <span style={{ fontSize: 12, color: '#E76F51' }}>{error}</span>
        </div>
      )}
    </div>
  );

  /* ─────────────────────────────────── RENDER ─── */
  return (
    <div className="flex flex-col h-screen" style={{ background: '#F7F9FA' }}>

      {/* ══ HEADER ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(150deg,#043F3E 0%,#0E7C7B 55%,#2A9D8F 100%)' }}
      >
        {/* decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
             style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="absolute top-4 -right-4 w-20 h-20 rounded-full pointer-events-none"
             style={{ background: 'rgba(255,255,255,0.04)' }} />

        <div className="relative px-4 pt-12 pb-4">
          {/* top row */}
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={onBack}
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
            </button>
            <div className="flex-1">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>
                THÊM MỚI
              </p>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white', lineHeight: 1.2 }}>
                Thêm lớp học
              </h1>
            </div>
            <div className="text-right">
              <p style={{ fontSize: 18, fontWeight: 900, color: 'white', lineHeight: 1 }}>
                {completionPct}%
              </p>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>Hoàn thành</p>
            </div>
          </div>

          {/* progress bar */}
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${completionPct}%`,
                background: 'rgba(255,255,255,0.85)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              {completedCount}/7 mục đã điền
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: '#FFC9C9' }}>*</span> bắt buộc: Tên lớp
            </p>
          </div>
        </div>
      </div>

      {/* ══ SCROLLABLE FORM ══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-36 px-4 pt-5 space-y-5">

        {/* ───────────────────────────────────────
            SECTION 1 — THÔNG TIN CƠ BẢN
        ─────────────────────────────────────── */}
        <div>
          <Sec
            n={1} color="#0E7C7B" icon={<BookOpen />}
            title="Thông tin cơ bản"
            done={!!form.name.trim() && !!form.level}
          />
          <div
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              border: errors.name ? '1.5px solid rgba(231,111,81,0.35)' : '1.5px solid rgba(0,0,0,0.09)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
              animation: shake && errors.name ? 'fieldShake 0.5s ease' : 'none',
            }}
          >
            {/* Tên lớp */}
            <div className="px-4 pt-4 pb-3.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Tên lớp" required error={errors.name}>
                <div className="relative">
                  <BookOpen
                    style={{
                      position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                      width: 16, height: 16, color: errors.name ? '#E76F51' : '#0E7C7B',
                    }}
                  />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    placeholder="Beginner A"
                    className="w-full pl-7 pr-0 py-2 bg-transparent focus:outline-none"
                    style={{
                      fontSize: 16, fontWeight: 700, color: '#1F2933',
                      borderBottom: `2px solid ${errors.name ? '#E76F51' : form.name ? '#0E7C7B' : 'rgba(0,0,0,0.1)'}`,
                      transition: 'border-color 0.2s',
                    }}
                  />
                  {form.name.trim() && !errors.name && (
                    <CheckCircle2
                      style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
                               width: 16, height: 16, color: '#2A9D8F' }}
                    />
                  )}
                </div>
              </Field>
            </div>

            {/* Trình độ */}
            <div className="px-4 py-4">
              <Field label="Trình độ" hint="Chọn một">
                <div className="grid grid-cols-3 gap-2">
                  {LEVEL_OPTIONS.map(opt => {
                    const active = form.level === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => set('level', opt.value)}
                        className="relative flex flex-col items-center py-3 px-2 rounded-2xl active:scale-95 transition-all"
                        style={{
                          background:  active ? opt.bg : 'rgba(0,0,0,0.03)',
                          border:      `1.5px solid ${active ? opt.color + '55' : 'rgba(0,0,0,0.09)'}`,
                          boxShadow:   active ? `0 4px 14px ${opt.color}22` : 'none',
                          transition:  'all 0.2s ease',
                        }}
                      >
                        <div
                          className="w-7 h-7 rounded-xl flex items-center justify-center mb-1.5"
                          style={{ background: active ? opt.color : 'rgba(0,0,0,0.06)' }}
                        >
                          <Trophy style={{ width: 13, height: 13, color: active ? 'white' : '#9CA3AF' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: active ? opt.color : '#6B7280', lineHeight: 1.2, textAlign: 'center' }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: 10, color: active ? opt.color + 'BB' : '#9CA3AF', marginTop: 2, textAlign: 'center' }}>
                          {opt.sub}
                        </span>
                        {active && (
                          <div
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: opt.color, border: '2px solid white' }}
                          >
                            <span style={{ fontSize: 9, color: 'white', fontWeight: 900 }}>✓</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────
            SECTION 2 — LỊCH HỌC
        ─────────────────────────────────────── */}
        <div>
          <Sec
            n={2} color="#F4A261" icon={<CalendarDays />}
            title="Lịch học & Thời gian"
            done={!!form.startTime && !!form.endTime && !errors.endTime && form.days.length > 0}
          />
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* ── Giờ học — 2 cols ── */}
            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              {/* Start time */}
              <div className="px-4 py-4" style={{ borderRight: '1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Clock style={{ width: 13, height: 13, color: '#F4A261' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#374151' }}>Giờ bắt đầu</span>
                </div>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={e => set('startTime', e.target.value)}
                  className="w-full rounded-xl focus:outline-none focus:ring-0"
                  style={{
                    fontSize: 18, fontWeight: 900,
                    color: form.startTime ? '#0E7C7B' : '#9CA3AF',
                    background: form.startTime ? 'rgba(14,124,123,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1.5px solid ${form.startTime ? 'rgba(14,124,123,0.3)' : 'rgba(0,0,0,0.09)'}`,
                    padding: '10px 10px',
                    transition: 'all 0.2s',
                  }}
                />
                {form.startTime && (
                  <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
                    Bắt đầu
                  </p>
                )}
              </div>

              {/* End time */}
              <div className="px-4 py-4">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Clock style={{ width: 13, height: 13, color: errors.endTime ? '#E76F51' : '#F4A261' }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: errors.endTime ? '#E76F51' : '#374151' }}>
                    Giờ kết thúc
                  </span>
                </div>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={e => set('endTime', e.target.value)}
                  onBlur={() => handleBlur('endTime')}
                  className="w-full rounded-xl focus:outline-none focus:ring-0"
                  style={{
                    fontSize: 18, fontWeight: 900,
                    color: errors.endTime ? '#E76F51' : form.endTime ? '#0E7C7B' : '#9CA3AF',
                    background: errors.endTime ? 'rgba(231,111,81,0.07)' : form.endTime ? 'rgba(14,124,123,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1.5px solid ${errors.endTime ? 'rgba(231,111,81,0.4)' : form.endTime ? 'rgba(14,124,123,0.3)' : 'rgba(0,0,0,0.09)'}`,
                    padding: '10px 10px',
                    transition: 'all 0.2s',
                  }}
                />
                {form.endTime && !errors.endTime && (
                  <p style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, textAlign: 'center' }}>
                    Kết thúc
                  </p>
                )}
              </div>
            </div>

            {/* ── Duration banner / Error ── */}
            {(dur || errors.endTime) && (
              <div
                className="px-4 py-2.5 flex items-center gap-2"
                style={{
                  background:   errors.endTime ? 'rgba(231,111,81,0.07)' : 'rgba(42,157,143,0.07)',
                  borderBottom: '1px solid rgba(0,0,0,0.07)',
                }}
              >
                {errors.endTime ? (
                  <>
                    <AlertCircle style={{ width: 14, height: 14, color: '#E76F51', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#E76F51' }}>{errors.endTime}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 style={{ width: 14, height: 14, color: '#2A9D8F', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#2A9D8F' }}>
                      Thời lượng: <strong>{dur}</strong> / buổi
                      {form.startTime && form.endTime && (
                        <span style={{ color: '#9CA3AF' }}>
                          {' '}· {fmtTime(form.startTime)} – {fmtTime(form.endTime)}
                        </span>
                      )}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* ── Thứ học chips ── */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <CalendarDays style={{ width: 14, height: 14, color: '#F4A261' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Lịch học trong tuần</span>
                </div>
                {form.days.length > 0 && (
                  <span
                    className="px-2.5 py-1 rounded-full"
                    style={{ fontSize: 11, fontWeight: 800, background: 'rgba(14,124,123,0.1)', color: '#0E7C7B' }}
                  >
                    {form.days.length} ngày/tuần
                  </span>
                )}
              </div>

              {/* Day chip grid */}
              <div className="flex gap-2">
                {DAYS.map(day => {
                  const active = form.days.includes(day.id);
                  return (
                    <button
                      key={day.id}
                      onClick={() => toggleDay(day.id)}
                      className="relative flex-1 flex flex-col items-center justify-center rounded-2xl active:scale-90 transition-all"
                      style={{
                        height: 52,
                        background:  active ? '#0E7C7B' : 'rgba(0,0,0,0.04)',
                        border:      `1.5px solid ${active ? '#0E7C7B' : 'rgba(0,0,0,0.09)'}`,
                        boxShadow:   active ? '0 4px 14px rgba(14,124,123,0.35)' : 'none',
                        transition:  'all 0.18s ease',
                      }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 900, color: active ? 'white' : '#6B7280', lineHeight: 1 }}>
                        {day.label}
                      </span>
                      {active && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                             style={{ background: '#2A9D8F', border: '2px solid white' }}>
                          <span style={{ fontSize: 8, color: 'white', fontWeight: 900 }}>✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Selected summary */}
              {selectedDayFull && (
                <div
                  className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl"
                  style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}
                >
                  <CalendarDays style={{ width: 13, height: 13, color: '#0E7C7B', flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: '#0E7C7B', lineHeight: 1.5 }}>
                    <strong>{selectedDayFull}</strong>
                    {dur && !errors.endTime && form.startTime && (
                      <span style={{ color: '#6B7280', fontWeight: 400 }}>
                        {' '}· {fmtTime(form.startTime)}–{fmtTime(form.endTime)} ({dur})
                      </span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────
            SECTION 3 — ĐỊA ĐIỂM & COACH
        ─────────────────────────────────────── */}
        <div>
          <Sec
            n={3} color="#2A9D8F" icon={<User2 />}
            title="Địa điểm & Huấn luyện viên"
            done={!!form.coach && !!form.court}
          />
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Coach */}
            <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Coach phụ trách">
                <div className="relative">
                  <User2
                    style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                             width: 15, height: 15, color: form.coach ? '#2A9D8F' : '#9CA3AF', pointerEvents: 'none' }}
                  />
                  <ChevronDown
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                             width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }}
                  />
                  <select
                    value={form.coach}
                    onChange={e => set('coach', e.target.value)}
                    className="w-full appearance-none rounded-xl focus:outline-none transition-all"
                    style={{
                      fontSize: 14, fontWeight: form.coach ? 700 : 400,
                      color:    form.coach ? '#1F2933' : '#9CA3AF',
                      background: form.coach ? 'rgba(42,157,143,0.07)' : 'rgba(0,0,0,0.04)',
                      border: `1.5px solid ${form.coach ? 'rgba(42,157,143,0.3)' : 'rgba(0,0,0,0.09)'}`,
                      padding: '12px 40px',
                    }}
                  >
                    <option value="">Coach Nam</option>
                    {COACHES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </Field>
            </div>

            {/* Sân học */}
            <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Sân học">
                <div className="grid grid-cols-4 gap-2">
                  {COURTS.map(court => {
                    const active = form.court === court;
                    return (
                      <button
                        key={court}
                        onClick={() => set('court', active ? '' : court)}
                        className="py-3 rounded-xl active:scale-90 transition-all flex flex-col items-center gap-1"
                        style={{
                          background: active ? 'rgba(42,157,143,0.1)'  : 'rgba(0,0,0,0.04)',
                          border:     `1.5px solid ${active ? 'rgba(42,157,143,0.4)' : 'rgba(0,0,0,0.09)'}`,
                          boxShadow:  active ? '0 3px 12px rgba(42,157,143,0.2)' : 'none',
                        }}
                      >
                        <MapPin style={{ width: 14, height: 14, color: active ? '#2A9D8F' : '#9CA3AF' }} />
                        <span style={{ fontSize: 12, fontWeight: 800, color: active ? '#2A9D8F' : '#6B7280' }}>
                          {court}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            {/* Số học viên tối đa */}
            <div className="px-4 py-4">
              <Field label="Số học viên tối đa" hint="1–50">
                <div className="flex items-center gap-3">
                  {/* minus */}
                  <button
                    onClick={() => set('maxStudents', clampStudents(form.maxStudents - 1))}
                    disabled={form.maxStudents <= 1}
                    className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
                    style={{
                      background:  form.maxStudents > 1 ? 'rgba(14,124,123,0.09)' : 'rgba(0,0,0,0.04)',
                      border:      `1.5px solid ${form.maxStudents > 1 ? 'rgba(14,124,123,0.25)' : 'rgba(0,0,0,0.09)'}`,
                    }}
                  >
                    <Minus style={{ width: 16, height: 16, color: form.maxStudents > 1 ? '#0E7C7B' : '#D1D5DB' }} />
                  </button>

                  {/* value + label */}
                  <div className="flex-1 flex flex-col items-center rounded-xl py-2.5"
                       style={{ background: 'rgba(14,124,123,0.06)', border: '1.5px solid rgba(14,124,123,0.15)' }}>
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: 26, fontWeight: 900, color: '#0E7C7B', lineHeight: 1 }}>
                        {form.maxStudents}
                      </span>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>học viên</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1.5">
                      {/* mini progress dots */}
                      {[...Array(Math.min(10, form.maxStudents))].map((_, i) => (
                        <div key={i}
                             className="w-1.5 h-1.5 rounded-full"
                             style={{ background: '#0E7C7B', opacity: 0.3 + (i / 10 * 0.7) }} />
                      ))}
                      {form.maxStudents > 10 && (
                        <span style={{ fontSize: 10, color: '#9CA3AF' }}>+{form.maxStudents - 10}</span>
                      )}
                    </div>
                  </div>

                  {/* plus */}
                  <button
                    onClick={() => set('maxStudents', clampStudents(form.maxStudents + 1))}
                    disabled={form.maxStudents >= 50}
                    className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
                    style={{
                      background: form.maxStudents < 50 ? 'rgba(14,124,123,0.09)' : 'rgba(0,0,0,0.04)',
                      border:     `1.5px solid ${form.maxStudents < 50 ? 'rgba(14,124,123,0.25)' : 'rgba(0,0,0,0.09)'}`,
                    }}
                  >
                    <Plus style={{ width: 16, height: 16, color: form.maxStudents < 50 ? '#0E7C7B' : '#D1D5DB' }} />
                  </button>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────
            SECTION 4 — TRẠNG THÁI & GHI CHÚ
        ─────────────────────────────────────── */}
        <div>
          <Sec
            n={4} color="#E9C46A" icon={<ToggleLeft />}
            title="Trạng thái & Ghi chú"
            done
          />
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Trạng thái */}
            <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Trạng thái lớp">
                <div className="grid grid-cols-2 gap-2.5">
                  {STATUS_OPTIONS.map(opt => {
                    const active = form.status === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => set('status', opt.id)}
                        className="relative flex flex-col items-start p-3.5 rounded-2xl active:scale-95 transition-all"
                        style={{
                          background: active ? opt.bg     : 'rgba(0,0,0,0.03)',
                          border:     `1.5px solid ${active ? opt.color + '55' : 'rgba(0,0,0,0.09)'}`,
                          boxShadow:  active ? `0 4px 14px ${opt.color}1A` : 'none',
                        }}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <div className="w-2 h-2 rounded-full flex-shrink-0"
                               style={{ background: active ? opt.color : '#D1D5DB' }} />
                          {active && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                                 style={{ background: opt.color }}>
                              <span style={{ fontSize: 10, color: 'white', fontWeight: 900 }}>✓</span>
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: active ? opt.color : '#6B7280' }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: 11, color: active ? opt.color + 'AA' : '#9CA3AF', marginTop: 2 }}>
                          {opt.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            {/* Ghi chú */}
            <div className="px-4 py-4">
              <Field label="Ghi chú" hint="Tùy chọn">
                <div className="relative rounded-2xl overflow-hidden"
                     style={{ border: `1.5px solid ${form.notes ? 'rgba(14,124,123,0.25)' : 'rgba(0,0,0,0.09)'}`, transition: 'border-color 0.2s' }}>
                  <FileText
                    style={{ position: 'absolute', top: 12, left: 12, width: 14, height: 14,
                             color: form.notes ? '#0E7C7B' : '#9CA3AF', pointerEvents: 'none' }}
                  />
                  <textarea
                    value={form.notes}
                    onChange={e => set('notes', e.target.value)}
                    rows={3}
                    maxLength={300}
                    placeholder="Yêu cầu đặc biệt, mục tiêu lớp học, quy định..."
                    className="w-full resize-none focus:outline-none"
                    style={{
                      fontSize: 14, color: '#1F2933',
                      background: form.notes ? 'rgba(14,124,123,0.03)' : '#FAFAFA',
                      padding: '12px 12px 8px 34px',
                      lineHeight: 1.65,
                    }}
                  />
                  {form.notes && (
                    <div className="flex justify-end px-3 pb-2" style={{ background: 'rgba(14,124,123,0.03)' }}>
                      <span style={{ fontSize: 11, color: form.notes.length > 260 ? '#E76F51' : '#9CA3AF', fontWeight: 600 }}>
                        {form.notes.length}/300
                      </span>
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────
            LIVE PREVIEW (if name filled)
        ─────────────────────────────────────── */}
        {form.name.trim() && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border:     `1.5px solid ${levelCfg ? levelCfg.color + '40' : 'rgba(14,124,123,0.25)'}`,
              background: levelCfg ? levelCfg.bg : 'rgba(14,124,123,0.05)',
              boxShadow:  `0 4px 20px ${levelCfg ? levelCfg.color + '18' : 'rgba(14,124,123,0.12)'}`,
            }}
          >
            {/* preview header */}
            <div className="px-4 py-3 flex items-center gap-2"
                 style={{ borderBottom: `1px solid ${levelCfg ? levelCfg.color + '20' : 'rgba(14,124,123,0.12)'}` }}>
              <Sparkles style={{ width: 13, height: 13, color: levelCfg?.color ?? '#0E7C7B' }} />
              <span style={{ fontSize: 11, fontWeight: 800, color: levelCfg?.color ?? '#0E7C7B', letterSpacing: '0.04em' }}>
                XEM TRƯỚC LỚP HỌC
              </span>
            </div>

            <div className="px-4 py-4">
              <div className="flex items-start gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: levelCfg ? levelCfg.color + '22' : 'rgba(14,124,123,0.15)' }}
                >
                  <BookOpen style={{ width: 20, height: 20, color: levelCfg?.color ?? '#0E7C7B' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 17, fontWeight: 900, color: '#1F2933', lineHeight: 1.2 }}>
                    {form.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {levelCfg && (
                      <span className="px-2 py-0.5 rounded-full"
                            style={{ fontSize: 10, fontWeight: 800, background: levelCfg.color + '25', color: levelCfg.color }}>
                        {levelCfg.label}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full"
                          style={{
                            fontSize: 10, fontWeight: 800,
                            background: form.status === 'open' ? 'rgba(42,157,143,0.18)' : 'rgba(233,196,106,0.25)',
                            color:      form.status === 'open' ? '#2A9D8F' : '#92620A',
                          }}>
                      {form.status === 'open' ? 'Đang mở' : 'Tạm ngưng'}
                    </span>
                  </div>
                </div>
              </div>

              {/* meta row */}
              <div className="flex flex-wrap gap-3 mt-3.5">
                {selectedDayShort && (
                  <div className="flex items-center gap-1.5">
                    <CalendarDays style={{ width: 12, height: 12, color: '#6B7280' }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{selectedDayShort}</span>
                  </div>
                )}
                {form.startTime && form.endTime && !errors.endTime && (
                  <div className="flex items-center gap-1.5">
                    <Clock style={{ width: 12, height: 12, color: '#6B7280' }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>
                      {fmtTime(form.startTime)}–{fmtTime(form.endTime)}
                      {dur && <span style={{ color: levelCfg?.color ?? '#0E7C7B' }}> ({dur})</span>}
                    </span>
                  </div>
                )}
                {form.court && (
                  <div className="flex items-center gap-1.5">
                    <MapPin style={{ width: 12, height: 12, color: '#6B7280' }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{form.court}</span>
                  </div>
                )}
                {form.coach && (
                  <div className="flex items-center gap-1.5">
                    <User2 style={{ width: 12, height: 12, color: '#6B7280' }} />
                    <span style={{ fontSize: 12, color: '#6B7280' }}>{form.coach}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Users style={{ width: 12, height: 12, color: '#6B7280' }} />
                  <span style={{ fontSize: 12, color: '#6B7280' }}>Tối đa {form.maxStudents} HV</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ FOOTER — FIXED ══ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-20 max-w-[390px] mx-auto"
        style={{
          background:  'white',
          borderTop:   '1px solid rgba(0,0,0,0.09)',
          paddingLeft:  16, paddingRight: 16,
          paddingTop:   12, paddingBottom: 28,
          boxShadow:   '0 -6px 24px rgba(0,0,0,0.08)',
        }}
      >
        {/* validation summary (if triggered) */}
        {(errors.name || errors.endTime) && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
            style={{ background: 'rgba(231,111,81,0.08)', border: '1.5px solid rgba(231,111,81,0.25)' }}
          >
            <AlertCircle style={{ width: 14, height: 14, color: '#E76F51', flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: '#C85A3D' }}>
              {errors.name || errors.endTime}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {/* Cancel */}
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 rounded-2xl active:scale-95 transition-all"
            style={{
              width: 96, flexShrink: 0,
              paddingTop: 15, paddingBottom: 15,
              border: '1.5px solid rgba(0,0,0,0.12)',
              background: 'rgba(0,0,0,0.04)',
              fontSize: 14, fontWeight: 700, color: '#6B7280',
            }}
          >
            <X style={{ width: 15, height: 15 }} />
            Hủy
          </button>

          {/* Save */}
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-between px-5 rounded-2xl active:scale-[0.98] transition-all"
            style={{
              paddingTop: 15, paddingBottom: 15,
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow:  '0 8px 24px rgba(14,124,123,0.40)',
            }}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'rgba(255,255,255,0.2)' }}>
                <Save style={{ width: 16, height: 16, color: 'white' }} />
              </div>
              <div className="text-left">
                <p style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Lưu lớp học</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)' }}>
                  {form.name.trim() ? form.name : 'Chưa có tên lớp'}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                 style={{ background: 'rgba(255,255,255,0.18)' }}>
              <CheckCircle2 style={{ width: 14, height: 14, color: 'white' }} />
            </div>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fieldShake {
          0%,100% { transform:translateX(0);  }
          20%     { transform:translateX(-6px);}
          40%     { transform:translateX(5px); }
          60%     { transform:translateX(-4px);}
          80%     { transform:translateX(3px); }
        }
      `}</style>
    </div>
  );
}
