/**
 * 155 — string includes
 * @tags polyfills
 * @difficulty easy
 *
 * String.includes polyfill.
 */

export function stringIncludes(str, search, pos = 0) {
  return str.indexOf(search, pos) !== -1;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(stringIncludes('hello', 'ell') === true);
  console.log('155-string-includes: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
