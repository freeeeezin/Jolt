import { hhmmToMinutes, minutesToHHMM } from '@/lib/utils';

/**
 * 졸림 10분 전 알림 시간.
 * "14:30" → "14:20"
 */
export function calcNotifyTime(drowsyTime: string, leadMin = 10): string {
  const mins = hhmmToMinutes(drowsyTime) - leadMin;
  return minutesToHHMM(mins);
}

/**
 * 알림 단계별 카피 (점점 강하게).
 */
export const NOTIFY_COPY = {
  pre: {
    title: '⏰ 10분 남음',
    body: '곧 조니까 미리 물 한 잔 때려. 안 그러면 진짜 훅 간다.',
  },
  onTime: {
    title: '⚡ 지금이야',
    body: '60초. 딱 60초만 움직여. 누워있지 말고.',
  },
  followUp: {
    title: '😤 아직도?',
    body: '그냥 더 자. 대신 내일까지 계속 조는 거지.',
  },
} as const;

export type NotifyStage = keyof typeof NOTIFY_COPY;
