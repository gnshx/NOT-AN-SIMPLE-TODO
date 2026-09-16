/**
 * @file auth/error/page.tsx
 * @description Authentication and single sign-on failure handling view.
 * Inspects URL query params for OAuth/SSO error flags and displays tailored remediation advice.
 * 
 * @module app/auth/error/page
 */

'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/**
 * Parses authentication error query parameters and renders a friendly remediation prompt.
 */
function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const errorMessages: Record<string, string> = {
    Configuration: 'There is a problem with the server configuration.',
    AccessDenied: 'You do not have permission to sign in.',
    Verification: 'The verification link may have expired.',
    Default: 'An error occurred during sign in.'
  };

  const message = errorMessages[error || 'Default'] || errorMessages.Default;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
    }}>
      <div style={{
        background: 'rgba(239,68,68,0.06)',
        border: '1px solid rgba(239,68,68,0.2)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '40px', marginBottom: '16px' }}>⚠️</div>
        <h1 style={{ color: '#f87171', fontSize: '20px', fontWeight: 700, margin: '0 0 12px' }}>
          Sign In Error
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 24px' }}>
          {message}
        </p>
        <a
          href="/auth/signin"
          id="error-back-signin"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            color: '#fff',
            textDecoration: 'none',
            fontSize: '14px',
            fontWeight: 600
          }}
        >
          Try Again
        </a>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <ErrorContent />
    </Suspense>
  );
}
