import { isAssignable } from '../solutions/task-01-is-assignable.ts';
import { pick } from '../solutions/task-02-pick.ts';
import { assertNever } from '../solutions/task-03-assert-never.ts';
import { deepFreeze } from '../solutions/task-04-deep-freeze.ts';

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

console.log('Day 11 — TS Setup & Fundamentals (solutions)\n');

const user = { id: 1, name: 'Ann' };
assert('isAssignable ok', isAssignable(user, { id: 'number', name: 'string' }));
assert('isAssignable fail', !isAssignable(user, { id: 'string' }));

assert('pick', JSON.stringify(pick(user, ['name'])) === '{"name":"Ann"}');

function assertKind(x: 'a' | 'b'): string {
  switch (x) {
    case 'a': return 'A';
    case 'b': return 'B';
    default: return assertNever(x);
  }
}
assert('assertNever path', assertKind('a') === 'A');

const frozen = deepFreeze({ nested: { x: 1 } });
assert('deepFreeze', Object.isFrozen(frozen) && Object.isFrozen((frozen as { nested: object }).nested));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
