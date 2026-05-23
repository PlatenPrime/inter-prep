/**
 * 079 — async memoize
 * @tags async
 * @difficulty medium
 *
 * asyncMemoize(fn): кэш Promise по ключу.
 */

export function asyncMemoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return async function (...args) {
    const key = keyFn(...args);
    if (cache.has(key)) return cache.get(key);
    const p = Promise.resolve(fn.apply(this, args));
    cache.set(key, p);
    return p;
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  let c = 0;
  const f = asyncMemoize(async (x) => { c++; return x; });
  await f(1); await f(1);
  assert(c === 1);
  console.log('079-async-memoize: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
