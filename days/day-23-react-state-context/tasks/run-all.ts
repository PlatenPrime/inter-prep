import { createStore } from '../solutions/task-01-create-store.ts';
import { selector } from '../solutions/task-02-selector.ts';
import { splitContext } from '../solutions/task-03-split-context.ts';
import { broadcast } from '../solutions/task-04-broadcast.ts';

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

console.log('Day 23 — React State & Context (solutions)\n');

const store = createStore({ count: 0 });
let notified = 0;
store.subscribe(() => { notified++; });
store.setState({ count: 1 });
assert('createStore', store.getState().count === 1 && notified === 1);

assert('selector', selector({ a: 1, b: 2 }, (s) => s.a) === 1);

const ctx = splitContext(0, (n: number) => n);
assert('splitContext', ctx.state === 0 && ctx.dispatch(1) === 1);

const bus = broadcast<string>();
let msg = '';
bus.subscribe((p) => { msg = p; });
bus.emit('hi');
assert('broadcast', msg === 'hi');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
