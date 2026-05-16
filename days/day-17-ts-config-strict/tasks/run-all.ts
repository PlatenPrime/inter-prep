import { strictFlagsScore } from '../solutions/task-01-strict-flags-score.ts';
import { needsNoImplicitAny } from '../solutions/task-02-needs-no-implicit-any.ts';
import { checkStrictNull } from '../solutions/task-03-check-strict-null.ts';
import { mergeCompilerOptions } from '../solutions/task-04-merge-compiler-options.ts';

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

console.log('Day 17 — TS Config & Strict Mode (solutions)\n');

assert('strictFlagsScore', strictFlagsScore({ strict: true, noImplicitAny: true, strictNullChecks: false }) === 2);
assert('needsNoImplicitAny', needsNoImplicitAny('function foo(x) { return x; }'));
assert('needsNoImplicitAny typed', !needsNoImplicitAny('function foo(x: number) { return x; }'));
assert('checkStrictNull', checkStrictNull('user.profile.name'));
assert('checkStrictNull safe', !checkStrictNull('user?.profile?.name'));
assert('mergeCompilerOptions', (mergeCompilerOptions({ strict: false }, { strict: true }) as { strict: boolean }).strict === true);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
