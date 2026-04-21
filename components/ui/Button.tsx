import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'acid' | 'ink' | 'pink' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

/**
 * Kitsch Brutalist Button.
 * 두꺼운 테두리 + 하드 오프셋 그림자 + 눌렀을 때 그림자 축소되는 press 피드백.
 */
const variantStyles: Record<Variant, string> = {
  acid:
    'bg-acid text-bg border-ink shadow-brut hover:shadow-brut-press hover:translate-x-[4px] hover:translate-y-[4px] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none',
  ink:
    'bg-ink text-bg border-ink shadow-brut-acid hover:shadow-[2px_2px_0_0_#F6FF00] hover:translate-x-[4px] hover:translate-y-[4px]',
  pink:
    'bg-pink text-ink border-ink shadow-brut hover:shadow-brut-press hover:translate-x-[4px] hover:translate-y-[4px]',
  ghost:
    'bg-transparent text-ink border-ink/30 hover:border-ink hover:bg-ink/5',
  danger:
    'bg-blood text-ink border-ink shadow-brut hover:shadow-brut-press hover:translate-x-[4px] hover:translate-y-[4px]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-5 text-sm',
  lg: 'h-16 px-6 text-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'acid', size = 'md', fullWidth, className, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          // 공통: 납작한 키치 디스플레이 폰트 + 두꺼운 테두리
          'inline-flex items-center justify-center gap-1',
          'font-display uppercase tracking-wide',
          'border-2 transition-all duration-100',
          'focus:outline-none focus:ring-0',
          'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
