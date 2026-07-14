import { Boxes, CheckCircle2, LoaderCircle, Minus, Plus, TriangleAlert } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  AdminInventoryOperations,
  AdminStaffMember,
  AdminStaffOperations,
  countAdminInventoryItem,
  createAdminPosSale,
  createAdminStaffShift,
  createAdminShiftHandover,
  getAdminInventoryOperations,
  getAdminStaffMembers,
  getAdminStaffOperations,
  restockAdminInventoryItem,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';
import { MobileBottomSheet } from './mobile/MobileBottomSheet';
import { MobileDatePicker } from './mobile/MobileDatePicker';
import { MobileSelectSheet } from './mobile/MobileSelectSheet';
import { MobileTimePicker } from './mobile/MobileTimePicker';

interface Props {
  initialView: 'staff' | 'inventory';
  onBack: () => void;
  onOpenBooking?: (bookingId: string) => void;
}

type View = 'staff' | 'schedule' | 'handover' | 'inventory' | 'pos';
const money = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
const field = 'w-full h-11 rounded-xl border border-slate-100 bg-white px-3 text-xs outline-none focus:border-[#075B5A]';

export function ExtendedOperationsScreen({ initialView, onBack, onOpenBooking }: Props) {
  const [view, setView] = useState<View>(initialView);
  const [staff, setStaff] = useState<AdminStaffOperations | null>(null);
  const [inventory, setInventory] = useState<AdminInventoryOperations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const [staffData, inventoryData] = await Promise.all([
        getAdminStaffOperations(),
        getAdminInventoryOperations(),
      ]);
      setStaff(staffData);
      setInventory(inventoryData);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu vận hành.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  if (loading && (!staff || !inventory)) return <State icon={<LoaderCircle className="animate-spin" />} text="Đang tải dữ liệu vận hành..." />;
  if (!staff || !inventory) return <State icon={<TriangleAlert className="text-rose-500" />} text={error} action={onBack} />;

  const back = view === initialView ? onBack : () => setView(initialView);
  const title = view === 'staff' ? 'Nhân viên trực sân' : view === 'schedule' ? 'Xếp ca' : view === 'handover' ? 'Bàn giao ca' : view === 'inventory' ? 'Kho hàng' : 'Bán kèm';
  const refresh = async (message: string, next: View) => {
    await load();
    setNotice(message);
    setView(next);
  };

  return (
    <div className="h-screen bg-[#F4F7F7] flex flex-col">
      <AppScreenHeader
        title={title}
        onBack={back}
        action={view === 'staff'
          ? <button onClick={() => setView('schedule')} className="op-pill">Xếp ca</button>
          : view === 'inventory'
            ? <button onClick={() => setView('pos')} className="op-pill">Bán kèm</button>
            : undefined}
      />
      {notice && <div className="mx-4 mb-2 rounded-xl bg-emerald-50 text-emerald-700 p-2 text-xs">{notice}</div>}
      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {view === 'staff' && <StaffView data={staff} onHandover={() => setView('handover')} />}
        {view === 'schedule' && <ScheduleView onSaved={() => refresh('Đã xếp ca trực.', 'staff')} />}
        {view === 'handover' && <HandoverView data={staff} onSaved={() => refresh('Đã lưu lịch sử bàn giao.', 'staff')} />}
        {view === 'inventory' && <InventoryView data={inventory} onRestocked={() => refresh('Đã cập nhật tồn kho.', 'inventory')} onPos={() => setView('pos')} onOpenBooking={onOpenBooking} />}
        {view === 'pos' && <PosView data={inventory} onPaid={() => refresh('Thanh toán thành công và đã trừ tồn kho.', 'inventory')} />}
      </main>
      <OperationsStyle />
    </div>
  );
}

function ScheduleView({ onSaved }: { onSaved: () => Promise<void> }) {
  const localDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
  const [members, setMembers] = useState<AdminStaffMember[]>([]);
  const [staffUserId, setStaffUserId] = useState('');
  const [date, setDate] = useState(localDate);
  const [start, setStart] = useState('14:00');
  const [end, setEnd] = useState('22:00');
  const [status, setStatus] = useState('scheduled');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    getAdminStaffMembers().then(rows => {
      const active = rows.filter(item => item.isActive);
      setMembers(active);
      setStaffUserId(current => current || active[0]?.id || '');
    }).catch(reason => setError(reason instanceof Error ? reason.message : 'Không thể tải danh sách nhân viên.'));
  }, []);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    try { await createAdminStaffShift({ staffUserId, date, startTime: start, endTime: end, status }); await onSaved(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể xếp ca.'); }
    finally { setSaving(false); }
  };
  return <form onSubmit={submit} className="space-y-3">
    <MobileSelectSheet title="Nhân viên" value={staffUserId} onChange={setStaffUserId} options={members.map(item => ({ value: item.id, label: item.name, description: item.username }))} />
    <MobileDatePicker label="Ngày trực" value={date} onChange={setDate} minDate={localDate} />
    <div className="grid grid-cols-2 gap-3"><MobileTimePicker label="Bắt đầu" value={start} onChange={setStart} /><MobileTimePicker label="Kết thúc" value={end} onChange={setEnd} minTime={start} /></div>
    <MobileSelectSheet title="Trạng thái" value={status} onChange={setStatus} options={[{ value: 'scheduled', label: 'Chờ vào ca' }, { value: 'absent', label: 'Vắng' }]} />
    {error && <p className="text-xs text-rose-600">{error}</p>}<button disabled={saving || !staffUserId} className="op-primary">{saving ? 'Đang lưu...' : 'Lưu lịch trực'}</button>
  </form>;
}

function StaffView({ data, onHandover }: { data: AdminStaffOperations; onHandover: () => void }) {
  const status = {
    onDuty: ['Đang trực', 'green'],
    handedOver: ['Đã bàn giao', 'green'],
    upcoming: ['Chờ vào ca', 'amber'],
    absent: ['Vắng', 'red'],
  } as const;
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3"><Metric label="Đang trực" value={data.onDutyCount} /><Metric label="Vắng" value={data.absentCount} danger /></div>
      <div className="rounded-xl bg-[#075B5A] text-white p-4"><p className="text-[9px] text-white/65">Ca tiếp theo</p><p className="font-bold text-xs mt-1">{data.nextShift ?? 'Không còn ca tiếp theo'}</p></div>
      <section><h2 className="op-title">Ca hôm nay</h2><div className="space-y-2 mt-3">
        {data.shifts.map(item => <article key={item.id} className="op-card flex justify-between"><div><p className="font-bold text-xs">{item.staffName}</p><p className="op-sub">Ca • {item.startTime} - {item.endTime}</p></div><Badge label={status[item.status][0]} tone={status[item.status][1]} /></article>)}
        {!data.shifts.length && <Empty text="Chưa có ca trực hôm nay." />}
      </div></section>
      <button onClick={onHandover} className="op-primary">Bàn giao ca hiện tại</button>
      {!!data.handovers.length && <section><h2 className="op-title mb-3">Lịch sử bàn giao</h2>{data.handovers.slice(0, 3).map(item => <article key={item.id} className="op-card mb-2"><p className="font-bold text-xs">{item.handedOverBy} → {item.receivedBy}</p><p className="op-sub">{item.completedAt} • Cuối ca {money(item.closingCash)}</p></article>)}</section>}
    </div>
  );
}

function HandoverView({ data, onSaved }: { data: AdminStaffOperations; onSaved: () => Promise<void> }) {
  const eligible = data.shifts.filter(item => item.status !== 'handedOver' && item.status !== 'absent');
  const [shiftId, setShiftId] = useState(eligible[0]?.id ?? '');
  const selected = eligible.find(item => item.id === shiftId);
  const [members, setMembers] = useState<AdminStaffMember[]>([]);
  const [receiver, setReceiver] = useState('');
  const [opening, setOpening] = useState('');
  const [closing, setClosing] = useState('');
  const [checked, setChecked] = useState(true);
  const [incident, setIncident] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    getAdminStaffMembers().then(rows => {
      const active = rows.filter(item => item.isActive && item.name !== selected?.staffName);
      setMembers(active);
      setReceiver(current => current || active[0]?.name || '');
    }).catch(reason => setError(reason instanceof Error ? reason.message : 'Không thể tải nhân viên nhận ca.'));
  }, [selected?.staffName]);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('');
    try {
      await createAdminShiftHandover({ shiftId, handedOverBy: selected?.staffName ?? '', receivedBy: receiver, openingCash: Number(opening), closingCash: Number(closing), inventoryChecked: checked, incidentNote: incident });
      await onSaved();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể bàn giao ca.'); } finally { setSaving(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <MobileSelectSheet title="Người bàn giao" value={shiftId} onChange={setShiftId} options={eligible.map(item => ({ value: item.id, label: item.staffName, description: `${item.startTime}-${item.endTime}` }))} />
      <MobileSelectSheet title="Người nhận ca" value={receiver} onChange={setReceiver} options={members.map(item => ({ value: item.name, label: item.name, description: item.username }))} />
      <h2 className="op-title pt-2">Đối chiếu tiền mặt</h2>
      <div className="grid grid-cols-2 gap-3"><Field label="Đầu ca"><input required min="0" type="number" value={opening} onChange={e => setOpening(e.target.value)} className={field} /></Field><Field label="Cuối ca"><input required min="0" type="number" value={closing} onChange={e => setClosing(e.target.value)} className={field} /></Field></div>
      <label className="op-card flex items-center gap-3"><input type="checkbox" checked={checked} onChange={e => setChecked(e.target.checked)} /><span className="text-xs">Đã kiểm tra hàng hóa, dụng cụ</span></label>
      <Field label="Sự cố trong ca"><textarea value={incident} onChange={e => setIncident(e.target.value)} className={`${field} min-h-20 py-3`} placeholder="Không có sự cố" /></Field>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <button disabled={saving || !eligible.length} className="op-primary">{saving ? 'Đang xác nhận...' : 'Xác nhận bàn giao'}</button>
    </form>
  );
}

function InventoryView({ data, onRestocked, onPos, onOpenBooking }: { data: AdminInventoryOperations; onRestocked: () => Promise<void>; onPos: () => void; onOpenBooking?: (bookingId: string) => void }) {
  const [restocking, setRestocking] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [action, setAction] = useState<'restock' | 'count'>('restock');
  const [quantity, setQuantity] = useState('10');
  const [unitCost, setUnitCost] = useState('0');
  const [supplier, setSupplier] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('paid');
  const selectedItem = data.items.find(item => item.id === selectedId);
  const openStockSheet = (id: string, nextAction: 'restock' | 'count') => {
    const item = data.items.find(row => row.id === id);
    setSelectedId(id);
    setAction(nextAction);
    setQuantity(String(nextAction === 'count' ? item?.quantity ?? 0 : 10));
    setUnitCost(String(item?.costPrice ?? 0));
  };
  const submitStock = async () => {
    const parsedQuantity = Number(quantity);
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 0 || (action === 'restock' && parsedQuantity === 0)) return;
    setRestocking(selectedId);
    try {
      if (action === 'restock') {
        await restockAdminInventoryItem(selectedId, parsedQuantity, {
          unitCost: Number(unitCost),
          supplier,
          paymentMethod: 'transfer',
          paymentStatus,
        });
      } else {
        await countAdminInventoryItem(selectedId, parsedQuantity);
      }
      setSelectedId('');
      await onRestocked();
    } finally {
      setRestocking('');
    }
  };
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3"><Metric label="Mặt hàng" value={data.itemCount} /><Metric label="Giá trị tồn" value={money(data.stockValue)} /><Metric label="Sắp hết" value={data.lowStockCount} danger /><Metric label="Hết hàng" value={data.outOfStockCount} danger /></div>
      <div className="flex gap-2"><span className="op-pill">Tồn kho</span><button onClick={onPos} className="op-pill">Bán kèm POS</button></div>
      <section><h2 className="op-title mb-3">Danh sách tồn kho</h2><div className="space-y-2">{data.items.map(item => <article key={item.id} className="op-card flex justify-between gap-3"><div><p className="font-bold text-xs">{item.name}</p><p className="op-sub">Còn {item.quantity} • Mức tối thiểu {item.reorderLevel}{item.category === 'rental' ? ` • Đang thuê ${item.rentalInUse}/${item.rentalTotal}` : ''}</p></div><div className="text-right"><Badge label={item.status === 'inStock' ? 'Đủ hàng' : item.status === 'lowStock' ? 'Sắp hết' : 'Hết hàng'} tone={item.status === 'inStock' ? 'green' : 'amber'} /><div className="flex gap-2 mt-2"><button disabled={restocking === item.id} onClick={() => openStockSheet(item.id, 'restock')} className="text-[9px] text-[#075B5A] font-bold">+ Nhập</button><button disabled={restocking === item.id} onClick={() => openStockSheet(item.id, 'count')} className="text-[9px] text-sky-700 font-bold">Kiểm kê</button></div></div></article>)}</div></section>
      <section>
        <h2 className="op-title mb-3">Biến động kho gần đây</h2>
        <div className="space-y-2">
          {data.movements.map(item => (
            <button key={item.id} disabled={!item.bookingId || !onOpenBooking} onClick={() => item.bookingId && onOpenBooking?.(item.bookingId)} className="op-card w-full flex items-center justify-between gap-3 text-left">
              <div><p className="font-bold text-xs">{item.itemName}</p><p className="op-sub">{item.referenceCode} • {new Date(item.createdAtUtc).toLocaleString('vi-VN')}</p></div>
              <strong className={item.quantityChange < 0 ? 'text-rose-500 text-xs' : 'text-[#075B5A] text-xs'}>{item.quantityChange > 0 ? '+' : ''}{item.quantityChange}</strong>
            </button>
          ))}
        </div>
      </section>
      <MobileBottomSheet open={Boolean(selectedId)} title={action === 'restock' ? `Nhập kho ${selectedItem?.name ?? ''}` : `Kiểm kê ${selectedItem?.name ?? ''}`} onClose={() => setSelectedId('')} footer={<button onClick={() => void submitStock()} disabled={restocking === selectedId} className="op-primary">{restocking ? 'Đang lưu...' : 'Xác nhận'}</button>}>
        <div className="space-y-3">
          <Field label={action === 'restock' ? 'Số lượng nhập' : 'Số lượng thực tế'}><input type="number" min={action === 'restock' ? 1 : 0} value={quantity} onChange={event => setQuantity(event.target.value)} className={field} /></Field>
          {action === 'restock' && <>
            <Field label="Giá nhập mỗi đơn vị"><input type="number" min="0" value={unitCost} onChange={event => setUnitCost(event.target.value)} className={field} /></Field>
            <Field label="Nhà cung cấp"><input value={supplier} onChange={event => setSupplier(event.target.value)} className={field} /></Field>
            <MobileSelectSheet title="Thanh toán nhập kho" value={paymentStatus} onChange={setPaymentStatus} options={[{ value: 'paid', label: 'Đã thanh toán' }, { value: 'debt', label: 'Ghi nhận công nợ' }]} />
          </>}
        </div>
      </MobileBottomSheet>
    </div>
  );
}

function PosView({ data, onPaid }: { data: AdminInventoryOperations; onPaid: () => Promise<void> }) {
  const products = data.items.filter(item => item.salePrice > 0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [bookingId, setBookingId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const idempotencyKey = useRef(crypto.randomUUID());
  const lines = products.filter(item => cart[item.id]).map(item => ({ item, quantity: cart[item.id] }));
  const total = lines.reduce((sum, line) => sum + line.item.salePrice * line.quantity, 0);
  const change = (item: AdminInventoryOperations['items'][number], delta: number) => setCart(current => {
    const next = Math.max(0, Math.min(item.quantity, (current[item.id] ?? 0) + delta));
    return { ...current, [item.id]: next };
  });
  const pay = async () => {
    setSaving(true); setError('');
    try {
      await createAdminPosSale({
        bookingId: bookingId || undefined,
        paymentMethod,
        items: lines.map(line => ({ itemId: line.item.id, quantity: line.quantity })),
        idempotencyKey: idempotencyKey.current,
      });
      idempotencyKey.current = crypto.randomUUID();
      await onPaid();
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể thanh toán.'); } finally { setSaving(false); }
  };
  return (
    <div className="space-y-5">
      <section><h2 className="op-title mb-3">Sản phẩm nhanh</h2><div className="grid grid-cols-2 gap-2">{products.map(item => <article key={item.id} className="op-card"><p className="font-bold text-xs">{item.name}</p><p className="op-sub">{money(item.salePrice)} • Còn {item.quantity}</p><div className="flex justify-end gap-3 mt-2"><button onClick={() => change(item, -1)}><Minus className="w-4 h-4" /></button><strong className="text-xs">{cart[item.id] ?? 0}</strong><button disabled={(cart[item.id] ?? 0) >= item.quantity} onClick={() => change(item, 1)}><Plus className="w-4 h-4 text-[#075B5A]" /></button></div></article>)}</div></section>
      <MobileSelectSheet title="Gắn với booking" value={bookingId} onChange={setBookingId} options={[{ value: '', label: 'Không gắn booking' }, ...data.bookings.map(item => ({ value: item.id, label: item.customerName, description: money(item.amount) }))]} />
      {!bookingId && <MobileSelectSheet title="Phương thức thanh toán" value={paymentMethod} onChange={setPaymentMethod} options={[{ value: 'cash', label: 'Tiền mặt' }, { value: 'transfer', label: 'Chuyển khoản' }, { value: 'card', label: 'Thẻ' }, { value: 'other', label: 'Khác' }]} />}
      <section><h2 className="op-title mb-3">Giỏ hàng</h2>{lines.length ? <div className="space-y-2">{lines.map(line => <article key={line.item.id} className="op-card flex justify-between"><span className="text-xs">{line.item.name} × {line.quantity}</span><strong className="text-xs">+{money(line.item.salePrice * line.quantity)}</strong></article>)}</div> : <Empty text="Chưa có sản phẩm trong giỏ." />}</section>
      <div className="rounded-xl bg-[#075B5A] text-white p-4"><p className="text-[9px] text-white/65">Tổng thanh toán</p><p className="text-xl font-black mt-1">{money(total)}</p></div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <button disabled={!lines.length || saving} onClick={() => void pay()} className="op-primary">{saving ? 'Đang thanh toán...' : 'Thanh toán & Gắn booking'}</button>
    </div>
  );
}

function Metric({ label, value, danger }: { label: string; value: string | number; danger?: boolean }) { return <div className="op-card"><p className="op-sub mt-0">{label}</p><p className={`font-black text-lg mt-1 ${danger ? 'text-rose-500' : 'text-[#075B5A]'}`}>{value}</p></div>; }
function Badge({ label, tone }: { label: string; tone: string }) { return <span className={`op-badge ${tone === 'green' ? 'bg-emerald-50 text-emerald-700' : tone === 'red' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'}`}>{label}</span>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="op-sub block mb-1.5">{label}</span>{children}</label>; }
function Empty({ text }: { text: string }) { return <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-xs text-slate-400">{text}</div>; }
function State({ icon, text, action }: { icon: React.ReactNode; text: string; action?: () => void }) { return <div className="h-screen bg-[#F4F7F7] flex flex-col items-center justify-center gap-3 px-8 text-center text-sm">{icon}<p>{text}</p>{action && <button onClick={action} className="op-primary max-w-40">Quay lại</button>}<OperationsStyle /></div>; }
function OperationsStyle() { return <style>{`.op-card{background:#fff;border:1px solid #e7eded;border-radius:14px;padding:14px}.op-pill{border-radius:999px;background:#e3f6ef;color:#087b62;padding:6px 11px;font-size:9px;font-weight:700}.op-title{font-size:12px;font-weight:800}.op-sub{color:#8a9999;font-size:9px;line-height:1.45}.op-badge{display:inline-block;border-radius:999px;padding:4px 8px;font-size:8px;font-weight:700;white-space:nowrap}.op-primary{width:100%;height:44px;border-radius:12px;background:#075b5a;color:white;font-size:11px;font-weight:800}.op-primary:disabled{opacity:.5}`}</style>; }
