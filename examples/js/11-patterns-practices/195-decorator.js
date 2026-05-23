/**
 * 195 — decorator
 * @tags patterns
 * @difficulty easy
 *
 * withLogging(fn): лог + вызов.
 */

export function withLogging(fn, log = console.log) {
  return (...args) => {
    log('call', args);
    const result = fn(...args);
    log('result', result);
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
  const f = withLogging((x) => x * 2, () => {});
  assert(f(3) === 6);
  console.log('195-decorator: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
