export function sanitizeInput(input: unknown): unknown {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, 5000);
} // prevent XSS by removing angle brackets, trim whitespace, and limit length to 5000 chars
