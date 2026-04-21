import type { DrowsyType, MealType } from '@/types';
import { hhmmToMinutes } from '@/lib/utils';

interface ClassifyInput {
  sleep_hours: number;
  meal_type: MealType;
  drowsy_time: string; // 'HH:MM'
}

/**
 * 룰 기반 졸림 타입 분류.
 * 우선순위: blood_sugar_crash > sleep_debt > circadian_dip > post_meal_low
 */
export function classifyDrowsy(input: ClassifyInput): DrowsyType {
  const { sleep_hours, meal_type, drowsy_time } = input;

  if (sleep_hours < 6 && meal_type === 'carb') {
    return 'blood_sugar_crash';
  }
  if (sleep_hours < 5.5) {
    return 'sleep_debt';
  }
  const mins = hhmmToMinutes(drowsy_time);
  const isAfternoonDip =
    mins >= hhmmToMinutes('14:00') && mins <= hhmmToMinutes('16:00');
  if (isAfternoonDip && (meal_type === 'light' || meal_type === 'skipped')) {
    return 'circadian_dip';
  }
  return 'post_meal_low';
}

/**
 * 졸림 타입 → 키치한 라벨 (반말).
 */
export const DROWSY_LABEL: Record<DrowsyType, string> = {
  blood_sugar_crash: '당치기 좀비',
  sleep_debt: '수면 빚쟁이',
  post_meal_low: '밥심 뱀파이어',
  circadian_dip: '2시의 유령',
};

/**
 * 졸림 타입 → 설명 (반말·키치 카피).
 */
export const DROWSY_DESCRIPTION: Record<DrowsyType, string> = {
  blood_sugar_crash:
    '잠도 못 잤는데 탄수화물 쳐먹었지? 혈당이 롤러코스터 탔다가 바닥 찍는 중. 그래서 지금 좀비야.',
  sleep_debt:
    '그냥 못 잤어. 카페인 아무리 마셔도 잠깐이야. 답은 오늘 일찍 자는 거. 그거 하나.',
  post_meal_low:
    '소화하느라 피가 배로 다 몰렸고, 뇌는 방치됨. 움직여서 피 다시 올려보내. 그럼 풀려.',
  circadian_dip:
    '오후 2~4시는 원래 몸이 다운되는 구간. 근데 뭘 제대로 안 먹어서 더 심하게 내려간 거야. 빛 보고 움직여.',
};
