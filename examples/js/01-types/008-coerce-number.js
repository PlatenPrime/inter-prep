/**
 * 008 — coerce number
 * @tags types, coercion
 * @difficulty easy
 *
 * Безопасно приведи к числу; NaN → null.
 */

export function coerceNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(coerceNumber('42') === 42);
  assert(coerceNumber('x') === null);
  assert(coerceNumber('') === null);
  console.log('008-coerce-number: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
