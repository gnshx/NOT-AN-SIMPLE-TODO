'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Info,
  SlidersHorizontal,
  ArrowRight,
  Clock
} from 'lucide-react';

interface AiActionItem {
  id: string;
  title: string;
  targetEntity: string;
  toolName: string;
  confidence: number;
  reason: string;
  evidence: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

const INITIAL_ACTIONS: AiActionItem[] = [
  {
    id: 'act-101',
    title: 'Move Google Application → Interview Scheduled',
    targetEntity: 'Google — Software Engineer',
    toolName: 'updateApplicationStatus',
    confidence: 96,
    reason: 'Email classified as INTERVIEW_INVITATION from verified google.com domain.',
    evidence: [
      'Sender: recruiting@google.com',
      'Subject matches interview invitation pattern',
      'Contains interview date: Friday 4:00 PM IST',
      'Meeting link detected: meet.google.com/abc-xyz'
    ],
    riskLevel: 'MEDIUM',
    status: 'PENDING',
    timestamp: '10 mins ago'
  },
  {
    id: 'act-102',
    title: 'Draft Recruiter Follow-up Email for Stripe',
    targetEntity: 'Stripe — Backend Engineer',
    toolName: 'proposeEmailReply',
    confidence: 88,
    reason: 'Application submitted 12 days ago with no response. Optimal follow-up window reached.',
    evidence: [
      'Last communication: May 05 (Application confirmation)',
      'Recruiter: Sarah Jenkins',
      'Recommended template: Polite status inquiry'
    ],
    riskLevel: 'HIGH',
    status: 'PENDING',
    timestamp: '45 mins ago'
  },
  {
    id: 'act-103',
    title: 'Schedule 2x Time Blocks for System Design Prep',
    targetEntity: 'Personal Daily Planner',
    toolName: 'scheduleInterviewPrep',
    confidence: 94,
    reason: '2 upcoming technical interviews have System Design listed in expected topics.',
    evidence: [
      'Google interview: Friday',
      'Acme Corp interview: Next Monday',
      'Available time block identified: Today 6:30 PM - 8:00 PM'
    ],
    riskLevel: 'LOW',
    status: 'PENDING',
    timestamp: '2 hours ago'
  }
];

export default function AiReviewPage() {
  const [actions, setActions] = useState<AiActionItem[]>(INITIAL_ACTIONS);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  const handleAction = (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    setActions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const handleApproveAllSafe = () => {
    setActions((prev) =>
      prev.map((item) => (item.confidence >= 90 && item.riskLevel !== 'HIGH' ? { ...item, status: 'APPROVED' } : item))
    );
  };

  const filtered = actions.filter((a) => (filter === 'ALL' ? true : a.status === filter));
  const pendingCount = actions.filter((a) => a.status === 'PENDING').length;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        {/* Top Header */}
        <div className="page-kicker">
          <Sparkles size={14} />
          HUMAN-IN-THE-LOOP GOVERNANCE
        </div>

        <div className="page-heading">
          <div>
            <h1>AI Action Review Center</h1>
            <p>Inspect, verify, and approve proposed AI operations before execution.</p>
          </div>
          {pendingCount > 0 && (
            <button className="primary-button" onClick={handleApproveAllSafe}>
              <ShieldCheck size={16} />
              Approve All Safe ({pendingCount})
            </button>
          )}
        </div>

        {/* Info Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 18px',
            borderRadius: '10px',
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            color: '#93c5fd',
            fontSize: '0.82rem',
            marginBottom: '24px'
          }}
        >
          <Info size={18} style={{ flexShrink: 0, color: 'var(--accent-cyan)' }} />
          <div>
            <strong>OWASP ASVS Governance Active:</strong> High-risk side effects (e.g. sending emails, status alterations) require explicit human confirmation. Low-risk operations execute automatically.
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              className={`filter-pill ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f} ({actions.filter((a) => (f === 'ALL' ? true : a.status === f)).length})
            </button>
          ))}
        </div>

        {/* Action Cards */}
        <div style={{ display: 'grid', gap: '16px' }}>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="glass-card" style={{ padding: '40px', textAlign: 'center', borderRadius: '14px' }}>
                <CheckCircle2 size={36} style={{ color: 'var(--accent-emerald)', margin: '0 auto 12px' }} />
                <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>No pending AI actions requiring review</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Pilot has cleared all pending approvals.</p>
              </div>
            ) : (
              filtered.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="glass-card"
                  style={{ padding: '20px', borderRadius: '14px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: item.confidence >= 90 ? 'rgba(16, 185, 129, 0.14)' : 'rgba(245, 158, 11, 0.14)',
                            color: item.confidence >= 90 ? '#34d399' : '#fbbf24',
                            border: `1px solid ${item.confidence >= 90 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
                          }}
                        >
                          {item.confidence}% Confidence
                        </span>

                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            background: item.riskLevel === 'HIGH' ? 'rgba(239, 68, 68, 0.14)' : item.riskLevel === 'MEDIUM' ? 'rgba(245, 158, 11, 0.14)' : 'rgba(16, 185, 129, 0.14)',
                            color: item.riskLevel === 'HIGH' ? '#f87171' : item.riskLevel === 'MEDIUM' ? '#fbbf24' : '#34d399'
                          }}
                        >
                          {item.riskLevel} RISK
                        </span>

                        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {item.timestamp}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{item.title}</h3>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        Target: <strong style={{ color: 'var(--text-primary)' }}>{item.targetEntity}</strong> • Tool: <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>{item.toolName}</code>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {item.status === 'PENDING' ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleAction(item.id, 'REJECTED')}
                          className="btn-ghost"
                          style={{ border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', background: 'rgba(239, 68, 68, 0.1)' }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button
                          onClick={() => handleAction(item.id, 'APPROVED')}
                          className="primary-button"
                        >
                          <CheckCircle2 size={14} /> Approve Action
                        </button>
                      </div>
                    ) : (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: '6px',
                          background: item.status === 'APPROVED' ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.14)',
                          color: item.status === 'APPROVED' ? '#34d399' : '#f87171'
                        }}
                      >
                        {item.status}
                      </span>
                    )}
                  </div>

                  {/* Rationale & Evidence */}
                  <div style={{ padding: '14px 16px', background: 'var(--bg-surface-2)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: '8px' }}>
                      Rationale: {item.reason}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: '6px' }}>
                      Evidence & Signal Trace:
                    </div>
                    <ul style={{ paddingLeft: '18px', margin: 0 }}>
                      {item.evidence.map((ev, idx) => (
                        <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          {ev}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
