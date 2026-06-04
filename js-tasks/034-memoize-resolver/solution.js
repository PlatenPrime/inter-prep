/**
 * Кратко: Ключ кэша задаёт resolver(.
 */
export function memoizeResolver(fn, resolver) {
  const cache = new Map();
  return function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
