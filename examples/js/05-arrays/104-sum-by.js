/**
 * 104 — sumBy
 * @tags arrays
 * @difficulty easy
 *
 * sumBy(arr, iteratee).
 */

export function sumBy(arr, iteratee) {
  const fn = typeof iteratee === 'function' ? iteratee : (x) => x[iteratee];
  return arr.reduce((s, x) => s + fn(x), 0);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(sumBy([{ v: 1 }, { v: 2 }], (x) => x.v) === 3);
  console.log('104-sum-by: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
