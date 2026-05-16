/**
 * Create selector that returns same reference if shallowEqual(slice, prev).
 * @param pick
 */
export function selectSlice<T extends object, R extends object>(pick: (state: T) => R) {
  throw new Error('Not implemented');
}