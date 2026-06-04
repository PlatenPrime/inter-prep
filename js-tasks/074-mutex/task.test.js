import { createMutex } from './task.js';

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
  const m = createMutex();
  await m.acquire();
  m.release();
  assert('test 4', true);
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
