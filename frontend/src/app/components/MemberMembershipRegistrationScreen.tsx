import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  Package,
  RefreshCw,
  Send,
  ShieldCheck,
  Star,
  X,
} from 'lucide-react';
import {
  CURRENT_MEMBERSHIP,
  MEMBER_MEMBERSHIP_PLANS,
  mapCurrentMembershipFromApi,
  mapMembershipPlansFromApi,
  type CurrentMembership,
  type MemberMembershipAction,
  type MembershipPlan,
} from './memberMembership';
import { getCurrentMembership, getMembershipPlans } from '../services/memberMembershipService';

interface MemberMembershipRegistrationScreenProps {
  onBack: () => void;
  onSubmit: (payload: { action: MemberMembershipAction; plan: MembershipPlan; note?: string }) => Promise<void> | void;
  onViewHistory?: () => void;
  onViewRequestHistory?: () => void;
}

function RenewalSheet({
  plan,
  note,
  loading,
  onNoteChange,
  onClose,
  onConfirm,
}: {
  plan: MembershipPlan;
  note: string;
  loading: boolean;
  onNoteChange: (value: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="absolute inset-0 z-50 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.42)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="overflow-hidden rounded-t-[30px] bg-white"
        style={{ boxShadow: '0 -12px 48px rgba(0,0,0,0.18)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex justify-center pb-1 pt-3">
          <div className="h-1.5 w-10 rounded-full" style={{ background: 'rgba(0,0,0,0.12)' }} />
        </div>

        <div className="px-5 pb-8">
          <div className="mb-5 mt-2 flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(14,124,123,0.10)' }}
            >
              <RefreshCw style={{ width: 18, height: 18, color: '#0E7C7B' }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 17, fontWeight: 900, color: '#1F2933' }}>Yêu cầu gia hạn gói hội viên</p>
              <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 500 }}>
                Gia hạn đúng hạng hiện tại để không bị gián đoạn quyền lợi
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl active:scale-95"
              style={{ background: 'rgba(0,0,0,0.04)' }}
            >
              <X style={{ width: 16, height: 16, color: '#6B7280' }} />
            </button>
          </div>

          <div
            className="rounded-3xl p-4"
            style={{ background: 'rgba(14,124,123,0.06)', border: '1.5px solid rgba(14,124,123,0.16)' }}
          >
            <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 800, letterSpacing: '0.04em' }}>GÓI HIỆN TẠI</p>
            <p style={{ fontSize: 16, fontWeight: 900, color: '#1F2933', marginTop: 4 }}>{plan.name}</p>
            <p style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginTop: 3 }}>
              {plan.duration} · {plan.price}
            </p>
            <p style={{ fontSize: 11, color: '#4B5563', fontWeight: 600, marginTop: 8, lineHeight: 1.45 }}>
              {plan.summaryBenefits}
            </p>
          </div>

          <div className="mt-4">
            <p style={{ fontSize: 12, color: '#374151', fontWeight: 800, letterSpacing: '0.04em', marginBottom: 8 }}>
              GHI CHÚ YÊU CẦU
            </p>
            <textarea
              value={note}
              onChange={(event) => onNoteChange(event.target.value)}
              maxLength={200}
              className="h-32 w-full resize-none rounded-[24px] border-none px-4 py-4 outline-none"
              style={{ background: '#F8FAFB', fontSize: 15, lineHeight: 1.7, color: '#374151' }}
              placeholder={`Tôi muốn gia hạn ${plan.name}, vui lòng xác nhận giúp tôi.`}
            />
            <div className="mt-2 flex items-center justify-between">
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>Yêu cầu sẽ được gửi để chờ xác nhận.</span>
              <span style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 700 }}>{note.length}/200</span>
            </div>
          </div>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 active:scale-[0.99] transition-all"
            style={{
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow: '0 10px 24px rgba(14,124,123,0.24)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Send style={{ width: 18, height: 18, color: 'white' }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>
              {loading ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu gia hạn hội viên'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

function getSelectedAction(currentPlan: MembershipPlan | null, selectedPlan: MembershipPlan): MemberMembershipAction {
  if (!currentPlan) return 'register';
  if (selectedPlan.id === currentPlan.id) return 'renew';
  return selectedPlan.durationMonths > currentPlan.durationMonths ? 'upgrade' : 'downgrade';
}

function getSubmitLabel(action: MemberMembershipAction) {
  if (action === 'renew') return 'Gửi yêu cầu gia hạn gói hội viên';
  if (action === 'upgrade') return 'Gửi yêu cầu nâng hạng gói hội viên';
  if (action === 'downgrade') return 'Gửi yêu cầu chuyển gói hội viên';
  return 'Gửi yêu cầu đăng ký gói hội viên';
}

export function MemberMembershipRegistrationScreen({
  onBack,
  onSubmit,
  onViewHistory,
  onViewRequestHistory,
}: MemberMembershipRegistrationScreenProps) {
  const [plans, setPlans] = useState<MembershipPlan[]>(MEMBER_MEMBERSHIP_PLANS);
  const [currentMembership, setCurrentMembership] = useState<CurrentMembership | null>(CURRENT_MEMBERSHIP);
  const [selectedPlanId, setSelectedPlanId] = useState(CURRENT_MEMBERSHIP.id);
  const [showRenewSheet, setShowRenewSheet] = useState(false);
  const [renewNote, setRenewNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const plansSectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMembership() {
      try {
        const [planResponse, currentResponse] = await Promise.all([
          getMembershipPlans(),
          getCurrentMembership(),
        ]);

        if (cancelled) return;

        const mappedPlans = mapMembershipPlansFromApi(planResponse);
        const mappedCurrentMembership = mapCurrentMembershipFromApi(currentResponse, mappedPlans);

        setPlans(mappedPlans);
        setCurrentMembership(mappedCurrentMembership);
        setSelectedPlanId(mappedCurrentMembership?.id ?? mappedPlans[0]?.id ?? 1);
      } catch {
        if (!cancelled) {
          setPlans(MEMBER_MEMBERSHIP_PLANS);
          setCurrentMembership(CURRENT_MEMBERSHIP);
          setSelectedPlanId(CURRENT_MEMBERSHIP.id);
        }
      }
    }

    void loadMembership();
    return () => {
      cancelled = true;
    };
  }, []);

  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customUnit, setCustomUnit] = useState<number>(3);
  const [customType, setCustomType] = useState<'day' | 'month' | 'year'>('month');

  const customCalculated = useMemo(() => {
    let basePrice = 0;
    let discountPercent = 0;
    let label = '';
    if (customType === 'day') {
      basePrice = customUnit * 50000;
      discountPercent = customUnit >= 20 ? 10 : (customUnit >= 10 ? 5 : 0);
      label = `${customUnit} ngày`;
    } else if (customType === 'month') {
      basePrice = customUnit * 500000;
      discountPercent = customUnit >= 3 ? 15 : 10;
      label = `${customUnit} tháng`;
    } else {
      basePrice = customUnit * 4000000;
      discountPercent = 20;
      label = `${customUnit} năm`;
    }
    const discountAmount = Math.round(basePrice * (discountPercent / 100));
    const finalPrice = basePrice - discountAmount;
    return {
      basePrice,
      discountPercent,
      discountAmount,
      finalPrice,
      label
    };
  }, [customUnit, customType]);

  const virtualPlan = useMemo<MembershipPlan>(() => {
    return {
      id: 999,
      code: `custom-${customUnit}${customType[0]}`,
      name: `Gói Tự Chọn (${customCalculated.label})`,
      duration: customCalculated.label,
      durationMonths: customType === 'year' ? customUnit * 12 : (customType === 'month' ? customUnit : customUnit / 30),
      price: customCalculated.finalPrice.toLocaleString('vi-VN') + 'đ',
      iconBg: 'rgba(168,85,247,0.10)',
      iconColor: '#7C3AED',
      summaryBenefits: `Ưu đãi tự chọn ${customCalculated.discountPercent}% · Tự chọn thời hạn linh hoạt`,
      benefits: [
        `Thời hạn tự chọn linh hoạt: ${customCalculated.label}`,
        `Nhận mức ưu đãi giảm giá lên tới ${customCalculated.discountPercent}%`,
        `Hỗ trợ đặt sân và các quyền lợi hội viên tiêu chuẩn`
      ]
    };
  }, [customUnit, customType, customCalculated]);

  const selectedPlan = useMemo(
    () => plans.find((plan) => plan.id === selectedPlanId) ?? plans[0] ?? MEMBER_MEMBERSHIP_PLANS[0],
    [plans, selectedPlanId],
  );

  const currentPlan = useMemo(
    () => (currentMembership ? plans.find((plan) => plan.id === currentMembership.id) ?? null : null),
    [currentMembership, plans],
  );

  const planToSubmit = isCustomMode ? virtualPlan : selectedPlan;

  const selectedAction = getSelectedAction(currentPlan, planToSubmit);
  const selectedPlanPrimaryBenefit =
    planToSubmit.benefits[0] ?? planToSubmit.summaryBenefits ?? 'Quyền lợi đang được cập nhật';

  function scrollToPlans() {
    plansSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(action: MemberMembershipAction, plan: MembershipPlan, note?: string) {
    if (submitting) return false;

    setSubmitting(true);

    try {
      await onSubmit({ action, plan, note });
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Không thể gửi yêu cầu hội viên lúc này.';
      window.alert(message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col" style={{ background: '#F0F4F5' }}>
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 30%,#075E5D 60%,#0E7C7B 85%,#1A8E87 100%)' }}
      >
        <div
          className="absolute pointer-events-none"
          style={{ top: -28, right: -18, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
        />
        <div className="relative px-5 pt-14 pb-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <button
              onClick={onBack}
              className="flex h-11 w-11 items-center justify-center rounded-2xl active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <ArrowLeft style={{ width: 18, height: 18, color: 'white' }} />
            </button>
            <button
              type="button"
              onClick={scrollToPlans}
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
              title="Đi tới danh sách gói hội viên"
            >
              <Package style={{ width: 18, height: 18, color: 'white' }} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.14)', border: '1px solid rgba(255,255,255,0.16)' }}
            >
              <Star style={{ width: 24, height: 24, color: 'white' }} />
            </div>
            <div className="flex-1">
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, letterSpacing: '0.05em' }}>
                ĐĂNG KÝ GÓI HỘI VIÊN
              </p>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 3 }}>
                Đăng ký và gia hạn gói hội viên
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="space-y-4 px-4 pt-4">
          <div
            className="overflow-hidden rounded-3xl bg-white"
            style={{ border: '1.5px solid rgba(14,124,123,0.15)', boxShadow: '0 6px 20px rgba(14,124,123,0.08)' }}
          >
            <div style={{ height: 3, background: 'linear-gradient(90deg,#0E7C7B 0%,#2A9D8F 100%)' }} />
            <div className="p-4">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 800, letterSpacing: '0.04em' }}>
                    GÓI HỘI VIÊN HIỆN TẠI
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: '#1F2933', marginTop: 2 }}>
                    {currentMembership?.name ?? 'Chưa có gói hội viên'}
                  </p>
                  <p style={{ fontSize: 12, color: '#6B7280', fontWeight: 600, marginTop: 2, lineHeight: 1.45 }}>
                    {currentMembership
                      ? <>Còn <strong style={{ color: '#0E7C7B' }}>{currentMembership.remaining}</strong> · Bắt đầu từ {currentMembership.startDate}</>
                      : 'Bạn có thể chọn gói và gửi yêu cầu đăng ký ngay bây giờ.'}
                  </p>
                  <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 3, lineHeight: 1.45 }}>
                    {currentMembership?.note ?? 'Sau khi gửi yêu cầu, Admin sẽ xác nhận và kích hoạt gói cho bạn.'}
                  </p>
                </div>
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0"
                  style={{ background: 'rgba(14,124,123,0.10)' }}
                >
                  <BadgeCheck style={{ width: 20, height: 20, color: '#0E7C7B' }} />
                </div>
              </div>

              <div className="mb-3 grid grid-cols-2 gap-2.5">
                <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(14,124,123,0.06)' }}>
                  <div className="mb-1 flex items-center gap-1.5">
                    <Clock3 style={{ width: 12, height: 12, color: '#0E7C7B' }} />
                    <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Trạng thái</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#0E7C7B', fontWeight: 900 }}>
                    {currentMembership?.status ?? 'Chưa kích hoạt'}
                  </p>
                </div>
                <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(244,162,97,0.08)' }}>
                  <div className="mb-1 flex items-center gap-1.5">
                    <RefreshCw style={{ width: 12, height: 12, color: '#E8832A' }} />
                    <span style={{ fontSize: 10, color: '#6B7280', fontWeight: 700 }}>Hành động</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#E8832A', fontWeight: 900 }}>
                    {selectedAction === 'renew'
                      ? 'Tiếp tục đúng hạng hiện tại'
                      : selectedAction === 'upgrade'
                        ? 'Nâng hạng gói đang dùng'
                        : selectedAction === 'downgrade'
                          ? 'Chuyển xuống gói phù hợp hơn'
                          : 'Đăng ký gói mới'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {currentPlan ? (
                  <button
                    onClick={() => {
                      setRenewNote(`Tôi muốn gia hạn ${currentPlan.name}, vui lòng xác nhận giúp tôi.`);
                      setShowRenewSheet(true);
                    }}
                    className="flex items-center justify-center gap-2 rounded-2xl py-3 active:scale-[0.99] transition-all"
                    style={{ background: 'rgba(14,124,123,0.08)', border: '1px solid rgba(14,124,123,0.16)' }}
                  >
                    <Send style={{ width: 16, height: 16, color: '#0E7C7B' }} />
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>Gia hạn</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedPlanId(plans[0]?.id ?? 1)}
                    className="flex items-center justify-center gap-2 rounded-2xl py-3 active:scale-[0.99] transition-all"
                    style={{ background: 'rgba(14,124,123,0.08)', border: '1px solid rgba(14,124,123,0.16)' }}
                  >
                    <Send style={{ width: 16, height: 16, color: '#0E7C7B' }} />
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>Chọn gói đầu tiên</span>
                  </button>
                )}
                <button
                  onClick={onViewRequestHistory}
                  className="flex items-center justify-center gap-2 rounded-2xl py-3 active:scale-[0.99] transition-all"
                  style={{ background: 'rgba(244,162,97,0.08)', border: '1px solid rgba(244,162,97,0.16)' }}
                >
                  <Clock3 style={{ width: 16, height: 16, color: '#E8832A' }} />
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#E8832A' }}>Lịch sử yêu cầu</span>
                </button>
              </div>

              <button
                onClick={onViewHistory}
                className="mt-2 w-full rounded-2xl bg-white px-4 py-3 text-left active:scale-[0.99] transition-all"
                style={{ border: '1.5px solid rgba(14,124,123,0.14)' }}
              >
                <p style={{ fontSize: 13, fontWeight: 900, color: '#0E7C7B' }}>Xem lịch sử thanh toán</p>
                <p style={{ fontSize: 11, color: '#6B7280', marginTop: 3 }}>
                  Theo dõi các giao dịch đã được xác nhận hoặc đang chờ xác nhận.
                </p>
              </button>
            </div>
          </div>

          <div
            className="rounded-3xl p-4"
            style={{ background: 'rgba(14,124,123,0.06)', border: '1px solid rgba(14,124,123,0.12)' }}
          >
            <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>NGUYÊN TẮC GÓI HỘI VIÊN</p>
            <div className="mt-3 space-y-2">
              {[
                'Hội viên Cơ bản cho phép bạn đăng ký học viên trong hệ thống.',
                'Mọi gói hội viên đều được dùng khung giờ ưu tiên hội viên.',
                'Gói cao hơn có thêm ưu đãi về mở đặt sớm, đổi lịch và thuê đồ.',
              ].map((rule) => (
                <div key={rule} className="flex items-start gap-2">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: '#0E7C7B' }} />
                  <p style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.5 }}>{rule}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TABS SELECT MODE */}
          <div className="flex bg-black/10 rounded-xl p-1">
            <button
              onClick={() => setIsCustomMode(false)}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                !isCustomMode ? 'bg-white text-teal-900 shadow' : 'text-slate-600'
              }`}
            >
              Chọn gói có sẵn
            </button>
            <button
              onClick={() => setIsCustomMode(true)}
              className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                isCustomMode ? 'bg-white text-teal-900 shadow' : 'text-slate-600'
              }`}
            >
              Tự tùy chỉnh gói
            </button>
          </div>

          {isCustomMode ? (
            <div className="bg-white rounded-3xl p-5 border border-teal-600/10 shadow-sm space-y-4">
              <p style={{ fontSize: 13, fontWeight: 900, color: '#1F2933' }}>TỰ CHỌN THỜI HẠN GÓI</p>
              
              {/* Type selector */}
              <div>
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  ĐƠN VỊ THỜI GIAN
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['day', 'month', 'year'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setCustomType(t);
                        setCustomUnit(1);
                      }}
                      className="py-2.5 rounded-xl text-xs font-bold transition-all"
                      style={{
                        background: customType === t ? '#0E7C7B' : '#F3F4F6',
                        color: customType === t ? 'white' : '#4B5563',
                      }}
                    >
                      {t === 'day' ? 'Ngày' : t === 'month' ? 'Tháng' : 'Năm'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of units */}
              <div>
                <span style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, display: 'block', marginBottom: 6 }}>
                  SỐ LƯỢNG ({customType === 'day' ? 'ngày' : customType === 'month' ? 'tháng' : 'năm'})
                </span>
                <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-4 py-2 justify-between">
                  <button
                    type="button"
                    onClick={() => setCustomUnit(prev => Math.max(1, prev - 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white border font-bold text-lg active:scale-90"
                  >
                    -
                  </button>
                  <span className="text-xl font-black text-slate-800">{customUnit}</span>
                  <button
                    type="button"
                    onClick={() => setCustomUnit(prev => Math.min(customType === 'day' ? 30 : 12, prev + 1))}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white border font-bold text-lg active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Summary calculated card */}
              <div className="rounded-2xl p-4 bg-teal-50 border border-teal-100 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Giá niêm yết:</span>
                  <span className="text-slate-800 font-bold">{customCalculated.basePrice.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Ưu đãi giảm giá:</span>
                  <span className="text-teal-600 font-bold">-{customCalculated.discountPercent}% (-{customCalculated.discountAmount.toLocaleString('vi-VN')}đ)</span>
                </div>
                <div className="h-px bg-teal-200/50 my-1" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-700 font-extrabold">Tổng thanh toán:</span>
                  <span className="text-lg text-teal-700 font-black">{customCalculated.finalPrice.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          ) : (
            <div ref={plansSectionRef}>
              <div className="mb-2.5 flex items-center justify-between">
                <div>
                  <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>CÁC GÓI HỘI VIÊN CÓ SẴN</p>
                  <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                    Chọn gói phù hợp rồi gửi yêu cầu cho Admin xác nhận.
                  </p>
                </div>
                <div className="rounded-xl px-2.5 py-1.5" style={{ background: 'rgba(14,124,123,0.10)' }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>{plans.length} lựa chọn</span>
                </div>
              </div>

              <div className="space-y-3">
                {plans.map((plan) => {
                  const selected = plan.id === selectedPlanId;

                  return (
                    <button
                      key={plan.id}
                      onClick={() => setSelectedPlanId(plan.id)}
                      className="w-full rounded-3xl p-4 text-left active:scale-[0.99] transition-all"
                      style={{
                        background: selected ? 'rgba(14,124,123,0.07)' : 'white',
                        border: selected ? '1.5px solid rgba(14,124,123,0.26)' : '1.5px solid rgba(0,0,0,0.06)',
                        boxShadow: selected ? '0 8px 20px rgba(14,124,123,0.08)' : '0 2px 10px rgba(0,0,0,0.04)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl flex-shrink-0" style={{ background: plan.iconBg }}>
                            <ShieldCheck style={{ width: 20, height: 20, color: plan.iconColor }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p style={{ fontSize: 14, fontWeight: 900, color: '#1F2933' }}>{plan.name}</p>
                              {plan.highlight && (
                                <span
                                  className="rounded-lg px-2 py-0.5"
                                  style={{ fontSize: 9, fontWeight: 900, color: plan.iconColor, background: `${plan.iconColor}14` }}
                                >
                                  {plan.highlight}
                                </span>
                              )}
                            </div>
                            <p style={{ fontSize: 11, color: '#6B7280', marginTop: 2, lineHeight: 1.4 }}>
                              Thời hạn: {plan.duration}
                            </p>
                            <p style={{ fontSize: 11, color: '#0E7C7B', marginTop: 5, lineHeight: 1.45, fontWeight: 700 }}>
                              {plan.summaryBenefits}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p style={{ fontSize: 15, fontWeight: 900, color: plan.iconColor }}>{plan.price}</p>
                          <p style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 700, marginTop: 2 }}>một lần</p>
                        </div>
                      </div>

                      <div className="mt-3 grid gap-2">
                        {plan.benefits.map((benefit) => (
                          <div
                            key={benefit}
                            className="flex items-start gap-2 rounded-xl px-3 py-2"
                            style={{ background: 'rgba(0,0,0,0.02)' }}
                          >
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full" style={{ background: plan.iconColor }} />
                            <p style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.45 }}>{benefit}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays style={{ width: 12, height: 12, color: '#9CA3AF' }} />
                          <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{plan.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#0E7C7B' }}>Đang chọn</span>
                          <ChevronRight style={{ width: 13, height: 13, color: '#0E7C7B' }} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div
            className="rounded-3xl bg-white p-4"
            style={{ border: '1.5px solid rgba(14,124,123,0.15)', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p style={{ fontSize: 12, fontWeight: 800, color: '#374151', letterSpacing: '0.04em' }}>TÓM TẮT ĐĂNG KÝ</p>
                <p style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600, marginTop: 2 }}>
                  Gửi yêu cầu để Admin xác nhận và ghi nhận thanh toán gói hội viên.
                </p>
              </div>
              <div className="rounded-xl px-2.5 py-1.5" style={{ background: 'rgba(14,124,123,0.10)' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#0E7C7B' }}>{planToSubmit.duration}</span>
              </div>
            </div>

            <div className="rounded-2xl px-3 py-3" style={{ background: 'rgba(14,124,123,0.06)' }}>
              <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700 }}>Gói đã chọn</p>
              <p style={{ fontSize: 14, color: '#0E7C7B', fontWeight: 900, marginTop: 2 }}>{planToSubmit.name}</p>
              <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 600, marginTop: 2 }}>
                {planToSubmit.price} · {selectedPlanPrimaryBenefit}
              </p>
              <p style={{ fontSize: 11, color: '#4B5563', fontWeight: 600, marginTop: 6, lineHeight: 1.45 }}>
                {selectedAction === 'renew'
                  ? 'Bạn đang chọn tiếp tục đúng gói hiện tại.'
                  : selectedAction === 'upgrade'
                    ? 'Bạn đang chọn gói có quyền lợi cao hơn gói đang dùng.'
                    : selectedAction === 'downgrade'
                      ? 'Bạn đang chọn gói thấp hơn gói đang dùng, cần Admin xác nhận chuyển gói.'
                      : 'Bạn đang chọn gói để kích hoạt quyền lợi hội viên.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-30 mx-auto max-w-[390px]"
        style={{
          background: 'rgba(255,255,255,0.98)',
          backdropFilter: 'blur(18px)',
          borderTop: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.06)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        }}
      >
        <div className="px-4 py-3">
          <button
            onClick={() => void handleSubmit(selectedAction, planToSubmit)}
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 active:scale-[0.99] transition-all"
            style={{
              background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
              boxShadow: '0 10px 24px rgba(14,124,123,0.24)',
              opacity: submitting ? 0.7 : 1,
            }}
          >
            <Send style={{ width: 18, height: 18, color: 'white' }} />
            <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>
              {submitting ? 'Đang gửi yêu cầu...' : getSubmitLabel(selectedAction)}
            </span>
          </button>
        </div>
      </div>

      {showRenewSheet && currentPlan && (
        <RenewalSheet
          plan={currentPlan}
          note={renewNote}
          loading={submitting}
          onNoteChange={setRenewNote}
          onClose={() => setShowRenewSheet(false)}
          onConfirm={() => void handleSubmit('renew', currentPlan, renewNote).then((success) => {
            if (success) {
              setShowRenewSheet(false);
            }
          })}
        />
      )}
    </div>
  );
}
