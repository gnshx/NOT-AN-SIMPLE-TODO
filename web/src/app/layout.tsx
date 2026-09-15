import type { Metadata } from 'next';
import './globals.css';
import CommandPalette from '@/components/CommandPalette';

export const metadata: Metadata = {
  title: 'DayNight Pilot — AI Career Operations Platform',
  description: 'An intelligent operating system that turns fragmented career, application, and work signals into actions, decisions, and measurable outcomes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: 'var(--bg-void)', overflowX: 'hidden' }}>
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
