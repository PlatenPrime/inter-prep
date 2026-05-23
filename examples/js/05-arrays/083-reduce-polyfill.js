/**
 * 083 — reduce polyfill
 * @tags arrays
 * @difficulty easy
 *
 * Array.prototype.reduce polyfill.
 */

export function reducePolyfill(arr, fn, initial) {
  let acc = initial;
  let start = 0;
  if (acc === undefined) { acc = arr[0]; start = 1; }
  for (let i = start; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(reducePolyfill([1, 2, 3], (a, b) => a + b, 0) === 6);
  console.log('083-reduce-polyfill: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
