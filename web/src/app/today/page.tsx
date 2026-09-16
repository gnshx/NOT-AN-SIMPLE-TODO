/**
 * @file today/page.tsx
 * @description Day/Night Execution Flight Deck for DayNight Pilot.
 * 
 * Capabilities:
 * - Chrono-sequenced Daily Schedule: organizes tasks into Day Outbound Sprints and Night Autonomous Sweeps.
 * - Integrated Focus Sprint Timer: 25-minute Pomodoro focus timer with play/pause/reset.
 * - Milestone Completion Velocity: calculates real-time progress and completion percentages.
 * - Phase and Category Filters: slice schedule by Day/Night phases or functional tags (Interview Prep, Follow-up, etc.).
 * - Direct Action Triggers: launches relevant workspaces (Flight Sim, Studio, Radar) directly from scheduled items.
 */

'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Calendar,
  Zap,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Video,
  FileText,
  Mail,
  Flame,
  ShieldCheck,
  Tag,
  Check
} from 'lucide-react';

/**
 * Data contract representing a single time-blocked execution slot.
 */
interface TimeBlock {
  id: string;
  time: string;
  title: string;
  category: 'Interview Prep' | 'Application' | 'Follow-up' | 'Deep Work' | 'Autonomous';
  priority: 'CRITICAL' | 'HIGH' | 'ROUTINE';
  completed: boolean;
  phase: 'DAY' | 'NIGHT';
  actionLabel?: string;
  actionUrl?: string;
  impactScore: number;
}

/**
 * Seed schedule demonstrating the dual-phase Day (Active Outbound) and Night (Autonomous Ingestion) lifecycle.
 */
const INITIAL_SCHEDULE: TimeBlock[] = [
  {
    id: 'tb-1',
    time: '09:00 AM - 10:15 AM',
    title: 'Google Technical Interview Simulator: Distributed Consensus & Raft',
    category: 'Interview Prep',
    priority: 'CRITICAL',
    completed: true,
    phase: 'DAY',
    actionLabel: 'Open Flight Sim',
    actionUrl: '/interviews',
    impactScore: 95
  },
  {
    id: 'tb-2',
    time: '10:30 AM - 11:15 AM',
    title: 'Dispatch High-Priority Follow-up to Stripe Staff Recruiter',
    category: 'Follow-up',
    priority: 'HIGH',
    completed: false,
    phase: 'DAY',
    actionLabel: 'Review AI Draft',
    actionUrl: '/ai-review',
    impactScore: 88
  },
  {
    id: 'tb-3',
    time: '11:30 AM - 01:00 PM',
    title: 'Tailor Variant #4 for Datadog Distributed Systems Engineer Position',
    category: 'Application',
    priority: 'HIGH',
    completed: false,
    phase: 'DAY',
    actionLabel: 'Launch Studio',
    actionUrl: '/resume',
    impactScore: 84
  },
  {
    id: 'tb-4',
    time: '02:30 PM - 04:30 PM',
    title: 'Deep Architecture Sprint: Raft Protocol Edge Simulation Engine',
    category: 'Deep Work',
    priority: 'HIGH',
    completed: false,
    phase: 'DAY',
    actionLabel: 'View Targets',
    actionUrl: '/pipeline',
    impactScore: 90
  },
  {
    id: 'tb-5',
    time: '09:00 PM - 10:30 PM',
    title: 'Night Sweep: Execute Autonomous Radar Scrape for Level 5 Backend Roles',
    category: 'Autonomous',
    priority: 'ROUTINE',
    completed: false,
    phase: 'NIGHT',
    actionLabel: 'Signal Radar',
    actionUrl: '/opportunities',
    impactScore: 78
  },
  {
    id: 'tb-6',
    time: '10:45 PM - 11:30 PM',
    title: 'Autonomous Ingestion & Defense Audit of Inbound Recruiter Messages',
    category: 'Autonomous',
    priority: 'ROUTINE',
    completed: false,
    phase: 'NIGHT',
    actionLabel: 'AI Firewall',
    actionUrl: '/ai-review',
    impactScore: 72
  }
];

/**
 * TodayExecutionDeck Component
 * Renders the personal command center for daily career execution and focus management.
 */
export default function TodayExecutionDeck() {
  const [schedule, setSchedule] = useState<TimeBlock[]>(INITIAL_SCHEDULE);
  const [activePhase, setActivePhase] = useState<'ALL' | 'DAY' | 'NIGHT'>('ALL');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isPlanning, setIsPlanning] = useState(false);

  // Focus Timer state (25m Pomodoro)
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  /**
   * Countdown interval driver for Pomodoro sprint timer.
   */
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, secondsLeft]);

  /**
   * Formats seconds into MM:SS display string.
   */
  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleTask = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAiOptimization = () => {
    setIsPlanning(true);
    setTimeout(() => {
      setIsPlanning(false);
    }, 750);
  };

  const filteredTasks = schedule.filter((t) => {
    const phaseMatch = activePhase === 'ALL' || t.phase === activePhase;
    const catMatch = activeCategory === 'ALL' || t.category === activeCategory;
    return phaseMatch && catMatch;
  });

  const completedCount = schedule.filter((s) => s.completed).length;
  const completionPercentage = Math.round((completedCount / schedule.length) * 100);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace" style={{ paddingBottom: '80px' }}>
        {/* Sub-Header / Flight Deck Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '10px 18px',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="sentinel-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                DAILY EXECUTION PROTOCOL
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
              ENERGY: PEAK FOCUS
            </span>
          </div>

          {/* Phase Filter Buttons */}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={() => setActivePhase('ALL')}
              className={`filter-pill ${activePhase === 'ALL' ? 'active' : ''}`}
            >
              Full Cycle
            </button>
            <button
              onClick={() => setActivePhase('DAY')}
              className={`filter-pill ${activePhase === 'DAY' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Sun size={12} style={{ color: '#fbbf24' }} /> Day Sprint
            </button>
            <button
              onClick={() => setActivePhase('NIGHT')}
              className={`filter-pill ${activePhase === 'NIGHT' ? 'active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: 4 }}
            >
              <Moon size={12} style={{ color: 'var(--accent-violet)' }} /> Night Radar
            </button>
          </div>
        </div>

        {/* Page Hero */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: 4 }}>
              CHRONO-SEQUENCED CADENCE // EXECUTION ENGINE
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              TODAY'S <span className="accent">TACTICAL SPRINT.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 640 }}>
              Time-blocked execution slots engineered to maximize interviewer conversion and high-yield outbound velocity.
            </p>
          </div>

          <button
            onClick={handleAiOptimization}
            className="btn-primary"
            style={{ padding: '9px 16px', fontSize: '0.82rem', gap: 8 }}
            disabled={isPlanning}
          >
            <Zap size={14} style={{ animation: isPlanning ? 'spin 0.8s linear infinite' : 'none' }} />
            {isPlanning ? 'Re-optimizing Cadence...' : 'Auto-Balance Schedule'}
          </button>
        </div>

        {/* 3-Column Tactical Top Dashboard */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
          {/* Daily Completion Velocity */}
          <div className="glass-card" style={{ padding: '20px', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                COMPLETION VELOCITY
              </span>
              <Flame size={15} style={{ color: 'var(--accent-amber)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <div className="stat-numeral" style={{ color: 'var(--text-primary)', fontSize: '2.2rem' }}>
                {completionPercentage}%
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ({completedCount}/{schedule.length} Milestones)
              </span>
            </div>
            {/* Progress Bar */}
            <div className="progress-bar" style={{ marginTop: 12 }}>
              <div
                className="progress-fill"
                style={{
                  width: `${completionPercentage}%`,
                  background: 'linear-gradient(90deg, var(--accent-cobalt), var(--accent-cyan))'
                }}
              />
            </div>
          </div>

          {/* Integrated Sprint Focus Timer */}
          <div
            className="glass-card"
            style={{
              padding: '20px',
              borderRadius: 12,
              background: 'radial-gradient(ellipse at top right, rgba(59,130,246,0.06) 0%, var(--bg-surface-1) 80%)',
              border: timerRunning ? '1px solid rgba(59,130,246,0.4)' : '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                FOCUS SPRINT TIMER
              </span>
              <Clock size={15} style={{ color: timerRunning ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="stat-numeral" style={{ color: timerRunning ? 'var(--accent-cyan)' : 'var(--text-primary)', fontSize: '2.2rem' }}>
                {formatTimer(secondsLeft)}
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  onClick={() => setTimerRunning(!timerRunning)}
                  className="btn-primary"
                  style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 4 }}
                >
                  {timerRunning ? <Pause size={12} /> : <Play size={12} />}
                  {timerRunning ? 'Pause' : 'Start'}
                </button>
                <button
                  onClick={() => {
                    setTimerRunning(false);
                    setSecondsLeft(25 * 60);
                  }}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                  title="Reset 25m"
                >
                  <RotateCcw size={12} />
                </button>
              </div>
            </div>
          </div>

          {/* AI Autonomous Queue Status */}
          <div className="glass-card" style={{ padding: '20px', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                NIGHT RADAR PIPELINE
              </span>
              <Sparkles size={15} style={{ color: 'var(--accent-violet)' }} />
            </div>
            <div className="stat-numeral" style={{ color: 'var(--accent-violet)', fontSize: '2.2rem' }}>
              Armed
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 4 }}>
              Next execution window starts at 21:00 (Scraping 4 sources).
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4 }}>
          {['ALL', 'Interview Prep', 'Follow-up', 'Application', 'Deep Work', 'Autonomous'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
              style={{ fontSize: '0.72rem', whiteSpace: 'nowrap' }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 'auto', alignSelf: 'center' }}>
            Showing {filteredTasks.length} Execution Blocks
          </span>
        </div>

        {/* Time-Blocked Interactive Task List */}
        <div className="glass-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '44px 170px 1fr 110px 140px',
              padding: '12px 18px',
              background: 'var(--bg-surface-2)',
              borderBottom: '1px solid var(--border-subtle)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.68rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.06em'
            }}
          >
            <span></span>
            <span>TIME WINDOW</span>
            <span>OPERATIONAL OBJECTIVE</span>
            <span>PRIORITY</span>
            <span style={{ textAlign: 'right' }}>ACTION TRIGGER</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filteredTasks.map((task, idx) => {
              const priorityColor =
                task.priority === 'CRITICAL' ? '#f87171' : task.priority === 'HIGH' ? '#fbbf24' : '#94a3b8';

              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '44px 170px 1fr 110px 140px',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: task.completed ? 'rgba(0,0,0,0.25)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                  className="table-row-hover"
                >
                  {/* Complete Checkbox */}
                  <div
                    onClick={() => toggleTask(task.id)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 6,
                      border: task.completed ? 'none' : '2px solid var(--text-muted)',
                      background: task.completed ? 'var(--accent-emerald)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: '#ffffff'
                    }}
                  >
                    {task.completed && <Check size={14} strokeWidth={3} />}
                  </div>

                  {/* Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {task.phase === 'DAY' ? <Sun size={13} style={{ color: '#fbbf24' }} /> : <Moon size={13} style={{ color: 'var(--accent-violet)' }} />}
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: task.completed ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
                      {task.time}
                    </span>
                  </div>

                  {/* Title and Category */}
                  <div style={{ minWidth: 0, paddingRight: 16 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                        color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        lineHeight: 1.4
                      }}
                    >
                      {task.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.64rem',
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: 'rgba(59,130,246,0.12)',
                          color: 'var(--accent-cobalt)',
                          fontWeight: 600
                        }}
                      >
                        {task.category}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                        Impact: {task.impactScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Priority Tag */}
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 4,
                        border: `1px solid ${priorityColor}44`,
                        background: `${priorityColor}15`,
                        color: priorityColor
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Direct Action Button */}
                  <div style={{ textAlign: 'right' }}>
                    {task.actionUrl && (
                      <Link
                        href={task.actionUrl}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem', display: 'inline-flex', gap: 4 }}
                      >
                        {task.actionLabel}
                        <ArrowRight size={11} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
