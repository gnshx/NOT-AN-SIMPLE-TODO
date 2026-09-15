'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Briefcase,
  MapPin,
  DollarSign,
  FileText,
  Video,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface Opportunity {
  id: string;
  company: string;
  role: string;
  platform: string;
  location: string;
  salary: string;
  skillMatch: number;
  experienceMatch: number;
  locationMatch: number;
  salaryMatch: number;
  overallScore: number;
  scamRisk: 'LOW' | 'MEDIUM' | 'HIGH';
  trustScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: 'APPLY' | 'HIGH FIT' | 'RISK REVIEW';
}

const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    company: 'Acme Corp',
    role: 'Full Stack Engineer',
    platform: 'LinkedIn',
    location: 'Remote (Bengaluru / India)',
    salary: '₹14–20 LPA',
    skillMatch: 94,
    experienceMatch: 88,
    locationMatch: 100,
    salaryMatch: 85,
    overallScore: 91,
    scamRisk: 'LOW',
    trustScore: 95,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    missingSkills: ['Kubernetes'],
    recommendation: 'APPLY'
  },
  {
    id: 'opp-2',
    company: 'FinTech Stack',
    role: 'Backend Systems Engineer',
    platform: 'Wellfound',
    location: 'Hybrid (Bengaluru)',
    salary: '₹18–24 LPA',
    skillMatch: 90,
    experienceMatch: 84,
    locationMatch: 95,
    salaryMatch: 92,
    overallScore: 89,
    scamRisk: 'LOW',
    trustScore: 92,
    matchedSkills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis'],
    missingSkills: ['AWS Lambda'],
    recommendation: 'APPLY'
  },
  {
    id: 'opp-3',
    company: 'CloudVentures',
    role: 'AI / ML Engineer',
    platform: 'Unstop',
    location: 'Remote',
    salary: '₹16–22 LPA',
    skillMatch: 85,
    experienceMatch: 80,
    locationMatch: 100,
    salaryMatch: 88,
    overallScore: 86,
    scamRisk: 'LOW',
    trustScore: 88,
    matchedSkills: ['Python', 'PyTorch', 'Gemini API', 'Vector DB'],
    missingSkills: ['MLOps / Kubeflow'],
    recommendation: 'HIGH FIT'
  }
];

export default function OpportunitiesPage() {
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(MOCK_OPPORTUNITIES[0]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <Compass size={14} />
          JOB INTELLIGENCE RADAR
        </div>

        <div className="page-heading">
          <div>
            <h1>Opportunity Radar</h1>
            <p>AI-driven opportunity scoring, skill fit breakdown, and trust verification.</p>
          </div>
          <div className="task-count">
            Radar Active: <strong>{opportunities.length} High-Match Leads</strong>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Left Column - List of Opportunities */}
          <div style={{ display: 'grid', gap: '16px' }}>
            {opportunities.map((opp, idx) => (
              <motion.div
                key={opp.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card"
                style={{
                  padding: '20px',
                  borderRadius: '14px',
                  border: selectedOpp?.id === opp.id ? '2px solid var(--accent-cobalt)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedOpp(opp)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        letterSpacing: '0.05em'
                      }}
                    >
                      {opp.platform.toUpperCase()} • {opp.location}
                    </span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px', fontFamily: 'var(--font-display)' }}>
                      {opp.company}
                    </h3>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{opp.role}</div>
                  </div>

                  {/* Overall Match Badge */}
                  <div style={{ textAlign: 'right' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        background: 'rgba(59, 130, 246, 0.14)',
                        border: '1px solid rgba(59, 130, 246, 0.35)',
                        color: '#93c5fd',
                        fontFamily: 'var(--font-display)',
                        fontWeight: 800,
                        fontSize: '1.05rem'
                      }}
                    >
                      <Zap size={14} style={{ color: 'var(--accent-cyan)' }} /> {opp.overallScore}% FIT
                    </div>
                    <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginTop: '4px' }}>{opp.salary}</div>
                  </div>
                </div>

                {/* Skill Chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px' }}>
                  {opp.matchedSkills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(16, 185, 129, 0.12)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        color: '#34d399'
                      }}
                    >
                      ✓ {sk}
                    </span>
                  ))}
                  {opp.missingSkills.map((sk) => (
                    <span
                      key={sk}
                      style={{
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: 'rgba(245, 158, 11, 0.12)',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                        color: '#fbbf24'
                      }}
                    >
                      ⚠ Missing: {sk}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Deep Match & Action Panel */}
          {selectedOpp && (
            <div className="glass-card" style={{ padding: '24px', borderRadius: '14px', position: 'sticky', top: '16px' }}>
              <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                  // DETAILED AI EVALUATION SHEET
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
                  {selectedOpp.company}
                </h2>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{selectedOpp.role}</div>
              </div>

              {/* Match Score Matrix */}
              <div style={{ display: 'grid', gap: '12px', marginBottom: '24px' }}>
                {[
                  { label: 'Skill Fit', val: selectedOpp.skillMatch },
                  { label: 'Experience Alignment', val: selectedOpp.experienceMatch },
                  { label: 'Location Match', val: selectedOpp.locationMatch },
                  { label: 'Salary Match', val: selectedOpp.salaryMatch }
                ].map((m) => (
                  <div key={m.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                      <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{m.val}%</strong>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${m.val}%`, background: 'var(--accent-cobalt)' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Score & Scam Check */}
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)' }} /> Company Trust Rating
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                    {selectedOpp.trustScore}/100 ({selectedOpp.scamRisk} RISK)
                  </span>
                </div>
                <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                  Verified corporate domain, active Glassdoor/LinkedIn presence, no scam reports detected.
                </div>
              </div>

              {/* CTAs */}
              <div style={{ display: 'grid', gap: '10px' }}>
                <button className="primary-button" style={{ width: '100%' }}>
                  <FileText size={16} /> Tailor Resume for {selectedOpp.company}
                </button>
                <button className="btn-neural">
                  <Video size={16} /> Prepare Interview Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
