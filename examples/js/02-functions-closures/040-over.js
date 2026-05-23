/**
 * 040 — over
 * @tags closures
 * @difficulty medium
 *
 * over(obj, fns): примени fn к каждому полю объекта.
 */

export function over(obj, fns) {
  const out = {};
  for (const key of Object.keys(obj)) {
    out[key] = fns[key] ? fns[key](obj[key]) : obj[key];
  }
  return out;
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(over({ a: 1, b: 2 }, { a: (x) => x * 2 }).a === 2);
  console.log('040-over: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
