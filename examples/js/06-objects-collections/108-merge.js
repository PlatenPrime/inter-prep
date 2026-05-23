/**
 * 108 — merge
 * @tags objects
 * @difficulty easy
 *
 * shallow merge объектов.
 */

export function merge(...objects) {
  return Object.assign({}, ...objects);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(merge({ a: 1 }, { b: 2 }).a === 1);
  console.log('108-merge: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
