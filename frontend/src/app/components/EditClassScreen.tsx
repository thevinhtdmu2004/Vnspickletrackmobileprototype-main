import {
  ArrowLeft, Save, X, AlertCircle, BookOpen,
  Trophy, User2, MapPin, Clock, CalendarDays,
  FileText, ChevronDown, CheckCircle2,
  Users, Minus, Plus, PauseCircle, AlertTriangle,
  RotateCcw, ChevronRight, Pen
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface EditClassScreenProps {
  onBack:    () => void;
  onSave:    () => void;
  onSuspend?: () => void;
}

/* ─── Config ────────────────────────────────────────────── */
const LEVEL_OPTIONS = [
  { value: 'beginner',     label: 'Cơ bản',   sub: 'Mới bắt đầu',    color: '#2A9D8F', bg: 'rgba(42,157,143,0.11)'  },
  { value: 'intermediate', label: 'Trung cấp', sub: 'Có kinh nghiệm', color: '#F4A261', bg: 'rgba(244,162,97,0.11)'  },
  { value: 'advanced',     label: 'Nâng cao',  sub: 'Chuyên nghiệp',  color: '#E76F51', bg: 'rgba(231,111,81,0.11)'  },
];
const STATUS_OPTIONS = [
  { id: 'open',   label: 'Đang mở',   desc: 'Nhận học viên mới',  color: '#2A9D8F', bg: 'rgba(42,157,143,0.11)'  },
  { id: 'paused', label: 'Tạm ngưng', desc: 'Tạm dừng hoạt động', color: '#E9C46A', bg: 'rgba(233,196,106,0.15)' },
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

/* ─── Pre-filled data (Beginner A) ──────────────────────── */
const INITIAL = {
  name:        'Beginner A',
  level:       'beginner'  as 'beginner' | 'intermediate' | 'advanced',
  coach:       'Coach Nam',
  court:       'Sân 1',
  startTime:   '18:00',
  endTime:     '19:30',
  days:        [1, 3, 5],
  maxStudents: 10,
  status:      'open'      as 'open' | 'paused',
  notes:       '',
};

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
function durLabel(s: string, e: string) {
  if (!s || !e) return null;
  const d = toMin(e) - toMin(s);
  if (d <= 0) return null;
  const h = Math.floor(d / 60), m = d % 60;
  return h > 0 ? `${h}h${m > 0 ? m + 'p' : ''}` : `${m}p`;
}
function daysEqual(a: number[], b: number[]) {
  return JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
}

/* ══════════════════════════════════════════════════════════
   SUSPEND BOTTOM SHEET
══════════════════════════════════════════════════════════ */
function SuspendDialog({
  visible, className, onClose, onConfirm,
}: {
  visible: boolean; className: string;
  onClose: () => void; onConfirm: () => void;
}) {
  const [mounted,  setMounted]  = useState(false);
  const [show,     setShow]     = useState(false);
  const [btnReady, setBtnReady] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      setBtnReady(false);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        setShow(true);
        setTimeout(() => setBtnReady(true), 850);
      }));
    } else {
      setShow(false);
      const t = setTimeout(() => setMounted(false), 340);
      return () => clearTimeout(t);
    }
  }, [visible]);

  if (!mounted) return null;

  return (
    <>
      <div className="fixed inset-0 z-40"
           style={{ background: 'rgba(10,20,35,0.58)', backdropFilter: 'blur(6px)',
                    opacity: show ? 1 : 0, transition: 'opacity 0.3s ease' }}
           onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50 max-w-[390px] mx-auto flex flex-col"
           style={{
             background: 'white', borderRadius: '28px 28px 0 0',
             boxShadow: '0 -10px 60px rgba(0,0,0,0.22)',
             transform: show ? 'translateY(0)' : 'translateY(105%)',
             transition: 'transform 0.4s cubic-bezier(0.32,0.72,0,1)',
             maxHeight: '86vh',
           }}>

        {/* accent strip — amber/orange for warning */}
        <div style={{ height: 4, background: 'linear-gradient(90deg,#E9C46A,#F4A261,#F4A26155)', borderRadius: '28px 28px 0 0' }} />

        {/* handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: 'rgba(0,0,0,0.14)' }} />
        </div>

        {/* close */}
        <button onClick={onClose}
                className="absolute top-5 right-4 w-9 h-9 rounded-xl flex items-center justify-center active:scale-90"
                style={{ background: 'rgba(0,0,0,0.06)' }}>
          <X style={{ width: 17, height: 17, color: '#6B7280' }} />
        </button>

        <div className="flex-1 overflow-y-auto px-5 pb-2">
          {/* hero */}
          <div className="flex flex-col items-center pt-4 pb-5">
            <div className="relative flex items-center justify-center mb-4" style={{ width: 88, height: 88 }}>
              {[88, 66].map((s, n) => (
                <div key={n} className="absolute rounded-full"
                     style={{ width: s, height: s,
                              border: `1.5px solid rgba(233,196,106,${n === 0 ? 0.2 : 0.35})`,
                              background: n === 1 ? 'rgba(233,196,106,0.1)' : 'transparent',
                              animation: show ? `suspendPulse 2s ease-out ${n * 0.35}s infinite` : 'none' }} />
              ))}
              <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center"
                   style={{ background: 'rgba(233,196,106,0.18)', border: '1.5px solid rgba(233,196,106,0.4)',
                            boxShadow: '0 4px 18px rgba(233,196,106,0.25)',
                            transform: show ? 'scale(1)' : 'scale(0.4)',
                            opacity:   show ? 1 : 0,
                            transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.08s, opacity 0.3s ease 0.08s' }}>
                <PauseCircle style={{ width: 28, height: 28, color: '#A07B10' }} />
              </div>
            </div>

            {/* badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full mb-3"
                 style={{ background: 'rgba(233,196,106,0.15)', border: '1.5px solid rgba(233,196,106,0.4)',
                          opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(8px)',
                          transition: 'all 0.38s ease 0.22s' }}>
              <span className="w-2 h-2 rounded-full" style={{ background: '#E9C46A' }} />
              <span style={{ fontSize: 10, fontWeight: 900, color: '#92620A', letterSpacing: '0.05em' }}>
                TẠM NGƯNG HOẠT ĐỘNG
              </span>
            </div>

            <h2 style={{ fontSize: 21, fontWeight: 900, color: '#1F2933', textAlign: 'center', marginBottom: 8,
                         opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(10px)',
                         transition: 'all 0.38s ease 0.28s' }}>
              Tạm ngưng lớp học?
            </h2>
            <p style={{ fontSize: 14, color: '#4B5563', textAlign: 'center', lineHeight: 1.65, maxWidth: 290,
                        opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(8px)',
                        transition: 'all 0.38s ease 0.34s' }}>
              Bạn muốn tạm ngưng lớp{' '}
              <strong style={{ color: '#1F2933' }}>{className}</strong>?
            </p>
          </div>

          {/* warning box */}
          <div className="rounded-2xl p-4 mb-5"
               style={{ background: 'rgba(233,196,106,0.11)', border: '1.5px solid rgba(233,196,106,0.4)',
                        opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(10px)',
                        transition: 'all 0.4s ease 0.4s' }}>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background: 'rgba(233,196,106,0.28)' }}>
                <AlertTriangle style={{ width: 17, height: 17, color: '#A07B10' }} />
              </div>
              <div className="flex-1">
                <p style={{ fontSize: 12, fontWeight: 900, color: '#92620A', letterSpacing: '0.03em', marginBottom: 6 }}>
                  ẢNH HƯỞNG KHI NGƯNG LỚP
                </p>
                <div className="space-y-1.5">
                  {[
                    'Lớp sẽ không hiển thị để đăng ký mới',
                    'Các buổi học đã lên lịch vẫn còn lưu',
                    'Học viên hiện tại không bị xóa',
                    'Bạn có thể mở lại lớp bất cứ lúc nào',
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5" style={{ background: i === 3 ? '#2A9D8F' : '#E9C46A' }} />
                      <span style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* buttons */}
        <div className="px-5 pb-8 pt-4 flex flex-col gap-2.5"
             style={{ borderTop: '1px solid rgba(0,0,0,0.07)', background: 'white',
                      opacity: show ? 1 : 0, transform: show ? 'translateY(0)' : 'translateY(10px)',
                      transition: 'all 0.4s ease 0.52s' }}>

          {/* Safe */}
          <button onClick={onClose}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.98] transition-all"
                  style={{ background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)', boxShadow: '0 8px 24px rgba(14,124,123,0.38)' }}>
            <ChevronRight style={{ width: 15, height: 15, color: 'white', transform: 'rotate(180deg)' }} />
            <span style={{ fontSize: 15, fontWeight: 800, color: 'white' }}>Không — Tiếp tục mở lớp</span>
          </button>

          {/* Confirm danger */}
          <div className="relative">
            {!btnReady && (
              <div className="absolute inset-0 rounded-2xl z-10 flex items-center justify-center gap-2.5"
                   style={{ background: 'rgba(233,196,106,0.1)', border: '1.5px dashed rgba(233,196,106,0.4)', backdropFilter: 'blur(1px)' }}>
                <div className="h-1 rounded-full overflow-hidden" style={{ width: 110, background: 'rgba(233,196,106,0.2)' }}>
                  <div className="h-full rounded-full" style={{ background: '#E9C46A', animation: 'suspendUnlock 0.85s linear forwards' }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#92620A' }}>Chờ xác nhận...</span>
              </div>
            )}
            <button onClick={() => btnReady && onConfirm()}
                    disabled={!btnReady}
                    className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.98] transition-all"
                    style={{
                      background:  btnReady ? 'rgba(233,196,106,0.15)' : 'rgba(233,196,106,0.05)',
                      border:      `1.5px solid ${btnReady ? 'rgba(233,196,106,0.5)' : 'transparent'}`,
                      opacity:     btnReady ? 1 : 0,
                      transition:  'all 0.35s ease',
                    }}>
              <PauseCircle style={{ width: 16, height: 16, color: '#92620A' }} />
              <span style={{ fontSize: 14, fontWeight: 800, color: '#92620A' }}>Xác nhận tạm ngưng</span>
            </button>
          </div>

          <p style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center' }}>
            Bạn có thể <strong style={{ color: '#0E7C7B' }}>mở lại lớp</strong> trong phần Cài đặt lớp học.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes suspendPulse {
          0%   { transform:scale(1);   opacity:0.75; }
          100% { transform:scale(1.5); opacity:0;    }
        }
        @keyframes suspendUnlock {
          from { width:0% } to { width:100% }
        }
      `}</style>
    </>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════════════════ */
export function EditClassScreen({ onBack, onSave, onSuspend }: EditClassScreenProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({ ...INITIAL, days: [...INITIAL.days] });
  const [errors,      setErrors]      = useState({ name: '', endTime: '' });
  const [touched,     setTouched]     = useState({ name: false, endTime: false });
  const [shake,       setShake]       = useState(false);
  const [showSuspend, setShowSuspend] = useState(false);
  const [suspended,   setSuspended]   = useState(false);

  /* ── change tracking ── */
  const changed = {
    name:      form.name        !== INITIAL.name,
    level:     form.level       !== INITIAL.level,
    coach:     form.coach       !== INITIAL.coach,
    court:     form.court       !== INITIAL.court,
    startTime: form.startTime   !== INITIAL.startTime,
    endTime:   form.endTime     !== INITIAL.endTime,
    days:      !daysEqual(form.days, INITIAL.days),
    maxStudents: form.maxStudents !== INITIAL.maxStudents,
    status:    form.status      !== INITIAL.status,
    notes:     form.notes       !== INITIAL.notes,
  };
  const changedCount = Object.values(changed).filter(Boolean).length;

  const sec1Changed = changed.name  || changed.level;
  const sec2Changed = changed.startTime || changed.endTime || changed.days;
  const sec3Changed = changed.coach || changed.court || changed.maxStudents;
  const sec4Changed = changed.status || changed.notes;

  /* ── derived ── */
  const dur = durLabel(form.startTime, form.endTime);
  const selectedDayFull  = DAYS.filter(d => form.days.includes(d.id)).map(d => d.full).join(', ');
  const selectedDayShort = DAYS.filter(d => form.days.includes(d.id)).map(d => d.label).join(' · ');
  const levelCfg         = LEVEL_OPTIONS.find(l => l.value === form.level);

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
    if (field === 'name')    setErrors(e => ({ ...e, name:    validateName(form.name) }));
    if (field === 'endTime') setErrors(e => ({ ...e, endTime: validateEndTime(form.startTime, form.endTime) }));
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

  const handleConfirmSuspend = () => {
    setForm(f => ({ ...f, status: 'paused' }));
    setShowSuspend(false);
    setSuspended(true);
    onSuspend?.();
  };

  const handleReset = () => {
    setForm({ ...INITIAL, days: [...INITIAL.days] });
    setErrors({ name: '', endTime: '' });
    setTouched({ name: false, endTime: false });
    setSuspended(false);
  };

  /* ─── sub-components ─── */
  const ChangeDot = ({ show }: { show: boolean }) =>
    show ? (
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#F4A261' }} />
    ) : null;

  const Sec = ({ n, color, icon, title, sectionChanged }: {
    n: number; color: string; icon?: React.ReactNode; title: string; sectionChanged?: boolean;
  }) => (
    <div className="flex items-center gap-2.5 mb-3">
      <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
           style={{ background: color + '1A' }}>
        <span style={{ fontSize: 11, fontWeight: 800, color }}>{n}</span>
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color: '#6B7280', letterSpacing: '0.05em', textTransform: 'uppercase' as const }}>
        {title}
      </span>
      {sectionChanged && (
        <span className="px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{ fontSize: 10, fontWeight: 800, background: 'rgba(244,162,97,0.15)', color: '#C97B38', border: '1px solid rgba(244,162,97,0.35)' }}>
          <Pen style={{ width: 9, height: 9 }} /> Đã sửa
        </span>
      )}
      <div className="flex-1 h-px" style={{ background: color + '25' }} />
    </div>
  );

  const Field = ({ label, required, hint, error, changed: fieldChanged, children }: {
    label: string; required?: boolean; hint?: string; error?: string; changed?: boolean; children: React.ReactNode;
  }) => (
    <div>
      <div className="flex items-center gap-1.5 mb-2">
        <span style={{ fontSize: 13, fontWeight: 700, color: error ? '#E76F51' : '#374151' }}>{label}</span>
        {required && <span style={{ color: '#E76F51', fontSize: 13, lineHeight: 1 }}>*</span>}
        {fieldChanged && <ChangeDot show />}
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
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background: 'linear-gradient(150deg,#054A49 0%,#075E5D 45%,#0E7C7B 100%)' }}>
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.05)' }} />
        <div className="absolute top-2 right-6 w-20 h-20 rounded-full pointer-events-none" style={{ background: 'rgba(255,255,255,0.03)' }} />

        <div className="relative px-4 pt-12 pb-4">
          {/* top row */}
          <div className="flex items-center gap-3 mb-3">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                    style={{ background: 'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>CHỈNH SỬA</p>
                {changedCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full"
                        style={{ fontSize: 10, fontWeight: 800, background: 'rgba(244,162,97,0.3)', color: '#FFD580', border: '1px solid rgba(244,162,97,0.4)' }}>
                    {changedCount} thay đổi
                  </span>
                )}
              </div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: 'white', lineHeight: 1.15 }}>
                Sửa lớp học
              </h1>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600, marginTop: 1 }}>
                {INITIAL.name}
              </p>
            </div>
            {/* reset button */}
            {changedCount > 0 && (
              <button onClick={handleReset}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl active:scale-95 transition-all"
                      style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <RotateCcw style={{ width: 13, height: 13, color: 'rgba(255,255,255,0.8)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Hoàn tác</span>
              </button>
            )}
          </div>

          {/* change progress bar */}
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div className="h-full rounded-full"
                 style={{ width: changedCount > 0 ? `${Math.min(100, changedCount * 12)}%` : '0%',
                          background: 'rgba(244,162,97,0.85)',
                          transition: 'width 0.4s ease' }} />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              {changedCount === 0 ? 'Chưa có thay đổi' : `${changedCount}/10 trường đã chỉnh sửa`}
            </p>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ color: '#FFC9C9' }}>*</span> bắt buộc: Tên lớp
            </p>
          </div>
        </div>
      </div>

      {/* ══ SUSPENDED BANNER ══ */}
      {suspended && (
        <div className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3 flex-shrink-0"
             style={{ background: 'rgba(233,196,106,0.13)', border: '1.5px solid rgba(233,196,106,0.4)' }}>
          <PauseCircle style={{ width: 18, height: 18, color: '#92620A', flexShrink: 0 }} />
          <div className="flex-1">
            <p style={{ fontSize: 13, fontWeight: 800, color: '#92620A' }}>Lớp đã được đánh dấu tạm ngưng</p>
            <p style={{ fontSize: 11, color: '#A07B10' }}>Nhớ nhấn "Lưu thay đổi" để áp dụng.</p>
          </div>
          <button onClick={() => { setSuspended(false); setForm(f => ({ ...f, status: 'open' })); }}
                  className="px-2.5 py-1.5 rounded-xl active:scale-95"
                  style={{ background: 'rgba(233,196,106,0.2)', fontSize: 11, fontWeight: 700, color: '#92620A' }}>
            Hoàn tác
          </button>
        </div>
      )}

      {/* ══ SCROLLABLE FORM ══ */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-40 px-4 pt-4 space-y-5">

        {/* ── SECTION 1 ── */}
        <div>
          <Sec n={1} color="#0E7C7B" title="Thông tin cơ bản" sectionChanged={sec1Changed} />
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{
                 border: errors.name ? '1.5px solid rgba(231,111,81,0.35)' : sec1Changed ? '1.5px solid rgba(244,162,97,0.35)' : '1.5px solid rgba(0,0,0,0.09)',
                 boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                 animation: shake && errors.name ? 'fieldShake 0.5s ease' : 'none',
               }}>

            {/* Tên lớp */}
            <div className="px-4 pt-4 pb-3.5" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Tên lớp" required error={errors.name} changed={changed.name}>
                <div className="relative">
                  <BookOpen style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
                                     width: 16, height: 16, color: errors.name ? '#E76F51' : '#0E7C7B' }} />
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    className="w-full pl-7 pr-0 py-2 bg-transparent focus:outline-none"
                    style={{
                      fontSize: 16, fontWeight: 700, color: '#1F2933',
                      borderBottom: `2px solid ${errors.name ? '#E76F51' : changed.name ? '#F4A261' : form.name ? '#0E7C7B' : 'rgba(0,0,0,0.1)'}`,
                      transition: 'border-color 0.2s',
                    }}
                  />
                  {changed.name && !errors.name && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded"
                          style={{ fontSize: 10, fontWeight: 800, background: 'rgba(244,162,97,0.15)', color: '#C97B38' }}>
                      Đã sửa
                    </span>
                  )}
                </div>
              </Field>
            </div>

            {/* Trình độ */}
            <div className="px-4 py-4">
              <Field label="Trình độ" hint="Chọn một" changed={changed.level}>
                <div className="grid grid-cols-3 gap-2">
                  {LEVEL_OPTIONS.map(opt => {
                    const active = form.level === opt.value;
                    return (
                      <button key={opt.value} onClick={() => set('level', opt.value)}
                              className="relative flex flex-col items-center py-3 px-2 rounded-2xl active:scale-95 transition-all"
                              style={{
                                background: active ? opt.bg : 'rgba(0,0,0,0.03)',
                                border:     `1.5px solid ${active ? opt.color + '55' : 'rgba(0,0,0,0.09)'}`,
                                boxShadow:  active ? `0 4px 14px ${opt.color}22` : 'none',
                              }}>
                        <div className="w-7 h-7 rounded-xl flex items-center justify-center mb-1.5"
                             style={{ background: active ? opt.color : 'rgba(0,0,0,0.06)' }}>
                          <Trophy style={{ width: 13, height: 13, color: active ? 'white' : '#9CA3AF' }} />
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 800, color: active ? opt.color : '#6B7280', lineHeight: 1.2 }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: 10, color: active ? opt.color + 'BB' : '#9CA3AF', marginTop: 2 }}>
                          {opt.sub}
                        </span>
                        {active && (
                          <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
                               style={{ background: opt.color, border: '2px solid white' }}>
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

        {/* ── SECTION 2 ── */}
        <div>
          <Sec n={2} color="#F4A261" title="Lịch học & Thời gian" sectionChanged={sec2Changed} />
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: sec2Changed ? '1.5px solid rgba(244,162,97,0.3)' : '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* giờ */}
            <div className="grid grid-cols-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              {[
                { field: 'startTime', label: 'Giờ bắt đầu', val: form.startTime, err: false,         chg: changed.startTime },
                { field: 'endTime',   label: 'Giờ kết thúc', val: form.endTime,  err: !!errors.endTime, chg: changed.endTime   },
              ].map((f, i) => (
                <div key={f.field} className="px-4 py-4"
                     style={{ borderRight: i === 0 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Clock style={{ width: 13, height: 13, color: f.err ? '#E76F51' : '#F4A261' }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: f.err ? '#E76F51' : '#374151' }}>{f.label}</span>
                    {f.chg && <ChangeDot show />}
                  </div>
                  <input type="time" value={f.val}
                         onChange={e => set(f.field, e.target.value)}
                         onBlur={f.field === 'endTime' ? () => handleBlur('endTime') : undefined}
                         className="w-full rounded-xl focus:outline-none"
                         style={{
                           fontSize: 18, fontWeight: 900,
                           color:      f.err ? '#E76F51' : f.chg ? '#C97B38' : f.val ? '#0E7C7B' : '#9CA3AF',
                           background: f.err ? 'rgba(231,111,81,0.07)' : f.chg ? 'rgba(244,162,97,0.08)' : f.val ? 'rgba(14,124,123,0.06)' : 'rgba(0,0,0,0.04)',
                           border:     `1.5px solid ${f.err ? 'rgba(231,111,81,0.4)' : f.chg ? 'rgba(244,162,97,0.35)' : f.val ? 'rgba(14,124,123,0.3)' : 'rgba(0,0,0,0.09)'}`,
                           padding: '10px 10px',
                         }} />
                </div>
              ))}
            </div>

            {/* duration / error banner */}
            {(dur || errors.endTime) && (
              <div className="px-4 py-2.5 flex items-center gap-2"
                   style={{ background: errors.endTime ? 'rgba(231,111,81,0.07)' : 'rgba(42,157,143,0.07)', borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                {errors.endTime ? (
                  <><AlertCircle style={{ width: 14, height: 14, color: '#E76F51', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#E76F51' }}>{errors.endTime}</span></>
                ) : (
                  <><CheckCircle2 style={{ width: 14, height: 14, color: '#2A9D8F', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#2A9D8F' }}>
                      Thời lượng: <strong>{dur}</strong> / buổi
                      {form.startTime && form.endTime && (
                        <span style={{ color: '#9CA3AF' }}> · {fmtTime(form.startTime)}–{fmtTime(form.endTime)}</span>
                      )}
                    </span></>
                )}
              </div>
            )}

            {/* days */}
            <div className="px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <CalendarDays style={{ width: 14, height: 14, color: '#F4A261' }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#374151' }}>Lịch học trong tuần</span>
                  {changed.days && <ChangeDot show />}
                </div>
                {form.days.length > 0 && (
                  <span className="px-2.5 py-1 rounded-full"
                        style={{ fontSize: 11, fontWeight: 800, background: 'rgba(14,124,123,0.1)', color: '#0E7C7B' }}>
                    {form.days.length} ngày/tuần
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {DAYS.map(day => {
                  const active  = form.days.includes(day.id);
                  const wasOrig = INITIAL.days.includes(day.id);
                  const toggled = active !== wasOrig;
                  return (
                    <button key={day.id} onClick={() => toggleDay(day.id)}
                            className="relative flex-1 flex flex-col items-center justify-center rounded-2xl active:scale-90 transition-all"
                            style={{
                              height: 52,
                              background: active ? '#0E7C7B' : 'rgba(0,0,0,0.04)',
                              border:     `1.5px solid ${active ? '#0E7C7B' : toggled ? 'rgba(244,162,97,0.35)' : 'rgba(0,0,0,0.09)'}`,
                              boxShadow:  active ? '0 4px 14px rgba(14,124,123,0.35)' : 'none',
                              transition: 'all 0.18s ease',
                            }}>
                      <span style={{ fontSize: 12, fontWeight: 900, color: active ? 'white' : '#6B7280', lineHeight: 1 }}>
                        {day.label}
                      </span>
                      {toggled && !active && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full"
                             style={{ background: '#F4A261', border: '1.5px solid white' }} />
                      )}
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

              {selectedDayFull && (
                <div className="flex items-center gap-2 mt-3 px-3 py-2.5 rounded-xl"
                     style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.15)' }}>
                  <CalendarDays style={{ width: 13, height: 13, color: '#0E7C7B', flexShrink: 0 }} />
                  <p style={{ fontSize: 12, color: '#0E7C7B', lineHeight: 1.5 }}>
                    <strong>{selectedDayFull}</strong>
                    {dur && !errors.endTime && form.startTime && (
                      <span style={{ color: '#6B7280', fontWeight: 400 }}> · {fmtTime(form.startTime)}–{fmtTime(form.endTime)} ({dur})</span>
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── SECTION 3 ── */}
        <div>
          <Sec n={3} color="#2A9D8F" title="Địa điểm & Huấn luyện viên" sectionChanged={sec3Changed} />
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: sec3Changed ? '1.5px solid rgba(244,162,97,0.3)' : '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* Coach */}
            <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Coach phụ trách" changed={changed.coach}>
                <div className="relative">
                  <User2 style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                                  width: 15, height: 15, color: form.coach ? (changed.coach ? '#C97B38' : '#2A9D8F') : '#9CA3AF', pointerEvents: 'none' }} />
                  <ChevronDown style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                                       width: 16, height: 16, color: '#9CA3AF', pointerEvents: 'none' }} />
                  <select value={form.coach} onChange={e => set('coach', e.target.value)}
                          className="w-full appearance-none rounded-xl focus:outline-none"
                          style={{
                            fontSize: 14, fontWeight: form.coach ? 700 : 400,
                            color:    form.coach ? '#1F2933' : '#9CA3AF',
                            background: changed.coach ? 'rgba(244,162,97,0.07)' : form.coach ? 'rgba(42,157,143,0.07)' : 'rgba(0,0,0,0.04)',
                            border: `1.5px solid ${changed.coach ? 'rgba(244,162,97,0.35)' : form.coach ? 'rgba(42,157,143,0.3)' : 'rgba(0,0,0,0.09)'}`,
                            padding: '12px 40px',
                          }}>
                    {COACHES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </Field>
            </div>

            {/* Sân */}
            <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Sân học" changed={changed.court}>
                <div className="grid grid-cols-4 gap-2">
                  {COURTS.map(court => {
                    const active = form.court === court;
                    const isChg  = active && changed.court;
                    return (
                      <button key={court} onClick={() => set('court', active ? '' : court)}
                              className="py-3 rounded-xl active:scale-90 transition-all flex flex-col items-center gap-1"
                              style={{
                                background: active ? (isChg ? 'rgba(244,162,97,0.12)' : 'rgba(42,157,143,0.1)') : 'rgba(0,0,0,0.04)',
                                border:     `1.5px solid ${active ? (isChg ? 'rgba(244,162,97,0.45)' : 'rgba(42,157,143,0.4)') : 'rgba(0,0,0,0.09)'}`,
                              }}>
                        <MapPin style={{ width: 14, height: 14, color: active ? (isChg ? '#C97B38' : '#2A9D8F') : '#9CA3AF' }} />
                        <span style={{ fontSize: 12, fontWeight: 800, color: active ? (isChg ? '#C97B38' : '#2A9D8F') : '#6B7280' }}>
                          {court}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            {/* Số học viên */}
            <div className="px-4 py-4">
              <Field label="Số học viên tối đa" hint="1–50" changed={changed.maxStudents}>
                <div className="flex items-center gap-3">
                  <button onClick={() => set('maxStudents', clampStudents(form.maxStudents - 1))}
                          disabled={form.maxStudents <= 1}
                          className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
                          style={{ background: form.maxStudents > 1 ? 'rgba(14,124,123,0.09)' : 'rgba(0,0,0,0.04)',
                                   border: `1.5px solid ${form.maxStudents > 1 ? 'rgba(14,124,123,0.25)' : 'rgba(0,0,0,0.09)'}` }}>
                    <Minus style={{ width: 16, height: 16, color: form.maxStudents > 1 ? '#0E7C7B' : '#D1D5DB' }} />
                  </button>

                  <div className="flex-1 flex flex-col items-center rounded-xl py-2.5"
                       style={{ background: changed.maxStudents ? 'rgba(244,162,97,0.07)' : 'rgba(14,124,123,0.06)',
                                border: `1.5px solid ${changed.maxStudents ? 'rgba(244,162,97,0.3)' : 'rgba(14,124,123,0.15)'}` }}>
                    <div className="flex items-baseline gap-1">
                      <span style={{ fontSize: 26, fontWeight: 900, color: changed.maxStudents ? '#C97B38' : '#0E7C7B', lineHeight: 1 }}>
                        {form.maxStudents}
                      </span>
                      <span style={{ fontSize: 12, color: '#9CA3AF' }}>học viên</span>
                    </div>
                    {changed.maxStudents && (
                      <span style={{ fontSize: 10, color: '#C97B38', fontWeight: 700, marginTop: 2 }}>
                        (Gốc: {INITIAL.maxStudents})
                      </span>
                    )}
                  </div>

                  <button onClick={() => set('maxStudents', clampStudents(form.maxStudents + 1))}
                          disabled={form.maxStudents >= 50}
                          className="w-11 h-11 rounded-xl flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
                          style={{ background: form.maxStudents < 50 ? 'rgba(14,124,123,0.09)' : 'rgba(0,0,0,0.04)',
                                   border: `1.5px solid ${form.maxStudents < 50 ? 'rgba(14,124,123,0.25)' : 'rgba(0,0,0,0.09)'}` }}>
                    <Plus style={{ width: 16, height: 16, color: form.maxStudents < 50 ? '#0E7C7B' : '#D1D5DB' }} />
                  </button>
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* ── SECTION 4 ── */}
        <div>
          <Sec n={4} color="#E9C46A" title="Trạng thái & Ghi chú" sectionChanged={sec4Changed} />
          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: sec4Changed ? '1.5px solid rgba(244,162,97,0.3)' : '1.5px solid rgba(0,0,0,0.09)', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>

            {/* trạng thái */}
            <div className="px-4 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <Field label="Trạng thái lớp" changed={changed.status}>
                <div className="grid grid-cols-2 gap-2.5">
                  {STATUS_OPTIONS.map(opt => {
                    const active = form.status === opt.id;
                    const isChg  = active && changed.status;
                    return (
                      <button key={opt.id} onClick={() => set('status', opt.id)}
                              className="relative flex flex-col items-start p-3.5 rounded-2xl active:scale-95 transition-all"
                              style={{
                                background: active ? (isChg ? 'rgba(244,162,97,0.12)' : opt.bg) : 'rgba(0,0,0,0.03)',
                                border:     `1.5px solid ${active ? (isChg ? 'rgba(244,162,97,0.5)' : opt.color + '55') : 'rgba(0,0,0,0.09)'}`,
                              }}>
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: active ? opt.color : '#D1D5DB' }} />
                          {active && (
                            <div className="w-5 h-5 rounded-full flex items-center justify-center"
                                 style={{ background: isChg ? '#F4A261' : opt.color }}>
                              <span style={{ fontSize: 10, color: 'white', fontWeight: 900 }}>✓</span>
                            </div>
                          )}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 800, color: active ? (isChg ? '#C97B38' : opt.color) : '#6B7280' }}>
                          {opt.label}
                        </span>
                        <span style={{ fontSize: 11, color: active ? opt.color + 'AA' : '#9CA3AF', marginTop: 2 }}>
                          {opt.desc}
                        </span>
                        {isChg && (
                          <span className="mt-1.5 px-1.5 py-0.5 rounded"
                                style={{ fontSize: 9, fontWeight: 800, background: 'rgba(244,162,97,0.2)', color: '#C97B38' }}>
                            Vừa thay đổi
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>

            {/* ghi chú */}
            <div className="px-4 py-4">
              <Field label="Ghi chú" hint="Tùy chọn" changed={changed.notes}>
                <div className="relative rounded-2xl overflow-hidden"
                     style={{ border: `1.5px solid ${changed.notes ? 'rgba(244,162,97,0.35)' : form.notes ? 'rgba(14,124,123,0.25)' : 'rgba(0,0,0,0.09)'}`, transition: 'border-color 0.2s' }}>
                  <FileText style={{ position: 'absolute', top: 12, left: 12, width: 14, height: 14,
                                     color: changed.notes ? '#C97B38' : form.notes ? '#0E7C7B' : '#9CA3AF', pointerEvents: 'none' }} />
                  <textarea value={form.notes}
                            onChange={e => set('notes', e.target.value)}
                            rows={3} maxLength={300}
                            placeholder="Yêu cầu đặc biệt, mục tiêu lớp học, quy định..."
                            className="w-full resize-none focus:outline-none"
                            style={{ fontSize: 14, color: '#1F2933', background: changed.notes ? 'rgba(244,162,97,0.04)' : '#FAFAFA',
                                     padding: '12px 12px 8px 34px', lineHeight: 1.65 }} />
                  {form.notes && (
                    <div className="flex justify-end px-3 pb-2" style={{ background: changed.notes ? 'rgba(244,162,97,0.04)' : '#FAFAFA' }}>
                      <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{form.notes.length}/300</span>
                    </div>
                  )}
                </div>
              </Field>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────
            DANGER ZONE
        ─────────────────────────────────────── */}
        <div>
          {/* divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(231,111,81,0.2)' }} />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#E76F51', letterSpacing: '0.06em' }}>VÙNG NGUY HIỂM</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(231,111,81,0.2)' }} />
          </div>

          <div className="bg-white rounded-2xl overflow-hidden"
               style={{ border: '1.5px solid rgba(231,111,81,0.2)', boxShadow: '0 2px 12px rgba(231,111,81,0.07)' }}>

            {/* info row */}
            <div className="px-4 py-3.5 flex items-start gap-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#E9C46A', flexShrink: 0, marginTop: 1 }} />
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 2 }}>Tạm ngưng lớp học</p>
                <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.55 }}>
                  Lớp sẽ chuyển sang trạng thái <strong style={{ color: '#A07B10' }}>Tạm ngưng</strong>.
                  Học viên hiện tại không bị xóa. Bạn có thể mở lại bất cứ lúc nào.
                </p>
              </div>
            </div>

            {/* button row */}
            <div className="px-4 py-3.5">
              <button
                onClick={() => setShowSuspend(true)}
                disabled={form.status === 'paused'}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl active:scale-[0.98] transition-all"
                style={{
                  background: form.status === 'paused' ? 'rgba(0,0,0,0.04)' : 'rgba(233,196,106,0.1)',
                  border:     `1.5px solid ${form.status === 'paused' ? 'rgba(0,0,0,0.09)' : 'rgba(233,196,106,0.4)'}`,
                  opacity:    form.status === 'paused' ? 0.6 : 1,
                }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                       style={{ background: form.status === 'paused' ? 'rgba(0,0,0,0.06)' : 'rgba(233,196,106,0.2)' }}>
                    <PauseCircle style={{ width: 17, height: 17, color: form.status === 'paused' ? '#9CA3AF' : '#A07B10' }} />
                  </div>
                  <div className="text-left">
                    <p style={{ fontSize: 14, fontWeight: 800, color: form.status === 'paused' ? '#9CA3AF' : '#92620A' }}>
                      {form.status === 'paused' ? 'Lớp đang tạm ngưng' : 'Ngưng lớp học'}
                    </p>
                    <p style={{ fontSize: 11, color: '#9CA3AF' }}>
                      {form.status === 'paused' ? 'Đổi trạng thái ở Phần 4 để mở lại' : 'Tạm dừng nhận học viên mới'}
                    </p>
                  </div>
                </div>
                {form.status !== 'paused' && (
                  <ChevronRight style={{ width: 15, height: 15, color: '#A07B10' }} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 max-w-[390px] mx-auto"
           style={{ background: 'white', borderTop: '1px solid rgba(0,0,0,0.09)',
                    paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 28,
                    boxShadow: '0 -6px 24px rgba(0,0,0,0.08)' }}>

        {/* validation banner */}
        {(errors.name || errors.endTime) && (
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-3"
               style={{ background: 'rgba(231,111,81,0.08)', border: '1.5px solid rgba(231,111,81,0.25)' }}>
            <AlertCircle style={{ width: 14, height: 14, color: '#E76F51', flexShrink: 0 }} />
            <p style={{ fontSize: 12, color: '#C85A3D' }}>{errors.name || errors.endTime}</p>
          </div>
        )}

        {/* no changes notice */}
        {changedCount === 0 && !errors.name && !errors.endTime && (
          <div className="flex items-center gap-2 px-3 py-2 mb-3">
            <CheckCircle2 style={{ width: 13, height: 13, color: '#9CA3AF' }} />
            <p style={{ fontSize: 12, color: '#9CA3AF' }}>Chưa có thay đổi nào.</p>
          </div>
        )}

        <div className="flex gap-3">
          {/* Hủy */}
          <button onClick={onBack}
                  className="flex items-center justify-center gap-2 rounded-2xl active:scale-95 transition-all"
                  style={{ width: 96, flexShrink: 0, paddingTop: 15, paddingBottom: 15,
                           border: '1.5px solid rgba(0,0,0,0.12)', background: 'rgba(0,0,0,0.04)',
                           fontSize: 14, fontWeight: 700, color: '#6B7280' }}>
            <X style={{ width: 15, height: 15 }} /> Hủy
          </button>

          {/* Lưu thay đổi */}
          <button onClick={handleSave}
                  className="flex-1 flex items-center justify-between px-5 rounded-2xl active:scale-[0.98] transition-all"
                  style={{
                    paddingTop: 15, paddingBottom: 15,
                    background: changedCount > 0
                      ? 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)'
                      : 'rgba(0,0,0,0.08)',
                    boxShadow: changedCount > 0 ? '0 8px 24px rgba(14,124,123,0.38)' : 'none',
                    transition: 'all 0.3s ease',
                  }}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: changedCount > 0 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)' }}>
                <Save style={{ width: 15, height: 15, color: changedCount > 0 ? 'white' : '#9CA3AF' }} />
              </div>
              <div className="text-left">
                <p style={{ fontSize: 15, fontWeight: 900, color: changedCount > 0 ? 'white' : '#9CA3AF' }}>
                  Lưu thay đổi
                </p>
                <p style={{ fontSize: 10, color: changedCount > 0 ? 'rgba(255,255,255,0.65)' : '#C0C7D0' }}>
                  {changedCount > 0 ? `${changedCount} trường đã chỉnh sửa` : 'Không có thay đổi'}
                </p>
              </div>
            </div>
            {changedCount > 0 && (
              <div className="w-7 h-7 rounded-xl flex items-center justify-center"
                   style={{ background: 'rgba(255,255,255,0.18)' }}>
                <CheckCircle2 style={{ width: 13, height: 13, color: 'white' }} />
              </div>
            )}
          </button>
        </div>
      </div>

      {/* ══ SUSPEND DIALOG ══ */}
      <SuspendDialog
        visible={showSuspend}
        className={form.name || INITIAL.name}
        onClose={() => setShowSuspend(false)}
        onConfirm={handleConfirmSuspend}
      />

      <style>{`
        @keyframes fieldShake {
          0%,100% { transform:translateX(0); }
          20% { transform:translateX(-6px); }
          40% { transform:translateX(5px);  }
          60% { transform:translateX(-4px); }
          80% { transform:translateX(3px);  }
        }
      `}</style>
    </div>
  );
}
