import { debounce } from '../solutions/task-01-debounce.js';
import { throttle } from '../solutions/task-02-throttle.js';
import { virtualWindow } from '../solutions/task-03-virtual-window.js';
import { matchesDelegate } from '../solutions/task-04-matches-delegate.js';

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

console.log('Day 09 — DOM & Performance (solutions)\n');

let debouncedVal = 0;
const deb = debounce(() => { debouncedVal++; }, 30);
deb(); deb();
await new Promise((r) => setTimeout(r, 40));
assert('debounce', debouncedVal === 1);

let throttleCount = 0;
const thr = throttle(() => throttleCount++, 50);
thr(); thr();
assert('throttle immediate', throttleCount >= 1);

const vw = virtualWindow([1, 2, 3, 4, 5], 2, 2);
assert('virtualWindow', vw.items.length === 2 && vw.items[0] === 3 && vw.total === 5);

const node = {
  matches: (s) => s === '.btn',
  parentElement: { matches: () => false, parentElement: null },
};
assert('matchesDelegate', matchesDelegate('.btn', node));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
