import { looseEqual } from '../solutions/task-01-loose-equal.js';
import { coercionHint, coerceToNumber } from '../solutions/task-02-coercion-hint.js';
import { deepEqualLite } from '../solutions/task-03-deep-equal-lite.js';
import { strictEqual } from '../solutions/task-04-strict-equal.js';

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

console.log('Day 05 — task tests (solutions)\n');

assert('loose null undefined', looseEqual(null, undefined));
assert('loose string number', looseEqual('5', 5));
assert('loose bool', looseEqual(true, 1));
assert('loose not objects', looseEqual({}, null) === false);

assert('hint array', coercionHint([1]) === 'array');
assert('hint nan', coercionHint(NaN) === 'nan');
assert('coerce null', coerceToNumber(null) === 0);
assert('coerce empty string', coerceToNumber('') === 0);
assert('coerce bool', coerceToNumber(true) === 1);

assert('deep primitives', deepEqualLite(1, 1));
assert('deep nested', deepEqualLite({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }));
assert('deep fail', deepEqualLite({ a: 1 }, { a: 2 }) === false);

assert('strict nan', strictEqual(NaN, NaN));
assert('strict zero', strictEqual(+0, -0) === false);
assert('strict null', strictEqual(null, undefined) === false);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
