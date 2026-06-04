import { createQueue } from './task.js';

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

function finish() {
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

function run() {
  const q = createQueue();
  q.enqueue(1); q.enqueue(2);
  assert('test 3', q.dequeue() === 1 && q.front === 2);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
