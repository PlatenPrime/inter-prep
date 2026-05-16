export function retryBoundary(state: { resetKey: number; hasError: boolean }): { resetKey: number; hasError: boolean } {
  return { resetKey: state.resetKey + 1, hasError: false };
}