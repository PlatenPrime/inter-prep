/**
 * 092 — intersection
 * @tags arrays
 * @difficulty easy
 *
 * Пересечение массивов.
 */

export function intersection(...arrays) {
  if (!arrays.length) return [];
  const [first, ...rest] = arrays;
  const sets = rest.map((a) => new Set(a));
  return first.filter((x) => sets.every((s) => s.has(x)));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(intersection([1, 2], [2, 3]).join() === '2');
  console.log('092-intersection: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
