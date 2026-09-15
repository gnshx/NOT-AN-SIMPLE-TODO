/**
 * P1-01: NextAuth.js v5 catch-all route handler.
 * Handles GET /api/auth/[...nextauth] and POST /api/auth/[...nextauth]
 */
import { handlers } from '@/lib/auth.config';
export const { GET, POST } = handlers;
