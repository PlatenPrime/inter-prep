import { resolveProviders } from '../solutions/task-01-resolve-provider.js';
import { parseExports } from '../solutions/task-02-module-exports.js';
import { matchToken } from '../solutions/task-03-inject-token.js';
import { hasCircular } from '../solutions/task-04-circular.js';

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

console.log('Day 42 — Nest Modules & DI (solutions)\n');

assert('prov',resolveProviders({A:['B'],B:[]}).indexOf('B')<resolveProviders({A:['B'],B:[]}).indexOf('A'));
assert('exp',parseExports('export class X{}').includes('X'));
assert('tok',matchToken('Logger',{Logger:{}}));
assert('cyc',!hasCircular({A:[]}));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
