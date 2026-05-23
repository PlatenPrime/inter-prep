/**
 * 030 — create queue
 * @tags closures
 * @difficulty easy
 *
 * Queue FIFO: enqueue, dequeue, front.
 */

export function createQueue() {
  const items = [];
  return {
    enqueue(v) { items.push(v); },
    dequeue() { return items.shift(); },
    get front() { return items[0]; },
    get size() { return items.length; },
  };
}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

function runTests() {
  const q = createQueue();
  q.enqueue(1); q.enqueue(2);
  assert(q.dequeue() === 1 && q.front === 2);
  console.log('030-create-queue: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  try { runTests(); } catch (e) { console.error(e); process.exit(1); }
}
