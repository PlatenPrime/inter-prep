/**
 * @param state
 */
export function retryBoundary(state: { resetKey: number; hasError: boolean }): { resetKey: number; hasError: boolean } {
  throw new Error('Not implemented');
}