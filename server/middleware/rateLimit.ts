const rateLimits = new Map<string, number[]>();

export async function checkRateLimit(
  userId: string,
  maxRequests: number = 100,
  windowMs: number = 60000
): Promise<{ allowed: boolean }> {
  const now = Date.now();
  const key = `user:${userId}`;
  const requests = rateLimits.get(key) || [];
  // Filter requests within time window
  const recent = requests.filter(t => now - t < windowMs);

  if (recent.length >= maxRequests) {
    return { allowed: false };
  }

  recent.push(now);
  rateLimits.set(key, recent);

  return { allowed: true };
}
