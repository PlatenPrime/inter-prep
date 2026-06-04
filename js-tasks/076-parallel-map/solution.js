/**
 * Кратко: Все элементы параллельно через Promise.
 */
export async function parallelMap(items, fn, concurrency = Infinity) {
  return mapLimit(items, concurrency, fn);
}

async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
