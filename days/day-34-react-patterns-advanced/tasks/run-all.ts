import { sumReducer } from '../solutions/task-01-reducer.js';
import { fsmStep } from '../solutions/task-02-fsm-step.js';
import { countSlots } from '../solutions/task-03-compound-slots.js';
import { runCommands } from '../solutions/task-04-command-queue.js';

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

console.log('Day 34 — React Patterns Advanced (solutions)\n');

assert('red',sumReducer(1,{type:'add',value:2})===3);
assert('fsm',fsmStep('idle','FETCH')==='loading');
assert('slots',countSlots([{slot:'icon'},{slot:'icon'}]).icon===2);
assert('cmd',runCommands([()=>1,()=>2],0)===3);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
