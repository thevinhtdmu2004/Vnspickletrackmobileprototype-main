import {
  ArrowLeft, Clock, MapPin, User, Users, ClipboardCheck,
  CheckCircle2, XCircle, AlertTriangle, MinusCircle,
  BookOpen, ChevronRight, StopCircle, Ban,
  CalendarDays, Dot
} from 'lucide-react';
import { useState } from 'react';
import { CancelSessionDialog }   from './CancelSessionDialog';
import { CompleteSessionDialog } from './CompleteSessionDialog';

interface SessionDetailScreenProps {
  onBack:       () => void;
  onComplete:   () => void;
  onAttendance: () => void;
}

/* ─── Session Status ────────────────────────────────────── */
type SessionStatus = 'pending' | 'active' | 'done' | 'cancelled';

const STATUS_CFG: Record<SessionStatus, {
  label: string; color: string; bg: string; border: string; dot?: boolean;
}> = {
  pending:   { label:'Chưa điểm danh', color:'#A07B10', bg:'rgba(233,196,106,0.18)', border:'rgba(233,196,106,0.5)' },
  active:    { label:'Đang diễn ra',   color:'#1A7B6E', bg:'rgba(42,157,143,0.15)',  border:'rgba(42,157,143,0.4)', dot:true },
  done:      { label:'Đã điểm danh',   color:'#0E7C7B', bg:'rgba(14,124,123,0.13)',  border:'rgba(14,124,123,0.35)' },
  cancelled: { label:'Đã hủy',         color:'#C85A3D', bg:'rgba(231,111,81,0.13)',  border:'rgba(231,111,81,0.35)' },
};

/* ─── Attendance Status ─────────────────────────────────── */
type AttendStatus = 'present' | 'late' | 'makeup' | 'absent' | 'leave' | null;

const ATTEND_CFG: Record<string, { label:string; color:string; bg:string; icon: React.ReactNode }> = {
  present: { label:'Có mặt',   color:'#1A7B6E', bg:'rgba(42,157,143,0.13)',  icon:<CheckCircle2  style={{width:12,height:12}}/> },
  late:    { label:'Trễ',      color:'#A07B10', bg:'rgba(233,196,106,0.18)', icon:<AlertTriangle style={{width:12,height:12}}/> },
  makeup:  { label:'Học bù',   color:'#0E7C7B', bg:'rgba(14,124,123,0.12)', icon:<BookOpen style={{width:12,height:12}}/> },
  absent:  { label:'Vắng',     color:'#C85A3D', bg:'rgba(231,111,81,0.13)',  icon:<XCircle       style={{width:12,height:12}}/> },
  leave:   { label:'Nghỉ phép',color:'#6B7280', bg:'rgba(107,114,128,0.12)',icon:<MinusCircle   style={{width:12,height:12}}/> },
};

/* ─── Mock data ─────────────────────────────────────────── */
interface Student { id:number; name:string; initials:string; avatarColor:string; status: AttendStatus; }

const STUDENTS: Student[] = [
  { id:1, name:'Nguyễn Văn An',   initials:'AN', avatarColor:'#0E7C7B', status:'present' },
  { id:2, name:'Trần Thị Bình',   initials:'BT', avatarColor:'#815AD5', status:'late'    },
  { id:3, name:'Lê Văn Cường',    initials:'CL', avatarColor:'#E76F51', status:'absent'  },
  { id:4, name:'Phạm Thị Duyên',  initials:'DP', avatarColor:'#2A9D8F', status: null     },
  { id:5, name:'Hoàng Minh Đức',  initials:'ĐH', avatarColor:'#F4A261', status:'present' },
  { id:6, name:'Vũ Ngọc Em',      initials:'EV', avatarColor:'#264653', status:'makeup'  },
  { id:7, name:'Đặng Thị Phượng', initials:'PĐ', avatarColor:'#E9C46A', status:'present' },
  { id:8, name:'Bùi Văn Giang',   initials:'GB', avatarColor:'#0E7C7B', status:'leave'   },
];

const ACCENT = '#2A9D8F';    // Beginner A accent

/* ══════════════════════════════════════════════════════════
   SCREEN
══════════════════════════════════════════════════════════ */
export function SessionDetailScreen({ onBack, onComplete, onAttendance }: SessionDetailScreenProps) {
  const [status,       setStatus]      = useState<SessionStatus>('active');
  const [showAllHV,    setShowAllHV]   = useState(false);
  const [showCancel,   setShowCancel]  = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const stCfg = STATUS_CFG[status];

  /* attendance counts */
  const present = STUDENTS.filter(s => s.status === 'present').length;
  const late    = STUDENTS.filter(s => s.status === 'late').length;
  const makeup  = STUDENTS.filter(s => s.status === 'makeup').length;
  const absent  = STUDENTS.filter(s => s.status === 'absent').length;
  const leave   = STUDENTS.filter(s => s.status === 'leave').length;
  const counted = present + late + makeup + absent + leave;
  const total   = STUDENTS.length;
  const pct     = Math.round(counted / total * 100);

  const isCancelled = status === 'cancelled';
  const previewList = showAllHV ? STUDENTS : STUDENTS.slice(0, 4);

  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* ════════════════════════════════════════
          HEADER
      ════════════════════════════════════════ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background:'linear-gradient(150deg,#043F3E 0%,#065A58 45%,#0E7C7B 100%)' }}
      >
        {/* deco rings */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none"
             style={{background:'rgba(255,255,255,0.04)'}} />
        <div className="absolute top-14 -right-6 w-28 h-28 rounded-full pointer-events-none"
             style={{background:'rgba(255,255,255,0.03)'}} />

        {/* top bar */}
        <div className="flex items-center gap-3 px-4 pt-11 pb-2">
          <button onClick={onBack}
            className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center active:scale-95"
            style={{background:'rgba(255,255,255,0.14)'}}>
            <ArrowLeft style={{width:19,height:19,color:'white'}} />
          </button>

          <div className="flex-1 min-w-0">
            <p style={{fontSize:11,color:'rgba(255,255,255,0.5)',fontWeight:600,letterSpacing:'0.03em'}}>
              Thứ 3 · 29/04/2026
            </p>
            <h1 style={{fontSize:18,fontWeight:900,color:'white',lineHeight:1.15,marginTop:1}}>
              Chi tiết buổi học
            </h1>
          </div>

          {/* status badge — tappable */}
          <button
            onClick={() => setShowStatusPicker(v => !v)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl active:scale-95 transition-all"
            style={{background:stCfg.bg, border:`1.5px solid ${stCfg.border}`}}
          >
            {stCfg.dot && (
              <span className="w-2 h-2 rounded-full animate-pulse flex-shrink-0"
                    style={{background:stCfg.color}} />
            )}
            {status === 'done' && <CheckCircle2 style={{width:12,height:12,color:stCfg.color}} />}
            {status === 'cancelled' && <Ban style={{width:12,height:12,color:stCfg.color}} />}
            {status === 'pending' && <Clock style={{width:12,height:12,color:stCfg.color}} />}
            <span style={{fontSize:11,fontWeight:800,color:stCfg.color}}>{stCfg.label}</span>
          </button>
        </div>

        {/* status picker dropdown */}
        {showStatusPicker && (
          <div className="absolute right-4 top-20 z-40 rounded-2xl overflow-hidden"
               style={{background:'white', border:'1.5px solid rgba(0,0,0,0.1)', boxShadow:'0 12px 40px rgba(0,0,0,0.18)', minWidth:180}}>
            {(Object.entries(STATUS_CFG) as [SessionStatus, typeof STATUS_CFG[SessionStatus]][]).map(([key, cfg]) => (
              <button key={key}
                onClick={() => { setStatus(key); setShowStatusPicker(false); }}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left"
                style={{borderBottom:'1px solid rgba(0,0,0,0.06)', background: status === key ? cfg.bg : 'transparent'}}>
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:cfg.color}} />
                <span style={{fontSize:13,fontWeight:status===key?800:500,color:cfg.color}}>{cfg.label}</span>
                {status === key && <CheckCircle2 style={{width:14,height:14,color:cfg.color,marginLeft:'auto'}} />}
              </button>
            ))}
          </div>
        )}

        {/* class identity strip */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
               style={{background:'rgba(255,255,255,0.18)'}}>
            <BookOpen style={{width:18,height:18,color:'white'}} />
          </div>
          <div className="flex-1">
            <p style={{fontSize:16,fontWeight:900,color:'white'}}>Beginner A</p>
            <p style={{fontSize:11,color:'rgba(255,255,255,0.6)'}}>Cơ bản · Lớp sáng</p>
          </div>
        </div>

        {/* meta pills */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto no-scrollbar">
          {[
            {icon:<Clock  style={{width:11,height:11}}/>, text:'18:00 – 19:30'},
            {icon:<MapPin style={{width:11,height:11}}/>, text:'Sân 1'},
            {icon:<User   style={{width:11,height:11}}/>, text:'Coach Nam'},
            {icon:<Users  style={{width:11,height:11}}/>, text:'8 học viên'},
          ].map((m,i) => (
            <div key={i} className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                 style={{background:'rgba(255,255,255,0.12)',border:'1px solid rgba(255,255,255,0.15)'}}>
              <span style={{color:'rgba(255,255,255,0.65)'}}>{m.icon}</span>
              <span style={{fontSize:11,fontWeight:600,color:'rgba(255,255,255,0.85)'}}>{m.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════
          SCROLLABLE BODY
      ════════════════════════════════════════ */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-6 space-y-4"
           onClick={() => showStatusPicker && setShowStatusPicker(false)}>

        {/* ══ 1. INFO CARD ══ */}
        <div className="bg-white rounded-2xl overflow-hidden"
             style={{border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          {/* accent top strip */}
          <div style={{height:3, background:`linear-gradient(90deg,${ACCENT},${ACCENT}88)`}} />

          {/* header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3"
               style={{borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{background:`${ACCENT}18`}}>
                <BookOpen style={{width:15,height:15,color:ACCENT}} />
              </div>
              <span style={{fontSize:15,fontWeight:900,color:'#1F2933'}}>Thông tin buổi học</span>
            </div>
            <span className="px-2.5 py-1 rounded-full"
                  style={{fontSize:10,fontWeight:800,color:'#1A7B6E',background:'rgba(42,157,143,0.12)'}}>
              Cơ bản
            </span>
          </div>

          {/* rows */}
          {[
            {icon:<CalendarDays style={{width:13,height:13,color:ACCENT}}/>, label:'Ngày',       value:'29/04/2026',      bold:false},
            {icon:<Clock        style={{width:13,height:13,color:ACCENT}}/>, label:'Giờ học',    value:'18:00 – 19:30',   bold:true },
            {icon:<MapPin       style={{width:13,height:13,color:ACCENT}}/>, label:'Sân',        value:'Sân 1',           bold:false},
            {icon:<User         style={{width:13,height:13,color:ACCENT}}/>, label:'Coach',      value:'Coach Nam',       bold:false},
            {icon:<Users        style={{width:13,height:13,color:ACCENT}}/>, label:'Học viên',   value:'8 người',         bold:false},
          ].map((row, i, arr) => (
            <div key={i}
                 className="flex items-center gap-3 px-4 py-3"
                 style={{borderBottom: i < arr.length-1 ? '1px solid rgba(0,0,0,0.06)' : 'none'}}>
              <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{background:`${ACCENT}14`}}>
                {row.icon}
              </div>
              <span className="flex-shrink-0" style={{fontSize:13,color:'#9CA3AF',width:70}}>{row.label}</span>
              <span className="flex-1 text-right"
                    style={{fontSize:14,fontWeight:row.bold?800:600,color:'#1F2933'}}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* ══ 2. SUMMARY CARD ══ */}
        <div className="bg-white rounded-2xl overflow-hidden"
             style={{border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          <div style={{height:3,background:'linear-gradient(90deg,#2A9D8F,#F4A261)'}} />

          {/* header */}
          <div className="px-4 pt-4 pb-3 flex items-center justify-between"
               style={{borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{background:'rgba(14,124,123,0.1)'}}>
                <ClipboardCheck style={{width:15,height:15,color:'#0E7C7B'}} />
              </div>
              <span style={{fontSize:15,fontWeight:900,color:'#1F2933'}}>Tổng hợp điểm danh</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span style={{fontSize:22,fontWeight:900,color:'#0E7C7B'}}>{counted}</span>
              <span style={{fontSize:13,color:'#9CA3AF',fontWeight:600}}>/{total}</span>
            </div>
          </div>

          <div className="px-4 pt-3 pb-4">
            {/* progress bar */}
            <div className="mb-1 flex items-center justify-between">
              <span style={{fontSize:12,color:'#6B7280',fontWeight:600}}>Đã điểm danh</span>
              <span style={{fontSize:12,fontWeight:800,color:'#0E7C7B'}}>{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden mb-4"
                 style={{background:'rgba(0,0,0,0.07)'}}>
              <div className="h-full rounded-full"
                   style={{width:`${pct}%`,background:'linear-gradient(90deg,#2A9D8F,#0E7C7B)',transition:'width 0.6s ease'}} />
            </div>

            {/* stat tiles */}
            <div className="grid grid-cols-5 gap-2">
              {[
                {label:'Có mặt', value:present, color:'#1A7B6E', bg:'rgba(42,157,143,0.12)',  icon:<CheckCircle2  style={{width:14,height:14}}/>},
                {label:'Trễ',    value:late,    color:'#A07B10', bg:'rgba(233,196,106,0.18)', icon:<AlertTriangle style={{width:14,height:14}}/>},
                {label:'Học bù', value:makeup,  color:'#0E7C7B', bg:'rgba(14,124,123,0.12)', icon:<BookOpen      style={{width:14,height:14}}/>},
                {label:'Vắng',   value:absent,  color:'#C85A3D', bg:'rgba(231,111,81,0.13)',  icon:<XCircle       style={{width:14,height:14}}/>},
                {label:'Nghỉ',   value:leave,   color:'#6B7280', bg:'rgba(107,114,128,0.12)', icon:<MinusCircle   style={{width:14,height:14}}/>},
              ].map((tile,i) => (
                <div key={i}
                     className="flex flex-col items-center gap-1.5 py-3 rounded-2xl"
                     style={{background:tile.bg}}>
                  <span style={{color:tile.color}}>{tile.icon}</span>
                  <span style={{fontSize:20,fontWeight:900,color:tile.color,lineHeight:1}}>{tile.value}</span>
                  <span style={{fontSize:10,fontWeight:700,color:tile.color}}>{tile.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ 3. ACTION BUTTONS ══ */}
        <div className="space-y-2.5">

          {/* Primary — Điểm danh (most prominent) */}
          <button
            onClick={onAttendance}
            disabled={isCancelled}
            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-40"
            style={{
              background:  isCancelled ? '#E5E7EB' : 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow:   isCancelled ? 'none'    : '0 8px 24px rgba(14,124,123,0.40)',
              color: 'white',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{background:'rgba(255,255,255,0.2)'}}>
                <ClipboardCheck style={{width:18,height:18,color:'white'}} />
              </div>
              <div className="text-left">
                <p style={{fontSize:16,fontWeight:900,color:'white'}}>Điểm danh</p>
                <p style={{fontSize:12,color:'rgba(255,255,255,0.7)'}}>Cập nhật trạng thái học viên</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                 style={{background:'rgba(255,255,255,0.18)'}}>
              <ChevronRight style={{width:16,height:16,color:'white'}} />
            </div>
          </button>

          {/* Secondary row: Xem HV + Hoàn tất */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Xem danh sách học viên */}
            <button
              onClick={() => setShowAllHV(v => !v)}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl active:scale-[0.98] transition-all"
              style={{
                background: 'white',
                border:     `1.5px solid ${ACCENT}35`,
                boxShadow:  '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{background:`${ACCENT}14`}}>
                <Users style={{width:17,height:17,color:ACCENT}} />
              </div>
              <span style={{fontSize:13,fontWeight:700,color:'#1F2933',textAlign:'center',lineHeight:1.3}}>
                Xem danh sách{'\n'}học viên
              </span>
            </button>

            {/* Hoàn tất buổi học */}
            <button
              onClick={() => !isCancelled && setShowComplete(true)}
              disabled={isCancelled}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl active:scale-[0.98] transition-all disabled:opacity-40"
              style={{
                background: isCancelled ? '#F3F4F6' : 'white',
                border:     '1.5px solid rgba(0,0,0,0.09)',
                boxShadow:  '0 2px 8px rgba(0,0,0,0.06)',
              }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                   style={{background:'rgba(14,124,123,0.1)'}}>
                <StopCircle style={{width:17,height:17,color:'#0E7C7B'}} />
              </div>
              <span style={{fontSize:13,fontWeight:700,color:'#1F2933',textAlign:'center',lineHeight:1.3}}>
                Hoàn tất{'\n'}buổi học
              </span>
            </button>
          </div>

          {/* Danger — Hủy buổi học */}
          {!isCancelled ? (
            <button
              onClick={() => setShowCancel(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl active:scale-[0.98] transition-all"
              style={{
                background: 'rgba(231,111,81,0.07)',
                border:     '1.5px solid rgba(231,111,81,0.28)',
                color:      '#C85A3D',
              }}
            >
              <Ban style={{width:16,height:16}} />
              <span style={{fontSize:14,fontWeight:700}}>Hủy buổi học</span>
            </button>
          ) : (
            <div
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl"
              style={{ background:'rgba(231,111,81,0.08)', border:'1.5px solid rgba(231,111,81,0.2)' }}
            >
              <Ban style={{width:16,height:16,color:'#E76F51'}} />
              <span style={{fontSize:14,fontWeight:700,color:'#E76F51'}}>Buổi học đã bị hủy</span>
            </div>
          )}
        </div>

        {/* ══ 4. STUDENT PREVIEW ══ */}
        <div className="bg-white rounded-2xl overflow-hidden"
             style={{border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>
          <div style={{height:3,background:`linear-gradient(90deg,${ACCENT},${ACCENT}55)`}} />

          {/* header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3"
               style={{borderBottom:'1px solid rgba(0,0,0,0.07)'}}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{background:`${ACCENT}14`}}>
                <Users style={{width:15,height:15,color:ACCENT}} />
              </div>
              <span style={{fontSize:15,fontWeight:900,color:'#1F2933'}}>Học viên</span>
              <span className="px-2 py-0.5 rounded-full"
                    style={{fontSize:11,fontWeight:800,color:ACCENT,background:`${ACCENT}14`}}>
                {total}
              </span>
            </div>
            <button onClick={() => setShowAllHV(v => !v)}
              className="flex items-center gap-1 active:scale-95"
              style={{fontSize:12,fontWeight:700,color:ACCENT}}>
              {showAllHV ? 'Thu gọn' : 'Xem tất cả'}
              <ChevronRight style={{width:14,height:14,transform: showAllHV ? 'rotate(270deg)' : 'rotate(90deg)', transition:'transform 0.2s'}} />
            </button>
          </div>

          {/* rows */}
          <div>
            {previewList.map((s, idx) => {
              const att = s.status ? ATTEND_CFG[s.status] : null;
              return (
                <div key={s.id}
                     className="flex items-center gap-3 px-4 py-3.5"
                     style={{borderBottom: idx < previewList.length-1 ? '1px solid rgba(0,0,0,0.06)' : 'none'}}>
                  {/* avatar */}
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                       style={{background:`${s.avatarColor}18`,border:`1.5px solid ${s.avatarColor}28`}}>
                    <span style={{fontSize:12,fontWeight:900,color:s.avatarColor}}>{s.initials}</span>
                  </div>

                  {/* name */}
                  <div className="flex-1 min-w-0">
                    <p style={{fontSize:14,fontWeight:700,color:'#1F2933'}} className="truncate">{s.name}</p>
                    <p style={{fontSize:11,color:'#9CA3AF'}}>Học viên · Beginner A</p>
                  </div>

                  {/* status chip */}
                  {att ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl flex-shrink-0"
                          style={{fontSize:12,fontWeight:700,color:att.color,background:att.bg}}>
                      {att.icon}
                      {att.label}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl flex-shrink-0"
                          style={{fontSize:12,fontWeight:600,color:'#9CA3AF',background:'rgba(0,0,0,0.05)',border:'1px dashed #D1D5DB'}}>
                      <Dot style={{width:14,height:14}} />
                      Chưa chọn
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* expand / collapse footer */}
          {!showAllHV && STUDENTS.length > 4 && (
            <button onClick={() => setShowAllHV(true)}
              className="w-full py-3.5 flex items-center justify-center gap-2 active:bg-gray-50 transition-colors"
              style={{borderTop:'1px solid rgba(0,0,0,0.07)',color:ACCENT}}>
              <Users style={{width:14,height:14}} />
              <span style={{fontSize:13,fontWeight:700}}>Xem thêm {STUDENTS.length - 4} học viên</span>
              <ChevronRight style={{width:14,height:14,transform:'rotate(90deg)'}} />
            </button>
          )}
        </div>

        {/* bottom spacer */}
        <div className="h-2" />
      </div>

      {/* ════════════════════════════════════════
          CANCEL CONFIRM DIALOG
      ════════════════════════════════════════ */}
      <CancelSessionDialog
        visible={showCancel}
        className="Beginner A"
        date="29/04/2026"
        timeStart="18:00"
        timeEnd="19:30"
        onClose={() => setShowCancel(false)}
        onConfirm={() => { setStatus('cancelled'); setShowCancel(false); }}
      />

      {/* ════════════════════════════════════════
          COMPLETE CONFIRM DIALOG
      ════════════════════════════════════════ */}
      <CompleteSessionDialog
        visible={showComplete}
        className="Beginner A"
        date="29/04/2026"
        timeStart="18:00"
        timeEnd="19:30"
        stats={{
          total,
          checked: counted,
          present, late, absent, leave,
          makeup,
        }}
        onClose={() => setShowComplete(false)}
        onConfirm={() => { setShowComplete(false); onComplete(); }}
      />
    </div>
  );
}
