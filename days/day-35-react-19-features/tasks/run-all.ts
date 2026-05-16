import { parseActionName } from '../solutions/task-01-parse-action.js';
import { optimisticPrepend } from '../solutions/task-02-optimistic.js';
import { promiseStatus } from '../solutions/task-03-use-promise-status.js';
import { countPending } from '../solutions/task-04-form-pending.js';

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

console.log('Day 35 — React 19 Features (solutions)\n');

assert('act',parseActionName(new Map([['$action','save']]))==='save');
assert('opt',optimisticPrepend([1],0)[0]===0);
assert('pst',promiseStatus({ok:false})==='rejected');
assert('pend',countPending({a:true,b:false})===1);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
