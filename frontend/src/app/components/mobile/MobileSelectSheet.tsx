import { Check, ChevronDown, LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';

export interface MobileSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface MobileSelectSheetProps {
  title: string;
  value: string;
  options: MobileSelectOption[];
  onChange: (value: string) => void;
  icon?: LucideIcon;
  className?: string;
}

export function MobileSelectSheet({
  title,
  value,
  options,
  onChange,
  icon: Icon,
  className = '',
}: MobileSelectSheetProps) {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => options.find(option => option.value === value) ?? options[0],
    [options, value],
  );

  const choose = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <>
      <button
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`flex h-12 min-w-0 items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 text-left active:scale-[0.99] ${className}`}
        onClick={() => setOpen(true)}
        type="button"
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-[#075B5A]" />}
        <span className="min-w-0 flex-1">
          <span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">{title}</span>
          <span className="block truncate text-xs font-bold text-slate-700">{selected?.label ?? 'Chọn'}</span>
        </span>
        <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
      </button>

      <MobileBottomSheet
        open={open}
        title={title}
        description="Chạm vào một lựa chọn để áp dụng bộ lọc."
        onClose={() => setOpen(false)}
      >
        <div className="space-y-2">
          {options.map(option => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                aria-pressed={isSelected}
                className={`flex min-h-12 w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left active:scale-[0.99] ${
                  isSelected
                    ? 'border-[#0E7C7B] bg-[#E7F6F3] text-[#075B5A]'
                    : 'border-slate-100 bg-white text-slate-700'
                }`}
                onClick={() => choose(option.value)}
                type="button"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-xs font-black">{option.label}</span>
                  {option.description && (
                    <span className="mt-1 block text-[10px] font-normal text-slate-400">
                      {option.description}
                    </span>
                  )}
                </span>
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                  isSelected ? 'border-[#0E7C7B] bg-[#0E7C7B] text-white' : 'border-slate-200'
                }`}>
                  {isSelected && <Check className="h-4 w-4" />}
                </span>
              </button>
            );
          })}
        </div>
      </MobileBottomSheet>
    </>
  );
}
