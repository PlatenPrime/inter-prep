import { cancelablePromise } from './task.js';

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
  const { promise, cancel } = cancelablePromise((res) => setTimeout(() => res(1), 50));
  cancel();
  try { await promise; assert(false); } catch (e) { assert(e.message === 'Cancelled'); }
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
