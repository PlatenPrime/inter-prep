/**
 * 100 — rotate
 * @tags arrays
 * @difficulty easy
 *
 * rotate(arr, k): сдвиг вправо.
 */

export function rotate(arr, k) {
  const n = arr.length;
  if (!n) return [];
  const shift = ((k % n) + n) % n;
  return [...arr.slice(-shift), ...arr.slice(0, -shift)];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(rotate([1, 2, 3], 1).join() === '3,1,2');
  console.log('100-rotate: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
