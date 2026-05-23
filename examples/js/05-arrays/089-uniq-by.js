/**
 * 089 — uniq by
 * @tags arrays
 * @difficulty medium
 *
 * uniq по iteratee(x).
 */

export function uniqBy(arr, iteratee) {
  const seen = new Set();
  const keyFn = typeof iteratee === 'function' ? iteratee : (x) => x[iteratee];
  return arr.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(uniqBy([{ id: 1 }, { id: 1 }, { id: 2 }], (x) => x.id).length === 2);
  console.log('089-uniq-by: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
