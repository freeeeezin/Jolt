'use client';

import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  type Messaging,
} from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

function getFirebaseApp(): FirebaseApp {
  if (app) return app;
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

async function getMessagingSafe(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (!('serviceWorker' in navigator)) return null;
  if (!('Notification' in window)) return null;
  if (messaging) return messaging;
  messaging = getMessaging(getFirebaseApp());
  return messaging;
}

/**
 * 브라우저 알림 권한 요청 + FCM 토큰 발급.
 * 반환값: 토큰 문자열 (실패 시 null).
 */
export async function requestNotificationPermissionAndGetToken(): Promise<string | null> {
  const m = await getMessagingSafe();
  if (!m) return null;

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;

  // Service worker 등록 (public/firebase-messaging-sw.js)
  const registration = await navigator.serviceWorker.register(
    '/firebase-messaging-sw.js',
  );

  const token = await getToken(m, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  return token || null;
}

/**
 * 포그라운드 메시지 수신 리스너.
 */
export async function onForegroundMessage(
  cb: (payload: unknown) => void,
): Promise<() => void> {
  const m = await getMessagingSafe();
  if (!m) return () => {};
  const unsub = onMessage(m, cb);
  return unsub;
}
