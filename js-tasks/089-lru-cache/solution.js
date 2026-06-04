/**
 * Кратко: Map сохраняет порядок вставки: get/set move to end; при переполнении delete первого ключа.
 */
export function createLRU(capacity) {
  const map = new Map();
  return {
    get(key) {
      if (!map.has(key)) return -1;
      const v = map.get(key);
      map.delete(key);
      map.set(key, v);
      return v;
    },
    set(key, value) {
      if (map.has(key)) map.delete(key);
      map.set(key, value);
      if (map.size > capacity) {
        const first = map.keys().next().value;
        map.delete(first);
      }
    },
  };
}
