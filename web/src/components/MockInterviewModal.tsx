'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, X, Send, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface MockModalProps {
  companyName: string;
  role: string;
  onClose: () => void;
}

export default function MockInterviewModal({ companyName, role, onClose }: MockModalProps) {
  const [step, setStep] = useState<'QUESTION' | 'FEEDBACK'>('QUESTION');
  const [answerText, setAnswerText] = useState('');

  const sampleQuestion = `Tell me about a challenging backend or distributed system bug you encountered in production at scale, and how you resolved it.`;

  const handleSubmitAnswer = () => {
    if (!answerText.trim()) return;
    setStep('FEEDBACK');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--bg-surface-1)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden',
          color: 'var(--text-primary)'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface-2)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Video size={18} style={{ color: 'var(--accent-cobalt)' }} />
            <div>
              <h3 style={{ fontSize: '0.98rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)', margin: 0 }}>
                AI Mock Interview Simulator
              </h3>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                {companyName} • {role}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ padding: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {step === 'QUESTION' ? (
            <div style={{ display: 'grid', gap: '18px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'var(--bg-surface-2)',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    color: 'var(--accent-cyan)',
                    marginBottom: '6px'
                  }}
                >
                  QUESTION 1 OF 3 • STAR BEHAVIORAL & TECHNICAL
                </div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  "{sampleQuestion}"
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '6px', fontFamily: 'var(--font-mono)' }}>
                  Your Response (Type answer or record voice notes)
                </label>
                <textarea
                  rows={4}
                  placeholder="Outline the Situation, Task, Action you took, and Result achieved..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'var(--bg-surface-2)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={onClose}
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
                <button className="primary-button" onClick={handleSubmitAnswer}>
                  <Send size={15} /> Submit for AI Feedback
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '18px' }}>
              <div
                style={{
                  padding: '16px',
                  borderRadius: '10px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#34d399'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.92rem' }}>
                  <CheckCircle2 size={18} /> Response Evaluated & Score Generated
                </div>
                <div style={{ fontSize: '0.82rem', marginTop: '4px', opacity: 0.9 }}>
                  Overall Answer Fit: <strong>92/100 (Strong STAR Structure)</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)' }}>Key Strengths Identified:</div>
                <ul style={{ paddingLeft: '20px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <li>Clear technical context provided with explicit metrics (latency reduction, daily throughput).</li>
                  <li>Good demonstration of root-cause diagnosis using telemetry logs.</li>
                </ul>

                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>Suggested Recommendation:</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, background: 'var(--bg-surface-2)', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  "Explicitly mention how you communicated post-mortem actions to team stakeholders to show leadership."
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '6px' }}>
                <button
                  className="primary-button"
                  onClick={() => {
                    setStep('QUESTION');
                    setAnswerText('');
                  }}
                >
                  Practice Next Question →
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
