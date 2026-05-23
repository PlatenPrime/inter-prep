/**
 * 106 — pick
 * @tags objects
 * @difficulty easy
 *
 * pick(obj, keys).
 */

export function pick(obj, keys) {
  return keys.reduce((acc, k) => { if (k in obj) acc[k] = obj[k]; return acc; }, {});
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(pick({ a: 1, b: 2 }, ['a']).a === 1);
  console.log('106-pick: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
