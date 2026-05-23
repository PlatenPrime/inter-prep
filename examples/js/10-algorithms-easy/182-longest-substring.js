/**
 * 182 — longest substring
 * @tags algorithms
 * @difficulty medium
 *
 * lengthOfLongestSubstring без повторов.
 */

export function lengthOfLongestSubstring(s) {
  const set = new Set();
  let max = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) set.delete(s[left++]);
    set.add(s[right]);
    max = Math.max(max, right - left + 1);
  }
  return max;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(lengthOfLongestSubstring('abcabcbb') === 3);
  console.log('182-longest-substring: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
