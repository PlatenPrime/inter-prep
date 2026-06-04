import { typeofDetailed } from './task.js';

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
  assert('test 1', typeofDetailed(null) === 'null');
  assert('test 2', typeofDetailed([]) === 'array');
  assert('test 3', typeofDetailed(new Date()) === 'date');
  assert('test 4', typeofDetailed(42) === 'number');
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
