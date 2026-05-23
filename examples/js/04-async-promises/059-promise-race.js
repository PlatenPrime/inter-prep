/**
 * 059 — promise race
 * @tags async
 * @difficulty easy
 *
 * Реализуй Promise.race.
 */

export function promiseRace(iterable) {
  return new Promise((resolve, reject) => {
    for (const p of iterable) {
      Promise.resolve(p).then(resolve, reject);
    }
  });
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

async function runTests() {
  assert((await promiseRace([new Promise((r) => setTimeout(() => r(0), 50)), Promise.resolve(1)])) === 1);
  console.log('059-promise-race: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
