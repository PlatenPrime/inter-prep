/**
 * 178 — missing number
 * @tags algorithms
 * @difficulty easy
 *
 * missingNumber([0..n]).
 */

export function missingNumber(nums) {
  const n = nums.length;
  let sum = (n * (n + 1)) / 2;
  for (const x of nums) sum -= x;
  return sum;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(missingNumber([3, 0, 1]) === 2);
  console.log('178-missing-number: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
