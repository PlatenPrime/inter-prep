import { brand } from '../solutions/task-01-brand.ts';
import { parseEmail } from '../solutions/task-02-parse-email.ts';
import { safeParseUser } from '../solutions/task-03-safe-parse-user.ts';
import { stripBrand } from '../solutions/task-04-strip-brand.ts';

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

console.log('Day 20 — TS Branded & Runtime Validation (solutions)\n');

const u = brand({ id: '1' }, 'User');
assert('brand', u.id === '1');

assert('parseEmail', parseEmail('a@b.co') === 'a@b.co' && parseEmail('bad') === null);

assert('safeParseUser', safeParseUser({ id: '1', email: 'a@b.co' })?.id === '1');
assert('safeParseUser fail', safeParseUser({ id: '1', email: 'nope' }) === null);

const plain = stripBrand(brand({ x: 1 }, 'X'));
assert('stripBrand', plain.x === 1);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
