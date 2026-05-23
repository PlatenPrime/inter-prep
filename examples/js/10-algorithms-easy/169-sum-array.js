/**
 * 169 — sum array
 * @tags algorithms
 * @difficulty easy
 *
 * sum массива.
 */

export function sumArray(arr) {
  return arr.reduce((a, b) => a + b, 0);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(sumArray([1, 2, 3]) === 6);
  console.log('169-sum-array: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
