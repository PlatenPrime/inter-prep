/**
 * 057 — promisify
 * @tags async
 * @difficulty medium
 *
 * promisify(fn): callback-last-arg → Promise.
 */

export function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  const cb = (a, b, done) => done(null, a + b);
  const p = promisify(cb);
  assert((await p(1, 2)) === 3);
  console.log('057-promisify: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
