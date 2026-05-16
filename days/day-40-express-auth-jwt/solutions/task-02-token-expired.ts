export function isTokenExpired(payload: { exp?: number }, now: number): boolean {
  return payload.exp !== undefined && payload.exp <= now;
}
