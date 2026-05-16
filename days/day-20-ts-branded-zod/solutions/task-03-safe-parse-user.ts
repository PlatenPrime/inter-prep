const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function safeParseUser(input: unknown): { id: string; email: string } | null {
  if (!input || typeof input !== 'object') return null;
  const o = input as Record<string, unknown>;
  if (typeof o.id !== 'string' || typeof o.email !== 'string') return null;
  if (!EMAIL_RE.test(o.email)) return null;
  return { id: o.id, email: o.email };
}