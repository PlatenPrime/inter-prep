import { parseTestIds } from '../solutions/task-01-parse-test-id.js';
import { getAccessibleName } from '../solutions/task-02-accessible-name.js';
import { isValidClickSequence } from '../solutions/task-03-click-sequence.js';
import { aggregateResults } from '../solutions/task-04-aggregate-results.js';

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

console.log('Day 31 — React Testing & RTL (solutions)\n');

assert('tid',parseTestIds('<div data-testid="x"></motion.div>').get('x')==='div');
assert('name',getAccessibleName({textContent:'Go'})==='Go');
assert('seq',isValidClickSequence(['pointerdown','pointerup','click']));
assert('agg',aggregateResults([{status:'passed'},{status:'failed'}]).total===2);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
