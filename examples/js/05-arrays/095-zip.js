/**
 * 095 — zip
 * @tags arrays
 * @difficulty easy
 *
 * zip(...arrays): кортежи по индексу.
 */

export function zip(...arrays) {
  const len = Math.min(...arrays.map((a) => a.length));
  return Array.from({ length: len }, (_, i) => arrays.map((a) => a[i]));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(zip([1, 2], ['a', 'b'])[0].join() === '1,a');
  console.log('095-zip: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
