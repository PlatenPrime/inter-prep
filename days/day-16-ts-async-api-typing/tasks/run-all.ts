import { toResult } from '../solutions/task-01-to-result.ts';
import { mapAsync } from '../solutions/task-02-map-async.ts';
import { sequence } from '../solutions/task-03-sequence.ts';
import { timeoutPromise } from '../solutions/task-04-timeout-promise.ts';

let passed = 0;
let failed = 0;

function assert(name: boolean | string, condition?: boolean): void {
  const label = typeof name === 'string' ? name : 'assert';
  const ok = typeof name === 'string' ? Boolean(condition) : Boolean(name);
  if (ok) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.log(`  ✗ ${label}`);
  }
}

console.log('Day 16 — TS Async & API Typing (solutions)\n');

const ok = await toResult(Promise.resolve(1));
assert('toResult ok', ok.ok && ok.value === 1);
const fail = await toResult(Promise.reject(new Error('x')));
assert('toResult fail', !fail.ok);

const mapped = await mapAsync([1, 2], async (x) => x * 2);
assert('mapAsync', JSON.stringify(mapped) === '[2,4]');

const order: number[] = [];
const seq = await sequence([
  async () => { order.push(1); return 1; },
  async () => { order.push(2); return 2; },
]);
assert('sequence', JSON.stringify(seq) === '[1,2]' && order.join() === '1,2');

const fast = await timeoutPromise(Promise.resolve('ok'), 50);
assert('timeout resolve', fast === 'ok');
let timedOut = false;
try {
  await timeoutPromise(new Promise(() => {}), 20);
} catch {
  timedOut = true;
}
assert('timeout reject', timedOut);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
