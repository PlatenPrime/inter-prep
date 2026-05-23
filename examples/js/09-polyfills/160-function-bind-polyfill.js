/**
 * 160 — function bind polyfill
 * @tags polyfills
 * @difficulty medium
 *
 * bind polyfill.
 */

export function functionBind(fn, thisArg, ...bound) {
  return (...args) => fn.apply(thisArg, [...bound, ...args]);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const f = functionBind((a, b) => a + b, null, 1);
  assert(f(2) === 3);
  console.log('160-function-bind-polyfill: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
