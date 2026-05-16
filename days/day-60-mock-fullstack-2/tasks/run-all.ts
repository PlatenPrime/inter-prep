import { hasStarSections } from '../solutions/task-01-star-format.js';
import { parseServices } from '../solutions/task-02-system-recap.js';
import { frameWeakness } from '../solutions/task-03-weakness-frame.js';
import { rankTopics } from '../solutions/task-04-priority-rank.js';

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

console.log('Day 60 — Mock Full-Stack 2 (solutions)\n');

assert('star',hasStarSections('Situation task action result'));
assert('svc',parseServices(['api','']).length===1);
assert('wk',frameWeakness('over-engineered','ship MVPs').includes('now'));
assert('rank',rankTopics({a:1,b:3})[0]==='b');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
