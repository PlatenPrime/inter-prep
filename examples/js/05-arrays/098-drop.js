/**
 * 098 — drop
 * @tags arrays
 * @difficulty easy
 *
 * Пропустить n элементов.
 */

export function drop(arr, n) {
  return arr.slice(n);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(drop([1, 2, 3], 1).join() === '2,3');
  console.log('098-drop: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
