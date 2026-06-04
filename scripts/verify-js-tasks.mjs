#!/usr/bin/env node
/**
 * Verifies reference solutions in js-tasks-defs (in-memory).
 * Run: node scripts/verify-js-tasks.mjs
 */
import { jsTasks } from './js-tasks-defs.mjs';
import { verifyTaskSolution } from './js-tasks-template.mjs';

let failed = 0;

for (const task of jsTasks) {
  try {
    await verifyTaskSolution(task);
    console.log(`  ✓ ${task.label}`);
  } catch (e) {
    failed++;
    console.log(`  ✗ ${task.label}`);
    console.error(e);
  }
}

console.log(`\n${jsTasks.length - failed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
