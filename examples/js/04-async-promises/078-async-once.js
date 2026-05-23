/**
 * 078 — async once
 * @tags async
 * @difficulty medium
 *
 * asyncOnce(fn): один inflight/результат для async.
 */

export function asyncOnce(fn) {
  let promise;
  return function (...args) {
    if (!promise) promise = Promise.resolve(fn.apply(this, args));
    return promise;
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  let n = 0;
  const f = asyncOnce(async () => ++n);
  await f(); await f();
  assert(n === 1);
  console.log('078-async-once: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
