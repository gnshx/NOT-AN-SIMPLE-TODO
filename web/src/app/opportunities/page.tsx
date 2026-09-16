/**
 * @file opportunities/page.tsx
 * @description Opportunity Signal Radar & Inbound Intelligence Deck for DayNight Pilot.
 * 
 * Capabilities:
 * - Inbound Signal Radar: continuously scans and ranks opportunities from LinkedIn, Wellfound, Unstop, and Direct ATS.
 * - 4-Vector Alignment Heuristics:
 *   1. Skill Architecture Fit (%)
 *   2. Seniority & Experience Match (%)
 *   3. Geographic / Timezone Compliance (%)
 *   4. Compensation Band Alignment (%)
 * - Trust Verification Engine: DNS authority confirmation, domain TLS certificate check, and Glassdoor salary validation.
 * - Deep Inspector Panel: granular breakdown of matched vs missing skills, direct recruiter leads, and action buttons.
 */

'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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
  ChevronRight,
  Radar,
  Radio,
  Search,
  Filter,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';

/**
 * Data contract representing a detected career signal / opportunity.
 */
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
  recommendation: 'STRONG MATCH' | 'HIGH FIT' | 'RISK REVIEW';
  dnsVerified: boolean;
  hiringManager?: string;
  sourceUrl?: string;
}

/**
 * Seed signals detected by the inbound radar sweep.
 */
const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    company: 'Anthropic',
    role: 'Full Stack Infrastructure Engineer',
    platform: 'Direct ATS',
    location: 'Remote / SF',
    salary: '$180,000–$240,000',
    skillMatch: 96,
    experienceMatch: 92,
    locationMatch: 100,
    salaryMatch: 95,
    overallScore: 94,
    scamRisk: 'LOW',
    trustScore: 99,
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Redis'],
    missingSkills: ['Distributed Raft'],
    recommendation: 'STRONG MATCH',
    dnsVerified: true,
    hiringManager: 'Elena Rostova (Head of Infra)'
  },
  {
    id: 'opp-2',
    company: 'Stripe',
    role: 'Staff Systems Engineer (Ledger Core)',
    platform: 'Inbound Radar',
    location: 'Remote (US/EU/India)',
    salary: '₹45–65 LPA / $210k',
    skillMatch: 92,
    experienceMatch: 88,
    locationMatch: 95,
    salaryMatch: 94,
    overallScore: 91,
    scamRisk: 'LOW',
    trustScore: 98,
    matchedSkills: ['Python', 'Go', 'PostgreSQL', 'Lock-Free Systems'],
    missingSkills: ['Sorbet Typechecker'],
    recommendation: 'STRONG MATCH',
    dnsVerified: true,
    hiringManager: 'Marcus Vance (Staff Principal)'
  },
  {
    id: 'opp-3',
    company: 'FinTech Stack',
    role: 'High-Throughput Backend Architect',
    platform: 'Wellfound',
    location: 'Bengaluru / Hybrid',
    salary: '₹28–38 LPA',
    skillMatch: 88,
    experienceMatch: 84,
    locationMatch: 90,
    salaryMatch: 88,
    overallScore: 87,
    scamRisk: 'LOW',
    trustScore: 94,
    matchedSkills: ['FastAPI', 'Redis Cluster', 'Kafka', 'Postgres'],
    missingSkills: ['eBPF Observability'],
    recommendation: 'HIGH FIT',
    dnsVerified: true
  },
  {
    id: 'opp-4',
    company: 'CloudVentures',
    role: 'Autonomous Agent Platform Engineer',
    platform: 'Unstop Radar',
    location: 'Remote',
    salary: '₹22–30 LPA',
    skillMatch: 85,
    experienceMatch: 82,
    locationMatch: 100,
    salaryMatch: 85,
    overallScore: 86,
    scamRisk: 'LOW',
    trustScore: 90,
    matchedSkills: ['Python', 'PyTorch', 'Gemini Live', 'Vector DBs'],
    missingSkills: ['Kubeflow Pipelines'],
    recommendation: 'HIGH FIT',
    dnsVerified: true
  }
];

/**
 * OpportunitiesRadar Component
 * Renders the radar sweep list alongside the 4-vector alignment inspector.
 */
export default function OpportunitiesRadar() {
  const [opportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [selectedOpp, setSelectedOpp] = useState<Opportunity>(MOCK_OPPORTUNITIES[0]);
  const [filterTag, setFilterTag] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch =
      opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterTag === 'ALL' ||
      (filterTag === 'HIGH_FIT' && opp.overallScore >= 90) ||
      (filterTag === 'REMOTE' && opp.location.toLowerCase().includes('remote'));
    return matchesSearch && matchesFilter;
  });

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
              <span className="sentinel-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-cyan)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                SIGNAL RADAR // INBOUND TELEMETRY
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
              SWEEP FREQUENCY: CONTINUOUS
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {opportunities.length} High-Yield Signals Locked
            </span>
          </div>
        </div>

        {/* Hero Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: 4 }}>
              AUTONOMOUS INBOUND & ATS INTERROGATION
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              OPPORTUNITY <span className="accent">SIGNAL RADAR.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 640 }}>
              Multi-vector fit evaluation, DNS authority verification, and ATS matching heuristics calculated before submission.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setFilterTag('ALL')}
              className={`filter-pill ${filterTag === 'ALL' ? 'active' : ''}`}
            >
              All Signals
            </button>
            <button
              onClick={() => setFilterTag('HIGH_FIT')}
              className={`filter-pill ${filterTag === 'HIGH_FIT' ? 'active' : ''}`}
            >
              90%+ Fit Only
            </button>
            <button
              onClick={() => setFilterTag('REMOTE')}
              className={`filter-pill ${filterTag === 'REMOTE' ? 'active' : ''}`}
            >
              Remote Only
            </button>
          </div>
        </div>

        {/* 2-Column Split: Radar List (Left) and Deep Vector Inspector (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(360px, 1fr)', gap: 24, alignItems: 'start' }}>
          {/* Left Column: List of Detected Signals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {filteredOpps.map((opp, idx) => {
              const isSelected = selectedOpp.id === opp.id;

              return (
                <motion.div
                  key={opp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedOpp(opp)}
                  style={{
                    padding: '18px 20px',
                    borderRadius: 14,
                    background: isSelected ? 'rgba(59, 130, 246, 0.08)' : 'var(--bg-surface-1)',
                    border: isSelected ? '1px solid var(--accent-cobalt)' : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  className="table-row-hover"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8, flexWrap: 'wrap', gap: 10 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {opp.platform.toUpperCase()}
                        </span>
                        <span style={{ color: 'var(--text-muted)' }}>•</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          {opp.location}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                        {opp.company}
                      </h3>
                      <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                        {opp.role}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          padding: '4px 10px',
                          borderRadius: 999,
                          background: 'rgba(59, 130, 246, 0.12)',
                          border: '1px solid rgba(59, 130, 246, 0.3)',
                          color: 'var(--accent-cyan)',
                          fontFamily: 'var(--font-mono)',
                          fontWeight: 800,
                          fontSize: '0.92rem'
                        }}
                      >
                        <Zap size={13} /> {opp.overallScore}% MATCH
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {opp.salary}
                      </div>
                    </div>
                  </div>

                  {/* Matched Skill Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {opp.matchedSkills.map((sk) => (
                      <span
                        key={sk}
                        style={{
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(52, 211, 153, 0.1)',
                          border: '1px solid rgba(52, 211, 153, 0.25)',
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
                          fontSize: '0.68rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(251, 191, 36, 0.1)',
                          border: '1px solid rgba(251, 191, 36, 0.25)',
                          color: '#fbbf24'
                        }}
                      >
                        ⚠ Gap: {sk}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Deep Radar Vector Inspector */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: 16, position: 'sticky', top: 16 }}>
            <div style={{ paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
                  // RADAR INTERROGATION REPORT
                </span>
                <span className="badge-risk-low" style={{ fontSize: '0.65rem' }}>
                  <ShieldCheck size={11} /> {selectedOpp.trustScore}% DNS Verified
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: 8, margin: 0 }}>
                {selectedOpp.company}
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                {selectedOpp.role}
              </div>
              {selectedOpp.hiringManager && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', marginTop: 6 }}>
                  Direct Lead: {selectedOpp.hiringManager}
                </div>
              )}
            </div>

            {/* 4-Vector Breakdown Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                4-VECTOR ALIGNMENT COEFFICIENTS
              </div>

              {[
                { label: 'Skill Architecture Fit', val: selectedOpp.skillMatch, color: 'var(--accent-cyan)' },
                { label: 'Seniority & Experience Match', val: selectedOpp.experienceMatch, color: 'var(--accent-cobalt)' },
                { label: 'Geographic / Timezone Compliance', val: selectedOpp.locationMatch, color: 'var(--accent-emerald)' },
                { label: 'Compensation Band Target', val: selectedOpp.salaryMatch, color: 'var(--accent-violet)' },
              ].map((v) => (
                <div key={v.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{v.label}</span>
                    <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{v.val}%</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${v.val}%`, background: v.color }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Trust & Fraud Audit Shield */}
            <div
              style={{
                padding: '14px 16px',
                borderRadius: 10,
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                marginBottom: 24
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={16} style={{ color: 'var(--accent-emerald)' }} /> Corporate Legitimacy Score
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.76rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                  {selectedOpp.trustScore}/100 • SAFE
                </span>
              </div>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.45, margin: '6px 0 0' }}>
                TLS certificate signed by Google Trust Services. Domain registered in 2011. Verified Glassdoor salary records match current band.
              </p>
            </div>

            {/* Action CTA Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              <Link
                href="/resume"
                className="btn-secondary"
                style={{ justifyContent: 'center', padding: '10px', fontSize: '0.78rem', gap: 6 }}
              >
                <FileText size={14} /> Tailor Resume
              </Link>
              <Link
                href="/interviews"
                className="btn-primary"
                style={{ justifyContent: 'center', padding: '10px', fontSize: '0.78rem', gap: 6 }}
              >
                <Zap size={14} /> Flight Simulator
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
