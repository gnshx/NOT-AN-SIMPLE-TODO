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
  ShieldAlert,
  ChevronRight,
  Info,
  SlidersHorizontal,
  ArrowRight,
  Clock,
  Terminal,
  FileCode,
  Lock,
  Zap,
  Check
} from 'lucide-react';

interface AiActionItem {
  id: string;
  title: string;
  targetEntity: string;
  toolName: string;
  confidence: number;
  reason: string;
  evidence: string[];
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
  diff?: { field: string; oldVal: string; newVal: string };
  auditHash: string;
}

const INITIAL_ACTIONS: AiActionItem[] = [
  {
    id: 'act-101',
    title: 'Promote Google Target → Interview Scheduled Stage',
    targetEntity: 'Google — Staff Systems Engineer',
    toolName: 'updateApplicationStatus',
    confidence: 98,
    reason: 'Inbound email from recruiter with authenticated SPF/DKIM on @google.com domain containing calendar invite.',
    evidence: [
      'Sender cryptographic signature verified: recruiting@google.com',
      'Google Meet URL detected with valid meeting code',
      'Extracted interview slot: Friday 4:00 PM IST (Confirmed in calendar)',
      'STAR prep sheet auto-generated from job description'
    ],
    riskLevel: 'MEDIUM',
    status: 'PENDING',
    timestamp: '8 mins ago',
    diff: { field: 'status', oldVal: 'APPLIED', newVal: 'INTERVIEW_SCHEDULED' },
    auditHash: '0x8f19...d4b2'
  },
  {
    id: 'act-102',
    title: 'Dispatch High-Conversion Follow-up Email to Stripe Staff Recruiter',
    targetEntity: 'Stripe — Senior Backend Engineer',
    toolName: 'proposeEmailReply',
    confidence: 91,
    reason: 'Application submitted 11 days ago. Machine learning model predicts optimal response lift when following up between day 10–14.',
    evidence: [
      'Recipient: Sarah Jenkins (Lead Tech Recruiter @ Stripe)',
      'Subject: "Following up: Senior Backend Engineer application (Distributed Systems background)"',
      'Keyword match: 94% alignment with Stripe ledger infrastructure requirements'
    ],
    riskLevel: 'HIGH',
    status: 'PENDING',
    timestamp: '24 mins ago',
    diff: { field: 'outbound_email', oldVal: 'NONE_PENDING', newVal: 'DISPATCH_QUEUED_TO_SARAH_JENKINS' },
    auditHash: '0x3c92...11ea'
  },
  {
    id: 'act-103',
    title: 'Block 2x Focus Sprints for Google Raft & Distributed Consensus Prep',
    targetEntity: 'Personal Daily Execution Engine',
    toolName: 'scheduleInterviewPrep',
    confidence: 96,
    reason: 'Upcoming technical interview with Google identifies consensus protocols as primary assessment vector.',
    evidence: [
      'Detected stage: Systems Design & Concurrency',
      'Available energy slot in calendar: Today 18:30 - 20:00',
      'Study brief generated from Google Spanner whitepaper'
    ],
    riskLevel: 'LOW',
    status: 'PENDING',
    timestamp: '1 hour ago',
    diff: { field: 'calendar_sprint', oldVal: 'IDLE', newVal: 'FOCUS_BLOCK_SYSTEM_DESIGN' },
    auditHash: '0x7e44...a90f'
  }
];

export default function AiGovernanceFirewallPage() {
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

      <main className="workspace" style={{ paddingBottom: '80px' }}>
        {/* Status Header Bar */}
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
              <span className="sentinel-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                AI ACTION FIREWALL // HUMAN-IN-THE-LOOP
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-cyan)' }}>
              GOVERNANCE: OWASP ASVS STRICT
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {pendingCount > 0 && (
              <button onClick={handleApproveAllSafe} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.75rem', gap: 6 }}>
                <ShieldCheck size={13} />
                Approve All Safe ({actions.filter((a) => a.status === 'PENDING' && a.riskLevel !== 'HIGH').length})
              </button>
            )}
          </div>
        </div>

        {/* Hero Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: 4 }}>
              AUTONOMOUS DISPATCH CONTROLLER & AUDIT TRAIL
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              AI ACTION <span className="accent">REVIEW FIREWALL.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 640 }}>
              Inspect parameter diffs, verify confidence telemetry, and authorize outbound mutations before any network call executes.
            </p>
          </div>

          {/* Filter Chips */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((f) => (
              <button
                key={f}
                className={`filter-pill ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
                style={{ fontSize: '0.72rem' }}
              >
                {f} ({actions.filter((a) => (f === 'ALL' ? true : a.status === f)).length})
              </button>
            ))}
          </div>
        </div>

        {/* Action Review Cards Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', borderRadius: 16 }}>
                <CheckCircle2 size={40} style={{ color: 'var(--accent-emerald)', margin: '0 auto 12px' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  All AI Actions Cleared
                </h3>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  No operations pending human authorization. Autonomous telemetry engine running in observation mode.
                </p>
              </div>
            ) : (
              filtered.map((item, idx) => {
                const riskBadgeCls =
                  item.riskLevel === 'HIGH' ? 'badge-risk-high' : item.riskLevel === 'MEDIUM' ? 'badge-risk-med' : 'badge-risk-low';

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ delay: idx * 0.04 }}
                    className="glass-card"
                    style={{ padding: '24px', borderRadius: 16 }}
                  >
                    {/* Card Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
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
                            {item.confidence}% Model Confidence
                          </span>

                          <span className={riskBadgeCls} style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
                            {item.riskLevel === 'HIGH' ? <ShieldAlert size={11} /> : <ShieldCheck size={11} />}
                            {item.riskLevel} RISK
                          </span>

                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Hash: {item.auditHash}
                          </span>

                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            • {item.timestamp}
                          </span>
                        </div>

                        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                          {item.title}
                        </h3>
                        <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: 4 }}>
                          Target: <strong style={{ color: 'var(--text-primary)' }}>{item.targetEntity}</strong> • Tool:{' '}
                          <code style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: 4 }}>
                            {item.toolName}()
                          </code>
                        </div>
                      </div>

                      {/* Approval Actions */}
                      {item.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => handleAction(item.id, 'REJECTED')}
                            className="btn-danger"
                            style={{ padding: '8px 14px', fontSize: '0.78rem' }}
                          >
                            <XCircle size={14} /> Reject Mutation
                          </button>
                          <button
                            onClick={() => handleAction(item.id, 'APPROVED')}
                            className="btn-primary"
                            style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                          >
                            <CheckCircle2 size={14} /> Authorize & Sign
                          </button>
                        </div>
                      ) : (
                        <span
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '0.76rem',
                            fontWeight: 800,
                            padding: '4px 12px',
                            borderRadius: 6,
                            background: item.status === 'APPROVED' ? 'rgba(52, 211, 153, 0.14)' : 'rgba(239, 68, 68, 0.14)',
                            border: `1px solid ${item.status === 'APPROVED' ? 'rgba(52, 211, 153, 0.35)' : 'rgba(239, 68, 68, 0.35)'}`,
                            color: item.status === 'APPROVED' ? '#34d399' : '#f87171'
                          }}
                        >
                          {item.status === 'APPROVED' ? '✓ SIGNED & EXECUTED' : '✕ ABORTED'}
                        </span>
                      )}
                    </div>

                    {/* Parameter Diff Block (If present) */}
                    {item.diff && (
                      <div
                        style={{
                          marginBottom: 14,
                          padding: '12px 16px',
                          background: 'rgba(0,0,0,0.35)',
                          borderRadius: 8,
                          border: '1px solid var(--border-subtle)',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.74rem'
                        }}
                      >
                        <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>// PARAMETER MUTATION DIFF:</div>
                        <div style={{ color: '#f87171' }}>- {item.diff.field}: "{item.diff.oldVal}"</div>
                        <div style={{ color: '#34d399' }}>+ {item.diff.field}: "{item.diff.newVal}"</div>
                      </div>
                    )}

                    {/* Evidence & Rationale */}
                    <div style={{ padding: '16px', background: 'var(--bg-surface-2)', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>
                        Autonomous Rationale: {item.reason}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontWeight: 700, fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                        VERIFIED AUDIT EVIDENCE:
                      </div>
                      <ul style={{ paddingLeft: '18px', margin: 0 }}>
                        {item.evidence.map((ev, i) => (
                          <li key={i} style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                            {ev}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
