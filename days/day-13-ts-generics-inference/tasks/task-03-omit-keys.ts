/**
 * @param obj
 * @param keys
 */
export function omitKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  throw new Error('Not implemented');
}