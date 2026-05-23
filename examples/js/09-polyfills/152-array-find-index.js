/**
 * 152 — array findIndex
 * @tags polyfills
 * @difficulty easy
 *
 * findIndex polyfill.
 */

export function arrayFindIndex(arr, pred, thisArg) {
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) return i;
  return -1;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(arrayFindIndex([1, 2, 3], (x) => x === 2) === 1);
  console.log('152-array-find-index: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
