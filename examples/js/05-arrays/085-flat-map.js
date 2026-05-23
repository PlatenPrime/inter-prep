/**
 * 085 — flatMap
 * @tags arrays
 * @difficulty easy
 *
 * map + flat(1).
 */

export function flatMap(arr, fn) {
  return arr.map(fn).flat(1);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(flatMap([1, 2], (x) => [x, x]).join() === '1,1,2,2');
  console.log('085-flat-map: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
