'use client';
import dynamic from 'next/dynamic';
import { ShieldCheck, Activity, Cpu } from 'lucide-react';

// Dynamically import HolographicOrb to prevent any SSR canvas mismatch
const HolographicOrb = dynamic(() => import('@/components/HolographicOrb'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: 200,
        height: 200,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px dashed var(--border-glow)',
        background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)'
      }}
    >
      <div style={{ width: 28, height: 28, border: '2px solid var(--accent-cobalt)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  )
});

interface ThreeSentinelProps {
  status?: 'SECURE' | 'SCANNING' | 'ALERT';
  latencyMs?: number;
  modelRoute?: string;
  defenseLevel?: string;
}

export default function ThreeSentinel({
  status = 'SECURE',
  latencyMs = 18,
  modelRoute = 'Gemini 2.5 Flash / GPT-4o',
  defenseLevel = 'Level 1 Strict'
}: ThreeSentinelProps) {
  const statusColor = status === 'SECURE' ? 'var(--accent-emerald)' : status === 'SCANNING' ? 'var(--accent-cobalt)' : 'var(--accent-amber)';

  return (
    <div
      className="glass-card"
      style={{
        position: 'relative',
        padding: '20px',
        borderRadius: '16px',
        border: '1px solid var(--border-subtle)',
        background: 'radial-gradient(ellipse at top right, rgba(59,130,246,0.08) 0%, var(--bg-surface-1) 75%)',
        overflow: 'hidden'
      }}
    >
      {/* Decorative tactical background grid */}
      <div
        className="tactical-grid"
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.35,
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Header telemetry row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: statusColor, boxShadow: `0 0 10px ${statusColor}`, display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
              AUTONOMOUS SENTINEL
            </span>
          </div>
          <span className="badge-risk-low" style={{ fontSize: '0.66rem' }}>
            <ShieldCheck size={11} /> {defenseLevel}
          </span>
        </div>

        {/* 3D Canvas visualizer center */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px 0' }}>
          <HolographicOrb size={180} />
        </div>

        {/* Live operational telemetry footer */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)' }}>ENGINE ROUTE</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {modelRoute}
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.64rem', color: 'var(--text-muted)' }}>PIPELINE LATENCY</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: statusColor }}>
              {latencyMs}ms Real-Time
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
