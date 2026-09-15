'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  ShieldCheck,
  Key,
  Sliders,
  FileSpreadsheet,
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MANAGER' | 'MEMBER' | 'VIEWER';
  status: 'ACTIVE' | 'INVITED';
}

const MOCK_MEMBERS: Member[] = [
  { id: 'm-1', name: 'Ganesh (You)', email: 'ganesh@example.com', role: 'OWNER', status: 'ACTIVE' },
  { id: 'm-2', name: 'Sarah Jenkins', email: 'sarah.mentor@career.org', role: 'ADMIN', status: 'ACTIVE' },
  { id: 'm-3', name: 'Alex Rivera', email: 'alex.recruiter@tech.co', role: 'MANAGER', status: 'ACTIVE' }
];

interface AuditLogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  ip: string;
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'al-1', action: 'Approved AI Action: Google Status Update', user: 'Ganesh', timestamp: '12 mins ago', ip: '192.168.1.42' },
  { id: 'al-2', action: 'Generated Resume Tailored Version (Backend v2)', user: 'Ganesh', timestamp: '1 hour ago', ip: '192.168.1.42' },
  { id: 'al-3', action: 'Updated Organization RBAC Policy', user: 'Ganesh', timestamp: 'Yesterday', ip: '192.168.1.42' }
];

export default function OrganizationSettingsPage() {
  const [members] = useState<Member[]>(MOCK_MEMBERS);
  const [autoApproveConfidence, setAutoApproveConfidence] = useState(90);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-obsidian)', color: 'var(--text-primary)' }}>
      <Sidebar />

      <main className="workspace">
        <div className="page-kicker">
          <Building2 size={14} />
          ENTERPRISE GOVERNANCE & RBAC
        </div>

        <div className="page-heading">
          <div>
            <h1>Organization Settings & Governance</h1>
            <p>Manage multi-tenant permissions, team access roles, AI governance, and audit logging.</p>
          </div>
        </div>

        {/* 3 Sections */}
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Section 1: Team & RBAC Members */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
                <Users size={18} style={{ color: 'var(--accent-cobalt)' }} /> Organization Members & Roles ({members.length})
              </h2>
              <button className="primary-button" style={{ padding: '8px 14px', fontSize: '0.8rem' }}>
                + Invite Team Member
              </button>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              {members.map((m) => (
                <div key={m.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--bg-surface-2)', borderRadius: '10px', border: '1px solid var(--border-subtle)', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{m.name}</strong>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{m.email}</div>
                  </div>

                  <span style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '3px 10px', borderRadius: '4px', background: m.role === 'OWNER' ? 'rgba(59, 130, 246, 0.14)' : 'var(--bg-surface-1)', color: m.role === 'OWNER' ? '#93c5fd' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                    {m.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: AI Governance & Safety Rules */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
              <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} /> AI Governance & OWASP Security Controls
            </h2>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                  Auto-Approval Confidence Threshold ({autoApproveConfidence}%)
                </label>
                <input
                  type="range"
                  min={70}
                  max={98}
                  value={autoApproveConfidence}
                  onChange={(e) => setAutoApproveConfidence(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
                <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', fontFamily: 'var(--font-mono)' }}>
                  AI actions below {autoApproveConfidence}% confidence will always require human verification in the AI Review Queue.
                </div>
              </div>

              <div style={{ padding: '14px 16px', background: 'rgba(16, 185, 129, 0.12)', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.82rem' }}>
                ✓ <strong>Strict Policy Active:</strong> Email sending and external side effects ALWAYS require manual confirmation regardless of confidence level.
              </div>
            </div>
          </div>

          {/* Section 3: Audit Log Table */}
          <div className="glass-card" style={{ padding: '24px', borderRadius: '14px' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'var(--font-display)' }}>
              <FileSpreadsheet size={18} style={{ color: 'var(--accent-violet)' }} /> Security & Activity Audit Log
            </h2>

            <div style={{ display: 'grid', gap: '10px' }}>
              {MOCK_AUDIT_LOGS.map((log) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '8px', background: 'var(--bg-surface-2)', border: '1px solid var(--border-subtle)', fontSize: '0.8rem', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{log.action}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.74rem', fontFamily: 'var(--font-mono)' }}>By {log.user} • IP: {log.ip}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
