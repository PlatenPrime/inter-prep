/**
 * @param props
 * @param ref
 */
export function forwardRefPoly<P extends object, R>(
  props: P,
  ref: ((instance: R | null) => void) | { current: R | null } | null,
): P & { ref: typeof ref } {
  throw new Error('Not implemented');
}