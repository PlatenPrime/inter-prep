export function selector<T, R>(state: T, pick: (s: T) => R): R {
  return pick(state);
}