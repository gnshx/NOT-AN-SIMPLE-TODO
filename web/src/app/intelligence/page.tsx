'use client';
import Sidebar from '@/components/Sidebar';
import ActivityChart from '@/components/ActivityChart';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Sparkles,
  TrendingUp,
  Award,
  Zap,
  Target,
  ArrowUpRight,
  GitBranch,
  Layers
} from 'lucide-react';

export default function IntelligencePage() {
  const funnelData = [
    { stage: 'Applications Submitted', count: 42, pct: 100 },
    { stage: 'Under Review / Shortlisted', count: 28, pct: 66.6 },
    { stage: 'Online Assessments (OA)', count: 12, pct: 28.5 },
    { stage: 'Interviews Scheduled', count: 7, pct: 16.6 },
    { stage: 'Offers Extended', count: 2, pct: 4.7 }
  ];

  const graphNodes = [
    { company: 'Google', role: 'Software Engineer', skills: ['React', 'TypeScript', 'Distributed Systems', 'SQL'], status: 'Interview' },
    { company: 'Stripe', role: 'Backend Engineer', skills: ['Python', 'PostgreSQL', 'Redis', 'gRPC'], status: 'Under Review' },
    { company: 'Acme Corp', role: 'Full Stack Engineer', skills: ['Next.js', 'Node.js', 'PostgreSQL', 'Tailwind'], status: 'OA Sent' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <BarChart3 size={14} />
          CAREER GRAPH & DECISION INTELLIGENCE
        </div>

        <div className="page-heading">
          <div>
            <h1>Career Intelligence Engine</h1>
            <p>Reasoning over graph relationships between companies, skills, resumes, and interview outcomes.</p>
          </div>
        </div>

        {/* AI Insight Card */}
        <div
          style={{
            padding: '20px 24px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: 'var(--text-primary)',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-md)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.76rem', color: '#a78bfa', fontFamily: 'var(--font-mono)', fontWeight: 700, marginBottom: '6px' }}>
            <Sparkles size={16} style={{ color: 'var(--accent-amber)' }} /> AI DECISION INSIGHT & OBSERVATION
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 700, lineHeight: 1.5 }}>
            "Your interview conversion rate is <strong style={{ color: '#34d399' }}>2.2× higher</strong> when using your Backend-focused Resume v2 compared to General Full Stack v1. High-demand skills matched across 80% of calls: <strong style={{ color: '#93c5fd' }}>Python, PostgreSQL, Distributed Systems</strong>."
          </div>
        </div>

        {/* Top Metric Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '28px' }}>
          {[
            { label: 'APPLICATION VOLUME', val: '42', color: 'var(--accent-cobalt)', change: '+12 this month' },
            { label: 'RESPONSE RATE', val: '31%', color: 'var(--accent-emerald)', change: '+4.2% vs avg' },
            { label: 'INTERVIEW RATE', val: '16.6%', color: 'var(--accent-violet)', change: '7 scheduled' },
            { label: 'AVG RESPONSE SPEED', val: '6.2 Days', color: 'var(--accent-amber)', change: '2.1 days faster' }
          ].map((s) => (
            <div key={s.label} className="glass-card" style={{ padding: '18px', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700 }}>
                {s.label}
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color, marginTop: '4px', fontFamily: 'var(--font-display)' }}>
                {s.val}
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                <ArrowUpRight size={12} style={{ color: 'var(--accent-emerald)' }} /> {s.change}
              </div>
            </div>
          ))}
        </div>

        {/* 2 Column Layout: Graph Relationships + Conversion Funnel */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Career Entity Graph Breakdown */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
              <GitBranch size={18} style={{ color: 'var(--accent-cobalt)' }} /> Career Graph Entity Breakdown
            </h3>

            <div style={{ display: 'grid', gap: '14px' }}>
              {graphNodes.map((node) => (
                <div key={node.company} style={{ padding: '16px', background: 'var(--bg-surface-2)', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{node.company}</strong>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{node.role}</div>
                    </div>
                    <span className="badge badge-interview">{node.status}</span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {node.skills.map((sk) => (
                      <span key={sk} style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', padding: '3px 8px', borderRadius: '4px', background: 'var(--bg-surface-1)', border: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
              <Layers size={18} style={{ color: 'var(--accent-violet)' }} /> Pipeline Conversion Funnel
            </h3>

            <div style={{ display: 'grid', gap: '16px' }}>
              {funnelData.map((f) => (
                <div key={f.stage}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{f.stage}</span>
                    <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{f.count} ({Math.round(f.pct)}%)</strong>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${f.pct}%`, background: 'var(--accent-violet)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
