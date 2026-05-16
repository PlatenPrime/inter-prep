export function deadlockVictim(ids: string[]): string {
  return [...ids].sort()[0];
}
