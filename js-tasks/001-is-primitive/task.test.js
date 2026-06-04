import { isPrimitive } from './task.js';

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
  assert('test 1', isPrimitive(1) === true);
  assert('test 2', isPrimitive('a') === true);
  assert('test 3', isPrimitive(null) === true);
  assert('test 4', isPrimitive({}) === false);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
