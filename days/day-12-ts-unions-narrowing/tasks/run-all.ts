import { narrowShape } from '../solutions/task-01-narrow-shape.ts';
import { exhaustiveCheck } from '../solutions/task-02-exhaustive-check.ts';
import { isKeyOf } from '../solutions/task-03-is-key-of.ts';
import { parseResult } from '../solutions/task-04-parse-result.ts';

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

console.log('Day 12 — TS Unions & Narrowing (solutions)\n');

const a = { kind: 'user', id: 1 };
assert('narrowShape hit', narrowShape(a, 'user')?.id === 1);
assert('narrowShape miss', narrowShape(a, 'post') === null);

assert('isKeyOf', isKeyOf('id', { id: 1, name: 'x' }) && !isKeyOf('missing', { id: 1 }));

const isNum = (x: unknown): x is number => typeof x === 'number';
const r = parseResult(42, isNum);
assert('parseResult ok', r.ok && r.value === 42);
const bad = parseResult('x', isNum);
assert('parseResult fail', !bad.ok);

function mapKind(k: 'on' | 'off'): string {
  switch (k) {
    case 'on': return 'ON';
    case 'off': return 'OFF';
    default: return exhaustiveCheck(k);
  }
}
assert('exhaustiveCheck', mapKind('on') === 'ON');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
