/**
 * 126 — truncate
 * @tags strings
 * @difficulty easy
 *
 * truncate с suffix.
 */

export function truncate(str, max, suffix = '...') {
  if (str.length <= max) return str;
  return str.slice(0, max - suffix.length) + suffix;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(truncate('abcdef', 5) === 'ab...');
  console.log('126-truncate: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
