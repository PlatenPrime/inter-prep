/**
 * 081 — map polyfill
 * @tags arrays
 * @difficulty easy
 *
 * Array.prototype.map polyfill.
 */

export function mapPolyfill(arr, fn, thisArg) {
  const out = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) out[i] = fn.call(thisArg, arr[i], i, arr);
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(mapPolyfill([1, 2], (x) => x * 2).join() === '2,4');
  console.log('081-map-polyfill: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
