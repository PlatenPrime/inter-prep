/**
 * 041 — my call
 * @tags this
 * @difficulty medium
 *
 * Реализуй Function.prototype.call.
 */

export function myCall(fn, thisArg, ...args) {
  return fn.apply(thisArg, args);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(myCall((a, b) => a + b, null, 1, 2) === 3);
  console.log('041-my-call: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
