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
  X
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const [workspace, setWorkspace] = useState('Personal Workspace');
  const [wsOpen, setWsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    { href: '/', label: 'Home', icon: LayoutDashboard, tag: null },
    { href: '/today', label: 'Today', icon: Calendar, tag: 'Execution' },
    { href: '/ai-review', label: 'AI Review Queue', icon: Sparkles, tag: '3 Pending' },
    { href: '/pipeline', label: 'Career Pipeline', icon: Briefcase, tag: 'Pipeline' },
    { href: '/opportunities', label: 'Opportunities', icon: Compass, tag: 'Radar' },
    { href: '/resume', label: 'Resume Workspace', icon: FileText, tag: 'ATS' },
    { href: '/interviews', label: 'Interview Center', icon: Video, tag: 'Coach' },
    { href: '/intelligence', label: 'Career Graph', icon: BarChart3, tag: 'Analytics' },
    { href: '/tasks', label: 'Tasks', icon: CheckSquare, tag: null },
    { href: '/settings/organization', label: 'Organization & RBAC', icon: Building2, tag: 'Enterprise' }
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

          {/* Workspace selector dropdown */}
          <div style={{ position: 'relative', marginTop: '6px' }}>
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
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
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
                      background: workspace === w ? 'rgba(59, 130, 246, 0.15)' : 'transparent'
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
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#93c5fd',
            fontSize: '0.74rem',
            fontWeight: 600,
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
