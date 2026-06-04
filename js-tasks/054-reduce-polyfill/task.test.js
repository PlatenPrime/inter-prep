import { reducePolyfill } from './task.js';

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
  assert('test 1', reducePolyfill([1, 2, 3], (a, b) => a + b, 0) === 6);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
