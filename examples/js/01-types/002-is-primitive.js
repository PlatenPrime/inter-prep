/**
 * 002 — is primitive
 * @tags types
 * @difficulty easy
 *
 * Проверь, является ли значение примитивом.
 */

export function isPrimitive(value) {
  return value === null || (typeof value !== 'object' && typeof value !== 'function');
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(isPrimitive(1) === true);
  assert(isPrimitive('a') === true);
  assert(isPrimitive(null) === true);
  assert(isPrimitive({}) === false);
  console.log('002-is-primitive: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
