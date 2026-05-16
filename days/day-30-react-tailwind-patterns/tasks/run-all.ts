import { cn } from '../solutions/task-01-cn.ts';
import { cvaVariant } from '../solutions/task-02-cva-variant.ts';
import { darkClass } from '../solutions/task-03-dark-class.ts';
import { tokenResolve } from '../solutions/task-04-token-resolve.ts';

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

console.log('Day 30 — React Tailwind Patterns (solutions)\n');

assert('cn', cn('a', false, 'b', undefined, 'c') === 'a b c');

assert('cvaVariant', cvaVariant({ default: 'bg-gray-500', primary: 'bg-blue-500' }, 'primary') === 'bg-blue-500');

assert('darkClass', darkClass('bg-black text-white') === 'dark:bg-black dark:text-white');

const tokens = { color: { primary: '#00f' } };
assert('tokenResolve', tokenResolve(tokens, 'color.primary') === '#00f');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
