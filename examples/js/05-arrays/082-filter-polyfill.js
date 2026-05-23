/**
 * 082 — filter polyfill
 * @tags arrays
 * @difficulty easy
 *
 * Array.prototype.filter polyfill.
 */

export function filterPolyfill(arr, pred, thisArg) {
  const out = [];
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) out.push(arr[i]);
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(filterPolyfill([1, 2, 3], (x) => x > 1).join() === '2,3');
  console.log('082-filter-polyfill: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
