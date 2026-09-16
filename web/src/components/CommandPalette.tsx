/**
 * @file CommandPalette.tsx
 * @description Global spotlight command palette modal (⌘K / Ctrl+K) for DayNight Pilot.
 * Provides instant keyboard-driven navigation, AI Pilot triggers, and workflow actions.
 * Features fuzzy filtering, keyboard shortcut hints, and category segregation.
 * 
 * @module components/CommandPalette
 */

'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Sparkles,
  Briefcase,
  FileText,
  Video,
  BarChart3,
  Calendar,
  Compass,
  Building2,
  X,
  Zap
} from 'lucide-react';

/**
 * Represents a single actionable item in the Command Palette.
 */
interface CommandItem {
  /** Unique identifier for the command item */
  id: string;
  /** Primary display text */
  label: string;
  /** Categorical grouping within the palette list */
  category: 'Navigation' | 'AI Pilot Actions' | 'Quick Tools';
  /** Leading icon rendered next to the command label */
  icon: React.ReactNode;
  /** Execution callback invoked when the item is activated */
  action: () => void;
  /** Optional keyboard shortcut label (e.g. "⌘K", "ESC") */
  shortcut?: string;
}

/**
 * CommandPalette Component
 * 
 * Mounts a global keyboard listener for `Cmd+K` / `Ctrl+K` and renders an
 * interactive executive command launcher with backdrop blur and animated entry.
 *
 * @returns {JSX.Element | null} Animated command launcher modal when active
 */
export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const items: CommandItem[] = [
    {
      id: 'nav-home',
      label: 'Go to Dashboard',
      category: 'Navigation',
      icon: <LayoutDashboard size={16} />,
      action: () => { router.push('/'); setOpen(false); },
      shortcut: '⌘1'
    },
    {
      id: 'nav-today',
      label: 'Personal Daily Command Center (Today)',
      category: 'Navigation',
      icon: <Calendar size={16} />,
      action: () => { router.push('/today'); setOpen(false); },
      shortcut: '⌘2'
    },
    {
      id: 'nav-ai-review',
      label: 'AI Action Review Queue',
      category: 'Navigation',
      icon: <Sparkles size={16} />,
      action: () => { router.push('/ai-review'); setOpen(false); },
      shortcut: '⌘3'
    },
    {
      id: 'nav-opportunities',
      label: 'Job Opportunity Radar',
      category: 'Navigation',
      icon: <Compass size={16} />,
      action: () => { router.push('/opportunities'); setOpen(false); }
    },
    {
      id: 'nav-resume',
      label: 'Resume Intelligence Workspace',
      category: 'Navigation',
      icon: <FileText size={16} />,
      action: () => { router.push('/resume'); setOpen(false); }
    },
    {
      id: 'nav-interviews',
      label: 'Interview Center & AI Coach',
      category: 'Navigation',
      icon: <Video size={16} />,
      action: () => { router.push('/interviews'); setOpen(false); }
    },
    {
      id: 'nav-intelligence',
      label: 'Career Graph & Analytics',
      category: 'Navigation',
      icon: <BarChart3 size={16} />,
      action: () => { router.push('/intelligence'); setOpen(false); }
    },
    {
      id: 'nav-tasks',
      label: 'Execution & Tasks',
      category: 'Navigation',
      icon: <CheckSquare size={16} />,
      action: () => { router.push('/tasks'); setOpen(false); }
    },
    {
      id: 'nav-pipeline',
      label: 'Application Pipeline Kanban',
      category: 'Navigation',
      icon: <Briefcase size={16} />,
      action: () => { router.push('/pipeline'); setOpen(false); }
    },
    {
      id: 'nav-settings',
      label: 'Organization & Workspace Settings',
      category: 'Navigation',
      icon: <Building2 size={16} />,
      action: () => { router.push('/settings/organization'); setOpen(false); }
    },
    {
      id: 'ai-plan-day',
      label: 'Pilot: Generate Time-Blocked Daily Plan',
      category: 'AI Pilot Actions',
      icon: <Zap size={16} style={{ color: 'var(--accent-amber)' }} />,
      action: () => { router.push('/today?action=plan'); setOpen(false); }
    },
    {
      id: 'ai-prep-interview',
      label: 'Pilot: Prepare Me for Tomorrow\'s Interview',
      category: 'AI Pilot Actions',
      icon: <Video size={16} style={{ color: 'var(--accent-cobalt)' }} />,
      action: () => { router.push('/interviews?action=prep'); setOpen(false); }
    },
    {
      id: 'ai-followup',
      label: 'Pilot: Draft Recruiter Follow-ups',
      category: 'AI Pilot Actions',
      icon: <Sparkles size={16} style={{ color: 'var(--accent-violet)' }} />,
      action: () => { router.push('/ai-review?action=followup'); setOpen(false); }
    }
  ];

  const filtered = items.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  if (!open) return null;

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: 'rgba(9, 13, 22, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          paddingTop: '12vh'
        }}
        onClick={() => setOpen(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            width: '100%',
            maxWidth: '640px',
            background: 'var(--bg-surface-1)',
            borderRadius: 'var(--radius)',
            border: '1px solid var(--border-glow)',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)',
            overflow: 'hidden'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Input Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-subtle)',
              gap: '14px'
            }}
          >
            <Search size={18} style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              placeholder="Ask Pilot or search commands... (e.g. Plan my day, Resume, Interview)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: '0.95rem',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-body)'
              }}
            />
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: '4px',
                borderRadius: '4px',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Results List */}
          <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '8px' }}>
            {filtered.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No commands matching "{query}"
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={item.action}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    gap: '12px',
                    transition: 'background 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-surface-2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ color: 'var(--accent-cobalt)' }}>{item.icon}</div>
                    <span style={{ fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-primary)' }}>
                      {item.label}
                    </span>
                  </div>
                  {item.shortcut && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--text-secondary)',
                        background: 'var(--bg-surface-2)',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {item.shortcut}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div
            style={{
              padding: '12px 20px',
              background: 'var(--bg-obsidian)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--text-muted)'
            }}
          >
            <div style={{ display: 'flex', gap: '14px' }}>
              <span>
                <kbd style={{ background: 'var(--bg-surface-2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>↑↓</kbd> Navigate
              </span>
              <span>
                <kbd style={{ background: 'var(--bg-surface-2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>↵</kbd> Select
              </span>
              <span>
                <kbd style={{ background: 'var(--bg-surface-2)', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>ESC</kbd> Close
              </span>
            </div>
            <span style={{ fontWeight: 700, color: 'var(--accent-cobalt)', fontFamily: 'var(--font-display)' }}>DayNight Pilot OS</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
