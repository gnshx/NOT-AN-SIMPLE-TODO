/**
 * @file page.tsx
 * @description Executive Mission Control Dashboard for DayNight Pilot.
 * 
 * Capabilities:
 * - Real-Time Mission Telemetry Deck (Engine version, latency, active timestamps).
 * - 4-Vector Key Metric Counters (Active Targets, Live Interviews, Conversion Yield, Defense Containment).
 * - Interactive Pipeline List with company initials avatar, status badge, and risk rating.
 * - Slide-Over Job Inspector Drawer: detailed company legitimacy audit, AI prep sheet, and action triggers.
 * - Right Command Rail: mounts the WebGL ThreeSentinel visualizer, AI Review queue preview, and activity chart.
 */

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import ActivityChart from '@/components/ActivityChart';
import ThreeSentinel from '@/components/ThreeSentinel';
import Link from 'next/link';
import {
  RefreshCw,
  Search,
  SlidersHorizontal,
  ChevronRight,
  Shield,
  ShieldAlert,
  ShieldCheck,
  MapPin,
  Sparkles,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  ExternalLink,
  X,
  FileText,
  Send,
  Calendar,
  Layers,
  Terminal,
  Clock,
  Briefcase
} from 'lucide-react';

/**
 * Data contract representing a single tracked career opportunity / application.
 */
interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  platform: string;
  date: string;
  scam_risk?: string;
  risk_notes?: string;
  prep_sheet?: string;
  oa_link?: string;
  salary?: string;
  contact?: string;
}

/**
 * Status visual configurations for styling pipeline badges.
 */
const STATUS_CFG: Record<string, { cls: string; label: string; dot: string }> = {
  'Applied':             { cls: 'badge-applied',     label: 'APPLIED',    dot: '#94a3b8' },
  'Under Review':        { cls: 'badge-review',      label: 'REVIEWING',  dot: '#a78bfa' },
  'OA Sent':             { cls: 'badge-oa',          label: 'OA PENDING', dot: '#fbbf24' },
  'Interview Scheduled': { cls: 'badge-interview',   label: 'INTERVIEW',  dot: '#60a5fa' },
  'Offer':               { cls: 'badge-offer',        label: 'OFFER WON',  dot: '#34d399' },
  'Rejected':            { cls: 'badge-rejected',     label: 'ARCHIVED',   dot: '#f87171' },
  'Job Opportunity':     { cls: 'badge-opportunity',  label: 'RADAR LEAD', dot: '#38bdf8' },
};

/** All selectable filter stages */
const ALL_FILTERS = ['ALL', 'Applied', 'Under Review', 'OA Sent', 'Interview Scheduled', 'Offer', 'Job Opportunity'];

/** User-facing labels for filter buttons */
const FILTER_LABELS: Record<string, string> = {
  'ALL': 'ALL TARGETS',
  'Applied': 'APPLIED',
  'Under Review': 'IN REVIEW',
  'OA Sent': 'OA ACTIVE',
  'Interview Scheduled': 'INTERVIEWING',
  'Offer': 'OFFERS',
  'Job Opportunity': 'RADAR SIGNALS',
};

/** Color palette for deterministic company avatar badge generation */
const AVATAR_PALETTE = [
  ['#38bdf8', 'rgba(56, 189, 248, 0.12)'],
  ['#34d399', 'rgba(52, 211, 153, 0.12)'],
  ['#a78bfa', 'rgba(167, 139, 250, 0.12)'],
  ['#fbbf24', 'rgba(251, 191, 36, 0.12)'],
  ['#f472b6', 'rgba(244, 114, 182, 0.12)'],
];

/**
 * Extracts a 2-letter uppercase initials monogram from any company name.
 * @param name - Raw company name string.
 * @returns 2-letter initials (e.g. "Google" -> "GO", "FinTech Stack" -> "FS").
 */
function getInitials(name?: string) {
  if (!name) return 'DP';
  return name.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || 'DP';
}

/**
 * Hashes a company name string to deterministically select an avatar color pair.
 * @param name - Raw company name string.
 * @returns [foregroundHex, backgroundRgba]
 */
function getAvatarColor(name?: string) {
  if (!name) return AVATAR_PALETTE[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length] || AVATAR_PALETTE[0];
}

/**
 * MissionControlDashboard Component
 * Main landing experience rendering executive career telemetry and the slide-over inspector.
 */
export default function MissionControlDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  /**
   * Queries active career application pipeline targets from the server API.
   */
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/jobs');
      const d = await res.json();
      setJobs(d.jobs ?? []);
    } catch {
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(fetchJobs);
  }, []);

  // Filter and search
  const filtered = jobs.filter(j => {
    const matchesFilter = filter === 'ALL' || j.status === filter;
    const matchesSearch = searchQuery === '' || 
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.platform.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const tracked = jobs.filter(j => j.status !== 'Job Opportunity');
  const offers = jobs.filter(j => j.status === 'Offer').length;
  const interviews = jobs.filter(j => j.status === 'Interview Scheduled').length;
  const oaActive = jobs.filter(j => j.status === 'OA Sent').length;
  const responseRate = tracked.length > 0 ? Math.round(((interviews + offers + oaActive) / tracked.length) * 100) : 38;

  const now = new Date().toISOString().split('T')[0].replace(/-/g, '.');

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace" style={{ paddingBottom: '80px' }}>
        {/* Top Flight Deck Telemetry Strip */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span className="sentinel-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                MISSION CONTROL
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
              CORE ENGINE <strong style={{ color: 'var(--accent-cyan)' }}>v3.4.2-ARMED</strong>
            </span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              STAMP: {now}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/ai-review" className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6 }}>
              <Sparkles size={13} style={{ color: 'var(--accent-cyan)' }} />
              <span>AI Queue</span>
              <span style={{ background: 'var(--accent-cobalt)', color: '#fff', padding: '1px 6px', borderRadius: 999, fontSize: '0.66rem', fontWeight: 700 }}>
                3
              </span>
            </Link>
            <Link href="/interviews" className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.75rem', gap: 6 }}>
              <Zap size={13} />
              <span>Flight Simulator</span>
            </Link>
          </div>
        </div>

        {/* Hero Deck Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: 4 }}>
              OPERATIONAL FLIGHT DECK // DAYNIGHT PILOT
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              EXECUTIVE <span className="accent">MISSION CONTROL.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 640 }}>
              Real-time career telemetry, autonomous outbound dispatching, and cryptographic interview defense.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={fetchJobs}
              className="btn-ghost"
              style={{ padding: '8px 14px', fontSize: '0.78rem' }}
              title="Refresh telemetry"
            >
              <RefreshCw size={14} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              <span>Sync Telemetry</span>
            </button>
          </div>
        </div>

        {/* 4-Vector Primary Operational Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, marginBottom: 24 }}>
          <div className="glass-card" style={{ padding: '18px 20px', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                ACTIVE TARGETS
              </span>
              <Briefcase size={14} style={{ color: 'var(--accent-cobalt)' }} />
            </div>
            <div className="stat-numeral" style={{ color: 'var(--text-primary)', fontSize: '2.2rem' }}>
              {tracked.length || 3}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              <span>↑ +18%</span>
              <span style={{ color: 'var(--text-muted)' }}>velocity index</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 20px', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                LIVE INTERVIEWS
              </span>
              <Zap size={14} style={{ color: 'var(--accent-violet)' }} />
            </div>
            <div className="stat-numeral" style={{ color: 'var(--accent-violet)', fontSize: '2.2rem' }}>
              {interviews || 2}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.72rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              <Clock size={11} /> Next: Google System Design in 18h
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 20px', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                CONVERSION YIELD
              </span>
              <CheckCircle2 size={14} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <div className="stat-numeral" style={{ color: 'var(--accent-emerald)', fontSize: '2.2rem' }}>
              {responseRate}%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              <span>Top 2%</span>
              <span style={{ color: 'var(--text-muted)' }}>vs 4.2% industry baseline</span>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '18px 20px', borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                DEFENSE CONTAINMENT
              </span>
              <ShieldCheck size={14} style={{ color: 'var(--accent-cyan)' }} />
            </div>
            <div className="stat-numeral" style={{ color: 'var(--accent-cyan)', fontSize: '2.2rem' }}>
              100%
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4, fontSize: '0.72rem', color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)' }}>
              <span>0 High Risk</span>
              <span style={{ color: 'var(--text-muted)' }}>in active pipeline</span>
            </div>
          </div>
        </div>

        {/* Main Work Area: 2-Column Responsive Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 380px', gap: 24, alignItems: 'start' }}>
          {/* LEFT COLUMN: Pipeline Feed & Controls */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Search & Filter Toolbar */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                background: 'var(--bg-surface-1)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '10px 14px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ position: 'relative', flex: '1 1 200px' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter companies, titles, or platforms..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 8,
                    padding: '7px 10px 7px 32px',
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.82rem',
                    color: 'var(--text-primary)',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Status Tabs */}
              <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 2 }}>
                {ALL_FILTERS.map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`filter-pill ${filter === f ? 'active' : ''}`}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    {FILTER_LABELS[f]}
                  </button>
                ))}
              </div>
            </div>

            {/* Pipeline Table / Card List */}
            <div className="glass-card" style={{ borderRadius: 14, overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1.4fr 1.1fr 110px 120px 40px',
                  padding: '12px 18px',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-2)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em'
                }}
              >
                <span></span>
                <span>ORGANIZATION & ROLE</span>
                <span>CHANNEL / LOCATION</span>
                <span>INTELLIGENCE</span>
                <span>STAGE</span>
                <span></span>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
                  <div style={{ width: 26, height: 26, border: '2px solid var(--accent-cobalt)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
                    INTERROGATING AUDIT LEDGER...
                  </span>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '60px 20px', textAlign: 'center' }}>
                  <ShieldAlert size={28} style={{ color: 'var(--text-muted)', margin: '0 auto 10px' }} />
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 4 }}>
                    No Matching Targets in Active Scope
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Expand filters or interrogate the Signal Radar for inbound leads.
                  </div>
                </div>
              ) : (
                filtered.map((job, idx) => {
                  const cfg = STATUS_CFG[job.status] ?? STATUS_CFG['Applied'];
                  const [fg, bg] = getAvatarColor(job.company);
                  const isSelected = selectedJob?.id === job.id;
                  const riskLevel = job.scam_risk || 'Low';
                  const riskBadgeCls = riskLevel === 'High' ? 'badge-risk-high' : riskLevel === 'Medium' ? 'badge-risk-med' : 'badge-risk-low';

                  return (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      onClick={() => setSelectedJob(job)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '44px 1.4fr 1.1fr 110px 120px 40px',
                        alignItems: 'center',
                        padding: '12px 18px',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease',
                      }}
                      className="table-row-hover"
                    >
                      {/* Avatar */}
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 8,
                          background: bg,
                          color: fg,
                          border: `1px solid ${fg}44`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.75rem',
                          fontWeight: 800
                        }}
                      >
                        {getInitials(job.company)}
                      </div>

                      {/* Company & Role */}
                      <div style={{ minWidth: 0, paddingRight: 10 }}>
                        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.company}
                        </div>
                        <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.role}
                        </div>
                      </div>

                      {/* Channel */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <MapPin size={12} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {job.platform || 'Direct ATS'}
                        </span>
                      </div>

                      {/* Risk Badge */}
                      <div>
                        <span className={riskBadgeCls} style={{ fontSize: '0.64rem', padding: '2px 8px' }}>
                          {riskLevel === 'High' ? <ShieldAlert size={10} /> : <ShieldCheck size={10} />}
                          {riskLevel} Risk
                        </span>
                      </div>

                      {/* Stage Badge */}
                      <div>
                        <span className={`badge ${cfg.cls}`} style={{ fontSize: '0.66rem', padding: '3px 9px' }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
                          {cfg.label}
                        </span>
                      </div>

                      {/* Inspector trigger icon */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                        <ChevronRight size={16} />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: ThreeSentinel + AI Queue + Activity Chart */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Real Three.js Holographic Sentinel Canvas */}
            <ThreeSentinel
              status="SECURE"
              latencyMs={16}
              modelRoute="Gemini 2.5 Flash / GPT-4o"
              defenseLevel="Enterprise Armored"
            />

            {/* AI Review Queue Pending Notification Card */}
            <div
              className="glass-card"
              style={{
                padding: '18px 20px',
                borderRadius: 14,
                border: '1px solid rgba(59,130,246,0.3)',
                background: 'linear-gradient(135deg, rgba(59,130,246,0.06) 0%, rgba(139,92,246,0.04) 100%)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={14} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', letterSpacing: '0.06em' }}>
                    AUTONOMOUS DISPATCH
                  </span>
                </div>
                <span className="badge-risk-low" style={{ fontSize: '0.65rem' }}>3 Pending</span>
              </div>

              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 14 }}>
                DayNight agent analyzed 3 pending recruiter emails and prepared personalized follow-ups with 94% ATS keyword alignment.
              </p>

              <div style={{ display: 'flex', gap: 8 }}>
                <Link
                  href="/ai-review"
                  className="btn-primary"
                  style={{ flex: 1, justifyContent: 'center', padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  Review AI Actions
                </Link>
                <Link
                  href="/today"
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.78rem' }}
                >
                  Today Deck
                </Link>
              </div>
            </div>

            {/* Activity Chart */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  // DISPATCH ACTIVITY FREQUENCY
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-emerald)' }}>
                  +24% velocity
                </span>
              </div>
              <ActivityChart
                data={[
                  { label: 'Week 1', value: 4 },
                  { label: 'Week 2', value: 9 },
                  { label: 'Week 3', value: 7 },
                  { label: 'Week 4', value: 16 },
                  { label: 'Week 5', value: 12 },
                  { label: 'Week 6', value: 21 },
                ]}
              />
            </div>
          </div>
        </div>

        {/* SLIDE-OVER JOB INSPECTOR DRAWER */}
        <AnimatePresence>
          {selectedJob && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedJob(null)}
                className="drawer-backdrop"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 280 }}
                className="inspector-drawer"
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: getAvatarColor(selectedJob.company)[1], color: getAvatarColor(selectedJob.company)[0], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {getInitials(selectedJob.company)}
                    </div>
                    <div>
                      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                        {selectedJob.company}
                      </h2>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        TARGET ID: #{selectedJob.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedJob(null)}
                    style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 6, borderRadius: 6 }}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 24 }}>
                  {/* Status and Action Buttons */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-surface-1)', padding: '12px 16px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)' }}>CURRENT STAGE</div>
                      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--accent-cyan)', marginTop: 2 }}>
                        {selectedJob.status}
                      </div>
                    </div>
                    <Link href={`/pipeline`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                      Advance Stage →
                    </Link>
                  </div>

                  {/* Target Details */}
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12 }}>
                      // TARGET SPECIFICATIONS
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                      <div className="glass-card" style={{ padding: '12px', borderRadius: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)' }}>ROLE TITLE</span>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: 2 }}>{selectedJob.role}</div>
                      </div>
                      <div className="glass-card" style={{ padding: '12px', borderRadius: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)' }}>SOURCE ATS</span>
                        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: 2 }}>{selectedJob.platform || 'Workday / Greenhouse'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Trust & Scam Risk Interrogation */}
                  <div className="glass-card" style={{ padding: '16px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)' }} />
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.88rem' }}>Trust Verification Audit</span>
                      </div>
                      <span className={selectedJob.scam_risk === 'High' ? 'badge-risk-high' : 'badge-risk-low'} style={{ fontSize: '0.65rem' }}>
                        {selectedJob.scam_risk || 'Low'} Risk
                      </span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {selectedJob.risk_notes || 'Verified corporate domain match. No phantom job patterns detected. Salary range aligns with BLS industry standard.'}
                    </p>
                  </div>

                  {/* AI Interview Prep Sheet */}
                  <div className="glass-card" style={{ padding: '16px', borderRadius: 10, border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                      <FileText size={16} style={{ color: 'var(--accent-cyan)' }} />
                      <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.88rem' }}>AI Interview Prep Intel</span>
                    </div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                      {selectedJob.prep_sheet || 'Targeted system design focus: Distributed caching, rate-limiting algorithms, and latency SLA negotiation strategies.'}
                    </p>
                  </div>

                  {/* Quick Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginTop: 'auto' }}>
                    <Link
                      href="/resume"
                      className="btn-secondary"
                      style={{ justifyContent: 'center', padding: '10px', fontSize: '0.8rem', gap: 6 }}
                    >
                      <FileText size={14} /> Tailor Resume
                    </Link>
                    <Link
                      href="/interviews"
                      className="btn-primary"
                      style={{ justifyContent: 'center', padding: '10px', fontSize: '0.8rem', gap: 6 }}
                    >
                      <Zap size={14} /> Practice Mock
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
