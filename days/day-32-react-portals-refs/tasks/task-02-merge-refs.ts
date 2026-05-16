/**
 * Call all ref callbacks
 */

// TODO: implement

export function mergeRefs<T>(...refs: Array<((v: T | null) => void) | { current: T | null } | null>): (v: T | null) => void {
  throw new Error('Not implemented');
}
