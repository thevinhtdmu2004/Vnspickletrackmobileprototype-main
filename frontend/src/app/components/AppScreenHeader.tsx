import { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MobileHeader } from './MobileHeader';

interface AppBackButtonProps {
  onClick: () => void;
  variant?: 'plain' | 'hero';
  label?: string;
}

interface AppScreenHeaderProps {
  title: string;
  onBack: () => void;
  action?: ReactNode;
  eyebrow?: string;
  description?: string;
  variant?: 'plain' | 'hero' | 'home' | 'list' | 'detail' | 'form';
}

export function AppBackButton({
  onClick,
  variant = 'plain',
  label = 'Quay lại',
}: AppBackButtonProps) {
  const hero = variant === 'hero';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-transform active:scale-95 ${
        hero
          ? 'bg-white/15 text-white'
          : 'bg-card text-[#365050] shadow-[0_4px_14px_rgba(7,94,93,0.08)]'
      }`}
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}

export function AppScreenHeader({
  title,
  onBack,
  action,
  eyebrow,
  description,
  variant = 'plain',
}: AppScreenHeaderProps) {
  const mappedVariant =
    variant === 'home'
      ? 'home'
      : variant === 'detail'
        ? 'detail'
        : variant === 'form'
          ? 'form'
          : 'list';

  return (
    <MobileHeader
      title={title}
      onBack={onBack}
      action={action}
      eyebrow={eyebrow}
      description={description}
      variant={mappedVariant}
    />
  );
}
