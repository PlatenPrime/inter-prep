/**
 * 157 — object assign
 * @tags polyfills
 * @difficulty easy
 *
 * Object.assign polyfill.
 */

export function objectAssign(target, ...sources) {
  for (const src of sources) {
    if (src == null) continue;
    for (const key of Object.keys(src)) target[key] = src[key];
  }
  return target;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const o = objectAssign({}, { a: 1 });
  assert(o.a === 1);
  console.log('157-object-assign: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
