import { parseEndpoint } from '../solutions/task-01-design-endpoint.js';
import { complexityLabel } from '../solutions/task-02-complexity.js';
import { findFailingTrace } from '../solutions/task-03-debug-trace.js';
import { scoreOption } from '../solutions/task-04-tradeoff.js';

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

console.log('Day 59 — Mock Full-Stack 1 (solutions)\n');

assert('ep',parseEndpoint('get /users').method==='GET');
assert('cx',complexityLabel(10,n=>n).includes('O(n)'));
assert('tr',findFailingTrace([{name:'db',ok:false}])==='db');
assert('to',scoreOption({a:1,b:3})==='b');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
