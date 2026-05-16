/** @param refs */
export function mergeRefs<T>(...refs: Array<((instance: T | null) => void) | { current: T | null } | null | undefined>): (instance: T | null) => void {
  throw new Error('Not implemented');
}