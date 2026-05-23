/**
 * 111 — get path
 * @tags objects
 * @difficulty easy
 *
 * get(obj, 'a.b.c', default).
 */

export function getPath(obj, path, defaultValue) {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return defaultValue;
    cur = cur[k];
  }
  return cur === undefined ? defaultValue : cur;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(getPath({ a: { b: 1 } }, 'a.b') === 1);
  console.log('111-get-path: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
