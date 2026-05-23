/**
 * 091 — partition
 * @tags arrays
 * @difficulty easy
 *
 * partition по предикату: [pass, fail].
 */

export function partition(arr, pred) {
  const pass = [];
  const fail = [];
  for (const item of arr) (pred(item) ? pass : fail).push(item);
  return [pass, fail];
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const [a, b] = partition([1, 2, 3], (x) => x > 1);
  assert(a.join() === '2,3' && b.join() === '1');
  console.log('091-partition: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
