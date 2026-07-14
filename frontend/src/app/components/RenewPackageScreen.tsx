import {
  ArrowLeft, Search, ChevronDown, CreditCard, Banknote,
  MoreHorizontal, CalendarDays, FileText, CheckCircle2,
  AlertTriangle, X, Wallet, Sparkles, Users, Clock
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface RenewPackageScreenProps {
  onBack: () => void;
  onConfirm: () => void;
}

/* ── mock students ── */
const STUDENTS = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901 234 567', remaining: 2,  class: 'Beginner A' },
  { id: 2, name: 'Trần Thị B',   phone: '0912 345 678', remaining: 0,  class: 'Intermediate B' },
  { id: 3, name: 'Lê Minh C',    phone: '0923 456 789', remaining: 8,  class: 'Beginner A' },
  { id: 4, name: 'Phạm Thị D',   phone: '0934 567 890', remaining: 1,  class: 'Advanced C' },
  { id: 5, name: 'Hoàng Văn E',  phone: '0945 678 901', remaining: 5,  class: 'Intermediate B' },
];

/* ── packages ── */
const PACKAGES = [
  { id: '8',  label: 'Gói 8 buổi',  sessions: 8,  price: 2_400_000, perSession: 300_000 },
  { id: '12', label: 'Gói 12 buổi', sessions: 12, price: 3_360_000, perSession: 280_000, popular: true },
  { id: '16', label: 'Gói 16 buổi', sessions: 16, price: 4_320_000, perSession: 270_000, best: true },
];

/* ── payment methods ── */
const PAYMENT_METHODS = [
  { id: 'cash',     label: 'Tiền mặt',     icon: Banknote,     color: '#2A9D8F' },
  { id: 'transfer', label: 'Chuyển khoản', icon: CreditCard,   color: '#0E7C7B' },
  { id: 'other',    label: 'Khác',         icon: MoreHorizontal, color: '#F4A261' },
];

function formatVND(n: number) {
  return n.toLocaleString('vi-VN') + '₫';
}

function parseNumeric(s: string) {
  return parseInt(s.replace(/\D/g, '')) || 0;
}

export function RenewPackageScreen({ onBack, onConfirm }: RenewPackageScreenProps) {
  /* form state */
  const [studentQuery, setStudentQuery]       = useState('Nguyễn Văn A');
  const [showDropdown, setShowDropdown]       = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(STUDENTS[0]);
  const [selectedPkg, setSelectedPkg]         = useState(PACKAGES[1]);
  const [extraSessions, setExtraSessions]     = useState('12');
  const [amount, setAmount]                   = useState('3360000');
  const [amountDisplay, setAmountDisplay]     = useState('3.360.000');
  const [payMethod, setPayMethod]             = useState('cash');
  const [payDate, setPayDate]                 = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [notes, setNotes]       = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  /* close dropdown on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* filter students */
  const filteredStudents = STUDENTS.filter(s =>
    s.name.toLowerCase().includes(studentQuery.toLowerCase()) ||
    s.phone.includes(studentQuery)
  );

  const selectStudent = (s: typeof STUDENTS[0]) => {
    setSelectedStudent(s);
    setStudentQuery(s.name);
    setShowDropdown(false);
  };

  const selectPackage = (pkg: typeof PACKAGES[0]) => {
    setSelectedPkg(pkg);
    setExtraSessions(String(pkg.sessions));
    const formatted = pkg.price.toLocaleString('vi-VN').replace(/,/g, '.');
    setAmountDisplay(formatted);
    setAmount(String(pkg.price));
  };

  const handleAmountChange = (raw: string) => {
    const num = parseNumeric(raw);
    setAmount(String(num));
    setAmountDisplay(num > 0 ? num.toLocaleString('vi-VN').replace(/,/g, '.') : '');
  };

  const totalAfter = selectedStudent.remaining + parseInt(extraSessions || '0');

  const statusWarning = selectedStudent.remaining <= 2;

  const handleSave = () => setShowSuccess(true);
  const handleSuccessClose = () => { setShowSuccess(false); onConfirm(); };

  /* ── section header ── */
  const SH = ({ color, text }: { color: string; text: string }) => (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-4 rounded-full" style={{ background: color }} />
      <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--muted-foreground)' }}>
        {text}
      </span>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-background relative">

      {/* ══ Header ══ */}
      <div
        className="flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0E7C7B 0%, #075E5D 65%, #054A49 100%)' }}
      >
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-10 -right-2 w-16 h-16 rounded-full bg-white/4 pointer-events-none" />
        <div className="flex items-center gap-3 px-4 pt-10 pb-5">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Gia hạn gói học</h1>
            <p className="text-white/60" style={{ fontSize: '11px' }}>Cộng thêm buổi học cho học viên</p>
          </div>
        </div>
      </div>

      {/* ══ Scrollable body ══ */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 py-5 space-y-5">

          {/* ── 1. Học viên ── */}
          <div>
            <SH color="#0E7C7B" text="Học viên" />
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-visible" ref={dropdownRef}>
              <div className="px-4 py-3.5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-primary/70" />
                  <label style={{ fontSize: '14px', fontWeight: 500 }}>Chọn học viên</label>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="text"
                    value={studentQuery}
                    onChange={e => { setStudentQuery(e.target.value); setShowDropdown(true); }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Tìm theo tên hoặc SĐT..."
                    className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    style={{ fontSize: '14px' }}
                  />
                </div>

                {/* Dropdown */}
                {showDropdown && filteredStudents.length > 0 && (
                  <div className="absolute left-4 right-4 top-full mt-1 bg-card border border-border rounded-2xl shadow-xl z-30 overflow-hidden">
                    {filteredStudents.map(s => {
                      const warn = s.remaining <= 2;
                      return (
                        <button
                          key={s.id}
                          onClick={() => selectStudent(s)}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/5 transition-colors border-b border-border/50 last:border-0 text-left"
                        >
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: warn ? 'rgba(233,196,106,0.2)' : 'rgba(14,124,123,0.12)' }}
                          >
                            <span style={{ fontSize: '13px', fontWeight: 700, color: warn ? '#E9C46A' : '#0E7C7B' }}>
                              {s.name.charAt(0)}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: '13px', fontWeight: 600 }}>{s.name}</p>
                            <p className="text-muted-foreground" style={{ fontSize: '11px' }}>{s.phone} · {s.class}</p>
                          </div>
                          <span
                            className="flex-shrink-0 px-2 py-0.5 rounded-full"
                            style={{
                              fontSize: '10px', fontWeight: 700,
                              background: warn ? 'rgba(233,196,106,0.2)' : 'rgba(42,157,143,0.12)',
                              color: warn ? '#C9942A' : '#2A9D8F',
                            }}
                          >
                            {s.remaining} buổi
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Selected student card */}
              {selectedStudent && (
                <div className="mx-4 mb-3.5 rounded-xl overflow-hidden border border-border">
                  {/* warning strip */}
                  {statusWarning && (
                    <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: 'rgba(233,196,106,0.15)', borderBottom: '1px solid rgba(233,196,106,0.3)' }}>
                      <AlertTriangle className="w-3.5 h-3.5 text-warning flex-shrink-0" />
                      <span className="text-warning" style={{ fontSize: '11px', fontWeight: 600 }}>Sắp hết buổi — cần gia hạn ngay</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 px-3 py-3 bg-background">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: statusWarning ? 'rgba(233,196,106,0.2)' : 'rgba(14,124,123,0.12)' }}
                    >
                      <span style={{ fontSize: '16px', fontWeight: 800, color: statusWarning ? '#C9942A' : '#0E7C7B' }}>
                        {selectedStudent.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p style={{ fontSize: '15px', fontWeight: 700 }}>{selectedStudent.name}</p>
                      <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{selectedStudent.phone} · {selectedStudent.class}</p>
                    </div>
                    <div className="text-right">
                      <p style={{ fontSize: '11px', color: 'var(--muted-foreground)' }}>Hiện còn</p>
                      <p style={{ fontSize: '22px', fontWeight: 800, color: statusWarning ? '#C9942A' : '#2A9D8F', lineHeight: 1 }}>
                        {selectedStudent.remaining}
                      </p>
                      <p style={{ fontSize: '10px', color: 'var(--muted-foreground)' }}>buổi</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── 2. Gói học ── */}
          <div>
            <SH color="#F4A261" text="Chọn gói học" />
            <div className="space-y-2.5">
              {PACKAGES.map(pkg => {
                const active = selectedPkg.id === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    onClick={() => selectPackage(pkg)}
                    className="w-full relative rounded-2xl border-2 overflow-hidden transition-all active:scale-[0.98] text-left"
                    style={{
                      borderColor: active ? '#0E7C7B' : 'var(--border)',
                      background: active ? 'rgba(14,124,123,0.06)' : 'var(--card)',
                      boxShadow: active ? '0 2px 12px rgba(14,124,123,0.18)' : 'none',
                    }}
                  >
                    {/* badges */}
                    {pkg.popular && (
                      <span className="absolute top-3 right-3 text-white px-2 py-0.5 rounded-full"
                        style={{ fontSize: '10px', fontWeight: 700, background: '#F4A261' }}>
                        Phổ biến
                      </span>
                    )}
                    {pkg.best && (
                      <span className="absolute top-3 right-3 text-white px-2 py-0.5 rounded-full"
                        style={{ fontSize: '10px', fontWeight: 700, background: '#2A9D8F' }}>
                        Tiết kiệm nhất
                      </span>
                    )}

                    <div className="p-4">
                      <div className="flex items-start justify-between pr-16">
                        <div>
                          <p style={{ fontSize: '15px', fontWeight: 700, color: active ? '#0E7C7B' : 'var(--foreground)' }}>
                            {pkg.label}
                          </p>
                          <p className="text-muted-foreground" style={{ fontSize: '12px' }}>
                            {formatVND(pkg.perSession)} / buổi
                          </p>
                        </div>
                        <div className="text-right">
                          <p style={{ fontSize: '18px', fontWeight: 800, color: active ? '#0E7C7B' : 'var(--foreground)' }}>
                            {formatVND(pkg.price)}
                          </p>
                        </div>
                      </div>

                      {/* sessions bar */}
                      <div className="flex items-center gap-1.5 mt-3">
                        {Array.from({ length: pkg.sessions }).map((_, i) => (
                          <div
                            key={i}
                            className="flex-1 h-1.5 rounded-full"
                            style={{ background: active ? '#0E7C7B' : 'var(--border)', opacity: active ? 1 : 0.5 }}
                          />
                        ))}
                      </div>

                      {active && (
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                          <span className="text-primary" style={{ fontSize: '12px', fontWeight: 600 }}>Đã chọn</span>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── 3. Chi tiết thanh toán ── */}
          <div>
            <SH color="#2A9D8F" text="Chi tiết thanh toán" />
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">

              {/* Số buổi cộng thêm + Số tiền */}
              <div className="grid grid-cols-2 divide-x divide-border/50 border-b border-border/50">
                <div className="px-4 py-3.5">
                  <label className="text-muted-foreground block mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                    Số buổi cộng thêm
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={extraSessions}
                      onChange={e => setExtraSessions(e.target.value)}
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-center"
                      style={{ fontSize: '20px', fontWeight: 800, color: '#0E7C7B' }}
                      min={0}
                    />
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '10px' }}>buổi</p>
                </div>

                <div className="px-4 py-3.5">
                  <label className="text-muted-foreground block mb-1.5" style={{ fontSize: '12px', fontWeight: 500 }}>
                    Số tiền (VND)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={amountDisplay}
                      onChange={e => handleAmountChange(e.target.value)}
                      placeholder="0"
                      className="w-full bg-background border border-border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                      style={{ fontSize: '14px', fontWeight: 700, color: '#0E7C7B' }}
                    />
                  </div>
                  <p className="text-muted-foreground mt-1" style={{ fontSize: '10px' }}>đồng</p>
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className="px-4 py-3.5 border-b border-border/50">
                <div className="flex items-center gap-2 mb-2.5">
                  <Wallet className="w-4 h-4 text-primary/70" />
                  <label style={{ fontSize: '14px', fontWeight: 500 }}>Phương thức thanh toán</label>
                </div>
                <div className="flex gap-2">
                  {PAYMENT_METHODS.map(pm => {
                    const active = payMethod === pm.id;
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        onClick={() => setPayMethod(pm.id)}
                        className="flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all active:scale-95"
                        style={{
                          borderColor: active ? pm.color : 'var(--border)',
                          background: active ? pm.color + '12' : 'var(--background)',
                        }}
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: active ? pm.color + '22' : 'var(--muted)' }}
                        >
                          <Icon className="w-4 h-4" style={{ color: active ? pm.color : 'var(--muted-foreground)' }} />
                        </div>
                        <span
                          style={{ fontSize: '10px', fontWeight: active ? 700 : 400, color: active ? pm.color : 'var(--muted-foreground)' }}
                        >
                          {pm.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ngày thanh toán */}
              <div className="px-4 py-3.5 border-b border-border/50">
                <div className="flex items-center gap-2 mb-1.5">
                  <CalendarDays className="w-4 h-4 text-primary/70" />
                  <label style={{ fontSize: '14px', fontWeight: 500 }}>Ngày thanh toán</label>
                </div>
                <input
                  type="date"
                  value={payDate}
                  onChange={e => setPayDate(e.target.value)}
                  className="w-full bg-background border border-border rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  style={{ fontSize: '14px', fontWeight: 500, color: 'var(--foreground)' }}
                />
              </div>

              {/* Ghi chú */}
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="w-4 h-4 text-primary/70" />
                  <label style={{ fontSize: '14px', fontWeight: 500 }}>Ghi chú</label>
                </div>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="Nội dung chuyển khoản, ghi chú thanh toán..."
                  rows={2}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/40"
                  style={{ fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* ── 4. Tóm tắt ── */}
          <div
            className="rounded-2xl border-2 p-4 overflow-hidden"
            style={{ borderColor: 'rgba(14,124,123,0.25)', background: 'rgba(14,124,123,0.04)' }}
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <span style={{ fontSize: '10px', color: 'white', fontWeight: 800 }}>Σ</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#0E7C7B' }}>Tóm tắt gia hạn</span>
            </div>

            <div className="space-y-2">
              {[
                { label: 'Học viên',            value: selectedStudent.name },
                { label: 'Buổi hiện còn',        value: `${selectedStudent.remaining} buổi` },
                { label: 'Cộng thêm',            value: `+${extraSessions || 0} buổi` },
                { label: 'Phương thức',          value: PAYMENT_METHODS.find(p => p.id === payMethod)?.label ?? '' },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{row.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 500 }}>{row.value}</span>
                </div>
              ))}

              <div
                className="flex items-center justify-between pt-3 mt-1 border-t"
                style={{ borderColor: 'rgba(14,124,123,0.2)' }}
              >
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Tổng buổi sau gia hạn</span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: '#0E7C7B', lineHeight: 1 }}>
                  {totalAfter} <span style={{ fontSize: '12px', fontWeight: 500 }}>buổi</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span style={{ fontSize: '13px', fontWeight: 600 }}>Tổng thanh toán</span>
                <span style={{ fontSize: '18px', fontWeight: 800, color: '#F4A261' }}>
                  {formatVND(parseNumeric(amount))}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ══ Footer Buttons ══ */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-[390px] mx-auto bg-card border-t border-border px-4 py-4 pb-6">
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-none w-[90px] py-3.5 border-2 border-border rounded-2xl flex items-center justify-center gap-1.5 text-muted-foreground active:bg-muted/50 transition-colors"
              style={{ fontSize: '14px', fontWeight: 500 }}
            >
              <X className="w-4 h-4" />
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex-1 text-white py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 active:opacity-85 transition-opacity"
              style={{
                fontSize: '15px', fontWeight: 700,
                background: 'linear-gradient(135deg, #0E7C7B 0%, #2A9D8F 100%)',
                boxShadow: '0 4px 16px rgba(14,124,123,0.4)',
              }}
            >
              <Wallet className="w-5 h-5" />
              Lưu thanh toán
            </button>
          </div>
        </div>
      </div>

      {/* ══ Success overlay ══ */}
      {showSuccess && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
        >
          <div
            className="w-full max-w-[390px] bg-card rounded-t-3xl px-6 pt-6 pb-10 shadow-2xl"
            style={{ animation: 'slideUp 0.3s ease-out' }}
          >
            {/* icon */}
            <div className="flex justify-center mb-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(42,157,143,0.15)' }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(42,157,143,0.25)' }}
                >
                  <CheckCircle2 className="w-8 h-8 text-success" />
                </div>
              </div>
            </div>

            {/* texts */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-accent" />
                <p style={{ fontSize: '20px', fontWeight: 800, color: 'var(--foreground)' }}>
                  Gia hạn thành công!
                </p>
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <p className="text-muted-foreground" style={{ fontSize: '14px' }}>
                Đã gia hạn thành công cho{' '}
                <span style={{ fontWeight: 700, color: 'var(--foreground)' }}>{selectedStudent.name}</span>
              </p>
            </div>

            {/* stats */}
            <div
              className="rounded-2xl p-4 mb-6 border"
              style={{ background: 'rgba(42,157,143,0.07)', borderColor: 'rgba(42,157,143,0.2)' }}
            >
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: '10px', fontWeight: 500 }}>Trước</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#E76F51', lineHeight: 1.1 }}>
                    {selectedStudent.remaining}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '10px' }}>buổi</p>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="px-2 py-1 rounded-full text-white"
                    style={{ fontSize: '11px', fontWeight: 700, background: '#F4A261' }}
                  >
                    +{extraSessions}
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground" style={{ fontSize: '10px', fontWeight: 500 }}>Sau</p>
                  <p style={{ fontSize: '24px', fontWeight: 800, color: '#2A9D8F', lineHeight: 1.1 }}>
                    {totalAfter}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '10px' }}>buổi</p>
                </div>
              </div>

              <div
                className="mt-3 pt-3 border-t text-center"
                style={{ borderColor: 'rgba(42,157,143,0.2)' }}
              >
                <p className="text-muted-foreground" style={{ fontSize: '12px' }}>Đã thanh toán</p>
                <p style={{ fontSize: '18px', fontWeight: 800, color: '#0E7C7B' }}>
                  {formatVND(parseNumeric(amount))}
                </p>
              </div>
            </div>

            <p className="text-center text-muted-foreground mb-5" style={{ fontSize: '13px' }}>
              Học viên hiện còn{' '}
              <span style={{ fontWeight: 800, color: '#2A9D8F', fontSize: '15px' }}>{totalAfter} buổi</span>
            </p>

            <button
              onClick={handleSuccessClose}
              className="w-full text-white py-3.5 rounded-2xl transition-opacity active:opacity-80"
              style={{
                fontSize: '15px', fontWeight: 700,
                background: 'linear-gradient(135deg, #0E7C7B 0%, #2A9D8F 100%)',
                boxShadow: '0 4px 16px rgba(14,124,123,0.35)',
              }}
            >
              Hoàn tất
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
