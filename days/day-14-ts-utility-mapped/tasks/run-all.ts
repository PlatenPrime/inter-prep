import { partialDeep } from '../solutions/task-01-partial-deep.ts';
import { requiredKeys } from '../solutions/task-02-required-keys.ts';
import { mutable } from '../solutions/task-03-mutable.ts';
import { valueOfUnion } from '../solutions/task-04-value-of-union.ts';

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

console.log('Day 14 — TS Utility & Mapped Types (solutions)\n');

const src = { a: { x: 1 }, b: 2 };
const pd = partialDeep(src);
(pd as { a: { x: number } }).a.x = 99;
assert('partialDeep copy', src.a.x === 1 && (pd as { a: { x: number } }).a.x === 99);

assert('requiredKeys', requiredKeys({ a: 1, b: 2 }).sort().join() === 'a,b');
assert('mutable', mutable([1, 2] as const).push(3) === 3);

const Role = { Admin: 'admin', User: 'user' } as const;
assert('valueOfUnion', valueOfUnion(Role).sort().join() === 'admin,user');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
