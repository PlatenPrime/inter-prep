/**
 * 097 — take
 * @tags arrays
 * @difficulty easy
 *
 * Первые n элементов.
 */

export function take(arr, n) {
  return arr.slice(0, n);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(take([1, 2, 3], 2).join() === '1,2');
  console.log('097-take: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
