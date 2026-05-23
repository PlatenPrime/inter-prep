/**
 * 023 — curry
 * @tags closures
 * @difficulty easy
 *
 * curry(fn, arity): каррирование фиксированной арности.
 */

export function curry(fn, arity = fn.length) {
  return function curried(...args) {
    if (args.length >= arity) return fn.apply(this, args);
    return (...rest) => curried(...args, ...rest);
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const add = curry((a, b, c) => a + b + c, 3);
  assert(add(1)(2)(3) === 6);
  console.log('023-curry: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
