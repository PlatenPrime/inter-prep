export function corsAllowed(origin: string, allowlist: string[]): boolean {
  return allowlist.includes(origin) || allowlist.includes('*');
}
