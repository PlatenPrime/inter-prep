/**
 * 084 — flat
 * @tags arrays
 * @difficulty easy
 *
 * flatten массив с depth.
 */

export function flat(arr, depth = 1) {
  if (depth <= 0) return arr.slice();
  return arr.reduce((acc, v) => acc.concat(Array.isArray(v) ? flat(v, depth - 1) : v), []);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(flat([1, [2, [3]]], 2).join() === '1,2,3');
  console.log('084-flat: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
