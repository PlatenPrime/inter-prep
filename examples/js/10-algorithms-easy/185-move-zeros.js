/**
 * 185 — move zeros
 * @tags algorithms
 * @difficulty easy
 *
 * moveZeroes in-place.
 */

export function moveZeroes(nums) {
  let w = 0;
  for (const n of nums) if (n !== 0) nums[w++] = n;
  while (w < nums.length) nums[w++] = 0;
  return nums;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const a = [0, 1, 0, 3];
  moveZeroes(a);
  assert(a.join() === '1,3,0,0');
  console.log('185-move-zeros: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
