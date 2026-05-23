/**
 * 087 — compact
 * @tags arrays
 * @difficulty easy
 *
 * Убери falsy значения.
 */

export function compact(arr) {
  return arr.filter(Boolean);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(compact([0, 1, '', 2]).join() === '1,2');
  console.log('087-compact: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
