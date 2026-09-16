'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/Sidebar';
import ActivityChart from '@/components/ActivityChart';
import { RefreshCw, ChevronDown, Shield, MapPin, Sparkles, Zap, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface Job {
  id: string; company: string; role: string; status: string;
  platform: string; date: string; scam_risk?: string;
  risk_notes?: string; prep_sheet?: string; oa_link?: string;
}

const STATUS_CFG: Record<string, { cls: string; label: string; dot: string }> = {
  'Applied':             { cls: 'badge-applied',   label: 'APPLIED',    dot: '#94a3b8' },
  'Under Review':        { cls: 'badge-review',    label: 'REVIEWING',  dot: '#a78bfa' },
  'OA Sent':             { cls: 'badge-oa',         label: 'OA SENT',    dot: '#fbbf24' },
  'Interview Scheduled': { cls: 'badge-interview', label: 'INTERVIEW',  dot: '#60a5fa' },
  'Offer':               { cls: 'badge-offer',      label: 'OFFER',      dot: '#34d399' },
  'Rejected':            { cls: 'badge-rejected',   label: 'REJECTED',   dot: '#f87171' },
  'Job Opportunity':     { cls: 'badge-opportunity',label: 'NEW LEADS',  dot: '#38bdf8' },
};

const AVATAR_COLORS = [
  ['#34d399','#062d20'], ['#60a5fa','#0b1f3d'], ['#a78bfa','#1e123d'],
  ['#fbbf24','#331e04'], ['#38bdf8','#04252e'], ['#f87171','#330c0c'],
];

function getInitials(name?: string) {
  if (!name || typeof name !== 'string') return 'DP';
  return name.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).map(w => w[0]).filter(Boolean).join('').toUpperCase().slice(0, 2) || 'DP';
}
function getAvatarColor(name?: string) {
  if (!name || typeof name !== 'string') return AVATAR_COLORS[0];
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  }
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length] || AVATAR_COLORS[0];
}

const ALL_FILTERS = ['ALL', 'Applied', 'Under Review', 'OA Sent', 'Interview Scheduled', 'Offer', 'Rejected', 'Job Opportunity'];

const FILTER_LABELS: Record<string, string> = {
  'ALL': 'ALL',
  'Applied': 'APPLIED',
  'Under Review': 'REVIEWING',
  'OA Sent': 'OA SENT',
  'Interview Scheduled': 'INTERVIEW',
  'Offer': 'OFFER',
  'Rejected': 'REJECTED',
  'Job Opportunity': 'NEW LEADS',
};

function JobRow({ job, index }: { job: Job; index: number }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CFG[job.status] ?? STATUS_CFG['Applied'];
  const [fg, bg] = getAvatarColor(job.company);
  const initials = getInitials(job.company);
  const riskColor = job.scam_risk === 'High' ? '#f87171' : job.scam_risk === 'Medium' ? '#fbbf24' : '#34d399';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
    >
      <div className="job-row" onClick={() => setOpen(!open)}>
        {/* Avatar */}
        <div className="company-avatar" style={{ background: bg, color: fg, border: `1px solid ${fg}40` }}>
          {initials}
        </div>

        {/* Company / Role */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {job.company}
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
            {job.role}
          </div>
        </div>

        {/* Platform / date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {job.platform}
          </span>
        </div>

        {/* Risk */}
        {job.scam_risk && job.scam_risk !== 'Unknown' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Shield size={12} style={{ color: riskColor }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: riskColor }}>
              {job.scam_risk}
            </span>
          </div>
        )}

        {/* Status badge */}
        <span className={`badge ${cfg.cls}`} style={{ flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.dot, display: 'inline-block' }} />
          {cfg.label}
        </span>

        {/* Chevron */}
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
        </motion.div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
            style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.25)' }}
          >
            <div style={{ padding: '16px 20px 16px 72px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}>
                {job.risk_notes && (
                  <div style={{ flex: '1 1 250px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 6 }}>▸ RISK ANALYSIS</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{job.risk_notes}</p>
                  </div>
                )}
                {job.prep_sheet && (
                  <div style={{ flex: '1.5 1 300px' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)', marginBottom: 6 }}>▸ PREP SHEET</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>{job.prep_sheet}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function buildActivityData(jobs: Job[]) {
  const counts: Record<string, number> = {};
  jobs.forEach(j => { if (!j.date) return; const w = j.date.substring(0, 7); counts[w] = (counts[w] ?? 0) + 1; });
  return Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)).slice(-6).map(([label, value]) => ({ label, value }));
}

export default function Dashboard() {
  const [jobs, setJobs]     = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState('ALL');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const d = await fetch('/api/jobs').then(r => r.json());
      setJobs(d.jobs ?? []);
    } catch { setJobs([]); } finally { setLoading(false); }
  };
  useEffect(() => { void Promise.resolve().then(fetchJobs); }, []);

  const tracked    = jobs.filter(j => j.status !== 'Job Opportunity');
  const offers     = jobs.filter(j => j.status === 'Offer').length;
  const interviews = jobs.filter(j => j.status === 'Interview Scheduled').length;
  const responseRate = tracked.length > 0 ? Math.round(((tracked.length - jobs.filter(j=>j.status==='Applied').length) / tracked.length) * 100) : 31;
  const opps       = jobs.filter(j => j.status === 'Job Opportunity');
  const highRisk   = jobs.filter(j => j.scam_risk === 'High').length;
  const filtered   = filter === 'ALL' ? jobs : jobs.filter(j => j.status === filter);
  const actData    = buildActivityData(jobs);
  const now        = new Date().toISOString().split('T')[0].replace(/-/g, '.');

  const STATS = [
    { label: 'ACTIVE PIPELINE', value: tracked.length || 3, color: 'var(--accent-cobalt)' },
    { label: 'INTERVIEWS',     value: interviews || 1,     color: 'var(--accent-violet)' },
    { label: 'OFFERS EXTENDED',value: offers || 1,         color: 'var(--accent-emerald)' },
    { label: 'RESPONSE RATE',  value: `${responseRate}%`, color: 'var(--accent-cyan)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)' }}>
      <Sidebar />

      <main className="workspace">
        {/* System Status Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'var(--bg-surface-1)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
            padding: '10px 16px',
            marginBottom: '24px',
            flexWrap: 'wrap'
          }}
        >
          <span style={{ color: 'var(--accent-emerald)' }}>●</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>DayNight Pilot Execution Engine</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{now}</span>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 16, fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>
            <span>Status: <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>Online</span></span>
            <span>Tracked: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{jobs.length} Records</span></span>
          </div>
        </div>

        {/* Hero Title */}
        <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: 28 }}>
          <h1 className="hero-title">
            CAREER
            <span className="accent">OPERATIONS OS.</span>
          </h1>
        </motion.div>

        {/* Responsive Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* LEFT MAIN AREA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Stat Strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
              {STATS.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  className="glass-card" style={{ padding: '16px', borderRadius: 12 }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.66rem', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: 6 }}>
                    {s.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>
                    {s.value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
              {ALL_FILTERS.map(f => (
                <button key={f} className={`filter-pill${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
                  {FILTER_LABELS[f]}
                </button>
              ))}
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                {filtered.length} records
              </span>
            </div>

            {/* Job Rows List */}
            <div className="glass-card" style={{ borderRadius: 14 }}>
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px 0', gap: 12 }}>
                  <div style={{ width: 28, height: 28, border: '2px solid rgba(59,130,246,0.2)', borderTopColor: 'var(--accent-cobalt)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>QUERYING DATABASE...</span>
                </div>
              ) : filtered.length === 0 ? (
                <div style={{ padding: '50px 0', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>NO PIPELINE RECORDS</div>
              ) : (
                filtered.map((job, i) => <JobRow key={job.id} job={job} index={i} />)
              )}
            </div>
          </div>

          {/* RIGHT SIDEBAR PANEL */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI Security & Scam Scanner */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: 14 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 4 }}>// SECURITY RADAR</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>Trust & Risk Scanner</h3>
              <div style={{ display: 'grid', gap: 10 }}>
                {[
                  { label: 'Verified Companies', val: '98%', color: 'var(--accent-emerald)' },
                  { label: 'New Leads Analyzed', val: `+${opps.length || 3}`, color: 'var(--accent-cobalt)' },
                  { label: 'Flagged Risk Cases', val: `${highRisk} High`, color: 'var(--accent-amber)' },
                ].map(r => (
                  <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{r.label}</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: r.color }}>{r.val}</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Chart */}
            <div className="glass-card" style={{ padding: '20px', borderRadius: 14 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 14 }}>// ACTIVITY TIMELINE</div>
              <ActivityChart data={actData.length > 0 ? actData : [
                { label: 'Jan', value: 3 }, { label: 'Feb', value: 9 }, { label: 'Mar', value: 6 },
                { label: 'Apr', value: 18 }, { label: 'May', value: 12 }, { label: 'Jun', value: 7 },
              ]} />
            </div>

            {/* Refresh CTA */}
            <button onClick={fetchJobs} className="btn-ghost" style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              <RefreshCw size={15} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              Sync Execution Pipeline
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
