export async function mapAsync<T, R>(items: readonly T[], fn: (item: T, index: number) => Promise<R>): Promise<R[]> {
  return Promise.all(items.map(fn));
}