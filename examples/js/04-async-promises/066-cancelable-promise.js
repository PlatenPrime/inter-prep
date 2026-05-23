/**
 * 066 — cancelable promise
 * @tags async
 * @difficulty medium
 *
 * cancelablePromise(executor): { promise, cancel }.
 */

export function cancelablePromise(executor) {
  let reject;
  const promise = new Promise((res, rej) => {
    reject = rej;
    executor(res, rej);
  });
  return {
    promise,
    cancel() {
      reject(new Error('Cancelled'));
    },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const { promise, cancel } = cancelablePromise((res) => setTimeout(() => res(1), 50));
  cancel();
  try { await promise; assert(false); } catch (e) { assert(e.message === 'Cancelled'); }
  console.log('066-cancelable-promise: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
