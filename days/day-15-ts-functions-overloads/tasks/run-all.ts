import { createEmitter } from '../solutions/task-01-create-emitter.ts';
import { callAll } from '../solutions/task-02-call-all.ts';
import { bindArgs } from '../solutions/task-03-bind-args.ts';
import { overloadAdd } from '../solutions/task-04-overload-add.ts';

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

console.log('Day 15 — TS Functions & Overloads (solutions)\n');

const emitter = createEmitter();
let n = 0;
const off = emitter.on('tick', (x: unknown) => { n += x as number; });
emitter.emit('tick', 2);
emitter.emit('tick', 3);
off();
emitter.emit('tick', 100);
assert('createEmitter', n === 5);

let ran = 0;
await callAll([() => { ran++; }, async () => { ran++; }]);
assert('callAll', ran === 2);

const greet = bindArgs((a: string, b: string) => `${a} ${b}`, 'Hello');
assert('bindArgs', greet('World') === 'Hello World');

assert('overloadAdd num', overloadAdd(1, 2) === 3);
assert('overloadAdd str', overloadAdd('a', 'b') === 'ab');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
