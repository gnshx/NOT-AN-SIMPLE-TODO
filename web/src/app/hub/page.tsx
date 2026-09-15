'use client';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Sparkles,
  Briefcase,
  Calendar,
  Video,
  FileText,
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export default function HubPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <LayoutDashboard size={14} />
          CENTRAL EXECUTION HUB
        </div>

        <div className="page-heading">
          <div>
            <h1>Central Command Hub</h1>
            <p>Unified executive portal connecting career strategy, AI actions, and task execution.</p>
          </div>
        </div>

        {/* 4 Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
          <div className="glass-card" style={{ padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>AI Action Review Queue</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>3 Proposed Operations Pending</div>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Inspect and approve AI-generated status transitions, draft recruiter emails, and study blocks.
            </p>
            <Link href="/ai-review" className="primary-button" style={{ display: 'inline-flex' }}>
              Open Review Center <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#93c5fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Video size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Interview Center & AI Coach</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Google Technical Round in 2 days</div>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Launch interactive mock interview sessions and generate STAR frameworks.
            </p>
            <Link href="/interviews" className="btn-neural" style={{ display: 'inline-flex', width: 'auto' }}>
              Open Interview Center <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(0, 229, 153, 0.15)', color: '#6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Resume Intelligence Workspace</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>3 Versions • 92% ATS Highest Score</div>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              Tailor resumes per job description and optimize bullet points with quantifiable metrics.
            </p>
            <Link href="/resume" className="btn-ghost" style={{ display: 'inline-flex' }}>
              Open Resume Workspace <ArrowRight size={14} />
            </Link>
          </div>

          <div className="glass-card" style={{ padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>Daily Command Center (Today)</h3>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>4 Time-Blocked Priorities</div>
              </div>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px' }}>
              View your automated daily execution plan optimized by AI Pilot.
            </p>
            <Link href="/today" className="btn-ghost" style={{ display: 'inline-flex' }}>
              Open Today Center <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
