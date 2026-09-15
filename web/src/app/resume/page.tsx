'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
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
  FileCheck
} from 'lucide-react';

interface ResumeVersion {
  id: string;
  title: string;
  targetRole: string;
  atsScore: number;
  keySkills: string[];
  missingSkills: string[];
  applicationsCount: number;
  updatedAt: string;
  bulletPoints: string[];
}

const MOCK_RESUMES: ResumeVersion[] = [
  {
    id: 'res-1',
    title: 'Backend Engineer v2 (Core)',
    targetRole: 'Backend / Systems Engineer',
    atsScore: 92,
    keySkills: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'System Design'],
    missingSkills: ['Kubernetes', 'gRPC'],
    applicationsCount: 14,
    updatedAt: '2 days ago',
    bulletPoints: [
      'Architected distributed email intake engine processing 10,000+ messages daily with 99.4% classification precision.',
      'Optimized PostgreSQL query performance, reducing median endpoint latency by 42% under load.'
    ]
  },
  {
    id: 'res-2',
    title: 'Full Stack Engineer v1',
    targetRole: 'Full Stack Engineer',
    atsScore: 88,
    keySkills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'Tailwind CSS'],
    missingSkills: ['GraphQL'],
    applicationsCount: 8,
    updatedAt: 'May 28, 2026',
    bulletPoints: [
      'Built real-time SaaS dashboard with Next.js App Router, Framer Motion, and global Command Palette (⌘K).',
      'Engineered multi-tenant RBAC system enforcing strict server-side authorization policies.'
    ]
  },
  {
    id: 'res-3',
    title: 'AI / ML Engineer v1',
    targetRole: 'AI Application Engineer',
    atsScore: 86,
    keySkills: ['Python', 'PyTorch', 'Gemini API', 'OpenAI API', 'RAG', 'Vector Search'],
    missingSkills: ['MLOps'],
    applicationsCount: 5,
    updatedAt: 'May 20, 2026',
    bulletPoints: [
      'Implemented agentic tool-calling architecture with JSON schema validation and confidence scoring.',
      'Integrated RAG vector pipeline for structured long-context career memory retrieval.'
    ]
  }
];

export default function ResumePage() {
  const [resumes] = useState<ResumeVersion[]>(MOCK_RESUMES);
  const [selectedResume, setSelectedResume] = useState<ResumeVersion>(MOCK_RESUMES[0]);
  const [generatedTailored, setGeneratedTailored] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <FileText size={14} />
          RESUME INTELLIGENCE WORKSPACE
        </div>

        <div className="page-heading">
          <div>
            <h1>Resume Version Workspace</h1>
            <p>Manage role-tailored resumes, ATS score analysis, bullet optimization, and application linkages.</p>
          </div>
          <button className="primary-button">
            <Upload size={16} /> Upload New Resume
          </button>
        </div>

        {/* Responsive 2-Column Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Version Library */}
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700 }}>
              // RESUME VERSION LIBRARY ({resumes.length})
            </div>

            {resumes.map((res) => (
              <motion.div
                key={res.id}
                whileHover={{ scale: 1.01 }}
                className="glass-card"
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  border: selectedResume.id === res.id ? '2px solid var(--accent-cobalt)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedResume(res)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{res.title}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{res.targetRole}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(16, 185, 129, 0.14)',
                      color: '#34d399',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    {res.atsScore}% ATS
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', fontSize: '0.74rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <span>Used in {res.applicationsCount} applications</span>
                  <span>Updated {res.updatedAt}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Detailed Intelligence Sheet */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cobalt)', fontWeight: 700 }}>
                  ACTIVE VERSION ANALYSIS
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
                  {selectedResume.title}
                </h2>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Target Role: {selectedResume.targetRole}</div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-display)', lineHeight: 1 }}>
                  {selectedResume.atsScore}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>ATS Compatibility</div>
              </div>
            </div>

            {/* AI Bullet Point Optimizer Section */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} style={{ color: 'var(--accent-amber)' }} /> AI Quantified Bullet Points
              </h3>

              <div style={{ display: 'grid', gap: '12px' }}>
                {selectedResume.bulletPoints.map((bp, i) => (
                  <div key={i} style={{ padding: '14px 16px', background: 'var(--bg-surface-2)', borderRadius: '10px', border: '1px solid var(--border-subtle)', fontSize: '0.86rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    • {bp}
                  </div>
                ))}
              </div>
            </div>

            {/* Keyword Coverage */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Extracted Skills & Keyword Coverage
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedResume.keySkills.map((sk) => (
                  <span key={sk} style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', padding: '4px 10px', borderRadius: '6px', background: 'rgba(59, 130, 246, 0.12)', color: '#93c5fd', border: '1px solid rgba(59, 130, 246, 0.3)' }}>
                    {sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)' }}>
              <button className="primary-button" onClick={() => setGeneratedTailored(true)}>
                <Zap size={16} /> Tailor Resume for Target Job Description
              </button>
              <button className="btn-ghost">
                <FileCheck size={16} /> Generate Cover Letter
              </button>
            </div>

            {generatedTailored && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '16px', padding: '14px 16px', background: 'rgba(16, 185, 129, 0.14)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.85rem' }}>
                ✓ Generated tailored variant: <strong>{selectedResume.title} (Tailored)</strong> with 96% target keyword coverage!
              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
