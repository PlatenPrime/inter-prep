/**
 * 028 — create counter
 * @tags closures
 * @difficulty easy
 *
 * Счётчик: increment, decrement, value.
 */

export function createCounter(initial = 0) {
  let value = initial;
  return {
    increment() { return ++value; },
    decrement() { return --value; },
    get value() { return value; },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const c = createCounter(10);
  assert(c.increment() === 11 && c.decrement() === 10);
  console.log('028-create-counter: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
