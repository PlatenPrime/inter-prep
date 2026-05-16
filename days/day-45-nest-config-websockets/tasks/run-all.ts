import { mergeWsConfig } from '../solutions/task-01-config-merge.js';
import { joinRoom } from '../solutions/task-02-ws-room.js';
import { roomRecipients } from '../solutions/task-03-broadcast.js';
import { parsePort } from '../solutions/task-04-env-validate.js';

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

console.log('Day 45 — Nest Config & WebSockets (solutions)\n');

assert('cfg',mergeWsConfig({a:1},{b:2}).b===2);
assert('room',joinRoom(new Set(),'r1').has('r1'));
assert('br',roomRecipients({u1:['r1']},'r1')[0]==='u1');
assert('port',parsePort('3000')===3000);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
