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
  Zap
} from 'lucide-react';

export type KanbanStatus =
  | 'APPLIED'
  | 'REPLIED'
  | 'ASSIGNMENT_TEST'
  | 'INTERVIEW'
  | 'SELECTED_OFFER'
  | 'REJECTED';

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

const COLUMNS: { id: KanbanStatus; label: string; color: string; bgBadge: string; borderBadge: string }[] = [
  { id: 'APPLIED', label: 'APPLIED', color: '#94a3b8', bgBadge: 'rgba(148, 163, 184, 0.14)', borderBadge: 'rgba(148, 163, 184, 0.3)' },
  { id: 'REPLIED', label: 'REPLIED', color: '#a78bfa', bgBadge: 'rgba(167, 139, 250, 0.14)', borderBadge: 'rgba(167, 139, 250, 0.3)' },
  { id: 'ASSIGNMENT_TEST', label: 'ASSIGNMENT / TEST', color: '#fbbf24', bgBadge: 'rgba(251, 191, 36, 0.14)', borderBadge: 'rgba(251, 191, 36, 0.3)' },
  { id: 'INTERVIEW', label: 'INTERVIEW', color: '#60a5fa', bgBadge: 'rgba(96, 165, 250, 0.14)', borderBadge: 'rgba(96, 165, 250, 0.3)' },
  { id: 'SELECTED_OFFER', label: 'SELECTED / JOB OFFER GIVEN', color: '#34d399', bgBadge: 'rgba(52, 211, 153, 0.14)', borderBadge: 'rgba(52, 211, 153, 0.3)' },
  { id: 'REJECTED', label: 'REJECTED', color: '#f87171', bgBadge: 'rgba(248, 113, 113, 0.14)', borderBadge: 'rgba(248, 113, 113, 0.3)' }
];

const INITIAL_JOBS: KanbanJob[] = [
  {
    id: 'k1',
    company: 'Google',
    role: 'Software Engineer (Backend)',
    status: 'INTERVIEW',
    platform: 'Company Portal',
    appliedDate: 'May 02, 2026',
    matchScore: 94,
    location: 'Bengaluru / Remote',
    dueDate: 'Sept 18, 2026 • 4:00 PM IST',
    recruiter: 'Alex Rivera',
    notes: 'System Design Round scheduled.'
  },
  {
    id: 'k2',
    company: 'Stripe',
    role: 'Backend Engineer',
    status: 'REPLIED',
    platform: 'Direct Email',
    appliedDate: 'May 05, 2026',
    matchScore: 90,
    location: 'Remote',
    recruiter: 'Sarah Jenkins',
    dueDate: 'Sept 20, 2026 • Recruiter phone screen'
  },
  {
    id: 'k3',
    company: 'FinTech Stack',
    role: 'Systems Engineer',
    status: 'ASSIGNMENT_TEST',
    platform: 'Wellfound',
    appliedDate: 'May 10, 2026',
    matchScore: 88,
    location: 'Bengaluru',
    dueDate: 'Sept 22, 2026 • 90 min test (Due Soon)',
    oaLink: 'https://hackerrank.com/fintech-oa-2026',
    notes: 'HackerRank 90 min coding test on concurrency.'
  },
  {
    id: 'k4',
    company: 'CloudVentures',
    role: 'AI Engineer',
    status: 'SELECTED_OFFER',
    platform: 'Unstop',
    appliedDate: 'May 12, 2026',
    matchScore: 96,
    location: 'Remote',
    dueDate: 'Offer Accepted • Start Oct 1',
    notes: 'Offer letter signed & counter-verified.'
  },
  {
    id: 'k5',
    company: 'Acme Corp',
    role: 'Full Stack Engineer',
    status: 'APPLIED',
    platform: 'LinkedIn',
    appliedDate: 'May 08, 2026',
    matchScore: 84,
    location: 'Hybrid'
  },
  {
    id: 'k6',
    company: 'DataScale Inc',
    role: 'Data Platform Engineer',
    status: 'REJECTED',
    platform: 'Naukri',
    appliedDate: 'Apr 28, 2026',
    matchScore: 79,
    location: 'Bengaluru',
    notes: 'Position closed internally.'
  }
];

export default function PipelinePage() {
  const [jobs, setJobs] = useState<KanbanJob[]>(INITIAL_JOBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<KanbanJob | null>(null);

  // Form State for Add / Edit Modal
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState<KanbanStatus>('APPLIED');
  const [newDueDate, setNewDueDate] = useState('');
  const [newOaLink, setNewOaLink] = useState('');
  const [newPlatform, setNewPlatform] = useState('LinkedIn');
  const [newLocation, setNewLocation] = useState('Remote');
  const [newNotes, setNewNotes] = useState('');

  const handleMoveStatus = (jobId: string, targetStatus: KanbanStatus) => {
    setJobs((prev) =>
      prev.map((job) => (job.id === jobId ? { ...job, status: targetStatus } : job))
    );
  };

  const handleDeleteJob = (jobId: string, companyName: string) => {
    if (confirm(`Are you sure you want to delete "${companyName}" from your pipeline?`)) {
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
    setNewPlatform('LinkedIn');
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
    setNewPlatform(job.platform || 'LinkedIn');
    setNewLocation(job.location || 'Remote');
    setNewNotes(job.notes || '');
    setIsModalOpen(true);
  };

  const handleSaveJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newRole) return;

    if (editingJob) {
      // Edit existing
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
      // Add new
      const created: KanbanJob = {
        id: `k-${Date.now()}`,
        company: newCompany,
        role: newRole,
        status: newStatus,
        platform: newPlatform,
        appliedDate: 'Today',
        matchScore: 85 + Math.floor(Math.random() * 12),
        location: newLocation,
        dueDate: newDueDate || undefined,
        oaLink: newOaLink || undefined,
        notes: newNotes || undefined
      };
      setJobs((prev) => [created, ...prev]);
    }

    setIsModalOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        {/* Header Kicker */}
        <div className="page-kicker">
          <Briefcase size={14} />
          CAREER EXECUTION PIPELINE
        </div>

        <div className="page-heading" style={{ marginBottom: '20px' }}>
          <div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Career Execution Pipeline
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              Applied • Replied • Assignment / Test • Interview • Selected / Job Offer Given • Rejected
            </p>
          </div>
          <button className="primary-button" onClick={handleOpenAddModal}>
            <Plus size={16} /> Add Application / Task
          </button>
        </div>

        {/* Pro Tip Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.25)',
            borderRadius: '10px',
            padding: '10px 16px',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
            color: '#93c5fd',
            marginBottom: '24px'
          }}
        >
          <Sparkles size={16} style={{ color: 'var(--accent-cyan)', flexShrink: 0 }} />
          <span>
            <strong>Pro Tip:</strong> Double-click / double-tap any card to edit details or rename task. Use the move stage dropdown or trash icon to manage applications.
          </span>
        </div>

        {/* Board Overview Metrics Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '12px',
            marginBottom: '28px'
          }}
        >
          {COLUMNS.map((col) => {
            const count = jobs.filter((j) => j.status === col.id).length;
            return (
              <div
                key={col.id}
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
                    {col.label}
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: col.color, fontFamily: 'var(--font-display)', marginTop: '2px' }}>
                    {count}
                  </div>
                </div>
                <span
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: col.color,
                    boxShadow: `0 0 12px ${col.color}`
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Horizontal Kanban Columns Grid */}
        <div
          className="kanban-board"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(320px, 1fr))',
            gap: '18px',
            overflowX: 'auto',
            paddingBottom: '32px'
          }}
        >
          {COLUMNS.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.id);
            return (
              <div
                key={col.id}
                style={{
                  background: 'var(--bg-surface-1)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  padding: '18px',
                  minHeight: '620px',
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
                    paddingBottom: '14px',
                    borderBottom: '1px solid var(--border-subtle)',
                    marginBottom: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span
                      style={{
                        width: '9px',
                        height: '9px',
                        borderRadius: '50%',
                        background: col.color,
                        boxShadow: `0 0 8px ${col.color}`
                      }}
                    />
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        letterSpacing: '0.04em'
                      }}
                    >
                      {col.label}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '3px 9px',
                      borderRadius: '999px',
                      background: col.bgBadge,
                      color: col.color,
                      border: `1px solid ${col.borderBadge}`,
                      fontWeight: 700
                    }}
                  >
                    {colJobs.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                  {colJobs.length === 0 ? (
                    <div
                      style={{
                        height: '140px',
                        borderRadius: '12px',
                        border: '1px dashed var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.76rem',
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
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ y: -3, transition: { duration: 0.15 } }}
                        onDoubleClick={() => handleOpenEditModal(job)}
                        title="Double-click to edit or rename"
                        style={{
                          padding: '16px',
                          borderRadius: '12px',
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          boxShadow: 'var(--shadow-md)',
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        {/* Top Card Header with Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <strong style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', paddingRight: '8px' }}>
                            {job.company}
                          </strong>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{
                                fontFamily: 'var(--font-mono)',
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                color: 'var(--accent-cobalt)',
                                background: 'rgba(59, 130, 246, 0.12)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}
                            >
                              {job.matchScore}% FIT
                            </span>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEditModal(job);
                              }}
                              title="Edit / Rename Task"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Edit3 size={14} />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteJob(job.id, job.company);
                              }}
                              title="Delete Task / Application"
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#f87171',
                                cursor: 'pointer',
                                padding: '4px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center'
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '12px' }}>
                          {job.role}
                        </div>

                        {/* Task / Assignment Due Date Badge */}
                        {job.dueDate && (
                          <div
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontFamily: 'var(--font-mono)',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '5px 10px',
                              borderRadius: '6px',
                              background:
                                job.status === 'ASSIGNMENT_TEST'
                                  ? 'rgba(251, 191, 36, 0.16)'
                                  : job.status === 'SELECTED_OFFER'
                                  ? 'rgba(52, 211, 153, 0.16)'
                                  : 'rgba(96, 165, 250, 0.16)',
                              color:
                                job.status === 'ASSIGNMENT_TEST'
                                  ? '#fde68a'
                                  : job.status === 'SELECTED_OFFER'
                                  ? '#a7f3d0'
                                  : '#bfdbfe',
                              border: `1px solid ${
                                job.status === 'ASSIGNMENT_TEST'
                                  ? 'rgba(251, 191, 36, 0.4)'
                                  : job.status === 'SELECTED_OFFER'
                                  ? 'rgba(52, 211, 153, 0.4)'
                                  : 'rgba(96, 165, 250, 0.4)'
                              }`,
                              marginBottom: '12px',
                              width: '100%'
                            }}
                          >
                            <Clock size={13} /> Due: {job.dueDate}
                          </div>
                        )}

                        {/* Online Assessment / Test Link */}
                        {job.oaLink && (
                          <a
                            href={job.oaLink}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontSize: '0.74rem',
                              fontFamily: 'var(--font-mono)',
                              fontWeight: 700,
                              color: 'var(--accent-cyan)',
                              background: 'rgba(6, 182, 212, 0.12)',
                              border: '1px solid rgba(6, 182, 212, 0.35)',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              marginBottom: '12px',
                              textDecoration: 'none',
                              width: '100%',
                              justifyContent: 'center'
                            }}
                          >
                            <FileCode size={13} /> Open Assignment Test <ExternalLink size={11} />
                          </a>
                        )}

                        {job.notes && (
                          <div
                            style={{
                              fontSize: '0.76rem',
                              color: 'var(--text-muted)',
                              fontStyle: 'italic',
                              marginBottom: '12px',
                              lineHeight: '1.45'
                            }}
                          >
                            "{job.notes}"
                          </div>
                        )}

                        {/* Quick Status Stage Switcher */}
                        <div
                          style={{
                            marginTop: '8px',
                            paddingTop: '12px',
                            borderTop: '1px solid var(--border-subtle)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px'
                          }}
                        >
                          <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Move Stage:
                          </div>
                          <select
                            value={job.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleMoveStatus(job.id, e.target.value as KanbanStatus);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              background: 'var(--bg-surface-1)',
                              color: 'var(--text-primary)',
                              border: '1px solid var(--border-subtle)',
                              borderRadius: '6px',
                              padding: '5px 8px',
                              fontSize: '0.74rem',
                              fontFamily: 'var(--font-mono)',
                              outline: 'none',
                              cursor: 'pointer',
                              width: '100%'
                            }}
                          >
                            {COLUMNS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: '0.68rem',
                            color: 'var(--text-muted)',
                            marginTop: '12px',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          <span>{job.platform}</span>
                          <span>{job.appliedDate}</span>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal for Adding or Editing Application / Task */}
        <AnimatePresence>
          {isModalOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.75)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: '20px'
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{
                  background: 'var(--bg-surface-1)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  width: '100%',
                  maxWidth: '520px',
                  padding: '28px',
                  boxShadow: 'var(--shadow-lg)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    {editingJob ? 'Edit & Rename Task / Application' : 'Add Pipeline Application / Task'}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSaveJob} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Company / Task Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. OpenAI, Stripe, Google, My Custom Task"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Role Title / Description *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend Engineer"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        Column Stage
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as KanbanStatus)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          outline: 'none'
                        }}
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                        Platform / Channel
                      </label>
                      <input
                        type="text"
                        value={newPlatform}
                        onChange={(e) => setNewPlatform(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          background: 'var(--bg-surface-2)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          color: 'var(--text-primary)',
                          outline: 'none'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Task / Assignment Due Date (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sept 20, 2026 • 5:00 PM IST"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Assignment / Test Link (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://hackerrank.com/test-id"
                      value={newOaLink}
                      onChange={(e) => setNewOaLink(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', fontFamily: 'var(--font-mono)', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                      Notes / Remarks (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Recruiter phone screening scheduled"
                      value={newNotes}
                      onChange={(e) => setNewNotes(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        background: 'var(--bg-surface-2)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      style={{
                        padding: '10px 16px',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="primary-button">
                      {editingJob ? 'Save Changes' : 'Add to Pipeline'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
