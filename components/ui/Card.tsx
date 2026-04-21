import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * Kitsch 카드: 두꺼운 흰 테두리 + 하드 오프셋 그림자.
 * 본체는 #141414 (무드된 검정).
 */
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'border-2 border-ink bg-muted p-5',
        'shadow-[4px_4px_0_0_#FAFAF5]',
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'font-display text-lg uppercase tracking-tight text-ink',
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn('mt-1 text-sm leading-relaxed text-dim', className)}
      {...props}
    />
  );
}
