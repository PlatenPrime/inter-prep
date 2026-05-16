export function omitKeys<T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const omit = new Set<keyof T>(keys);
  const out = { ...obj } as Omit<T, K>;
  for (const k of omit) delete (out as T)[k];
  return out;
}