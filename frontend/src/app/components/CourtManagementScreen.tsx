import { FormEvent, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronRight, Edit3, LoaderCircle, Plus, Trash2, TriangleAlert } from 'lucide-react';
import {
  AdminCourtPriceRule,
  AdminManagedCourt,
  UpsertAdminCourtInput,
  createAdminCourt,
  createAdminCourtPriceRule,
  deleteAdminCourt,
  deleteAdminCourtPriceRule,
  getAdminCourts,
  setAdminCourtPriceRuleStatus,
  setAdminCourtStatus,
  updateAdminCourt,
  updateAdminCourtPriceRule,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';
import { MobileDatePicker } from './mobile/MobileDatePicker';
import { MobileSelectSheet } from './mobile/MobileSelectSheet';
import { MobileTimePicker } from './mobile/MobileTimePicker';

type EditableStatus = UpsertAdminCourtInput['status'];
type PriceType = AdminCourtPriceRule['priceType'];
type ScreenState =
  | { name: 'list' }
  | { name: 'detail'; courtId: string }
  | { name: 'courtForm'; courtId?: string }
  | { name: 'priceForm'; courtId: string; ruleId?: string };

const money = (value: number) => `${Math.round(value).toLocaleString('vi-VN')}đ`;
const inputClass = 'h-11 w-full rounded-xl border border-slate-100 bg-white px-3 text-xs outline-none focus:border-[#075B5A]';

const statusLabels: Record<AdminManagedCourt['status'], string> = {
  available: 'Đang trống',
  inUse: 'Đang sử dụng',
  maintenance: 'Bảo trì',
  paused: 'Tạm ngừng',
  inactive: 'Ngừng hoạt động',
};

const statusTone: Record<AdminManagedCourt['status'], string> = {
  available: 'bg-emerald-50 text-emerald-700',
  inUse: 'bg-sky-50 text-sky-700',
  maintenance: 'bg-amber-50 text-amber-700',
  paused: 'bg-slate-100 text-slate-600',
  inactive: 'bg-rose-50 text-rose-700',
};

const priceTypeLabels: Record<PriceType, string> = {
  regular: 'Giá thường',
  peak: 'Giá giờ cao điểm',
  holiday: 'Giá lễ',
};

const emptyForm: UpsertAdminCourtInput = {
  name: '',
  courtType: 'standard',
  surface: 'Acrylic',
  description: '',
  capacity: 4,
  opensAt: '05:00',
  closesAt: '23:00',
  hourlyRate: 0,
  status: 'available',
};

const emptyPriceForm = {
  priceType: 'regular' as PriceType,
  startTime: '06:00',
  endTime: '17:00',
  hourlyRateText: '',
  effectiveFrom: new Date().toISOString().slice(0, 10),
  holidayDraftDate: new Date().toISOString().slice(0, 10),
  holidayDates: [] as string[],
};

function parseMoney(value: string) {
  const digits = value.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? Number(digits) : 0;
}

function formatMoneyInput(value: string) {
  const amount = parseMoney(value);
  return amount > 0 ? `${amount.toLocaleString('vi-VN')}đ` : '';
}

function isoToDisplay(value: string) {
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

export function CourtManagementScreen({ onBack }: { onBack: () => void }) {
  const [courts, setCourts] = useState<AdminManagedCourt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [screen, setScreen] = useState<ScreenState>({ name: 'list' });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deletingPriceId, setDeletingPriceId] = useState<string | null>(null);
  const [form, setForm] = useState<UpsertAdminCourtInput>(emptyForm);
  const [priceForm, setPriceForm] = useState(emptyPriceForm);
  const listScrollRef = useRef(0);
  const mainRef = useRef<HTMLElement | null>(null);

  const summary = useMemo(() => ({
    total: courts.length,
    available: courts.filter(item => item.status === 'available').length,
    blocked: courts.filter(item => ['maintenance', 'paused', 'inactive'].includes(item.status)).length,
    inUse: courts.filter(item => item.status === 'inUse').length,
  }), [courts]);

  const selectedCourt = screen.name === 'detail' || screen.name === 'priceForm'
    ? courts.find(item => item.id === screen.courtId)
    : screen.name === 'courtForm' && screen.courtId
      ? courts.find(item => item.id === screen.courtId)
      : null;

  const editingPrice = screen.name === 'priceForm' && screen.ruleId && selectedCourt
    ? selectedCourt.priceRules.find(rule => rule.id === screen.ruleId) ?? null
    : null;

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setCourts(await getAdminCourts());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tải danh sách sân.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  useEffect(() => {
    if (screen.name === 'list') {
      window.requestAnimationFrame(() => {
        if (mainRef.current) mainRef.current.scrollTop = listScrollRef.current;
      });
    }
  }, [screen.name]);

  useEffect(() => {
    if (screen.name !== 'list' && !loading && selectedCourt === undefined) {
      setScreen({ name: 'list' });
    }
  }, [loading, screen.name, selectedCourt]);

  const goList = () => setScreen({ name: 'list' });
  const goDetail = (courtId: string) => setScreen({ name: 'detail', courtId });

  const openDetail = (courtId: string) => {
    listScrollRef.current = mainRef.current?.scrollTop ?? listScrollRef.current;
    setDeletingId(null);
    setDeletingPriceId(null);
    goDetail(courtId);
  };

  const openCreate = () => {
    listScrollRef.current = mainRef.current?.scrollTop ?? listScrollRef.current;
    setForm(emptyForm);
    setError('');
    setNotice('');
    setScreen({ name: 'courtForm' });
  };

  const openEdit = (court: AdminManagedCourt) => {
    setForm({
      name: court.name,
      courtType: court.courtType,
      surface: court.surface,
      description: court.description,
      capacity: court.capacity,
      opensAt: court.opensAt,
      closesAt: court.closesAt,
      hourlyRate: court.hourlyRate,
      status: court.status === 'inUse' ? 'available' : court.status,
    });
    setError('');
    setNotice('');
    setScreen({ name: 'courtForm', courtId: court.id });
  };

  const openAddPrice = (court: AdminManagedCourt) => {
    setPriceForm({
      ...emptyPriceForm,
      startTime: court.opensAt,
      endTime: court.closesAt,
      effectiveFrom: new Date().toISOString().slice(0, 10),
      holidayDraftDate: new Date().toISOString().slice(0, 10),
    });
    setError('');
    setNotice('');
    setScreen({ name: 'priceForm', courtId: court.id });
  };

  const openEditPrice = (court: AdminManagedCourt, rule: AdminCourtPriceRule) => {
    setPriceForm({
      priceType: rule.priceType ?? 'regular',
      startTime: rule.startTime,
      endTime: rule.endTime,
      hourlyRateText: formatMoneyInput(String(rule.hourlyRate)),
      effectiveFrom: rule.effectiveFrom,
      holidayDraftDate: rule.holidayDates[0] ?? new Date().toISOString().slice(0, 10),
      holidayDates: rule.holidayDates ?? [],
    });
    setError('');
    setNotice('');
    setScreen({ name: 'priceForm', courtId: court.id, ruleId: rule.id });
  };

  const saveCourt = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      if (screen.name === 'courtForm' && screen.courtId) {
        await updateAdminCourt(screen.courtId, form);
        setNotice('Đã cập nhật thông tin sân.');
        await load();
        goDetail(screen.courtId);
      } else {
        const created = await createAdminCourt({ ...form, hourlyRate: 0 });
        setNotice('Đã thêm sân mới. Hãy thêm cấu hình giá trong chi tiết sân.');
        await load();
        goDetail(created.id);
      }
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể lưu thông tin sân.');
    }
  };

  const changeStatus = async (court: AdminManagedCourt, status: EditableStatus) => {
    setError('');
    try {
      await setAdminCourtStatus(court.id, status);
      setNotice(`Đã chuyển ${court.name} sang ${statusLabels[status]}.`);
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể cập nhật trạng thái sân.');
    }
  };

  const remove = async (court: AdminManagedCourt) => {
    setError('');
    try {
      await deleteAdminCourt(court.id);
      setNotice(`Đã xóa ${court.name}.`);
      setDeletingId(null);
      await load();
      goList();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể xóa sân đã phát sinh dữ liệu.');
    }
  };

  const savePrice = async (event: FormEvent) => {
    event.preventDefault();
    if (screen.name !== 'priceForm' || !selectedCourt) return;
    setError('');
    const hourlyRate = parseMoney(priceForm.hourlyRateText);
    if (hourlyRate <= 0) {
      setError('Mức giá phải lớn hơn 0đ.');
      return;
    }
    if (priceForm.priceType !== 'holiday' && priceForm.startTime >= priceForm.endTime) {
      setError('Giờ bắt đầu phải nhỏ hơn giờ kết thúc.');
      return;
    }
    if (priceForm.priceType === 'holiday' && priceForm.holidayDates.length === 0) {
      setError('Giá lễ cần chọn ít nhất một ngày.');
      return;
    }

    const input = {
      courtId: selectedCourt.id,
      customerType: 'all' as const,
      dayType: 'all' as const,
      priceType: priceForm.priceType,
      startTime: priceForm.priceType === 'holiday' ? selectedCourt.opensAt : priceForm.startTime,
      endTime: priceForm.priceType === 'holiday' ? selectedCourt.closesAt : priceForm.endTime,
      hourlyRate,
      effectiveFrom: priceForm.effectiveFrom,
      holidayDates: priceForm.priceType === 'holiday' ? priceForm.holidayDates : [],
    };

    try {
      if (screen.ruleId) {
        await updateAdminCourtPriceRule(screen.ruleId, input);
        setNotice('Đã cập nhật cấu hình giá.');
      } else {
        await createAdminCourtPriceRule(input);
        setNotice('Đã thêm cấu hình giá.');
      }
      await load();
      goDetail(selectedCourt.id);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể lưu cấu hình giá.');
    }
  };

  const toggleHolidayDate = () => {
    setPriceForm(current => {
      const exists = current.holidayDates.includes(current.holidayDraftDate);
      return {
        ...current,
        holidayDates: exists
          ? current.holidayDates.filter(item => item !== current.holidayDraftDate)
          : [...current.holidayDates, current.holidayDraftDate].sort(),
      };
    });
  };

  const togglePriceStatus = async (rule: AdminCourtPriceRule) => {
    setError('');
    try {
      await setAdminCourtPriceRuleStatus(rule.id, !rule.isActive);
      setNotice(rule.isActive ? 'Đã ngừng áp dụng mức giá.' : 'Đã kích hoạt mức giá.');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể đổi trạng thái giá.');
    }
  };

  const removePrice = async (rule: AdminCourtPriceRule) => {
    setError('');
    try {
      await deleteAdminCourtPriceRule(rule.id);
      setDeletingPriceId(null);
      setNotice('Đã xóa cấu hình giá.');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể xóa cấu hình giá.');
    }
  };

  const header = getHeader(screen, selectedCourt, openCreate, onBack, goList, goDetail);

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F4F7F7]">
      <AppScreenHeader {...header} />

      <main ref={mainRef} className="flex-1 overflow-y-auto px-4 pb-24">
        {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-600"><TriangleAlert className="mr-2 inline h-4 w-4" />{error}</p>}
        {notice && <p className="mt-3 rounded-xl bg-emerald-50 p-3 text-xs font-bold text-emerald-700">{notice}</p>}

        {loading ? (
          <div className="flex h-60 items-center justify-center"><LoaderCircle className="h-6 w-6 animate-spin text-[#075B5A]" /></div>
        ) : screen.name === 'list' ? (
          <CourtListView summary={summary} courts={courts} onOpenDetail={openDetail} />
        ) : screen.name === 'detail' && selectedCourt ? (
          <CourtDetailView
            court={selectedCourt}
            deletingId={deletingId}
            deletingPriceId={deletingPriceId}
            onEdit={openEdit}
            onAddPrice={openAddPrice}
            onEditPrice={openEditPrice}
            onChangeStatus={changeStatus}
            onAskDelete={setDeletingId}
            onDelete={remove}
            onAskDeletePrice={setDeletingPriceId}
            onTogglePriceStatus={togglePriceStatus}
            onDeletePrice={removePrice}
          />
        ) : screen.name === 'courtForm' ? (
          <CourtFormView form={form} setForm={setForm} isEditing={Boolean(screen.courtId)} onSubmit={saveCourt} />
        ) : screen.name === 'priceForm' && selectedCourt ? (
          <PriceFormView
            court={selectedCourt}
            priceForm={priceForm}
            setPriceForm={setPriceForm}
            isEditing={Boolean(editingPrice)}
            onToggleHolidayDate={toggleHolidayDate}
            onSubmit={savePrice}
          />
        ) : null}
      </main>
    </div>
  );
}

function getHeader(
  screen: ScreenState,
  court: AdminManagedCourt | null | undefined,
  openCreate: () => void,
  rootBack: () => void,
  goList: () => void,
  goDetail: (courtId: string) => void,
) {
  if (screen.name === 'list') {
    return {
      title: 'Quản lý sân',
      eyebrow: 'ADMIN · TRUNG TÂM VẬN HÀNH',
      onBack: rootBack,
      variant: 'list' as const,
      action: <button onClick={openCreate} className="rounded-full bg-white/15 px-3 py-2 text-[10px] font-bold text-white"><Plus className="mr-1 inline h-3 w-3" />Thêm sân</button>,
    };
  }
  if (screen.name === 'detail') {
    return { title: court?.name ?? 'Chi tiết sân', eyebrow: 'ADMIN · CHI TIẾT SÂN', onBack: goList, variant: 'detail' as const };
  }
  if (screen.name === 'courtForm') {
    return {
      title: screen.courtId ? 'Sửa sân' : 'Thêm sân',
      eyebrow: 'ADMIN · QUẢN LÝ SÂN',
      onBack: screen.courtId ? () => goDetail(screen.courtId!) : goList,
      variant: 'form' as const,
    };
  }
  return {
    title: screen.ruleId ? 'Sửa giá sân' : 'Thêm giá sân',
    eyebrow: court ? `ADMIN · ${court.name}` : 'ADMIN · CẤU HÌNH GIÁ',
    onBack: () => goDetail(screen.courtId),
    variant: 'form' as const,
  };
}

function CourtListView({
  summary,
  courts,
  onOpenDetail,
}: {
  summary: { total: number; available: number; blocked: number; inUse: number };
  courts: AdminManagedCourt[];
  onOpenDetail: (courtId: string) => void;
}) {
  return (
    <>
      <section className="mt-4 rounded-[24px] bg-white p-3 shadow-sm">
        <div className="grid grid-cols-4 gap-2">
          <CompactMetric label="Tổng" value={summary.total} />
          <CompactMetric label="Trống" value={summary.available} />
          <CompactMetric label="Đang dùng" value={summary.inUse} />
          <CompactMetric label="Bị khóa" value={summary.blocked} danger />
        </div>
      </section>

      <section className="mt-4 space-y-4">
        {courts.map(court => (
          <button
            key={court.id}
            onClick={() => onOpenDetail(court.id)}
            className="w-full rounded-[28px] border border-slate-100 bg-white p-5 text-left shadow-sm transition active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="truncate text-base font-black text-[#102B2B]">{court.name}</h2>
                <p className="mt-1 text-[11px] font-semibold leading-5 text-slate-400">
                  {court.courtType} · {court.surface}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1.5 text-[10px] font-black ${statusTone[court.status]}`}>
                {statusLabels[court.status]}
              </span>
            </div>

            <div className="mt-4 space-y-2.5">
              <CourtListStat label="Giờ hoạt động" value={`${court.opensAt} - ${court.closesAt}`} />
              <CourtListStat label="Booking" value={`${court.bookingCount.toLocaleString('vi-VN')} lịch`} />
              <CourtListStat label="Cấu hình giá" value={`${court.priceRules.length.toLocaleString('vi-VN')} mức`} />
            </div>

            <div className="mt-4 flex h-11 items-center justify-between rounded-2xl bg-[#E5F5F1] px-4 text-[11px] font-black text-[#075B5A]">
              <span>Xem chi tiết sân</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </button>
        ))}
        {courts.length === 0 && <EmptyState text="Chưa có sân nào. Hãy thêm sân để bắt đầu vận hành lịch booking." />}
      </section>
    </>
  );
}

function CourtDetailView({
  court,
  deletingId,
  deletingPriceId,
  onEdit,
  onAddPrice,
  onEditPrice,
  onChangeStatus,
  onAskDelete,
  onDelete,
  onAskDeletePrice,
  onTogglePriceStatus,
  onDeletePrice,
}: {
  court: AdminManagedCourt;
  deletingId: string | null;
  deletingPriceId: string | null;
  onEdit: (court: AdminManagedCourt) => void;
  onAddPrice: (court: AdminManagedCourt) => void;
  onEditPrice: (court: AdminManagedCourt, rule: AdminCourtPriceRule) => void;
  onChangeStatus: (court: AdminManagedCourt, status: EditableStatus) => Promise<void>;
  onAskDelete: (id: string | null) => void;
  onDelete: (court: AdminManagedCourt) => Promise<void>;
  onAskDeletePrice: (id: string | null) => void;
  onTogglePriceStatus: (rule: AdminCourtPriceRule) => Promise<void>;
  onDeletePrice: (rule: AdminCourtPriceRule) => Promise<void>;
}) {
  return (
    <section className="mt-4 space-y-4">
      <article className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-black">{court.name}</h2>
            <p className="mt-1 text-[10px] text-slate-400">{court.courtType} · {court.surface} · {court.capacity} người</p>
          </div>
          <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${statusTone[court.status]}`}>{statusLabels[court.status]}</span>
        </div>
        {court.description && <p className="mt-3 rounded-xl bg-slate-50 p-3 text-[10px] leading-5 text-slate-500">{court.description}</p>}
        <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
          <Info label="Giờ hoạt động" value={`${court.opensAt} - ${court.closesAt}`} />
          <Info label="Cấu hình giá" value={`${court.priceRules.length} mức giá`} />
          <Info label="Tổng booking" value={`${court.bookingCount} lịch`} />
          <Info label="Booking tương lai" value={`${court.futureBookingCount} lịch`} />
          <Info label="Lịch vận hành" value={`${court.scheduleCount} lịch`} />
          <Info label="Lớp liên kết" value={`${court.classCount} lớp`} />
        </div>
        {!court.canDisable && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-[10px] font-bold text-amber-700">Còn booking hoặc lịch tương lai, chưa thể vô hiệu hóa.</p>}
      </article>

      <article className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-black">Thao tác sân</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          <button onClick={() => onEdit(court)} className="rounded-full bg-sky-50 px-3 py-1.5 text-[9px] font-bold text-sky-700"><Edit3 className="mr-1 inline h-3 w-3" />Sửa sân</button>
          {(['available', 'maintenance', 'paused', 'inactive'] as EditableStatus[]).filter(status => status !== (court.status === 'inUse' ? 'available' : court.status)).map(status => (
            <button key={status} onClick={() => void onChangeStatus(court, status)} disabled={!court.canDisable && status !== 'available'} className="rounded-full bg-slate-100 px-3 py-1.5 text-[9px] font-bold text-slate-600 disabled:opacity-40">
              {statusLabels[status]}
            </button>
          ))}
          <button onClick={() => onAskDelete(court.id)} className="rounded-full bg-rose-50 px-3 py-1.5 text-[9px] font-bold text-rose-600"><Trash2 className="mr-1 inline h-3 w-3" />Xóa</button>
        </div>
        {deletingId === court.id && (
          <div className="mt-3 rounded-xl bg-rose-50 p-3 text-[10px] text-rose-700">
            <p className="font-bold">{court.canDelete ? 'Xóa cứng sân này?' : 'Sân đã có dữ liệu, hệ thống sẽ không cho xóa cứng.'}</p>
            <p className="mt-1">Sân có booking, lịch, lớp hoặc bảng giá phải chuyển trạng thái thay vì xóa.</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => onAskDelete(null)} className="flex-1 rounded-lg bg-white py-2 font-bold">Giữ lại</button>
              <button disabled={!court.canDelete} onClick={() => void onDelete(court)} className="flex-1 rounded-lg bg-rose-600 py-2 font-bold text-white disabled:opacity-40">Xóa</button>
            </div>
          </div>
        )}
      </article>

      <article className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black">Cấu hình giá</h3>
          <button onClick={() => onAddPrice(court)} className="rounded-full bg-emerald-50 px-3 py-1.5 text-[9px] font-bold text-emerald-700"><Plus className="mr-1 inline h-3 w-3" />Thêm giá</button>
        </div>
        <section className="mt-3 space-y-2">
          {court.priceRules.map(rule => (
            <div key={rule.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-black">{priceTypeLabels[rule.priceType ?? 'regular']}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {rule.priceType === 'holiday'
                      ? `${rule.holidayDates.map(isoToDisplay).join(', ') || 'Chưa chọn ngày'}`
                      : `${rule.startTime} - ${rule.endTime}`}
                  </p>
                </div>
                <strong className="text-sm text-[#075B5A]">{money(rule.hourlyRate)}</strong>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className={`rounded-full px-2 py-1 text-[9px] font-bold ${rule.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>{rule.isActive ? 'Đang áp dụng' : 'Ngừng áp dụng'}</span>
                <span className="text-[9px] text-slate-400">Từ {isoToDisplay(rule.effectiveFrom)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <button onClick={() => onEditPrice(court, rule)} className="rounded-full bg-sky-50 px-3 py-1.5 text-[9px] font-bold text-sky-700">Sửa</button>
                <button onClick={() => void onTogglePriceStatus(rule)} className="rounded-full bg-amber-50 px-3 py-1.5 text-[9px] font-bold text-amber-700">{rule.isActive ? 'Ngừng áp dụng' : 'Kích hoạt'}</button>
                <button onClick={() => onAskDeletePrice(rule.id)} className="rounded-full bg-rose-50 px-3 py-1.5 text-[9px] font-bold text-rose-600">Xóa</button>
              </div>
              {deletingPriceId === rule.id && (
                <div className="mt-3 rounded-xl bg-rose-50 p-3 text-[10px] text-rose-700">
                  <p className="font-bold">Xóa cấu hình giá này?</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => onAskDeletePrice(null)} className="flex-1 rounded-lg bg-white py-2 font-bold">Giữ lại</button>
                    <button onClick={() => void onDeletePrice(rule)} className="flex-1 rounded-lg bg-rose-600 py-2 font-bold text-white">Xóa</button>
                  </div>
                </div>
              )}
            </div>
          ))}
          {court.priceRules.length === 0 && <EmptyState text="Chưa có giá. Hãy thêm giá thường trước khi vận hành booking." />}
        </section>
      </article>
    </section>
  );
}

function CourtFormView({
  form,
  setForm,
  isEditing,
  onSubmit,
}: {
  form: UpsertAdminCourtInput;
  setForm: (value: UpsertAdminCourtInput) => void;
  isEditing: boolean;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <Field label="Tên sân">
        <input required value={form.name} onChange={event => setForm({ ...form, name: event.target.value })} className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <MobileSelectSheet title="Loại sân" value={form.courtType} onChange={value => setForm({ ...form, courtType: value })} options={[
          { value: 'standard', label: 'Tiêu chuẩn' },
          { value: 'covered', label: 'Có mái che' },
          { value: 'training', label: 'Sân tập' },
          { value: 'tournament', label: 'Thi đấu' },
        ]} />
        <MobileSelectSheet title="Mặt sân" value={form.surface} onChange={value => setForm({ ...form, surface: value })} options={[
          { value: 'Acrylic', label: 'Acrylic' },
          { value: 'Acrylic ngoài trời', label: 'Acrylic ngoài trời' },
          { value: 'Acrylic có mái che', label: 'Acrylic có mái che' },
          { value: 'PU', label: 'PU' },
        ]} />
      </div>
      <Field label="Sức chứa">
        <input required min="1" inputMode="numeric" type="number" value={form.capacity} onChange={event => setForm({ ...form, capacity: Number(event.target.value) })} className={inputClass} />
      </Field>
      <div className="grid grid-cols-2 gap-2">
        <MobileTimePicker label="Mở cửa" value={form.opensAt} onChange={value => setForm({ ...form, opensAt: value })} />
        <MobileTimePicker label="Đóng cửa" value={form.closesAt} onChange={value => setForm({ ...form, closesAt: value })} minTime={form.opensAt} />
      </div>
      <MobileSelectSheet title="Trạng thái" value={form.status} onChange={value => setForm({ ...form, status: value as EditableStatus })} options={[
        { value: 'available', label: 'Đang trống', description: 'Cho phép tạo booking và lịch vận hành.' },
        { value: 'maintenance', label: 'Bảo trì', description: 'Chặn tạo booking mới.' },
        { value: 'paused', label: 'Tạm ngừng', description: 'Giữ dữ liệu, tạm khóa khai thác.' },
        { value: 'inactive', label: 'Ngừng hoạt động', description: 'Không còn hiển thị như sân khai thác.' },
      ]} />
      <Field label="Mô tả">
        <textarea value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} className={`${inputClass} h-20 py-3`} />
      </Field>
      <button className="h-11 w-full rounded-xl bg-[#075B5A] text-xs font-black text-white">
        {isEditing ? 'Lưu thay đổi' : 'Tạo sân'}
      </button>
    </form>
  );
}

function PriceFormView({
  court,
  priceForm,
  setPriceForm,
  isEditing,
  onToggleHolidayDate,
  onSubmit,
}: {
  court: AdminManagedCourt;
  priceForm: typeof emptyPriceForm;
  setPriceForm: (value: typeof emptyPriceForm) => void;
  isEditing: boolean;
  onToggleHolidayDate: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-2xl bg-white p-4 shadow-sm">
      <MobileSelectSheet title="Loại giá" value={priceForm.priceType} onChange={value => setPriceForm({ ...priceForm, priceType: value as PriceType })} options={[
        { value: 'regular', label: 'Giá thường' },
        { value: 'peak', label: 'Giá giờ cao điểm' },
        { value: 'holiday', label: 'Giá lễ' },
      ]} />
      {priceForm.priceType !== 'holiday' && (
        <div className="grid grid-cols-2 gap-2">
          <MobileTimePicker label="Giờ bắt đầu" value={priceForm.startTime} onChange={value => setPriceForm({ ...priceForm, startTime: value })} minTime={court.opensAt} maxTime={court.closesAt} />
          <MobileTimePicker label="Giờ kết thúc" value={priceForm.endTime} onChange={value => setPriceForm({ ...priceForm, endTime: value })} minTime={priceForm.startTime} maxTime={court.closesAt} />
        </div>
      )}
      {priceForm.priceType === 'holiday' && (
        <div className="rounded-2xl bg-slate-50 p-3">
          <MobileDatePicker label="Chọn ngày lễ" value={priceForm.holidayDraftDate} onChange={value => setPriceForm({ ...priceForm, holidayDraftDate: value })} />
          <button type="button" onClick={onToggleHolidayDate} className="mt-2 h-10 w-full rounded-xl border border-[#075B5A] text-[10px] font-black text-[#075B5A]">
            {priceForm.holidayDates.includes(priceForm.holidayDraftDate) ? 'Bỏ ngày này' : 'Thêm ngày này'}
          </button>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {priceForm.holidayDates.map(date => <span key={date} className="rounded-full bg-amber-50 px-2 py-1 text-[9px] font-bold text-amber-700">{isoToDisplay(date)}</span>)}
          </div>
        </div>
      )}
      <Field label="Mức giá">
        <input inputMode="numeric" value={priceForm.hourlyRateText} onChange={event => setPriceForm({ ...priceForm, hourlyRateText: formatMoneyInput(event.target.value) })} placeholder="100.000đ" className={inputClass} />
      </Field>
      <MobileDatePicker label="Bắt đầu áp dụng" value={priceForm.effectiveFrom} onChange={value => setPriceForm({ ...priceForm, effectiveFrom: value })} />
      <button className="h-11 w-full rounded-xl bg-[#075B5A] text-xs font-black text-white">{isEditing ? 'Cập nhật giá' : 'Lưu mức giá'}</button>
    </form>
  );
}

function CompactMetric({ label, value, danger = false }: { label: string; value: number; danger?: boolean }) {
  return (
    <div className="rounded-2xl bg-[#F4F7F7] px-2 py-3 text-center">
      <strong className={`block text-base leading-none ${danger ? 'text-rose-500' : 'text-[#075B5A]'}`}>
        {value.toLocaleString('vi-VN')}
      </strong>
      <span className="mt-1 block truncate text-[9px] font-bold text-slate-400">{label}</span>
    </div>
  );
}

function CourtListStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3">
      <span className="text-[11px] font-bold text-slate-400">{label}</span>
      <strong className="text-[12px] font-black text-slate-700">{value}</strong>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="font-bold text-slate-400">{label}</p><p className="mt-1 font-black text-slate-700">{value}</p></div>;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block text-[9px] font-bold text-slate-500">{label}<div className="mt-1">{children}</div></label>;
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-center text-[10px] text-slate-400">{text}</p>;
}
