import { tap } from './task.js';

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
  let x;
  assert('test 2', tap(5, (v) => { x = v; }) === 5 && x === 5);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
