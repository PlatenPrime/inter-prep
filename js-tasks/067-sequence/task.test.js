import { sequence } from './task.js';

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
  const r = await sequence([() => Promise.resolve(1), () => Promise.resolve(2)]);
  assert('test 2', r.join() === '1,2');
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
