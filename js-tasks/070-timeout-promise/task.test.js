import { timeoutPromise } from './task.js';

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

async function run() {
  try {
  await timeoutPromise(new Promise((r) => setTimeout(r, 100)), 5);
  assert('test 3', false);
  } catch (e) {
  assert('test 5', e.message === 'Timeout');
  }
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
