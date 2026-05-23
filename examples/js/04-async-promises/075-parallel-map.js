/**
 * 075 — parallel map
 * @tags async
 * @difficulty medium
 *
 * parallelMap(items, fn, concurrency).
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

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const r = await parallelMap([1, 2], async (x) => x + 1, 2);
  assert(r.join() === '2,3');
  console.log('075-parallel-map: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
