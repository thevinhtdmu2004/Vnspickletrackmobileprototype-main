import {
  ArrowLeft, CheckCircle2, XCircle, AlertTriangle, RotateCcw,
  MinusCircle, Clock, MapPin, User, FileText, StopCircle, Trash2
} from 'lucide-react';
import { useState } from 'react';

interface CompleteSessionScreenProps {
  onBack: () => void;
  onComplete: () => void;
  onCancel: () => void;
}

const STATS = { present: 5, absent: 1, late: 1, makeup: 1, leave: 0, total: 8 };

export function CompleteSessionScreen({ onBack, onComplete, onCancel }: CompleteSessionScreenProps) {
  const [action, setAction]     = useState<'complete' | 'cancel' | null>(null);
  const [notes, setNotes]       = useState('');
  const [showConfirm, setShowConfirm] = useState(false);
  const pct = Math.round((STATS.present / STATS.total) * 100);

  return (
    <div className="flex flex-col h-screen bg-background">

      {/* ── Header ── */}
      <div className="flex-shrink-0 relative overflow-hidden" style={{ background: action === 'cancel' ? 'linear-gradient(145deg,#6B2B1A,#A83820,#E76F51)' : 'linear-gradient(145deg,#054A49,#075E5D,#0E7C7B)' }}>
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
        <div className="flex items-center gap-3 px-4 pt-10 pb-5">
          <button onClick={onBack} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center active:bg-white/25">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <p className="text-white/60" style={{ fontSize: 11 }}>Intermediate B · 30/04/2026</p>
            <h1 className="text-white" style={{ fontSize: 18, fontWeight: 800 }}>
              {action === 'cancel' ? 'Hủy buổi học' : 'Hoàn tất buổi học'}
            </h1>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pt-5 pb-36 space-y-4">

        {/* ── Session summary card ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 rounded-full bg-primary" />
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Thông tin buổi học</p>
            </div>
            <div className="space-y-2">
              {[
                { icon: <Clock style={{ width: 13, height: 13 }} />, text: '07:00 – 08:30' },
                { icon: <MapPin style={{ width: 13, height: 13 }} />, text: 'Sân 2 · TTHH Hoa Lư' },
                { icon: <User style={{ width: 13, height: 13 }} />, text: 'Coach Hùng' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-muted-foreground">
                  <span style={{ color: '#0E7C7B' }}>{item.icon}</span>
                  <span style={{ fontSize: 13 }}>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Attendance summary ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 rounded-full bg-success" />
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Tổng kết điểm danh</p>
          </div>

          {/* big donut-style */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-2xl" style={{ background: 'rgba(42,157,143,0.1)', border: '2px solid rgba(42,157,143,0.2)' }}>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#0E7C7B', lineHeight: 1 }}>{pct}%</p>
              <p style={{ fontSize: 9, color: '#6B7280', fontWeight: 600 }}>Có mặt</p>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-2">
              {[
                { key: 'present', label: 'Có mặt',   val: STATS.present, color: '#2A9D8F', bg: 'rgba(42,157,143,0.1)' },
                { key: 'absent',  label: 'Vắng',      val: STATS.absent,  color: '#E76F51', bg: 'rgba(231,111,81,0.1)' },
                { key: 'late',    label: 'Trễ',        val: STATS.late,    color: '#E9C46A', bg: 'rgba(233,196,106,0.15)' },
                { key: 'makeup',  label: 'Học bù',    val: STATS.makeup,  color: '#815AD5', bg: 'rgba(129,90,213,0.1)' },
              ].map(s => (
                <div key={s.key} className="flex items-center justify-between px-2.5 py-2 rounded-xl" style={{ background: s.bg }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.label}</span>
                  <span style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* progress bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span style={{ fontSize: 11, color: '#6B7280' }}>Điểm danh: {STATS.present + STATS.late + STATS.makeup}/{STATS.total}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#0E7C7B' }}>{pct}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
              <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: 'linear-gradient(90deg,#0E7C7B,#2A9D8F)' }} />
            </div>
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-accent" />
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Ghi chú kết thúc buổi</p>
          </div>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Nhập ghi chú về buổi học (tùy chọn)..."
            rows={4}
            className="w-full bg-background border border-border rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            style={{ fontSize: 14 }}
          />
        </div>

        {/* ── Action choice ── */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-4 rounded-full bg-warning" />
            <p style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6B7280' }}>Thao tác</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setAction(action === 'complete' ? null : 'complete')}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
              style={{ borderColor: action === 'complete' ? '#0E7C7B' : '#E5E7EB', background: action === 'complete' ? 'rgba(14,124,123,0.07)' : 'transparent' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(42,157,143,0.12)' }}>
                <CheckCircle2 style={{ width: 20, height: 20, color: '#2A9D8F' }} />
              </div>
              <div className="flex-1 text-left">
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1F2933' }}>Hoàn tất buổi học</p>
                <p style={{ fontSize: 12, color: '#6B7280' }}>Lưu điểm danh & kết thúc</p>
              </div>
              {action === 'complete' && <CheckCircle2 style={{ width: 18, height: 18, color: '#0E7C7B' }} />}
            </button>

            <button
              onClick={() => setAction(action === 'cancel' ? null : 'cancel')}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all"
              style={{ borderColor: action === 'cancel' ? '#E76F51' : '#E5E7EB', background: action === 'cancel' ? 'rgba(231,111,81,0.07)' : 'transparent' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(231,111,81,0.12)' }}>
                <Trash2 style={{ width: 20, height: 20, color: '#E76F51' }} />
              </div>
              <div className="flex-1 text-left">
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1F2933' }}>Hủy buổi học</p>
                <p style={{ fontSize: 12, color: '#6B7280' }}>Không tính vào lịch sử</p>
              </div>
              {action === 'cancel' && <XCircle style={{ width: 18, height: 18, color: '#E76F51' }} />}
            </button>
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-[390px] mx-auto bg-card border-t border-border px-4 py-4 pb-6">
          {!showConfirm ? (
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="w-[100px] py-3.5 border-2 border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground"
                style={{ fontSize: 14, fontWeight: 600 }}
              >
                Quay lại
              </button>
              <button
                onClick={() => action && setShowConfirm(true)}
                disabled={!action}
                className="flex-1 py-3.5 rounded-2xl text-white flex items-center justify-center gap-2 transition-all"
                style={{
                  background: !action ? '#E5E7EB' : action === 'cancel' ? 'linear-gradient(135deg,#E76F51,#C85A3D)' : 'linear-gradient(135deg,#0E7C7B,#2A9D8F)',
                  color: !action ? '#9CA3AF' : 'white',
                  fontSize: 14, fontWeight: 700,
                  boxShadow: !action ? 'none' : action === 'cancel' ? '0 4px 14px rgba(231,111,81,0.35)' : '0 4px 14px rgba(14,124,123,0.35)',
                }}
              >
                {action === 'cancel' ? <><Trash2 className="w-4 h-4" /> Xác nhận hủy</> : <><StopCircle className="w-4 h-4" /> Xác nhận hoàn tất</>}
              </button>
            </div>
          ) : (
            <div>
              <p className="text-center mb-3" style={{ fontSize: 13, fontWeight: 600, color: action === 'cancel' ? '#E76F51' : '#0E7C7B' }}>
                {action === 'cancel' ? '⚠ Xác nhận hủy buổi học này?' : '✓ Xác nhận hoàn tất buổi học?'}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirm(false)} className="flex-1 py-3.5 border-2 border-border rounded-2xl text-muted-foreground" style={{ fontSize: 14, fontWeight: 600 }}>
                  Quay lại
                </button>
                <button
                  onClick={action === 'cancel' ? onCancel : onComplete}
                  className="flex-1 py-3.5 rounded-2xl text-white"
                  style={{ background: action === 'cancel' ? '#E76F51' : '#0E7C7B', fontSize: 14, fontWeight: 700 }}
                >
                  {action === 'cancel' ? 'Hủy buổi' : 'Hoàn tất'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
