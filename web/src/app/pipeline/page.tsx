/**
 * @file pipeline/page.tsx
 * @description Career Execution Pipeline Controller for DayNight Pilot.
 * 
 * Capabilities:
 * - Dual-View Architecture: Seamless toggle between 6-column interactive Kanban and Dense Data Table.
 * - Stage Progression Model: APPLIED -> REPLIED -> ASSIGNMENT_TEST -> INTERVIEW -> SELECTED_OFFER -> REJECTED.
 * - Tactical Intelligence Cards: Fit scores, interview due dates, direct online assessment links, and recruiter notes.
 * - Full CRUD Operations: Add, edit, rename, stage-shift, and delete applications via an aerospace modal dialog.
 * - Real-Time Search: Instant client-side filtering across company names, roles, and platform channels.
 */

'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Clock,
  ExternalLink,
  FileCode,
  Calendar,
  X,
  Trash2,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Layers,
  Sparkles,
  Zap,
  Search,
  LayoutGrid,
  Table as TableIcon,
  ShieldCheck,
  Building2,
  MapPin,
  TrendingUp
} from 'lucide-react';

/**
 * Valid Kanban lifecycle stage identifiers.
 */
export type KanbanStatus =
  | 'APPLIED'
  | 'REPLIED'
  | 'ASSIGNMENT_TEST'
  | 'INTERVIEW'
  | 'SELECTED_OFFER'
  | 'REJECTED';

/**
 * Data contract representing an active pipeline application or assignment task.
 */
export interface KanbanJob {
  id: string;
  company: string;
  role: string;
  status: KanbanStatus;
  platform: string;
  appliedDate: string;
  matchScore: number;
  location: string;
  dueDate?: string;
  oaLink?: string;
  recruiter?: string;
  notes?: string;
}

/**
 * Visual styling and metadata configuration for all 6 pipeline stages.
 */
const COLUMNS: { id: KanbanStatus; label: string; color: string; badgeCls: string }[] = [
  { id: 'APPLIED', label: 'APPLIED', color: '#94a3b8', badgeCls: 'badge-applied' },
  { id: 'REPLIED', label: 'REPLIED', color: '#a78bfa', badgeCls: 'badge-review' },
  { id: 'ASSIGNMENT_TEST', label: 'ASSESSMENT / OA', color: '#fbbf24', badgeCls: 'badge-oa' },
  { id: 'INTERVIEW', label: 'INTERVIEW', color: '#60a5fa', badgeCls: 'badge-interview' },
  { id: 'SELECTED_OFFER', label: 'OFFER WON', color: '#34d399', badgeCls: 'badge-offer' },
  { id: 'REJECTED', label: 'ARCHIVED', color: '#f87171', badgeCls: 'badge-rejected' }
];

/**
 * Initial candidate pipeline dataset illustrating active stages.
 */
const INITIAL_JOBS: KanbanJob[] = [
  {
    id: 'k1',
    company: 'Google',
    role: 'Staff Systems Engineer (Distributed Infra)',
    status: 'INTERVIEW',
    platform: 'Company Portal',
    appliedDate: 'May 02, 2026',
    matchScore: 96,
    location: 'Bengaluru / Hybrid',
    dueDate: 'Sept 18, 2026 • 4:00 PM IST',
    recruiter: 'Alex Rivera',
    notes: 'System Design Round scheduled. Focus on Raft & consensus protocols.'
  },
  {
    id: 'k2',
    company: 'Stripe',
    role: 'Senior Backend Engineer (Payments)',
    status: 'REPLIED',
    platform: 'Direct Inbound',
    appliedDate: 'May 05, 2026',
    matchScore: 92,
    location: 'Remote',
    recruiter: 'Sarah Jenkins',
    dueDate: 'Sept 20, 2026 • Staff phone screen',
    notes: 'Recruiter reached out via LinkedIn with high salary band.'
  },
  {
    id: 'k3',
    company: 'FinTech Stack',
    role: 'Low-Latency Systems Engineer',
    status: 'ASSIGNMENT_TEST',
    platform: 'Wellfound',
    appliedDate: 'May 10, 2026',
    matchScore: 89,
    location: 'Bengaluru',
    dueDate: 'Sept 22, 2026 • 90m Concurrency Test',
    oaLink: 'https://hackerrank.com/fintech-oa-2026',
    notes: '90-minute live assessment focusing on lock-free data structures.'
  },
  {
    id: 'k4',
    company: 'CloudVentures',
    role: 'Autonomous Systems Architect',
    status: 'SELECTED_OFFER',
    platform: 'Direct Referral',
    appliedDate: 'May 12, 2026',
    matchScore: 98,
    location: 'Remote (US/EU)',
    dueDate: 'Offer Accepted • Start Oct 1',
    notes: 'Formal contract cryptographic verification complete.'
  },
  {
    id: 'k5',
    company: 'Acme Corp',
    role: 'Senior Platform Engineer',
    status: 'APPLIED',
    platform: 'LinkedIn',
    appliedDate: 'May 08, 2026',
    matchScore: 85,
    location: 'Hybrid'
  },
  {
    id: 'k6',
    company: 'DataScale Inc',
    role: 'Data Platform Engineer',
    status: 'REJECTED',
    platform: 'Naukri',
    appliedDate: 'Apr 28, 2026',
    matchScore: 78,
    location: 'Bengaluru',
    notes: 'Internal headcount reallocated.'
  }
];

/**
 * PipelinePage Component
 * Provides executive stage control across candidate opportunities with Kanban and Table views.
 */
export default function PipelinePage() {
  const [jobs, setJobs] = useState<KanbanJob[]>(INITIAL_JOBS);
  const [viewMode, setViewMode] = useState<'KANBAN' | 'TABLE'>('KANBAN');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<KanbanJob | null>(null);

  // Form State
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState<KanbanStatus>('APPLIED');
  const [newDueDate, setNewDueDate] = useState('');
  const [newOaLink, setNewOaLink] = useState('');
  const [newPlatform, setNewPlatform] = useState('Direct ATS');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newNotes, setNewNotes] = useState('');

  const handleMoveStatus = (jobId: string, targetStatus: KanbanStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: targetStatus } : job))
    );
  };

  const handleDeleteJob = (jobId: string, companyName: string) => {
    if (confirm(`Remove "${companyName}" from execution pipeline?`)) {
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
    }
  };

  const handleOpenAddModal = () => {
    setEditingJob(null);
    setNewCompany('');
    setNewRole('');
    setNewStatus('APPLIED');
    setNewDueDate('');
    setNewOaLink('');
    setNewPlatform('Direct ATS');
    setNewLocation('Remote');
    setNewNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: KanbanJob) => {
    setEditingJob(job);
    setNewCompany(job.company);
    setNewRole(job.role);
    setNewStatus(job.status);
    setNewDueDate(job.dueDate || '');
    setNewOaLink(job.oaLink || '');
    setNewPlatform(job.platform || 'Direct ATS');
    setNewLocation(job.location || 'Remote');
    setNewNotes(job.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;

    if (editingJob) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === editingJob.id
            ? {
                ...j,
                company: newCompany,
                role: newRole,
                status: newStatus,
                dueDate: newDueDate || undefined,
                oaLink: newOaLink || undefined,
                platform: newPlatform,
                location: newLocation,
                notes: newNotes || undefined
              }
            : j
        )
      );
    } else {
      const created: KanbanJob = {
        id: `k-${Date.now()}`,
        company: newCompany,
        role: newRole,
        status: newStatus,
        platform: newPlatform,
        appliedDate: 'Today',
        matchScore: 88 + Math.floor(Math.random() * 10),
        location: newLocation,
        dueDate: newDueDate || undefined,
        oaLink: newOaLink || undefined,
        notes: newNotes || undefined
      };
      setJobs((prev) => [created, ...prev]);
    }
    setIsModalOpen(false);
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.platform.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace" style={{ paddingBottom: '80px' }}>
        {/* Status Header */}
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
              <span className="sentinel-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cobalt)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                PIPELINE MATRIX // STAGE PROGRESSION
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
              6 STAGES ACTIVE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-surface-2)', padding: 3, borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <button
                onClick={() => setViewMode('KANBAN')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: viewMode === 'KANBAN' ? 'var(--accent-cobalt)' : 'transparent',
                  color: viewMode === 'KANBAN' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <LayoutGrid size={13} /> Kanban
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '5px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: viewMode === 'TABLE' ? 'var(--accent-cobalt)' : 'transparent',
                  color: viewMode === 'TABLE' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <TableIcon size={13} /> Table
              </button>
            </div>

            <button onClick={handleOpenAddModal} className="btn-primary" style={{ padding: '7px 14px', fontSize: '0.75rem', gap: 6 }}>
              <Plus size={14} /> Add Target
            </button>
          </div>
        </div>

        {/* Page Hero */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: 4 }}>
              OPPORTUNITY LIFECYCLE CONTROLLER
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              CAREER <span className="accent">EXECUTION PIPELINE.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 640 }}>
              Track applications, online assessment tests, technical rounds, and final compensation offers across structured lifecycle columns.
            </p>
          </div>

          {/* Quick Search */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search companies, titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '8px 12px 8px 32px',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                color: 'var(--text-primary)',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Column Summary Metric Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '12px',
            marginBottom: '24px'
          }}
        >
          {COLUMNS.map((col) => {
            const count = jobs.filter((j) => j.status === col.id).length;
            return (
              <div
                key={col.id}
                className="glass-card"
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.66rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {col.label}
                  </div>
                  <div className="stat-numeral" style={{ fontSize: '1.6rem', color: col.color, marginTop: '2px' }}>
                    {count}
                  </div>
                </div>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: col.color,
                    boxShadow: `0 0 10px ${col.color}`
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* VIEW 1: KANBAN VIEW */}
        {viewMode === 'KANBAN' && (
          <div
            className="kanban-board"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(310px, 1fr))',
              gap: '16px',
              overflowX: 'auto',
              paddingBottom: '24px'
            }}
          >
            {COLUMNS.map((col) => {
              const colJobs = filteredJobs.filter((j) => j.status === col.id);
              return (
                <div
                  key={col.id}
                  style={{
                    background: 'var(--bg-surface-1)',
                    borderRadius: '14px',
                    border: '1px solid var(--border-subtle)',
                    padding: '16px',
                    minHeight: '600px',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* Column Header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingBottom: '12px',
                      borderBottom: '1px solid var(--border-subtle)',
                      marginBottom: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: col.color, boxShadow: `0 0 6px ${col.color}` }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                        {col.label}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: 'rgba(255,255,255,0.06)',
                        color: col.color
                      }}
                    >
                      {colJobs.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {colJobs.length === 0 ? (
                      <div
                        style={{
                          height: '120px',
                          borderRadius: '10px',
                          border: '1px dashed var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--text-muted)',
                          fontSize: '0.74rem',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        No items in {col.label}
                      </div>
                    ) : (
                      colJobs.map((job) => (
                        <motion.div
                          key={job.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          whileHover={{ y: -2 }}
                          style={{
                            padding: '14px',
                            borderRadius: '10px',
                            background: 'var(--bg-surface-2)',
                            border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--shadow-sm)',
                            position: 'relative'
                          }}
                        >
                          {/* Card Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                              {job.company}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <span
                                style={{
                                  fontFamily: 'var(--font-mono)',
                                  fontSize: '0.62rem',
                                  fontWeight: 800,
                                  color: 'var(--accent-cyan)',
                                  background: 'rgba(6,182,212,0.12)',
                                  padding: '2px 6px',
                                  borderRadius: 4
                                }}
                              >
                                {job.matchScore}% FIT
                              </span>
                              <button
                                onClick={() => handleOpenEditModal(job)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 3 }}
                                title="Edit"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteJob(job.id, job.company)}
                                style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', padding: 3 }}
                                title="Delete"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.3 }}>
                            {job.role}
                          </div>

                          {/* Due Date Indicator */}
                          {job.dueDate && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: 6,
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.7rem',
                                padding: '4px 8px',
                                borderRadius: 6,
                                background: 'rgba(251,191,36,0.12)',
                                color: '#fbbf24',
                                border: '1px solid rgba(251,191,36,0.3)',
                                marginBottom: 8,
                                width: '100%'
                              }}
                            >
                              <Clock size={12} /> {job.dueDate}
                            </div>
                          )}

                          {/* Online Assessment Link */}
                          {job.oaLink && (
                            <a
                              href={job.oaLink}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                                fontSize: '0.72rem',
                                fontFamily: 'var(--font-mono)',
                                color: 'var(--accent-cyan)',
                                background: 'rgba(6,182,212,0.12)',
                                border: '1px solid rgba(6,182,212,0.3)',
                                padding: '5px 10px',
                                borderRadius: 6,
                                marginBottom: 8,
                                textDecoration: 'none'
                              }}
                            >
                              <FileCode size={12} /> Open Assessment <ExternalLink size={10} />
                            </a>
                          )}

                          {job.notes && (
                            <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: 8 }}>
                              "{job.notes}"
                            </div>
                          )}

                          {/* Move Stage Selector */}
                          <div style={{ paddingTop: 8, borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                              MOVE TO:
                            </span>
                            <select
                              value={job.status}
                              onChange={(e) => handleMoveStatus(job.id, e.target.value as KanbanStatus)}
                              style={{
                                background: 'var(--bg-surface-1)',
                                border: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.68rem',
                                padding: '2px 6px',
                                borderRadius: 4,
                                outline: 'none',
                                cursor: 'pointer'
                              }}
                            >
                              {COLUMNS.map((c) => (
                                <option key={c.id} value={c.id}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: DATA TABLE VIEW */}
        {viewMode === 'TABLE' && (
          <div className="glass-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1.2fr 100px 140px 140px 80px',
                padding: '12px 18px',
                background: 'var(--bg-surface-2)',
                borderBottom: '1px solid var(--border-subtle)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em'
              }}
            >
              <span>ORGANIZATION & ROLE</span>
              <span>CHANNEL / LOCATION</span>
              <span>FIT SCORE</span>
              <span>STAGE</span>
              <span>DUE / DEADLINE</span>
              <span style={{ textAlign: 'right' }}>ACTIONS</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {filteredJobs.map((job) => {
                const colCfg = COLUMNS.find((c) => c.id === job.status) ?? COLUMNS[0];
                return (
                  <div
                    key={job.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.4fr 1.2fr 100px 140px 140px 80px',
                      alignItems: 'center',
                      padding: '14px 18px',
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease'
                    }}
                    className="table-row-hover"
                  >
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{job.company}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{job.role}</div>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)' }}>{job.platform}</div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>{job.location}</div>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
                        {job.matchScore}%
                      </span>
                    </div>
                    <div>
                      <span className={`badge ${colCfg.badgeCls}`} style={{ fontSize: '0.66rem' }}>
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: colCfg.color, display: 'inline-block' }} />
                        {colCfg.label}
                      </span>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      {job.dueDate || '—'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                      <button
                        onClick={() => handleOpenEditModal(job)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id, job.company)}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MODAL: ADD / EDIT TARGET APPLICATION */}
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="drawer-backdrop"
              />

              <div
                style={{
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '90%',
                  maxWidth: '520px',
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-glow)',
                  borderRadius: '16px',
                  boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
                  zIndex: 200,
                  overflow: 'hidden'
                }}
              >
                {/* Modal Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)' }}>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                    {editingJob ? 'Edit Pipeline Target' : 'Add Opportunity to Pipeline'}
                  </div>
                  <button onClick={() => setIsModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                    <X size={16} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveJob} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                        COMPANY NAME *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        placeholder="e.g. OpenAI"
                        style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.84rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                        ROLE TITLE *
                      </label>
                      <input
                        type="text"
                        required
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        placeholder="e.g. Staff Backend"
                        style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.84rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                        PIPELINE STAGE
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as KanbanStatus)}
                        style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.84rem' }}
                      >
                        {COLUMNS.map((col) => (
                          <option key={col.id} value={col.id}>
                            {col.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                        SOURCE PLATFORM
                      </label>
                      <input
                        type="text"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        placeholder="Direct ATS / LinkedIn"
                        style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.84rem' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      DUE DATE / INTERVIEW TIME
                    </label>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="e.g. Sept 25, 2026 • 2:00 PM IST"
                      style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      ASSESSMENT / OA LINK
                    </label>
                    <input
                      type="url"
                      value={newOaLink}
                      onChange={(e) => setNewOaLink(e.target.value)}
                      placeholder="https://hackerrank.com/..."
                      style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.84rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block', marginBottom: 4 }}>
                      TACTICAL NOTES
                    </label>
                    <textarea
                      rows={3}
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      placeholder="Key requirements, recruiter info, next steps..."
                      style={{ width: '100%', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '8px 10px', color: '#fff', fontSize: '0.84rem', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.78rem' }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem' }}>
                      {editingJob ? 'Save Modifications' : 'Create Pipeline Target'}
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
