export function verifyOwnership(resourceUserId: string, sessionUserId: string): null {
  if (resourceUserId !== sessionUserId) {
    throw new Error("FORBIDDEN");
  }
  return null;
}
