/**
 * 128 — trim lines
 * @tags strings
 * @difficulty easy
 *
 * trim каждой строки multiline.
 */

export function trimLines(str) {
  return str.split('\n').map((l) => l.trim()).join('\n');
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(trimLines('  a  \n  b  ') === 'a\nb');
  console.log('128-trim-lines: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
