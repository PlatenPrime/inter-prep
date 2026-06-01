#!/usr/bin/env node
/**
 * Generates examples/ts lesson files from scripts/examples-ts catalogs.
 * Run: node scripts/generate-examples-ts.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFile, padNum } from './examples-ts/file-template.mjs';
import { tasks as t01 } from './examples-ts/01-fundamentals.mjs';
import { tasks as t02 } from './examples-ts/02-unions-nullability.mjs';
import { tasks as t03 } from './examples-ts/03-narrowing.mjs';
import { tasks as t04 } from './examples-ts/04-types-interfaces.mjs';
import { tasks as t05 } from './examples-ts/05-functions.mjs';
import { tasks as t06 } from './examples-ts/06-generics.mjs';
import { tasks as t07 } from './examples-ts/07-utility-types.mjs';
import { tasks as t08 } from './examples-ts/08-mapped-conditional.mjs';
import { tasks as t09 } from './examples-ts/09-classes-oop.mjs';
import { tasks as t10 } from './examples-ts/10-modules-config.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'examples', 'ts');

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

for (const folder of new Set(allTasks.map((t) => t.folder))) {
  fs.mkdirSync(path.join(outDir, folder), { recursive: true });
}

const index = [];

for (const task of allTasks) {
  const id = padNum(task.num);
  const filename = `${id}-${task.slug}.ts`;
  const relPath = `${task.folder}/${filename}`;
  fs.writeFileSync(path.join(outDir, relPath), buildFile(task), 'utf8');
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

let readme = `# examples/ts — каталог 001–100

Обучающие примеры TypeScript для собеседований: теория, демо-код и self-test в каждом файле.

## Запуск

\`\`\`bash
npx tsx examples/ts/01-fundamentals/001-structural-typing.ts
npm run examples:ts
\`\`\`

## Оглавление

`;

for (const folder of Object.keys(byFolder).sort()) {
  readme += `### \`${folder}/\`\n\n`;
  readme += '| # | Файл | Тема | Сложность |\n';
  readme += '|---|------|------|----------|\n';
  for (const row of byFolder[folder]) {
    readme += `| ${row.id} | [\`${row.id}-${row.slug}.ts\`](${folder}/${row.id}-${row.slug}.ts) | ${row.title} | ${row.difficulty} |\n`;
  }
  readme += '\n';
}

fs.writeFileSync(path.join(outDir, 'README.md'), readme, 'utf8');
console.log(`Generated ${allTasks.length} files in examples/ts/`);
