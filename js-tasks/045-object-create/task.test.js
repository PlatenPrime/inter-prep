import { objectCreate } from './task.js';

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
  const o = objectCreate({ x: 1 });
  assert('test 2', o.x === 1);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
