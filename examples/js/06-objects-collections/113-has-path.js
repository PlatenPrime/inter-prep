/**
 * 113 — has path
 * @tags objects
 * @difficulty easy
 *
 * hasPath(obj, path).
 */

export function hasPath(obj, path) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null || !(k in cur)) return false;
    cur = cur[k];
  }
  return true;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(hasPath({ a: { b: 1 } }, 'a.b') === true);
  console.log('113-has-path: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
