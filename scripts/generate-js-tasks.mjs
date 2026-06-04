#!/usr/bin/env node
/**
 * Generates js-tasks/ from scripts/js-tasks-defs.mjs
 * Run: node scripts/generate-js-tasks.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { jsTasks } from './js-tasks-defs.mjs';
import {
  buildSolutionJs,
  buildSolutionMd,
  buildTaskJs,
  buildTaskReadme,
  buildTaskTest,
  padNum,
  verifyTaskSolution,
} from './js-tasks-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'js-tasks');

console.log('Verifying 100 reference solutions…');
for (const task of jsTasks) {
  try {
    await verifyTaskSolution(task);
  } catch (e) {
    console.error(`Verify failed: ${task.label}`, e);
    process.exit(1);
  }
}
console.log('All reference solutions passed.\n');

if (fs.existsSync(outDir)) {
  for (const entry of fs.readdirSync(outDir, { withFileTypes: true })) {
    if (entry.isDirectory() && /^\d{3}-/.test(entry.name)) {
      fs.rmSync(path.join(outDir, entry.name), { recursive: true, force: true });
    }
  }
} else {
  fs.mkdirSync(outDir, { recursive: true });
}

const index = [];

for (const task of jsTasks) {
  const dirName = `${padNum(task.num)}-${task.slug}`;
  const taskDir = path.join(outDir, dirName);
  fs.mkdirSync(taskDir, { recursive: true });
  fs.writeFileSync(path.join(taskDir, 'task.js'), buildTaskJs(task), 'utf8');
  fs.writeFileSync(path.join(taskDir, 'task.test.js'), buildTaskTest(task), 'utf8');
  fs.writeFileSync(path.join(taskDir, 'solution.js'), buildSolutionJs(task), 'utf8');
  fs.writeFileSync(path.join(taskDir, 'solution.md'), buildSolutionMd(task), 'utf8');
  fs.writeFileSync(path.join(taskDir, 'README.md'), buildTaskReadme(task), 'utf8');
  index.push(task);
}

// run-all.mjs
const runAll = `#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function collectTests(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && /^\\d{3}-/.test(entry.name)) {
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
console.log(\`js-tasks — running \${tests.length} tests (expects your task.js implementations)\\n\`);

let passed = 0;
let failed = 0;
const failures = [];

for (const file of tests) {
  const rel = path.relative(__dirname, file).replace(/\\\\/g, '/');
  const result = await runTest(file);
  if (result.code === 0) {
    passed++;
    console.log(\`  ✓ \${rel}\`);
  } else {
    failed++;
    failures.push({ rel, ...result });
    console.log(\`  ✗ \${rel}\`);
  }
}

console.log(\`\\n\${passed} passed, \${failed} failed\`);

if (failures.length) {
  console.log('\\n--- failures (first 5) ---\\n');
  for (const f of failures.slice(0, 5)) {
    console.log(f.rel);
    if (f.stderr) console.log(f.stderr.trim());
    if (f.stdout) console.log(f.stdout.trim());
  }
  process.exit(1);
}
`;

fs.writeFileSync(path.join(outDir, 'run-all.mjs'), runAll, 'utf8');

let readme = `# js-tasks — 100 задач для JS-собеседования

Практический банк **001–100**: от простых типов и строк до async и алгоритмов уровня **middle**.
В каждой папке: \`README.md\`, заготовка \`task.js\`, тест \`task.test.js\`, эталон \`solution.js\` и разбор \`solution.md\`.

> Справочник: [examples/js](../examples/js). Дневные мини-наборы: [days](../days/).

## Как решать

1. Открой \`NNN-slug/README.md\`
2. Реализуй экспорты в \`task.js\`
3. Запусти \`node js-tasks/NNN-slug/task.test.js\`
4. После попытки — сверься с \`solution.md\` и \`solution.js\`

## Запуск

\`\`\`bash
# одна задача
node js-tasks/001-is-primitive/task.test.js

# все 100 (пройдут только реализованные)
npm run js-tasks

# перегенерация скелетов (maintainer)
node scripts/generate-js-tasks.mjs
node scripts/verify-js-tasks.mjs
\`\`\`

## Оглавление

| # | Папка | Задача | Сложность |
|---|-------|--------|-----------|
`;

for (const task of index) {
  const id = padNum(task.num);
  readme += `| ${id} | [\`${id}-${task.slug}/\`](${id}-${task.slug}/) | ${task.titleRu ?? task.title} | ${task.difficulty} |\n`;
}

fs.writeFileSync(path.join(outDir, 'README.md'), readme, 'utf8');
console.log(`Generated ${index.length} tasks in js-tasks/`);
