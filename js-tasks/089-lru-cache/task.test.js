import { createLRU } from './task.js';

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
  const lru = createLRU(2);
  lru.set(1, 1); lru.set(2, 2);
  assert('test 3', lru.get(1) === 1);
  lru.set(3, 3);
  assert('test 5', lru.get(2) === -1);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
