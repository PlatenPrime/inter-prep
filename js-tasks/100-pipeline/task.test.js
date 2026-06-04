import { createPipeline } from './task.js';

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
  const p = createPipeline();
  p.use(async (ctx, next) => { ctx.a = 1; return next(); });
  p.use(async (ctx, next) => { ctx.b = 2; return next(); });
  const ctx = await p.run({});
  assert('test 5', ctx.a === 1 && ctx.b === 2);
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
