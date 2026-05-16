import { matchContainerStyles } from '../solutions/task-01-container-query.js';
import { contrastRatio } from '../solutions/task-02-contrast-ratio.js';
import { wcagContrastLevel } from '../solutions/task-03-wcag-level.js';
import { evaluateClamp } from '../solutions/task-04-clamp-value.js';

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

console.log('Day 03 — task tests (solutions)\n');

const styles = matchContainerStyles(480, [
  { maxWidth: 400, styles: { columns: 1 } },
  { minWidth: 401, maxWidth: 800, styles: { columns: 2 } },
  { minWidth: 801, styles: { columns: 3 } },
]);
assert('container query columns', styles.columns === 2);

const ratio = contrastRatio('#000000', '#ffffff');
assert('contrast ratio max', ratio === 21);
assert('contrast ratio mid', contrastRatio('#767676', '#ffffff') >= 4.5);

assert('wcag AA normal', wcagContrastLevel(4.5) === 'AA');
assert('wcag AAA normal', wcagContrastLevel(7) === 'AAA');
assert('wcag fail', wcagContrastLevel(3) === 'fail');
assert('wcag large AA', wcagContrastLevel(3, { isLargeText: true }) === 'AA');
assert('wcag ui', wcagContrastLevel(3, { isUiComponent: true }) === 'AA');

assert('clamp min', evaluateClamp(16, 24, 0, 32, 400) === 24);
assert('clamp max', evaluateClamp(16, 0, 5, 32, 2000) === 32);
assert('clamp preferred', evaluateClamp(16, 18, 0, 32, 400) === 18);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
