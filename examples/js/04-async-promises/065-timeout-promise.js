/**
 * 065 — timeout promise
 * @tags async
 * @difficulty medium
 *
 * timeoutPromise(promise, ms): reject по таймауту.
 */

export function timeoutPromise(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout')), ms),
    ),
  ]);
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  try {
    await timeoutPromise(new Promise((r) => setTimeout(r, 100)), 5);
    assert(false);
  } catch (e) {
    assert(e.message === 'Timeout');
  }
  console.log('065-timeout-promise: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
