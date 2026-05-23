/**
 * 170 — max min
 * @tags algorithms
 * @difficulty easy
 *
 * maxMin(arr) → { max, min }.
 */

export function maxMin(arr) {
  return { max: Math.max(...arr), min: Math.min(...arr) };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const { max, min } = maxMin([1, 5, 3]);
  assert(max === 5 && min === 1);
  console.log('170-max-min: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
