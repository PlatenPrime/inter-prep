import { mergeProps } from '../solutions/task-01-merge-props.ts';
import { polymorphicAs } from '../solutions/task-02-polymorphic-as.ts';
import { defaultProps } from '../solutions/task-03-default-props.ts';
import { childrenCount } from '../solutions/task-04-children-count.ts';

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

console.log('Day 19 — TS React Props (solutions)\n');

assert('mergeProps', mergeProps({ a: 1, b: 1 }, { b: 2 }).b === 2);
assert('polymorphicAs', polymorphicAs('button', 'span') === 'button' && polymorphicAs(undefined, 'span') === 'span');
assert('defaultProps', defaultProps({ a: 1 }, { b: 2, a: 0 }).a === 1 && defaultProps({ a: 1 }, { b: 2 }).b === 2);
assert('childrenCount', childrenCount([1, null, 2, false]) === 2 && childrenCount('x') === 1);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
