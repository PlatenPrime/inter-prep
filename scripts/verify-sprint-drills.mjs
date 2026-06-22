#!/usr/bin/env node
/**
 * Verifies drill answer keys by writing expected to answer.txt and running check.mjs
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function collectDrillDirs(sprintPath) {
  const drillsDir = path.join(root, 'sprints', sprintPath, 'drills');
  return fs
    .readdirSync(drillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() && /^\d{3}-/.test(e.name))
    .map((e) => path.join(drillsDir, e.name))
    .sort();
}

async function runCheck(dir, expected) {
  const answerPath = path.join(dir, 'answer.txt');
  fs.writeFileSync(answerPath, expected, 'utf8');
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ['check.mjs'], { cwd: dir, stdio: 'pipe' });
    let stderr = '';
    child.stderr.on('data', (d) => { stderr += d; });
    child.on('close', (code) => resolve({ code, stderr }));
  });
}

function readExpectedFromAnswerMd(dir) {
  const md = fs.readFileSync(path.join(dir, 'answer.md'), 'utf8');
  const match = md.match(/```\n([\s\S]*?)```/);
  return match ? match[1].trimEnd() : null;
}

async function verifySprint(name) {
  const dirs = collectDrillDirs(name);
  let ok = 0;
  let fail = 0;
  for (const dir of dirs) {
    const expected = readExpectedFromAnswerMd(dir);
    if (expected == null) {
      console.log(`  ✗ ${path.basename(dir)} — no expected in answer.md`);
      fail++;
      continue;
    }
    const result = await runCheck(dir, expected);
    if (result.code === 0) {
      ok++;
    } else {
      fail++;
      console.log(`  ✗ ${path.basename(dir)}`, result.stderr.trim());
    }
    fs.unlinkSync(path.join(dir, 'answer.txt'));
  }
  console.log(`${name}: ${ok} keys ok, ${fail} failed`);
  return fail === 0;
}

let allOk = true;
allOk = (await verifySprint('sprint-event-loop')) && allOk;
allOk = (await verifySprint('sprint-this')) && allOk;
process.exit(allOk ? 0 : 1);
