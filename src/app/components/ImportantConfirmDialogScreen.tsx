import {
  ArrowLeft, AlertTriangle, Trash2, UserX, XCircle, LogOut,
  RefreshCw, Shield, CheckCircle2, Info, X
} from 'lucide-react';
import { useState } from 'react';

interface ImportantConfirmDialogScreenProps {
  onBack: () => void;
}

type DialogType = 'delete-student' | 'cancel-session' | 'deactivate-user' | 'bulk-delete' | 'restore-data' | 'logout';

interface DialogConfig {
  title: string;
  message: string;
  confirmLabel: string;
  confirmColor: string;
  confirmGradient: string;
  icon: React.ReactNode;
  iconBg: string;
  inputRequired?: boolean;
  inputPlaceholder?: string;
  inputHint?: string;
  severity: 'danger' | 'warning' | 'info';
}

const DIALOGS: Record<DialogType, DialogConfig> = {
  'delete-student': {
    title:            'Xóa học viên?',
    message:          'Học viên Trần Thị Bình và toàn bộ lịch sử điểm danh, thanh toán sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.',
    confirmLabel:     'Xóa học viên',
    confirmColor:     '#E76F51',
    confirmGradient:  'linear-gradient(135deg,#E76F51,#C85A3D)',
    icon:             <Trash2 style={{ width: 28, height: 28, color: '#E76F51' }} />,
    iconBg:           'rgba(231,111,81,0.12)',
    inputRequired:    true,
    inputPlaceholder: 'Nhập "XOA" để xác nhận',
    inputHint:        'Nhập chính xác "XOA" (chữ hoa) để tiếp tục',
    severity:         'danger',
  },
  'cancel-session': {
    title:            'Hủy buổi học?',
    message:          'Buổi học Intermediate B ngày 30/04/2026 sẽ bị hủy. Học viên đã điểm danh sẽ không bị trừ buổi.',
    confirmLabel:     'Hủy buổi học',
    confirmColor:     '#E76F51',
    confirmGradient:  'linear-gradient(135deg,#E76F51,#C85A3D)',
    icon:             <XCircle style={{ width: 28, height: 28, color: '#E76F51' }} />,
    iconBg:           'rgba(231,111,81,0.12)',
    severity:         'danger',
  },
  'deactivate-user': {
    title:            'Tạm khóa tài khoản?',
    message:          'Coach Hùng sẽ không thể đăng nhập cho đến khi được kích hoạt lại. Lớp học đang phụ trách sẽ cần phân lại coach.',
    confirmLabel:     'Tạm khóa',
    confirmColor:     '#E9C46A',
    confirmGradient:  'linear-gradient(135deg,#E9C46A,#C49A20)',
    icon:             <UserX style={{ width: 28, height: 28, color: '#A07B10' }} />,
    iconBg:           'rgba(233,196,106,0.2)',
    severity:         'warning',
  },
  'bulk-delete': {
    title:            'Xóa 5 học viên đã nghỉ?',
    message:          'Bạn đang xóa 5 học viên có trạng thái "Đã nghỉ". Toàn bộ dữ liệu liên quan sẽ bị xóa vĩnh viễn.',
    confirmLabel:     'Xóa tất cả',
    confirmColor:     '#E76F51',
    confirmGradient:  'linear-gradient(135deg,#E76F51,#C85A3D)',
    icon:             <Trash2 style={{ width: 28, height: 28, color: '#E76F51' }} />,
    iconBg:           'rgba(231,111,81,0.12)',
    inputRequired:    true,
    inputPlaceholder: 'Nhập "XOA TAT CA" để xác nhận',
    inputHint:        'Đây là hành động không thể hoàn tác',
    severity:         'danger',
  },
  'restore-data': {
    title:            'Khôi phục dữ liệu?',
    message:          'Khôi phục từ bản sao lưu 29/04/2026 08:30. Dữ liệu hiện tại sẽ bị ghi đè hoàn toàn. Đảm bảo bạn đã sao lưu dữ liệu mới nhất.',
    confirmLabel:     'Khôi phục',
    confirmColor:     '#F4A261',
    confirmGradient:  'linear-gradient(135deg,#F4A261,#D4762A)',
    icon:             <RefreshCw style={{ width: 28, height: 28, color: '#D4762A' }} />,
    iconBg:           'rgba(244,162,97,0.15)',
    severity:         'warning',
  },
  'logout': {
    title:            'Đăng xuất?',
    message:          'Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng. Dữ liệu chưa lưu có thể bị mất.',
    confirmLabel:     'Đăng xuất',
    confirmColor:     '#E76F51',
    confirmGradient:  'linear-gradient(135deg,#E76F51,#C85A3D)',
    icon:             <LogOut style={{ width: 28, height: 28, color: '#E76F51' }} />,
    iconBg:           'rgba(231,111,81,0.12)',
    severity:         'danger',
  },
};

const DEMO_BUTTONS: { id: DialogType; label: string; color: string; bg: string }[] = [
  { id: 'delete-student',  label: 'Xóa học viên',         color: '#C85A3D', bg: 'rgba(231,111,81,0.1)'  },
  { id: 'cancel-session',  label: 'Hủy buổi học',         color: '#C85A3D', bg: 'rgba(231,111,81,0.1)'  },
  { id: 'deactivate-user', label: 'Tạm khóa tài khoản',   color: '#A07B10', bg: 'rgba(233,196,106,0.15)' },
  { id: 'bulk-delete',     label: 'Xóa nhiều học viên',   color: '#C85A3D', bg: 'rgba(231,111,81,0.1)'  },
  { id: 'restore-data',    label: 'Khôi phục dữ liệu',    color: '#D4762A', bg: 'rgba(244,162,97,0.12)' },
  { id: 'logout',          label: 'Đăng xuất',            color: '#C85A3D', bg: 'rgba(231,111,81,0.1)'  },
];

export function ImportantConfirmDialogScreen({ onBack }: ImportantConfirmDialogScreenProps) {
  const [active, setActive]     = useState<DialogType | null>(null);
  const [inputVal, setInputVal] = useState('');
  const [confirmed, setConfirmed] = useState<DialogType | null>(null);

  const cfg = active ? DIALOGS[active] : null;
  const canConfirm = !cfg?.inputRequired || inputVal === cfg.inputPlaceholder?.replace('Nhập "','').replace('" để xác nhận','').replace('"','').replace('"','').split('"')[0] || false;

  // simpler: just check if input matches keyword
  const keyword = cfg?.inputPlaceholder?.match(/"([^"]+)"/)?.[1] ?? '';
  const inputOK = !cfg?.inputRequired || inputVal === keyword;

  function handleConfirm() {
    if (!inputOK || !active) return;
    setConfirmed(active);
    setActive(null);
    setInputVal('');
  }

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: 'linear-gradient(145deg,#054A49,#075E5D,#0E7C7B)' }}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center gap-3 px-4 pt-10 pb-5">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:bg-white/25">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-white/60" style={{ fontSize: 11 }}>UX Components</p>
            <h1 className="text-white" style={{ fontSize: 18, fontWeight: 800 }}>Dialog xác nhận</h1>
          </div>
          <div className="px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <p style={{ fontSize: 10, color: 'white', fontWeight: 700 }}>6 types</p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-8 space-y-5">

        {/* instruction */}
        <div className="flex items-start gap-3 px-4 py-3 rounded-2xl" style={{ background: 'rgba(14,124,123,0.07)', border: '1px solid rgba(14,124,123,0.2)' }}>
          <Info style={{ width: 16, height: 16, color: '#0E7C7B', flexShrink: 0, marginTop: 1 }} />
          <p style={{ fontSize: 13, color: '#374151', lineHeight: 1.5 }}>
            Tap các nút bên dưới để xem preview từng loại dialog xác nhận quan trọng trong ứng dụng.
          </p>
        </div>

        {/* confirmed feedback */}
        {confirmed && (
          <div className="flex items-center gap-3 px-4 py-3.5 rounded-2xl" style={{ background: 'rgba(42,157,143,0.1)', border: '1px solid rgba(42,157,143,0.3)' }}>
            <CheckCircle2 style={{ width: 18, height: 18, color: '#2A9D8F', flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1A7B6E' }}>Đã xác nhận: {DIALOGS[confirmed].title.replace('?','')}</p>
              <p style={{ fontSize: 11, color: '#2A9D8F' }}>Trong ứng dụng thực, hành động sẽ được thực hiện.</p>
            </div>
            <button onClick={() => setConfirmed(null)} className="ml-auto"><X style={{ width: 16, height: 16, color: '#9CA3AF' }} /></button>
          </div>
        )}

        {/* dialog triggers */}
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280', marginBottom: 12 }}>
            Danh sách dialog ({DEMO_BUTTONS.length})
          </p>
          <div className="space-y-2">
            {DEMO_BUTTONS.map(btn => (
              <button
                key={btn.id}
                onClick={() => { setActive(btn.id); setInputVal(''); }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border active:scale-[0.99] transition-all"
                style={{ background: btn.bg, borderColor: btn.color + '30' }}
              >
                <div className="w-2 h-2 rounded-full" style={{ background: btn.color }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: btn.color }}>{btn.label}</span>
                <div className="ml-auto px-2 py-0.5 rounded-full" style={{ background: btn.color + '20', color: btn.color, fontSize: 10, fontWeight: 700 }}>
                  {DIALOGS[btn.id].severity === 'danger' ? '🔴 Nguy hiểm' : DIALOGS[btn.id].severity === 'warning' ? '🟡 Cảnh báo' : '🔵 Thông tin'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* design notes */}
        <div className="bg-card rounded-2xl border border-border p-4 space-y-2">
          <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 4 }}>Design Notes</p>
          {[
            { icon: '🔴', text: 'Danger dialog: dùng gradient đỏ, icon Trash/X, có thể yêu cầu nhập text xác nhận' },
            { icon: '🟡', text: 'Warning dialog: màu vàng cam, cảnh báo ảnh hưởng nhưng có thể hoàn tác' },
            { icon: '✅', text: 'Luôn có nút Cancel rõ ràng và dễ bấm hơn nút Confirm (tránh misclick)' },
            { icon: '⌨️', text: 'Input xác nhận dùng cho hành động cực nguy hiểm (xóa hàng loạt, restore)' },
          ].map((n, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span style={{ fontSize: 14, flexShrink: 0 }}>{n.icon}</span>
              <p style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>{n.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Dialog overlay ── */}
      {active && cfg && (
        <div className="fixed inset-0 z-50 flex items-end" style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(3px)' }} onClick={() => { setActive(null); setInputVal(''); }}>
          <div
            className="max-w-[390px] w-full mx-auto bg-card rounded-t-3xl overflow-hidden"
            style={{ boxShadow: '0 -8px 40px rgba(0,0,0,0.25)', animation: 'slideUpIn 200ms ease both' }}
            onClick={e => e.stopPropagation()}
          >
            {/* handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            {/* severity stripe */}
            <div style={{ height: 4, background: cfg.confirmGradient }} />

            <div className="px-6 py-5">
              {/* icon */}
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: cfg.iconBg }}>
                {cfg.icon}
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 800, textAlign: 'center', marginBottom: 10 }}>{cfg.title}</h3>
              <p className="text-muted-foreground text-center mb-5" style={{ fontSize: 13, lineHeight: 1.6 }}>{cfg.message}</p>

              {/* input confirm */}
              {cfg.inputRequired && (
                <div className="mb-5">
                  <input
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    placeholder={cfg.inputPlaceholder}
                    className="w-full px-4 py-3 border-2 rounded-xl text-center focus:outline-none transition-colors"
                    style={{ fontSize: 14, borderColor: inputVal === keyword ? '#2A9D8F' : 'rgba(0,0,0,0.15)', fontWeight: 600 }}
                    autoFocus
                  />
                  {cfg.inputHint && (
                    <p className="text-muted-foreground text-center mt-1.5" style={{ fontSize: 11 }}>{cfg.inputHint}</p>
                  )}
                </div>
              )}

              {/* actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => { setActive(null); setInputVal(''); }}
                  className="flex-1 py-4 border-2 border-border rounded-2xl"
                  style={{ fontSize: 15, fontWeight: 700 }}
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={!inputOK}
                  className="flex-1 py-4 rounded-2xl text-white transition-all"
                  style={{ background: inputOK ? cfg.confirmGradient : '#E5E7EB', color: inputOK ? 'white' : '#9CA3AF', fontSize: 15, fontWeight: 700, boxShadow: inputOK ? `0 4px 14px ${cfg.confirmColor}35` : 'none' }}
                >
                  {cfg.confirmLabel}
                </button>
              </div>
              <div style={{ height: 8 }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
