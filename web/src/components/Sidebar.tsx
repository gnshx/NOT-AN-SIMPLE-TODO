'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, Columns2, LayoutDashboard, Lightbulb, ListTodo } from 'lucide-react';

const NAV = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', desc: 'Application overview' },
  { icon: ListTodo, label: 'To-do list', href: '/tasks', desc: 'Personal tasks' },
  { icon: CalendarDays, label: 'Day planner', href: '/planner', desc: 'Time-blocked day' },
  { icon: Columns2, label: 'Job board', href: '/pipeline', desc: 'Application pipeline' },
  { icon: Lightbulb, label: 'AI insights', href: '/hub', desc: 'Leads and safety' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <Link className="brand" href="/">
        <span className="brand-mark">D</span>
        <span><strong>DayNight</strong><small>Pilot</small></span>
      </Link>
      <nav aria-label="Main navigation">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return <Link key={item.href} className={`nav-item ${active ? 'is-active' : ''}`} href={item.href}>
            <item.icon size={18} aria-hidden="true" />
            <span><strong>{item.label}</strong><small>{item.desc}</small></span>
          </Link>;
        })}
      </nav>
      <div className="sidebar-footer"><span className="status-dot" /> Local workspace</div>
    </aside>
  );
}
