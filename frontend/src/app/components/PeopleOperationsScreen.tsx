import {
  LoaderCircle,
  Search,
  TriangleAlert,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  AdminCoachOperations,
  AdminCoachSummary,
  AdminMembership,
  AdminPeopleOperations,
  createAdminCoach,
  deleteAdminCoach,
  deleteAdminMember,
  downgradeAdminCoach,
  getAdminPeopleOperations,
  setAdminCoachStatus,
  setAdminMemberStatus,
  updateAdminMember,
  upgradeAdminMemberToCoach,
  updateAdminCoachAgreement,
  updateAdminCoachProfile,
} from '../services/adminService';
import { AppScreenHeader } from './AppScreenHeader';
import { MobileSelectSheet } from './mobile/MobileSelectSheet';

interface PeopleOperationsScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

type View =
  | { type: 'coaches' }
  | { type: 'addCoach' }
  | { type: 'coachActivity'; coach: AdminCoachSummary }
  | { type: 'members' }
  | { type: 'memberDetail'; member: AdminMembership };

const money = (value: number) => `${value.toLocaleString('vi-VN')}đ`;
const agreementLabel = {
  hourlyRental: 'Thuê sân theo giờ',
  revenueShare: 'Chia sẻ doanh thu',
  hybrid: 'Kết hợp phí sân & doanh thu',
} as const;
const coachStatus = {
  active: { label: 'Đang hợp tác', tone: 'green' as const },
  paused: { label: 'Tạm ngưng', tone: 'amber' as const },
  underReview: { label: 'Đang xem xét', tone: 'blue' as const },
};

const memberStatus = {
  active: { label: 'Hoạt động', className: 'bg-emerald-50 text-emerald-700' },
  expiring: { label: 'Sắp hết hạn', className: 'bg-amber-50 text-amber-700' },
  paymentDue: { label: 'Chờ thanh toán', className: 'bg-rose-50 text-rose-600' },
  inactive: { label: 'Tạm ngưng', className: 'bg-slate-100 text-slate-500' },
} as const;

export function PeopleOperationsScreen({ onBack, onNavigate }: PeopleOperationsScreenProps) {
  const [data, setData] = useState<AdminPeopleOperations | null>(null);
  const [view, setView] = useState<View>({ type: 'coaches' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    return getAdminPeopleOperations()
      .then(setData)
      .catch(reason => setError(reason instanceof Error ? reason.message : 'Không thể tải dữ liệu.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void load();
  }, []);

  if (loading) {
    return <StatePage><LoaderCircle className="w-7 h-7 animate-spin text-[#075B5A]" /><p>Đang tải HLV và Hội viên...</p></StatePage>;
  }

  if (!data) {
    return (
      <StatePage>
        <TriangleAlert className="w-8 h-8 text-rose-500" />
        <p className="font-bold">Chưa thể tải dữ liệu</p>
        <p className="text-xs text-slate-400">{error}</p>
        <button onClick={onBack} className="rounded-xl bg-[#075B5A] px-4 py-2 text-white text-xs">Quay lại</button>
      </StatePage>
    );
  }

  const back = view.type === 'coaches' ? onBack : () => {
    setView(view.type === 'memberDetail' ? { type: 'members' } : { type: 'coaches' });
  };
  const title = view.type === 'coaches' ? 'Quản lý HLV' :
    view.type === 'addCoach' ? 'Thêm HLV' :
    view.type === 'coachActivity' ? 'Chi tiết HLV' :
    view.type === 'members' ? 'Hội viên' : 'Chi tiết hội viên';

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#F4F7F7] text-[#172323]">
      <AppScreenHeader
        title={title}
        onBack={back}
        variant={view.type === 'coachActivity' || view.type === 'memberDetail'
          ? 'detail'
          : view.type === 'addCoach'
            ? 'form'
            : 'list'}
        eyebrow={view.type === 'coachActivity' || view.type === 'memberDetail' ? 'Admin · HLV & Hội viên' : undefined}
        action={view.type === 'coaches'
          ? <button onClick={() => setView({ type: 'addCoach' })} className="pill">+ Thêm</button>
          : view.type === 'members'
            ? <button onClick={() => onNavigate('package-management')} className="pill">+ Gói</button>
            : undefined}
      />

      {(view.type === 'coaches' || view.type === 'members') && (
        <div className="mx-4 mb-3 grid grid-cols-2 rounded-xl bg-white p-1 border border-slate-100">
          <button onClick={() => setView({ type: 'coaches' })} className={`h-9 rounded-lg text-xs font-bold ${view.type === 'coaches' ? 'bg-[#075B5A] text-white' : 'text-slate-400'}`}>Huấn luyện viên</button>
          <button onClick={() => setView({ type: 'members' })} className={`h-9 rounded-lg text-xs font-bold ${view.type === 'members' ? 'bg-[#075B5A] text-white' : 'text-slate-400'}`}>Hội viên</button>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
        {view.type === 'coaches' && <CoachList data={data} onSelect={coach => setView({ type: 'coachActivity', coach })} />}
        {view.type === 'addCoach' && (
          <AddCoachForm
            onCreated={async () => {
              await load();
              setView({ type: 'coaches' });
            }}
          />
        )}
        {view.type === 'coachActivity' && (
          <CoachProfile
            coach={view.coach}
            operations={data.coachOperations.find(item => item.coachId === view.coach.id)}
            onChanged={load}
            onSchedule={() => onNavigate('coach-operations-schedule')}
            onReconciliation={() => onNavigate('coach-reconciliation')}
            onDebts={() => onNavigate('coach-debts')}
          />
        )}
        {view.type === 'members' && <MemberList data={data} onSelect={member => setView({ type: 'memberDetail', member })} />}
        {view.type === 'memberDetail' && (
          <MemberDetail
            member={view.member}
            onRenew={() => onNavigate('renew-package')}
            onBooking={() => onNavigate('court-booking')}
            onChanged={load}
          />
        )}
      </main>
      <style>{`
        .card {
          background: #fff;
          border: 1px solid #e7eded;
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 2px 8px rgba(7, 91, 90, 0.035);
        }
        .pill {
          border-radius: 999px;
          background: #e3f6ef;
          color: #087b62;
          padding: 6px 11px;
          font-size: 10px;
          font-weight: 700;
        }
        .section-title {
          font-size: 12px;
          font-weight: 800;
          color: #172323;
        }
        .sub {
          margin-top: 4px;
          color: #8a9999;
          font-size: 9px;
          line-height: 1.45;
        }
        .badge {
          display: inline-block;
          margin-top: 5px;
          border-radius: 999px;
          padding: 4px 8px;
          font-size: 8px;
          font-weight: 700;
          white-space: nowrap;
        }
        .primary, .secondary {
          width: 100%;
          height: 44px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 800;
        }
        .primary {
          background: #075b5a;
          color: #fff;
        }
        .secondary {
          background: #fff;
          color: #075b5a;
          border: 1px solid #dfe8e8;
        }
        .coach-input {
          width: 100%;
          height: 42px;
          border-radius: 12px;
          border: 1px solid #dfe8e8;
          background: #fff;
          padding: 0 12px;
          font-size: 12px;
          outline: none;
        }
        .coach-input:focus {
          border-color: #075b5a;
        }
      `}</style>
    </div>
  );
}

function AddCoachForm({ onCreated }: { onCreated: () => Promise<void> }) {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [status, setStatus] = useState<AdminCoachSummary['status']>('active');
  const [agreement, setAgreement] = useState<AdminCoachSummary['agreementType']>('hourlyRental');
  const [hourlyRate, setHourlyRate] = useState('150000');
  const [sharePercent, setSharePercent] = useState('0');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async () => {
    if (!fullName.trim() || !username.trim() || pin.length < 6) {
      setError('Vui lòng nhập tên, tài khoản và PIN tối thiểu 6 ký tự.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      await createAdminCoach({
        fullName: fullName.trim(),
        username: username.trim(),
        pin,
        partnershipStatus: status,
        agreementType: agreement,
        hourlyCourtRate: Number(hourlyRate),
        revenueSharePercent: Number(sharePercent),
      });
      await onCreated();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể tạo hồ sơ HLV.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="card space-y-3">
        <div>
          <h2 className="section-title">Thông tin HLV</h2>
          <p className="sub">Tạo tài khoản Coach và hồ sơ hợp tác với chủ sân.</p>
        </div>
        <Field label="Họ tên HLV">
          <input value={fullName} onChange={event => setFullName(event.target.value)} className="coach-input" placeholder="Ví dụ: Nguyễn Văn Minh" />
        </Field>
        <Field label="Tài khoản đăng nhập">
          <input value={username} onChange={event => setUsername(event.target.value)} className="coach-input" placeholder="Ví dụ: coach.minh" />
        </Field>
        <Field label="Mã PIN ban đầu">
          <input type="password" value={pin} onChange={event => setPin(event.target.value)} className="coach-input" placeholder="Tối thiểu 6 ký tự" />
        </Field>
      </section>

      <section className="card space-y-3">
        <h2 className="section-title">Thiết lập hợp tác</h2>
        <Field label="Trạng thái">
          <MobileSelectSheet
            title="Trạng thái"
            value={status}
            onChange={value => setStatus(value as AdminCoachSummary['status'])}
            options={[
              { value: 'active', label: 'Đang hợp tác' },
              { value: 'paused', label: 'Tạm ngưng' },
              { value: 'underReview', label: 'Đang xem xét' },
            ]}
          />
        </Field>
        <Field label="Hình thức hợp tác">
          <MobileSelectSheet
            title="Hình thức hợp tác"
            value={agreement}
            onChange={value => setAgreement(value as AdminCoachSummary['agreementType'])}
            options={[
              { value: 'hourlyRental', label: 'Thuê sân theo giờ' },
              { value: 'revenueShare', label: 'Chia sẻ doanh thu' },
              { value: 'hybrid', label: 'Kết hợp' },
            ]}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Phí sân / giờ">
            <input type="number" min="0" value={hourlyRate} onChange={event => setHourlyRate(event.target.value)} className="coach-input" />
          </Field>
          <Field label="Chia sẻ (%)">
            <input type="number" min="0" max="100" value={sharePercent} onChange={event => setSharePercent(event.target.value)} className="coach-input" />
          </Field>
        </div>
      </section>

      {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">{error}</p>}
      <button disabled={saving} onClick={() => void submit()} className="primary disabled:opacity-50">
        {saving ? 'Đang tạo...' : 'Tạo hồ sơ HLV'}
      </button>
    </div>
  );
}

function CoachList({ data, onSelect }: { data: AdminPeopleOperations; onSelect: (coach: AdminCoachSummary) => void }) {
  const [query, setQuery] = useState('');
  const rows = data.coaches.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Tổng HLV" value={data.coaches.length.toString().padStart(2, '0')} />
        <Metric label="Có lịch sân hôm nay" value={data.coaches.filter(item => item.todayUsageCount > 0).length.toString().padStart(2, '0')} />
      </div>
      <SearchBox value={query} onChange={setQuery} placeholder="Tìm huấn luyện viên" />
      <section>
        <h2 className="section-title">Danh sách HLV</h2>
        <div className="space-y-2 mt-3">
          {rows.map(coach => (
            <button key={coach.id} onClick={() => onSelect(coach)} className="card w-full flex items-center text-left">
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs">{coach.name}</p>
                <p className="sub">{agreementLabel[coach.agreementType]} • {coach.monthUsageHours.toLocaleString('vi-VN')} giờ tháng này</p>
                {coach.outstandingAmount > 0 && <p className="mt-1 text-[9px] font-bold text-amber-600">Công nợ {money(coach.outstandingAmount)}</p>}
              </div>
              <div className="text-right">
                <Status label={coachStatus[coach.status].label} tone={coachStatus[coach.status].tone} />
                {coach.conflictCount > 0 && <p className="mt-2 text-[8px] font-bold text-rose-600">{coach.conflictCount} xung đột lịch</p>}
              </div>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="section-title">Tác vụ nhanh</h2>
        <button onClick={() => rows[0] && onSelect(rows[0])} className="primary mt-3">Xem hồ sơ HLV</button>
      </section>
    </div>
  );
}

function CoachProfile({ coach, operations, onChanged, onSchedule, onReconciliation, onDebts }: {
  coach: AdminCoachSummary;
  operations?: AdminCoachOperations;
  onChanged: () => Promise<void>;
  onSchedule: () => void;
  onReconciliation: () => void;
  onDebts: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(coach.status);
  const [agreement, setAgreement] = useState(coach.agreementType);
  const [hourlyRate, setHourlyRate] = useState(coach.hourlyCourtRate.toString());
  const [sharePercent, setSharePercent] = useState(coach.revenueSharePercent.toString());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingProfile, setEditingProfile] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(coach.avatarUrl ?? '');
  const [phoneNumber, setPhoneNumber] = useState(coach.phoneNumber ?? '');
  const [email, setEmail] = useState(coach.email ?? '');
  const [professionalLevel, setProfessionalLevel] = useState(coach.professionalLevel ?? '');
  const [certificates, setCertificates] = useState(coach.certificates ?? '');
  const [experienceYears, setExperienceYears] = useState(coach.experienceYears.toString());
  const [teachingSkills, setTeachingSkills] = useState(coach.teachingSkills ?? '');
  const [biography, setBiography] = useState(coach.biography ?? '');
  const [workingSchedule, setWorkingSchedule] = useState(coach.workingSchedule ?? '');

  const saveAgreement = async () => {
    setSaving(true);
    setError('');
    try {
      await updateAdminCoachAgreement(coach.id, {
        partnershipStatus: status,
        agreementType: agreement,
        hourlyCourtRate: Number(hourlyRate),
        revenueSharePercent: Number(sharePercent),
      });
      await onChanged();
      setEditing(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể cập nhật hợp tác HLV.');
    } finally {
      setSaving(false);
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    setError('');
    try {
      await updateAdminCoachProfile(coach.id, {
        avatarUrl,
        phoneNumber,
        email,
        professionalLevel,
        certificates,
        experienceYears: Number(experienceYears),
        teachingSkills,
        biography,
        workingSchedule,
      });
      await onChanged();
      setEditingProfile(false);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Không thể cập nhật hồ sơ HLV.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl bg-[#075B5A] p-4 text-white">
        <div className="flex items-center gap-3">
          {coach.avatarUrl ? (
            <img src={coach.avatarUrl} alt={coach.name} className="h-14 w-14 rounded-full object-cover" />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-xl font-black">
              {coach.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-lg font-black">{coach.name}</h2>
            <p className="mt-1 text-xs text-white/70">{agreementLabel[operations?.agreementType ?? coach.agreementType]}</p>
          </div>
        </div>
        <span className="mt-3 inline-block rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold text-[#087B62]">
          {coachStatus[operations?.partnershipStatus ?? coach.status].label}
        </span>
      </section>

      <section className="card">
        <div className="flex items-start justify-between gap-3">
          <div><p className="section-title">Hồ sơ chuyên môn</p><p className="sub">Thông tin liên hệ, chứng chỉ và lịch làm việc.</p></div>
          <button onClick={() => setEditingProfile(value => !value)} className="pill">{editingProfile ? 'Đóng' : 'Cập nhật'}</button>
        </div>
        {!editingProfile ? (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <ProfileInfo label="Điện thoại" value={coach.phoneNumber || 'Chưa cập nhật'} />
            <ProfileInfo label="Email" value={coach.email || 'Chưa cập nhật'} />
            <ProfileInfo label="Trình độ" value={coach.professionalLevel || 'Chưa cập nhật'} />
            <ProfileInfo label="Kinh nghiệm" value={`${coach.experienceYears} năm`} />
            <ProfileInfo label="Kỹ năng giảng dạy" value={coach.teachingSkills || 'Chưa cập nhật'} wide />
            <ProfileInfo label="Chứng chỉ" value={coach.certificates || 'Chưa cập nhật'} wide />
            <ProfileInfo label="Lịch làm việc" value={coach.workingSchedule || 'Chưa cập nhật'} wide />
            <ProfileInfo label="Giới thiệu" value={coach.biography || 'Chưa cập nhật'} wide />
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <Field label="Ảnh đại diện (URL)"><input value={avatarUrl} onChange={event => setAvatarUrl(event.target.value)} className="coach-input" /></Field>
            <Field label="Số điện thoại"><input value={phoneNumber} onChange={event => setPhoneNumber(event.target.value)} className="coach-input" /></Field>
            <Field label="Email"><input type="email" value={email} onChange={event => setEmail(event.target.value)} className="coach-input" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Trình độ"><input value={professionalLevel} onChange={event => setProfessionalLevel(event.target.value)} className="coach-input" /></Field>
              <Field label="Số năm kinh nghiệm"><input type="number" min="0" max="80" value={experienceYears} onChange={event => setExperienceYears(event.target.value)} className="coach-input" /></Field>
            </div>
            <Field label="Chứng chỉ"><textarea value={certificates} onChange={event => setCertificates(event.target.value)} className="coach-input min-h-20 py-3" /></Field>
            <Field label="Môn / kỹ năng giảng dạy"><textarea value={teachingSkills} onChange={event => setTeachingSkills(event.target.value)} className="coach-input min-h-20 py-3" /></Field>
            <Field label="Lịch làm việc"><textarea value={workingSchedule} onChange={event => setWorkingSchedule(event.target.value)} className="coach-input min-h-20 py-3" /></Field>
            <Field label="Giới thiệu cá nhân"><textarea value={biography} onChange={event => setBiography(event.target.value)} className="coach-input min-h-24 py-3" /></Field>
            <button disabled={saving} onClick={() => void saveProfile()} className="primary disabled:opacity-50">{saving ? 'Đang lưu...' : 'Lưu hồ sơ chuyên môn'}</button>
          </div>
        )}
      </section>

      <section className="card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="section-title">Hồ sơ hợp tác</p>
            <p className="sub">Hợp tác từ {new Date(coach.partnershipStartedAtUtc).toLocaleDateString('vi-VN')}</p>
          </div>
          <button onClick={() => setEditing(value => !value)} className="pill">{editing ? 'Đóng' : 'Điều chỉnh'}</button>
        </div>
        {editing && (
          <div className="mt-4 space-y-3">
            <Field label="Trạng thái hợp tác">
              <MobileSelectSheet
                title="Trạng thái hợp tác"
                value={status}
                onChange={value => setStatus(value as AdminCoachSummary['status'])}
                options={[
                  { value: 'active', label: 'Đang hợp tác' },
                  { value: 'paused', label: 'Tạm ngưng' },
                  { value: 'underReview', label: 'Đang xem xét' },
                ]}
              />
            </Field>
            <Field label="Hình thức hợp tác">
              <MobileSelectSheet
                title="Hình thức hợp tác"
                value={agreement}
                onChange={value => setAgreement(value as AdminCoachSummary['agreementType'])}
                options={[
                  { value: 'hourlyRental', label: 'Thuê sân theo giờ' },
                  { value: 'revenueShare', label: 'Chia sẻ doanh thu' },
                  { value: 'hybrid', label: 'Kết hợp' },
                ]}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Phí sân / giờ"><input type="number" min="0" value={hourlyRate} onChange={event => setHourlyRate(event.target.value)} className="coach-input" /></Field>
              <Field label="Chia sẻ (%)"><input type="number" min="0" max="100" value={sharePercent} onChange={event => setSharePercent(event.target.value)} className="coach-input" /></Field>
            </div>
            <button disabled={saving} onClick={() => void saveAgreement()} className="primary">{saving ? 'Đang lưu...' : 'Lưu hồ sơ hợp tác'}</button>
          </div>
        )}
        {error && <p className="mt-3 text-xs font-medium text-rose-600">{error}</p>}
      </section>

      <section>
        <h2 className="section-title mb-3">Công nợ tổng quan</h2>
        <div className="grid grid-cols-2 gap-3">
          <Metric label="Phí sân phát sinh" value={money(operations?.courtFee ?? 0)} danger />
          <Metric label="Đã thanh toán" value={money(operations?.paidAmount ?? 0)} />
          <Metric label="Còn phải thu" value={money(operations?.outstandingAmount ?? 0)} warning />
          <Metric label="Trạng thái" value={operations?.reconciliationStatus === 'reconciled' ? 'Đã đối soát' : operations?.reconciliationStatus === 'partial' ? 'Một phần' : 'Chờ xử lý'} />
        </div>
      </section>

      <div className="space-y-2">
        <button onClick={onSchedule} className="secondary">Mở Lịch vận hành</button>
        <button onClick={onReconciliation} className="secondary">Mở Đối soát HLV</button>
        <button onClick={onDebts} className="secondary">Mở Công nợ HLV</button>
        <button onClick={() => void setAdminCoachStatus(coach.id, !coachStatusIsActive(coach)).then(onChanged)} className="secondary">{coachStatusIsActive(coach) ? 'Vô hiệu hóa HLV' : 'Kích hoạt lại HLV'}</button>
        <button onClick={() => void downgradeAdminCoach(coach.id).then(onChanged).catch(reason => setError(reason instanceof Error ? reason.message : 'Không thể hạ quyền HLV.'))} className="secondary">Hạ quyền về Hội viên</button>
        <button onClick={() => void deleteAdminCoach(coach.id).then(onChanged).catch(reason => setError(reason instanceof Error ? reason.message : 'Không thể xóa HLV.'))} className="secondary !border-rose-200 !text-rose-600">Xóa HLV khi hợp lệ</button>
      </div>
    </div>
  );
}

function coachStatusIsActive(coach: AdminCoachSummary) {
  return coach.status === 'active';
}

function ProfileInfo({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return <div className={`rounded-xl bg-slate-50 p-3 ${wide ? 'col-span-2' : ''}`}><p className="text-[8px] text-slate-400">{label}</p><p className="mt-1 text-[10px] font-bold leading-4 text-slate-700">{value}</p></div>;
}

function MemberList({ data, onSelect }: { data: AdminPeopleOperations; onSelect: (member: AdminMembership) => void }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | AdminMembership['status']>('all');
  const rows = useMemo(() => data.members.filter(item =>
    (filter === 'all' || item.status === filter) &&
    `${item.name} ${item.phone}`.toLowerCase().includes(query.toLowerCase()),
  ), [data.members, filter, query]);
  return (
    <div className="space-y-4">
      <SearchBox value={query} onChange={setQuery} placeholder="Tìm hội viên" />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {([['all', 'Tất cả'], ['active', 'Hoạt động'], ['expiring', 'Sắp hết hạn'], ['paymentDue', 'Chờ thanh toán']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-[9px] font-bold ${filter === id ? 'bg-[#DFF4EF] text-[#087B62]' : 'bg-white text-slate-400'}`}>{label}</button>
        ))}
      </div>
      <h2 className="section-title">{rows.length} hội viên</h2>
      <div className="space-y-2">
        {rows.map(member => {
          const status = memberStatus[member.status];
          return (
            <button key={member.id} onClick={() => onSelect(member)} className="card w-full flex items-center text-left">
              <div className="flex-1"><p className="font-bold text-xs">{member.name}</p><p className="sub">{member.packageName} • Còn {member.remainingSessions} buổi</p></div>
              <div className="text-right">{member.outstandingAmount > 0 && <p className="font-black text-xs">{money(member.outstandingAmount)}</p>}<span className={`badge ${status.className}`}>{status.label}</span></div>
            </button>
          );
        })}
      </div>
      {data.popularPackage && (
        <section><h2 className="section-title mb-3">Gói phổ biến</h2><div className="rounded-2xl bg-[#075B5A] text-white p-4"><p className="font-bold text-sm">{data.popularPackage.name} • {money(data.popularPackage.price)}</p><p className="text-white/65 text-[10px] mt-1">{data.popularPackage.sessionCount} buổi sử dụng</p></div></section>
      )}
    </div>
  );
}

function MemberDetail({ member, onRenew, onBooking, onChanged }: { member: AdminMembership; onRenew: () => void; onBooking: () => void; onChanged: () => Promise<void> }) {
  const status = memberStatus[member.status];
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(member.name);
  const [phone, setPhone] = useState(member.phone);
  const [error, setError] = useState('');
  const active = member.status !== 'inactive';
  const mutate = async (action: () => Promise<unknown>) => {
    setError('');
    try { await action(); await onChanged(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Không thể cập nhật hội viên.'); }
  };
  return (
    <div className="space-y-5">
      <section className="rounded-2xl bg-[#075B5A] text-white p-4">
        <h2 className="font-black text-lg">{member.name}</h2>
        <p className="text-white/75 text-xs mt-1">{member.packageName}{member.expiresOn ? ` • Hiệu lực đến ${member.expiresOn}` : ''}</p>
        <span className="mt-2 inline-block rounded-full bg-white/90 text-[#087B62] px-2 py-1 text-[9px] font-bold">{status.label}</span>
      </section>
      <section><h2 className="section-title mb-3">Quyền lợi đang dùng</h2><div className="space-y-2">{member.benefits.map(item => <article key={item.name} className="card flex justify-between"><div><p className="font-bold text-xs">{item.name}</p><p className="sub">{item.detail}</p></div><Status label={item.status === 'active' ? 'Hoạt động' : 'Đã dùng'} tone={item.status === 'active' ? 'green' : 'blue'} /></article>)}</div></section>
      <section>
        <div className="flex gap-2 mb-3"><span className="pill">Lịch sử đặt sân</span><span className="pill">Thu phí</span></div>
        <div className="space-y-2">
          {member.bookings.map(item => <article key={item.id} className="card flex justify-between"><div><p className="font-bold text-xs">{item.courtName}</p><p className="sub">{item.date} • {item.timeRange}</p></div><div className="text-right"><p className="font-black text-xs">{money(item.amount)}</p><Status label={item.status === 'cancelled' ? 'Đã hủy' : 'Đã ghi nhận'} tone={item.status === 'cancelled' ? 'amber' : 'green'} /></div></article>)}
          {member.bookings.length === 0 && <Empty text="Hội viên chưa có lịch sử đặt sân." />}
        </div>
      </section>
      <section><h2 className="section-title mb-3">Thanh toán & gia hạn</h2><div className="space-y-2">{member.payments.slice(0, 3).map(item => <article key={item.id} className="card flex justify-between"><div><p className="font-bold text-xs">{item.description}</p><p className="sub">{item.date}</p></div><p className="font-black text-xs text-[#075B5A]">{money(item.amount)}</p></article>)}</div></section>
      {editing && <section className="card space-y-3"><Field label="Họ tên"><input className="coach-input" value={name} onChange={event => setName(event.target.value)} /></Field><Field label="Số điện thoại"><input className="coach-input" value={phone} onChange={event => setPhone(event.target.value)} /></Field><button onClick={() => void mutate(() => updateAdminMember(member.id, { fullName: name, phoneNumber: phone }))} className="primary">Lưu hội viên</button></section>}
      <div className="space-y-2"><button onClick={onRenew} className="primary">Gia hạn gói</button><button onClick={onBooking} className="secondary">Tạo booking</button><button onClick={() => setEditing(value => !value)} className="secondary">{editing ? 'Đóng chỉnh sửa' : 'Chỉnh sửa hội viên'}</button><button onClick={() => void mutate(() => setAdminMemberStatus(member.id, !active))} className="secondary">{active ? 'Vô hiệu hóa tài khoản' : 'Kích hoạt lại tài khoản'}</button><button onClick={() => void mutate(() => upgradeAdminMemberToCoach(member.id, { agreementType: 'hourlyRental', hourlyCourtRate: 150000, revenueSharePercent: 0 }))} className="secondary">Nâng cấp thành HLV</button><button onClick={() => void mutate(() => deleteAdminMember(member.id))} className="secondary !border-rose-200 !text-rose-600">Xóa khi hợp lệ</button></div>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-xs text-rose-600">{error}</p>}
    </div>
  );
}

function Metric({ label, value, danger, warning }: { label: string; value: string; danger?: boolean; warning?: boolean }) {
  return <div className="card"><p className="sub">{label}</p><p className={`font-black text-lg mt-1 ${danger ? 'text-rose-500' : warning ? 'text-amber-600' : 'text-[#075B5A]'}`}>{value}</p></div>;
}

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return <label className="h-11 rounded-xl bg-white border border-slate-100 px-3 flex items-center gap-2"><Search className="w-4 h-4 text-slate-300" /><input value={value} onChange={event => onChange(event.target.value)} placeholder={placeholder} className="flex-1 outline-none bg-transparent text-xs" /></label>;
}

function Status({ label, tone }: { label: string; tone: 'green' | 'amber' | 'blue' }) {
  return <span className={`badge ${tone === 'green' ? 'bg-emerald-50 text-emerald-700' : tone === 'amber' ? 'bg-amber-50 text-amber-700' : 'bg-sky-50 text-sky-700'}`}>{label}</span>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="sub mb-1.5 block">{label}</span>{children}</label>;
}

function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">{text}</div>;
}

function StatePage({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full min-h-0 flex-col items-center justify-center gap-3 bg-[#F4F7F7] px-8 text-center">{children}</div>;
}
