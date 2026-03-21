export async function logSecurityEvent(
  event: string,
  userId: string,
  details: Record<string, unknown> = {}
): Promise<void> {
  console.log("[SECURITY]", {
    event,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
}
