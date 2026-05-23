/**
 * 134 — anagram
 * @tags strings
 * @difficulty easy
 *
 * Проверка анаграммы.
 */

export function anagram(a, b) {
  const norm = (s) => s.toLowerCase().replace(/\s/g, '').split('').sort().join('');
  return norm(a) === norm(b);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(anagram('listen', 'silent') === true);
  console.log('134-anagram: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
