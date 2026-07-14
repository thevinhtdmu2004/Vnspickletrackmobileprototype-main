import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  RefreshCw,
  ShieldCheck,
  Star,
  Wallet,
} from 'lucide-react';
import {
  CURRENT_MEMBERSHIP,
  MEMBER_MEMBERSHIP_PLANS,
  mapCurrentMembershipFromApi,
  mapMembershipPlansFromApi,
  type CurrentMembership,
  type MembershipPlan,
} from './memberMembership';
import { getCurrentMembership, getMembershipPlans } from '../services/memberMembershipService';

interface MemberMembershipOverviewScreenProps {
  onBack?: () => void;
  onRenew?: () => void;
  onViewPlans?: () => void;
  onViewHistory?: () => void;
  onViewRequestHistory?: () => void;
}

export function MemberMembershipOverviewScreen({
  onBack,
  onRenew,
  onViewPlans,
  onViewHistory,
  onViewRequestHistory,
}: MemberMembershipOverviewScreenProps) {
  const [plans, setPlans] = useState<MembershipPlan[]>(MEMBER_MEMBERSHIP_PLANS);
  const [currentMembership, setCurrentMembership] = useState<CurrentMembership | null>(CURRENT_MEMBERSHIP);
  const [isResolved, setIsResolved] = useState(false);
  const benefitsSectionRef = useRef<HTMLDivElement | null>(null);

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
        setPlans(mappedPlans);
        setCurrentMembership(mapCurrentMembershipFromApi(currentResponse, mappedPlans));
      } catch {
        if (!cancelled) {
          setPlans(MEMBER_MEMBERSHIP_PLANS);
          setCurrentMembership(CURRENT_MEMBERSHIP);
        }
      } finally {
        if (!cancelled) {
          setIsResolved(true);
        }
      }
    }

    void loadMembership();
    return () => {
      cancelled = true;
    };
  }, []);

  const progress = useMemo(() => {
    if (!currentMembership || currentMembership.totalMonths <= 0) return 0;
    return currentMembership.usedMonths / currentMembership.totalMonths;
  }, [currentMembership]);

  const currentPlan = useMemo(
    () => (currentMembership ? plans.find((plan) => plan.id === currentMembership.id) ?? null : null),
    [currentMembership, plans],
  );

  const currentBenefits = useMemo(() => {
    if (!currentPlan) return [];
    return currentPlan.benefits.length > 0 ? currentPlan.benefits : [currentPlan.summaryBenefits];
  }, [currentPlan]);

  function scrollToBenefits() {
    benefitsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div className="flex min-h-screen flex-col" style={{ background: '#F0F4F5' }}>
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(148deg,#032C2C 0%,#053E3E 30%,#075E5D 60%,#0E7C7B 85%,#1A8E87 100%)' }}
      >
        <div
          className="absolute pointer-events-none"
          style={{ top: -24, right: -12, width: 144, height: 144, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}
        />
        <div className="relative px-5 pt-14 pb-6">
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
              onClick={scrollToBenefits}
              className="flex h-11 w-11 items-center justify-center rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.13)', border: '1px solid rgba(255,255,255,0.16)' }}
              title="Xem quyền lợi hiện có"
            >
              <BadgeCheck style={{ width: 18, height: 18, color: 'white' }} />
            </button>
          </div>

          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.56)', fontWeight: 700, letterSpacing: '0.05em' }}>
            HỘI VIÊN
          </p>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'white', lineHeight: 1.1, marginTop: 3 }}>
            Gói hội viên của tôi
          </h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        <div className="space-y-4 px-4 pt-4">
          <div
            className="overflow-hidden rounded-[30px]"
            style={{ background: 'linear-gradient(135deg,#BF360C 0%,#E76F51 100%)', boxShadow: '0 18px 42px rgba(231,111,81,0.18)' }}
          >
            <div className="p-5">
              {currentMembership ? (
                <>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.74)', fontWeight: 800, letterSpacing: '0.04em' }}>
                        GÓI HỘI VIÊN HIỆN TẠI
                      </p>
                      <p style={{ fontSize: 18, fontWeight: 900, color: 'white', marginTop: 4 }}>
                        {currentMembership.name}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <CalendarDays style={{ width: 14, height: 14, color: 'rgba(255,255,255,0.82)' }} />
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', fontWeight: 600 }}>
                          Ngày bắt đầu: {currentMembership.startDate}
                        </p>
                      </div>
                    </div>

                    <div
                      className="rounded-2xl px-4 py-2"
                      style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.20)' }}
                    >
                      <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{currentMembership.status}</span>
                    </div>
                  </div>

                  <div
                    className="grid grid-cols-3 overflow-hidden rounded-[24px]"
                    style={{ background: 'rgba(0,0,0,0.12)' }}
                  >
                    {[
                      { value: currentMembership.totalMonths, unit: 'tháng', label: 'Tổng tháng' },
                      { value: currentMembership.usedMonths, unit: 'tháng', label: 'Đã dùng' },
                      { value: currentMembership.remainingMonths, unit: 'tháng', label: 'Còn lại' },
                    ].map((item, index) => (
                      <div
                        key={item.label}
                        className="px-3 py-5 text-center"
                        style={{ borderLeft: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.08)' }}
                      >
                        <p style={{ fontSize: 18, fontWeight: 900, color: 'white' }}>{item.value}</p>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.84)', fontWeight: 700, marginTop: 2 }}>{item.unit}</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.56)', fontWeight: 700, marginTop: 8 }}>{item.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.72)', fontWeight: 800 }}>TIẾN ĐỘ SỬ DỤNG</span>
                      <span style={{ fontSize: 12, color: 'white', fontWeight: 900 }}>
                        {currentMembership.usedMonths}/{currentMembership.totalMonths} tháng đã dùng
                      </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.18)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${progress * 100}%`, background: 'rgba(255,255,255,0.92)' }}
                      />
                    </div>
                    <div className="mt-2 flex justify-between" style={{ fontSize: 10, color: 'rgba(255,255,255,0.60)', fontWeight: 700 }}>
                      <span>0</span>
                      <span>{currentMembership.usedMonths}</span>
                      <span>{currentMembership.totalMonths}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.74)', fontWeight: 800, letterSpacing: '0.04em' }}>
                    GÓI HỘI VIÊN HIỆN TẠI
                  </p>
                  <p style={{ fontSize: 18, fontWeight: 900, color: 'white', marginTop: 4 }}>
                    Chưa có gói hội viên hoạt động
                  </p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.88)', lineHeight: 1.6, marginTop: 10 }}>
                    Bạn có thể chọn gói phù hợp và gửi yêu cầu đăng ký ngay từ màn hình này.
                  </p>
                </div>
              )}
            </div>

            {currentMembership && (
              <div className="flex items-start gap-3 px-5 py-4" style={{ background: 'rgba(0,0,0,0.12)' }}>
                <Clock3 style={{ width: 18, height: 18, color: 'white', marginTop: 2, flexShrink: 0 }} />
                <p style={{ fontSize: 12, lineHeight: 1.6, color: 'white', fontWeight: 700 }}>
                  Còn {currentMembership.remaining}. Gia hạn sớm để giữ liền mạch quyền lợi hội viên và luồng học viên.
                </p>
              </div>
            )}
          </div>

          {/* GIA HẠN GÓI BUTTON */}
          <div className="bg-white rounded-3xl p-4 border border-teal-600/10 shadow-sm">
            <p style={{ fontSize: 12, color: '#374151', fontWeight: 800, letterSpacing: '0.04em', marginBottom: 12 }}>GIA HẠN GÓI</p>
            <button
              onClick={onRenew}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl active:scale-98 transition-all"
              style={{
                background: 'linear-gradient(135deg,#0E7C7B 0%,#2A9D8F 100%)',
                boxShadow: '0 8px 24px rgba(14,124,123,0.22)',
                border: '1.5px solid rgba(255,255,255,0.15)',
              }}
            >
              <RefreshCw style={{ width: 18, height: 18, color: 'white' }} />
              <span style={{ fontSize: 15, fontWeight: 900, color: 'white' }}>Yêu cầu gia hạn hội viên</span>
            </button>
          </div>

          {/* CÁC GÓI HỘI VIÊN CÓ SẴN */}
          <div className="bg-white rounded-3xl p-4 border border-teal-600/10 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-2xl"
                style={{ background: 'rgba(14,124,123,0.08)' }}
              >
                <BookOpen style={{ width: 18, height: 18, color: '#0E7C7B' }} />
              </div>
              <p style={{ fontSize: 12, color: '#374151', fontWeight: 800, letterSpacing: '0.04em' }}>CÁC GÓI HỘI VIÊN CÓ SẴN</p>
            </div>

            <div className="space-y-3">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={onViewPlans}
                  className="w-full rounded-[28px] bg-white p-4 text-left active:scale-[0.99] transition-all"
                  style={{ border: '1.5px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 14px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: plan.iconBg }}
                      >
                        <ShieldCheck style={{ width: 20, height: 20, color: plan.iconColor }} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p style={{ fontSize: 15, fontWeight: 900, color: '#1F2933' }}>{plan.name}</p>
                          {plan.highlight && (
                            <span
                              className="rounded-lg px-2 py-0.5"
                              style={{
                                fontSize: 9,
                                fontWeight: 900,
                                color: plan.iconColor,
                                background: `${plan.iconColor}14`,
                              }}
                            >
                              {plan.highlight}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: 11, color: '#6B7280', fontWeight: 700, marginTop: 2 }}>
                          {plan.duration} · {plan.summaryBenefits}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: 15, fontWeight: 900, color: '#0E7C7B' }}>{plan.price}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
