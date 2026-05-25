import { useState, useRef, useEffect } from 'react';
import {
  X, CheckCircle2, PauseCircle, XCircle,
  AlertTriangle, User, Pen, ChevronRight,
  ArrowRight, Info, Clock, Shield
} from 'lucide-react';

/* ─── Status types ───────────────────────────────────────────── */
type StatusKey = 'active' | 'suspended' | 'quit';

/* ─── Status config ─────────────────────────────────────────── */
const STATUS_CFG: Record<StatusKey, {
  label:       string;
  sublabel:    string;
  description: string;
  Icon:        React.FC<{ style?: React.CSSProperties }>;
  color:       string;
  bg:          string;
  border:      string;
  dot:         string;
  gradient:    string;
}> = {
  active: {
    label:       'Đang học',
    sublabel:    'Hoạt động bình thường',
    description: 'Học viên đang tham gia lớp học và điểm danh bình thường.',
    Icon:        CheckCircle2,
    color:       '#1A7B6E',
    bg:          'rgba(42,157,143,0.1)',
    border:      'rgba(42,157,143,0.35)',
    dot:         '#2A9D8F',
    gradient:    'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
  },
  suspended: {
    label:       'Tạm nghỉ',
    sublabel:    'Dừng tạm thời',
    description: 'Học viên tạm dừng học. Số buổi còn lại được bảo lưu.',
    Icon:        PauseCircle,
    color:       '#A07B10',
    bg:          'rgba(233,196,106,0.14)',
    border:      'rgba(233,196,106,0.45)',
    dot:         '#E9C46A',
    gradient:    'linear-gradient(135deg,#926A00 0%,#C99A10 100%)',
  },
  quit: {
    label:       'Đã nghỉ',
    sublabel:    'Kết thúc hoạt động',
    description: 'Học viên đã dừng hoàn toàn. Buổi còn lại sẽ không được hoàn.',
    Icon:        XCircle,
    color:       '#C85A3D',
    bg:          'rgba(231,111,81,0.1)',
    border:      'rgba(231,111,81,0.35)',
    dot:         '#E76F51',
    gradient:    'linear-gradient(135deg,#9E1010 0%,#C62828 40%,#E76F51 100%)',
  },
};

const CURRENT_STATUS: StatusKey = 'active';   // Học viên Nguyễn Văn A đang học

const REASON_CHIPS: Partial<Record<StatusKey, string[]>> = {
  suspended: ['Nghỉ dưỡng / chấn thương', 'Bận công việc cá nhân', 'Đi du lịch', 'Chờ khai giảng lớp mới'],
  quit:      ['Không có thời gian', 'Chuyển chỗ ở', 'Lý do tài chính', 'Không còn nhu cầu'],
  active:    ['Đã hồi phục', 'Xử lý xong vấn đề cá nhân', 'Quay lại sau kỳ nghỉ'],
};

/* ─── Props ─────────────────────────────────────────────────── */
interface Props {
  onBack:    () => void;
  onConfirm: () => void;
}

/* ══════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════ */
export function ChangeStudentStatusDialogScreen({ onBack, onConfirm }: Props) {
  const [selected, setSelected]         = useState<StatusKey | null>(null);
  const [note,     setNote]             = useState('');
  const [chipNote, setChipNote]         = useState('');
  const [showCustom, setShowCustom]     = useState(false);
  const [confirmed, setConfirmed]       = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /* No-change = same as current */
  const noChange    = selected === CURRENT_STATUS;
  const canConfirm  = selected !== null && !noChange && !confirmed;
  const cfg         = selected ? STATUS_CFG[selected] : null;
  const finalNote   = showCustom ? note : chipNote;

  /* Chips for selected status */
  const chips = selected ? (REASON_CHIPS[selected] ?? []) : [];

  function handleSelect(key: StatusKey) {
    setSelected(key);
    setChipNote('');
    setNote('');
    setShowCustom(false);
  }

  function handleChip(chip: string) {
    if (chip === chipNote && !showCustom) { setChipNote(''); return; }
    setChipNote(chip);
    setShowCustom(false);
  }

  function handleCustomToggle() {
    setShowCustom(s => !s);
    setChipNote('');
    setTimeout(() => textareaRef.current?.focus(), 60);
  }

  function handleConfirm() {
    if (!canConfirm) return;
    setConfirmed(true);
    setTimeout(onConfirm, 700);
  }

  /* ─────────────────────────────────── RENDER ─── */
  return (
    <div className="flex flex-col h-screen" style={{ background:'#F7F9FA' }}>

      {/* ══ DARK OVERLAY TOP ══ */}
      <div className="flex-shrink-0 relative overflow-hidden"
           style={{ background:'linear-gradient(160deg,#0F0F0F 0%,#1A1A2E 50%,#16213E 100%)', minHeight:80 }}>
        {/* deco */}
        <div className="absolute pointer-events-none" style={{ top:-20, right:-15, width:90, height:90, borderRadius:'50%', background:'rgba(255,255,255,0.04)' }} />
        <div className="absolute pointer-events-none" style={{ bottom:10, left:30, width:50, height:50, borderRadius:'50%', background:'rgba(14,124,123,0.12)' }} />

        <div className="flex items-center justify-between px-4 pt-12 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                 style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
              <User style={{ width:16, height:16, color:'rgba(255,255,255,0.7)' }} />
            </div>
            <div>
              <p style={{ fontSize:10, color:'rgba(255,255,255,0.4)', letterSpacing:'0.06em' }}>THAY ĐỔI TRẠNG THÁI</p>
              <p style={{ fontSize:14, fontWeight:800, color:'white' }}>Đổi trạng thái học viên</p>
            </div>
          </div>
          <button onClick={onBack}
                  className="w-9 h-9 rounded-xl flex items-center justify-center active:scale-90 transition-transform"
                  style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.15)' }}>
            <X style={{ width:16, height:16, color:'rgba(255,255,255,0.7)' }} />
          </button>
        </div>
      </div>

      {/* ══ BOTTOM SHEET ══ */}
      <div className="flex-1 overflow-y-auto bg-white rounded-t-3xl -mt-4 relative z-10"
           style={{ boxShadow:'0 -8px 32px rgba(0,0,0,0.12)' }}>

        {/* drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background:'rgba(0,0,0,0.12)' }} />
        </div>

        <div className="px-4 pb-36">

          {/* ─── Student row + current status ─── */}
          <div className="flex items-center gap-3 py-4 mb-4"
               style={{ borderBottom:'1px solid rgba(0,0,0,0.08)' }}>
            {/* avatar */}
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                 style={{ background:'rgba(14,124,123,0.1)', border:'2px solid rgba(14,124,123,0.2)', fontSize:14, fontWeight:900, color:'#0E7C7B' }}>
              NA
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ fontSize:16, fontWeight:900, color:'#1F2933' }}>Nguyễn Văn A</p>
              <p style={{ fontSize:11, color:'#9CA3AF' }}>Beginner A · Coach Nam</p>
            </div>
            {/* current status chip */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl flex-shrink-0"
                 style={{ background:STATUS_CFG[CURRENT_STATUS].bg, border:`1.5px solid ${STATUS_CFG[CURRENT_STATUS].border}` }}>
              <div className="w-2 h-2 rounded-full" style={{ background:STATUS_CFG[CURRENT_STATUS].dot }} />
              <span style={{ fontSize:11, fontWeight:800, color:STATUS_CFG[CURRENT_STATUS].color }}>
                {STATUS_CFG[CURRENT_STATUS].label}
              </span>
            </div>
          </div>

          {/* ─── Question ─── */}
          <div className="mb-5">
            <p style={{ fontSize:15, fontWeight:800, color:'#1F2933', lineHeight:1.4 }}>
              Bạn muốn chuyển{' '}
              <span style={{ color:'#0E7C7B' }}>Nguyễn Văn A</span>{' '}
              sang trạng thái nào?
            </p>
            <p style={{ fontSize:12, color:'#9CA3AF', marginTop:4, fontWeight:500 }}>
              Chọn một trong các trạng thái bên dưới.
            </p>
          </div>

          {/* ─── Status options ─── */}
          <div className="space-y-3 mb-5">
            {(Object.entries(STATUS_CFG) as [StatusKey, typeof STATUS_CFG.active][]).map(([key, c]) => {
              const isSelected = selected === key;
              const isCurrent  = key === CURRENT_STATUS;

              return (
                <button key={key}
                        onClick={() => handleSelect(key)}
                        className="w-full text-left transition-all active:scale-98"
                        style={{ transform: isSelected ? 'scale(1)' : undefined }}>
                  <div className="rounded-2xl overflow-hidden"
                       style={{
                         border:     `2px solid ${isSelected ? c.border : 'rgba(0,0,0,0.09)'}`,
                         boxShadow:  isSelected ? `0 6px 20px ${c.color}22` : '0 1px 4px rgba(0,0,0,0.05)',
                         background: isSelected ? c.bg : 'white',
                         transition: 'all 0.2s ease',
                       }}>

                    {/* left accent */}
                    <div className="flex items-start gap-3.5 p-4">
                      {/* custom radio + icon */}
                      <div className="flex-shrink-0 flex flex-col items-center gap-2 pt-0.5">
                        {/* radio circle */}
                        <div className="w-5 h-5 rounded-full flex items-center justify-center"
                             style={{
                               border:     `2px solid ${isSelected ? c.dot : 'rgba(0,0,0,0.2)'}`,
                               background: isSelected ? c.dot       : 'transparent',
                               transition: 'all 0.15s ease',
                             }}>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-white" />
                          )}
                        </div>
                      </div>

                      {/* content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <c.Icon style={{ width:16, height:16, color: isSelected ? c.color : '#9CA3AF' }} />
                          <span style={{ fontSize:15, fontWeight:900, color: isSelected ? c.color : '#374151' }}>
                            {c.label}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full"
                                  style={{ fontSize:9, fontWeight:800, color:'#6B7280', background:'rgba(0,0,0,0.07)' }}>
                              Hiện tại
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize:11, fontWeight:700, color: isSelected ? c.color + 'CC' : '#9CA3AF' }}>
                          {c.sublabel}
                        </p>
                        {isSelected && (
                          <p style={{ fontSize:12, color: c.color + 'BB', marginTop:5, lineHeight:1.5 }}>
                            {c.description}
                          </p>
                        )}
                      </div>

                      {/* right arrow if selected */}
                      {isSelected && (
                        <div className="flex-shrink-0 w-7 h-7 rounded-xl flex items-center justify-center"
                             style={{ background: c.bg, border:`1px solid ${c.border}` }}>
                          <ChevronRight style={{ width:13, height:13, color:c.color }} />
                        </div>
                      )}
                    </div>

                    {/* bottom impact line */}
                    {isSelected && (
                      <div className="h-0.5" style={{ background: c.gradient }} />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* ─── No-change notice ─── */}
          {noChange && (
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-4"
                 style={{ background:'rgba(0,0,0,0.05)', border:'1px solid rgba(0,0,0,0.1)' }}>
              <Info style={{ width:13, height:13, color:'#9CA3AF', flexShrink:0 }} />
              <p style={{ fontSize:12, color:'#6B7280', fontWeight:600 }}>
                Học viên đã ở trạng thái <strong>{STATUS_CFG[CURRENT_STATUS].label}</strong>. Vui lòng chọn trạng thái khác.
              </p>
            </div>
          )}

          {/* ─── Warning khi chọn "Đã nghỉ" ─── */}
          {selected === 'quit' && (
            <div className="rounded-2xl overflow-hidden mb-4"
                 style={{ border:'1.5px solid rgba(231,111,81,0.4)', boxShadow:'0 4px 16px rgba(231,111,81,0.12)' }}>

              {/* header */}
              <div className="flex items-center gap-2.5 px-4 py-3"
                   style={{ background:'rgba(231,111,81,0.12)', borderBottom:'1px solid rgba(231,111,81,0.25)' }}>
                <AlertTriangle style={{ width:14, height:14, color:'#C85A3D', flexShrink:0 }} />
                <span style={{ fontSize:12, fontWeight:900, color:'#C85A3D' }}>Cảnh báo — Thao tác quan trọng</span>
              </div>

              {/* body */}
              <div className="px-4 py-3.5 space-y-2.5" style={{ background:'rgba(255,248,246,0.95)' }}>
                <div className="flex items-start gap-2.5">
                  <XCircle style={{ width:13, height:13, color:'#E76F51', flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:12, color:'#C85A3D', lineHeight:1.55, fontWeight:600 }}>
                    Học viên đã nghỉ sẽ không xuất hiện trong danh sách điểm danh mặc định.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Clock style={{ width:13, height:13, color:'#E76F51', flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:12, color:'#C85A3D', lineHeight:1.55, fontWeight:600 }}>
                    Số buổi còn lại ({7} buổi) sẽ bị hủy và không hoàn lại.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Shield style={{ width:13, height:13, color:'#E76F51', flexShrink:0, marginTop:1 }} />
                  <p style={{ fontSize:12, color:'#C85A3D', lineHeight:1.55, fontWeight:600 }}>
                    Dữ liệu lịch sử vẫn được lưu lại để truy vấn sau.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ─── Warning khi chọn "Tạm nghỉ" ─── */}
          {selected === 'suspended' && (
            <div className="flex items-start gap-2.5 px-4 py-3 rounded-2xl mb-4"
                 style={{ background:'rgba(233,196,106,0.12)', border:'1.5px solid rgba(233,196,106,0.35)' }}>
              <PauseCircle style={{ width:13, height:13, color:'#A07B10', flexShrink:0, marginTop:1 }} />
              <p style={{ fontSize:12, color:'#926A00', lineHeight:1.55, fontWeight:600 }}>
                Số buổi còn lại (7 buổi) được giữ nguyên. Học viên có thể quay lại học bình thường.
              </p>
            </div>
          )}

          {/* ─── Ghi chú (chỉ khi đã chọn & không phải trạng thái hiện tại) ─── */}
          {selected && !noChange && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center"
                     style={{ background: cfg ? cfg.bg : 'rgba(0,0,0,0.06)' }}>
                  <Pen style={{ width:11, height:11, color: cfg ? cfg.color : '#6B7280' }} />
                </div>
                <span style={{ fontSize:11, fontWeight:800, color:'#6B7280', letterSpacing:'0.05em' }}>
                  GHI CHÚ LÝ DO
                </span>
                <span className="px-2 py-0.5 rounded-full"
                      style={{ fontSize:9, fontWeight:700, color:'#9CA3AF', background:'rgba(0,0,0,0.06)' }}>
                  Không bắt buộc
                </span>
              </div>

              <div className="bg-white rounded-2xl overflow-hidden"
                   style={{ border:'1.5px solid rgba(0,0,0,0.09)', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>

                {/* Chips */}
                {chips.length > 0 && (
                  <div className="p-4 pb-3" style={{ borderBottom:'1px solid rgba(0,0,0,0.07)' }}>
                    <p style={{ fontSize:10, color:'#9CA3AF', fontWeight:700, marginBottom:10 }}>
                      CHỌN NHANH
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {chips.map(chip => {
                        const active = chipNote === chip && !showCustom;
                        return (
                          <button key={chip} onClick={() => handleChip(chip)}
                                  className="px-3 py-2 rounded-xl active:scale-95 transition-all"
                                  style={{
                                    fontSize:11, fontWeight: active ? 800 : 600,
                                    background: active ? (cfg?.bg ?? 'rgba(0,0,0,0.07)') : 'rgba(0,0,0,0.05)',
                                    border:     `1.5px solid ${active ? (cfg?.border ?? 'transparent') : 'transparent'}`,
                                    color:      active ? (cfg?.color ?? '#374151') : '#6B7280',
                                  }}>
                            {active && '✓ '}{chip}
                          </button>
                        );
                      })}
                      <button onClick={handleCustomToggle}
                              className="px-3 py-2 rounded-xl active:scale-95 transition-all flex items-center gap-1.5"
                              style={{
                                fontSize:11, fontWeight: showCustom ? 800 : 600,
                                background: showCustom ? (cfg?.bg ?? 'rgba(0,0,0,0.07)') : 'rgba(0,0,0,0.05)',
                                border:     `1.5px solid ${showCustom ? (cfg?.border ?? 'transparent') : 'transparent'}`,
                                color:      showCustom ? (cfg?.color ?? '#374151') : '#6B7280',
                              }}>
                        <Pen style={{ width:10, height:10 }} /> Khác...
                      </button>
                    </div>
                  </div>
                )}

                {/* Custom textarea */}
                {(showCustom || chips.length === 0) && (
                  <div className="px-4 py-3" style={{ borderBottom: chipNote ? '1px solid rgba(0,0,0,0.06)' : 'none' }}>
                    <textarea
                      ref={textareaRef}
                      value={note}
                      onChange={e => setNote(e.target.value)}
                      placeholder="Nhập ghi chú lý do thay đổi..."
                      rows={3}
                      className="w-full resize-none focus:outline-none"
                      style={{ fontSize:13, color:'#1F2933', lineHeight:1.6, background:'transparent', border:'none' }}
                    />
                    <div className="flex justify-end">
                      <span style={{ fontSize:10, color:'#C0C7D0' }}>{note.length}/200</span>
                    </div>
                  </div>
                )}

                {/* Selected chip preview */}
                {!showCustom && chipNote && (
                  <div className="flex items-center gap-2 px-4 py-3"
                       style={{ background: cfg ? cfg.bg + '60' : 'rgba(0,0,0,0.03)' }}>
                    <CheckCircle2 style={{ width:12, height:12, color: cfg?.color ?? '#2A9D8F', flexShrink:0 }} />
                    <p style={{ fontSize:12, color: cfg?.color ?? '#374151', fontWeight:700 }}>{chipNote}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── Transition preview ─── */}
          {selected && !noChange && (
            <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-2"
                 style={{ background:'rgba(0,0,0,0.04)', border:'1px solid rgba(0,0,0,0.08)' }}>
              {/* from */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                   style={{ background:STATUS_CFG[CURRENT_STATUS].bg, border:`1px solid ${STATUS_CFG[CURRENT_STATUS].border}` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background:STATUS_CFG[CURRENT_STATUS].dot }} />
                <span style={{ fontSize:11, fontWeight:800, color:STATUS_CFG[CURRENT_STATUS].color }}>
                  {STATUS_CFG[CURRENT_STATUS].label}
                </span>
              </div>
              <ArrowRight style={{ width:14, height:14, color:'#9CA3AF', flexShrink:0 }} />
              {/* to */}
              {cfg && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl"
                     style={{ background:cfg.bg, border:`1px solid ${cfg.border}` }}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background:cfg.dot }} />
                  <span style={{ fontSize:11, fontWeight:800, color:cfg.color }}>{cfg.label}</span>
                </div>
              )}
              <span style={{ fontSize:10, color:'#9CA3AF', marginLeft:'auto', fontWeight:600 }}>
                Nguyễn Văn A
              </span>
            </div>
          )}

        </div>
      </div>

      {/* ══ FIXED FOOTER ══ */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[390px] mx-auto z-20 bg-white px-4 pb-8 pt-3"
           style={{ borderTop:'1px solid rgba(0,0,0,0.09)', boxShadow:'0 -8px 28px rgba(0,0,0,0.09)' }}>

        <div className="flex gap-3">
          {/* Hủy */}
          <button onClick={onBack}
                  className="flex items-center justify-center gap-2 rounded-2xl active:scale-95 transition-all"
                  style={{
                    width:80, flexShrink:0,
                    paddingTop:15, paddingBottom:15,
                    background:'rgba(0,0,0,0.05)', border:'1.5px solid rgba(0,0,0,0.1)',
                    fontSize:14, fontWeight:700, color:'#6B7280',
                  }}>
            <X style={{ width:14, height:14 }} /> Hủy
          </button>

          {/* Cập nhật */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-between px-4 rounded-2xl transition-all"
            style={{
              paddingTop:15, paddingBottom:15,
              background: canConfirm
                ? (cfg?.gradient ?? 'rgba(0,0,0,0.07)')
                : 'rgba(0,0,0,0.07)',
              boxShadow: canConfirm ? `0 8px 24px ${cfg?.color ?? '#000'}35` : 'none',
              cursor:    canConfirm ? 'pointer' : 'not-allowed',
              opacity:   confirmed ? 0.7 : 1,
              transition:'all 0.3s ease',
            }}>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: canConfirm ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.07)' }}>
                {confirmed
                  ? <CheckCircle2 style={{ width:15, height:15, color:'white' }} />
                  : cfg
                    ? <cfg.Icon style={{ width:15, height:15, color: canConfirm ? 'white' : '#9CA3AF' }} />
                    : <User style={{ width:15, height:15, color:'#9CA3AF' }} />
                }
              </div>
              <div className="text-left">
                <p style={{ fontSize:14, fontWeight:900, color: canConfirm ? 'white' : '#9CA3AF' }}>
                  {confirmed ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
                </p>
                <p style={{ fontSize:10, color: canConfirm ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.3)' }}>
                  {canConfirm
                    ? `→ ${cfg?.label}`
                    : noChange
                      ? 'Trạng thái không thay đổi'
                      : 'Chọn một trạng thái để tiếp tục'}
                </p>
              </div>
            </div>

            {canConfirm && (
              <div className="px-2 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.2)' }}>
                <ChevronRight style={{ width:16, height:16, color:'white' }} />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
