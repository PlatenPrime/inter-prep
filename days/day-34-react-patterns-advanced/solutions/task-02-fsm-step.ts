const T: Record<string, Record<string, string>> = {
  idle: { FETCH: 'loading' },
  loading: { SUCCESS: 'done', FAIL: 'idle' },
  done: { RESET: 'idle' },
};
export function fsmStep(state: string, event: string): string {
  return T[state]?.[event] ?? state;
}
