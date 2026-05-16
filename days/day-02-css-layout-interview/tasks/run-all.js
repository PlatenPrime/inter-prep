import { computeOuterSize } from '../solutions/task-01-box-model.js';
import { collapseMargins } from '../solutions/task-02-margin-collapse.js';
import { distributeFlexWidths } from '../solutions/task-03-flex-distribute.js';
import { specificity } from '../solutions/task-04-specificity.js';

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

console.log('Day 02 — task tests (solutions)\n');

const contentBox = computeOuterSize({
  width: 200,
  height: 100,
  padding: 10,
  border: 2,
  margin: 8,
  boxSizing: 'content-box',
});
assert('content-box outer width', contentBox.outerWidth === 240);
assert('content-box outer height', contentBox.outerHeight === 140);

const borderBox = computeOuterSize({
  width: 200,
  height: 100,
  padding: 10,
  border: 2,
  margin: 8,
  boxSizing: 'border-box',
});
assert('border-box outer width', borderBox.outerWidth === 216);

assert('margin collapse positive', collapseMargins([10, 30, 20]) === 30);
assert('margin collapse mixed', collapseMargins([20, -10]) === 10);
assert('margin collapse negative', collapseMargins([-15, -5]) === -15);

const widths = distributeFlexWidths(600, 20, [
  { flexGrow: 1, flexBasis: 100 },
  { flexGrow: 2, flexBasis: 100 },
]);
assert('flex item count', widths.length === 2);
assert('flex total', widths[0] + widths[1] + 20 === 600);
assert(
  'flex grow ratio',
  Math.abs(widths[1] - 100 - (widths[0] - 100) * 2) < 0.01
);

assert('specificity id class', JSON.stringify(specificity('#nav .item:hover')) === '[1,2,0]');
assert('specificity element', JSON.stringify(specificity('main article::before')) === '[0,0,3]');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
