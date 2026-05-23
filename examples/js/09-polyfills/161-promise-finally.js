/**
 * 161 — promise finally
 * @tags polyfills
 * @difficulty medium
 *
 * promiseFinally(p, onFinally).
 */

export function promiseFinally(promise, onFinally) {
  return promise.then(
    (v) => Promise.resolve(onFinally()).then(() => v),
    (e) => Promise.resolve(onFinally()).then(() => { throw e; }),
  );
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  let d = 0;
  await promiseFinally(Promise.resolve(1), () => { d = 1; });
  assert(d === 1);
  console.log('161-promise-finally: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
