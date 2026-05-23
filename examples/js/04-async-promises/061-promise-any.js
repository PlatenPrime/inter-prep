/**
 * 061 — promise any
 * @tags async
 * @difficulty medium
 *
 * Реализуй Promise.any (первый fulfilled).
 */

export function promiseAny(iterable) {
  return new Promise((resolve, reject) => {
    const arr = [...iterable];
    if (arr.length === 0) return reject(new AggregateError([], 'All rejected'));
    const errors = [];
    let rejected = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(resolve, (e) => {
        errors[i] = e;
        if (++rejected === arr.length) reject(new AggregateError(errors, 'All rejected'));
      });
    });
  });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  assert((await promiseAny([Promise.reject(1), Promise.resolve(2)])) === 2);
  console.log('061-promise-any: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
