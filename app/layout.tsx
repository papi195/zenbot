import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
import './globals.css';
import './landing.css';

export const metadata: Metadata = {
  title: 'ZenBot — Mental wellness for students',
  description:
    'A private, compassionate AI companion for university students. Daily check-ins, saved chats, and mental health resources.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}