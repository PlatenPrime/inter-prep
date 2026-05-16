import { parseReflog } from '../solutions/task-01-parse-reflog.js';
import { rebaseOntoPlan } from '../solutions/task-02-rebase-onto-plan.js';
import { bisectNext } from '../solutions/task-03-bisect-next.js';
import { cherryPickOrder } from '../solutions/task-04-cherry-pick-order.js';

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${name}`);
  } else {
    failed++;
    console.log(`  ✗ ${name}`);
  }
}

console.log('Day 10 — Git Advanced Tricks (solutions)\n');

const reflog = parseReflog([
  'abc1234 HEAD@{0}: reset: moving to HEAD~1',
  'def5678 HEAD@{1}: commit: add feature',
]);
assert('parseReflog', reflog[0].sha === 'abc1234' && reflog[1].index === 1);

assert(
  'rebaseOntoPlan',
  JSON.stringify(rebaseOntoPlan(['a', 'b', 'c', 'd'], 'b')) === JSON.stringify(['c', 'd']),
);

assert('bisectNext', bisectNext(0, 10) === 5);

assert(
  'cherryPickOrder',
  JSON.stringify(
    cherryPickOrder([
      { id: 'c', deps: ['b'] },
      { id: 'b', deps: ['a'] },
      { id: 'a' },
    ]),
  ) === JSON.stringify(['a', 'b', 'c']),
);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
