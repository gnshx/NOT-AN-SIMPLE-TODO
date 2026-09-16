/**
 * @file layout.tsx
 * @description Root application layout for DayNight Pilot.
 * 
 * Architectural Responsibilities:
 * 1. Global Document Shell: Injects the root <html> and <body> tags across all pages.
 * 2. Zero-FOUC Theme Initialization: Injects a blocking synchronous script in <head>
 *    to read stored user theme from localStorage before the first DOM frame paints,
 *    eliminating the flash-of-unstyled-content (white flash) completely.
 * 3. Global CSS Tokens: Imports globals.css establishing the aerospace design system.
 * 4. Keyboard Command Orchestration: Mounts the global CommandPalette (⌘K / Ctrl+K).
 */

import type { Metadata } from 'next';
import './globals.css';
import CommandPalette from '@/components/CommandPalette';

/**
 * Global application metadata configuration for SEO and browser titles.
 */
export const metadata: Metadata = {
  title: 'DayNight Pilot — AI Career Operations Platform',
  description: 'An intelligent operating system that turns fragmented career, application, and work signals into actions, decisions, and measurable outcomes.',
};

/**
 * RootLayout Component
 * Wraps every route in the Next.js App Router tree.
 * 
 * @param children - Nested page content rendered inside the workspace.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      style={{ colorScheme: 'dark', backgroundColor: '#080c14' }}
    >
      <head>
        {/*
          Blocking Anti-FOUC Theme Script:
          Executes synchronously in <head> before HTML parsing or React hydration.
          Reads 'theme' from localStorage (defaulting to 'dark') and sets the
          'data-theme' attribute and document background immediately to eliminate
          any white flash during page refresh.
        */}
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
      <body
        style={{
          background: 'var(--bg-obsidian, #080c14)',
          color: 'var(--text-primary, #f8fafc)',
          overflowX: 'hidden'
        }}
      >
        {/* Global Keyboard Command Palette listener (⌘K / Ctrl+K) */}
        <CommandPalette />

        {/* Page route content */}
        {children}
      </body>
    </html>
  );
}
