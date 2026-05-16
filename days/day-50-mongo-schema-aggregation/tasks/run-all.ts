import { pipelineHasStage } from '../solutions/task-01-pipeline-stage.js';
import { recommendStorage } from '../solutions/task-02-embed-vs-ref.js';
import { sumByKey } from '../solutions/task-03-aggregate-group.js';
import { mongoValidate } from '../solutions/task-04-schema-validate.js';

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

console.log('Day 50 — Mongo Schema & Aggregation (solutions)\n');

assert('pipe',pipelineHasStage([{op:'$match'}],'$match'));
assert('store',recommendStorage(2000,100)==='reference');
assert('sum',sumByKey([{k:'a',v:1},{k:'a',v:2}]).a===3);
assert('sch',mongoValidate({id:1},['id']));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
