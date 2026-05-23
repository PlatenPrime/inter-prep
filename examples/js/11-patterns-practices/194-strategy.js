/**
 * 194 — strategy
 * @tags patterns
 * @difficulty easy
 *
 * createContext(strategies): run(name, ...args).
 */

export function createContext(strategies) {
  return {
    run(name, ...args) {
      const fn = strategies[name];
      if (!fn) throw new Error(`Unknown strategy: ${name}`);
      return fn(...args);
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const ctx = createContext({ add: (a, b) => a + b });
  assert(ctx.run('add', 1, 2) === 3);
  console.log('194-strategy: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
