import { X } from 'lucide-react';
import { ReactNode, useEffect, useId, useRef } from 'react';

interface MobileBottomSheetProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export function MobileBottomSheet({
  open,
  title,
  description,
  children,
  footer,
  onClose,
}: MobileBottomSheetProps) {
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousActiveElement = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement?.focus();
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-y-0 left-1/2 z-[70] flex w-full max-w-[390px] -translate-x-1/2 items-end bg-black/45"
      role="presentation"
      onClick={onClose}
    >
      <section
        aria-labelledby={titleId}
        aria-modal="true"
        className="flex max-h-[min(88dvh,720px)] w-full flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl"
        role="dialog"
        onClick={event => event.stopPropagation()}
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-slate-200" />
        <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-4 pb-3 pt-3">
          <div className="min-w-0">
            <h2 id={titleId} className="text-sm font-black text-[#172323]">{title}</h2>
            {description && <p className="mt-1 text-[10px] text-slate-400">{description}</p>}
          </div>
          <button
            aria-label="Đóng"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 active:scale-95"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        <div
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-3 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {children}
        </div>

        {footer && (
          <footer className="border-t border-slate-100 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-3">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}
