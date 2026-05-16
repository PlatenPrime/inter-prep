/**
 * @param fn
 * @param bound leading args
 */
export function bindArgs<A extends unknown[], B extends unknown[], R>(
  fn: (...args: [...A, ...B]) => R,
  ...bound: A
): (...rest: B) => R {
  throw new Error('Not implemented');
}