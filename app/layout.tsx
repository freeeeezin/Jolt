import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JOLT ⚡ 또 졸려? 깨워줄게',
  description:
    '점심 먹고 또 조니? 3초 테스트 하고 1분 뛰어. 졸림 타입별 각성 루틴.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JOLT',
  },
  openGraph: {
    title: 'JOLT — 3초 졸림 테스트',
    description: '너는 어떤 졸림 타입? 1분이면 나와.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A0A0A',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
