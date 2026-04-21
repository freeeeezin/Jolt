'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useOnboardingStore } from '@/store/onboarding';
import type { MealType } from '@/types';
import { cn } from '@/lib/utils';

const SLEEP_OPTIONS = [
  { v: 4, label: '4시간 이하', tag: '자살행위' },
  { v: 5, label: '5시간', tag: '바보' },
  { v: 6, label: '6시간', tag: '부족해' },
  { v: 7, label: '7시간', tag: '괜찮네' },
  { v: 8, label: '8시간 이상', tag: '잘났네' },
];

const MEAL_OPTIONS: { v: MealType; emoji: string; label: string; sub: string }[] = [
  { v: 'carb', emoji: '🍚', label: '밥·면·빵', sub: '조는 건 당연' },
  { v: 'protein', emoji: '🍗', label: '고기·생선', sub: '그나마 선방' },
  { v: 'light', emoji: '🥗', label: '풀떼기', sub: '배고파 졸려' },
  { v: 'skipped', emoji: '🙅', label: '굶음', sub: '왜 그래' },
];

const DROWSY_TIMES = [
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const store = useOnboardingStore();

  const canNext = useMemo(() => {
    if (step === 0) return store.sleep_hours !== null;
    if (step === 1) return store.meal_type !== null;
    if (step === 2) return store.drowsy_time !== null;
    return false;
  }, [step, store.sleep_hours, store.meal_type, store.drowsy_time]);

  const next = () => {
    if (step < 2) setStep(step + 1);
    else router.push('/result');
  };
  const prev = () => setStep(Math.max(0, step - 1));

  return (
    <div className="container-narrow flex min-h-screen flex-col py-8">
      {/* 상단: 진행도 + 스텝 넘버 */}
      <div className="flex items-center justify-between">
        <span className="font-display text-xs uppercase text-dim">
          Q.{step + 1} / 3
        </span>
        <span className="kitsch-stamp bg-acid text-bg">진단 중</span>
      </div>

      <div className="mt-3 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 border-2 border-ink transition-all',
              i <= step ? 'bg-acid' : 'bg-bg',
            )}
          />
        ))}
      </div>

      <button
        onClick={prev}
        className={cn(
          'mt-6 w-fit font-display text-xs uppercase text-dim hover:text-ink',
          step === 0 && 'invisible',
        )}
      >
        ← 뒤로
      </button>

      {/* 질문 */}
      <div className="mt-6 flex-1">
        {step === 0 && (
          <Step>
            <p className="font-hand text-pink text-xl -rotate-1">야 솔직히</p>
            <Title>
              어제 몇 시간<br />
              <span className="text-acid">잤</span>어?
            </Title>
            <div className="mt-8 grid grid-cols-1 gap-3">
              {SLEEP_OPTIONS.map((o) => (
                <Choice
                  key={o.v}
                  selected={store.sleep_hours === o.v}
                  onClick={() => store.setSleepHours(o.v)}
                  className="flex-row justify-between px-5"
                >
                  <span className="font-display text-base text-ink">
                    {o.label}
                  </span>
                  <span className="font-hand text-sm text-pink">{o.tag}</span>
                </Choice>
              ))}
            </div>
          </Step>
        )}

        {step === 1 && (
          <Step>
            <p className="font-hand text-pink text-xl -rotate-1">아까</p>
            <Title>
              뭘<br />
              <span className="text-acid">처먹었</span>냐?
            </Title>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {MEAL_OPTIONS.map((o) => (
                <Choice
                  key={o.v}
                  selected={store.meal_type === o.v}
                  onClick={() => store.setMealType(o.v)}
                  className="aspect-[1.1/1] flex-col gap-1"
                >
                  <span className="text-4xl">{o.emoji}</span>
                  <span className="font-display text-sm uppercase text-ink">
                    {o.label}
                  </span>
                  <span className="font-hand text-xs text-dim">{o.sub}</span>
                </Choice>
              ))}
            </div>
          </Step>
        )}

        {step === 2 && (
          <Step>
            <p className="font-hand text-pink text-xl -rotate-1">그래서</p>
            <Title>
              몇 시쯤<br />
              <span className="text-acid">뻗</span>어?
            </Title>
            <p className="mt-3 font-serif text-sm text-dim">
              10분 전에 정확히 찌를게. 준비해.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {DROWSY_TIMES.map((t) => (
                <Choice
                  key={t}
                  selected={store.drowsy_time === t}
                  onClick={() => store.setDrowsyTime(t)}
                >
                  <span className="font-display text-xl tabular-nums text-ink">
                    {t}
                  </span>
                </Choice>
              ))}
            </div>
          </Step>
        )}
      </div>

      <div className="mt-8">
        <Button
          size="lg"
          fullWidth
          onClick={next}
          disabled={!canNext}
          variant={canNext ? 'acid' : 'ghost'}
        >
          {step < 2 ? '다음 →' : '결과 까봐 ▶'}
        </Button>
      </div>
    </div>
  );
}

function Step({ children }: { children: React.ReactNode }) {
  return <div className="animate-in fade-in">{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="kitsch-title mt-2 text-5xl leading-[0.95]">{children}</h1>
  );
}

function Choice({
  selected,
  onClick,
  className,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-center border-2 px-4 py-4 transition-all',
        selected
          ? 'border-ink bg-acid text-bg shadow-[4px_4px_0_0_#FAFAF5]'
          : 'border-ink/40 bg-muted text-ink hover:border-ink hover:shadow-[4px_4px_0_0_#FAFAF5]',
        className,
      )}
    >
      {children}
    </button>
  );
}
