/**
 * 003 — is plain object
 * @tags types
 * @difficulty easy
 *
 * Plain object: создан через {} или Object.create(null), не массив/Date/class.
 */

export function isPlainObject(value) {
  if (value === null || typeof value !== 'object') return false;
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(isPlainObject({}) === true);
  assert(isPlainObject(Object.create(null)) === true);
  assert(isPlainObject([]) === false);
  assert(isPlainObject(new Date()) === false);
  console.log('003-is-plain-object: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
