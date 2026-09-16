/**
 * @file auth/signin/page.tsx
 * @description Enterprise authentication and single sign-on (SSO) login view.
 * Renders OAuth login flows (Google Workspace, SSO) with security disclaimer badges.
 * 
 * @module app/auth/signin/page
 */

'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

/**
 * SignInPage Component
 * 
 * Provides an enterprise credential gateway with OAuth provider dispatch.
 * 
 * @returns {JSX.Element} Login dialog card
 */
export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  /**
   * Initiates Google OAuth2 handshake via NextAuth.
   */
  const handleGoogleSignIn = async () => {
    setLoading(true);
    await signIn('google', { callbackUrl: '/' });
  };

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
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '400px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.4)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            margin: '0 auto 16px'
          }}>⚡</div>
          <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: 700, margin: 0 }}>
            DayNight Pilot
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '8px' }}>
            AI-powered career operations platform
          </p>
        </div>

        {/* Sign in button */}
        <button
          id="signin-google-btn"
          onClick={handleGoogleSignIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px 24px',
            background: loading ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '15px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.6 : 1
          }}
        >
          {/* Google SVG icon */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing in…' : 'Continue with Google'}
        </button>

        <p style={{
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
          textAlign: 'center',
          marginTop: '24px',
          lineHeight: 1.6
        }}>
          By signing in you agree to our terms. Your data is workspace-scoped and never shared between organizations.
        </p>
      </div>
    </div>
  );
}
