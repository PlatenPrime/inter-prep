import { createPool } from './task.js';

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
  const pool = createPool(2);
  const r = await pool.run(async () => 1);
  assert('test 3', r === 1);
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
