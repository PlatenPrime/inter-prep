/**
 * @param value
 * @returns getter always returning latest value
 */
export function staleClosureFix<T>(value: T): () => T {
  throw new Error('Not implemented');
}