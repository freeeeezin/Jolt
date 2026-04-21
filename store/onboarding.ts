'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { MealType, OnboardingInput, DrowsyType } from '@/types';

interface OnboardingState extends OnboardingInput {
  drowsy_type: DrowsyType | null;
  setSleepHours: (h: number) => void;
  setMealType: (m: MealType) => void;
  setDrowsyTime: (t: string) => void;
  setDrowsyType: (t: DrowsyType) => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      sleep_hours: null,
      meal_type: null,
      drowsy_time: null,
      drowsy_type: null,
      setSleepHours: (h) => set({ sleep_hours: h }),
      setMealType: (m) => set({ meal_type: m }),
      setDrowsyTime: (t) => set({ drowsy_time: t }),
      setDrowsyType: (t) => set({ drowsy_type: t }),
      reset: () =>
        set({
          sleep_hours: null,
          meal_type: null,
          drowsy_time: null,
          drowsy_type: null,
        }),
    }),
    {
      name: 'jolt_onboarding',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
