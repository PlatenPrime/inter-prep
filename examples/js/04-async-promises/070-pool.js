/**
 * 070 — pool
 * @tags async
 * @difficulty medium
 *
 * createPool(limit): run(task) с ограничением concurrency.
 */

export function createPool(limit) {
  let active = 0;
  const queue = [];
  async function runNext() {
    if (active >= limit || !queue.length) return;
    active++;
    const { task, resolve, reject } = queue.shift();
    try {
      resolve(await task());
    } catch (e) {
      reject(e);
    } finally {
      active--;
      runNext();
    }
  }
  return {
    run(task) {
      return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        runNext();
      });
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
  const pool = createPool(2);
  const r = await pool.run(async () => 1);
  assert(r === 1);
  console.log('070-pool: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
