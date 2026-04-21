// Firebase Cloud Messaging 서비스 워커.
// 브라우저가 이 파일을 꼭 /firebase-messaging-sw.js 경로에서 제공받아야 한다.
//
// 설정값은 .env.local 의 NEXT_PUBLIC_FIREBASE_* 과 같은 값을 넣는다.
// 서비스 워커는 빌드 환경 변수를 직접 읽지 못하므로 여기서는 빌드 시 치환이 필요하다면
// build 스크립트에서 envsubst 등으로 채우거나, 아래 값을 직접 상수로 넣어 관리한다.

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// TODO: 아래 값을 프로젝트의 Firebase 설정으로 교체하세요.
firebase.initializeApp({
  apiKey: 'REPLACE_FIREBASE_API_KEY',
  authDomain: 'REPLACE_FIREBASE_AUTH_DOMAIN',
  projectId: 'REPLACE_FIREBASE_PROJECT_ID',
  storageBucket: 'REPLACE_FIREBASE_STORAGE_BUCKET',
  messagingSenderId: 'REPLACE_FIREBASE_MESSAGING_SENDER_ID',
  appId: 'REPLACE_FIREBASE_APP_ID',
});

const messaging = firebase.messaging();

// 백그라운드 메시지 수신
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || '지금이에요';
  const options = {
    body: payload.notification?.body || '1분만 몸을 움직여요.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: payload.data || {},
  };
  self.registration.showNotification(title, options);
});

// 알림 클릭 시 라우팅
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification?.data?.url || '/routine';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(url);
    }),
  );
});
