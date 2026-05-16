import { canActivate } from '../solutions/task-01-guard.js';
import { parseIntPipe } from '../solutions/task-02-pipe-transform.js';
import { isEmail } from '../solutions/task-03-validation-pipe.js';
import { httpStatusForGuard } from '../solutions/task-04-forbidden.js';

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean): void {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

console.log('Day 43 — Nest Guards & Pipes (solutions)\n');

assert('guard',canActivate(['user'],'user'));
assert('pipe',parseIntPipe('42')===42);
assert('email',isEmail('a@b.co'));
assert('403',httpStatusForGuard(false)===403);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
