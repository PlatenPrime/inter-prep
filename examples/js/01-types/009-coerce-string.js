/**
 * 009 — coerce string
 * @tags types, coercion
 * @difficulty easy
 *
 * Предсказуемое приведение к строке (null/undefined → "").
 */

export function coerceString(value) {
  if (value === null || value === undefined) return '';
  return String(value);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(coerceString(null) === '');
  assert(coerceString(42) === '42');
  assert(coerceString(false) === 'false');
  console.log('009-coerce-string: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
