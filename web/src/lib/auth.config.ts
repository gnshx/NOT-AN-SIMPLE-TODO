/**
 * P1-01: NextAuth.js v5 (beta) configuration.
 *
 * Providers configured:
 *   - Google OAuth  (career platform — users naturally have Google accounts)
 *   - Credentials   (email + password for non-Google users; to be added in Phase 2)
 *
 * Session strategy: JWT (stateless, works on Vercel edge without a session DB)
 *   Phase 2 will add database session storage for server-side revocation.
 *
 * Security:
 *   - AUTH_SECRET must be set (NextAuth throws otherwise)
 *   - workspaceId + organizationId resolved from DB on sign-in and stored in JWT
 *   - Role resolved from Membership table — never from client-provided data
 */

import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { prisma } from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Minimal scopes — only what we need
      authorization: {
        params: {
          scope: 'openid email profile'
        }
      }
    })
  ],

  callbacks: {
    /**
     * Runs after OAuth sign-in succeeds.
     * Creates or finds the user + default organization/workspace in the DB.
     * Returns false to block sign-in if something goes wrong.
     */
    async signIn({ user, account }) {
      if (!user.email) return false;

      try {
        if (!prisma) return true; // dev fallback when DB not initialized

        // Upsert user
        const dbUser = await prisma.user.upsert({
          where: { email: user.email },
          update: { name: user.name || user.email, avatarUrl: user.image || null },
          create: {
            email: user.email,
            name: user.name || user.email,
            avatarUrl: user.image || null
          }
        });

        // Ensure the user has a personal organization + default workspace
        const slug = user.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-');

        const org = await prisma.organization.upsert({
          where: { slug: `personal-${slug}` },
          update: {},
          create: { name: `${user.name || user.email}'s Workspace`, slug: `personal-${slug}` }
        });

        // Ensure membership
        await prisma.membership.upsert({
          where: { userId_organizationId: { userId: dbUser.id, organizationId: org.id } },
          update: {},
          create: { userId: dbUser.id, organizationId: org.id, role: 'OWNER' }
        });

        // Ensure default workspace exists
        await prisma.workspace.upsert({
          where: { id: `ws-${org.id}` },
          update: {},
          create: {
            id: `ws-${org.id}`,
            organizationId: org.id,
            name: 'My Career Workspace',
            slug: 'default',
            isDefault: true
          }
        });

        return true;
      } catch (err) {
        console.error('[NextAuth] signIn callback error:', err);
        return false;
      }
    },

    /**
     * Enriches the JWT with workspaceId, organizationId, and role.
     * These are resolved from the database — never from client-provided input.
     */
    async jwt({ token, user }) {
      if (user?.email && prisma) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email },
            select: { id: true, memberships: { include: { organization: { include: { workspaces: { where: { isDefault: true } } } } } } }
          });

          if (dbUser) {
            token.userId = dbUser.id;
            const membership = dbUser.memberships[0];
            if (membership) {
              token.organizationId = membership.organizationId;
              token.role = membership.role;
              token.workspaceId = membership.organization.workspaces[0]?.id || null;
            }
          }
        } catch (err) {
          console.error('[NextAuth] jwt callback error:', err);
        }
      }
      return token;
    },

    /**
     * Exposes safe session fields to the client.
     * workspaceId, organizationId, role — resolved server-side from JWT.
     * NEVER expose raw OAuth tokens to the client.
     */
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userId as string;
        (session as any).workspaceId = token.workspaceId;
        (session as any).organizationId = token.organizationId;
        (session as any).role = token.role;
      }
      return session;
    }
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },

  // Enforce NEXTAUTH_SECRET / AUTH_SECRET in production
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET
});
