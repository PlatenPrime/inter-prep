import { composeMiddleware } from '../solutions/task-01-compose-mw.js';
import { asyncHandler } from '../solutions/task-02-async-handler.js';
import { errorToStatus } from '../solutions/task-03-error-mw.js';
import { nextRequestId } from '../solutions/task-04-request-id.js';

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

console.log('Day 38 — Express Middleware (solutions)\n');

let n=0;composeMiddleware([(r,next)=>{n++;next()}])({});
assert('mw',n===1);
assert('err',errorToStatus('NOT_FOUND')===404);
assert('rid',nextRequestId(5)==='req-5');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
