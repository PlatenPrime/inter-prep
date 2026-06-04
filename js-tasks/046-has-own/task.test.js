import { hasOwn } from './task.js';

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
  const o = Object.create({ a: 1 });
  o.b = 2;
  assert('test 3', hasOwn(o, 'b') === true);
  assert('test 4', hasOwn(o, 'a') === false);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
