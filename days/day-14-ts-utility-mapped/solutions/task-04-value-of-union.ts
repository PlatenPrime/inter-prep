export function valueOfUnion<T extends Record<string, string>>(map: T): T[keyof T][] {
  return Object.values(map) as T[keyof T][];
}