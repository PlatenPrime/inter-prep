/**
 * 053 — has own
 * @tags prototypes
 * @difficulty easy
 *
 * Безопасный hasOwnProperty.
 */

export function hasOwn(obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = Object.create({ a: 1 });
  o.b = 2;
  assert(hasOwn(o, 'b') === true);
  assert(hasOwn(o, 'a') === false);
  console.log('053-has-own: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
