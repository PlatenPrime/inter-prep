#!/usr/bin/env node
/**
 * Generates sprints/ content from scripts/sprint-defs/
 * Run: node scripts/generate-sprints.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { eventLoopPractice } from './sprint-defs/event-loop-practice.mjs';
import { eventLoopDrills } from './sprint-defs/event-loop-drills.mjs';
import { eventLoopTheory } from './sprint-defs/event-loop-theory.mjs';
import { thisPractice } from './sprint-defs/this-practice.mjs';
import { thisDrills } from './sprint-defs/this-drills.mjs';
import { thisTheory } from './sprint-defs/this-theory.mjs';
import {
  buildDrillAnswer,
  buildDrillCheck,
  buildDrillPuzzle,
  buildDrillSnippet,
  buildRunCheckAll,
  buildTaskSolution,
  buildTaskStub,
  padNum,
} from './sprint-template.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const sprintsDir = path.join(root, 'sprints');

/** @typedef {{ file: string, title: string, description: string, exportName: string, params: string, sig: string, solution: string, test: string, runAsync?: boolean }} PracticeTask */
/** @typedef {{ num: number, slug: string, block: string, titleRu: string, difficulty: string, puzzleRu: string, code: string, expected: string, explanationEn: string, hint?: string, openEnded?: string, snippet?: string, async?: boolean }} Drill */

function writeTheory(dir, files) {
  const theoryDir = path.join(dir, 'theory');
  fs.mkdirSync(theoryDir, { recursive: true });
  for (const file of files) {
    const lines = [`# ${file.title} — Interview Q&A`, '', '---', ''];
    file.blocks.forEach((b, i) => {
      lines.push(`## Q${i + 1}. [RU] ${b.q}`, '');
      lines.push('**Answer (EN):**');
      lines.push(b.a, '');
      if (b.followups?.length) {
        lines.push('**Follow-ups:**');
        b.followups.forEach((f) => lines.push(`- ${f}`));
        lines.push('');
      }
      if (b.redFlags?.length) {
        lines.push('**Red flags:**');
        b.redFlags.forEach((r) => lines.push(`- ${r}`));
        lines.push('');
      }
      lines.push('---', '');
    });
    fs.writeFileSync(path.join(theoryDir, `${file.file}.md`), lines.join('\n'), 'utf8');
  }
}

function needsAsync(code) {
  return /setTimeout|setInterval|Promise\.|process\.nextTick|setImmediate|async |await /.test(code);
}

function buildAsyncSnippet(code) {
  return `// Run: node snippet.mjs — captures console.log output after async drain
const __logs = [];
const __orig = console.log;
console.log = (...args) => {
  const line = args.map((a) => (typeof a === 'string' ? a : JSON.stringify(a))).join(' ');
  __logs.push(line);
  __orig(...args);
};

${code}

async function __drain() {
  for (let i = 0; i < 8; i++) {
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => {
      if (typeof process !== 'undefined' && process.nextTick) process.nextTick(r);
      else r();
    });
  }
}

await __drain();
console.log = __orig;
console.log('--- captured output (for self-check) ---');
__logs.forEach((l) => console.log(l));
`;
}

function writeDrills(sprintDir, drills, sprintLabel) {
  const drillsDir = path.join(sprintDir, 'drills');
  fs.mkdirSync(drillsDir, { recursive: true });
  for (const drill of drills) {
    const folder = `${padNum(drill.num)}-${drill.slug}`;
    const dir = path.join(drillsDir, folder);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'puzzle.md'), buildDrillPuzzle(drill), 'utf8');
    fs.writeFileSync(path.join(dir, 'answer.md'), buildDrillAnswer(drill), 'utf8');
    const snippetBody = drill.snippet ?? (needsAsync(drill.code) ? buildAsyncSnippet(drill.code) : `// Run: node snippet.mjs\n${drill.code}\n`);
    fs.writeFileSync(path.join(dir, 'snippet.mjs'), snippetBody, 'utf8');
    fs.writeFileSync(path.join(dir, 'check.mjs'), buildDrillCheck(drill), 'utf8');
  }
  fs.writeFileSync(
    path.join(drillsDir, 'run-check-all.mjs'),
    buildRunCheckAll(sprintLabel, drills.length),
    'utf8',
  );
  fs.writeFileSync(
    path.join(drillsDir, 'README.md'),
    `# Drills — ${sprintLabel}

${drills.length} puzzle folders. For each:

1. Read \`puzzle.md\`
2. Write prediction to \`answer.txt\`
3. \`node check.mjs\`
4. Optional: \`node snippet.mjs\` then compare with \`answer.md\`

Run all checks: \`npm run ${sprintLabel.includes('Event') ? 'sprint-event-loop:drills' : 'sprint-this:drills'}\`
`,
    'utf8',
  );
}

function writePractice(sprintDir, tasks, sprintTitle, npmScript) {
  const tasksDir = path.join(sprintDir, 'practice', 'tasks');
  const solDir = path.join(sprintDir, 'practice', 'solutions');
  fs.mkdirSync(tasksDir, { recursive: true });
  fs.mkdirSync(solDir, { recursive: true });

  const imports = tasks.map((t) => `import { ${t.exportName} } from './solutions/${t.file}.js';`).join('\n');
  const tests = tasks.map((t) => t.test).join('\n\n');
  const hasAsync = tasks.some((t) => t.runAsync);

  for (const task of tasks) {
    fs.writeFileSync(path.join(tasksDir, `${task.file}.js`), buildTaskStub(task), 'utf8');
    fs.writeFileSync(path.join(solDir, `${task.file}.js`), buildTaskSolution(task), 'utf8');
  }

  const runAll = `import assert from 'node:assert/strict';
${imports}

let passed = 0;
let failed = 0;

async function check(name, fn) {
  try {
    await fn();
    passed++;
    console.log(\`  ✓ \${name}\`);
  } catch (e) {
    failed++;
    console.log(\`  ✗ \${name}\`, e.message);
  }
}

console.log('${sprintTitle} — practice (solutions)\\n');

${tasks.map((t) => `await check('${t.file}', async () => {\n${t.test}\n});`).join('\n\n')}

console.log(\`\\n\${passed} passed, \${failed} failed\`);
process.exit(failed > 0 ? 1 : 0);
`;

  fs.writeFileSync(path.join(sprintDir, 'practice', 'run-all.js'), runAll, 'utf8');
  fs.writeFileSync(
    path.join(sprintDir, 'practice', 'README.md'),
    `# Practice — ${sprintTitle}

Implement stubs in \`tasks/\`, verify solutions via:

\`\`\`bash
npm run ${npmScript}
\`\`\`
`,
    'utf8',
  );
}

function writeSprintReadme(dir, meta) {
  const theoryRows = meta.theoryFiles.map((f) => `| \`theory/${f}.md\` | Q&A |`).join('\n');
  const taskRows = meta.tasks.map((t) => `| \`practice/tasks/${t.file}.js\` | Task | ${t.title} |`).join('\n');
  fs.writeFileSync(
    path.join(dir, 'README.md'),
    `# ${meta.title}

> **Time:** ~${meta.hours} hours | **Type:** Expert deep-dive sprint

## Goals

${meta.goals.map((g) => `- ${g}`).join('\n')}

## Prerequisites

${meta.prerequisites.map((p) => `- ${p}`).join('\n')}

## Files

| File | Type | Topic |
|------|------|-------|
${theoryRows}
${taskRows}
| \`drills/\` | Drills | ${meta.drillCount} puzzles with \`check.mjs\` |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 2–2.5 h | \`theory/\` — answer aloud in EN |
| Practice | 2.5–3 h | \`practice/tasks/\` |
| Drills pass 1 | 2–2.5 h | \`drills/\` — no spoilers |
| Drills pass 2 | 1.5–2 h | Retry mistakes + open-ended |
| Review | 1 h | Self-check below |

## Self-check

${meta.selfCheck.map((s) => `- [ ] ${s}`).join('\n')}

## Run

\`\`\`bash
npm run ${meta.npmScript}
npm run ${meta.npmDrillsScript}
\`\`\`

## Further reading

${meta.links.map((l) => `- ${l}`).join('\n')}
`,
    'utf8',
  );
}

// --- Event Loop Sprint ---
const elDir = path.join(sprintsDir, 'sprint-event-loop');
fs.mkdirSync(elDir, { recursive: true });
writeTheory(elDir, eventLoopTheory);
writePractice(elDir, eventLoopPractice, 'Sprint — Event Loop', 'sprint-event-loop');
writeDrills(elDir, eventLoopDrills, 'Sprint Event Loop');
writeSprintReadme(elDir, {
  title: 'Sprint — Event Loop (Browser + Node)',
  hours: 10,
  goals: [
    'Предсказывать порядок вывода для любого sync/micro/macro/nextTick сочетания',
    'Объяснять фазы Node.js event loop и роль libuv',
    'Реализовывать async-паттерны с пониманием очередей',
  ],
  prerequisites: ['`days/day-08-js-async-event-loop`', '`days/day-36-node-eventloop-modules`'],
  theoryFiles: eventLoopTheory.map((f) => f.file),
  tasks: eventLoopPractice,
  drillCount: eventLoopDrills.length,
  selfCheck: [
    '35+ drills correct without answer.md',
    'All 8 practice tasks pass',
    'Can whiteboard browser vs Node differences',
  ],
  npmScript: 'sprint-event-loop',
  npmDrillsScript: 'sprint-event-loop:drills',
  links: [
    '[webdev Event Loop](../../webdev/10.%20async-js/004-chto-takoe-cikl-sobytiy-event-loop-i-kak-on-rabotaet.md)',
    '[webdev Micro vs Macro](../../webdev/10.%20async-js/005-raznica-mezhdu-mikro-i-makrozadachami-v-event-loop.md)',
  ],
});

// --- This Sprint ---
const thisDir = path.join(sprintsDir, 'sprint-this');
fs.mkdirSync(thisDir, { recursive: true });
writeTheory(thisDir, thisTheory);
writePractice(thisDir, thisPractice, 'Sprint — this', 'sprint-this');
writeDrills(thisDir, thisDrills, 'Sprint this');
writeSprintReadme(thisDir, {
  title: 'Sprint — `this` Binding',
  hours: 10,
  goals: [
    'Применять 4 правила binding без ошибок',
    'Реализовать call/apply/bind/new с edge cases',
    'Выбирать arrow vs regular в React/DOM контексте',
  ],
  prerequisites: ['`days/day-07-js-prototypes-classes`', '`js-tasks` 041–044'],
  theoryFiles: thisTheory.map((f) => f.file),
  tasks: thisPractice,
  drillCount: thisDrills.length,
  selfCheck: [
    '32+ drills correct',
    'All 9 practice tasks pass',
    'Can draw this decision tree on whiteboard',
  ],
  npmScript: 'sprint-this',
  npmDrillsScript: 'sprint-this:drills',
  links: [
    '[webdev this](../../webdev/09.%20js/033-chto-oboznachaet-this-v-javascript.md)',
    '[webdev call/apply/bind](../../webdev/09.%20js/034-raznica-mezhdu-call-apply-i-bind.md)',
  ],
});

// --- Shared templates ---
const sharedDir = path.join(sprintsDir, '_shared');
const drillTplDir = path.join(sharedDir, 'drill-template');
const practiceTplDir = path.join(sharedDir, 'practice-template');
fs.mkdirSync(drillTplDir, { recursive: true });
fs.mkdirSync(practiceTplDir, { recursive: true });
fs.writeFileSync(
  path.join(drillTplDir, 'puzzle.md'),
  `# NNN — Title

## Задание

Предскажи вывод / значение this.

## Проверка

\`\`\`bash
node check.mjs
\`\`\`
`,
  'utf8',
);
fs.writeFileSync(
  path.join(practiceTplDir, 'task-stub.js'),
  `export function todo() {
  throw new Error('Not implemented');
}
`,
  'utf8',
);

// --- Index ---
fs.writeFileSync(
  path.join(sprintsDir, 'README.md'),
  `# Expert Sprints

Углублённые модули (~10 ч каждый) поверх 60-day roadmap.

| Sprint | Folder | Focus | Drills | Practice |
|--------|--------|-------|--------|----------|
| Event Loop | [sprint-event-loop](./sprint-event-loop/) | Browser + Node | ${eventLoopDrills.length} | ${eventLoopPractice.length} |
| this | [sprint-this](./sprint-this/) | Binding rules | ${thisDrills.length} | ${thisPractice.length} |

## Commands

\`\`\`bash
npm run sprint-event-loop
npm run sprint-event-loop:drills
npm run sprint-this
npm run sprint-this:drills
npm run sprints:generate
\`\`\`
`,
  'utf8',
);

console.log('Generated sprints:');
console.log(`  event-loop: ${eventLoopTheory.length} theory files, ${eventLoopPractice.length} tasks, ${eventLoopDrills.length} drills`);
console.log(`  this: ${thisTheory.length} theory files, ${thisPractice.length} tasks, ${thisDrills.length} drills`);
