import { forwardRef, ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { haptic } from '@/lib/haptic';

interface BigTapButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  sublabel?: string;
  tone?: 'accent' | 'sky' | 'sage' | 'lilac';
}

const toneMap: Record<NonNullable<BigTapButtonProps['tone']>, string> = {
  accent: 'bg-[hsl(var(--rose-pastel)/0.18)] border-[hsl(var(--rose-pastel)/0.35)] text-[hsl(var(--rose-pastel))]',
  sky: 'bg-[hsl(var(--sky-powder)/0.18)] border-[hsl(var(--sky-powder)/0.35)] text-[hsl(var(--sky-powder))]',
  sage: 'bg-[hsl(var(--sage)/0.18)] border-[hsl(var(--sage)/0.35)] text-[hsl(var(--sage))]',
  lilac: 'bg-[hsl(var(--lilac)/0.18)] border-[hsl(var(--lilac)/0.35)] text-[hsl(var(--lilac))]',
};

export const BigTapButton = forwardRef<HTMLButtonElement, BigTapButtonProps>(
  ({ icon, label, sublabel, tone = 'accent', className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        onClick={(e) => {
          haptic.tap();
          onClick?.(e);
        }}
        className={cn(
          'group relative flex flex-col items-center justify-center gap-3 rounded-3xl border backdrop-blur-md',
          'min-h-[var(--tap-lg)] w-full px-6 py-8 transition-all',
          'active:scale-[0.97] active:brightness-110',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--night-bg))] focus-visible:ring-[hsl(var(--night-accent))]',
          toneMap[tone],
          className
        )}
        {...props}
      >
        <div className="text-4xl">{icon}</div>
        <div className="text-center">
          <div className="text-lg font-medium tracking-wide">{label}</div>
          {sublabel && (
            <div className="text-xs opacity-70 mt-0.5">{sublabel}</div>
          )}
        </div>
      </button>
    );
  }
);
BigTapButton.displayName = 'BigTapButton';
