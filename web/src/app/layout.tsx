import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DayNight Pilot | Productivity & Job Tracker',
  description: 'Your personal command center for tasks, schedule, and job applications. Day planner, Kanban board, Gmail AI intelligence, and Telegram notifications.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ background: 'var(--bg-void)', overflowX: 'hidden' }}>
        {/* Top chromatic accent bar */}
        <div className="top-accent-line" />
        {children}
      </body>
    </html>
  );
}
