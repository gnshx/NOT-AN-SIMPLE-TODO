'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Briefcase,
  Compass,
  FileText,
  Video,
  BarChart3,
  CheckSquare,
  Building2,
  ChevronDown,
  Command,
  ShieldCheck,
  Zap,
  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [workspace, setWorkspace] = useState('Personal Workspace');
  const [wsOpen, setWsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Synchronize React state with DOM attribute already set by layout anti-FOUC script
  useEffect(() => {
    const active = (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 
                   (localStorage.getItem('theme') as 'light' | 'dark') || 
                   'dark';
    setTheme(active);
    document.documentElement.setAttribute('data-theme', active);
    document.documentElement.style.colorScheme = active;
    document.documentElement.style.backgroundColor = active === 'light' ? '#f8fafc' : '#080c14';
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
      localStorage.setItem('theme', nextTheme);
    } catch {}
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.style.colorScheme = nextTheme;
    document.documentElement.style.backgroundColor = nextTheme === 'light' ? '#f8fafc' : '#080c14';
  };

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const workspaces = [
    'Personal Workspace',
    'University Career Center',
    'Recruiting Team Cohort',
    'Engineering Bootcamp'
  ];

  const mainNav = [
    { href: '/', label: 'Mission Control', icon: LayoutDashboard, tag: null },
    { href: '/today', label: 'Today Execution', icon: Calendar, tag: 'Focus' },
    { href: '/ai-review', label: 'AI Review Queue', icon: Sparkles, tag: '3 Pending' },
    { href: '/pipeline', label: 'Career Pipeline', icon: Briefcase, tag: 'Active' },
    { href: '/opportunities', label: 'Signal Radar', icon: Compass, tag: 'Trust' },
    { href: '/resume', label: 'Resume Studio', icon: FileText, tag: 'ATS 94%' },
    { href: '/interviews', label: 'Flight Simulator', icon: Video, tag: 'Coach' },
    { href: '/intelligence', label: 'Career Graph', icon: BarChart3, tag: 'Analytics' },
    { href: '/settings/organization', label: 'RBAC & Security', icon: Building2, tag: 'Admin' }
  ];

  return (
    <>
      {/* Mobile Header Bar */}
      <header className="mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="brand-mark" style={{ width: 32, height: 32 }}>
            <Zap size={16} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '0.95rem' }}>
            DayNight Pilot
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme Mode"
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            {theme === 'light' ? <Sun size={15} style={{ color: 'var(--accent-amber)' }} /> : <Moon size={15} style={{ color: 'var(--accent-cobalt)' }} />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Navigation Drawer"
            style={{
              padding: '6px',
              borderRadius: '6px',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Backdrop Overlay */}
      <div
        className={`mobile-overlay ${mobileOpen ? 'is-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar Drawer Container */}
      <aside className={`sidebar ${mobileOpen ? 'is-open' : ''}`}>
        {/* Brand & Workspace Switcher */}
        <div style={{ marginBottom: '16px' }}>
          <div className="brand" style={{ paddingBottom: '12px' }}>
            <div className="brand-mark">
              <Zap size={20} />
            </div>
            <div>
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800 }}>DayNight Pilot</strong>
              <small style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>Career Execution OS</small>
            </div>
          </div>

          {/* Theme Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme Mode"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-surface-2)',
              color: 'var(--text-primary)',
              fontSize: '0.76rem',
              fontWeight: 700,
              width: '100%',
              marginBottom: '10px',
              transition: 'all 0.15s ease'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {theme === 'light' ? (
                <Sun size={15} style={{ color: 'var(--accent-amber)' }} />
              ) : (
                <Moon size={15} style={{ color: 'var(--accent-cobalt)' }} />
              )}
              <span>{theme === 'light' ? 'White / Light Mode' : 'Obsidian Dark Mode'}</span>
            </span>
            <span
              style={{
                fontSize: '0.64rem',
                fontFamily: 'var(--font-mono)',
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'var(--bg-surface-1)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              TOGGLE
            </span>
          </button>

          {/* Workspace selector dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setWsOpen(!wsOpen)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-surface-2)',
                fontSize: '0.74rem',
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {workspace}
              </span>
              <ChevronDown size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </button>

            {wsOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-dim)',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)',
                  zIndex: 100,
                  padding: '4px'
                }}
              >
                {workspaces.map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      setWorkspace(w);
                      setWsOpen(false);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '7px 10px',
                      borderRadius: '5px',
                      fontSize: '0.72rem',
                      fontWeight: workspace === w ? 700 : 500,
                      color: workspace === w ? 'var(--accent-cobalt)' : 'var(--text-secondary)',
                      background: workspace === w ? 'rgba(59, 130, 246, 0.12)' : 'transparent'
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Command Palette Trigger */}
        <button
          onClick={() => {
            const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true });
            window.dispatchEvent(event);
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-glow)',
            background: 'rgba(37, 99, 235, 0.08)',
            color: 'var(--accent-cobalt)',
            fontSize: '0.74rem',
            fontWeight: 700,
            marginBottom: '16px'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Command size={13} />
            Search / Ask Pilot
          </span>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              background: 'var(--bg-surface-2)',
              padding: '1px 5px',
              borderRadius: '4px',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            ⌘K
          </span>
        </button>

        {/* Navigation items */}
        <nav style={{ flex: 1 }}>
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${isActive ? 'is-active' : ''}`}
              >
                <Icon size={16} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ fontSize: '0.82rem', fontWeight: 600 }}>{item.label}</strong>
                </div>
                {item.tag && (
                  <span
                    style={{
                      fontSize: '0.62rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '2px 6px',
                      borderRadius: '999px',
                      background: isActive ? 'var(--accent-cobalt)' : 'var(--bg-surface-2)',
                      color: isActive ? '#ffffff' : 'var(--text-muted)',
                      fontWeight: 600
                    }}
                  >
                    {item.tag}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="status-dot" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>OWASP ASVS Ready</span>
            <span style={{ display: 'block', fontSize: '0.66rem', color: 'var(--text-muted)' }}>
              Multi-Tenant Security
            </span>
          </div>
          <ShieldCheck size={14} style={{ color: 'var(--accent-emerald)' }} />
        </div>
      </aside>
    </>
  );
}
