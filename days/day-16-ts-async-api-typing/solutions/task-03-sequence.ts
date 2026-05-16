export async function sequence<T>(tasks: ReadonlyArray<() => Promise<T>>): Promise<T[]> {
  const out: T[] = [];
  for (const task of tasks) out.push(await task());
  return out;
}