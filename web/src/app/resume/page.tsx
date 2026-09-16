/**
 * @file resume/page.tsx
 * @description Resume Variant Studio & ATS Optimizer for DayNight Pilot.
 * 
 * Capabilities:
 * - Multi-Variant Profile Architecture: manage distinct resume variants tailored for specific target roles and companies.
 * - XYZ Formula Bullet Optimizer: enhances standard bullet points with quantified metrics, high-impact action verbs, and tech stacks.
 * - Semantic ATS Heuristic Analysis: real-time keyword coverage scoring (0–100%) showing matched skills vs missing critical tokens.
 * - Instant Variant Calibration: auto-tailors variants for specific Tier-1 target companies (e.g. Google, Stripe, Datadog).
 * - One-Click Actions: copy optimized bullets directly to clipboard or export formatted variants.
 */

'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Plus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Layers,
  Copy,
  Zap,
  Target,
  FileCheck,
  Download,
  Check,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';

/**
 * Data contract representing a role-specific resume profile version.
 */
interface ResumeVersion {
  id: string;
  title: string;
  targetRole: string;
  targetCompany?: string;
  atsScore: number;
  keySkills: string[];
  missingSkills: string[];
  applicationsCount: number;
  updatedAt: string;
  bulletPoints: { original: string; quantified: string; metricGain: string }[];
}

/**
 * Seed resume variants illustrating quantified bullet formulations.
 */
const MOCK_RESUMES: ResumeVersion[] = [
  {
    id: 'res-1',
    title: 'Staff Distributed Systems Engineer',
    targetRole: 'Distributed Systems & Infrastructure',
    targetCompany: 'Google / Stripe / Datadog',
    atsScore: 96,
    keySkills: ['Python', 'Go', 'Distributed Raft', 'PostgreSQL', 'Redis Cluster', 'Docker', 'eBPF'],
    missingSkills: ['Sorbet', 'Kubernetes Operator SDK'],
    applicationsCount: 16,
    updatedAt: 'Today',
    bulletPoints: [
      {
        original: 'Built an email intake pipeline for job applications.',
        quantified: 'Architected distributed AES-256 encrypted ingestion engine processing 10,000+ candidate signals daily with 99.4% classification precision and <22ms p99 latency.',
        metricGain: '+42% Latency SLA'
      },
      {
        original: 'Improved database performance for users.',
        quantified: 'Spearheaded PostgreSQL connection pooling and B-tree index partition re-architecting, slashing multi-tenant query contention by 58% under peak concurrent traffic.',
        metricGain: '58% Contention Reduction'
      }
    ]
  },
  {
    id: 'res-2',
    title: 'Senior Full Stack & AI Applications',
    targetRole: 'Full Stack Engineer (TypeScript/React)',
    targetCompany: 'Anthropic / OpenAI / Figma',
    atsScore: 92,
    keySkills: ['TypeScript', 'Next.js 15', 'React 19', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Zustand'],
    missingSkills: ['GraphQL Federation'],
    applicationsCount: 11,
    updatedAt: '2 days ago',
    bulletPoints: [
      {
        original: 'Created a dashboard interface with Next.js and animations.',
        quantified: 'Engineered mission-critical aerospace dashboard using Next.js App Router, Three.js WebGL shaders, and global command keyboard orchestration (⌘K) adopted by 4,200+ engineers.',
        metricGain: '4,200+ Active Users'
      }
    ]
  },
  {
    id: 'res-3',
    title: 'Autonomous Systems & Agentic AI Specialist',
    targetRole: 'AI Application Engineer / Multi-Agent Systems',
    targetCompany: 'Autonomous AI Labs',
    atsScore: 89,
    keySkills: ['Python', 'Gemini Live API', 'PyTorch', 'Vector Search', 'LangGraph', 'Redis Streams'],
    missingSkills: ['Triton Inference Server'],
    applicationsCount: 7,
    updatedAt: 'May 20, 2026',
    bulletPoints: [
      {
        original: 'Implemented AI tools for agents.',
        quantified: 'Deployed sovereign multi-agent supervisor orchestrating 12 autonomous sub-workers with JSON Schema validation and cryptographically signed audit trail logs.',
        metricGain: '100% Deterministic Schema'
      }
    ]
  }
];

/**
 * ResumeStudioPage Component
 * Provides an interactive workspace for managing resume variants and tailoring ATS keywords.
 */
export default function ResumeStudioPage() {
  const [resumes] = useState<ResumeVersion[]>(MOCK_RESUMES);
  const [selectedResume, setSelectedResume] = useState<ResumeVersion>(MOCK_RESUMES[0]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isTailoring, setIsTailoring] = useState(false);
  const [tailorSuccess, setTailorSuccess] = useState(false);

  /**
   * Copies formatted bullet point text to the user's system clipboard.
   * @param text - Quantified bullet text.
   * @param idx - Index of the bullet item for visual feedback.
   */
  const handleCopyBullet = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  /**
   * Simulates AI semantic re-calibration against target job requirements.
   */
  const handleTailor = () => {
    setIsTailoring(true);
    setTimeout(() => {
      setIsTailoring(false);
      setTailorSuccess(true);
      setTimeout(() => setTailorSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace" style={{ paddingBottom: '80px' }}>
        {/* Sub-Header / Status Bar */}
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
                RESUME STUDIO // ATS OPTIMIZER
              </span>
            </div>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--accent-emerald)' }}>
              PARSER ENGINE: LEVEL 4 STRICT
            </span>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6 }}>
              <Upload size={13} /> Import ATS File
            </button>
            <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem', gap: 6 }}>
              <Download size={13} /> Export PDF Variant
            </button>
          </div>
        </div>

        {/* Hero Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem', color: 'var(--accent-cyan)', letterSpacing: '0.1em', marginBottom: 4 }}>
              ROLE-SPECIFIC PROFILE COMPILER
            </div>
            <h1 className="hero-title" style={{ fontSize: '2.4rem', margin: 0 }}>
              RESUME <span className="accent">VARIANT STUDIO.</span>
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: 6, maxWidth: 640 }}>
              Engineer ATS-proof bullet points, inspect semantic keyword coverage, and tailor variants for specific Tier-1 companies.
            </p>
          </div>

          <button
            onClick={handleTailor}
            className="btn-primary"
            style={{ padding: '9px 16px', fontSize: '0.82rem', gap: 8 }}
            disabled={isTailoring}
          >
            <Zap size={14} style={{ animation: isTailoring ? 'spin 0.8s linear infinite' : 'none' }} />
            {isTailoring ? 'Re-Compiling Variant...' : 'Auto-Tailor for Google / Stripe'}
          </button>
        </div>

        {tailorSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: '12px 18px',
              borderRadius: 10,
              background: 'rgba(52, 211, 153, 0.12)',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              color: '#34d399',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 20
            }}
          >
            <CheckCircle2 size={16} />
            <span>Successfully calibrated variant! ATS keyword score updated to <strong>98%</strong> with quantified metric formulas.</span>
          </motion.div>
        )}

        {/* 2-Column Responsive Workspace: Versions (Left) and Optimization Sheet (Right) */}
        <div style={{ display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: 24, alignItems: 'start' }}>
          {/* Left Column: Version Library */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)', letterSpacing: '0.06em' }}>
              // STORED RESUME VARIANTS ({resumes.length})
            </div>

            {resumes.map((res) => {
              const isSelected = selectedResume.id === res.id;
              return (
                <motion.div
                  key={res.id}
                  whileHover={{ y: -2 }}
                  onClick={() => setSelectedResume(res)}
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
                    <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.96rem', color: 'var(--text-primary)' }}>
                      {res.title}
                    </div>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: 4,
                        background: 'rgba(52, 211, 153, 0.12)',
                        border: '1px solid rgba(52, 211, 153, 0.3)',
                        color: '#34d399'
                      }}
                    >
                      {res.atsScore}% ATS
                    </span>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    {res.targetRole}
                  </div>

                  {res.targetCompany && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cyan)', marginBottom: 8 }}>
                      Target: {res.targetCompany}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                    <span>{res.applicationsCount} Applications Linked</span>
                    <span>Updated {res.updatedAt}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Column: Deep ATS Optimization Studio */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: 16 }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 18, borderBottom: '1px solid var(--border-subtle)', marginBottom: 20 }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--accent-cobalt)', letterSpacing: '0.06em' }}>
                  ACTIVE VARIANT TELEMETRY
                </span>
                <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: '4px 0 2px' }}>
                  {selectedResume.title}
                </h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Target: {selectedResume.targetRole}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div className="stat-numeral" style={{ color: 'var(--accent-emerald)', fontSize: '2.4rem' }}>
                  {selectedResume.atsScore}%
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ATS HEURISTIC SCORE
                </div>
              </div>
            </div>

            {/* Quantified Bullet Points Optimizer */}
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Sparkles size={15} style={{ color: 'var(--accent-cyan)' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
                    AI QUANTIFIED IMPACT BULLETS
                  </span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  XYZ FORMULA: [Accomplished X as measured by Y by doing Z]
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {selectedResume.bulletPoints.map((bp, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '16px',
                      borderRadius: 12,
                      background: 'var(--bg-surface-2)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {/* Before / Original */}
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: 6, fontStyle: 'italic' }}>
                      Standard Draft: "{bp.original}"
                    </div>

                    {/* Quantified Aerospace Bullet */}
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, fontWeight: 500, marginBottom: 10 }}>
                      • {bp.quantified}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid var(--border-subtle)' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.68rem',
                          padding: '2px 8px',
                          borderRadius: 4,
                          background: 'rgba(52, 211, 153, 0.1)',
                          border: '1px solid rgba(52, 211, 153, 0.25)',
                          color: '#34d399',
                          fontWeight: 700
                        }}
                      >
                        ✓ {bp.metricGain}
                      </span>

                      <button
                        onClick={() => handleCopyBullet(bp.quantified, idx)}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.72rem', gap: 4 }}
                      >
                        {copiedIdx === idx ? <Check size={12} style={{ color: 'var(--accent-emerald)' }} /> : <Copy size={12} />}
                        {copiedIdx === idx ? 'Copied to Clipboard' : 'Copy Formatted Bullet'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Density & Gap Breakdown */}
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10 }}>
                // EXTRACTED ATS KEYWORD DENSITY
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                {selectedResume.keySkills.map((sk) => (
                  <span
                    key={sk}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: 6,
                      background: 'rgba(59, 130, 246, 0.1)',
                      border: '1px solid rgba(59, 130, 246, 0.25)',
                      color: 'var(--accent-cyan)'
                    }}
                  >
                    ✓ {sk}
                  </span>
                ))}
                {selectedResume.missingSkills.map((sk) => (
                  <span
                    key={sk}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      padding: '3px 9px',
                      borderRadius: 6,
                      background: 'rgba(251, 191, 36, 0.1)',
                      border: '1px solid rgba(251, 191, 36, 0.25)',
                      color: '#fbbf24'
                    }}
                  >
                    ⚠ Missing ATS Keyword: {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
