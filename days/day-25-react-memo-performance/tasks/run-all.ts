import { shallowEqual } from '../solutions/task-01-shallow-equal.ts';
import { memoProps } from '../solutions/task-02-memo-props.ts';
import { whyDidYouRenderLite } from '../solutions/task-03-why-did-you-render-lite.ts';
import { selectSlice } from '../solutions/task-04-select-slice.ts';

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

console.log('Day 25 — React Memo & Performance (solutions)\n');

assert('shallowEqual', shallowEqual({ a: 1 }, { a: 1 }));
assert('shallowEqual ne', !shallowEqual({ a: 1 }, { a: 2 }));

assert('memoProps', memoProps({ variant: 'primary' }, { disabled: true }).variant === 'primary');

assert('whyDidYouRenderLite', whyDidYouRenderLite({ a: 1, b: 2 }, { a: 1, b: 3 }).join() === 'b');

const sel = selectSlice((s: { a: number; b: number }) => ({ a: s.a }));
const s1 = { a: 1, b: 1 };
const r1 = sel(s1);
const r2 = sel({ a: 1, b: 2 });
assert('selectSlice stable', r1 === r2);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
