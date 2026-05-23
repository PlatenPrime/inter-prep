/**
 * 153 — array includes
 * @tags polyfills
 * @difficulty easy
 *
 * includes polyfill.
 */

export function arrayIncludes(arr, value, fromIndex = 0) {
  const start = fromIndex < 0 ? Math.max(0, arr.length + fromIndex) : fromIndex;
  for (let i = start; i < arr.length; i++) if (Object.is(arr[i], value)) return true;
  return false;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(arrayIncludes([1, 2], 2) === true);
  console.log('153-array-includes: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
