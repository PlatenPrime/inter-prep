import { classifyMicroMacro } from '../solutions/task-01-classify-micro-macro.js';
import { retry } from '../solutions/task-02-retry.js';
import { delay } from '../solutions/task-03-delay.js';
import { mapLimit } from '../solutions/task-04-map-limit.js';

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

console.log('Day 08 — JS Async & Event Loop (solutions)\n');

assert(
  'classify',
  JSON.stringify(
    classifyMicroMacro([
      { type: 'timeout', label: 't1' },
      { type: 'sync', label: 's1' },
      { type: 'promise', label: 'p1' },
      { type: 'sync', label: 's2' },
    ]),
  ) === JSON.stringify(['s1', 's2', 'p1', 't1']),
);

let tries = 0;
const val = await retry(async () => {
  tries++;
  if (tries < 2) throw new Error('fail');
  return 42;
}, 3);
assert('retry', val === 42 && tries === 2);

const t0 = Date.now();
await delay(20);
assert('delay', Date.now() - t0 >= 15);

const out = await mapLimit([1, 2, 3], 2, async (x) => x * 2);
assert('mapLimit', JSON.stringify(out) === '[2,4,6]');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
