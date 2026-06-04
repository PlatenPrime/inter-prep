import { truncate } from './task.js';

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
  assert('test 1', truncate('abcdef', 5) === 'ab...');
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
