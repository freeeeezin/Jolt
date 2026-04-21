import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="container-narrow flex min-h-screen flex-col justify-between py-10">
      {/* 헤더: 로고 + 티켓 ID */}
      <header className="flex items-start justify-between">
        <div className="flex items-baseline gap-2">
          <span className="font-display text-3xl text-ink leading-none">
            JOLT
          </span>
          <span className="text-acid text-lg">⚡</span>
        </div>
        <span className="kitsch-stamp bg-acid text-bg">NO. 001</span>
      </header>

      {/* 메인 카피 */}
      <section className="mt-10 flex flex-1 flex-col justify-center">
        <p className="font-hand text-acid text-2xl -rotate-2">또 그래?</p>

        <h1 className="kitsch-title mt-3 text-[56px] leading-[0.95]">
          점심 먹고
          <br />
          <span className="text-acid">또 졸아?</span>
          <br />
          <span className="text-ink/70 line-through decoration-pink decoration-4">
            진짜
          </span>{' '}
          <span className="text-pink">진짜?</span>
        </h1>

        <p className="mt-6 font-serif text-base leading-relaxed text-dim">
          네 졸림 타입 3초 만에 까발려줄게. <br />
          그리고 딱 <span className="text-acid">60초</span>만 뛰면 돼. <br />
          엄살 부리지 말고.
        </p>

        {/* 키치 정보 박스 */}
        <div className="mt-10 border-2 border-ink p-5 relative">
          <span className="absolute -top-3 left-4 bg-bg px-2 font-display text-xs uppercase text-acid">
            ⚠️ 경고
          </span>
          <p className="font-display text-sm uppercase leading-relaxed text-ink">
            이건 알림 서비스 아님.
            <br />
            <span className="text-acid">행동 강제 서비스</span> 다!
          </p>
          <p className="mt-3 font-serif text-xs text-dim">
            졸림 오기 10분 전 찌르고 → 60초 루틴 → 반복 <br />
            안 하면 그냥 계속 조는 거고. 선택은 네 몫.
          </p>
        </div>

        {/* 스펙 리스트 */}
        <ul className="mt-8 space-y-2 font-serif text-sm text-ink">
          <li>
            <span className="text-pink">※</span> 3초 졸림 진단
          </li>
          <li>
            <span className="text-pink">※</span> 네 타입 맞춤 액션
          </li>
          <li>
            <span className="text-pink">※</span> 10분 전 자동 알림
          </li>
          <li>
            <span className="text-pink">※</span> 60초 각성 루틴 (도망 X)
          </li>
        </ul>
      </section>

      {/* 티켓 디바이더 */}
      <div className="my-6 kitsch-divider" />

      {/* CTA */}
      <footer>
        <Link href="/onboarding" className="block">
          <Button size="lg" fullWidth>
            ▶ 시작해, 빨리
          </Button>
        </Link>
        <p className="mt-4 text-center font-hand text-dim">
          로그인? 그런 거 없어.
        </p>
      </footer>
    </div>
  );
}
