/**
 * 187 — is subsequence
 * @tags algorithms
 * @difficulty easy
 *
 * isSubsequence(s, t).
 */

export function isSubsequence(s, t) {
  let i = 0;
  for (const ch of t) if (s[i] === ch) i++;
  return i === s.length;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(isSubsequence('abc', 'ahbgdc') === true);
  console.log('187-is-subsequence: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
