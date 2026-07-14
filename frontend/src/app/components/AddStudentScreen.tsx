import { ArrowLeft, ChevronDown, Save, X, User, Phone, Trophy, BookOpen, Hash, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface AddStudentScreenProps {
  onBack: () => void;
  onSave: () => void;
}

type Level = 'beginner' | 'intermediate' | 'advanced' | '';
type Status = 'active' | 'paused' | 'inactive' | '';

const CLASSES = [
  { id: '', label: 'Chọn lớp...' },
  { id: 'beg-a', label: 'Beginner A — T2/T4/T6 07:00' },
  { id: 'beg-b', label: 'Beginner B — T3/T5/T7 07:00' },
  { id: 'int-a', label: 'Intermediate A — T2/T4/T6 09:00' },
  { id: 'int-b', label: 'Intermediate B — T3/T5/T7 09:00' },
  { id: 'adv-a', label: 'Advanced A — T2/T4/T6 17:00' },
  { id: 'adv-b', label: 'Advanced B — T3/T5 17:00' },
];

export function AddStudentScreen({ onBack, onSave }: AddStudentScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    level: '' as Level,
    defaultClass: '',
    totalSessions: '',
    attendedSessions: '',
    status: 'active' as Status,
    notes: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    totalSessions: '',
    attendedSessions: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    totalSessions: false,
    attendedSessions: false,
  });

  const remaining =
    formData.totalSessions !== '' && formData.attendedSessions !== ''
      ? Math.max(0, Number(formData.totalSessions) - Number(formData.attendedSessions))
      : formData.totalSessions !== ''
      ? Number(formData.totalSessions)
      : null;

  const validateField = (field: string, value: string) => {
    if (field === 'name') {
      return value.trim() === '' ? 'Vui lòng nhập họ tên học viên.' : '';
    }
    if (field === 'totalSessions') {
      if (value === '') return '';
      if (Number(value) < 0) return 'Tổng buổi không được âm.';
    }
    if (field === 'attendedSessions') {
      if (value === '') return '';
      if (Number(value) < 0) return 'Số buổi đã học không được âm.';
      if (formData.totalSessions !== '' && Number(value) > Number(formData.totalSessions)) {
        return 'Số buổi đã học không được lớn hơn tổng buổi.';
      }
    }
    return '';
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, formData[field as keyof typeof formData] as string),
    }));
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (touched[field as keyof typeof touched]) {
      setErrors(prev => ({ ...prev, [field]: validateField(field, value) }));
    }
  };

  const handleSave = () => {
    const nameErr = validateField('name', formData.name);
    const totalErr = validateField('totalSessions', formData.totalSessions);
    const attendedErr = validateField('attendedSessions', formData.attendedSessions);

    setTouched({ name: true, totalSessions: true, attendedSessions: true });
    setErrors({ name: nameErr, totalSessions: totalErr, attendedSessions: attendedErr });

    if (!nameErr && !totalErr && !attendedErr) {
      onSave();
    }
  };

  const getLevelLabel = (level: Level) => {
    const map: Record<string, string> = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };
    return map[level] || '';
  };

  const getStatusConfig = (status: Status) => {
    const map: Record<string, { label: string; color: string; bg: string }> = {
      active: { label: 'Đang học', color: 'text-success', bg: 'bg-success/10' },
      paused: { label: 'Tạm nghỉ', color: 'text-warning-foreground', bg: 'bg-warning/20' },
      inactive: { label: 'Đã nghỉ', color: 'text-destructive', bg: 'bg-destructive/10' },
    };
    return map[status] || { label: 'Đang học', color: 'text-success', bg: 'bg-success/10' };
  };

  const remainingWarning = remaining !== null && remaining <= 3 && remaining > 0;
  const remainingDanger = remaining !== null && remaining === 0;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* ── Header ── */}
      <div className="bg-primary text-primary-foreground shadow-lg flex-shrink-0">
        <div className="flex items-center gap-3 px-4 py-4 pt-10">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/15 active:bg-white/25 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-white" style={{ fontSize: '18px', fontWeight: 600 }}>Thêm học viên</h1>
            <p className="text-white/70" style={{ fontSize: '12px' }}>Điền thông tin học viên mới</p>
          </div>
          {/* Required fields hint */}
          <span className="text-white/60" style={{ fontSize: '11px' }}>* bắt buộc</span>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="px-4 py-5 space-y-5">

          {/* ── Section: Thông tin cơ bản ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Thông tin cơ bản
              </span>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">

              {/* Họ tên */}
              <div className="px-4 py-3.5 border-b border-border/50">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <User className="w-4 h-4 text-primary/70 flex-shrink-0" />
                  <label className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>
                    Họ tên <span className="text-destructive">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="VD: Nguyễn Văn An"
                  className={`w-full px-0 py-1.5 bg-transparent border-0 border-b-2 focus:outline-none transition-colors placeholder:text-muted-foreground/50 ${
                    errors.name ? 'border-destructive' : 'border-primary/30 focus:border-primary'
                  }`}
                  style={{ fontSize: '15px' }}
                />
                {errors.name && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                    <span className="text-destructive" style={{ fontSize: '12px' }}>{errors.name}</span>
                  </div>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <Phone className="w-4 h-4 text-primary/70 flex-shrink-0" />
                  <label className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>
                    Số điện thoại
                  </label>
                </div>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="VD: 0901 234 567"
                  className="w-full px-0 py-1.5 bg-transparent border-0 border-b-2 border-primary/30 focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground/50"
                  style={{ fontSize: '15px' }}
                />
              </div>
            </div>
          </div>

          {/* ── Section: Trình độ & Lớp ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-accent rounded-full" />
              <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Trình độ & Lớp học
              </span>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">

              {/* Trình độ */}
              <div className="px-4 py-3.5 border-b border-border/50">
                <div className="flex items-center gap-2.5 mb-2">
                  <Trophy className="w-4 h-4 text-primary/70 flex-shrink-0" />
                  <label className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>Trình độ</label>
                </div>
                <div className="flex gap-2">
                  {(['beginner', 'intermediate', 'advanced'] as Level[]).map(level => (
                    <button
                      key={level}
                      onClick={() => handleChange('level', level)}
                      className={`flex-1 py-2 rounded-xl border transition-all active:scale-95 ${
                        formData.level === level
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background border-border text-muted-foreground'
                      }`}
                      style={{ fontSize: '12px', fontWeight: 500 }}
                    >
                      {level === 'beginner' ? 'Cơ bản' : level === 'intermediate' ? 'Trung cấp' : 'Nâng cao'}
                    </button>
                  ))}
                </div>
                {formData.level && (
                  <div className="mt-2 flex items-center gap-1.5">
                    <div className={`w-2 h-2 rounded-full ${
                      formData.level === 'beginner' ? 'bg-success' : formData.level === 'intermediate' ? 'bg-warning' : 'bg-accent'
                    }`} />
                    <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                      {getLevelLabel(formData.level)}
                    </span>
                  </div>
                )}
              </div>

              {/* Lớp mặc định */}
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <BookOpen className="w-4 h-4 text-primary/70 flex-shrink-0" />
                  <label className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>Lớp mặc định</label>
                </div>
                <div className="relative">
                  <select
                    value={formData.defaultClass}
                    onChange={e => handleChange('defaultClass', e.target.value)}
                    className="w-full appearance-none bg-background border border-border rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors text-foreground"
                    style={{ fontSize: '14px' }}
                  >
                    {CLASSES.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Section: Số buổi học ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-success rounded-full" />
              <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Số buổi học
              </span>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">
              <div className="grid grid-cols-3 divide-x divide-border/50">

                {/* Tổng buổi */}
                <div className="px-3 py-4 flex flex-col gap-1.5">
                  <label className="text-muted-foreground text-center" style={{ fontSize: '11px', fontWeight: 500 }}>Tổng buổi mua</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={formData.totalSessions}
                    onChange={e => handleChange('totalSessions', e.target.value)}
                    onBlur={() => handleBlur('totalSessions')}
                    placeholder="0"
                    className={`w-full text-center bg-transparent border-0 border-b-2 focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/40 ${
                      errors.totalSessions ? 'border-destructive' : 'border-primary/30 focus:border-primary'
                    }`}
                    style={{ fontSize: '22px', fontWeight: 700 }}
                  />
                  {errors.totalSessions && (
                    <span className="text-destructive text-center" style={{ fontSize: '10px' }}>
                      {errors.totalSessions === 'Tổng buổi không được âm.' ? '⚠ Không được âm' : errors.totalSessions}
                    </span>
                  )}
                </div>

                {/* Đã học */}
                <div className="px-3 py-4 flex flex-col gap-1.5">
                  <label className="text-muted-foreground text-center" style={{ fontSize: '11px', fontWeight: 500 }}>Đã học</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    value={formData.attendedSessions}
                    onChange={e => handleChange('attendedSessions', e.target.value)}
                    onBlur={() => handleBlur('attendedSessions')}
                    placeholder="0"
                    className={`w-full text-center bg-transparent border-0 border-b-2 focus:outline-none transition-colors text-foreground placeholder:text-muted-foreground/40 ${
                      errors.attendedSessions ? 'border-destructive' : 'border-primary/30 focus:border-primary'
                    }`}
                    style={{ fontSize: '22px', fontWeight: 700 }}
                  />
                  {errors.attendedSessions && (
                    <span className="text-destructive text-center" style={{ fontSize: '10px' }}>
                      ⚠ Không hợp lệ
                    </span>
                  )}
                </div>

                {/* Còn lại — read-only */}
                <div className={`px-3 py-4 flex flex-col gap-1.5 rounded-tr-2xl rounded-br-2xl ${
                  remainingDanger ? 'bg-destructive/8' : remainingWarning ? 'bg-warning/15' : remaining !== null ? 'bg-success/8' : ''
                }`}>
                  <label className="text-muted-foreground text-center" style={{ fontSize: '11px', fontWeight: 500 }}>Còn lại</label>
                  <div
                    className={`text-center ${
                      remainingDanger ? 'text-destructive' : remainingWarning ? 'text-warning-foreground' : remaining !== null ? 'text-success' : 'text-muted-foreground/30'
                    }`}
                    style={{ fontSize: '22px', fontWeight: 700, lineHeight: '1.3' }}
                  >
                    {remaining !== null ? remaining : '—'}
                  </div>
                  {remainingWarning && (
                    <span className="text-center" style={{ fontSize: '10px', color: '#E9C46A' }}>⚠ Sắp hết</span>
                  )}
                  {remainingDanger && (
                    <span className="text-destructive text-center" style={{ fontSize: '10px' }}>✕ Hết buổi</span>
                  )}
                </div>
              </div>

              {/* Inline error messages below grid */}
              {(errors.totalSessions || errors.attendedSessions) && (
                <div className="px-4 pb-3 space-y-1">
                  {errors.totalSessions && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                      <span className="text-destructive" style={{ fontSize: '12px' }}>{errors.totalSessions}</span>
                    </div>
                  )}
                  {errors.attendedSessions && (
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-destructive flex-shrink-0" />
                      <span className="text-destructive" style={{ fontSize: '12px' }}>{errors.attendedSessions}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Section: Trạng thái & Ghi chú ── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1 h-4 bg-warning rounded-full" />
              <span className="text-muted-foreground" style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Trạng thái & Ghi chú
              </span>
            </div>
            <div className="bg-card rounded-2xl overflow-hidden shadow-sm border border-border">

              {/* Trạng thái */}
              <div className="px-4 py-3.5 border-b border-border/50">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary/70 flex-shrink-0" />
                  <label className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>Trạng thái</label>
                </div>
                <div className="flex gap-2">
                  {(['active', 'paused', 'inactive'] as Status[]).map(s => {
                    const cfg = getStatusConfig(s);
                    const isSelected = formData.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => handleChange('status', s)}
                        className={`flex-1 py-2 rounded-xl border transition-all active:scale-95 ${
                          isSelected
                            ? `${cfg.bg} ${cfg.color} border-current/30`
                            : 'bg-background border-border text-muted-foreground'
                        }`}
                        style={{ fontSize: '12px', fontWeight: isSelected ? 600 : 400 }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ghi chú */}
              <div className="px-4 py-3.5">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <FileText className="w-4 h-4 text-primary/70 flex-shrink-0" />
                  <label className="text-foreground" style={{ fontSize: '14px', fontWeight: 500 }}>Ghi chú</label>
                </div>
                <textarea
                  value={formData.notes}
                  onChange={e => handleChange('notes', e.target.value)}
                  placeholder="Thông tin bổ sung về học viên, yêu cầu đặc biệt..."
                  rows={3}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none placeholder:text-muted-foreground/50 text-foreground"
                  style={{ fontSize: '14px' }}
                />
              </div>
            </div>
          </div>

          {/* ── Preview card ── */}
          {formData.name.trim() && (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-primary" style={{ fontSize: '14px', fontWeight: 700 }}>
                    {formData.name.trim().split(' ').pop()?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-foreground" style={{ fontSize: '14px', fontWeight: 600 }}>{formData.name}</p>
                  {formData.phone && (
                    <p className="text-muted-foreground" style={{ fontSize: '12px' }}>{formData.phone}</p>
                  )}
                </div>
                <div className="ml-auto">
                  {formData.status && (
                    <span
                      className={`px-2 py-0.5 rounded-full ${getStatusConfig(formData.status).bg} ${getStatusConfig(formData.status).color}`}
                      style={{ fontSize: '11px', fontWeight: 600 }}
                    >
                      {getStatusConfig(formData.status).label}
                    </span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white/70 rounded-xl py-2">
                  <p className="text-primary" style={{ fontSize: '16px', fontWeight: 700 }}>
                    {formData.totalSessions || '—'}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '10px' }}>Tổng buổi</p>
                </div>
                <div className="bg-white/70 rounded-xl py-2">
                  <p className="text-muted-foreground" style={{ fontSize: '16px', fontWeight: 700 }}>
                    {formData.attendedSessions || '—'}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '10px' }}>Đã học</p>
                </div>
                <div className={`rounded-xl py-2 ${
                  remainingDanger ? 'bg-destructive/15' : remainingWarning ? 'bg-warning/25' : 'bg-success/15'
                }`}>
                  <p className={`${remainingDanger ? 'text-destructive' : remainingWarning ? 'text-warning-foreground' : 'text-success'}`}
                    style={{ fontSize: '16px', fontWeight: 700 }}>
                    {remaining !== null ? remaining : '—'}
                  </p>
                  <p className="text-muted-foreground" style={{ fontSize: '10px' }}>Còn lại</p>
                </div>
              </div>
              {formData.level && (
                <div className="mt-2 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5 text-accent" />
                  <span className="text-muted-foreground" style={{ fontSize: '12px' }}>{getLevelLabel(formData.level)}</span>
                  {formData.defaultClass && (
                    <>
                      <span className="text-border">•</span>
                      <span className="text-muted-foreground" style={{ fontSize: '12px' }}>
                        {CLASSES.find(c => c.id === formData.defaultClass)?.label.split('—')[0].trim()}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Footer Buttons ── */}
      <div className="fixed bottom-0 left-0 right-0 z-20">
        <div className="max-w-[390px] mx-auto bg-card border-t border-border px-4 py-4 pb-6">
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex-none w-[100px] py-3.5 border-2 border-border rounded-2xl flex items-center justify-center gap-2 text-muted-foreground active:bg-muted/50 transition-colors"
              style={{ fontSize: '15px', fontWeight: 500 }}
            >
              <X className="w-4 h-4" />
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-primary text-primary-foreground py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2.5 active:bg-primary-dark transition-colors"
              style={{ fontSize: '15px', fontWeight: 600 }}
            >
              <Save className="w-5 h-5" />
              Lưu học viên
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
