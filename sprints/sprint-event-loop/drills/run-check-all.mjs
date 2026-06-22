#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function collectChecks(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && /^\d{3}-/.test(entry.name)) {
      const check = path.join(dir, entry.name, 'check.mjs');
      if (fs.existsSync(check)) out.push(check);
    }
  }
  return out.sort();
}

const checks = collectChecks(__dirname);
let verified = 0;
let missing = 0;

console.log('Sprint Event Loop — drill answer key verification (38 drills)\n');
console.log('Note: This verifies answer.txt matches the key when YOU fill it in.\n');

for (const check of checks) {
  const dir = path.dirname(check);
  const answerFile = path.join(dir, 'answer.txt');
  const rel = path.relative(__dirname, dir).replace(/\\/g, '/');
  if (!fs.existsSync(answerFile)) {
    missing++;
    console.log(`  ○ ${rel} — no answer.txt yet`);
    continue;
  }
  await new Promise((resolve) => {
    const child = spawn(process.execPath, [check], { cwd: dir, stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) verified++;
      resolve();
    });
  });
}

console.log(`\n${verified} correct, ${missing} not attempted, ${checks.length - verified - missing} wrong`);
