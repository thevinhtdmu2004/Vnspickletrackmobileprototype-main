import { CheckCircle2, LoaderCircle, Plus, TriangleAlert, XCircle } from 'lucide-react';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  AdminExperienceOperations,
  createAdminContentItem,
  createAdminPromotion,
  getAdminExperienceOperations,
  reviewAdminContentItem,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';

interface Props {
  onBack: () => void;
}

type ContentItem = AdminExperienceOperations['contents'][number];
type View = 'content' | 'contentForm' | 'contentDetail' | 'promotions' | 'promotionForm' | 'states';
const input = 'w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#075B5A]';
const today = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(new Date());
const dateTime = new Intl.DateTimeFormat('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh',
  dateStyle: 'short',
  timeStyle: 'short',
});

const typeLabel: Record<ContentItem['contentType'], string> = {
  rules: 'Nội quy sân',
  bookingPolicy: 'Quy định đặt / hủy lịch',
  video: 'Video nâng cao',
  benefit: 'Quyền lợi hội viên',
};

const statusConfig = {
  approved: { label: 'Đã duyệt', className: 'bg-emerald-50 text-emerald-700' },
  pending: { label: 'Chờ duyệt', className: 'bg-amber-50 text-amber-700' },
  rejected: { label: 'Cần chỉnh sửa', className: 'bg-rose-50 text-rose-600' },
} as const;

export function ExperienceOperationsScreen({ onBack }: Props) {
  const [data, setData] = useState<AdminExperienceOperations | null>(null);
  const [view, setView] = useState<View>('content');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setData(await getAdminExperienceOperations());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading && !data) {
    return <ExperienceState loading text="Đang tải dữ liệu..." />;
  }
  if (!data) {
    return <ExperienceState text={error} onBack={onBack} />;
  }

  const selected = selectedId ? data.contents.find(item => item.id === selectedId) ?? null : null;
  const back = view === 'content'
    ? onBack
    : () => setView(view === 'contentDetail' || view === 'contentForm'
      ? 'content'
      : view === 'promotionForm'
        ? 'promotions'
        : 'content');
  const title = view === 'contentDetail'
    ? 'Chi tiết nội dung'
    : view === 'content' || view === 'contentForm'
      ? 'Tài liệu & nội dung'
      : view === 'promotions' || view === 'promotionForm'
        ? 'Ưu đãi'
        : 'Trạng thái hệ thống';

  const finish = async (message: string, next: View) => {
    await load();
    setNotice(message);
    setView(next);
  };

  const openContent = (item: ContentItem) => {
    setSelectedId(item.id);
    setNotice('');
    setView('contentDetail');
  };

  const updateReviewedContent = (updated: ContentItem) => {
    setData(current => current
      ? { ...current, contents: current.contents.map(item => item.id === updated.id ? updated : item) }
      : current);
    setNotice(updated.status === 'approved' ? 'Đã duyệt nội dung.' : 'Đã từ chối nội dung.');
  };

  return (
    <div className="flex h-screen flex-col bg-[#F4F7F7] text-[#172323]">
      <AppScreenHeader
        title={title}
        onBack={back}
        variant={view === 'contentDetail' ? 'hero' : 'plain'}
        eyebrow={view === 'contentDetail' ? 'Admin · Tài liệu & nội dung' : undefined}
        action={view === 'content' ? (
          <button onClick={() => setView('contentForm')} className="xp-pill flex items-center gap-1">
            <Plus className="h-3 w-3" /> Thêm
          </button>
        ) : view === 'promotions' ? (
          <button onClick={() => setView('promotionForm')} className="xp-pill flex items-center gap-1">
            <Plus className="h-3 w-3" /> Mới
          </button>
        ) : undefined}
      />

      {notice && <div className="mx-4 mb-2 rounded-xl bg-emerald-50 p-2 text-xs text-emerald-700">{notice}</div>}

      {(view === 'content' || view === 'promotions') && (
        <nav className="mx-4 mb-4 grid grid-cols-2 rounded-xl bg-white p-1">
          <Tab active={view === 'content'} onClick={() => setView('content')}>Tài liệu</Tab>
          <Tab active={view === 'promotions'} onClick={() => setView('promotions')}>Ưu đãi</Tab>
        </nav>
      )}

      <main className="flex-1 overflow-y-auto px-4 pb-24">
        {view === 'content' && <ContentList data={data} onSelect={openContent} />}
        {view === 'contentForm' && <ContentForm data={data} onSaved={() => finish('Đã lưu nội dung.', 'content')} />}
        {view === 'contentDetail' && selected && (
          <ContentDetail item={selected} onReviewed={updateReviewedContent} />
        )}
        {view === 'promotions' && <PromotionList data={data} />}
        {view === 'promotionForm' && <PromotionForm onSaved={() => finish('Đã tạo chương trình ưu đãi.', 'promotions')} />}
        {view === 'states' && <SystemStates data={data} loading={loading} error={error} />}
      </main>
      <ExperienceStyle />
    </div>
  );
}

function ContentList({ data, onSelect }: { data: AdminExperienceOperations; onSelect: (item: ContentItem) => void }) {
  const [filter, setFilter] = useState<'all' | 'package' | 'pending'>('all');
  const rows = data.contents.filter(item => {
    if (filter === 'package') return Boolean(item.packageId);
    if (filter === 'pending') return item.status === 'pending';
    return true;
  });

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        {([['all', 'Tất cả'], ['package', 'Theo gói'], ['pending', 'Chờ duyệt']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className={`xp-pill ${filter === id ? 'ring-1 ring-[#2A9D8F]' : ''}`}>
            {label}
          </button>
        ))}
      </div>
      <section>
        <h2 className="xp-title mb-3">Nội dung công bố</h2>
        <div className="space-y-2">
          {rows.map(item => (
            <button
              type="button"
              key={item.id}
              onClick={() => onSelect(item)}
              className="xp-card flex w-full items-center justify-between gap-3 text-left active:scale-[0.99]"
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-bold">{item.title}</p>
                <p className="xp-sub line-clamp-2">{typeLabel[item.contentType]} · {item.summary}</p>
              </div>
              <Badge status={item.status} />
            </button>
          ))}
          {!rows.length && <Empty text="Không có nội dung phù hợp." />}
        </div>
      </section>
    </div>
  );
}

function ContentDetail({ item, onReviewed }: { item: ContentItem; onReviewed: (item: ContentItem) => void }) {
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const review = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !reason.trim()) {
      setError('Vui lòng nhập lý do từ chối.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const updated = await reviewAdminContentItem(item.id, status, reason.trim() || undefined);
      onReviewed(updated);
      setRejecting(false);
    } catch (reviewError) {
      setError(reviewError instanceof Error ? reviewError.message : 'Không thể xử lý nội dung.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      <section className="xp-card space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-base font-black">{item.title}</p>
            <p className="xp-sub mt-1">{typeLabel[item.contentType]}</p>
          </div>
          <Badge status={item.status} />
        </div>
        <Detail label="Người tạo" value={item.createdByName} />
        <Detail label="Ngày tạo" value={dateTime.format(new Date(item.createdAtUtc))} />
        <Detail label="Phạm vi áp dụng" value={item.packageName ?? 'Tất cả hội viên'} />
        <div>
          <p className="xp-sub mb-2">Nội dung chi tiết</p>
          <p className="whitespace-pre-wrap rounded-xl bg-[#F4F7F7] p-3 text-xs leading-5">{item.summary}</p>
        </div>
      </section>

      {item.status !== 'pending' && (
        <section className="xp-card space-y-2">
          <h2 className="xp-title">Kết quả xử lý</h2>
          <Detail label="Người xử lý" value={item.reviewedByName ?? 'Admin'} />
          <Detail label="Thời gian" value={item.reviewedAtUtc ? dateTime.format(new Date(item.reviewedAtUtc)) : 'Chưa ghi nhận'} />
          {item.rejectionReason && <Detail label="Lý do từ chối" value={item.rejectionReason} danger />}
        </section>
      )}

      {item.status === 'pending' && (
        <section className="space-y-3">
          {rejecting && (
            <Field label="Lý do từ chối (bắt buộc)">
              <textarea
                autoFocus
                value={reason}
                onChange={event => setReason(event.target.value)}
                className={`${input} min-h-24 py-3`}
                placeholder="Nêu rõ nội dung cần chỉnh sửa..."
              />
            </Field>
          )}
          {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
          <div className="grid grid-cols-2 gap-3">
            <button
              disabled={saving}
              onClick={() => rejecting ? void review('rejected') : setRejecting(true)}
              className="xp-secondary border-rose-200 text-rose-600"
            >
              <XCircle className="h-4 w-4" /> {rejecting ? 'Xác nhận từ chối' : 'Từ chối'}
            </button>
            <button disabled={saving} onClick={() => void review('approved')} className="xp-primary flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> {saving ? 'Đang xử lý...' : 'Duyệt'}
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

function ContentForm({ data, onSaved }: { data: AdminExperienceOperations; onSaved: () => Promise<void> }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ContentItem['contentType']>('rules');
  const [packageId, setPackageId] = useState('');
  const [summary, setSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createAdminContentItem({ title, contentType: type, status: 'pending', packageId: packageId || undefined, summary });
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể lưu nội dung.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Tiêu đề"><input required value={title} onChange={event => setTitle(event.target.value)} className={input} /></Field>
      <Field label="Phân loại">
        <select value={type} onChange={event => setType(event.target.value as ContentItem['contentType'])} className={input}>
          <option value="rules">Nội quy sân</option>
          <option value="bookingPolicy">Quy định đặt / hủy lịch</option>
          <option value="video">Video nâng cao</option>
          <option value="benefit">Quyền lợi hội viên</option>
        </select>
      </Field>
      <Field label="Phạm vi áp dụng">
        <select value={packageId} onChange={event => setPackageId(event.target.value)} className={input}>
          <option value="">Tất cả hội viên</option>
          {data.packages.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      </Field>
      <Field label="Nội dung"><textarea required value={summary} onChange={event => setSummary(event.target.value)} className={`${input} min-h-28 py-3`} /></Field>
      <p className="xp-sub">Nội dung mới sẽ ở trạng thái Chờ duyệt.</p>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <button disabled={saving} className="xp-primary">{saving ? 'Đang lưu...' : 'Lưu nội dung'}</button>
    </form>
  );
}

function PromotionList({ data }: { data: AdminExperienceOperations }) {
  const groups = { active: 'Đang áp dụng', upcoming: 'Sắp bắt đầu', ended: 'Đã kết thúc' } as const;
  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([status, label]) => {
        const rows = data.promotions.filter(item => item.status === status);
        return (
          <section key={status}>
            <h2 className="xp-title mb-3">{label}</h2>
            <div className="space-y-2">
              {rows.map(item => (
                <article key={item.id} className={`xp-card ${status === 'active' ? 'bg-[#075B5A] text-white' : ''}`}>
                  <p className="text-xs font-bold">{item.name}</p>
                  <p className={`xp-sub ${status === 'active' ? 'text-white/65' : ''}`}>{item.memberGroup} · {item.conditions}</p>
                </article>
              ))}
              {!rows.length && <Empty text={`Không có ưu đãi ${label.toLowerCase()}.`} />}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PromotionForm({ onSaved }: { onSaved: () => Promise<void> }) {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('all');
  const [type, setType] = useState('discount');
  const [value, setValue] = useState('');
  const [start, setStart] = useState(today());
  const [end, setEnd] = useState(today());
  const [conditions, setConditions] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      await createAdminPromotion({ name, memberGroup: group, benefitType: type, benefitValue: Number(value), startDate: start, endDate: end, conditions });
      await onSaved();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tạo ưu đãi.');
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <Field label="Tên chương trình"><input required value={name} onChange={event => setName(event.target.value)} className={input} /></Field>
      <Field label="Đối tượng áp dụng"><select value={group} onChange={event => setGroup(event.target.value)} className={input}><option value="all">Tất cả hội viên</option><option value="premium">Hội viên Premium</option><option value="newMembers">Hội viên mới</option></select></Field>
      <Field label="Loại ưu đãi"><select value={type} onChange={event => setType(event.target.value)} className={input}><option value="discount">Giảm giá (%)</option><option value="bonusHours">Tặng giờ</option></select></Field>
      <Field label="Giá trị"><input required min="0.1" step="0.1" type="number" value={value} onChange={event => setValue(event.target.value)} className={input} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Bắt đầu"><input type="date" value={start} onChange={event => setStart(event.target.value)} className={input} /></Field>
        <Field label="Kết thúc"><input type="date" value={end} onChange={event => setEnd(event.target.value)} className={input} /></Field>
      </div>
      <Field label="Điều kiện áp dụng"><textarea value={conditions} onChange={event => setConditions(event.target.value)} className={`${input} min-h-20 py-3`} /></Field>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <button disabled={saving} className="xp-primary">{saving ? 'Đang lưu...' : 'Lưu ưu đãi'}</button>
    </form>
  );
}

function SystemStates({ data, loading, error }: { data: AdminExperienceOperations; loading: boolean; error: string }) {
  return (
    <div className="space-y-3">
      <h2 className="xp-title">Các trạng thái cần thiết kế</h2>
      {data.alerts.map((item, index) => (
        <article key={`${item.type}-${index}`} className={`rounded-xl p-4 ${item.severity === 'critical' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'}`}>
          <p className="text-xs font-bold">{item.title}</p><p className="mt-1 text-[9px] opacity-75">{item.detail}</p>
        </article>
      ))}
      {loading && <article className="rounded-xl bg-sky-50 p-4 text-sky-700"><p className="text-xs font-bold">Đang tải dữ liệu</p></article>}
      {error && <article className="rounded-xl bg-rose-100 p-4 text-rose-600"><p className="text-xs font-bold">Lỗi hệ thống</p><p className="mt-1 text-[9px]">{error}</p></article>}
      {!data.alerts.length && !loading && !error && <Empty text="Hệ thống ổn định, không có cảnh báo ưu tiên." />}
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button onClick={onClick} className={`h-9 rounded-lg text-[10px] font-bold ${active ? 'bg-[#075B5A] text-white' : 'text-slate-400'}`}>{children}</button>;
}

function Badge({ status }: { status: ContentItem['status'] }) {
  const config = statusConfig[status];
  return <span className={`xp-badge ${config.className}`}>{config.label}</span>;
}

function Detail({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return <div className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0"><span className="xp-sub">{label}</span><span className={`text-right text-xs font-bold ${danger ? 'text-rose-600' : ''}`}>{value}</span></div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="xp-sub mb-1.5 block">{label}</span>{children}</label>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">{text}</div>;
}

function ExperienceState({ loading, text, onBack }: { loading?: boolean; text: string; onBack?: () => void }) {
  return (
    <div className="flex h-screen flex-col bg-[#F4F7F7]">
      {onBack && <AppScreenHeader title="Tài liệu & nội dung" onBack={onBack} />}
      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
        {loading ? <LoaderCircle className="animate-spin text-[#075B5A]" /> : <TriangleAlert className="text-rose-500" />}
        <p className="text-sm">{text}</p>
      </div>
      <ExperienceStyle />
    </div>
  );
}

function ExperienceStyle() {
  return <style>{`
    .xp-card{background:#fff;border:1px solid #e7eded;border-radius:14px;padding:14px}
    .xp-pill{border-radius:999px;background:#e3f6ef;color:#087b62;padding:6px 11px;font-size:9px;font-weight:700}
    .xp-title{font-size:12px;font-weight:800}
    .xp-sub{color:#8a9999;font-size:9px;line-height:1.45}
    .xp-badge{display:inline-block;height:max-content;border-radius:999px;padding:4px 8px;font-size:8px;font-weight:700;white-space:nowrap}
    .xp-primary{width:100%;height:44px;border-radius:12px;background:#075b5a;color:#fff;font-size:11px;font-weight:800}
    .xp-secondary{height:44px;border-radius:12px;background:#fff;border-width:1px;font-size:11px;font-weight:800;display:flex;align-items:center;justify-content:center;gap:8px}
    .xp-primary:disabled,.xp-secondary:disabled{opacity:.5}
  `}</style>;
}
