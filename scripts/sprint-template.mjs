export function padNum(n, width = 3) {
  return String(n).padStart(width, '0');
}

export function buildTaskStub(task) {
  return `/**
 * ${task.title}
 * ${task.description}
 */
${task.sig}

export function ${task.exportName}(${task.params}) {
  throw new Error('Not implemented');
}
`;
}

export function buildTaskSolution(task) {
  return `/**
 * ${task.title} — solution
 */
${task.sig}

${task.solution}
`;
}

export function buildDrillPuzzle(drill) {
  return `# ${padNum(drill.num)} — ${drill.titleRu}

**Блок:** ${drill.block}  
**Сложность:** ${drill.difficulty}

## Задание

${drill.puzzleRu}

## Как проверить

1. Запиши ответ в \`answer.txt\` в этой папке (одна строка на каждый вывод, или значение \`this\` для спринта this).
2. Запусти:

\`\`\`bash
node check.mjs
\`\`\`

3. Для самопроверки без спойлера — сначала не открывай \`answer.md\`.

## Подсказка

${drill.hint ?? 'Разбери код по шагам: sync → microtasks → macrotask.'}
`;
}

export function buildDrillAnswer(drill) {
  return `# ${padNum(drill.num)} — Answer

## Expected output

\`\`\`
${drill.expected.trim()}
\`\`\`

## Explanation (EN)

${drill.explanationEn}

${drill.openEnded ? `## Open-ended follow-up\n\n${drill.openEnded}` : ''}
`;
}

export function buildDrillSnippet(drill) {
  if (drill.snippet) return drill.snippet;
  return `// Run: node snippet.mjs
${drill.code}
`;
}

export function buildDrillCheck(drill) {
  return `#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const answerPath = path.join(__dirname, 'answer.txt');
const expected = ${JSON.stringify(drill.expected.trim())};

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
`;
}

export function buildRunCheckAll(sprintName, drillCount) {
  return `#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function collectChecks(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory() && /^\\d{3}-/.test(entry.name)) {
      const check = path.join(dir, entry.name, 'check.mjs');
      if (fs.existsSync(check)) out.push(check);
    }
  }
  return out.sort();
}

const checks = collectChecks(__dirname);
let verified = 0;
let missing = 0;

console.log('${sprintName} — drill answer key verification (${drillCount} drills)\\n');
console.log('Note: This verifies answer.txt matches the key when YOU fill it in.\\n');

for (const check of checks) {
  const dir = path.dirname(check);
  const answerFile = path.join(dir, 'answer.txt');
  const rel = path.relative(__dirname, dir).replace(/\\\\/g, '/');
  if (!fs.existsSync(answerFile)) {
    missing++;
    console.log(\`  ○ \${rel} — no answer.txt yet\`);
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

console.log(\`\\n\${verified} correct, \${missing} not attempted, \${checks.length - verified - missing} wrong\`);
`;
}
