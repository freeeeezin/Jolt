# public/

PWA 아이콘이 필요합니다. 다음 파일을 이 디렉토리에 추가하세요.

- `icon-192.png` — 192×192 PNG
- `icon-512.png` — 512×512 PNG

## 간단히 만드는 법

Figma/Canva에서 배경 `#FF6B35`, 중앙에 흰색 "J" 글자 또는 ⚡ 심볼을 배치한 후 192/512로 export.

또는 <https://realfavicongenerator.net/> 에 SVG/PNG 하나 업로드 → 모든 사이즈 자동 생성.

## firebase-messaging-sw.js

Firebase 콘솔의 웹 앱 설정값(apiKey 등)으로 `REPLACE_*` 부분을 교체하세요.
이 파일은 브라우저 루트(`/firebase-messaging-sw.js`)에서 서비스워커로 로드되어야 FCM 백그라운드 푸시가 작동합니다.
