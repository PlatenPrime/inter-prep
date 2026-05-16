import { escapeHtml } from '../solutions/task-01-xss-escape.js';
import { csrfValid } from '../solutions/task-02-csrf-check.js';
import { looksLikeSqli } from '../solutions/task-03-sqli-detect.js';
import { missingSecurityHeaders } from '../solutions/task-04-security-headers.js';

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

console.log('Day 56 — Security OWASP (solutions)\n');

assert('xss',escapeHtml('<')==='&lt;');
assert('csrf',csrfValid('t','t'));
assert('sql',looksLikeSqli("union select"));
assert('hdr',missingSecurityHeaders({}).length>=1);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
