/**
 * 191 — singleton
 * @tags patterns
 * @difficulty easy
 *
 * createSingleton(factory): один экземпляр.
 */

export function createSingleton(factory) {
  let instance;
  return () => {
    if (!instance) instance = factory();
    return instance;
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const get = createSingleton(() => ({ id: Math.random() }));
  assert(get() === get());
  console.log('191-singleton: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
