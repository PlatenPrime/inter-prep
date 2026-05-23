/**
 * 189 — top k frequent
 * @tags algorithms
 * @difficulty medium
 *
 * topKFrequent(nums, k).
 */

export function topKFrequent(nums, k) {
  const freq = {};
  for (const n of nums) freq[n] = (freq[n] ?? 0) + 1;
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([n]) => Number(n));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(topKFrequent([1, 1, 1, 2, 2, 3], 2).sort().join() === '1,2');
  console.log('189-top-k-frequent: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
