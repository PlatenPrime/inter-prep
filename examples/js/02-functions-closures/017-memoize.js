/**
 * 017 — memoize
 * @tags closures
 * @difficulty easy
 *
 * Кэшируй результат fn по JSON.stringify аргументов.
 */

export function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
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
  const add = memoize((a, b) => { c++; return a + b; });
  assert(add(1, 2) === 3 && c === 1);
  assert(add(1, 2) === 3 && c === 1);
  console.log('017-memoize: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
