import { jsonbGet } from '../solutions/task-01-jsonb-get.js';
import { rankDoc } from '../solutions/task-02-fts-rank.js';
import { ginContains } from '../solutions/task-03-gin-match.js';
import { jsonMerge } from '../solutions/task-04-json-merge.js';

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

console.log('Day 49 — Postgres JSON & FTS (solutions)\n');

assert('json',jsonbGet({a:{b:1}},['a','b'])===1);
assert('rank',rankDoc(2,4)>0);
assert('gin',ginContains(['x'],'x'));
assert('merge',jsonMerge({a:1},{b:2}).b===2);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
