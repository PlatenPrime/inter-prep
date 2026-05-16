export function backoffDelay(attempt: number, baseMs: number): number {
  return baseMs * 2 ** attempt;
}
