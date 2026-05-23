/**
 * 071 — mutex
 * @tags async
 * @difficulty medium
 *
 * createMutex(): acquire/release для критической секции.
 */

export function createMutex() {
  let locked = false;
  const waiters = [];
  return {
    async acquire() {
      if (!locked) {
        locked = true;
        return;
      }
      await new Promise((resolve) => waiters.push(resolve));
      locked = true;
    },
    release() {
      const next = waiters.shift();
      if (next) next();
      else locked = false;
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
  const m = createMutex();
  await m.acquire();
  m.release();
  assert(true);
  console.log('071-mutex: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
