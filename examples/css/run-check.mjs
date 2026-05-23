#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function collectExampleDirs(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith('_') || entry.name === 'node_modules') continue;
      if (/^\d{3}-/.test(entry.name)) out.push(full);
      else out.push(...collectExampleDirs(full));
    }
  }
  return out.sort();
}

const dirs = collectExampleDirs(__dirname);
const expected = 100;
let passed = 0;
let failed = 0;
const failures = [];

console.log(`examples/css — checking ${dirs.length} examples\n`);

for (const dir of dirs) {
  const rel = path.relative(__dirname, dir).replace(/\\/g, '/');
  const issues = [];
  const indexHtml = path.join(dir, 'index.html');
  const tailwindHtml = path.join(dir, 'index.tailwind.html');
  const styleCss = path.join(dir, 'style.css');

  if (!fs.existsSync(indexHtml)) issues.push('missing index.html');
  if (!fs.existsSync(tailwindHtml)) issues.push('missing index.tailwind.html');
  if (!fs.existsSync(styleCss)) issues.push('missing style.css');
  else if (fs.statSync(styleCss).size < 8) issues.push('style.css too small');

  if (fs.existsSync(indexHtml)) {
    const html = fs.readFileSync(indexHtml, 'utf8');
    if (!html.includes('@difficulty')) issues.push('index.html missing @difficulty comment');
    if (!html.includes('demo-stage')) issues.push('index.html missing demo-stage');
    if (!html.includes('style.css')) issues.push('index.html missing style.css link');
  }

  if (fs.existsSync(tailwindHtml)) {
    const html = fs.readFileSync(tailwindHtml, 'utf8');
    if (!html.includes('cdn.tailwindcss.com')) issues.push('tailwind missing CDN');
    if (!html.includes('demo-stage')) issues.push('tailwind missing demo-stage');
  }

  if (issues.length) {
    failed++;
    failures.push({ rel, issues });
    console.log(`  ✗ ${rel}`);
  } else {
    passed++;
    console.log(`  ✓ ${rel}`);
  }
}

console.log(`\n${passed} passed, ${failed} failed`);

if (dirs.length !== expected) {
  console.error(`\nExpected ${expected} example folders, found ${dirs.length}`);
  process.exit(1);
}

if (failures.length) {
  console.log('\n--- failures ---\n');
  for (const f of failures) {
    console.log(f.rel);
    for (const i of f.issues) console.log(`  - ${i}`);
  }
  process.exit(1);
}
