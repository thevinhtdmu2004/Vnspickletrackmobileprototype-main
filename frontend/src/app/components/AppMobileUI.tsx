import { AlertTriangle, ChevronRight, LoaderCircle, LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { cn } from './ui/utils';

export function AppPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex h-full min-h-0 flex-col overflow-hidden bg-background', className)}>
      {children}
    </div>
  );
}

export function AppPageContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        'min-h-0 flex-1 overflow-y-auto px-4 py-4 pb-[calc(7rem+env(safe-area-inset-bottom))] space-y-4',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function AppSectionLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        'text-[11px] font-extrabold uppercase tracking-[0.08em] text-muted-foreground',
        className,
      )}
    >
      {children}
    </p>
  );
}

export function AppSectionCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        'rounded-[24px] border-border/70 bg-card p-4 shadow-[0_6px_18px_rgba(7,94,93,0.06)] gap-0',
        className,
      )}
    >
      {children}
    </Card>
  );
}

export function AppMetricCard({
  label,
  value,
  tone = 'primary',
  icon: Icon,
}: {
  label: string;
  value: string | number;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  icon?: LucideIcon;
}) {
  const toneClass = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning-foreground',
    danger: 'text-destructive',
    neutral: 'text-foreground',
  }[tone];

  return (
    <AppSectionCard className="rounded-2xl p-4">
      {Icon && <Icon className={cn('mb-3 h-5 w-5', toneClass)} />}
      <p className={cn('text-2xl font-black leading-none', toneClass)}>{value}</p>
      <p className="mt-2 text-[11px] font-medium text-muted-foreground">{label}</p>
    </AppSectionCard>
  );
}

export function AppListItem({
  title,
  description,
  status,
  icon: Icon,
  iconTone = 'primary',
  onClick,
  trailing,
  className,
}: {
  title: string;
  description?: string;
  status?: ReactNode;
  icon?: LucideIcon;
  iconTone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  onClick?: () => void;
  trailing?: ReactNode;
  className?: string;
}) {
  const iconClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/20 text-warning-foreground',
    danger: 'bg-destructive/10 text-destructive',
    neutral: 'bg-muted text-foreground',
  }[iconTone];

  const content = (
    <AppSectionCard
      className={cn(
        'rounded-[22px] p-4',
        onClick && 'active:scale-[0.99] transition-transform',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl', iconClass)}>
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-foreground">{title}</h3>
              {description && (
                <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            {status}
          </div>
        </div>
        {trailing ?? (onClick ? <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" /> : null)}
      </div>
    </AppSectionCard>
  );

  if (!onClick) return content;

  return (
    <button className="w-full text-left" onClick={onClick} type="button">
      {content}
    </button>
  );
}

export function AppStatusBadge({
  label,
  tone = 'neutral',
  className,
}: {
  label: string;
  tone?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral';
  className?: string;
}) {
  const toneClass = {
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/20 text-warning-foreground',
    danger: 'bg-destructive/10 text-destructive',
    neutral: 'bg-muted text-muted-foreground',
  }[tone];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1.5 text-[10px] font-black whitespace-nowrap',
        toneClass,
        className,
      )}
    >
      {label}
    </span>
  );
}

export function AppFormField({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-[0.06em] text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

export function AppTextInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} className={cn('h-12 rounded-xl border-border/80 bg-card px-3 text-sm', props.className)} />;
}

export function AppPrimaryButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} variant="mobilePrimary" className={cn('h-12 w-full rounded-2xl text-sm font-extrabold', props.className)} />;
}

export function AppSecondaryButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} variant="mobileSecondary" className={cn('h-12 w-full rounded-2xl text-sm font-bold', props.className)} />;
}

export function AppDangerButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} variant="mobileDanger" className={cn('h-12 w-full rounded-2xl text-sm font-bold', props.className)} />;
}

export function AppNotice({
  tone = 'info',
  message,
}: {
  tone?: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}) {
  const toneClass = {
    info: 'bg-primary/8 text-primary border-primary/15',
    success: 'bg-success/10 text-success border-success/15',
    warning: 'bg-warning/20 text-warning-foreground border-warning/35',
    danger: 'bg-destructive/10 text-destructive border-destructive/15',
  }[tone];

  return (
    <div className={cn('flex items-start gap-2 rounded-2xl border px-3 py-3 text-xs font-medium', toneClass)}>
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span className="leading-5">{message}</span>
    </div>
  );
}

export function AppLoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 text-center">
      <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

export function AppErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 px-4 text-center">
      <AlertTriangle className="h-7 w-7 text-destructive" />
      <p className="text-sm font-bold text-foreground">Có lỗi xảy ra</p>
      <p className="max-w-[260px] text-xs leading-5 text-muted-foreground">{message}</p>
      {onRetry && <AppPrimaryButton className="max-w-[220px]" onClick={onRetry}>Thử lại</AppPrimaryButton>}
    </div>
  );
}

export function AppEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <AppSectionCard className="border-dashed border-border bg-card/80 px-5 py-6 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/8 text-primary">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-sm font-black text-foreground">{title}</h3>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </AppSectionCard>
  );
}

export function AppStickyFooter({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="sticky bottom-0 border-t border-border bg-background/95 p-4 backdrop-blur">
      {children}
    </div>
  );
}
