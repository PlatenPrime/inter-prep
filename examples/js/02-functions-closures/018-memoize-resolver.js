/**
 * 018 — memoize resolver
 * @tags closures
 * @difficulty medium
 *
 * memoize с функцией resolver(...args) → cache key.
 */

export function memoizeResolver(fn, resolver) {
  const cache = new Map();
  return function (...args) {
    const key = resolver(...args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  let c = 0;
  const f = memoizeResolver((x) => { c++; return x * 2; }, (x) => x);
  assert(f(2) === 4 && f(2) === 4 && c === 1);
  console.log('018-memoize-resolver: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
