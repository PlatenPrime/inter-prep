export function overloadAdd(a: number, b: number): number;
export function overloadAdd(a: string, b: string): string;
export function overloadAdd(a: number | string, b: number | string): number | string {
  if (typeof a === 'string' && typeof b === 'string') return a + b;
  if (typeof a === 'number' && typeof b === 'number') return a + b;
  throw new TypeError('Mixed types');
}