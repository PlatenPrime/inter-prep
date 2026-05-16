export function countPending(fields: Record<string, boolean>): number {
  return Object.values(fields).filter(Boolean).length;
}
