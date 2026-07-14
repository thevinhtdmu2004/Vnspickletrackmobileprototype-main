import {
  ArrowLeft, Save, X, User, Phone, Trophy, BookOpen,
  CheckCircle2, FileText, AlertCircle, AlertTriangle,
  Minus, Plus, Lock, ChevronDown, Edit3, Info,
  ClipboardList, Sparkles
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface EditStudentScreenProps {
  onBack: () => void;
  onSave: () => void;
}

type Level  = 'beginner' | 'intermediate' | 'advanced';
type Status = 'active'   | 'paused'       | 'inactive';

/* ─── Config ─────────────────────────────────────────────── */
const CLASSES = [
  { id:'beg-a', label:'Beginner A',     sub:'T2/T4/T6 · 18:00'  },
  { id:'beg-b', label:'Beginner B',     sub:'T3/T5/T7 · 18:00'  },
  { id:'int-a', label:'Intermediate A', sub:'T2/T4/T6 · 07:00'  },
  { id:'int-b', label:'Intermediate B', sub:'T3/T5/T7 · 07:00'  },
  { id:'adv-a', label:'Advanced A',     sub:'T2/T4/T6 · 17:00'  },
];

const LEVEL_CFG: Record<Level, { label:string; color:string; bg:string; border:string }> = {
  beginner:     { label:'Cơ bản',   color:'#2A9D8F', bg:'rgba(42,157,143,0.12)',  border:'rgba(42,157,143,0.35)'  },
  intermediate: { label:'Trung cấp',color:'#F4A261', bg:'rgba(244,162,97,0.14)',  border:'rgba(244,162,97,0.4)'   },
  advanced:     { label:'Nâng cao', color:'#E76F51', bg:'rgba(231,111,81,0.12)',   border:'rgba(231,111,81,0.35)'  },
};

const STATUS_CFG: Record<Status, { label:string; color:string; bg:string; border:string; dot:string }> = {
  active:   { label:'Đang học',  color:'#1A7B6E', bg:'rgba(42,157,143,0.11)',  border:'rgba(42,157,143,0.3)',  dot:'#2A9D8F' },
  paused:   { label:'Tạm nghỉ', color:'#A07B10', bg:'rgba(233,196,106,0.18)', border:'rgba(233,196,106,0.45)', dot:'#E9C46A' },
  inactive: { label:'Đã nghỉ',  color:'#C85A3D', bg:'rgba(231,111,81,0.11)',  border:'rgba(231,111,81,0.3)',   dot:'#E76F51' },
};

/* ─── Original (read-only source of truth for diff) ─────── */
const ORIGINAL = {
  name:             'Nguyễn Văn A',
  phone:            '0912 345 678',
  level:            'beginner'    as Level,
  defaultClass:     'beg-a',
  totalSessions:    12,
  attendedSessions: 5,
  status:           'active'      as Status,
  notes:            '',
};

/* ─── Helpers ────────────────────────────────────────────── */
function initials(name: string) {
  const parts = name.trim().split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/* ══════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════ */
export function EditStudentScreen({ onBack, onSave }: EditStudentScreenProps) {

  /* ── Form state ── */
  const [form, setForm] = useState({ ...ORIGINAL });
  const [errors, setErrors] = useState({ name: '', sessions: '' });
  const [sessionFocus, setSessionFocus] = useState(false);  // highlight warning

  /* ── Computed ── */
  const remaining = Math.max(0, form.totalSessions - form.attendedSessions);

  const remainingStatus: 'ok' | 'low' | 'empty' =
    remaining === 0 ? 'empty' : remaining <= 3 ? 'low' : 'ok';

  const remainingColor  = remainingStatus === 'empty' ? '#E76F51'
    : remainingStatus === 'low'   ? '#E9C46A' : '#2A9D8F';
  const remainingBg     = remainingStatus === 'empty' ? 'rgba(231,111,81,0.09)'
    : remainingStatus === 'low'   ? 'rgba(233,196,106,0.12)' : 'rgba(42,157,143,0.09)';

  /* ── Change tracking ── */
  const changedFields = useMemo(() => {
    const c: string[] = [];
    if (form.name             !== ORIGINAL.name)             c.push('name');
    if (form.phone            !== ORIGINAL.phone)            c.push('phone');
    if (form.level            !== ORIGINAL.level)            c.push('level');
    if (form.defaultClass     !== ORIGINAL.defaultClass)     c.push('defaultClass');
    if (form.totalSessions    !== ORIGINAL.totalSessions)    c.push('totalSessions');
    if (form.attendedSessions !== ORIGINAL.attendedSessions) c.push('attendedSessions');
    if (form.status           !== ORIGINAL.status)           c.push('status');
    if (form.notes            !== ORIGINAL.notes)            c.push('notes');
    return new Set(c);
  }, [form]);

  const hasChanges = changedFields.size > 0;

  /* ── Stepper ── */
  function step(field: 'totalSessions' | 'attendedSessions', delta: number) {
    setForm(prev => {
      const next = Math.max(0, prev[field] + delta);
      const updated = { ...prev, [field]: next };
      // keep consistency
      if (field === 'totalSessions' && updated.attendedSessions > next)
        updated.attendedSessions = next;
      return updated;
    });
  }

  /* ── Validation ── */
  function validate() {
    const e = { name: '', sessions: '' };
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên.';
    if (form.attendedSessions > form.totalSessions)
      e.sessions = 'Số buổi đã học không lớn hơn tổng buổi.';
    return e;
  }

  function handleSave() {
    const e = validate();
    setErrors(e);
    if (!e.name && !e.sessions) onSave();
  }

  /* ── UI helpers ── */
  function ChangeBadge({ field }: { field: string }) {
    return changedFields.has(field)
      ? <span className="px-1.5 py-0.5 rounded-full"
              style={{ fontSize:9, fontWeight:800, background:'rgba(244,162,97,0.18)', color:'#C97B38', border:'1px solid rgba(244,162,97,0.4)' }}>
          Đã sửa
        </span>
      : null;
  }

  function OriginalValue({ field, format }: { field: string; format?: (v: unknown) => string }) {
    if (!changedFields.has(field)) return null;
    const orig = ORIGINAL[field as keyof typeof ORIGINAL];
    const display = format ? format(orig) : String(orig);
    return (
      <p style={{ fontSize:10, color:'#9CA3AF', marginTop:3 }}>
        Trước: <span style={{ fontWeight:700, color:'#B0B7C3' }}>{display}</span>
      </p>
    );
  }

  function SectionHeader({ accent, icon: Icon, text }: {
    accent: string;
    icon: React.FC<{ style?: React.CSSProperties }>;
    text: string;
  }) {
    return (
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center"
             style={{ background: accent + '18' }}>
          <Icon style={{ width:13, height:13, color:accent }} />
        </div>
        <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.05em' }}>
          {text.toUpperCase()}
        </span>
      </div>
    );
  }

  /* ─────────────────────────────────── RENDER ─── */
  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* ══ HEADER ══ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(150deg,#032E2E 0%,#054A49 35%,#0E7C7B 75%,#2A9D8F 100%)' }}>

        <div className="absolute pointer-events-none" style={{ top:-20, right:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }} />

        <div className="relative px-4 pt-12 pb-5">
          {/* top row */}
          <div className="flex items-center gap-3 mb-4">
            <button onClick={onBack}
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-90 transition-transform"
                    style={{ background:'rgba(255,255,255,0.18)' }}>
              <ArrowLeft style={{ width:18, height:18, color:'white' }} />
            </button>

            <div className="flex-1 min-w-0">
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', letterSpacing:'0.04em' }}>
                CHỈNH SỬA THÔNG TIN
              </p>
              <h1 style={{ fontSize:19, fontWeight:900, color:'white', lineHeight:1.2 }}>
                Sửa học viên
              </h1>
            </div>

            {/* avatar */}
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(255,255,255,0.2)', border:'2px solid rgba(255,255,255,0.3)', fontSize:14, fontWeight:900, color:'white' }}>
              {initials(form.name)}
            </div>
          </div>

          {/* student name + change count chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                 style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.2)' }}>
              <Edit3 style={{ width:11, height:11, color:'rgba(255,255,255,0.8)' }} />
              <span style={{ fontSize:11, fontWeight:700, color:'rgba(255,255,255,0.9)' }}>
                {form.name || 'Chưa nhập tên'}
              </span>
            </div>

            {hasChanges && (
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full"
                   style={{ background:'rgba(244,162,97,0.3)', border:'1px solid rgba(244,162,97,0.4)' }}>
                <Sparkles style={{ width:10, height:10, color:'#FFD49E' }} />
                <span style={{ fontSize:11, fontWeight:800, color:'#FFD49E' }}>
                  {changedFields.size} thay đổi
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══ SCROLLABLE FORM ══ */}
      <div className="flex-1 overflow-y-auto pb-36">

        {/* ─── Edit info bar ─── */}
        {hasChanges ? (
          <div className="mx-4 mt-4 flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
               style={{ background:'rgba(244,162,97,0.1)', border:'1.5px solid rgba(244,162,97,0.3)' }}>
            <Edit3 style={{ width:14, height:14, color:'#C97B38', flexShrink:0 }} />
            <p style={{ fontSize:12, color:'#C97B38', fontWeight:600 }}>
              Đã thay đổi <strong>{changedFields.size}</strong> trường.
              {' '}<span style={{ opacity:0.7 }}>Nhấn "Lưu thay đổi" để áp dụng.</span>
            </p>
          </div>
        ) : (
          <div className="mx-4 mt-4 flex items-center gap-2.5 px-3.5 py-3 rounded-2xl"
               style={{ background:'rgba(14,124,123,0.07)', border:'1px solid rgba(14,124,123,0.18)' }}>
            <Info style={{ width:14, height:14, color:'#0E7C7B', flexShrink:0 }} />
            <p style={{ fontSize:12, color:'#0E7C7B', fontWeight:600 }}>
              Đang chỉnh sửa: <strong>{ORIGINAL.name}</strong>
            </p>
          </div>
        )}

        <div className="px-4 pt-4 space-y-5">

          {/* ══════════════════════════════════════════
              SECTION 1 — Thông tin cơ bản
          ══════════════════════════════════════════ */}
          <div>
            <SectionHeader accent="#0E7C7B" icon={User} text="Thông tin cơ bản" />
            <div className="bg-white rounded-2xl overflow-hidden"
                 style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>

              {/* Họ tên */}
              <div className="px-4 pt-4 pb-3" style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-2 mb-2.5">
                  <User style={{ width:13, height:13, color:'#0E7C7B' }} />
                  <label style={{ fontSize:12, fontWeight:700, color:'#6B7280', flex:1 }}>HỌ TÊN *</label>
                  <ChangeBadge field="name" />
                </div>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full focus:outline-none"
                  style={{
                    fontSize:17, fontWeight:700, color:'#1F2933',
                    background:'transparent', border:'none',
                    borderBottom: errors.name
                      ? '2px solid #E76F51'
                      : changedFields.has('name') ? '2px solid rgba(244,162,97,0.6)' : '2px solid rgba(14,124,123,0.25)',
                    paddingBottom:8, paddingTop:2,
                  }}
                />
                <OriginalValue field="name" />
                {errors.name && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle style={{ width:12, height:12, color:'#E76F51' }} />
                    <span style={{ fontSize:11, color:'#E76F51' }}>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="px-4 pt-3.5 pb-4">
                <div className="flex items-center gap-2 mb-2.5">
                  <Phone style={{ width:13, height:13, color:'#0E7C7B' }} />
                  <label style={{ fontSize:12, fontWeight:700, color:'#6B7280', flex:1 }}>SỐ ĐIỆN THOẠI</label>
                  <ChangeBadge field="phone" />
                </div>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full focus:outline-none"
                  style={{
                    fontSize:16, fontWeight:600, color:'#374151',
                    background:'transparent', border:'none',
                    borderBottom: changedFields.has('phone') ? '2px solid rgba(244,162,97,0.6)' : '2px solid rgba(14,124,123,0.25)',
                    paddingBottom:8, paddingTop:2,
                  }}
                />
                <OriginalValue field="phone" />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              SECTION 2 — Trình độ & Lớp
          ══════════════════════════════════════════ */}
          <div>
            <SectionHeader accent="#F4A261" icon={Trophy} text="Trình độ & Lớp học" />
            <div className="bg-white rounded-2xl overflow-hidden"
                 style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>

              {/* Trình độ chips */}
              <div className="px-4 pt-4 pb-3.5" style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <Trophy style={{ width:13, height:13, color:'#F4A261' }} />
                  <label style={{ fontSize:12, fontWeight:700, color:'#6B7280', flex:1 }}>TRÌNH ĐỘ</label>
                  <ChangeBadge field="level" />
                </div>
                <div className="flex gap-2">
                  {(Object.entries(LEVEL_CFG) as [Level, typeof LEVEL_CFG.beginner][]).map(([key, cfg]) => {
                    const active = form.level === key;
                    return (
                      <button key={key} onClick={() => setForm(p => ({ ...p, level: key }))}
                              className="flex-1 py-2.5 rounded-xl transition-all active:scale-95"
                              style={{
                                fontSize:12, fontWeight: active ? 800 : 600,
                                background: active ? cfg.bg : 'rgba(0,0,0,0.04)',
                                color:      active ? cfg.color : '#9CA3AF',
                                border:     `1.5px solid ${active ? cfg.border : 'transparent'}`,
                                boxShadow:  active ? `0 2px 8px ${cfg.color}25` : 'none',
                              }}>
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
                <OriginalValue field="level" format={v => LEVEL_CFG[v as Level]?.label ?? String(v)} />
              </div>

              {/* Lớp mặc định */}
              <div className="px-4 pt-3.5 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen style={{ width:13, height:13, color:'#F4A261' }} />
                  <label style={{ fontSize:12, fontWeight:700, color:'#6B7280', flex:1 }}>LỚP MẶC ĐỊNH</label>
                  <ChangeBadge field="defaultClass" />
                </div>
                <div className="relative">
                  <select
                    value={form.defaultClass}
                    onChange={e => setForm(p => ({ ...p, defaultClass: e.target.value }))}
                    className="w-full appearance-none focus:outline-none pr-10"
                    style={{
                      fontSize:14, fontWeight:700, color:'#1F2933',
                      background: changedFields.has('defaultClass') ? 'rgba(244,162,97,0.06)' : 'rgba(0,0,0,0.04)',
                      border: `1.5px solid ${changedFields.has('defaultClass') ? 'rgba(244,162,97,0.4)' : 'rgba(0,0,0,0.1)'}`,
                      borderRadius:14, padding:'12px 16px',
                    }}
                  >
                    {CLASSES.map(c => (
                      <option key={c.id} value={c.id}>{c.label} · {c.sub}</option>
                    ))}
                  </select>
                  <ChevronDown style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', width:16, height:16, color:'#9CA3AF', pointerEvents:'none' }} />
                </div>
                <OriginalValue field="defaultClass" format={v => CLASSES.find(c => c.id === v)?.label ?? String(v)} />
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              WARNING CARD (before session editing)
          ══════════════════════════════════════════ */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border:`1.5px solid ${sessionFocus ? 'rgba(233,196,106,0.6)' : 'rgba(233,196,106,0.35)'}`,
              boxShadow: sessionFocus ? '0 4px 20px rgba(233,196,106,0.2)' : 'none',
              transition:'all 0.25s ease',
            }}
          >
            {/* amber header strip */}
            <div className="flex items-center gap-2.5 px-4 py-3"
                 style={{ background:'rgba(233,196,106,0.18)', borderBottom:'1px solid rgba(233,196,106,0.25)' }}>
              <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
                   style={{ background:'rgba(233,196,106,0.35)' }}>
                <AlertTriangle style={{ width:14, height:14, color:'#A07B10' }} />
              </div>
              <div>
                <p style={{ fontSize:12, fontWeight:900, color:'#92620A' }}>
                  Cảnh báo chỉnh số buổi
                </p>
                <p style={{ fontSize:10, color:'#A07B10', fontWeight:600 }}>
                  Đọc kỹ trước khi thay đổi
                </p>
              </div>
            </div>

            {/* warning body */}
            <div className="px-4 py-3.5 space-y-2.5" style={{ background:'rgba(255,251,235,0.8)' }}>
              {[
                {
                  icon:'⚠️',
                  text:'Chỉ chỉnh số buổi thủ công khi cần điều chỉnh dữ liệu bị sai lệch.',
                },
                {
                  icon:'💡',
                  text:'Nếu sai do điểm danh, nên sửa lại buổi điểm danh trước để dữ liệu nhất quán.',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <span style={{ fontSize:14, flexShrink:0, marginTop:1 }}>{item.icon}</span>
                  <p style={{ fontSize:12, color:'#92620A', lineHeight:1.55, fontWeight:500 }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              SECTION 3 — Số buổi học
          ══════════════════════════════════════════ */}
          <div onFocus={() => setSessionFocus(true)} onBlur={() => setSessionFocus(false)}>
            <SectionHeader accent="#2A9D8F" icon={ClipboardList} text="Số buổi học" />

            {errors.sessions && (
              <div className="flex items-center gap-2 mb-2.5 px-3.5 py-2.5 rounded-xl"
                   style={{ background:'rgba(231,111,81,0.08)', border:'1px solid rgba(231,111,81,0.3)' }}>
                <AlertCircle style={{ width:13, height:13, color:'#E76F51', flexShrink:0 }} />
                <span style={{ fontSize:12, color:'#C85A3D', fontWeight:700 }}>{errors.sessions}</span>
              </div>
            )}

            <div className="bg-white rounded-2xl overflow-hidden"
                 style={{ border:`1.5px solid ${sessionFocus ? 'rgba(14,124,123,0.3)' : 'rgba(0,0,0,0.09)'}`, boxShadow:'0 2px 10px rgba(0,0,0,0.05)', transition:'border-color 0.25s' }}>

              <div className="grid grid-cols-3 divide-x"
                   style={{ '--tw-divide-opacity':1, borderBottom:'1px solid rgba(0,0,0,0.07)' } as React.CSSProperties}>

                {/* Tổng mua */}
                {(['totalSessions','attendedSessions'] as const).map(field => {
                  const label   = field === 'totalSessions' ? 'Tổng đã mua' : 'Đã học';
                  const changed = changedFields.has(field);
                  return (
                    <div key={field} className="flex flex-col items-center px-2 py-4 gap-2"
                         style={{ background: changed ? 'rgba(244,162,97,0.04)' : 'transparent' }}>
                      <div className="flex items-center gap-1">
                        <span style={{ fontSize:10, fontWeight:700, color: changed ? '#C97B38' : '#9CA3AF' }}>
                          {label.toUpperCase()}
                        </span>
                        {changed && (
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background:'#F4A261' }} />
                        )}
                      </div>

                      {/* Stepper */}
                      <div className="flex items-center gap-2 w-full justify-center">
                        <button
                          onClick={() => step(field, -1)}
                          disabled={form[field] <= 0}
                          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
                          style={{
                            background: form[field] <= 0 ? 'rgba(0,0,0,0.05)' : 'rgba(14,124,123,0.1)',
                            border: `1.5px solid ${form[field] <= 0 ? 'rgba(0,0,0,0.08)' : 'rgba(14,124,123,0.25)'}`,
                          }}
                        >
                          <Minus style={{ width:12, height:12, color: form[field] <= 0 ? '#D1D5DB' : '#0E7C7B' }} />
                        </button>

                        <span style={{ fontSize:28, fontWeight:900, color: changed ? '#C97B38' : '#1F2933', minWidth:36, textAlign:'center', lineHeight:1 }}>
                          {form[field]}
                        </span>

                        <button
                          onClick={() => step(field, +1)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
                          style={{ background:'rgba(14,124,123,0.1)', border:'1.5px solid rgba(14,124,123,0.25)' }}
                        >
                          <Plus style={{ width:12, height:12, color:'#0E7C7B' }} />
                        </button>
                      </div>

                      {/* original value */}
                      {changed && (
                        <p style={{ fontSize:9, color:'#B0B7C3', fontWeight:600 }}>
                          Trước: {ORIGINAL[field]}
                        </p>
                      )}
                    </div>
                  );
                })}

                {/* Còn lại — READ ONLY */}
                <div className="flex flex-col items-center px-2 py-4 gap-2"
                     style={{ background: remainingBg }}>
                  <div className="flex items-center gap-1.5">
                    <Lock style={{ width:10, height:10, color:'#9CA3AF' }} />
                    <span style={{ fontSize:10, fontWeight:700, color:'#9CA3AF' }}>CÒN LẠI</span>
                  </div>

                  <span style={{ fontSize:32, fontWeight:900, color:remainingColor, lineHeight:1, textAlign:'center' }}>
                    {remaining}
                  </span>

                  <span className="px-2 py-0.5 rounded-full"
                        style={{ fontSize:9, fontWeight:800,
                                 color: remainingColor,
                                 background: remainingStatus === 'empty' ? 'rgba(231,111,81,0.15)'
                                   : remainingStatus === 'low' ? 'rgba(233,196,106,0.2)' : 'rgba(42,157,143,0.12)' }}>
                    {remainingStatus === 'empty' ? '✕ Hết buổi' : remainingStatus === 'low' ? '⚠ Sắp hết' : '✓ Còn tốt'}
                  </span>
                </div>
              </div>

              {/* progress bar inside card */}
              <div className="px-4 pb-4 pt-3.5">
                <div className="flex items-center justify-between mb-1.5">
                  <span style={{ fontSize:11, color:'#9CA3AF', fontWeight:600 }}>
                    Tiến độ sử dụng buổi
                  </span>
                  <span style={{ fontSize:11, fontWeight:800, color:'#6B7280' }}>
                    {form.attendedSessions}/{form.totalSessions} buổi
                    {' '}
                    <span style={{ color:remainingColor, fontWeight:900 }}>
                      ({form.totalSessions > 0 ? Math.round(form.attendedSessions / form.totalSessions * 100) : 0}%)
                    </span>
                  </span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
                  <div className="h-full rounded-full transition-all duration-400"
                       style={{
                         width: form.totalSessions > 0 ? `${Math.min(100, form.attendedSessions / form.totalSessions * 100)}%` : '0%',
                         background: `linear-gradient(90deg,${remainingColor},${remainingColor}BB)`,
                       }} />
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════
              SECTION 4 — Trạng thái & Ghi chú
          ══════════════════════════════════════════ */}
          <div>
            <SectionHeader accent="#E9C46A" icon={CheckCircle2} text="Trạng thái & Ghi chú" />
            <div className="bg-white rounded-2xl overflow-hidden"
                 style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>

              {/* Trạng thái */}
              <div className="px-4 pt-4 pb-4" style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 style={{ width:13, height:13, color:'#E9C46A' }} />
                  <label style={{ fontSize:12, fontWeight:700, color:'#6B7280', flex:1 }}>TRẠNG THÁI</label>
                  <ChangeBadge field="status" />
                </div>
                <div className="flex gap-2">
                  {(Object.entries(STATUS_CFG) as [Status, typeof STATUS_CFG.active][]).map(([key, cfg]) => {
                    const active = form.status === key;
                    return (
                      <button key={key} onClick={() => setForm(p => ({ ...p, status: key }))}
                              className="flex-1 py-2.5 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-1"
                              style={{
                                background: active ? cfg.bg : 'rgba(0,0,0,0.04)',
                                border:     `1.5px solid ${active ? cfg.border : 'transparent'}`,
                                boxShadow:  active ? `0 2px 8px ${cfg.color}20` : 'none',
                              }}>
                        <div className="w-2 h-2 rounded-full" style={{ background: active ? cfg.dot : '#D1D5DB' }} />
                        <span style={{ fontSize:11, fontWeight: active ? 800 : 600, color: active ? cfg.color : '#9CA3AF' }}>
                          {cfg.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <OriginalValue field="status" format={v => STATUS_CFG[v as Status]?.label ?? String(v)} />
              </div>

              {/* Ghi chú */}
              <div className="px-4 pt-4 pb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText style={{ width:13, height:13, color:'#E9C46A' }} />
                  <label style={{ fontSize:12, fontWeight:700, color:'#6B7280', flex:1 }}>GHI CHÚ</label>
                  <ChangeBadge field="notes" />
                </div>
                <textarea
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Thêm ghi chú về học viên..."
                  rows={4}
                  className="w-full resize-none focus:outline-none rounded-2xl px-4 py-3.5"
                  style={{
                    fontSize:14, color:'#374151', lineHeight:1.6,
                    background: changedFields.has('notes') ? 'rgba(233,196,106,0.06)' : 'rgba(0,0,0,0.04)',
                    border: `1.5px solid ${changedFields.has('notes') ? 'rgba(233,196,106,0.4)' : 'rgba(0,0,0,0.1)'}`,
                    transition:'all 0.2s',
                  }}
                />
                <div className="flex justify-end mt-1.5">
                  <span style={{ fontSize:10, color:'#C0C7D0' }}>{form.notes.length}/300</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ FOOTER ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20 max-w-[390px] mx-auto"
           style={{ background:'white', borderTop:'1px solid rgba(0,0,0,0.09)',
                    paddingLeft:16, paddingRight:16, paddingTop:12, paddingBottom:28,
                    boxShadow:'0 -6px 24px rgba(0,0,0,0.08)' }}>

        {/* change summary strip */}
        {hasChanges && (
          <div className="flex items-center gap-2 flex-wrap px-3 py-2.5 rounded-xl mb-3"
               style={{ background:'rgba(244,162,97,0.08)', border:'1px solid rgba(244,162,97,0.25)' }}>
            <Edit3 style={{ width:12, height:12, color:'#C97B38', flexShrink:0 }} />
            <span style={{ fontSize:11, color:'#C97B38', fontWeight:600 }}>Thay đổi:</span>
            {[...changedFields].map(f => {
              const labels: Record<string, string> = {
                name:'Họ tên', phone:'SĐT', level:'Trình độ',
                defaultClass:'Lớp', totalSessions:'Tổng buổi',
                attendedSessions:'Đã học', status:'Trạng thái', notes:'Ghi chú',
              };
              return (
                <span key={f} className="px-2 py-0.5 rounded-full"
                      style={{ fontSize:10, fontWeight:800, background:'rgba(244,162,97,0.18)', color:'#C97B38' }}>
                  {labels[f] ?? f}
                </span>
              );
            })}
          </div>
        )}

        <div className="flex gap-3">
          {/* Hủy */}
          <button onClick={onBack}
                  className="flex items-center justify-center gap-2 rounded-2xl active:scale-95 transition-all"
                  style={{ width:90, flexShrink:0, paddingTop:15, paddingBottom:15,
                           background:'rgba(0,0,0,0.05)', border:'1.5px solid rgba(0,0,0,0.12)',
                           fontSize:14, fontWeight:700, color:'#6B7280' }}>
            <X style={{ width:15, height:15 }} /> Hủy
          </button>

          {/* Lưu thay đổi */}
          <button onClick={handleSave}
                  className="flex-1 flex items-center justify-between px-4 rounded-2xl active:scale-[0.98] transition-all"
                  style={{
                    paddingTop:15, paddingBottom:15,
                    background: hasChanges
                      ? 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)'
                      : 'rgba(0,0,0,0.07)',
                    boxShadow: hasChanges ? '0 8px 24px rgba(14,124,123,0.35)' : 'none',
                    transition: 'all 0.25s ease',
                  }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: hasChanges ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.07)' }}>
                <Save style={{ width:15, height:15, color: hasChanges ? 'white' : '#9CA3AF' }} />
              </div>
              <div className="text-left">
                <p style={{ fontSize:14, fontWeight:900, color: hasChanges ? 'white' : '#9CA3AF' }}>
                  Lưu thay đổi
                </p>
                <p style={{ fontSize:10, color: hasChanges ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.3)' }}>
                  {hasChanges ? `${changedFields.size} trường được cập nhật` : 'Chưa có thay đổi'}
                </p>
              </div>
            </div>
            {hasChanges && (
              <div className="px-2.5 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize:13, fontWeight:900, color:'white' }}>
                  +{changedFields.size}
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
