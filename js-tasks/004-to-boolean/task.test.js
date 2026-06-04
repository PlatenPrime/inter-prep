import { toBoolean } from './task.js';

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
  assert('test 1', toBoolean(0) === false);
  assert('test 2', toBoolean('') === false);
  assert('test 3', toBoolean('0') === true);
  assert('test 4', toBoolean([]) === true);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
