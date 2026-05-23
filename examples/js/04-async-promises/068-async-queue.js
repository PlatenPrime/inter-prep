/**
 * 068 — async queue
 * @tags async
 * @difficulty medium
 *
 * AsyncQueue: enqueue возвращает Promise результата.
 */

export function createAsyncQueue() {
  const pending = [];
  let processing = false;
  async function process() {
    if (processing) return;
    processing = true;
    while (pending.length) {
      const { fn, resolve, reject } = pending.shift();
      try {
        resolve(await fn());
      } catch (e) {
        reject(e);
      }
    }
    processing = false;
  }
  return {
    enqueue(fn) {
      return new Promise((resolve, reject) => {
        pending.push({ fn, resolve, reject });
        process();
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
  const q = createAsyncQueue();
  const r = await q.enqueue(async () => 42);
  assert(r === 42);
  console.log('068-async-queue: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
