/**
 * 107 — omit
 * @tags objects
 * @difficulty easy
 *
 * omit(obj, keys).
 */

export function omit(obj, keys) {
  const set = new Set(keys);
  return Object.fromEntries(Object.entries(obj).filter(([k]) => !set.has(k)));
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(omit({ a: 1, b: 2 }, ['b']).a === 1 && !('b' in omit({ a: 1, b: 2 }, ['b'])));
  console.log('107-omit: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
