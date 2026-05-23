/**
 * 179 — majority element
 * @tags algorithms
 * @difficulty medium
 *
 * majorityElement (Boyer–Moore).
 */

export function majorityElement(nums) {
  let cand = null, count = 0;
  for (const n of nums) {
    if (count === 0) { cand = n; count = 1; }
    else if (n === cand) count++;
    else count--;
  }
  return cand;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(majorityElement([2, 2, 1, 1, 2]) === 2);
  console.log('179-majority-element: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
