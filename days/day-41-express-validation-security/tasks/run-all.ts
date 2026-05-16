import { validateFields } from '../solutions/task-01-validate-schema.js';
import { rateLimitAllowed } from '../solutions/task-02-rate-limit.js';
import { stripScriptTags } from '../solutions/task-03-sanitize.js';
import { corsAllowed } from '../solutions/task-04-cors.js';

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

console.log('Day 41 — Express Validation & Security (solutions)\n');

assert('val',validateFields({},['email']).includes('email'));
assert('rate',rateLimitAllowed(5,10));
assert('san',!stripScriptTags('<script>x</script>hi').includes('script'));
assert('cors',corsAllowed('http://a',['http://a']));

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
