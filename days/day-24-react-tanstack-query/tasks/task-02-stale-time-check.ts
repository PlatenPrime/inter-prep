/**
 * @param updatedAt ms timestamp
 * @param staleTime ms
 * @param [now]
 */
export function staleTimeCheck(updatedAt: number, staleTime: number, now = Date.now()): boolean {
  throw new Error('Not implemented');
}