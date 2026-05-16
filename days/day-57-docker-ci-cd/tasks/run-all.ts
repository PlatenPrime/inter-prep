import { countStages } from '../solutions/task-01-dockerfile-stage.js';
import { parseImageRef } from '../solutions/task-02-image-tag.js';
import { cicdOrdered } from '../solutions/task-03-cicd-order.js';
import { parseHealthInterval } from '../solutions/task-04-healthcheck.js';

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

console.log('Day 57 — Docker & CI/CD (solutions)\n');

assert('st',countStages('FROM a\nFROM b')===2);
assert('img',parseImageRef('app:v1').tag==='v1');
assert('ci',cicdOrdered(['lint','test','build']));
assert('hc',parseHealthInterval('HEALTHCHECK --interval=30s')===30);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
