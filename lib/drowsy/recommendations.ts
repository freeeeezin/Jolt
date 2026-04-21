import type { ActionTag, DrowsyType } from '@/types';

interface Action {
  tag: ActionTag;
  emoji: string;
  title: string;
  detail: string;
}

const CATALOG: Record<ActionTag, Action> = {
  walk: {
    tag: 'walk',
    emoji: '🚶',
    title: '3분 걸어',
    detail: '의자에서 일어나. 걷기만 해도 심박수 올라간다. 궁시렁대지 말고.',
  },
  water: {
    tag: 'water',
    emoji: '💧',
    title: '물 원샷',
    detail: '뇌에 물 2%만 모자라도 졸려. 딱 한 컵만 털어.',
  },
  caffeine: {
    tag: 'caffeine',
    emoji: '☕',
    title: '커피 때려',
    detail: '15분 있다 온다. 대신 3시 넘으면 끊어. 밤에 안 자려면.',
  },
  stretch: {
    tag: 'stretch',
    emoji: '🤸',
    title: '목·어깨 스트레칭',
    detail: '앉은 채로 1분. 몸이 굳은 게 너를 더 재우고 있음.',
  },
  cold_water: {
    tag: 'cold_water',
    emoji: '🥶',
    title: '찬물 세수',
    detail: '엄살 금지. 교감신경 바로 깨우는 원샷 원킬 방법.',
  },
  daylight: {
    tag: 'daylight',
    emoji: '☀️',
    title: '창가 2분',
    detail: '햇빛 쬐면 멜라토닌 줄고 각성 올라간다. 과학이야.',
  },
  breath: {
    tag: 'breath',
    emoji: '🌬',
    title: '빠른 호흡 30초',
    detail: '1초 들숨 1초 날숨 짧고 세게. 뇌에 산소 보내.',
  },
};

export function getRecommendedActions(type: DrowsyType): Action[] {
  const byType: Record<DrowsyType, ActionTag[]> = {
    blood_sugar_crash: ['walk', 'water', 'stretch'],
    sleep_debt: ['cold_water', 'caffeine', 'daylight'],
    post_meal_low: ['walk', 'water', 'caffeine'],
    circadian_dip: ['daylight', 'walk', 'breath'],
  };
  return byType[type].map((t) => CATALOG[t]);
}
