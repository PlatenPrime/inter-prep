/**
 * Add numbers or concatenate strings; throw on mixed types.
 */
export function overloadAdd(a: number, b: number): number;
export function overloadAdd(a: string, b: string): string;
export function overloadAdd(a: number | string, b: number | string): number | string {
  throw new Error('Not implemented');
}