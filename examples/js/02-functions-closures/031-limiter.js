/**
 * 031 — limiter
 * @tags closures
 * @difficulty easy
 *
 * Разреши вызов fn не более max раз.
 */

export function limiter(fn, max) {
  let count = 0;
  return function (...args) {
    if (count >= max) return undefined;
    count++;
    return fn.apply(this, args);
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  let n = 0;
  const f = limiter(() => ++n, 2);
  assert(f() === 1 && f() === 2 && f() === undefined);
  console.log('031-limiter: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
