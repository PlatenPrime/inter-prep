import { reconcileKeys } from '../solutions/task-01-reconcile-keys.ts';
import { shouldUpdate } from '../solutions/task-02-should-update.ts';
import { flattenChildren } from '../solutions/task-03-flatten-children.ts';
import { listStableId } from '../solutions/task-04-list-stable-id.ts';

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

console.log('Day 21 — React Reconciliation (solutions)\n');

const diff = reconcileKeys(['a', 'b'], ['b', 'c']);
assert('reconcileKeys', diff.added.join() === 'c' && diff.removed.join() === 'a' && diff.kept.join() === 'b');

assert('shouldUpdate', shouldUpdate({ a: 1 }, { a: 2 }));
assert('shouldUpdate same', !shouldUpdate({ a: 1 }, { a: 1 }));

assert('flattenChildren', flattenChildren([1, [2, [3]]]).length === 3);

assert('listStableId', listStableId({ id: '1', slug: 'x' }, ['id', 'slug']) === '1:x');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
