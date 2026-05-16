import { overfetchRatio } from '../solutions/task-01-overfetch.js';
import { maxDepth } from '../solutions/task-02-graphql-depth.js';
import { restCacheKey } from '../solutions/task-03-cache-key.js';
import { pickApi } from '../solutions/task-04-pick-api.js';

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

console.log('Day 53 — GraphQL vs REST (solutions)\n');

assert('over',overfetchRatio(10,2)===5);
assert('depth',maxDepth({children:[{children:[{children:[]}]}]})===3);
assert('key',restCacheKey('GET','/u').includes('GET'));
assert('api',pickApi(true)==='graphql');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
