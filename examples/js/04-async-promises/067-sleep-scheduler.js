/**
 * 067 — sleep scheduler
 * @tags async
 * @difficulty medium
 *
 * createScheduler(): schedule(fn, delayMs).
 */

export function createScheduler() {
  const queue = [];
  let running = false;
  async function drain() {
    if (running) return;
    running = true;
    while (queue.length) {
      const { fn, delayMs } = queue.shift();
      await new Promise((r) => setTimeout(r, delayMs));
      await fn();
    }
    running = false;
  }
  return {
    schedule(fn, delayMs) {
      queue.push({ fn, delayMs });
      drain();
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
  const s = createScheduler();
  let v = 0;
  s.schedule(async () => { v = 1; }, 1);
  await new Promise((r) => setTimeout(r, 10));
  assert(v === 1);
  console.log('067-sleep-scheduler: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  runTests().catch((e) => { console.error(e); process.exit(1); });
}
