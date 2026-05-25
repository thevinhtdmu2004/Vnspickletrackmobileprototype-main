import {
  ArrowLeft, Search, Clock, MapPin, User, Users,
  CalendarDays, Plus, CheckCircle2, X, Zap,
  BookOpen, PlayCircle, ChevronRight, AlertCircle
} from 'lucide-react';
import { useState } from 'react';
import { SessionCreatedSuccessScreen } from './SessionCreatedSuccessScreen';

interface SelectClassForSessionScreenProps {
  onBack:   () => void;
  onSelect: (classId: number) => void;
}

/* ─── types ────────────────────────────────────────────── */
type Level = 'Cơ bản' | 'Trung cấp' | 'Nâng cao';

interface ClassItem {
  id:             number;
  name:           string;
  level:          Level;
  timeStart:      string;
  timeEnd:        string;
  court:          string;
  coach:          string;
  students:       number;
  maxStudents:    number;
  days:           string[];
  sessionCreated: boolean;
  accentColor:    string;
}

/* ─── mock data ─────────────────────────────────────────── */
const TODAY_LABEL  = 'Thứ 5  ·  01/05/2026';
const TODAY_DATE   = '01/05/2026';

const CLASSES: ClassItem[] = [
  { id:1, name:'Beginner A',    level:'Cơ bản',    timeStart:'18:00', timeEnd:'19:30', court:'Sân 1', coach:'Coach Nam',  students:8,  maxStudents:12, days:['T2','T4','T6'], sessionCreated:false, accentColor:'#2A9D8F' },
  { id:2, name:'Intermediate B',level:'Trung cấp', timeStart:'19:30', timeEnd:'21:00', court:'Sân 2', coach:'Coach Hùng', students:6,  maxStudents:10, days:['T3','T5','T7'], sessionCreated:false, accentColor:'#F4A261' },
  { id:3, name:'Advanced C',    level:'Nâng cao',  timeStart:'07:00', timeEnd:'08:30', court:'Sân 3', coach:'Coach Lan',  students:5,  maxStudents:8,  days:['T3','T5'],      sessionCreated:true,  accentColor:'#815AD5' },
  { id:4, name:'Beginner B',    level:'Cơ bản',    timeStart:'17:00', timeEnd:'18:30', court:'Sân 1', coach:'Coach Nam',  students:10, maxStudents:12, days:['T2','T4','T6'], sessionCreated:false, accentColor:'#0E7C7B' },
  { id:5, name:'Intermediate A',level:'Trung cấp', timeStart:'09:00', timeEnd:'10:30', court:'Sân 2', coach:'Coach Hùng', students:9,  maxStudents:10, days:['T2','T4','T6'], sessionCreated:true,  accentColor:'#E76F51' },
  { id:6, name:'Kids Beginner', level:'Cơ bản',    timeStart:'08:00', timeEnd:'09:30', court:'Sân 1', coach:'Coach Thảo', students:7,  maxStudents:10, days:['T7','CN'],       sessionCreated:false, accentColor:'#E9C46A' },
];

/* ─── config ────────────────────────────────────────────── */
const LEVEL_CFG: Record<Level, { chip: string; chipBg: string; dot: string }> = {
  'Cơ bản':   { chip:'#1A7B6E', chipBg:'rgba(42,157,143,0.12)',  dot:'#2A9D8F' },
  'Trung cấp':{ chip:'#D4762A', chipBg:'rgba(244,162,97,0.14)',  dot:'#F4A261' },
  'Nâng cao': { chip:'#5C3FA8', chipBg:'rgba(129,90,213,0.12)',  dot:'#815AD5' },
};

type LevelFilter = 'Tất cả' | Level;
const LEVEL_FILTERS: LevelFilter[] = ['Tất cả','Cơ bản','Trung cấp','Nâng cao'];

/* ══════════════════════════════════════════════════════════
   MAIN SCREEN
══════════════════════════════════════════════════════════ */
export function SelectClassForSessionScreen({ onBack, onSelect }: SelectClassForSessionScreenProps) {
  const [search,      setSearch]      = useState('');
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('Tất cả');
  const [justCreated, setJustCreated] = useState<Set<number>>(new Set());
  const [pendingCls,  setPendingCls]  = useState<ClassItem | null>(null); // dialog target
  const [successCls,  setSuccessCls]  = useState<ClassItem | null>(null); // success overlay

  const createdIds = new Set([
    ...CLASSES.filter(c => c.sessionCreated).map(c => c.id),
    ...justCreated,
  ]);

  const filtered = CLASSES.filter(c => {
    const q = search.trim().toLowerCase();
    const ok = !q || c.name.toLowerCase().includes(q) || c.coach.toLowerCase().includes(q) || c.court.toLowerCase().includes(q);
    return ok && (levelFilter === 'Tất cả' || c.level === levelFilter);
  });

  const available    = filtered.filter(c => !createdIds.has(c.id));
  const created      = filtered.filter(c =>  createdIds.has(c.id));
  const totalCreated = createdIds.size;
  const totalAvail   = CLASSES.length - totalCreated;

  function handleConfirm() {
    if (!pendingCls) return;
    setJustCreated(prev => new Set([...prev, pendingCls.id]));
    setSuccessCls(pendingCls);
    setPendingCls(null);
    // onSelect is called when user taps "Điểm danh ngay" in the success screen
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#F7F9FA' }}>

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background: 'linear-gradient(150deg,#043F3E 0%,#065A58 45%,#0E7C7B 100%)' }}>
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none" style={{ background:'rgba(255,255,255,0.04)' }} />
        <div className="absolute top-8 -right-4 w-24 h-24 rounded-full pointer-events-none" style={{ background:'rgba(255,255,255,0.03)' }} />

        <div className="flex items-center gap-3 px-4 pt-11 pb-3">
          <button onClick={onBack} className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:scale-95" style={{ background:'rgba(255,255,255,0.14)' }}>
            <ArrowLeft style={{ width:19, height:19, color:'white' }} />
          </button>
          <div className="flex-1 min-w-0">
            <p style={{ fontSize:11, color:'rgba(255,255,255,0.55)', fontWeight:600, letterSpacing:'0.03em' }}>{TODAY_LABEL}</p>
            <h1 style={{ fontSize:18, fontWeight:900, color:'white', lineHeight:1.15, marginTop:1 }}>Tạo buổi học hôm nay</h1>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center px-3 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.15)' }}>
            <span style={{ fontSize:17, fontWeight:900, color:'white', lineHeight:1 }}>{totalCreated}</span>
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.55)', fontWeight:600 }}>Đã tạo</span>
          </div>
        </div>

        <p style={{ fontSize:13, color:'rgba(255,255,255,0.65)', paddingLeft:16, paddingRight:16, marginBottom:12, lineHeight:1.5 }}>
          Chọn lớp cần tạo buổi học —{' '}
          <span style={{ color:'rgba(255,255,255,0.9)', fontWeight:700 }}>{totalAvail} lớp chưa tạo</span>
        </p>

        {/* search */}
        <div className="px-4 mb-3">
          <div className="flex items-center gap-2.5 rounded-2xl px-3.5" style={{ background:'rgba(255,255,255,0.14)', border:'1.5px solid rgba(255,255,255,0.18)', height:44 }}>
            <Search style={{ width:16, height:16, color:'rgba(255,255,255,0.55)', flexShrink:0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm lớp học..."
              className="flex-1 bg-transparent border-none outline-none" style={{ fontSize:14, color:'white', caretColor:'white' }} />
            {search && <button onClick={() => setSearch('')}><X style={{ width:15, height:15, color:'rgba(255,255,255,0.55)' }} /></button>}
          </div>
        </div>

        {/* level filter chips */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          {LEVEL_FILTERS.map(f => {
            const isA = levelFilter === f;
            const lv  = f !== 'Tất cả' ? LEVEL_CFG[f as Level] : null;
            return (
              <button key={f} onClick={() => setLevelFilter(f)}
                className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-all active:scale-95"
                style={{ background: isA ? 'white' : 'rgba(255,255,255,0.13)', color: isA ? (lv?.chip ?? '#0E7C7B') : 'rgba(255,255,255,0.8)', fontSize:12, fontWeight: isA ? 800 : 500, border: isA ? 'none' : '1px solid rgba(255,255,255,0.15)', boxShadow: isA ? '0 2px 8px rgba(0,0,0,0.15)' : 'none' }}
              >
                {lv && <span className="w-2 h-2 rounded-full" style={{ background: isA ? lv.dot : 'currentColor', opacity: isA ? 1 : 0.7 }} />}
                {f}
                {f === 'Tất cả' && <span className="px-1.5 py-0.5 rounded-full" style={{ fontSize:10, fontWeight:800, background: isA ? '#0E7C7B' : 'rgba(255,255,255,0.2)', color: isA ? 'white' : 'rgba(255,255,255,0.9)' }}>{CLASSES.length}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── List ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-24 space-y-4">

        {filtered.length === 0 && (
          <div className="flex flex-col items-center py-20 gap-4">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center" style={{ background:'rgba(14,124,123,0.08)', border:'2px dashed rgba(14,124,123,0.2)' }}>
              <BookOpen style={{ width:32, height:32, color:'rgba(14,124,123,0.35)' }} />
            </div>
            <div className="text-center">
              <p style={{ fontSize:15, fontWeight:700, color:'#1F2933', marginBottom:6 }}>Không tìm thấy lớp học</p>
              <p style={{ fontSize:13, color:'#9CA3AF' }}>Thử tìm với từ khoá khác</p>
            </div>
            <button onClick={() => { setSearch(''); setLevelFilter('Tất cả'); }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl active:scale-95"
              style={{ background:'rgba(14,124,123,0.1)', color:'#0E7C7B', fontSize:13, fontWeight:700 }}>
              <Zap style={{ width:14, height:14 }} /> Xem tất cả lớp
            </button>
          </div>
        )}

        {available.length > 0 && (
          <section>
            <SectionLabel color="#0E7C7B" text={`Chưa tạo buổi học (${available.length})`} />
            <div className="space-y-3">
              {available.map(cls => (
                <ClassCard key={cls.id} cls={cls} isCreated={false} onRequestCreate={() => setPendingCls(cls)} />
              ))}
            </div>
          </section>
        )}

        {created.length > 0 && (
          <section>
            <SectionLabel color="#2A9D8F" text={`Đã có buổi học (${created.length})`} />
            <div className="space-y-3">
              {created.map(cls => (
                <ClassCard key={cls.id} cls={cls} isCreated onRequestCreate={() => {}} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* ── Footer note ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20" style={{ background:'rgba(247,249,250,0.95)', backdropFilter:'blur(10px)' }}>
        <div className="max-w-[390px] mx-auto px-4 py-3 pb-5 border-t" style={{ borderColor:'rgba(0,0,0,0.07)' }}>
          <div className="flex items-center justify-center gap-2">
            <CalendarDays style={{ width:13, height:13, color:'#9CA3AF', flexShrink:0 }} />
            <p style={{ fontSize:12, color:'#9CA3AF', textAlign:'center' }}>
              Buổi học sẽ được tạo theo ngày hiện tại —{' '}
              <strong style={{ color:'#6B7280' }}>{TODAY_LABEL}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CONFIRM DIALOG
      ══════════════════════════════════════════════════════ */}
      {pendingCls && (
        <ConfirmDialog
          cls={pendingCls}
          date={TODAY_DATE}
          onCancel={() => setPendingCls(null)}
          onConfirm={handleConfirm}
        />
      )}

      {/* ══════════════════════════════════════════════════════
          SUCCESS SCREEN OVERLAY
      ══════════════════════════════════════════════════════ */}
      {successCls && (
        <div className="fixed inset-0 z-50 max-w-[390px] mx-auto"
             style={{ animation:'fadeIn 200ms ease both' }}>
          <SessionCreatedSuccessScreen
            className={successCls.name}
            level={successCls.level}
            date={TODAY_DATE}
            timeStart={successCls.timeStart}
            timeEnd={successCls.timeEnd}
            court={successCls.court}
            coach={successCls.coach}
            students={successCls.students}
            accentColor={successCls.accentColor}
            onAttendance={() => { setSuccessCls(null); onSelect(successCls.id); }}
            onBack={() => { setSuccessCls(null); onBack(); }}
          />
          <style>{`@keyframes fadeIn { from{opacity:0} to{opacity:1} }`}</style>
        </div>
      )}
    </div>
  );
}

/* ── tiny helpers ── */
function SectionLabel({ color, text }: { color: string; text: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1.5 h-4 rounded-full" style={{ background: color }} />
      <p style={{ fontSize:11, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.06em', color:'#6B7280' }}>{text}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CLASS CARD
══════════════════════════════════════════════════════════ */
interface ClassCardProps { cls: ClassItem; isCreated: boolean; onRequestCreate: () => void; }

function ClassCard({ cls, isCreated, onRequestCreate }: ClassCardProps) {
  const lv      = LEVEL_CFG[cls.level];
  const fillPct = Math.round(cls.students / cls.maxStudents * 100);
  const isFull  = cls.students >= cls.maxStudents;

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'white', border:`1.5px solid ${isCreated ? 'rgba(42,157,143,0.22)' : 'rgba(0,0,0,0.09)'}`, boxShadow: isCreated ? '0 2px 8px rgba(42,157,143,0.1)' : '0 2px 10px rgba(0,0,0,0.06)', opacity: isCreated ? 0.85 : 1 }}>
      <div style={{ height:4, background: isCreated ? 'linear-gradient(90deg,#2A9D8F,#0E7C7B)' : `linear-gradient(90deg,${cls.accentColor},${cls.accentColor}AA)` }} />
      <div className="p-4">
        {/* name row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap min-w-0">
            <span style={{ fontSize:17, fontWeight:900, color:'#1F2933', lineHeight:1.2 }}>{cls.name}</span>
            <span className="px-2 py-0.5 rounded-full" style={{ fontSize:10, fontWeight:800, color:lv.chip, background:lv.chipBg }}>{cls.level}</span>
          </div>
          {isCreated && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0" style={{ background:'rgba(42,157,143,0.1)', border:'1px solid rgba(42,157,143,0.25)' }}>
              <CheckCircle2 style={{ width:13, height:13, color:'#2A9D8F' }} />
              <span style={{ fontSize:10, fontWeight:800, color:'#1A7B6E' }}>Đã có buổi học</span>
            </div>
          )}
        </div>

        {/* meta grid */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-3 mb-3">
          {[
            { icon:<Clock style={{ width:12, height:12, color:cls.accentColor }} />, label:`${cls.timeStart} – ${cls.timeEnd}`, bold:true },
            { icon:<MapPin style={{ width:12, height:12, color:cls.accentColor }} />, label:cls.court },
            { icon:<User  style={{ width:12, height:12, color:cls.accentColor }} />, label:cls.coach },
            { icon:<Users style={{ width:12, height:12, color: isFull ? '#E76F51' : cls.accentColor }} />, label:`${cls.students}/${cls.maxStudents} học viên${isFull ? ' · Full' : ''}`, warn:isFull },
          ].map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: cls.accentColor + '15' }}>{m.icon}</div>
              <span style={{ fontSize:13, fontWeight: m.bold ? 700 : 400, color: m.warn ? '#E76F51' : '#374151' }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* days + fill */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 flex-1">
            <CalendarDays style={{ width:11, height:11, color:'#9CA3AF', flexShrink:0 }} />
            <div className="flex gap-1">
              {cls.days.map(d => (
                <span key={d} className="px-2 py-0.5 rounded-md" style={{ fontSize:10, fontWeight:700, background: cls.accentColor + '12', color: cls.accentColor }}>{d}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0" style={{ width:80 }}>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background:'rgba(0,0,0,0.07)' }}>
              <div className="h-full rounded-full" style={{ width:`${fillPct}%`, background: isFull ? '#E76F51' : `linear-gradient(90deg,${cls.accentColor},${cls.accentColor}BB)` }} />
            </div>
            <span style={{ fontSize:10, color:'#9CA3AF', flexShrink:0 }}>{fillPct}%</span>
          </div>
        </div>

        <div style={{ height:1, background:'rgba(0,0,0,0.07)', marginBottom:14 }} />

        {/* CTA */}
        {isCreated ? (
          <div className="w-full h-12 rounded-xl flex items-center justify-center gap-2" style={{ background:'rgba(42,157,143,0.07)', border:'1.5px solid rgba(42,157,143,0.2)' }}>
            <CheckCircle2 style={{ width:16, height:16, color:'#2A9D8F' }} />
            <span style={{ fontSize:14, fontWeight:700, color:'#2A9D8F' }}>Đã tạo hôm nay</span>
          </div>
        ) : (
          <button onClick={onRequestCreate}
            className="w-full h-12 rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            style={{ background:`linear-gradient(135deg,${cls.accentColor},${cls.accentColor}CC)`, boxShadow:`0 4px 14px ${cls.accentColor}40`, color:'white' }}>
            <Plus style={{ width:17, height:17 }} />
            <span style={{ fontSize:14, fontWeight:800 }}>Tạo buổi học</span>
          </button>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   CONFIRM DIALOG — bottom sheet
══════════════════════════════════════════════════════════ */
interface ConfirmDialogProps {
  cls:       ClassItem;
  date:      string;
  onCancel:  () => void;
  onConfirm: () => void;
}

function ConfirmDialog({ cls, date, onCancel, onConfirm }: ConfirmDialogProps) {
  const lv = LEVEL_CFG[cls.level];

  const INFO_ROWS = [
    { icon:<BookOpen  style={{ width:14, height:14 }} />, label:'Lớp',       value: cls.name,                           valueBold: true  },
    { icon:<CalendarDays style={{ width:14, height:14 }} />, label:'Ngày',   value: date,                               valueBold: false },
    { icon:<Clock     style={{ width:14, height:14 }} />, label:'Giờ',       value:`${cls.timeStart} – ${cls.timeEnd}`, valueBold: true  },
    { icon:<MapPin    style={{ width:14, height:14 }} />, label:'Sân',       value: cls.court,                          valueBold: false },
    { icon:<User      style={{ width:14, height:14 }} />, label:'Coach',     value: cls.coach,                          valueBold: false },
    { icon:<Users     style={{ width:14, height:14 }} />, label:'Học viên', value:`${cls.students} người`,              valueBold: false },
  ];

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 z-40"
        style={{ background:'rgba(0,0,0,0.52)', backdropFilter:'blur(4px)' }}
        onClick={onCancel}
      />

      {/* ── Sheet ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 max-w-[390px] mx-auto"
        style={{ animation:'slideUpSheet 250ms cubic-bezier(0.32,0.72,0,1) both' }}
      >
        <div className="bg-white rounded-t-3xl overflow-hidden"
             style={{ boxShadow:'0 -16px 60px rgba(0,0,0,0.22)' }}>

          {/* ── coloured top bar ── */}
          <div style={{ height:4, background:`linear-gradient(90deg,${cls.accentColor},${cls.accentColor}88)` }} />

          {/* ── drag handle ── */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full" style={{ background:'#E5E7EB' }} />
          </div>

          <div className="px-5 pt-2 pb-7">

            {/* ── Icon + Title ── */}
            <div className="flex items-center gap-4 mb-5">
              {/* class avatar */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: cls.accentColor + '18', border:`2px solid ${cls.accentColor}28` }}
              >
                <PlayCircle style={{ width:28, height:28, color: cls.accentColor }} />
              </div>

              <div className="flex-1 min-w-0">
                {/* title */}
                <h2 style={{ fontSize:19, fontWeight:900, color:'#1F2933', lineHeight:1.2, marginBottom:4 }}>
                  Tạo buổi học hôm nay?
                </h2>
                {/* subtitle */}
                <p style={{ fontSize:13, color:'#6B7280', lineHeight:1.4 }}>
                  Bạn muốn tạo buổi học cho lớp{' '}
                  <span style={{ fontWeight:800, color: cls.accentColor }}>{cls.name}</span>{' '}
                  vào hôm nay?
                </p>
              </div>
            </div>

            {/* ── Level chip ── */}
            <div className="flex items-center gap-2 mb-4">
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full"
                style={{ fontSize:11, fontWeight:800, color: lv.chip, background: lv.chipBg }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: lv.dot }} />
                {cls.level}
              </span>
              <span style={{ fontSize:12, color:'#9CA3AF' }}>·</span>
              <span style={{ fontSize:12, color:'#6B7280' }}>{cls.days.join(' · ')}</span>
            </div>

            {/* ── Info card ── */}
            <div
              className="rounded-2xl overflow-hidden mb-5"
              style={{ border:'1.5px solid rgba(0,0,0,0.09)', background:'#FAFAFA' }}
            >
              {INFO_ROWS.map((row, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-4 py-3"
                  style={{ borderBottom: idx < INFO_ROWS.length - 1 ? '1px solid rgba(0,0,0,0.07)' : 'none' }}
                >
                  {/* icon pill */}
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: cls.accentColor + '14', color: cls.accentColor }}
                  >
                    {row.icon}
                  </div>

                  {/* label */}
                  <span
                    className="flex-shrink-0"
                    style={{ fontSize:13, color:'#9CA3AF', width:64 }}
                  >
                    {row.label}
                  </span>

                  {/* value */}
                  <span
                    className="flex-1 text-right"
                    style={{ fontSize:14, fontWeight: row.valueBold ? 800 : 600, color:'#1F2933' }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* ── Notice ── */}
            <div
              className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl mb-5"
              style={{ background:'rgba(14,124,123,0.07)', border:'1px solid rgba(14,124,123,0.18)' }}
            >
              <AlertCircle style={{ width:15, height:15, color:'#0E7C7B', flexShrink:0, marginTop:1 }} />
              <p style={{ fontSize:12, color:'#374151', lineHeight:1.55 }}>
                Buổi học sẽ được ghi nhận vào{' '}
                <strong style={{ color:'#0E7C7B' }}>{date}</strong>.
                Bạn có thể điểm danh và hoàn tất sau khi tạo.
              </p>
            </div>

            {/* ── Buttons ── */}
            <div className="flex gap-3">
              {/* Cancel */}
              <button
                onClick={onCancel}
                className="flex-none px-6 py-4 rounded-2xl active:scale-[0.97] transition-all"
                style={{ fontSize:15, fontWeight:700, background:'#F3F4F6', color:'#6B7280', border:'1.5px solid #E5E7EB' }}
              >
                Hủy
              </button>

              {/* Confirm */}
              <button
                onClick={onConfirm}
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-2xl active:scale-[0.97] transition-all"
                style={{
                  fontSize:   15,
                  fontWeight: 800,
                  color:      'white',
                  background: `linear-gradient(135deg, ${cls.accentColor} 0%, ${cls.accentColor}CC 100%)`,
                  boxShadow:  `0 6px 20px ${cls.accentColor}50`,
                }}
              >
                <PlayCircle style={{ width:18, height:18 }} />
                Tạo buổi học
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Animation keyframe ── */}
      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}