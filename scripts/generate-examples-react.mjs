#!/usr/bin/env node
/**
 * Generates examples/react lesson files from scripts/examples-react catalogs.
 * Run: node scripts/generate-examples-react.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildComponent, buildTest, padNum } from './examples-react/file-template.mjs';
import { tasks as t01 } from './examples-react/01-fundamentals.mjs';
import { tasks as t02 } from './examples-react/02-rendering.mjs';
import { tasks as t03 } from './examples-react/03-hooks-core.mjs';
import { tasks as t04 } from './examples-react/04-state-context.mjs';
import { tasks as t05 } from './examples-react/05-performance.mjs';
import { tasks as t06 } from './examples-react/06-forms.mjs';
import { tasks as t07 } from './examples-react/07-composition.mjs';
import { tasks as t08 } from './examples-react/08-data-fetching.mjs';
import { tasks as t09 } from './examples-react/09-routing.mjs';
import { tasks as t10 } from './examples-react/10-patterns-testing.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'examples', 'react');

const allTasks = [
  ...t01,
  ...t02,
  ...t03,
  ...t04,
  ...t05,
  ...t06,
  ...t07,
  ...t08,
  ...t09,
  ...t10,
];

if (allTasks.length !== 100) {
  console.error(`Expected 100 tasks, got ${allTasks.length}`);
  process.exit(1);
}

const nums = new Set(allTasks.map((t) => t.num));
for (let i = 1; i <= 100; i++) {
  if (!nums.has(i)) {
    console.error(`Missing task number ${i}`);
    process.exit(1);
  }
}

const slugs = new Set();
for (const t of allTasks) {
  const key = `${t.num}-${t.slug}`;
  if (slugs.has(key)) {
    console.error(`Duplicate: ${key}`);
    process.exit(1);
  }
  slugs.add(key);
}

for (const folder of new Set(allTasks.map((t) => t.folder))) {
  fs.mkdirSync(path.join(outDir, folder), { recursive: true });
}

const index = [];

for (const task of allTasks) {
  const id = padNum(task.num);
  const base = `${id}-${task.slug}`;
  const relPath = `${task.folder}/${base}`;
  fs.writeFileSync(path.join(outDir, `${relPath}.tsx`), buildComponent(task), 'utf8');
  fs.writeFileSync(path.join(outDir, `${relPath}.test.tsx`), buildTest(task), 'utf8');
  index.push({
    num: task.num,
    id,
    slug: task.slug,
    folder: task.folder,
    title: task.title,
    difficulty: task.difficulty,
  });
}

const byFolder = {};
for (const row of index) {
  (byFolder[row.folder] ??= []).push(row);
}

let readme = `# examples/react — каталог 001–100

Обучающие примеры React для собеседований: теория, компонент, Vitest + Testing Library.

## Запуск

\`\`\`bash
npm run examples:react
npx vitest run examples/react/01-fundamentals/001-hello-props.test.tsx
npm run generate:examples-react
\`\`\`

## Оглавление

`;

for (const folder of Object.keys(byFolder).sort()) {
  readme += `### \`${folder}/\`\n\n`;
  readme += '| # | Файл | Тема | Сложность |\n';
  readme += '|---|------|------|----------|\n';
  for (const row of byFolder[folder]) {
    readme += `| ${row.id} | [\`${row.id}-${row.slug}\`](${folder}/${row.id}-${row.slug}.tsx) | ${row.title} | ${row.difficulty} |\n`;
  }
  readme += '\n';
}

fs.writeFileSync(path.join(outDir, 'README.md'), readme, 'utf8');
console.log(`Generated ${allTasks.length * 2} files in examples/react/`);
