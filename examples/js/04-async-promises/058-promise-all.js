/**
 * 058 — promise all
 * @tags async
 * @difficulty medium
 *
 * Реализуй Promise.all.
 */

export function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = [...iterable];
    if (arr.length === 0) return resolve([]);
    const results = new Array(arr.length);
    let settled = 0;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (v) => {
          results[i] = v;
          if (++settled === arr.length) resolve(results);
        },
        reject,
      );
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
  const r = await promiseAll([Promise.resolve(1), 2]);
  assert(r[0] === 1 && r[1] === 2);
  console.log('058-promise-all: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
