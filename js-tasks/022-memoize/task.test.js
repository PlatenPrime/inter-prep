import { memoize } from './task.js';

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
  let c = 0;
  const add = memoize((a, b) => { c++; return a + b; });
  assert('test 3', add(1, 2) === 3 && c === 1);
  assert('test 4', add(1, 2) === 3 && c === 1);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
