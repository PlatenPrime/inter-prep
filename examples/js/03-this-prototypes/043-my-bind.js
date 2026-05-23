/**
 * 043 — my bind
 * @tags this
 * @difficulty medium
 *
 * Реализуй Function.prototype.bind.
 */

export function myBind(fn, thisArg, ...bound) {
  return function (...args) {
    return fn.apply(thisArg, [...bound, ...args]);
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const add = myBind((a, b) => a + b, null, 1);
  assert(add(2) === 3);
  console.log('043-my-bind: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
