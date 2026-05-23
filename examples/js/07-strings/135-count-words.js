/**
 * 135 — count words
 * @tags strings
 * @difficulty easy
 *
 * Подсчёт слов.
 */

export function countWords(str) {
  return str.trim() ? str.trim().split(/\s+/).length : 0;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(countWords('one two three') === 3);
  console.log('135-count-words: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
