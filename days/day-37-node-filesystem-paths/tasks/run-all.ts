import { mergeConfig } from '../solutions/task-01-resolve-config.js';
import { envSubstitute } from '../solutions/task-02-env-substitute.js';
import { isPathSafe } from '../solutions/task-03-path-safe.js';
import { validateConfig } from '../solutions/task-04-config-validate.js';

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

console.log('Day 37 — Node FS & Paths (solutions)\n');

assert('cfg',mergeConfig({a:'1'},{a:'2'}).a==='2');
assert('env',envSubstitute('hi ${X}',{X:'there'})==='hi there');
assert('path',!isPathSafe('../etc'));
assert('val',validateConfig({},['a']).includes('a'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
