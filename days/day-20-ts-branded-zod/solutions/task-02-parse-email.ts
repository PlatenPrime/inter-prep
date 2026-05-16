const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseEmail(input: string): string | null {
  return EMAIL_RE.test(input) ? input : null;
}