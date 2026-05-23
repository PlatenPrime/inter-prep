/**
 * 177 — remove duplicates sorted
 * @tags algorithms
 * @difficulty easy
 *
 * uniqueSorted(arr).
 */

export function uniqueSorted(arr) {
  if (!arr.length) return [];
  const out = [arr[0]];
  for (let i = 1; i < arr.length; i++) if (arr[i] !== arr[i - 1]) out.push(arr[i]);
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(uniqueSorted([1, 1, 2]).join() === '1,2');
  console.log('177-remove-duplicates-sorted: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
