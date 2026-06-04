import { adaptLegacyApi } from './task.js';

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
  const api = adaptLegacyApi({ getUser: (id, cb) => cb(null, { id }) });
  assert('test 2', (await api.fetchUser(1)).id === 1);
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
