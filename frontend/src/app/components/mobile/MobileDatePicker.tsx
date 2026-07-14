import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';

interface MobileDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  minDate?: string;
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const MONTHS = [
  'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
  'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12',
];

function parseIsoDate(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function toIsoDate(value: Date) {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const day = String(value.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(parseIsoDate(value));
}

function localToday() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

export function MobileDatePicker({
  value,
  onChange,
  label = 'Ngày vận hành',
  minDate,
}: MobileDatePickerProps) {
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = parseIsoDate(value);
    return new Date(selected.getFullYear(), selected.getMonth(), 1);
  });
  const today = localToday();

  const openPicker = () => {
    const selected = parseIsoDate(value);
    setDraftValue(value);
    setVisibleMonth(new Date(selected.getFullYear(), selected.getMonth(), 1));
    setOpen(true);
  };

  const days = useMemo(() => {
    const firstDay = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
    const mondayOffset = (firstDay.getDay() + 6) % 7;
    const start = new Date(firstDay);
    start.setDate(firstDay.getDate() - mondayOffset);
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [visibleMonth]);

  const moveMonth = (offset: number) => {
    setVisibleMonth(current => new Date(current.getFullYear(), current.getMonth() + offset, 1));
  };

  const chooseToday = () => {
    const current = parseIsoDate(today);
    setDraftValue(today);
    setVisibleMonth(new Date(current.getFullYear(), current.getMonth(), 1));
  };

  const confirm = () => {
    onChange(draftValue);
    setOpen(false);
  };

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-expanded={open}
        className="mt-3 flex h-12 w-full items-center gap-3 rounded-xl border border-slate-100 px-3 text-left active:scale-[0.99]"
        onClick={openPicker}
        type="button"
      >
        <CalendarDays className="h-5 w-5 shrink-0 text-[#075B5A]" />
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">{label}</span>
          <span className="block truncate text-xs font-black capitalize text-slate-700">{formatDate(value)}</span>
        </span>
        <ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      <MobileBottomSheet
        open={open}
        title="Chọn ngày vận hành"
        description="Chọn ngày trên lịch, sau đó nhấn Xác nhận."
        onClose={() => setOpen(false)}
        footer={(
          <div className="grid grid-cols-[1fr_1.6fr] gap-2">
            <button
              className="h-12 rounded-xl border border-[#0E7C7B] text-xs font-black text-[#075B5A] active:scale-[0.99]"
              onClick={chooseToday}
              type="button"
            >
              Hôm nay
            </button>
            <button
              className="h-12 rounded-xl bg-[#075B5A] text-xs font-black text-white active:scale-[0.99]"
              onClick={confirm}
              type="button"
            >
              Xác nhận
            </button>
          </div>
        )}
      >
        <div className="flex items-center justify-between rounded-2xl bg-[#E7F6F3] p-2">
          <button
            aria-label="Tháng trước"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#075B5A] active:scale-95"
            onClick={() => moveMonth(-1)}
            type="button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <p className="text-sm font-black text-[#075B5A]">
            {MONTHS[visibleMonth.getMonth()]} {visibleMonth.getFullYear()}
          </p>
          <button
            aria-label="Tháng sau"
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#075B5A] active:scale-95"
            onClick={() => moveMonth(1)}
            type="button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-7 gap-0.5">
          {WEEKDAYS.map(day => (
            <div key={day} className="flex h-8 items-center justify-center text-[10px] font-bold text-slate-400">
              {day}
            </div>
          ))}
          {days.map(date => {
            const isoDate = toIsoDate(date);
            const isCurrentMonth = date.getMonth() === visibleMonth.getMonth();
            const isSelected = isoDate === draftValue;
            const isToday = isoDate === today;
            const disabled = Boolean(minDate && isoDate < minDate);
            return (
              <button
                key={isoDate}
                aria-label={formatDate(isoDate)}
                aria-pressed={isSelected}
                disabled={disabled}
                className={`relative flex h-10 min-w-0 items-center justify-center rounded-xl text-xs font-bold active:scale-95 ${
                  disabled
                    ? 'cursor-not-allowed text-slate-200'
                    : isSelected
                    ? 'bg-[#075B5A] text-white'
                    : isToday
                      ? 'bg-[#E7F6F3] text-[#075B5A]'
                      : isCurrentMonth
                        ? 'text-slate-700'
                        : 'text-slate-300'
                }`}
                onClick={() => !disabled && setDraftValue(isoDate)}
                type="button"
              >
                {date.getDate()}
                {isToday && !isSelected && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#0E7C7B]" />}
              </button>
            );
          })}
        </div>
      </MobileBottomSheet>
    </>
  );
}
