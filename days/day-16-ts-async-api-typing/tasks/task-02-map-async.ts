/**
 * @param items
 * @param fn
 */
export async function mapAsync<T, R>(items: readonly T[], fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  throw new Error('Not implemented');
}