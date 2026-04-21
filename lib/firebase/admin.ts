import {
  initializeApp,
  cert,
  getApps,
  type App,
} from 'firebase-admin/app';
import { getMessaging, type Messaging } from 'firebase-admin/messaging';

let app: App | null = null;

function getAdminApp(): App {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0]!;
    return app;
  }

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수가 없습니다.');
  }

  const serviceAccount = JSON.parse(raw);
  app = initializeApp({
    credential: cert(serviceAccount),
  });
  return app;
}

export function getAdminMessaging(): Messaging {
  return getMessaging(getAdminApp());
}

/**
 * 단일 토큰으로 FCM 발송. 전송 결과를 반환한다.
 */
export async function sendPush(params: {
  token: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  url?: string;
}) {
  const messaging = getAdminMessaging();
  return messaging.send({
    token: params.token,
    notification: {
      title: params.title,
      body: params.body,
    },
    data: {
      ...(params.data ?? {}),
      ...(params.url ? { url: params.url } : {}),
    },
    webpush: {
      fcmOptions: params.url ? { link: params.url } : undefined,
      notification: {
        icon: '/icon-192.png',
        badge: '/icon-192.png',
      },
    },
  });
}
