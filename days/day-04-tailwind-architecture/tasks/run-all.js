import { parseUtilities } from '../solutions/task-01-parse-utilities.js';
import { mergeUtilities } from '../solutions/task-02-merge-utilities.js';
import { extractRepeatedPatterns } from '../solutions/task-03-extract-patterns.js';
import { resolveToken } from '../solutions/task-04-resolve-tokens.js';

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

console.log('Day 04 — task tests (solutions)\n');

const parsed = parseUtilities('flex items-center gap-4 p-4');
assert('parse display', parsed.display === 'flex');
assert('parse padding', parsed.padding === '1rem');
assert('parse gap', parsed.gap === '1rem');

const merged = mergeUtilities(['p-4 m-2', 'p-2 text-lg']);
assert('merge last padding', merged.padding === '0.5rem');
assert('merge keeps margin', merged.margin === '0.5rem');
assert('merge font', merged.fontSize === '1.125rem');

const patterns = extractRepeatedPatterns(
  [
    { classes: 'flex items-center gap-4' },
    { classes: 'flex items-center p-4' },
    { classes: 'block' },
  ],
  2
);
assert('pattern found', patterns.some((p) => p.pattern === 'flex items-center' && p.count === 2));

const tokens = { colors: { blue: { 500: '#3b82f6' } }, spacing: { 4: '1rem' } };
assert('resolve token', resolveToken(tokens, 'colors.blue.500') === '#3b82f6');
assert('resolve missing', resolveToken(tokens, 'colors.red.500') === undefined);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
