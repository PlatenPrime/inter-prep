import { allowsDirtyRead } from '../solutions/task-01-isolation.js';
import { isOrdered } from '../solutions/task-02-lock-order.js';
import { isVisible } from '../solutions/task-03-mvcc-visible.js';
import { deadlockVictim } from '../solutions/task-04-deadlock.js';

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean): void {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

console.log('Day 48 — Postgres Transactions & Locks (solutions)\n');

assert('iso',allowsDirtyRead('read uncommitted'));
assert('ord',isOrdered(['users','orders'],['users','orders']));
assert('vis',isVisible(1,2));
assert('dead',deadlockVictim(['b','a'])==='a');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
