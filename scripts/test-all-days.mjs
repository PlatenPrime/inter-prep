#!/usr/bin/env node
/**
 * Run all day task tests (solutions). Exit 1 if any day fails.
 */
import { spawnSync } from 'node:child_process';

const failures = [];

for (let n = 1; n <= 60; n++) {
  const script = `day-${String(n).padStart(2, '0')}`;
  const result = spawnSync('npm', ['run', script], {
    stdio: 'pipe',
    shell: true,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    failures.push(script);
    console.error(`FAIL ${script}\n${result.stdout}\n${result.stderr}`);
  } else {
    const match = result.stdout.match(/(\d+) passed/);
    console.log(`OK   ${script} — ${match?.[1] ?? '?'} passed`);
  }
}

if (failures.length) {
  console.error(`\n${failures.length} day(s) failed: ${failures.join(', ')}`);
  process.exit(1);
}
console.log('\nAll 60 days passed.');
