/** @param obj */
export function requiredKeys<T extends object>(obj: T): (keyof T)[] {
  throw new Error('Not implemented');
}