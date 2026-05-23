/**
 * 121 — capitalize
 * @tags strings
 * @difficulty easy
 *
 * capitalize первое слово.
 */

export function capitalize(str) {
  if (!str) return str;
  return str[0].toUpperCase() + str.slice(1);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(capitalize('hello') === 'Hello');
  console.log('121-capitalize: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
