import { cacheAside } from '../solutions/task-01-cache-aside.js';
import { isStale } from '../solutions/task-02-ttl-stale.js';
import { redisKey } from '../solutions/task-03-redis-key.js';
import { invalidateByTag } from '../solutions/task-04-invalidate-tags.js';

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

console.log('Day 54 — Caching & Redis (solutions)\n');

const c=new Map();assert('ca',cacheAside(c,'k',()=>1)===1&&cacheAside(c,'k',()=>2)===1);
assert('st',isStale(0,100,50));
assert('rk',redisKey('user','1')==='user:1');
assert('inv',invalidateByTag(['a','b'],{t:['a']},'t').length===1);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
