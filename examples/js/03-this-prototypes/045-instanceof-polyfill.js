/**
 * 045 — instanceof polyfill
 * @tags prototypes
 * @difficulty medium
 *
 * instanceof без instanceof.
 */

export function instanceofPolyfill(obj, Constructor) {
  if (obj == null || typeof obj !== 'object' && typeof obj !== 'function') return false;
  let proto = Object.getPrototypeOf(obj);
  while (proto) {
    if (proto === Constructor.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(instanceofPolyfill([], Array) === true);
  assert(instanceofPolyfill({}, Array) === false);
  console.log('045-instanceof-polyfill: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
