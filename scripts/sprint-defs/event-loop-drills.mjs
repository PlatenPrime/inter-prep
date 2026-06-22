function drill(num, slug, block, titleRu, code, expected, explanationEn, extra = {}) {
  return {
    num,
    slug,
    block,
    titleRu,
    difficulty: extra.difficulty ?? 'medium',
    puzzleRu: `Предскажи **порядок вывода** в консоль. Запиши каждое значение на отдельной строке в \`answer.txt\`.\n\n\`\`\`javascript\n${code.trim()}\n\`\`\``,
    code: code.trim(),
    expected: expected.trim(),
    explanationEn,
    hint: extra.hint,
    openEnded: extra.openEnded,
    snippet: extra.snippet,
  };
}

/** @type {import('../generate-sprints.mjs').Drill[]} */
export const eventLoopDrills = [
  // A. Basic order (6)
  drill(1, 'classic-sync-promise-timeout', 'A — Basic order',
    'Классика: sync → micro → macro',
    `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    '1\n4\n3\n2',
    'Sync runs first (1, 4). Then all microtasks drain (3). Then one macrotask (2).'),

  drill(2, 'promise-before-timeout', 'A — Basic order',
    'Два microtask перед macro',
    `console.log('start');
setTimeout(() => console.log('timeout'), 0);
Promise.resolve().then(() => console.log('p1'));
Promise.resolve().then(() => console.log('p2'));
console.log('end');`,
    'start\nend\np1\np2\ntimeout',
    'Both promise callbacks are microtasks and run before the setTimeout macrotask.'),

  drill(3, 'nested-sync-in-then', 'A — Basic order',
    'Sync внутри then',
    `Promise.resolve().then(() => {
  console.log('a');
  console.log('b');
});
console.log('c');`,
    'c\na\nb',
    'Outer sync c runs first. Then microtask runs a and b synchronously within that callback.'),

  drill(4, 'timeout-zero-not-immediate', 'A — Basic order',
    'setTimeout(0) не immediate',
    `console.log(1);
setTimeout(() => console.log(2), 0);
console.log(3);`,
    '1\n3\n2',
    'setTimeout schedules a macrotask; sync 1 and 3 complete before the timer callback.'),

  drill(5, 'multiple-sync-then-micro', 'A — Basic order',
    'Три sync, потом micro',
    `console.log('A');
console.log('B');
Promise.resolve().then(() => console.log('C'));
console.log('D');`,
    'A\nB\nD\nC',
    'All synchronous code completes before microtask C.'),

  drill(6, 'interval-vs-promise', 'A — Basic order',
    'setInterval первый tick',
    `console.log('x');
setInterval(() => console.log('i'), 0);
Promise.resolve().then(() => console.log('y'));
console.log('z');`,
    'x\nz\ny\ni',
    'First interval callback is a macrotask like setTimeout; microtask y runs before it.'),

  // B. Nested Promise chains (6)
  drill(7, 'then-chain-sync', 'B — Nested Promises',
    'Цепочка then',
    `Promise.resolve()
  .then(() => console.log(1))
  .then(() => console.log(2));
console.log(3);`,
    '3\n1\n2',
    'Sync 3 first. Each then schedules a new microtask; they run in order 1 then 2.'),

  drill(8, 'then-returns-promise', 'B — Nested Promises',
    'then возвращает Promise',
    `Promise.resolve()
  .then(() => {
    console.log('a');
    return Promise.resolve();
  })
  .then(() => console.log('b'));
console.log('c');`,
    'c\na\nb',
    'Returning a Promise from then defers the next then until that Promise settles — still all microtasks before any macro.'),

  drill(9, 'promise-in-then', 'B — Nested Promises',
    'Promise.resolve внутри then',
    `Promise.resolve().then(() => {
  console.log(1);
  Promise.resolve().then(() => console.log(2));
  console.log(3);
});
console.log(4);`,
    '4\n1\n3\n2',
    'Inside first microtask: sync 1,3 run. Inner then(2) queues another microtask drained before loop continues to macrotasks.'),

  drill(10, 'catch-then-order', 'B — Nested Promises',
    'catch и then',
    `Promise.reject('e')
  .catch(() => console.log('catch'))
  .then(() => console.log('then'));
console.log('sync');`,
    'sync\ncatch\nthen',
    'Rejected promise handled by catch (microtask), then next then runs as another microtask.'),

  drill(11, 'finally-order', 'B — Nested Promises',
    'finally в цепочке',
    `Promise.resolve()
  .then(() => console.log('t'))
  .finally(() => console.log('f'));
console.log('s');`,
    's\nt\nf',
    'finally runs after then handler in the microtask chain.'),

  drill(12, 'nested-then-three-deep', 'B — Nested Promises',
    'Три уровня вложенности',
    `Promise.resolve().then(() => {
  console.log('L1');
  Promise.resolve().then(() => {
    console.log('L2');
    Promise.resolve().then(() => console.log('L3'));
  });
});
console.log('S');`,
    'S\nL1\nL2\nL3',
    'Each nested Promise.then adds microtasks drained depth-first before macrotasks.'),

  // C. async/await (6)
  drill(13, 'async-basic', 'C — async/await',
    'Базовый async',
    `async function foo() {
  console.log('a');
  await Promise.resolve();
  console.log('b');
}
foo();
console.log('c');`,
    'a\nc\nb',
    'await splits async function: sync a, then suspend; sync c runs; microtask resumes b.'),

  drill(14, 'async-await-chain', 'C — async/await',
    'Два await подряд',
    `async function bar() {
  console.log(1);
  await null;
  console.log(2);
  await null;
  console.log(3);
}
bar();
console.log(4);`,
    '1\n4\n2\n3',
    'Each await yields a microtask; 4 runs between first and second resume.'),

  drill(15, 'async-try-catch', 'C — async/await',
    'try/catch в async',
    `async function fail() {
  try {
    await Promise.reject('x');
    console.log('no');
  } catch (e) {
    console.log('err');
  }
}
fail();
console.log('out');`,
    'out\nerr',
    'Async function starts synchronously until first await; rejection handled in microtask.'),

  drill(16, 'async-for-loop', 'C — async/await',
    'await в цикле',
    `async function loop() {
  for (let i = 0; i < 2; i++) {
    await Promise.resolve();
    console.log(i);
  }
}
loop();
console.log('done');`,
    'done\n0\n1',
    'Loop body after await runs as separate microtask turns; done prints before any await resumes.'),

  drill(17, 'async-promise-all', 'C — async/await',
    'await Promise.all',
    `async function all() {
  console.log('start');
  await Promise.all([
    Promise.resolve().then(() => console.log('a')),
    Promise.resolve().then(() => console.log('b')),
  ]);
  console.log('end');
}
all();
console.log('sync');`,
    'start\nsync\na\nb\nend',
    'Promise.all microtasks for a,b run before all() resumes to end.'),

  drill(18, 'async-nested', 'C — async/await',
    'Вложенные async',
    `async function outer() {
  console.log('O1');
  await inner();
  console.log('O2');
}
async function inner() {
  console.log('I1');
  await null;
  console.log('I2');
}
outer();
console.log('X');`,
    'O1\nI1\nX\nI2\nO2',
    'inner awaits after I1; outer waits for inner; X runs before I2 microtask.'),

  // D. setTimeout nesting (5)
  drill(19, 'timeout-in-timeout', 'D — setTimeout nesting',
    'setTimeout внутри setTimeout',
    `setTimeout(() => {
  console.log('outer');
  setTimeout(() => console.log('inner'), 0);
}, 0);
console.log('sync');`,
    'sync\nouter\ninner',
    'Each setTimeout is one macrotask per turn; inner schedules after outer completes.'),

  drill(20, 'promise-in-timeout', 'D — setTimeout nesting',
    'Promise внутри setTimeout',
    `setTimeout(() => {
  console.log('t1');
  Promise.resolve().then(() => console.log('p1'));
}, 0);
console.log('s');`,
    's\nt1\np1',
    'Inside macrotask: sync t1, then microtask p1 before next macrotask.'),

  drill(21, 'timeout-promise-race', 'D — setTimeout nesting',
    'Кто первый: timeout или promise',
    `setTimeout(() => console.log('T'), 0);
Promise.resolve().then(() => console.log('P'));
console.log('S');`,
    'S\nP\nT',
    'Classic: microtask P before macrotask T.'),

  drill(22, 'two-timeouts-order', 'D — setTimeout nesting',
    'Два setTimeout(0)',
    `setTimeout(() => console.log('A'), 0);
setTimeout(() => console.log('B'), 0);
console.log('C');`,
    'C\nA\nB',
    'Timeouts queued in order; each macrotask runs one at a time after microtasks.'),

  drill(23, 'timeout-then-timeout', 'D — setTimeout nesting',
    'then внутри timeout',
    `setTimeout(() => {
  Promise.resolve().then(() => console.log('micro'));
  console.log('macro');
}, 0);
console.log('start');`,
    'start\nmacro\nmicro',
    'Macrotask runs macro sync first, then drains microtasks from that turn.'),

  // E. queueMicrotask mix (4)
  drill(24, 'queue-microtask-vs-promise', 'E — queueMicrotask',
    'queueMicrotask vs Promise',
    `queueMicrotask(() => console.log('q'));
Promise.resolve().then(() => console.log('p'));
console.log('s');`,
    's\nq\np',
    'Both are microtasks; order follows queue FIFO — q registered before p then callback.'),

  drill(25, 'microtask-in-microtask', 'E — queueMicrotask',
    'queueMicrotask внутри then',
    `Promise.resolve().then(() => {
  queueMicrotask(() => console.log('inner'));
  console.log('outer');
});
console.log('sync');`,
    'sync\nouter\ninner',
    'inner microtask queued during outer microtask runs in same drain pass after outer sync part.'),

  drill(26, 'triple-microtask', 'E — queueMicrotask',
    'Три microtask источника',
    `queueMicrotask(() => console.log(1));
Promise.resolve().then(() => console.log(2));
queueMicrotask(() => console.log(3));
console.log(0);`,
    '0\n1\n2\n3',
    'FIFO microtask queue: q1, promise then, q3 — order 1,2,3.'),

  drill(27, 'recursive-microtask', 'E — queueMicrotask',
    'Рекурсивный queueMicrotask',
    `let n = 0;
function step() {
  console.log(n++);
  if (n < 3) queueMicrotask(step);
}
step();
console.log('done');`,
    '0\ndone\n1\n2',
    'First step sync prints 0; done sync; then microtasks 1,2 drain before macrotasks.'),

  // F. Browser-only notes (3) — simulated without DOM
  drill(28, 'raf-after-microtask', 'F — Browser APIs',
    'rAF после microtask (концепт)',
    `// In browser: requestAnimationFrame runs before next paint, after microtasks
console.log('sync');
Promise.resolve().then(() => console.log('micro'));
// rAF callback would print 'raf' here — after micro, before paint
console.log('sync2');`,
    'sync\nsync2\nmicro',
    'Without real rAF in Node, focus on sync then micro. In browser: sync, sync2, micro, raf, paint.'),

  drill(29, 'mutation-observer-concept', 'F — Browser APIs',
    'MutationObserver — microtask (концепт)',
    `console.log('1');
// observer callback is microtask
Promise.resolve().then(() => console.log('2'));
console.log('3');`,
    '1\n3\n2',
    'MutationObserver callbacks are microtasks like Promise — same ordering lesson.'),

  drill(30, 'script-defer-concept', 'F — Browser APIs',
    'Порядок script vs DOMContentLoaded (концепт)',
    `console.log('parse');
Promise.resolve().then(() => console.log('micro'));
console.log('end');`,
    'parse\nend\nmicro',
    'Deferred scripts and DOM events are macrotasks; this drill reinforces parse-time sync vs micro.'),

  // G. Node-specific (5)
  drill(31, 'node-nexttick-before-promise', 'G — Node.js',
    'nextTick перед Promise',
    `console.log('start');
process.nextTick(() => console.log('nextTick'));
Promise.resolve().then(() => console.log('promise'));
console.log('end');`,
    'start\nend\nnextTick\npromise',
    'In Node, nextTick queue drains before other microtasks (Promise callbacks).'),

  drill(32, 'node-nexttick-nested', 'G — Node.js',
    'Вложенный nextTick',
    `process.nextTick(() => {
  console.log('A');
  process.nextTick(() => console.log('B'));
});
console.log('C');`,
    'C\nA\nB',
    'Nested nextTick in same phase queues B before yielding to Promise microtasks.'),

  drill(33, 'node-setimmediate-vs-timeout', 'G — Node.js',
    'setImmediate vs setTimeout(0)',
    `import { setImmediate } from 'node:timers';
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
console.log('sync');`,
    'sync\ntimeout\nimmediate',
    'Order can vary by context; from main module setTimeout often runs before setImmediate. Accept: sync first, then both macros.',
    'In I/O cycle setImmediate often runs before setTimeout. Interview: mention context dependency.',
    { hint: 'Запиши: sync, затем timeout, затем immediate (типичный порядок из main).' }),

  drill(34, 'node-nexttick-starvation-concept', 'G — Node.js',
    'nextTick starvation (концепт)',
    `console.log('1');
process.nextTick(() => console.log('2'));
Promise.resolve().then(() => console.log('3'));
console.log('4');`,
    '1\n4\n2\n3',
    'nextTick 2 runs before Promise 3 — illustrates priority and starvation risk.'),

  drill(35, 'node-io-poll-concept', 'G — Node.js',
    'poll phase callback (концепт)',
    `console.log('sync');
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('micro'));
console.log('sync2');`,
    'sync\nsync2\nmicro\nimmediate',
    'setImmediate runs in check phase (macrotask) after microtasks drain.'),

  // H. Open-ended (3)
  drill(36, 'infinite-promise-loop', 'H — Explain why',
    'Бесконечный microtask loop',
    `function spin() {
  Promise.resolve().then(spin);
}
// spin(); // uncomment would starve macrotasks
console.log('safe');`,
    'safe',
    'Recursive Promise.resolve().then prevents macrotasks and I/O from running — event loop starvation.',
    { openEnded: 'Explain why this blocks setTimeout and HTTP callbacks. How would you fix a library that does this?' }),

  drill(37, 'blocking-sync-concept', 'H — Explain why',
    'Блокирующий sync код',
    `console.log('before');
// while(Date.now() < start + 100) {} // blocks loop
console.log('after');`,
    'before\nafter',
    'Long sync work blocks all callbacks — offload to worker_threads or chunk with setImmediate.',
    { openEnded: 'How do you detect event loop lag in production (Node clinic, perf hooks)?' }),

  drill(38, 'floating-promise-concept', 'H — Explain why',
    'Floating promise в React',
    `async function load() {
  return Promise.resolve('data');
}
load().then((d) => console.log(d));
console.log('render');`,
    'render\ndata',
    'Floating promises resolve as microtasks after sync render; in React useEffect must handle cleanup and errors.',
    { openEnded: 'Why is an unhandled rejection in useEffect dangerous? Mention eslint-plugin-react-hooks.' }),
];
