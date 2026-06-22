import assert from 'node:assert/strict';
import { myCall } from './solutions/task-01-my-call.js';
import { myApply } from './solutions/task-02-my-apply.js';
import { myBind } from './solutions/task-03-my-bind.js';
import { myNew } from './solutions/task-04-my-new.js';
import { resolveThis } from './solutions/task-05-resolve-this.js';
import { softBind } from './solutions/task-06-soft-bind.js';
import { autoBindMethods } from './solutions/task-07-auto-bind-methods.js';
import { delegate } from './solutions/task-08-delegate.js';
import { createBoundClass } from './solutions/task-09-create-bound-class.js';

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

console.log('Sprint — this — practice (solutions)\n');

await check('task-01-my-call', async () => {
assert(myCall(function (a, b) { return this.x + a + b; }, { x: 10 }, 1, 2) === 13);
assert(myCall((a, b) => a + b, null, 1, 2) === 3);
});

await check('task-02-my-apply', async () => {
assert(myApply(function (a, b) { return this.v + a + b; }, { v: 5 }, [1, 2]) === 8);
});

await check('task-03-my-bind', async () => {
function add(a, b) { return (this.base || 0) + a + b; }
const b = myBind(add, { base: 10 }, 1);
assert(b(2) === 13);
function Person(name) { this.name = name; }
const Bound = myBind(Person, null);
const p = new Bound('Ann');
assert(p.name === 'Ann');
});

await check('task-04-my-new', async () => {
function Box(v) { this.v = v; }
Box.prototype.get = function () { return this.v; };
const b = myNew(Box, 42);
assert(b.v === 42 && b.get() === 42);
});

await check('task-05-resolve-this', async () => {
const o = { id: 1 };
assert(resolveThis({ mode: 'method', obj: o }) === o);
assert(resolveThis({ mode: 'global', strict: true }) === undefined);
assert(resolveThis({ mode: 'call', ctx: { x: 1 } }).x === 1);
assert(resolveThis({ mode: 'arrow', lexicalThis: { y: 2 } }).y === 2);
});

await check('task-06-soft-bind', async () => {
function greet() { return this.name; }
const soft = softBind(greet, { name: 'default' });
assert(soft() === 'default');
assert(soft.call({ name: 'override' }) === 'override');
});

await check('task-07-auto-bind-methods', async () => {
const user = {
  name: 'Ann',
  greet() { return this.name; },
};
autoBindMethods(user);
const fn = user.greet;
assert(fn() === 'Ann');
});

await check('task-08-delegate', async () => {
const o = { x: 1, inc() { this.x++; return this.x; } };
const inc = delegate(o, 'inc');
assert(inc() === 2 && o.x === 2);
});

await check('task-09-create-bound-class', async () => {
class Counter { constructor() { this.n = 0; } tick() { return ++this.n; } }
const Bound = createBoundClass(Counter);
const c = new Bound();
const tick = c.tick;
assert(tick() === 1);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
