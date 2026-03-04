import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '터벅 Teobeok - AI 국내 여행',
  description: 'AI가 제안하는 나만의 속도, 나만의 국내 여행 이야기',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
