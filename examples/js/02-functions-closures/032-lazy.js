/**
 * 032 — lazy
 * @tags closures
 * @difficulty easy
 *
 * lazy(factory): вычисли значение при первом get().
 */

export function lazy(factory) {
  let computed = false;
  let value;
  return () => {
    if (!computed) {
      value = factory();
      computed = true;
    }
    return value;
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
  const g = lazy(() => ++n);
  assert(g() === 1 && g() === 1 && n === 1);
  console.log('032-lazy: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
