import type { Metadata } from 'next';
import './globals.css';
import CommandPalette from '@/components/CommandPalette';

export const metadata: Metadata = {
  title: 'DayNight Pilot — AI Career Operations Platform',
  description: 'An intelligent operating system that turns fragmented career, application, and work signals into actions, decisions, and measurable outcomes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning style={{ colorScheme: 'dark', backgroundColor: '#080c14' }}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var theme = saved || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  document.documentElement.style.colorScheme = theme;
                  document.documentElement.style.backgroundColor = theme === 'light' ? '#f8fafc' : '#080c14';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body style={{ background: 'var(--bg-obsidian, #080c14)', color: 'var(--text-primary, #f8fafc)', overflowX: 'hidden' }}>
        <CommandPalette />
        {children}
      </body>
    </html>
  );
}
