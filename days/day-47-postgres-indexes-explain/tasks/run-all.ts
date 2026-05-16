import { suggestIndex } from '../solutions/task-01-suggest-index.js';
import { cheaperPlan } from '../solutions/task-02-explain-compare.js';
import { indexForQuery } from '../solutions/task-03-index-type.js';
import { matchesPartial } from '../solutions/task-04-partial-index.js';

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

console.log('Day 47 — Postgres Indexes & EXPLAIN (solutions)\n');

assert('idx',suggestIndex([{col:'id',op:'='}])[0]==='idx_id');
assert('plan',cheaperPlan({cost:1},{cost:2}).cost===1);
assert('type',indexForQuery('fulltext')==='GIN');
assert('part',matchesPartial({active:true},'active_only'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
