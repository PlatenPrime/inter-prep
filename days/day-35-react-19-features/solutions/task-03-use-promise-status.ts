export function promiseStatus(p: { ok: boolean; reason?: string }): 'fulfilled' | 'rejected' {
  return p.ok ? 'fulfilled' : 'rejected';
}
