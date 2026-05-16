export function mutable<T>(arr: readonly T[]): T[] {
  return [...arr];
}