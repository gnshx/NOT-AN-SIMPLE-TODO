'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import MockInterviewModal from '@/components/MockInterviewModal';
import { motion } from 'framer-motion';
import {
  Video,
  Calendar,
  Clock,
  User,
  Sparkles,
  Play,
  FileText,
  CheckCircle2,
  HelpCircle,
  BookOpen
} from 'lucide-react';

interface InterviewItem {
  id: string;
  company: string;
  role: string;
  stage: string;
  scheduledAt: string;
  interviewer: string;
  prepSheet: string[];
  status: 'SCHEDULED' | 'COMPLETED';
  likelyTopics: string[];
}

const MOCK_INTERVIEWS: InterviewItem[] = [
  {
    id: 'int-1',
    company: 'Google',
    role: 'Software Engineer (Backend)',
    stage: 'Technical Round',
    scheduledAt: 'Friday, 4:00 PM IST',
    interviewer: 'Alex Rivera (Staff Engineer)',
    prepSheet: [
      'Focus area: Distributed caching, Redis pub/sub, and concurrency.',
      'Google news: Expansion of Cloud Platform API endpoints.',
      'Glassdoor question pattern: STAR questions on large-scale outages.'
    ],
    status: 'SCHEDULED',
    likelyTopics: ['System Design', 'Data Structures', 'PostgreSQL Optimization', 'Concurrency']
  },
  {
    id: 'int-2',
    company: 'Acme Corp',
    role: 'Full Stack Engineer',
    stage: 'System Design Round',
    scheduledAt: 'Next Monday, 2:30 PM IST',
    interviewer: 'David Chen (Engineering Manager)',
    prepSheet: [
      'Focus area: Next.js App Router, SSR caching, WebSocket sync.',
      'Company tech stack: React, TypeScript, Node.js, Prisma, PostgreSQL.'
    ],
    status: 'SCHEDULED',
    likelyTopics: ['System Architecture', 'Next.js App Router', 'API Design']
  }
];

export default function InterviewsPage() {
  const [interviews] = useState<InterviewItem[]>(MOCK_INTERVIEWS);
  const [selectedInterview, setSelectedInterview] = useState<InterviewItem>(MOCK_INTERVIEWS[0]);
  const [showMockModal, setShowMockModal] = useState(false);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <Video size={14} />
          INTERVIEW CENTER & AI COACH
        </div>

        <div className="page-heading">
          <div>
            <h1>Interview Workspace</h1>
            <p>Preparation sheets, stage checklists, company intelligence, and interactive AI mock interviews.</p>
          </div>
          <button className="primary-button" onClick={() => setShowMockModal(true)}>
            <Play size={16} /> Start AI Mock Interview
          </button>
        </div>

        {/* Responsive Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', alignItems: 'start' }}>
          {/* Left Column: Scheduled List */}
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', fontWeight: 700 }}>
              // SCHEDULED INTERVIEWS ({interviews.length})
            </div>

            {interviews.map((int) => (
              <motion.div
                key={int.id}
                whileHover={{ scale: 1.01 }}
                className="glass-card"
                style={{
                  padding: '18px',
                  borderRadius: '14px',
                  border: selectedInterview.id === int.id ? '2px solid var(--accent-cobalt)' : '1px solid var(--border-subtle)',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedInterview(int)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{int.company}</h3>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{int.role}</div>
                  </div>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      background: 'rgba(59, 130, 246, 0.14)',
                      color: '#93c5fd',
                      border: '1px solid rgba(59, 130, 246, 0.3)'
                    }}
                  >
                    {int.stage}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', fontSize: '0.76rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <Calendar size={13} style={{ color: 'var(--accent-cyan)' }} />
                  <span>{int.scheduledAt}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Active Preparation Sheet */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <div style={{ paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cobalt)', fontWeight: 700 }}>
                ACTIVE INTERVIEW PREPARATION SHEET
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', fontFamily: 'var(--font-display)' }}>
                {selectedInterview.company} — {selectedInterview.role}
              </h2>
              <div style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Stage: <strong>{selectedInterview.stage}</strong> • Time: <strong>{selectedInterview.scheduledAt}</strong>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Interviewer: {selectedInterview.interviewer}
              </div>
            </div>

            {/* Expected Topics */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                Expected Technical Topics & Focus Areas
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedInterview.likelyTopics.map((top) => (
                  <span
                    key={top}
                    style={{
                      fontSize: '0.74rem',
                      fontFamily: 'var(--font-mono)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      background: 'rgba(59, 130, 246, 0.12)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      color: '#93c5fd'
                    }}
                  >
                    {top}
                  </span>
                ))}
              </div>
            </div>

            {/* Prep Briefing List */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={16} style={{ color: 'var(--accent-cyan)' }} /> Strategic Preparation Briefing
              </h3>

              <div style={{ display: 'grid', gap: '10px' }}>
                {selectedInterview.prepSheet.map((ps, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      background: 'var(--bg-surface-2)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6
                    }}
                  >
                    ▸ {ps}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA to launch AI Mock Interview Modal */}
            <button
              className="primary-button"
              style={{ width: '100%', padding: '12px' }}
              onClick={() => setShowMockModal(true)}
            >
              <Sparkles size={16} /> Launch Interactive AI Mock Interview Session
            </button>
          </div>
        </div>

        {/* Mock Interview Modal */}
        {showMockModal && (
          <MockInterviewModal
            companyName={selectedInterview.company}
            role={selectedInterview.role}
            onClose={() => setShowMockModal(false)}
          />
        )}
      </main>
    </div>
  );
}
