export function staleTimeCheck(updatedAt: number, staleTime: number, now = Date.now()): boolean {
  return now - updatedAt > staleTime;
}