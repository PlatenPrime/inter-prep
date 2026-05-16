import { mapResponse } from '../solutions/task-01-interceptor-map.js';
import { formatException } from '../solutions/task-02-exception-filter.js';
import { isTimedOut } from '../solutions/task-03-timeout.js';
import { formatLog } from '../solutions/task-04-logging.js';

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

console.log('Day 44 — Nest Interceptors & Filters (solutions)\n');

assert('map',mapResponse(1,x=>Number(x)+1)===2);
assert('ex',formatException({status:400,message:'bad'}).statusCode===400);
assert('to',isTimedOut(0,100,50));
assert('log',formatLog('info','ok').includes('INFO'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
