/**
 * 식사 종류.
 * carb: 밥/면/빵 위주
 * protein: 단백질 위주 (고기/생선/계란)
 * light: 가볍게 (샐러드/죽/스무디)
 * skipped: 안 먹음
 */
export type MealType = 'carb' | 'protein' | 'light' | 'skipped';

/**
 * 졸림 타입 (룰 기반 분류 결과).
 * blood_sugar_crash: 혈당 급변 (탄수화물 과다 + 수면 부족)
 * sleep_debt: 수면 부채 (수면 < 6h)
 * post_meal_low: 일반적인 식후 저혈당성 졸림
 * circadian_dip: 오후 생체 리듬 저하
 */
export type DrowsyType =
  | 'blood_sugar_crash'
  | 'sleep_debt'
  | 'post_meal_low'
  | 'circadian_dip';

/**
 * 루틴 피드백.
 */
export type RoutineResult = 'good' | 'normal' | 'bad';

/**
 * 추천 액션.
 */
export type ActionTag =
  | 'walk' // 산책
  | 'water' // 물 마시기
  | 'caffeine' // 카페인
  | 'stretch' // 스트레칭
  | 'cold_water' // 찬물 세수
  | 'daylight' // 햇빛 쬐기
  | 'breath'; // 호흡

/**
 * 프로필 (DB: profiles)
 */
export interface Profile {
  id: string; // anon_id (UUID, localStorage)
  sleep_hours: number; // 전날 수면 시간 (h)
  meal_type: MealType;
  drowsy_time: string; // 'HH:MM' 예상 졸림 시각
  notify_time: string; // 'HH:MM' 알림 시각 (drowsy_time - 10min)
  drowsy_type: DrowsyType;
  created_at: string;
  updated_at: string;
}

/**
 * FCM 토큰 (DB: push_tokens)
 */
export interface PushToken {
  id: string;
  profile_id: string;
  token: string;
  created_at: string;
}

/**
 * 루틴 피드백 로그 (DB: logs)
 */
export interface RoutineLog {
  id: string;
  profile_id: string;
  result: RoutineResult;
  completed: boolean;
  drowsy_type: DrowsyType | null;
  created_at: string;
}

/**
 * 온보딩 입력값 (클라이언트 전용).
 */
export interface OnboardingInput {
  sleep_hours: number | null;
  meal_type: MealType | null;
  drowsy_time: string | null; // 'HH:MM'
}
