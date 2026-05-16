import { groupBy } from '../solutions/task-01-group-by.ts';
import { pickKeys } from '../solutions/task-02-pick-keys.ts';
import { omitKeys } from '../solutions/task-03-omit-keys.ts';
import { identity } from '../solutions/task-04-identity.ts';

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

console.log('Day 13 — TS Generics & Inference (solutions)\n');

const gb = groupBy([{ t: 'a', v: 1 }, { t: 'b', v: 2 }, { t: 'a', v: 3 }], (x) => x.t);
assert('groupBy', gb.a.length === 2 && gb.b.length === 1);

const obj = { a: 1, b: 2, c: 3 };
assert('pickKeys', JSON.stringify(pickKeys(obj, ['a', 'c'])) === '{"a":1,"c":3}');
assert('omitKeys', JSON.stringify(omitKeys(obj, ['b'])) === '{"a":1,"c":3}');
assert('identity', identity(42) === 42 && identity('x') === 'x');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
