import { once } from '../solutions/task-01-once.js';
import { memoize } from '../solutions/task-02-memoize.js';
import { createCounter } from '../solutions/task-03-create-counter.js';
import { compose } from '../solutions/task-04-compose.js';

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

console.log('Day 06 — JS Scope & Closures (solutions)\n');

const g = once(() => ({ n: Math.random() }));
const a = g();
const b = g();
assert('once same ref', a === b);
let count = 0;
const inc = once(() => ++count);
inc(); inc();
assert('once single exec', count === 1);

let calls = 0;
const add = memoize((a, b) => { calls++; return a + b; });
assert('memo first', add(1, 2) === 3 && calls === 1);
assert('memo hit', add(1, 2) === 3 && calls === 1);
assert('memo miss', add(2, 2) === 4 && calls === 2);

const c = createCounter(10);
assert('inc', c.increment() === 11 && c.value === 11);
assert('dec', c.decrement() === 10);

const f = compose((x) => x + 1, (x) => x * 2);
assert('compose', f(3) === 7);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
