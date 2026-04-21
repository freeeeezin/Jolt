import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind 클래스를 안전하게 병합한다.
 * 예: cn('px-2', cond && 'px-4') → 'px-4'
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * "14:30" → 14 * 60 + 30 = 870 (분 단위)
 */
export function hhmmToMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

/**
 * 870 → "14:30"
 */
export function minutesToHHMM(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * 사용자 익명 ID (localStorage 기반).
 * 로그인 전까지 프로필/토큰/로그를 연결하는 키.
 */
export function getOrCreateAnonId(): string {
  if (typeof window === 'undefined') return '';
  const KEY = 'jolt_anon_id';
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(KEY, id);
  }
  return id;
}
