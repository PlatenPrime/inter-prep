import { isMoreSelective } from '../solutions/task-01-index-selectivity.js';
import { isCovered } from '../solutions/task-02-covered-query.js';
import { shardBalance } from '../solutions/task-03-shard-key.js';
import { isCollectionScan } from '../solutions/task-04-explain-mongo.js';

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

console.log('Day 51 — Mongo Indexes & Performance (solutions)\n');

assert('sel',isMoreSelective(0.9,0.1));
assert('cov',isCovered(['a'],['a','b']));
assert('shard',shardBalance([10,12])>0.8);
assert('coll',isCollectionScan('COLLSCAN'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
