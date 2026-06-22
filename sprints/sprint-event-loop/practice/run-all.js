import assert from 'node:assert/strict';
import { classifyTasks } from './solutions/task-01-classify-tasks.js';
import { predictOrder } from './solutions/task-02-predict-order.js';
import { drainStep } from './solutions/task-03-microtask-drain.js';
import { runInOrder } from './solutions/task-04-schedule-sequence.js';
import { retryBackoff } from './solutions/task-05-async-retry-backoff.js';
import { nodePhaseOrder } from './solutions/task-06-node-phase-order.js';
import { nodePriorityOrder } from './solutions/task-07-nextTick-vs-microtask.js';
import { tracePhase } from './solutions/task-08-event-loop-tracer.js';

let passed = 0;
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${name}`, e.message);
  }
}

console.log('Sprint — Event Loop — practice (solutions)\n');

await check('task-01-classify-tasks', async () => {
const r = classifyTasks([
  { kind: 'macro', label: 't1' },
  { kind: 'sync', label: 's1' },
  { kind: 'micro', label: 'p1' },
  { kind: 'node-nextTick', label: 'nt1' },
  { kind: 'sync', label: 's2' },
]);
assert(JSON.stringify(r) === JSON.stringify({ sync: ['s1','s2'], micro: ['p1'], macro: ['t1'], nextTick: ['nt1'] }));
});

await check('task-02-predict-order', async () => {
assert(JSON.stringify(predictOrder([
  { kind: 'macro', label: 't1' },
  { kind: 'sync', label: 's1' },
  { kind: 'micro', label: 'p1' },
  { kind: 'sync', label: 's2' },
])) === JSON.stringify(['s1','s2','p1','t1']));
});

await check('task-03-microtask-drain', async () => {
const r = drainStep({ sync: ['a'], micro: ['b','c'], macro: ['d','e'] });
assert(JSON.stringify(r.output) === JSON.stringify(['a','b','c','d']));
assert(r.state.macro.length === 1);
});

await check('task-04-schedule-sequence', async () => {
const out = runInOrder(['macro','sync','micro'], {
  sync: () => 's', micro: () => 'm', macro: () => 'M',
});
assert(JSON.stringify(out) === JSON.stringify(['s','m','M']));
});

await check('task-05-async-retry-backoff', async () => {
let n = 0;
const v = await retryBackoff(async () => { n++; if (n < 3) throw new Error('x'); return 7; }, 5, 1);
assert(v === 7 && n === 3);
});

await check('task-06-node-phase-order', async () => {
assert(nodePhaseOrder().join() === 'timers,pending,idle,poll,check,close');
});

await check('task-07-nextTick-vs-microtask', async () => {
assert(JSON.stringify(nodePriorityOrder([
  { kind: 'macro', label: 'm' },
  { kind: 'micro', label: 'u' },
  { kind: 'node-nextTick', label: 'n' },
  { kind: 'sync', label: 's' },
])) === JSON.stringify(['s','n','u','m']));
});

await check('task-08-event-loop-tracer', async () => {
assert(tracePhase('micro') === 'microtask-queue');
assert(tracePhase('node-nextTick') === 'nextTick-queue');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
