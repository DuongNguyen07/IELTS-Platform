import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateEmail, validatePassword } from './validation';

// Middleware to protect API routes
export { validateEmail, validatePassword } from './validation';
export async function requireAuth(req) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    };
  }

  // Get full user from database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    };
  }

  return { session, user };
}

// Verify user owns a resource
export async function verifyOwnership(resourceUserId, sessionUserId) {
  if (resourceUserId !== sessionUserId) {
    return NextResponse.json(
      { error: 'Forbidden - You do not have access to this resource' },
      { status: 403 }
    );
  }
  return null;
}

// Rate limiting (simple in-memory, use Redis in production)
const rateLimits = new Map();

export function checkRateLimit(userId, maxRequests = 100, windowMs = 60000) {
  const now = Date.now();
  const userKey = `rate_${userId}`;
  const userRequests = rateLimits.get(userKey) || [];
  
  // Filter requests within time window
  const recentRequests = userRequests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return NextResponse.json(
      { error: 'Too many requests - Please try again later' },
      { status: 429 }
    );
  }
  
  recentRequests.push(now);
  rateLimits.set(userKey, recentRequests);
  
  // Cleanup old entries periodically
  if (Math.random() < 0.01) { // 1% chance
    cleanupRateLimits(windowMs);
  }
  
  return null;
}

function cleanupRateLimits(windowMs) {
  const now = Date.now();
  for (const [key, requests] of rateLimits.entries()) {
    const recent = requests.filter(time => now - time < windowMs);
    if (recent.length === 0) {
      rateLimits.delete(key);
    } else {
      rateLimits.set(key, recent);
    }
  }
}

// Sanitize user input
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
// Remove potential XSS
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
    .slice(0, 10000); // Limit length
}

// Log security events
export async function logSecurityEvent(event, userId, details = {}) {
  console.log(`[SECURITY] ${event}`, {
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
  
  // In production: Send to logging service (e.g., Sentry, LogRocket)
}