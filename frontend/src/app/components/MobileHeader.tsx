import { ArrowLeft } from 'lucide-react';
import { ReactNode } from 'react';

type MobileHeaderVariant = 'home' | 'list' | 'detail' | 'form';

interface MobileHeaderProps {
  title: string;
  onBack?: () => void;
  action?: ReactNode;
  eyebrow?: string;
  description?: string;
  variant?: MobileHeaderVariant;
}

const variantStyles: Record<
  MobileHeaderVariant,
  {
    wrapper: string;
    inner: string;
    title: string;
    eyebrow: string;
    description: string;
    backButton: string;
    contentGap: string;
  }
> = {
  home: {
    wrapper:
      'relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-primary to-primary-dark px-6 pb-6 pt-10 text-primary-foreground shadow-lg',
    inner: 'min-h-[96px]',
    title: 'text-[28px] font-black leading-tight',
    eyebrow: 'text-[12px] font-medium text-white/70',
    description: 'mt-2 text-sm leading-6 text-white/90',
    backButton: 'bg-white/15 text-white',
    contentGap: 'gap-4',
  },
  list: {
    wrapper:
      'relative overflow-hidden rounded-b-3xl bg-gradient-to-br from-primary to-primary-dark px-4 pb-5 pt-10 text-primary-foreground shadow-lg',
    inner: 'min-h-[76px]',
    title: 'text-[24px] font-black leading-tight',
    eyebrow: 'mb-1 text-[11px] font-semibold text-white/65',
    description: 'mt-1 text-[12px] leading-5 text-white/75',
    backButton: 'bg-white/15 text-white',
    contentGap: 'gap-3',
  },
  detail: {
    wrapper:
      'relative overflow-hidden rounded-b-[28px] bg-gradient-to-br from-primary to-primary-dark px-4 pb-4 pt-10 text-primary-foreground shadow-lg',
    inner: 'min-h-[64px]',
    title: 'text-[20px] font-black leading-tight',
    eyebrow: 'mb-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-white/60',
    description: 'mt-1 text-[11px] leading-5 text-white/72',
    backButton: 'bg-white/15 text-white',
    contentGap: 'gap-3',
  },
  form: {
    wrapper:
      'relative overflow-hidden rounded-b-[28px] bg-gradient-to-br from-primary to-primary-dark px-4 pb-4 pt-10 text-primary-foreground shadow-lg',
    inner: 'min-h-[64px]',
    title: 'text-[20px] font-black leading-tight',
    eyebrow: 'mb-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-white/60',
    description: 'mt-1 text-[11px] leading-5 text-white/72',
    backButton: 'bg-white/15 text-white',
    contentGap: 'gap-3',
  },
};

export function MobileHeader({
  title,
  onBack,
  action,
  eyebrow,
  description,
  variant = 'list',
}: MobileHeaderProps) {
  const style = variantStyles[variant];

  return (
    <header className={style.wrapper}>
      <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-white/5" />
      {(variant === 'home' || variant === 'list') && (
        <>
          <div className="pointer-events-none absolute -right-4 top-16 h-20 w-20 rounded-full bg-white/4" />
          <div className="pointer-events-none absolute right-10 top-6 h-28 w-28 rounded-full bg-white/[0.03]" />
        </>
      )}

      <div className={`flex items-center justify-between ${style.inner} ${style.contentGap}`}>
        <div className={`flex min-w-0 flex-1 items-center ${style.contentGap}`}>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="Quay lại"
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform active:scale-95 ${style.backButton}`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          <div className="min-w-0">
            {eyebrow && <p className={style.eyebrow}>{eyebrow}</p>}
            <h1 className={`${style.title} truncate`}>{title}</h1>
            {description && <p className={style.description}>{description}</p>}
          </div>
        </div>

        {action && <div className="shrink-0">{action}</div>}
      </div>
    </header>
  );
}
