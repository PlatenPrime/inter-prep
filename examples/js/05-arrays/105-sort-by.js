/**
 * 105 — sortBy
 * @tags arrays
 * @difficulty medium
 *
 * Стабильная сортировка по ключу.
 */

export function sortBy(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (x) => x[iteratee];
  return arr
    .map((item, index) => ({ item, index, key: fn(item) }))
    .sort((a, b) => (a.key < b.key ? -1 : a.key > b.key ? 1 : a.index - b.index))
    .map((x) => x.item);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(sortBy([{ n: 2 }, { n: 1 }], (x) => x.n)[0].n === 1);
  console.log('105-sort-by: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
