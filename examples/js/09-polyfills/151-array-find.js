/**
 * 151 — array find
 * @tags polyfills
 * @difficulty easy
 *
 * Array.prototype.find polyfill.
 */

export function arrayFind(arr, pred, thisArg) {
  for (let i = 0; i < arr.length; i++) if (pred.call(thisArg, arr[i], i, arr)) return arr[i];
  return undefined;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(arrayFind([1, 2, 3], (x) => x > 1) === 2);
  console.log('151-array-find: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
