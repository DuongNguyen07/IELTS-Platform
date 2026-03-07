const rateLimits = new Map()

export async function checkRateLimit(
  userId,
  maxRequests = 100,
  windowMs = 60000
) {
  const now = Date.now()
  const key = `user:${userId}`
  const requests = rateLimits.get(key) || []
  // Filter requests within time window
  const recent = requests.filter(t => now - t < windowMs)

  if (recent.length >= maxRequests) {
    return { allowed: false }
  }

  recent.push(now)
  rateLimits.set(key, recent)

  return { allowed: true }
}
