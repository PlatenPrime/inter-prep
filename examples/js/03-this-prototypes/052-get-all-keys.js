/**
 * 052 — get all keys
 * @tags prototypes
 * @difficulty medium
 *
 * Все ключи: own + inherited enumerable.
 */

export function getAllKeys(obj) {
  const keys = new Set();
  let current = obj;
  while (current && current !== Object.prototype) {
    Object.keys(current).forEach((k) => keys.add(k));
    current = Object.getPrototypeOf(current);
  }
  return [...keys];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = Object.create({ inherited: 1 });
  o.own = 2;
  const keys = getAllKeys(o);
  assert(keys.includes('own') && keys.includes('inherited'));
  console.log('052-get-all-keys: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
