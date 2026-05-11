import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { authOptions } from '@/server/config/auth';
import { NextResponse } from 'next/server';

/**
 * Call at the start of any admin API route handler.
 * Returns the session if the user is an admin, otherwise returns a 401/403 response.
 *
 * Usage:
 *   const { session, error } = await requireAdmin();
 *   if (error) return error;
 */
export async function requireAdmin(): Promise<
  | { session: Session; error: null }
  | { session: null; error: NextResponse }
> {
  const session = await getServerSession(authOptions) as Session | null;

  if (!session) {
    return {
      session: null,
      error: NextResponse.json({ error: 'Unauthorised' }, { status: 401 }),
    };
  }

  if (session.user.role !== 'admin') {
    return {
      session: null,
      error: NextResponse.json({ error: 'Forbidden — admin access required' }, { status: 403 }),
    };
  }

  return { session, error: null };
}
