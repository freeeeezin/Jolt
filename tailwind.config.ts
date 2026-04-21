import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── Kitsch 블랙 팔레트 ───
        bg: '#0A0A0A',           // 본 배경 (거의 검정)
        ink: '#FAFAF5',          // 본 텍스트 (오프화이트)
        muted: '#141414',        // 카드 배경
        line: '#2A2A2A',         // 얇은 라인
        dim: '#7A7A7A',          // 회색 보조
        // 네온 포인트 3종
        acid: '#F6FF00',         // 메인 엑센트 (애시드 옐로우)
        pink: '#FF2D87',         // 보조 (핫핑크)
        lime: '#D9FF00',         // 포인트 (라임)
        blood: '#FF3D00',        // 강한 경고
      },
      fontFamily: {
        // 헤드라인/디스플레이 (굵고 납작)
        display: ['"Black Han Sans"', '"Pretendard"', 'sans-serif'],
        // 세리프 (레트로 인쇄 느낌)
        serif: ['Hahmlet', '"Noto Serif KR"', 'serif'],
        // 손글씨 (키치 포인트용)
        hand: ['Gaegu', '"Gowun Dodum"', 'cursive'],
        // 본문
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
      boxShadow: {
        // 하드 오프셋 그림자 (블러 없음 = 브루탈리스트 키치)
        brut: '6px 6px 0 0 #FAFAF5',
        'brut-sm': '4px 4px 0 0 #FAFAF5',
        'brut-acid': '6px 6px 0 0 #F6FF00',
        'brut-pink': '6px 6px 0 0 #FF2D87',
        'brut-press': '2px 2px 0 0 #FAFAF5',
      },
      animation: {
        'breath': 'breath 4s ease-in-out infinite',
        'wobble': 'wobble 3s ease-in-out infinite',
        'flicker': 'flicker 0.9s infinite',
        'spin-slow': 'spin 12s linear infinite',
      },
      keyframes: {
        breath: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.12)' },
        },
        wobble: {
          '0%, 100%': { transform: 'rotate(-1.5deg)' },
          '50%': { transform: 'rotate(1.5deg)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.35' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
