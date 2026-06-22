#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const answerPath = path.join(__dirname, 'answer.txt');
const expected = "start\nend\np1\np2\ntimeout";

if (!fs.existsSync(answerPath)) {
  console.error('Create answer.txt with your prediction first.');
  process.exit(1);
}

const user = fs.readFileSync(answerPath, 'utf8').trim();
if (user === expected) {
  console.log('✓ Correct');
  process.exit(0);
}

console.error('✗ Incorrect');
console.error('Your answer:', JSON.stringify(user));
console.error('Length expected:', expected.length, 'got:', user.length);
process.exit(1);
