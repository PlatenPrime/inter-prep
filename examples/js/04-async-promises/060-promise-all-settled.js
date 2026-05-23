/**
 * 060 — promise all settled
 * @tags async
 * @difficulty medium
 *
 * Реализуй Promise.allSettled.
 */

export function promiseAllSettled(iterable) {
  return Promise.all(
    [...iterable].map((p) =>
      Promise.resolve(p)
        .then((value) => ({ status: 'fulfilled', value }))
        .catch((reason) => ({ status: 'rejected', reason })),
    ),
  );
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const r = await promiseAllSettled([1, Promise.reject('e')]);
  assert(r[0].status === 'fulfilled' && r[1].status === 'rejected');
  console.log('060-promise-all-settled: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
