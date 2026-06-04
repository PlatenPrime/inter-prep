import { retrySync } from './task.js';

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
  let n = 0;
  const v = retrySync(() => { if (++n < 3) throw new Error('fail'); return 'ok'; }, 5);
  assert('test 3', v === 'ok' && n === 3);
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
