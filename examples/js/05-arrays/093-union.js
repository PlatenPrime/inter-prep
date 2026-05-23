/**
 * 093 — union
 * @tags arrays
 * @difficulty easy
 *
 * Объединение без дубликатов.
 */

export function union(...arrays) {
  return [...new Set(arrays.flat())];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(union([1, 2], [2, 3]).sort().join() === '1,2,3');
  console.log('093-union: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
