import { once } from './task.js';

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
  let n = 0;
  const f = once(() => ++n);
  assert('test 3', f() === 1 && f() === 1 && n === 1);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
