import { isPlainObject } from './task.js';

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
  assert('test 1', isPlainObject({}) === true);
  assert('test 2', isPlainObject(Object.create(null)) === true);
  assert('test 3', isPlainObject([]) === false);
  assert('test 4', isPlainObject(new Date()) === false);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
