import { parseJwtPayload } from '../solutions/task-01-parse-jwt-payload.js';
import { isTokenExpired } from '../solutions/task-02-token-expired.js';
import { hasScopes } from '../solutions/task-03-scope-check.js';
import { rotateRefresh } from '../solutions/task-04-rotate-refresh.js';

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

console.log('Day 40 — Express Auth & JWT (solutions)\n');

const p=parseJwtPayload('x.'+Buffer.from('{"sub":"u1"}').toString('base64url')+'.y');
assert('jwt',p?.sub==='u1');
assert('exp',isTokenExpired({exp:1},2));
assert('scope',hasScopes(['read'],['read']));
const s=new Set(['a']);assert('rot',rotateRefresh(s,'a','b')&&s.has('b'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
