#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function collectJsFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectJsFiles(full));
    else if (/^\d{3}-.+\.js$/.test(entry.name)) out.push(full);
  }
  return out.sort();
}

function runFile(file) {
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

const files = collectJsFiles(__dirname);
console.log(`examples/js — running ${files.length} self-tests\n`);

let passed = 0;
let failed = 0;
const failures = [];

for (const file of files) {
  const rel = path.relative(__dirname, file).replace(/\\/g, '/');
  const result = await runFile(file);
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
  console.log('\n--- failures ---\n');
  for (const f of failures) {
    console.log(f.rel);
    if (f.stderr) console.log(f.stderr.trim());
    if (f.stdout) console.log(f.stdout.trim());
    console.log('');
  }
  process.exit(1);
}
