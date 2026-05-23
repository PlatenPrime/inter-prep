/**
 * 022 — throttle trailing
 * @tags closures
 * @difficulty medium
 *
 * throttle с trailing вызовом в конце окна.
 */

export function throttleTrailing(fn, wait) {
  let last = 0;
  let timer;
  return function (...args) {
    const now = Date.now();
    if (now - last >= wait) {
      last = now;
      fn.apply(this, args);
    } else {
      clearTimeout(timer);
      timer = setTimeout(() => {
        last = Date.now();
        fn.apply(this, args);
      }, wait - (now - last));
    }
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  assert(typeof throttleTrailing(() => {}, 50) === 'function');
  console.log('022-throttle-trailing: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
