/**
 * 102 — sample
 * @tags arrays
 * @difficulty easy
 *
 * Случайный элемент массива.
 */

export function sample(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert([1, 2, 3].includes(sample([1, 2, 3])));
  console.log('102-sample: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
