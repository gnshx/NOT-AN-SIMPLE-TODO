'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MockInterviewModal from '@/components/MockInterviewModal';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Video,
  Calendar,
  Clock,
  User,
  Sparkles,
  Play,
  FileText,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Zap,
  Target,
  Award,
  Layers,
  ShieldCheck,
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';

interface InterviewItem {
  id: string;
  company: string;
  role: string;
  stage: string;
  scheduledAt: string;
  interviewer: string;
  prepSheet: string[];
  status: 'SCHEDULED' | 'COMPLETED';
  likelyTopics: string[];
  simulationType: 'SYSTEM_DESIGN' | 'CODING_CONCURRENCY' | 'BEHAVIORAL_STAR' | 'EXECUTIVE';
  readinessScore: number;
}

const MOCK_INTERVIEWS: InterviewItem[] = [
  {
    id: 'int-1',
    company: 'Google',
    role: 'Staff Systems Engineer (Distributed Infra)',
    stage: 'Technical Round 2 (Systems & Concurrency)',
    scheduledAt: 'Friday • 4:00 PM IST',
    interviewer: 'Alex Rivera (Staff Principal Engineer)',
    prepSheet: [
      'Focus areas: Raft consensus, distributed log replication, edge partition recovery.',
      'Google engineering note: Spanner multi-region consistency model & TrueTime semantics.',
      'STAR pattern: Managing catastrophic regional network partition without data loss.'
    ],
    status: 'SCHEDULED',
    likelyTopics: ['Raft Consensus', 'Lock-Free Queues', 'Zero-Allocation Buffers', 'TrueTime SLA'],
    simulationType: 'SYSTEM_DESIGN',
    readinessScore: 94
  },
  {
    id: 'int-2',
    company: 'Stripe',
    role: 'Senior Backend Engineer (Payments)',
    stage: 'Architecture & Scalability Screen',
    scheduledAt: 'Sept 22 • 6:30 PM IST',
    interviewer: 'Sarah Jenkins (Engineering Director)',
    prepSheet: [
      'Focus areas: Idempotency keys, dual-write ledger reconciliation, webhook backpressure.',
      'Key trade-off: Exactly-once delivery semantics vs at-least-once with idempotent consumer.',
      'Stripe culture: Pragmatic API design, radical backward compatibility.'
    ],
    status: 'SCHEDULED',
    likelyTopics: ['Idempotency Design', 'PostgreSQL B-Tree Contention', 'Ledger Integrity'],
    simulationType: 'CODING_CONCURRENCY',
    readinessScore: 91
  },
  {
    id: 'int-3',
    company: 'Anthropic',
    role: 'Full Stack Infrastructure Specialist',
    stage: 'Executive & Cultural Alignment',
    scheduledAt: 'Sept 26 • 8:00 PM IST',
    interviewer: 'Elena Rostova (Head of Infrastructure)',
    prepSheet: [
      'Focus areas: Scalable evaluation harness design, security sandboxing of untrusted LLM tools.',
      'Core values: Constitutional AI, alignment verification, rigorous self-correction mechanisms.'
    ],
    status: 'SCHEDULED',
    likelyTopics: ['Tool Sandboxing', 'Human-in-the-Loop Safeguards', 'Model Evaluation'],
    simulationType: 'BEHAVIORAL_STAR',
    readinessScore: 88
  }
];

export default function FlightSimulatorPage() {
  const [interviews] = useState<InterviewItem[]>(MOCK_INTERVIEWS);
  const [selectedInterview, setSelectedInterview] = useState<InterviewItem>(MOCK_INTERVIEWS[0]);
  const [showMockModal, setShowMockModal] = useState(false);
  const [simFilter, setSimFilter] = useState<string>('ALL');

  const filteredInterviews = interviews.filter((item) => {
    if (simFilter === 'ALL') return true;
    return item.simulationType === simFilter;
  });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace" style={{ paddingBottom: '80px' }}>
        {/* Sub-Header / Flight Deck Telemetry */}
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
              <span className="sentinel-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-violet)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                FLIGHT SIMULATOR // INTERVIEW WAR ROOM
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
              AI COACH: ARMED & READY
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => setShowMockModal(true)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.75rem', gap: 6 }}
            >
              <Play size={13} /> Launch Live Sim
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: 4 }}>
              TECHNICAL ORDEAL PRE-CALIBRATION
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              INTERVIEW <span className="accent">FLIGHT SIMULATOR.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 640 }}>
              High-fidelity mock interrogations, real-time rubric grading, and leaked Glassdoor question pattern defenses.
            </p>
          </div>

          {/* Module Filter Chips */}
          <div style={{ display: 'flex', gap: 6 }}>
            {['ALL', 'SYSTEM_DESIGN', 'CODING_CONCURRENCY', 'BEHAVIORAL_STAR'].map((f) => (
              <button
                key={f}
                onClick={() => setSimFilter(f)}
                className={`filter-pill ${simFilter === f ? 'active' : ''}`}
                style={{ fontSize: '0.72rem' }}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Responsive Workspace: Scheduled Sessions (Left) and War Room Briefing (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
          {/* Left Column: Scheduled List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              // SCHEDULED ORDEALS ({filteredInterviews.length})
            </div>

            {filteredInterviews.map((int) => {
              const isSelected = selectedInterview.id === int.id;
              return (
                <motion.div
                  key={int.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedInterview(int)}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 12,
                    background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface-1)',
                    border: isSelected ? '1px solid var(--accent-cobalt)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  className="table-row-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-primary)' }}>
                      {int.company}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(52, 211, 153, 0.12)',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        color: '#34d399'
                      }}
                    >
                      {int.readinessScore}% READY
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    {int.stage}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    <Clock size={12} />
                    <span>{int.scheduledAt}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Strategic War Room Briefing */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: 16 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cobalt)', letterSpacing: '0.06em' }}>
                  ACTIVE TARGET BRIEFING
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                  {selectedInterview.company} — {selectedInterview.role}
                </h2>
                <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                  Interviewer: <strong>{selectedInterview.interviewer}</strong>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="stat-numeral" style={{ color: 'var(--accent-cyan)', fontSize: '2.4rem' }}>
                  {selectedInterview.readinessScore}%
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  SIMULATOR READINESS
                </div>
              </div>
            </div>

            {/* Rubric Evaluation Vectors */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                // EVALUATION RUBRIC METRICS
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {[
                  { label: 'Technical Depth', val: 95, color: 'var(--accent-cyan)' },
                  { label: 'System Architecture', val: 92, color: 'var(--accent-cobalt)' },
                  { label: 'Trade-off Articulation', val: 94, color: 'var(--accent-emerald)' },
                  { label: 'STAR Communication', val: 90, color: 'var(--accent-violet)' },
                ].map((r) => (
                  <div key={r.label} className="glass-card" style={{ padding: '12px 14px', borderRadius: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', marginBottom: 4 }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                      <strong style={{ fontFamily: 'var(--font-mono)', color: r.color }}>{r.val}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${r.val}%`, background: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Preparation Briefing */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <BookOpen size={16} style={{ color: 'var(--accent-cyan)' }} />
                <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.92rem' }}>
                  Pre-Flight Dossier & Known Patterns
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {selectedInterview.prepSheet.map((ps, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      background: 'var(--bg-surface-2)',
                      borderRadius: 10,
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.84rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.55
                    }}
                  >
                    ▸ {ps}
                  </div>
                ))}
              </div>
            </div>

            {/* Expected Topics Chips */}
            <div style={{ marginBottom: 26 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 8 }}>
                ANTICIPATED INTERROGATION TOPICS
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {selectedInterview.likelyTopics.map((top) => (
                  <span
                    key={top}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: 6,
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      color: '#93c5fd'
                    }}
                  >
                    {top}
                  </span>
                ))}
              </div>
            </div>

            {/* Primary War Room Action Button */}
            <button
              onClick={() => setShowMockModal(true)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.88rem', gap: 8 }}
            >
              <Zap size={16} /> Enter Live AI Mock Simulation ({selectedInterview.company})
            </button>
          </div>
        </div>

        {/* Modal Mount */}
        {showMockModal && (
          <MockInterviewModal
            companyName={selectedInterview.company}
            role={selectedInterview.role}
            onClose={() => setShowMockModal(false)}
          />
        )}
      </main>
    </div>
  );
}
