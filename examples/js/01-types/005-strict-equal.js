/**
 * 005 — strict equal
 * @tags types
 * @difficulty easy
 *
 * Реализуй === без использования ===.
 */

export function strictEqual(a, b) {
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object' || a === null) return Object.is(a, b);
  if (a === b) return true;
  return false;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(strictEqual(1, 1) === true);
  assert(strictEqual(1, '1') === false);
  assert(strictEqual(NaN, NaN) === true);
  assert(strictEqual({}, {}) === false);
  console.log('005-strict-equal: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
