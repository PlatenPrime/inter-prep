import { createPubSub } from './task.js';

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
  const ps = createPubSub();
  let v = 0;
  ps.subscribe('t', (d) => { v = d; });
  ps.publish('t', 42);
  assert('test 5', v === 42);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
