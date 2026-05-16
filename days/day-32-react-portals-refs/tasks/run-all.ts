import { focusTrapNext } from '../solutions/task-01-focus-trap-next.js';
import { mergeRefs } from '../solutions/task-02-merge-refs.js';
import { resolvePortalTarget } from '../solutions/task-03-portal-target.js';
import { shouldCloseOnKey } from '../solutions/task-04-escape-close.js';

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

console.log('Day 32 — React Portals & Refs (solutions)\n');

assert('focus',focusTrapNext(2,3)===0);
assert('merge',typeof mergeRefs(()=>{},null)==='function');
assert('portal',resolvePortalTarget(['a','b'],{b:true})==='b');
assert('esc',shouldCloseOnKey('Escape'));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
