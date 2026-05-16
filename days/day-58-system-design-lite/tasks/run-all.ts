import { capTradeoff } from '../solutions/task-01-cap-pick.js';
import { estimateRps } from '../solutions/task-02-load-estimate.js';
import { pickDatabase } from '../solutions/task-03-db-pick.js';
import { routeService } from '../solutions/task-04-gateway-route.js';

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

console.log('Day 58 — System Design Lite (solutions)\n');

assert('cap',capTradeoff(true).includes('CP'));
assert('rps',estimateRps(3,1000)===3000);
assert('db',pickDatabase(true,false)==='postgres');
assert('gw',routeService('/api/x',{'/api':'svc'})==='svc');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
