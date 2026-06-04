import { createCircuitBreaker } from './task.js';

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
  let n = 0;
  const fn = createCircuitBreaker(async () => { if (++n < 4) throw new Error('fail'); return 'ok'; }, { threshold: 2, resetMs: 1 });
  try { await fn(); } catch {}
  try { await fn(); } catch {}
  try { await fn(); assert(false); } catch (e) { assert(e.message === 'Circuit open'); }
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
