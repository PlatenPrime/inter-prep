/** @type {import('../generate-sprints.mjs').PracticeTask[]} */
export const eventLoopPractice = [
  {
    file: 'task-01-classify-tasks',
    title: 'Classify tasks',
    description: 'Classify API entries as sync, micro, macro, or node-nextTick.',
    exportName: 'classifyTasks',
    params: 'entries',
    sig: `/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries
 * @returns {{ sync: string[], micro: string[], macro: string[], nextTick: string[] }}
 */`,
    solution: `export function classifyTasks(entries) {
  const sync = [];
  const micro = [];
  const macro = [];
  const nextTick = [];
  for (const e of entries) {
    if (e.kind === 'sync') sync.push(e.label);
    else if (e.kind === 'micro') micro.push(e.label);
    else if (e.kind === 'node-nextTick') nextTick.push(e.label);
    else macro.push(e.label);
  }
  return { sync, micro, macro, nextTick };
}`,
    test: `const r = classifyTasks([
  { kind: 'macro', label: 't1' },
  { kind: 'sync', label: 's1' },
  { kind: 'micro', label: 'p1' },
  { kind: 'node-nextTick', label: 'nt1' },
  { kind: 'sync', label: 's2' },
]);
assert(JSON.stringify(r) === JSON.stringify({ sync: ['s1','s2'], micro: ['p1'], macro: ['t1'], nextTick: ['nt1'] }));`,
  },
  {
    file: 'task-02-predict-order',
    title: 'Predict execution order',
    description: 'Given ordered task kinds, return labels in event-loop execution order.',
    exportName: 'predictOrder',
    params: 'entries',
    sig: `/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries — registration order
 * @returns {string[]} execution order
 */`,
    solution: `export function predictOrder(entries) {
  const sync = [];
  const micro = [];
  const macro = [];
  const nextTick = [];
  for (const e of entries) {
    if (e.kind === 'sync') sync.push(e.label);
    else if (e.kind === 'micro') micro.push(e.label);
    else if (e.kind === 'node-nextTick') nextTick.push(e.label);
    else macro.push(e.label);
  }
  return [...sync, ...nextTick, ...micro, ...macro];
}`,
    test: `assert(JSON.stringify(predictOrder([
  { kind: 'macro', label: 't1' },
  { kind: 'sync', label: 's1' },
  { kind: 'micro', label: 'p1' },
  { kind: 'sync', label: 's2' },
])) === JSON.stringify(['s1','s2','p1','t1']));`,
  },
  {
    file: 'task-03-microtask-drain',
    title: 'Microtask drain simulator',
    description: 'Process queue: run all sync, then drain microtasks (FIFO), then one macro.',
    exportName: 'drainStep',
    params: 'state',
    sig: `/**
 * @typedef {{ sync: string[], micro: string[], macro: string[] }} QueueState
 * @param {QueueState} state
 * @returns {{ output: string[], state: QueueState }}
 */`,
    solution: `export function drainStep(state) {
  const output = [];
  const sync = [...state.sync];
  const micro = [...state.micro];
  const macro = [...state.macro];
  while (sync.length) output.push(sync.shift());
  while (micro.length) output.push(micro.shift());
  if (macro.length) output.push(macro.shift());
  return { output, state: { sync, micro, macro } };
}`,
    test: `const r = drainStep({ sync: ['a'], micro: ['b','c'], macro: ['d','e'] });
assert(JSON.stringify(r.output) === JSON.stringify(['a','b','c','d']));
assert(r.state.macro.length === 1);`,
  },
  {
    file: 'task-04-schedule-sequence',
    title: 'Schedule sequence',
    description: 'Run fns in event-loop order: all sync first, then micro callbacks, then macro.',
    exportName: 'runInOrder',
    params: 'plan, fns',
    sig: `/**
 * @typedef {'sync'|'micro'|'macro'} Phase
 * @param {Phase[]} plan
 * @param {Record<string, () => string>} fns
 * @returns {string[]}
 */`,
    solution: `export function runInOrder(plan, fns) {
  const order = { sync: 0, micro: 1, macro: 2 };
  const sorted = [...plan].sort((a, b) => order[a] - order[b]);
  return sorted.map((key) => fns[key]());
}`,
    test: `const out = runInOrder(['macro','sync','micro'], {
  sync: () => 's', micro: () => 'm', macro: () => 'M',
});
assert(JSON.stringify(out) === JSON.stringify(['s','m','M']));`,
  },
  {
    file: 'task-05-async-retry-backoff',
    title: 'Async retry with backoff',
    description: 'Retry async fn up to attempts with exponential backoff delay.',
    exportName: 'retryBackoff',
    params: 'fn, attempts, baseMs',
    sig: `/**
 * @param {() => Promise<unknown>} fn
 * @param {number} attempts
 * @param {number} baseMs
 * @returns {Promise<unknown>}
 */`,
    solution: `export async function retryBackoff(fn, attempts, baseMs) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      lastErr = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseMs * 2 ** i));
      }
    }
  }
  throw lastErr;
}`,
    test: `let n = 0;
const v = await retryBackoff(async () => { n++; if (n < 3) throw new Error('x'); return 7; }, 5, 1);
assert(v === 7 && n === 3);`,
    runAsync: true,
  },
  {
    file: 'task-06-node-phase-order',
    title: 'Node event loop phases',
    description: 'Return canonical Node.js event loop phase names in order.',
    exportName: 'nodePhaseOrder',
    params: '',
    sig: '',
    solution: `export function nodePhaseOrder() {
  return ['timers', 'pending', 'idle', 'poll', 'check', 'close'];
}`,
    test: `assert(nodePhaseOrder().join() === 'timers,pending,idle,poll,check,close');`,
  },
  {
    file: 'task-07-nextTick-vs-microtask',
    title: 'nextTick vs microtask priority',
    description: 'Sort labels by Node priority: sync, nextTick, micro, macro.',
    exportName: 'nodePriorityOrder',
    params: 'entries',
    sig: `/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {{ kind: TaskKind, label: string }[]} entries
 * @returns {string[]}
 */`,
    solution: `export function nodePriorityOrder(entries) {
  const buckets = { sync: [], 'node-nextTick': [], micro: [], macro: [] };
  for (const e of entries) buckets[e.kind].push(e.label);
  return [...buckets.sync, ...buckets['node-nextTick'], ...buckets.micro, ...buckets.macro];
}`,
    test: `assert(JSON.stringify(nodePriorityOrder([
  { kind: 'macro', label: 'm' },
  { kind: 'micro', label: 'u' },
  { kind: 'node-nextTick', label: 'n' },
  { kind: 'sync', label: 's' },
])) === JSON.stringify(['s','n','u','m']));`,
  },
  {
    file: 'task-08-event-loop-tracer',
    title: 'Event loop tracer',
    description: 'Map schedule kinds to human-readable phase labels.',
    exportName: 'tracePhase',
    params: 'kind',
    sig: `/**
 * @typedef {'sync'|'micro'|'macro'|'node-nextTick'} TaskKind
 * @param {TaskKind} kind
 * @returns {string}
 */`,
    solution: `export function tracePhase(kind) {
  const map = {
    sync: 'call-stack',
    micro: 'microtask-queue',
    macro: 'macrotask-queue',
    'node-nextTick': 'nextTick-queue',
  };
  return map[kind];
}`,
    test: `assert(tracePhase('micro') === 'microtask-queue');
assert(tracePhase('node-nextTick') === 'nextTick-queue');`,
  },
];
