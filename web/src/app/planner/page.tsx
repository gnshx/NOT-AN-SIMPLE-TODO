'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Plus,
  Zap,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface HourlySlot {
  time: string;
  taskTitle?: string;
  category?: string;
  priority?: 'HIGH' | 'MEDIUM' | 'LOW';
  completed?: boolean;
}

const INITIAL_TIMELINE: HourlySlot[] = [
  { time: '08:00 AM', taskTitle: 'Morning Inbox Scan & Gmail AI Classification', category: 'Email', priority: 'LOW', completed: true },
  { time: '09:00 AM', taskTitle: 'Google Concurrency & System Design STAR Prep', category: 'Interview Prep', priority: 'HIGH', completed: true },
  { time: '10:00 AM', taskTitle: 'Draft & Send Follow-up to Stripe Recruiter Sarah', category: 'Communication', priority: 'HIGH', completed: false },
  { time: '11:00 AM', taskTitle: 'Submit Tailored Resume for Acme Corp Full Stack Role', category: 'Application', priority: 'MEDIUM', completed: false },
  { time: '12:00 PM' },
  { time: '01:00 PM', taskTitle: 'Distributed Systems Portfolio Feature Engineering', category: 'Project', priority: 'MEDIUM', completed: false },
  { time: '02:00 PM' },
  { time: '03:00 PM', taskTitle: 'Review Glassdoor Technical Question Sheets', category: 'Research', priority: 'LOW', completed: false },
  { time: '04:00 PM' },
  { time: '05:00 PM', taskTitle: 'Daily Career Velocity & Analytics Sync', category: 'Analytics', priority: 'LOW', completed: false }
];

export default function PlannerPage() {
  const [slots, setSlots] = useState<HourlySlot[]>(INITIAL_TIMELINE);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <Calendar size={14} />
          TIME-BLOCKED DAILY PLANNER
        </div>

        <div className="page-heading">
          <div>
            <h1>Daily Time-Block Schedule</h1>
            <p>Hourly breakdown of priority blocks, study windows, and career actions.</p>
          </div>
          <button className="primary-button">
            <Zap size={16} /> Auto-Optimize Schedule
          </button>
        </div>

        {/* Timeline Container */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '12px' }}>
          <div style={{ display: 'grid', gap: '8px' }}>
            {slots.map((slot, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  gap: '16px',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '8px',
                  background: slot.taskTitle ? 'var(--bg-surface-2)' : 'transparent',
                  border: slot.taskTitle ? '1px solid var(--border-subtle)' : '1px dashed rgba(255,255,255,0.05)'
                }}
              >
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--accent-cobalt)', fontWeight: 700 }}>
                  {slot.time}
                </div>

                {slot.taskTitle ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <strong style={{ fontSize: '0.88rem', color: 'var(--text-primary)', textDecoration: slot.completed ? 'line-through' : 'none' }}>
                        {slot.taskTitle}
                      </strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Category: {slot.category}
                      </div>
                    </div>

                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: slot.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: slot.priority === 'HIGH' ? '#fca5a5' : '#93c5fd'
                      }}
                    >
                      {slot.priority}
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Available Time Window
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
