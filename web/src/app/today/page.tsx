'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import {
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Mail,
  Video,
  FileText
} from 'lucide-react';

interface TimeBlock {
  id: string;
  time: string;
  title: string;
  category: 'Interview Prep' | 'Application' | 'Follow-up' | 'Project';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  completed: boolean;
}

const INITIAL_SCHEDULE: TimeBlock[] = [
  {
    id: 'tb-1',
    time: '09:00 AM - 10:15 AM',
    title: 'Google Technical Interview Preparation (System Design & Concurrency)',
    category: 'Interview Prep',
    priority: 'HIGH',
    completed: true
  },
  {
    id: 'tb-2',
    time: '10:30 AM - 11:00 AM',
    title: 'Draft & Send Follow-up Email to Stripe Recruiter Sarah',
    category: 'Follow-up',
    priority: 'HIGH',
    completed: false
  },
  {
    id: 'tb-3',
    time: '11:15 AM - 01:00 PM',
    title: 'Submit Tailored Applications for Acme Corp & FinTech Stack',
    category: 'Application',
    priority: 'MEDIUM',
    completed: false
  },
  {
    id: 'tb-4',
    time: '02:30 PM - 04:30 PM',
    title: 'Complete Distributed Systems Portfolio Project Features',
    category: 'Project',
    priority: 'MEDIUM',
    completed: false
  }
];

export default function TodayPage() {
  const [schedule, setSchedule] = useState<TimeBlock[]>(INITIAL_SCHEDULE);
  const [isPlanning, setIsPlanning] = useState(false);

  const toggleTask = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handlePlanMyDay = () => {
    setIsPlanning(true);
    setTimeout(() => {
      setIsPlanning(false);
    }, 800);
  };

  const completedCount = schedule.filter((s) => s.completed).length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <Calendar size={14} />
          PERSONAL DAILY COMMAND CENTER
        </div>

        <div className="page-heading">
          <div>
            <h1>Good Morning 👋</h1>
            <p>Your intelligent time-blocked schedule and high-impact career priorities for today.</p>
          </div>
          <button className="primary-button" onClick={handlePlanMyDay} disabled={isPlanning}>
            <Zap size={16} style={{ animation: isPlanning ? 'spin 1s linear infinite' : 'none' }} />
            {isPlanning ? 'AI Planning Schedule...' : 'Plan My Day with AI'}
          </button>
        </div>

        {/* Priority Highlights Strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div className="glass-card" style={{ padding: '18px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
              <span>DAILY PROGRESS</span>
              <CheckCircle2 size={16} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
              {completedCount} / {schedule.length} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Tasks Done</span>
            </div>
            <div className="progress-bar" style={{ marginTop: '10px' }}>
              <div className="progress-fill" style={{ width: `${(completedCount / schedule.length) * 100}%`, background: 'var(--accent-emerald)' }} />
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
              <span>UPCOMING INTERVIEW</span>
              <Video size={16} style={{ color: 'var(--accent-cobalt)' }} />
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '6px' }}>
              Google Technical Round
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--accent-cobalt)', fontWeight: 600, marginTop: '4px' }}>
              Friday at 4:00 PM IST (In 2 days)
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>
              <span>AI PROPOSED ACTIONS</span>
              <Sparkles size={16} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '6px' }}>
              3 Actions <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Pending Review</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              1 status change • 1 draft • 1 prep task
            </div>
          </div>
        </div>

        {/* Time-blocked Schedule List */}
        <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)' }}>Today's Time-Blocked Schedule</h2>
            <span style={{ fontSize: '0.76rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
              OPTIMIZED BY AI PILOT
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {schedule.map((item) => (
              <motion.div
                key={item.id}
                layout
                onClick={() => toggleTask(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: item.completed ? 'rgba(255, 255, 255, 0.02)' : 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '6px',
                    border: item.completed ? 'none' : '2px solid var(--text-muted)',
                    background: item.completed ? 'var(--accent-emerald)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    flexShrink: 0
                  }}
                >
                  {item.completed && <CheckCircle2 size={16} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: 700,
                      color: item.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: item.completed ? 'line-through' : 'none'
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {item.time}
                    </span>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: 'rgba(59, 130, 246, 0.12)',
                        color: 'var(--accent-cobalt)',
                        fontWeight: 600
                      }}
                    >
                      {item.category}
                    </span>
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: item.priority === 'HIGH' ? 'rgba(239, 68, 68, 0.14)' : 'rgba(148, 163, 184, 0.14)',
                    color: item.priority === 'HIGH' ? '#f87171' : 'var(--text-muted)'
                  }}
                >
                  {item.priority}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
