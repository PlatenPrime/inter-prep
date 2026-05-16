/**
 * @param cache map hash -> entry
 * @param prefix query key prefix
 */
export function invalidatePrefix(
  cache: Map<string, unknown>,
  prefix: readonly unknown[],
): string[] {
  throw new Error('Not implemented');
}