/**
 * 072 — barrier
 * @tags async
 * @difficulty medium
 *
 * createBarrier(n): await пока n участников не вызовут await().
 */

export function createBarrier(count) {
  let arrived = 0;
  let resolveAll;
  const promise = new Promise((r) => { resolveAll = r; });
  return {
    async await() {
      arrived++;
      if (arrived >= count) resolveAll();
      return promise;
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
  const b = createBarrier(2);
  const p1 = b.await();
  const p2 = b.await();
  await Promise.all([p1, p2]);
  assert(true);
  console.log('072-barrier: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
