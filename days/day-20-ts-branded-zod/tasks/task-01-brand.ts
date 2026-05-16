/**
 * @param obj
 * @param label
 */
export function brand<T extends object>(obj: T, label: string): T & { __brand: string } {
  throw new Error('Not implemented');
}