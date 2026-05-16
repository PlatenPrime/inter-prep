/**
 * @param key
 * @param obj
 */
export function isKeyOf<K extends string>(
  key: string,
  obj: Record<K, unknown>,
): key is K {
  throw new Error('Not implemented');
}