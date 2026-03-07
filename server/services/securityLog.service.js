export async function logSecurityEvent(event, userId, details = {}) {
  console.log("[SECURITY]", {
    event,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  })
}