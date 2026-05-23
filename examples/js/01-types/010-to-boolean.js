/**
 * 010 — to boolean
 * @tags types, coercion
 * @difficulty easy
 *
 * Явное приведение к boolean по правилам JS.
 */

export function toBoolean(value) {
  return Boolean(value);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(toBoolean(0) === false);
  assert(toBoolean('') === false);
  assert(toBoolean('0') === true);
  assert(toBoolean([]) === true);
  console.log('010-to-boolean: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
