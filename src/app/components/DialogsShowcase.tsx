import {
  ArrowLeft, AlertTriangle, LogOut, CalendarX2,
  CheckCircle2, Users, CalendarDays, Shield,
  Plus, X, Zap, UserRoundX
} from 'lucide-react';
import { useState } from 'react';
import { OutOfSessionsWarningDialog } from './OutOfSessionsWarningDialog';
import { AttendanceSavedSuccessDialog } from './AttendanceSavedSuccessDialog';

interface DialogsShowcaseProps {
  onBack: () => void;
}

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type DialogId = 'expired-session' | 'logout' | 'cancel-class' | 'save-success' | 'out-of-sessions' | 'attendance-saved' | null;
type TabType  = 'dialogs' | 'empty';

/* ─────────────────────────────────────────
   SHARED OVERLAY WRAPPER
───────────────────────────────────────── */
function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[390px]"
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DIALOG 1 — Học viên đã hết buổi
───────────────────────────────────────── */
function DialogExpiredSession({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div className="bg-card rounded-t-3xl overflow-hidden" style={{ boxShadow: '0 -12px 48px rgba(0,0,0,0.22)' }}>
        {/* handle */}
        <div className="flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-6 pt-5 pb-2 text-center">
          {/* icon */}
          <div className="flex items-center justify-center mb-4">
            <div
              className="w-18 h-18 rounded-full flex items-center justify-center"
              style={{ width: 72, height: 72, background: 'rgba(244,162,97,0.14)', border: '6px solid rgba(244,162,97,0.22)' }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ width: 52, height: 52, background: 'rgba(244,162,97,0.22)' }}
              >
                <UserRoundX style={{ width: 26, height: 26, color: '#F4A261' }} />
              </div>
            </div>
          </div>

          {/* label badge */}
          <div className="flex justify-center mb-2">
            <span
              className="px-3 py-1 rounded-full"
              style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(244,162,97,0.15)', color: '#D4762A', border: '1px solid rgba(244,162,97,0.3)' }}
            >
              Cảnh báo
            </span>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: 8 }}>Học viên đã hết buổi</h2>
          <p className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: 1.6 }}>
            Học viên này đã <span style={{ fontWeight: 700, color: '#F4A261' }}>hết buổi học</span>.
            Bạn vẫn muốn tiếp tục điểm danh?
          </p>
        </div>

        {/* info strip */}
        <div
          className="mx-6 mt-4 mb-4 px-4 py-3 rounded-2xl flex items-center gap-2.5"
          style={{ background: 'rgba(244,162,97,0.09)', border: '1px solid rgba(244,162,97,0.25)' }}
        >
          <AlertTriangle style={{ width: 15, height: 15, color: '#F4A261', flexShrink: 0 }} />
          <p style={{ fontSize: '12px', color: '#A07B10', lineHeight: 1.5 }}>
            Buổi học sẽ được ghi nhận nhưng học viên cần gia hạn gói học.
          </p>
        </div>

        {/* buttons */}
        <div className="flex gap-3 px-6 pb-8">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-border active:bg-muted/40 transition-colors"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-white active:opacity-80 transition-opacity"
            style={{
              fontSize: '14px', fontWeight: 700,
              background: 'linear-gradient(135deg,#F4A261,#D4762A)',
              boxShadow: '0 4px 16px rgba(244,162,97,0.42)',
            }}
          >
            Vẫn lưu
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────────────────────────────
   DIALOG 2 — Đăng xuất
───────────────────────────────────────── */
function DialogLogout({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div className="bg-card rounded-t-3xl overflow-hidden" style={{ boxShadow: '0 -12px 48px rgba(0,0,0,0.22)' }}>
        <div className="flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-6 pt-5 pb-2 text-center">
          <div className="flex items-center justify-center mb-4">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 72, height: 72, background: 'rgba(231,111,81,0.12)', border: '6px solid rgba(231,111,81,0.18)' }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: 52, height: 52, background: 'rgba(231,111,81,0.2)' }}
              >
                <LogOut style={{ width: 24, height: 24, color: '#E76F51' }} />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <span
              className="px-3 py-1 rounded-full"
              style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(231,111,81,0.12)', color: '#C85A3D', border: '1px solid rgba(231,111,81,0.25)' }}
            >
              Xác nhận
            </span>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: 8 }}>Đăng xuất</h2>
          <p className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: 1.6 }}>
            Bạn có chắc muốn <span style={{ fontWeight: 700, color: '#E76F51' }}>đăng xuất</span>?
            Bạn sẽ cần đăng nhập lại để sử dụng ứng dụng.
          </p>
        </div>

        <div className="flex gap-3 px-6 pt-5 pb-8">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-border active:bg-muted/40 transition-colors"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            Hủy
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-white active:opacity-80 transition-opacity"
            style={{
              fontSize: '14px', fontWeight: 700,
              background: 'linear-gradient(135deg,#E76F51,#C85A3D)',
              boxShadow: '0 4px 16px rgba(231,111,81,0.4)',
            }}
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────────────────────────────
   DIALOG 3 — Hủy buổi học
───────────────────────────────────────── */
function DialogCancelClass({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      <div className="bg-card rounded-t-3xl overflow-hidden" style={{ boxShadow: '0 -12px 48px rgba(0,0,0,0.22)' }}>
        <div className="flex justify-center pt-3 pb-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-6 pt-5 pb-2 text-center">
          <div className="flex items-center justify-center mb-4">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 72, height: 72, background: 'rgba(231,111,81,0.11)', border: '6px solid rgba(231,111,81,0.18)' }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: 52, height: 52, background: 'rgba(231,111,81,0.2)' }}
              >
                <CalendarX2 style={{ width: 25, height: 25, color: '#E76F51' }} />
              </div>
            </div>
          </div>

          <div className="flex justify-center mb-2">
            <span
              className="px-3 py-1 rounded-full"
              style={{ fontSize: '11px', fontWeight: 700, background: 'rgba(231,111,81,0.12)', color: '#C85A3D', border: '1px solid rgba(231,111,81,0.25)' }}
            >
              Không thể hoàn tác
            </span>
          </div>

          <h2 style={{ fontSize: '18px', fontWeight: 800, marginBottom: 8 }}>Hủy buổi học</h2>
          <p className="text-muted-foreground" style={{ fontSize: '14px', lineHeight: 1.6 }}>
            Bạn có chắc muốn <span style={{ fontWeight: 700, color: '#E76F51' }}>hủy buổi học</span> này?
            Hành động này không thể hoàn tác.
          </p>
        </div>

        {/* affected info */}
        <div
          className="mx-6 mt-4 mb-4 px-4 py-3 rounded-2xl"
          style={{ background: 'rgba(231,111,81,0.07)', border: '1px solid rgba(231,111,81,0.2)' }}
        >
          <p className="text-center" style={{ fontSize: '12px', color: '#C85A3D', fontWeight: 600 }}>
            Buổi học: Beginner A — 07:00 Thứ Tư
          </p>
          <p className="text-center text-muted-foreground mt-0.5" style={{ fontSize: '11px' }}>
            8 học viên đã đăng ký sẽ bị ảnh hưởng
          </p>
        </div>

        <div className="flex gap-3 px-6 pb-8">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-border active:bg-muted/40 transition-colors"
            style={{ fontSize: '14px', fontWeight: 600 }}
          >
            Không
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl text-white active:opacity-80 transition-opacity"
            style={{
              fontSize: '14px', fontWeight: 700,
              background: 'linear-gradient(135deg,#E76F51,#C85A3D)',
              boxShadow: '0 4px 16px rgba(231,111,81,0.38)',
            }}
          >
            Hủy buổi
          </button>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────────────────────────────
   DIALOG 4 — Lưu thành công (centered)
───────────────────────────────────────── */
function DialogSaveSuccess({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      {/* center override */}
      <div
        className="fixed inset-0 flex items-center justify-center px-8 z-50"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(2px)' }}
      >
        <div
          className="w-full max-w-[300px] bg-card rounded-3xl overflow-hidden text-center"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* success ring animation */}
          <div className="pt-8 pb-4 flex justify-center">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 80, height: 80, background: 'rgba(42,157,143,0.12)', border: '6px solid rgba(42,157,143,0.2)' }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: 60, height: 60, background: 'rgba(42,157,143,0.22)' }}
              >
                <CheckCircle2 style={{ width: 32, height: 32, color: '#2A9D8F' }} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: '20px', fontWeight: 800, color: '#0E7C7B' }}>Thành công!</p>
          <p className="text-muted-foreground mt-2 px-6" style={{ fontSize: '14px', lineHeight: 1.55 }}>
            Đã lưu thành công.
          </p>

          {/* auto-dismiss hint */}
          <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>
            Tự động đóng sau 2 giây
          </p>

          <div className="px-6 pb-6 mt-5">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl text-white"
              style={{
                fontSize: '14px', fontWeight: 700,
                background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
                boxShadow: '0 4px 16px rgba(14,124,123,0.38)',
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────────────────────────────
   DIALOG 5 — Lưu điểm danh thành công (centered)
───────────────────────────────────────── */
function DialogAttendanceSaved({ onClose }: { onClose: () => void }) {
  return (
    <Overlay onClose={onClose}>
      {/* center override */}
      <div
        className="fixed inset-0 flex items-center justify-center px-8 z-50"
        onClick={onClose}
        style={{ background: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(2px)' }}
      >
        <div
          className="w-full max-w-[300px] bg-card rounded-3xl overflow-hidden text-center"
          style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
          onClick={e => e.stopPropagation()}
        >
          {/* success ring animation */}
          <div className="pt-8 pb-4 flex justify-center">
            <div
              className="rounded-full flex items-center justify-center"
              style={{ width: 80, height: 80, background: 'rgba(42,157,143,0.12)', border: '6px solid rgba(42,157,143,0.2)' }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{ width: 60, height: 60, background: 'rgba(42,157,143,0.22)' }}
              >
                <CheckCircle2 style={{ width: 32, height: 32, color: '#2A9D8F' }} />
              </div>
            </div>
          </div>

          <p style={{ fontSize: '20px', fontWeight: 800, color: '#0E7C7B' }}>Thành công!</p>
          <p className="text-muted-foreground mt-2 px-6" style={{ fontSize: '14px', lineHeight: 1.55 }}>
            Đã lưu điểm danh thành công.
          </p>

          {/* auto-dismiss hint */}
          <p className="text-muted-foreground mt-1" style={{ fontSize: '11px' }}>
            Tự động đóng sau 2 giây
          </p>

          <div className="px-6 pb-6 mt-5">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl text-white"
              style={{
                fontSize: '14px', fontWeight: 700,
                background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
                boxShadow: '0 4px 16px rgba(14,124,123,0.38)',
              }}
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </Overlay>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE 1 — Chưa có học viên
───────────────────────────────────────── */
function EmptyStudents({ onAdd }: { onAdd?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8">
      {/* illustration */}
      <div className="relative mb-5">
        <div
          className="rounded-full flex items-center justify-center"
          style={{ width: 96, height: 96, background: 'rgba(14,124,123,0.08)', border: '3px dashed rgba(14,124,123,0.2)' }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 68, height: 68, background: 'rgba(14,124,123,0.13)' }}
          >
            <Users style={{ width: 32, height: 32, color: '#0E7C7B' }} />
          </div>
        </div>
        {/* plus badge */}
        <div
          className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
          style={{ width: 28, height: 28, background: '#F4A261', border: '3px solid white', boxShadow: '0 2px 8px rgba(244,162,97,0.5)' }}
        >
          <Plus style={{ width: 14, height: 14, color: 'white' }} />
        </div>
      </div>

      <p style={{ fontSize: '17px', fontWeight: 800 }}>Chưa có học viên</p>
      <p className="text-muted-foreground text-center mt-1.5" style={{ fontSize: '13px', lineHeight: 1.55 }}>
        Chưa có học viên nào.{'\n'}
        Thêm học viên đầu tiên để bắt đầu!
      </p>

      <button
        onClick={onAdd}
        className="mt-5 flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white active:opacity-85 transition-opacity"
        style={{
          background: 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
          boxShadow: '0 4px 16px rgba(14,124,123,0.36)',
          fontSize: '14px', fontWeight: 700,
        }}
      >
        <Plus style={{ width: 18, height: 18 }} />
        Thêm học viên
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE 2 — Chưa có lớp hôm nay
───────────────────────────────────────── */
function EmptyTodayClasses({ onCreate }: { onCreate?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8">
      <div className="relative mb-5">
        <div
          className="rounded-full flex items-center justify-center"
          style={{ width: 96, height: 96, background: 'rgba(129,90,213,0.08)', border: '3px dashed rgba(129,90,213,0.22)' }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 68, height: 68, background: 'rgba(129,90,213,0.14)' }}
          >
            <CalendarDays style={{ width: 32, height: 32, color: '#815AD5' }} />
          </div>
        </div>
        <div
          className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
          style={{ width: 28, height: 28, background: '#F4A261', border: '3px solid white', boxShadow: '0 2px 8px rgba(244,162,97,0.5)' }}
        >
          <Zap style={{ width: 14, height: 14, color: 'white' }} />
        </div>
      </div>

      <p style={{ fontSize: '17px', fontWeight: 800 }}>Chưa có buổi học</p>
      <p className="text-muted-foreground text-center mt-1.5" style={{ fontSize: '13px', lineHeight: 1.55 }}>
        Hôm nay chưa có buổi học nào.{'\n'}
        Tạo buổi học để bắt đầu ngày mới!
      </p>

      <button
        onClick={onCreate}
        className="mt-5 flex items-center gap-2 px-6 py-3.5 rounded-2xl text-white active:opacity-85 transition-opacity"
        style={{
          background: 'linear-gradient(135deg,#815AD5,#6B46C1)',
          boxShadow: '0 4px 16px rgba(129,90,213,0.36)',
          fontSize: '14px', fontWeight: 700,
        }}
      >
        <Plus style={{ width: 18, height: 18 }} />
        Tạo buổi học hôm nay
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE 3 — Không có HV sắp hết buổi
───────────────────────────────────────── */
function EmptyExpiringStudents() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-8">
      <div className="relative mb-5">
        <div
          className="rounded-full flex items-center justify-center"
          style={{ width: 96, height: 96, background: 'rgba(42,157,143,0.09)', border: '3px dashed rgba(42,157,143,0.25)' }}
        >
          <div
            className="rounded-full flex items-center justify-center"
            style={{ width: 68, height: 68, background: 'rgba(42,157,143,0.18)' }}
          >
            <Shield style={{ width: 32, height: 32, color: '#2A9D8F' }} />
          </div>
        </div>
        <div
          className="absolute -bottom-1 -right-1 rounded-full flex items-center justify-center"
          style={{ width: 28, height: 28, background: '#2A9D8F', border: '3px solid white', boxShadow: '0 2px 8px rgba(42,157,143,0.45)' }}
        >
          <CheckCircle2 style={{ width: 14, height: 14, color: 'white' }} />
        </div>
      </div>

      <p style={{ fontSize: '17px', fontWeight: 800 }}>Tất cả ổn!</p>
      <p className="text-muted-foreground text-center mt-1.5" style={{ fontSize: '13px', lineHeight: 1.6 }}>
        Không có học viên nào sắp hết buổi.
      </p>

      <div
        className="mt-4 flex items-center gap-2.5 px-5 py-3 rounded-2xl"
        style={{ background: 'rgba(42,157,143,0.1)', border: '1px solid rgba(42,157,143,0.28)' }}
      >
        <CheckCircle2 style={{ width: 17, height: 17, color: '#2A9D8F', flexShrink: 0 }} />
        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0E7C7B' }}>
          Tình hình lớp học đang ổn.
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   SHOWCASE PREVIEW CARD
───────────────────────────────────────── */
interface PreviewCardProps {
  label:    string;
  sublabel: string;
  type:     'warning' | 'danger' | 'success';
  onOpen:   () => void;
}

const TYPE_CFG = {
  warning: { color: '#F4A261', bg: 'rgba(244,162,97,0.12)', border: 'rgba(244,162,97,0.3)',  dot: '#F4A261' },
  danger:  { color: '#E76F51', bg: 'rgba(231,111,81,0.1)',  border: 'rgba(231,111,81,0.28)', dot: '#E76F51' },
  success: { color: '#2A9D8F', bg: 'rgba(42,157,143,0.1)',  border: 'rgba(42,157,143,0.28)', dot: '#2A9D8F' },
};

function PreviewCard({ label, sublabel, type, onOpen }: PreviewCardProps) {
  const cfg = TYPE_CFG[type];
  return (
    <div
      className="bg-card rounded-2xl border overflow-hidden shadow-sm"
      style={{ borderColor: cfg.border }}
    >
      {/* mock dialog preview */}
      <div
        className="px-4 py-3 flex items-center gap-2.5"
        style={{ background: cfg.bg }}
      >
        <div
          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: cfg.dot, boxShadow: `0 0 6px ${cfg.dot}` }}
        />
        <span style={{ fontSize: '13px', fontWeight: 700, color: cfg.color }}>{label}</span>
      </div>

      <div className="px-4 py-3">
        <p className="text-muted-foreground" style={{ fontSize: '12px', lineHeight: 1.5 }}>{sublabel}</p>
        <button
          onClick={onOpen}
          className="mt-3 w-full py-2.5 rounded-xl text-white active:opacity-80 transition-opacity"
          style={{
            fontSize: '12px', fontWeight: 700,
            background: cfg.color,
            boxShadow: `0 3px 10px ${cfg.color}40`,
          }}
        >
          Xem dialog →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN SHOWCASE
───────────────────────────────────────── */
export function DialogsShowcase({ onBack }: DialogsShowcaseProps) {
  const [openDialog, setOpenDialog] = useState<DialogId>(null);
  const [tab, setTab]               = useState<TabType>('dialogs');

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* active dialog overlays */}
      {openDialog === 'expired-session' && <DialogExpiredSession onClose={() => setOpenDialog(null)} />}
      {openDialog === 'logout'          && <DialogLogout         onClose={() => setOpenDialog(null)} />}
      {openDialog === 'cancel-class'    && <DialogCancelClass    onClose={() => setOpenDialog(null)} />}
      {openDialog === 'save-success'    && <DialogSaveSuccess    onClose={() => setOpenDialog(null)} />}
      {openDialog === 'out-of-sessions' && (
        <OutOfSessionsWarningDialog 
          isOpen={true} 
          onClose={() => setOpenDialog(null)} 
          onConfirm={() => console.log('Confirmed!')}
        />
      )}
      {openDialog === 'attendance-saved' && (
        <AttendanceSavedSuccessDialog
          isOpen={true}
          onClose={() => setOpenDialog(null)}
          onViewDetail={() => {
            console.log('View detail');
            setOpenDialog(null);
          }}
          onBackToClasses={() => {
            console.log('Back to classes');
            setOpenDialog(null);
          }}
        />
      )}

      {/* ── Header ── */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg,#054A49 0%,#075E5D 50%,#0E7C7B 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-14 -right-3 w-20 h-20 rounded-full bg-white/4 pointer-events-none" />

        <div className="flex items-center gap-3 px-4 pt-10 pb-4">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Dialogs & Empty States</h1>
            <p className="text-white/55" style={{ fontSize: '11px' }}>Bộ component dùng chung</p>
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.12)' }}
          >
            <span className="text-white/70" style={{ fontSize: '11px', fontWeight: 600 }}>6 + 3</span>
          </div>
        </div>

        {/* tab bar inside header */}
        <div className="flex px-4 pb-0 gap-1">
          {([
            { id: 'dialogs', label: '💬 Dialogs (6)' },
            { id: 'empty',   label: '📭 Empty States (3)' },
          ] as { id: TabType; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="px-4 py-2.5 rounded-t-xl transition-colors"
              style={{
                fontSize: '12px', fontWeight: tab === t.id ? 700 : 500,
                background: tab === t.id ? 'var(--background)' : 'rgba(255,255,255,0.1)',
                color: tab === t.id ? '#0E7C7B' : 'rgba(255,255,255,0.75)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ══ Body ══ */}
      <div className="flex-1 overflow-y-auto">

        {tab === 'dialogs' ? (
          <div className="px-4 py-4 space-y-4">

            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
              Nhấn <span style={{ fontWeight: 700 }}>"Xem dialog →"</span> để xem overlay thực tế.
            </p>

            {/* ── Dialog 1 ── */}
            <PreviewCard
              label="Học viên đã hết buổi"
              sublabel='Học viên này đã hết buổi. Bạn vẫn muốn tiếp tục điểm danh?'
              type="warning"
              onOpen={() => setOpenDialog('expired-session')}
            />

            {/* ── Dialog 2 ── */}
            <PreviewCard
              label="Đăng xuất"
              sublabel="Bạn có chắc muốn đăng xuất?"
              type="danger"
              onOpen={() => setOpenDialog('logout')}
            />

            {/* ── Dialog 3 ── */}
            <PreviewCard
              label="Hủy buổi học"
              sublabel="Bạn có chắc muốn hủy buổi học này? Hành động không thể hoàn tác."
              type="danger"
              onOpen={() => setOpenDialog('cancel-class')}
            />

            {/* ── Dialog 4 ── */}
            <PreviewCard
              label="Lưu thành công"
              sublabel='Đã lưu thành công. Centered modal với auto-dismiss.'
              type="success"
              onOpen={() => setOpenDialog('save-success')}
            />

            {/* ── Dialog 5 (NEW) ── */}
            <PreviewCard
              label="Cảnh báo hết buổi có checkbox"
              sublabel='Học viên còn 0 buổi. Phải tick checkbox xác nhận mới cho phép lưu.'
              type="danger"
              onOpen={() => setOpenDialog('out-of-sessions')}
            />

            {/* ── Dialog 6 (NEW) ── */}
            <PreviewCard
              label="Lưu điểm danh thành công"
              sublabel='Đã lưu điểm danh thành công. Centered modal với auto-dismiss.'
              type="success"
              onOpen={() => setOpenDialog('attendance-saved')}
            />

            {/* ── quick open all ── */}
            <div className="pt-2">
              <p className="text-muted-foreground mb-3 px-0.5" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Mở nhanh
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {([
                  { id: 'expired-session', label: 'Hết buổi',    color: '#F4A261' },
                  { id: 'out-of-sessions', label: '🔒 Hết buổi v2',  color: '#E76F51' },
                  { id: 'logout',          label: 'Đăng xuất',   color: '#E76F51' },
                  { id: 'cancel-class',    label: 'Hủy buổi',    color: '#E76F51' },
                  { id: 'save-success',    label: '✓ Thành công', color: '#2A9D8F' },
                  { id: 'attendance-saved', label: '✓ Điểm danh', color: '#2A9D8F' },
                ] as { id: DialogId; label: string; color: string }[]).map(d => (
                  <button
                    key={d.id}
                    onClick={() => setOpenDialog(d.id)}
                    className="py-3 rounded-2xl border active:scale-[0.97] transition-all"
                    style={{ fontSize: '13px', fontWeight: 700, color: d.color, borderColor: d.color + '40', background: d.color + '0D' }}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-4" />
          </div>

        ) : (
          /* ── Empty States tab ── */
          <div className="px-4 py-4 space-y-4">

            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>
              Hiển thị khi danh sách trống. Component tái sử dụng cho từng màn hình.
            </p>

            {/* ── Empty State 1 ── */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-0.5">
                <div className="w-1.5 h-4 rounded-full" style={{ background: '#0E7C7B' }} />
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#0E7C7B' }}>
                  Màn hình Học viên
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <EmptyStudents />
              </div>
            </div>

            {/* ── Empty State 2 ── */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-0.5">
                <div className="w-1.5 h-4 rounded-full" style={{ background: '#815AD5' }} />
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#815AD5' }}>
                  Màn hình Lớp hôm nay
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <EmptyTodayClasses />
              </div>
            </div>

            {/* ── Empty State 3 ── */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-0.5">
                <div className="w-1.5 h-4 rounded-full" style={{ background: '#2A9D8F' }} />
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#2A9D8F' }}>
                  Báo cáo sắp hết buổi
                </p>
              </div>
              <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                <EmptyExpiringStudents />
              </div>
            </div>

            <div className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ── named re-exports for use in other screens ── */
export {
  DialogExpiredSession,
  DialogLogout,
  DialogCancelClass,
  DialogSaveSuccess,
  EmptyStudents,
  EmptyTodayClasses,
  EmptyExpiringStudents,
};