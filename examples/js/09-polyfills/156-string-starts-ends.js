/**
 * 156 — string starts ends
 * @tags polyfills
 * @difficulty easy
 *
 * startsWith / endsWith.
 */

export function stringStartsWith(str, search, pos = 0) {
  return str.slice(pos, pos + search.length) === search;
}

export function stringEndsWith(str, search) {
  return str.slice(-search.length) === search;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(stringStartsWith('abc', 'ab') === true);
  assert(stringEndsWith('abc', 'bc') === true);
  console.log('156-string-starts-ends: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
