'use client';

import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  seconds: number;
  onDone: () => void;
  playing: boolean;
}

/**
 * 큰 원형 타이머. 매초 감소 → 0이 되면 onDone 호출.
 */
export function Timer({ seconds, onDone, playing }: TimerProps) {
  const [remaining, setRemaining] = useState(seconds);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          if (!doneRef.current) {
            doneRef.current = true;
            // 다음 tick에 호출 (setState 중 호출 방지)
            setTimeout(onDone, 0);
          }
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, onDone]);

  const pct = 1 - remaining / seconds;
  const circumference = 2 * Math.PI * 70;

  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <svg
        className="absolute inset-0 -rotate-90"
        viewBox="0 0 160 160"
      >
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="#FFF3EE"
          strokeWidth="10"
        />
        <circle
          cx="80"
          cy="80"
          r="70"
          fill="none"
          stroke="#FF6B35"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1s linear' }}
        />
      </svg>
      <span className="relative text-5xl font-bold tabular-nums text-ink-900">
        {remaining}
      </span>
    </div>
  );
}
