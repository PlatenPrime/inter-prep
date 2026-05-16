import { phaseOrder } from '../solutions/task-01-event-loop-order.js';
import { parseDefaultImport } from '../solutions/task-02-parse-import.js';
import { joinChunks } from '../solutions/task-03-stream-chunk.js';
import { shouldRunMicrotasks } from '../solutions/task-04-queue-micro.js';

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

console.log('Day 36 — Node Event Loop & Modules (solutions)\n');

assert('ph',phaseOrder()[0]==='timers');
assert('imp',parseDefaultImport("import fs from 'fs'")==='fs');
assert('ch',joinChunks(['a','b'])==='ab');
assert('mi',shouldRunMicrotasks(1,0));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
