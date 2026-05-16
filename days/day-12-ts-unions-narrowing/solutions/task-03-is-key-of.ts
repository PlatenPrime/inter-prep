export function isKeyOf<K extends string>(
  key: string,
  obj: Record<K, unknown>,
): key is K {
  return key in obj;
}