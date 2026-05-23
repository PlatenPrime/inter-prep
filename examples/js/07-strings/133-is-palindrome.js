/**
 * 133 — is palindrome
 * @tags strings, algorithms
 * @difficulty easy
 *
 * Палиндром (буквы/цифры).
 */

export function isPalindrome(str) {
  const s = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return s === [...s].reverse().join('');
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(isPalindrome('A man, a plan, a canal: Panama') === true);
  console.log('133-is-palindrome: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
