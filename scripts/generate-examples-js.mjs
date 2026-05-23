#!/usr/bin/env node
/**
 * Generates examples/js task files from scripts/examples-js catalogs.
 * Run: node scripts/generate-examples-js.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildFile, padNum } from './examples-js/file-template.mjs';
import { tasks as t01 } from './examples-js/01-types.mjs';
import { tasks as t02 } from './examples-js/02-functions-closures.mjs';
import { tasks as t03 } from './examples-js/03-this-prototypes.mjs';
import { tasks as t04 } from './examples-js/04-async-promises.mjs';
import { tasks as t05 } from './examples-js/05-arrays.mjs';
import { tasks as t06 } from './examples-js/06-objects-collections.mjs';
import { tasks as t07 } from './examples-js/07-strings.mjs';
import { tasks as t08 } from './examples-js/08-dom-events.mjs';
import { tasks as t09 } from './examples-js/09-polyfills.mjs';
import { tasks as t10 } from './examples-js/10-algorithms-easy.mjs';
import { tasks as t11 } from './examples-js/11-patterns-practices.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'examples', 'js');

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
  ...t11,
];

if (allTasks.length !== 200) {
  console.error(`Expected 200 tasks, got ${allTasks.length}`);
  process.exit(1);
}

const folders = new Set(allTasks.map((t) => t.folder));
for (const folder of folders) {
  fs.mkdirSync(path.join(outDir, folder), { recursive: true });
}

const index = [];

for (const task of allTasks) {
  const id = padNum(task.num);
  const filename = `${id}-${task.slug}.js`;
  const relPath = `${task.folder}/${filename}`;
  const fullPath = path.join(outDir, relPath);
  fs.writeFileSync(fullPath, buildFile(task), 'utf8');
  index.push({ num: task.num, id, slug: task.slug, folder: task.folder, title: task.title, difficulty: task.difficulty });
}

// README
const byFolder = {};
for (const row of index) {
  (byFolder[row.folder] ??= []).push(row);
}

let readme = `# examples/js — каталог 001–200

Справочник задач с решениями для JS-собеседований. Каждый файл самодостаточен.

## Запуск

\`\`\`bash
node examples/js/01-types/001-typeof-detailed.js
npm run examples:js
\`\`\`

## Оглавление

`;

for (const folder of Object.keys(byFolder).sort()) {
  readme += `### \`${folder}/\`\n\n`;
  readme += '| # | Файл | Задача | Сложность |\n';
  readme += '|---|------|--------|----------|\n';
  for (const row of byFolder[folder]) {
    readme += `| ${row.id} | [\`${row.id}-${row.slug}.js\`](${folder}/${row.id}-${row.slug}.js) | ${row.title} | ${row.difficulty} |\n`;
  }
  readme += '\n';
}

fs.writeFileSync(path.join(outDir, 'README.md'), readme, 'utf8');
console.log(`Generated ${allTasks.length} files in examples/js/`);
