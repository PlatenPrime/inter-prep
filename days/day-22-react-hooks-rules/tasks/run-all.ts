import { validateHookOrder } from '../solutions/task-01-validate-hook-order.ts';
import { depsChanged } from '../solutions/task-02-deps-changed.ts';
import { staleClosureFix } from '../solutions/task-03-stale-closure-fix.ts';
import { hookCallCount } from '../solutions/task-04-hook-call-count.ts';

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

console.log('Day 22 — React Hooks Rules (solutions)\n');

assert('validateHookOrder', validateHookOrder(['useState', 'useEffect']));
assert('validateHookOrder bad', !validateHookOrder(['useState', 'useState']));

assert('depsChanged', depsChanged([1, { a: 1 }], [1, { a: 1 }]));
assert('depsChanged same ref', !depsChanged([1], [1]));

const get = staleClosureFix(1);
assert('staleClosureFix', get() === 1);

assert('hookCallCount', hookCallCount([['useState'], ['useState', 'useEffect']]) === 3);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
