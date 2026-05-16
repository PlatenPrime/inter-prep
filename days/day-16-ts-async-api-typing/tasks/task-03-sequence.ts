/** @param tasks thunks returning promises */
export async function sequence<T>(tasks: ReadonlyArray<() => Promise<T>>): Promise<T[]> {
  throw new Error('Not implemented');
}