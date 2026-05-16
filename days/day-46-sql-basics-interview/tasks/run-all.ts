import { parseSelectColumns } from '../solutions/task-01-parse-select.js';
import { innerJoin } from '../solutions/task-02-inner-join.js';
import { toFirstNF } from '../solutions/task-03-normalize-1nf.js';
import { canTransition } from '../solutions/task-04-tx-state.js';

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

console.log('Day 46 — SQL Basics Interview (solutions)\n');

assert('sel',parseSelectColumns('SELECT a, b FROM t').length===2);
assert('join',innerJoin([{id:1,v:'a'}],[{id:1,x:2}]).length===1);
assert('1nf',toFirstNF({tags:['a','b']}).length===2);
assert('tx',canTransition('active','committed'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
