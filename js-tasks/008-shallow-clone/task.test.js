import { shallowClone } from './task.js';

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
  const o = { a: 1 };
  const c = shallowClone(o);
  assert('test 3', c !== o && c.a === 1);
  const arr = [1, 2];
  assert('test 5', shallowClone(arr).join() === '1,2');
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
