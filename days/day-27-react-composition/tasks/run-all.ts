import { compoundSlots } from '../solutions/task-01-compound-slots.ts';
import { useSlot } from '../solutions/task-02-use-slot.ts';
import { mergeRefs } from '../solutions/task-03-merge-refs.ts';
import { forwardRefPoly } from '../solutions/task-04-forward-ref-poly.ts';

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

console.log('Day 27 — React Composition (solutions)\n');

const slots = compoundSlots({ header: 'H', body: 'B' });
assert('compoundSlots', slots.header === 'H');

assert('useSlot', useSlot({ a: 1 }, 'a', 0) === 1 && useSlot({}, 'x', 9) === 9);

let el: HTMLDivElement | null = null;
const setRef = mergeRefs<HTMLDivElement>((n) => { el = n; });
setRef({ tagName: 'DIV' } as unknown as HTMLDivElement);
assert('mergeRefs', el !== null);

const withRef = forwardRefPoly({ className: 'x' }, null);
assert('forwardRefPoly', withRef.className === 'x' && 'ref' in withRef);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
