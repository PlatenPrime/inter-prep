/**
 * 036 — module pattern
 * @tags patterns
 * @difficulty easy
 *
 * Revealing module: публичный API, приватное состояние.
 */

export function createModule() {
  let count = 0;
  return {
    increment() { count++; },
    getCount() { return count; },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const m = createModule();
  m.increment();
  assert(m.getCount() === 1);
  console.log('036-module-pattern: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
