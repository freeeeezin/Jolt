'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Timer } from '@/components/routine/Timer';
import { useOnboardingStore } from '@/store/onboarding';
import { getOrCreateAnonId } from '@/lib/utils';
import type { RoutineResult } from '@/types';

interface Stage {
  emoji: string;
  title: string;
  guide: string;
  seconds: number;
}

const STAGES: Stage[] = [
  {
    emoji: '🧍',
    title: '1. 일어서기',
    guide: '의자에서 일어나세요. 허리 펴고 똑바로.',
    seconds: 15,
  },
  {
    emoji: '🙆',
    title: '2. 팔 크게 휘두르기',
    guide: '좌우 번갈아 팔을 크게 돌리세요. 혈류를 깨워요.',
    seconds: 15,
  },
  {
    emoji: '🌬',
    title: '3. 빠른 호흡',
    guide: '1초 들숨 · 1초 날숨. 입으로 짧고 세게.',
    seconds: 15,
  },
  {
    emoji: '👁',
    title: '4. 먼 곳 응시',
    guide: '창 밖 먼 곳을 바라보세요. 눈·뇌를 같이 깨워요.',
    seconds: 15,
  },
];

export default function RoutinePage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [phase, setPhase] = useState<'intro' | 'running' | 'feedback'>(
    'intro',
  );
  const [stageIdx, setStageIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const start = () => {
    setStageIdx(0);
    setPhase('running');
  };

  const onStageDone = useCallback(() => {
    setStageIdx((i) => {
      if (i + 1 >= STAGES.length) {
        setPhase('feedback');
        return i;
      }
      return i + 1;
    });
  }, []);

  const submitFeedback = async (result: RoutineResult) => {
    setSubmitting(true);
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: getOrCreateAnonId(),
          result,
          completed: true,
          drowsy_type: store.drowsy_type,
        }),
      });
      // 효과 체감 → 홈으로
      router.replace('/result');
    } finally {
      setSubmitting(false);
    }
  };

  const skip = async () => {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        profile_id: getOrCreateAnonId(),
        result: 'bad',
        completed: false,
        drowsy_type: store.drowsy_type,
      }),
    });
    router.replace('/result');
  };

  // ─────────── intro ───────────
  if (phase === 'intro') {
    return (
      <div className="container-narrow flex min-h-screen flex-col justify-between py-10">
        <header className="text-xl font-black text-brand">Jolt</header>
        <section className="flex flex-1 flex-col justify-center">
          <p className="text-sm font-semibold text-brand">60초면 끝나요</p>
          <h1 className="mt-2 text-3xl font-bold leading-tight">
            자, 1분 각성 루틴
            <br />
            시작해볼까요?
          </h1>

          <div className="mt-8 space-y-3">
            {STAGES.map((s, i) => (
              <Card key={i} className="flex items-center gap-3 py-4">
                <span className="text-2xl">{s.emoji}</span>
                <span className="flex-1 font-medium text-ink-700">
                  {s.title}
                </span>
                <span className="text-xs text-ink-500">{s.seconds}초</span>
              </Card>
            ))}
          </div>
        </section>
        <div className="mt-8 space-y-2">
          <Button size="lg" fullWidth onClick={start}>
            시작하기
          </Button>
          <Button variant="ghost" fullWidth onClick={skip}>
            오늘은 넘길래요
          </Button>
        </div>
      </div>
    );
  }

  // ─────────── running ───────────
  if (phase === 'running') {
    const stage = STAGES[stageIdx]!;
    return (
      <div className="container-narrow flex min-h-screen flex-col py-10">
        {/* 단계 진행도 */}
        <div className="flex gap-1.5">
          {STAGES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                i <= stageIdx ? 'bg-brand' : 'bg-ink-100'
              }`}
            />
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center gap-8">
          <span className="text-7xl animate-breath">{stage.emoji}</span>

          <Timer
            key={stageIdx}
            seconds={stage.seconds}
            onDone={onStageDone}
            playing
          />

          <div className="text-center">
            <h2 className="text-2xl font-bold">{stage.title}</h2>
            <p className="mt-2 max-w-xs text-sm text-ink-500">{stage.guide}</p>
          </div>
        </div>

        <Button variant="ghost" fullWidth onClick={skip}>
          중단하기
        </Button>
      </div>
    );
  }

  // ─────────── feedback ───────────
  return (
    <div className="container-narrow flex min-h-screen flex-col py-10">
      <header className="text-xl font-black text-brand">Jolt</header>

      <section className="flex flex-1 flex-col justify-center">
        <p className="text-sm font-semibold text-brand">수고했어요 💪</p>
        <h1 className="mt-2 text-3xl font-bold leading-tight">
          좀 깨어났나요?
        </h1>
        <p className="mt-3 text-sm text-ink-500">
          솔직한 피드백이 내일 알림을 더 똑똑하게 만들어요.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-3">
          <FeedbackBtn
            emoji="😴"
            label="아직 졸려"
            onClick={() => submitFeedback('bad')}
            disabled={submitting}
          />
          <FeedbackBtn
            emoji="😐"
            label="그럭저럭"
            onClick={() => submitFeedback('normal')}
            disabled={submitting}
          />
          <FeedbackBtn
            emoji="😃"
            label="깨어났어요"
            onClick={() => submitFeedback('good')}
            disabled={submitting}
          />
        </div>
      </section>
    </div>
  );
}

function FeedbackBtn({
  emoji,
  label,
  onClick,
  disabled,
}: {
  emoji: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-ink-100 bg-white p-3 transition-all hover:border-brand disabled:opacity-50"
    >
      <span className="text-4xl">{emoji}</span>
      <span className="text-xs font-medium text-ink-700">{label}</span>
    </button>
  );
}
