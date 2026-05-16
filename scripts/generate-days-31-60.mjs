/**
 * Generator for days 31–60. Run: node scripts/generate-days-31-60.mjs
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const EXT = 'ts';

function write(rel, content) {
  const full = join(ROOT, rel);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, content, 'utf8');
}

function qBlock(n, ru, en, followups, redFlags) {
  return `## Q${n}. [RU] ${ru}

**Answer (EN):**
${en}

**Follow-ups:**
${followups.map((f) => `- ${f}`).join('\n')}

**Red flags:**
${redFlags.map((f) => `- ${f}`).join('\n')}

---
`;
}

function questionsMd(title, blocks) {
  return `# ${title} — Interview Q&A

---

${blocks.map((b, i) => qBlock(i + 1, ...b)).join('\n')}`;
}

function readme(num, folder, title, phase, goals, files, selfCheck) {
  const nn = String(num).padStart(2, '0');
  return `# Day ${nn} — ${title}

> **Time:** ~4 hours | **Phase:** ${phase}

## Goals

${goals.map((g) => `- ${g}`).join('\n')}

## Files

| File | Type | Topic |
|------|------|-------|
${files.map((f) => `| \`${f.path}\` | ${f.type} | ${f.topic} |`).join('\n')}

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | \`questions/\` — answer aloud in EN |
| Practice | 90–120 min | \`tasks/\` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

${selfCheck.map((c) => `- [ ] ${c}`).join('\n')}
- [ ] All tasks pass: \`npm run day-${nn}\`

## Run

\`\`\`bash
npm run day-${nn}
npx tsx days/${folder}/tasks/run-all.ts
\`\`\`
`;
}

function taskStub(desc, sig, body = "throw new Error('Not implemented');") {
  return `/**
 * ${desc}
 */

// TODO: implement

export function ${sig} {
  ${body}
}
`;
}

function runAllTs(num, title, imports, tests) {
  const imps = imports
    .map((i) => `import { ${i.names} } from '../solutions/${i.file}.js';`)
    .join('\n');
  return `${imps}

let passed = 0;
let failed = 0;

function assert(name: string, condition: boolean): void {
  if (condition) {
    passed++;
    console.log(\`  ✓ \${name}\`);
  } else {
    failed++;
    console.log(\`  ✗ \${name}\`);
  }
}

console.log('Day ${String(num).padStart(2, '0')} — ${title} (solutions)\\n');

${tests}

console.log(\`\\n\${passed} passed, \${failed} failed\`);
process.exit(failed > 0 ? 1 : 0);
`;
}

/** @param {import('./days-31-60-defs.mjs').DayDef} day */
function generateDay(day) {
  const folder = `days/${day.folder}`;
  const files = [
    ...day.questions.map((q) => ({
      path: `questions/${q.file.split('/').pop()}`,
      type: 'Q&A',
      topic: q.topic,
    })),
    ...day.tasks.map((t) => ({
      path: `tasks/${t.file}.${EXT}`,
      type: 'Task',
      topic: t.topic,
    })),
  ];
  write(
    `${folder}/README.md`,
    readme(day.num, day.folder, day.title, day.phase, day.goals, files, day.selfCheck)
  );
  for (const q of day.questions) {
    const fname = q.file.includes('/') ? q.file.split('/').pop() : q.file;
    write(`${folder}/questions/${fname}`, questionsMd(q.title, q.blocks));
  }
  const imports = [];
  for (const t of day.tasks) {
    const base = `${t.file}.${EXT}`;
    write(
      `${folder}/tasks/${base}`,
      taskStub(t.desc, t.sig, "throw new Error('Not implemented');")
    );
    write(`${folder}/solutions/${base}`, `${t.types ? t.types + '\n' : ''}${t.solution}\n`);
    imports.push({ file: t.file, names: t.exports.includes(',') ? t.exports : t.exports });
  }
  write(`${folder}/tasks/run-all.ts`, runAllTs(day.num, day.title, imports, day.tests));
}

// Compact Q helper: [ru, en] or full tuple
function Q(ru, en, fu = ['Related follow-up?'], rf = ['Vague or wrong answer']) {
  return [ru, en, fu, rf];
}

import { DAY_DEFS } from './days-31-60-defs.mjs';

for (const day of DAY_DEFS) {
  generateDay(day);
  console.log(`Generated ${day.folder}`);
}

// Update package.json scripts
const pkgPath = join(ROOT, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
for (const day of DAY_DEFS) {
  const nn = String(day.num).padStart(2, '0');
  pkg.scripts[`day-${nn}`] = `tsx days/${day.folder}/tasks/run-all.ts`;
}
if (!pkg.devDependencies) pkg.devDependencies = {};
pkg.devDependencies.tsx = '^4.19.0';
write('package.json', JSON.stringify(pkg, null, 2) + '\n');
console.log('Updated package.json');
