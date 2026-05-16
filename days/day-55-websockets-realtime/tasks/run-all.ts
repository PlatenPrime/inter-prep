import { pickRealtime } from '../solutions/task-01-ws-vs-sse.js';
import { broadcastToRoom } from '../solutions/task-02-room-broadcast.js';
import { backoffDelay } from '../solutions/task-03-reconnect-backoff.js';
import { appendSeq } from '../solutions/task-04-message-order.js';

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

console.log('Day 55 — WebSockets & Realtime (solutions)\n');

assert('rt',pickRealtime(true)==='websocket');
assert('bc',broadcastToRoom({u:['r']},'r')[0]==='u');
assert('bo',backoffDelay(2,100)===400);
assert('seq',appendSeq([{seq:1}],2));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
