/** @param map string-valued record */
export function valueOfUnion<T extends Record<string, string>>(map: T): T[keyof T][] {
  throw new Error('Not implemented');
}