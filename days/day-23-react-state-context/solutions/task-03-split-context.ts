export function splitContext<S, D>(state: S, dispatch: D): { state: S; dispatch: D } {
  return { state, dispatch };
}