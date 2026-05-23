/**
 * 088 — uniq
 * @tags arrays
 * @difficulty easy
 *
 * Уникальные значения.
 */

export function uniq(arr) {
  return [...new Set(arr)];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(uniq([1, 1, 2]).join() === '1,2');
  console.log('088-uniq: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
