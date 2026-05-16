import { isNPlusOne } from '../solutions/task-01-n-plus-one.js';
import { diffColumns } from '../solutions/task-02-migration-diff.js';
import { buildInclude } from '../solutions/task-03-relation-load.js';
import { whereEquals } from '../solutions/task-04-query-builder.js';

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

console.log('Day 52 — ORM Prisma & TypeORM (solutions)\n');

assert('n+1',isNPlusOne([{type:'findMany',count:20}]));
assert('diff',diffColumns(['a'],['a','b'])[0]==='b');
assert('inc',buildInclude(['user']).user===true);
assert('wh',whereEquals('id',1).id.equals===1);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
