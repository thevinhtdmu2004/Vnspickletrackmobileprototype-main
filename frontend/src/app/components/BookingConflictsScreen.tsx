import { FormEvent, useEffect, useState } from 'react';
import { AlertTriangle, LoaderCircle } from 'lucide-react';
import { AdminBookingConflict, AdminCourtOperations, getAdminBookingConflicts, getAdminCourtOperations, resolveAdminBookingConflict } from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';
import { MobileDatePicker } from './mobile/MobileDatePicker';
import { MobileSelectSheet } from './mobile/MobileSelectSheet';
import { MobileTimePicker } from './mobile/MobileTimePicker';

export function BookingConflictsScreen({ onBack }: { onBack: () => void }) {
  const [rows, setRows] = useState<AdminBookingConflict[]>([]);
  const [courts, setCourts] = useState<AdminCourtOperations['courts']>([]);
  const [selected, setSelected] = useState<AdminBookingConflict | null>(null);
  const [action, setAction] = useState<'moveCourt' | 'changeTime' | 'cancel' | 'contactNote'>('moveCourt');
  const [courtId, setCourtId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState('18:00');
  const [endTime, setEndTime] = useState('19:30');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const [conflicts, schedule] = await Promise.all([getAdminBookingConflicts(), getAdminCourtOperations()]);
      setRows(conflicts);
      setCourts(schedule.courts);
      setCourtId(current => current || schedule.courts[0]?.id || '');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tải xung đột lịch.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setError('');
    try {
      await resolveAdminBookingConflict(selected.bookingId, {
        action,
        note,
        courtId: action === 'moveCourt' ? courtId : undefined,
        date: action === 'changeTime' ? date : undefined,
        startTime: action === 'changeTime' ? startTime : undefined,
        endTime: action === 'changeTime' ? endTime : undefined,
      });
      setSelected(null);
      setNote('');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Phương án vẫn còn xung đột.');
    }
  }

  return (
    <div className="flex h-screen flex-col bg-[#F4F7F7]">
      <AppScreenHeader title="Xung đột lịch sân" eyebrow="ADMIN · CẦN XỬ LÝ" onBack={onBack} variant="hero" />
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-600">{error}</p>}
        {loading ? <div className="flex h-60 items-center justify-center"><LoaderCircle className="h-6 w-6 animate-spin text-[#075B5A]" /></div> : <div className="mt-4 space-y-3">
          {rows.map(item => <button key={item.id} onClick={() => { setSelected(item); setDate(item.date); }} className="w-full rounded-2xl border border-rose-100 bg-white p-4 text-left shadow-sm">
            <div className="flex items-start justify-between"><div><strong className="text-xs">{item.courtName}</strong><p className="mt-1 text-[9px] text-slate-400">{item.date} · {item.type}</p></div><AlertTriangle className="h-5 w-5 text-rose-500" /></div>
            <div className="mt-3 space-y-2">{item.schedules.map(schedule => <div key={`${schedule.title}-${schedule.timeRange}`} className="rounded-xl bg-rose-50 p-3"><p className="text-[10px] font-bold">{schedule.title}</p><p className="mt-1 text-[9px] text-rose-600">{schedule.timeRange}</p></div>)}</div>
          </button>)}
          {rows.length === 0 && <p className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50 p-8 text-center text-xs text-emerald-700">Không còn xung đột lịch cần xử lý.</p>}
        </div>}
      </main>
      {selected && <div className="absolute inset-0 z-50 flex items-end bg-black/40" onClick={() => setSelected(null)}>
        <form onSubmit={submit} onClick={event => event.stopPropagation()} className="max-h-[88dvh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 pb-8">
          <h2 className="text-sm font-black">Phương án xử lý</h2>
          <div className="mt-4"><MobileSelectSheet title="Thao tác" value={action} onChange={value => setAction(value as typeof action)} options={[{ value: 'moveCourt', label: 'Chuyển sang sân khác' }, { value: 'changeTime', label: 'Đổi khung giờ' }, { value: 'cancel', label: 'Hủy booking' }, { value: 'contactNote', label: 'Liên hệ / ghi chú' }]} /></div>
          {action === 'moveCourt' && <div className="mt-3"><MobileSelectSheet title="Sân mới" value={courtId} onChange={setCourtId} options={courts.map(court => ({ value: court.id, label: court.name }))} /></div>}
          {action === 'changeTime' && <div className="mt-3 space-y-3"><MobileDatePicker value={date} onChange={setDate} minDate={new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date())} /><div className="grid grid-cols-2 gap-2"><MobileTimePicker label="Bắt đầu" value={startTime} onChange={setStartTime} /><MobileTimePicker label="Kết thúc" value={endTime} onChange={setEndTime} minTime={startTime} /></div></div>}
          <textarea required value={note} onChange={event => setNote(event.target.value)} placeholder="Ghi chú liên hệ hoặc lý do xử lý" className="mt-3 min-h-24 w-full rounded-xl border border-slate-200 p-3 text-xs outline-none" />
          <button className="mt-3 h-11 w-full rounded-xl bg-[#075B5A] text-xs font-black text-white">Xác nhận phương án</button>
        </form>
      </div>}
    </div>
  );
}
