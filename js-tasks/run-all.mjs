#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function collectTests(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && /^\d{3}-/.test(entry.name)) {
      const testFile = path.join(dir, entry.name, 'task.test.js');
      if (fs.existsSync(testFile)) out.push(testFile);
    }
  }
  return out.sort();
}

function runTest(file) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [file], {
      cwd: path.dirname(file),
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => { stdout += d; });
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => resolve({ file, code, stdout, stderr }));
  });
}

const tests = collectTests(__dirname);
console.log(`js-tasks — running ${tests.length} tests (expects your task.js implementations)\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const file of tests) {
  const rel = path.relative(__dirname, file).replace(/\\/g, '/');
  const result = await runTest(file);
  if (result.code === 0) {
    passed++;
    console.log(`  ✓ ${rel}`);
  } else {
    failed++;
    failures.push({ rel, ...result });
    console.log(`  ✗ ${rel}`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (failures.length) {
  console.log('\n--- failures (first 5) ---\n');
  for (const f of failures.slice(0, 5)) {
    console.log(f.rel);
    if (f.stderr) console.log(f.stderr.trim());
    if (f.stdout) console.log(f.stdout.trim());
  }
  process.exit(1);
}
