export function cacheAside(cache: Map<string, unknown>, key: string, loader: () => unknown) {
  if (cache.has(key)) return cache.get(key);
  const v = loader();
  cache.set(key, v);
  return v;
}
