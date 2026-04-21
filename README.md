# Jolt

> **짧은 행동을 반복시키는 습관 플랫폼.**
> 점심 이후 졸림을 예측하고 1분 루틴으로 깨워주는 각성 관리 웹앱.

## 🚀 서비스 한 줄 정의

알림 서비스가 아니라 **행동 개입 서비스**.
졸림이 오기 10분 전에 알림 → 60초 루틴 실행 → 효과 체감 → 개인화 → 반복.

## 🧠 핵심 흐름

```
카카오 공유 링크 유입
 → 3초 졸림 진단
 → 졸림 타입 분류 (룰 기반)
 → 맞춤 행동 추천 + 알림 설정
 → 알림 클릭
 → 1분 각성 루틴
 → 효과 체감 피드백
 → 데이터 축적 → 개인화 → 반복
```

## 🏗 기술 스택

| 영역 | 기술 |
| --- | --- |
| Front + Backend | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| DB | Supabase (Postgres + RLS) |
| Push | Firebase Cloud Messaging |
| 스케줄러 | Vercel Cron |
| PWA | next-pwa |
| 배포 | Vercel |

## 📁 폴더 구조

```
app/
  page.tsx                        ← 랜딩 (카카오 공유 유입)
  onboarding/                     ← 3초 진단
  result/                         ← 졸림 타입 + 추천
  routine/                        ← 1분 각성 루틴
  api/
    profile/                      ← POST 프로필 저장
    push-token/                   ← POST FCM 토큰 등록
    log/                          ← POST 루틴 피드백 기록
    send-notification/            ← POST 특정 사용자 발송
    cron/send-notifications/      ← 1분 단위 Vercel Cron
components/
  ui/                             ← Button, Card
  routine/                        ← 루틴 각 단계 컴포넌트
lib/
  supabase/                       ← client / server
  firebase/                       ← client / admin
  drowsy/                         ← 분류 / 추천 / 시각 계산
  utils.ts
store/
  onboarding.ts                   ← zustand
supabase/
  migrations/0001_init.sql
public/
  manifest.json
  firebase-messaging-sw.js
types/
  index.ts
```

## ⚡ 시작하기

```bash
# 1) 의존성 설치
npm install

# 2) 환경 변수 설정
cp .env.example .env.local
# → Supabase, Firebase 값 채우기

# 3) Supabase 스키마 적용
# Supabase Studio → SQL Editor 에서 supabase/migrations/0001_init.sql 실행

# 4) 개발 서버 실행
npm run dev
```

## 🔔 알림 전략

| 시점 | 내용 | 강도 |
| --- | --- | --- |
| T − 10분 | "10분 뒤 졸림이 올 거예요. 준비할까요?" | 🟡 약 |
| T | "지금이에요. 1분만 움직이죠." | 🟠 중 |
| T + 5분 | "아직 안 일어났어요? 딱 60초면 돼요." | 🔴 강 |

## 🎯 핵심 지표

- 알림 클릭률 (CTR)
- 루틴 완료율
- 효과 체감률 (👍 / 👎)
- D1 / D7 리텐션
- streak 평균 길이

## 🔄 리텐션 루프

```
알림 → 실행 → 피드백 → 데이터 축적 → 개인화 → 더 정확한 알림 → ...
```

## 🗓 개발 일정

- **1주차**: 온보딩 + 결과 페이지
- **2주차**: 푸시 알림 + PWA
- **3주차**: 루틴 + 피드백
- **4주차**: 데이터 + 개인화 리포트

## 📦 배포

```bash
vercel
# 환경 변수 등록:
#   NEXT_PUBLIC_SUPABASE_* / SUPABASE_SERVICE_ROLE_KEY
#   NEXT_PUBLIC_FIREBASE_* / FIREBASE_SERVICE_ACCOUNT_JSON
#   CRON_SECRET
```

Vercel Cron 은 `vercel.json` 의 정의로 `/api/cron/send-notifications` 를 1분 단위 호출한다.
