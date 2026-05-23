/**
 * 174 — reverse string
 * @tags algorithms
 * @difficulty easy
 *
 * reverseString(s).
 */

export function reverseString(s) {
  return [...s].reverse().join('');
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(reverseString('abc') === 'cba');
  console.log('174-reverse-string: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
