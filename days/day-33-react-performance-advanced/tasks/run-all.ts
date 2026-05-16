import { virtualRange } from '../solutions/task-01-virtual-range.js';
import { shouldMemo } from '../solutions/task-02-should-memo.js';
import { sortChunks } from '../solutions/task-03-chunk-priority.js';
import { batchApply } from '../solutions/task-04-batch-updates.js';

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

console.log('Day 33 — React Performance Advanced (solutions)\n');

const vr=virtualRange(100,50,200,100);
assert('vr',vr.start>=0&&vr.end>vr.start);
assert('memo',shouldMemo({a:1},{a:2}));
assert('chunk',sortChunks([{name:'b',priority:1},{name:'a',priority:3}])[0].name==='a');
assert('batch',batchApply(0,[s=>s+1,s=>s+2])===3);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
