import { parseCursor } from '../solutions/task-01-cursor-parse.js';
import { buildNextCursor } from '../solutions/task-02-pagination-meta.js';
import { buildLink } from '../solutions/task-03-hateoas-link.js';
import { pickVersion } from '../solutions/task-04-api-version.js';

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

console.log('Day 39 — Express REST Design (solutions)\n');

assert('cur',parseCursor('a:1')?.id==='a');
assert('next',buildNextCursor({id:'x',createdAt:2})==='x:2');
assert('link',buildLink('self','/').rel==='self');
assert('ver',pickVersion(['v2'],['v1','v2'])==='v2');

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
