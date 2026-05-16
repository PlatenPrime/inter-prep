export function isTimedOut(start: number, now: number, ms: number): boolean {
  return now - start > ms;
}
