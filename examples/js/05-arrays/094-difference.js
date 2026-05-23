/**
 * 094 — difference
 * @tags arrays
 * @difficulty easy
 *
 * Элементы a, которых нет в b.
 */

export function difference(a, b) {
  const set = new Set(b);
  return a.filter((x) => !set.has(x));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(difference([1, 2, 3], [2]).join() === '1,3');
  console.log('094-difference: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
