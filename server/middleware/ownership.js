export function verifyOwnership(resourceUserId, sessionUserId) {
  if (resourceUserId !== sessionUserId) {
    throw new Error("FORBIDDEN");
  }
  return null;
}