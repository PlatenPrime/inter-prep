/**
 * 154 — array at
 * @tags polyfills
 * @difficulty easy
 *
 * at(index) polyfill.
 */

export function arrayAt(arr, index) {
  const i = index < 0 ? arr.length + index : index;
  return arr[i];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(arrayAt([1, 2, 3], -1) === 3);
  console.log('154-array-at: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
