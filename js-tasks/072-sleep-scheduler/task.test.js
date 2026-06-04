import { createScheduler } from './task.js';

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
  const s = createScheduler();
  let v = 0;
  s.schedule(async () => { v = 1; }, 1);
  await new Promise((r) => setTimeout(r, 10));
  assert('test 5', v === 1);
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
