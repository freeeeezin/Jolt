'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useOnboardingStore } from '@/store/onboarding';
import {
  classifyDrowsy,
  DROWSY_DESCRIPTION,
  DROWSY_LABEL,
} from '@/lib/drowsy/classifier';
import { getRecommendedActions } from '@/lib/drowsy/recommendations';
import { calcNotifyTime } from '@/lib/drowsy/notify-time';
import { getOrCreateAnonId } from '@/lib/utils';
import { requestNotificationPermissionAndGetToken } from '@/lib/firebase/client';

export default function ResultPage() {
  const router = useRouter();
  const store = useOnboardingStore();
  const [saving, setSaving] = useState(false);
  const [notifState, setNotifState] = useState<
    'idle' | 'requesting' | 'granted' | 'denied' | 'unsupported'
  >('idle');

  useEffect(() => {
    if (
      store.sleep_hours === null ||
      store.meal_type === null ||
      store.drowsy_time === null
    ) {
      router.replace('/onboarding');
    }
  }, [router, store.sleep_hours, store.meal_type, store.drowsy_time]);

  const drowsyType = useMemo(() => {
    if (
      store.sleep_hours === null ||
      store.meal_type === null ||
      !store.drowsy_time
    ) {
      return null;
    }
    return classifyDrowsy({
      sleep_hours: store.sleep_hours,
      meal_type: store.meal_type,
      drowsy_time: store.drowsy_time,
    });
  }, [store.sleep_hours, store.meal_type, store.drowsy_time]);

  const actions = useMemo(
    () => (drowsyType ? getRecommendedActions(drowsyType) : []),
    [drowsyType],
  );

  const notifyTime = useMemo(
    () => (store.drowsy_time ? calcNotifyTime(store.drowsy_time) : null),
    [store.drowsy_time],
  );

  const saveProfile = async () => {
    if (
      store.sleep_hours === null ||
      !store.meal_type ||
      !store.drowsy_time ||
      !drowsyType ||
      !notifyTime
    ) {
      return;
    }
    setSaving(true);
    try {
      const anonId = getOrCreateAnonId();
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: anonId,
          sleep_hours: store.sleep_hours,
          meal_type: store.meal_type,
          drowsy_time: store.drowsy_time,
          notify_time: notifyTime,
          drowsy_type: drowsyType,
        }),
      });
      store.setDrowsyType(drowsyType);
    } finally {
      setSaving(false);
    }
  };

  const enableNotifications = async () => {
    setNotifState('requesting');
    try {
      const token = await requestNotificationPermissionAndGetToken();
      if (!token) {
        setNotifState(
          typeof Notification !== 'undefined' &&
            Notification.permission === 'denied'
            ? 'denied'
            : 'unsupported',
        );
        return;
      }
      const anonId = getOrCreateAnonId();
      await fetch('/api/push-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: anonId, token }),
      });
      setNotifState('granted');
    } catch (e) {
      console.error(e);
      setNotifState('unsupported');
    }
  };

  useEffect(() => {
    if (drowsyType) void saveProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drowsyType]);

  if (!drowsyType) return null;

  return (
    <div className="container-narrow py-10">
      {/* 헤더 */}
      <header className="flex items-start justify-between">
        <Link href="/" className="font-display text-3xl text-ink leading-none">
          JOLT⚡
        </Link>
        <span className="kitsch-stamp bg-pink text-bg">
          {saving ? '저장 중' : '진단 끝'}
        </span>
      </header>

      {/* 결과 카드 — 큰 스티커 */}
      <section className="mt-10">
        <p className="font-hand text-xl -rotate-2 text-pink">네 진단서</p>
        <div className="mt-3 border-2 border-ink bg-acid p-6 relative shadow-[6px_6px_0_0_#FAFAF5]">
          <span className="absolute -top-3 left-4 bg-bg px-2 font-display text-xs uppercase text-ink">
            CERTIFIED ⚡
          </span>
          <p className="font-display text-[11px] uppercase text-bg/70">
            TYPE
          </p>
          <h1 className="mt-1 font-display text-[44px] uppercase leading-[0.95] text-bg">
            {DROWSY_LABEL[drowsyType]}
          </h1>
          <div className="my-4 kitsch-divider" style={{ backgroundImage: 'linear-gradient(to right, #0A0A0A 50%, transparent 50%)', backgroundSize: '8px 2px' }} />
          <p className="font-serif text-sm leading-relaxed text-bg">
            {DROWSY_DESCRIPTION[drowsyType]}
          </p>
        </div>
      </section>

      {/* 추천 액션 */}
      <section className="mt-12">
        <h2 className="kitsch-title text-2xl">
          할 거 <span className="text-acid">3개</span>
        </h2>
        <p className="mt-1 font-hand text-pink">토 달지 말고 해</p>

        <div className="mt-5 space-y-3">
          {actions.map((a, i) => (
            <div
              key={a.tag}
              className="border-2 border-ink bg-muted p-4 flex items-start gap-4 shadow-[4px_4px_0_0_#FAFAF5]"
            >
              <span className="font-display text-4xl text-acid leading-none">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">{a.emoji}</span>
                  <h3 className="font-display text-lg uppercase text-ink">
                    {a.title}
                  </h3>
                </div>
                <p className="mt-1 font-serif text-sm text-dim">{a.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 알림 설정 */}
      <section className="mt-12">
        <div className="border-2 border-ink bg-pink p-6 shadow-[6px_6px_0_0_#FAFAF5]">
          <p className="font-display text-xs uppercase text-bg/70">
            ⏰ ALERT
          </p>
          <h3 className="mt-1 font-display text-3xl uppercase text-bg">
            {notifyTime ? `${notifyTime}에 찌를게` : '알림'}
          </h3>
          <p className="mt-2 font-serif text-sm text-bg">
            졸리기 10분 전. 도망갈 생각 말고.
          </p>

          <div className="mt-5">
            {notifState === 'granted' ? (
              <div className="border-2 border-ink bg-bg px-4 py-3">
                <p className="font-display text-sm uppercase text-acid">
                  ✓ 설정 완료 · 매일 {notifyTime}
                </p>
              </div>
            ) : notifState === 'denied' ? (
              <div className="border-2 border-ink bg-bg px-4 py-3 font-serif text-xs text-ink">
                알림 막아놨네. 브라우저 설정 가서 풀고 와.
              </div>
            ) : notifState === 'unsupported' ? (
              <div className="border-2 border-ink bg-bg px-4 py-3 font-serif text-xs text-ink">
                이 브라우저는 푸시 안 돼. 홈화면 추가하고 다시.
              </div>
            ) : (
              <Button
                fullWidth
                size="lg"
                variant="ink"
                onClick={enableNotifications}
                disabled={notifState === 'requesting'}
              >
                {notifState === 'requesting' ? '물어보는 중...' : '▶ 찌르도록 허락'}
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 미리 체험 */}
      <section className="mt-10 text-center">
        <Link
          href="/routine?preview=1"
          className="font-hand text-lg text-acid underline decoration-pink decoration-2 underline-offset-4"
        >
          그냥 지금 한 번 뛰어볼래? →
        </Link>
      </section>

      <div className="mt-12 kitsch-divider" />
      <p className="mt-4 text-center font-display text-[10px] uppercase text-dim">
        © JOLT · 조는 너를 위한 앱
      </p>
    </div>
  );
}
