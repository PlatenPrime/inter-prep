#!/usr/bin/env node
/**
 * Generates examples/css demo folders from scripts/examples-css catalogs.
 * Run: node scripts/generate-examples-css.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  padNum,
  buildIndexHtml,
  buildTailwindHtml,
  buildStyleCss,
  buildHubPage,
  buildReadme,
} from './examples-css/file-template.mjs';
import { tasks as t01 } from './examples-css/01-fundamentals.mjs';
import { tasks as t02 } from './examples-css/02-flexbox.mjs';
import { tasks as t03 } from './examples-css/03-grid.mjs';
import { tasks as t04 } from './examples-css/04-positioning.mjs';
import { tasks as t05 } from './examples-css/05-responsive.mjs';
import { tasks as t06 } from './examples-css/06-typography.mjs';
import { tasks as t07 } from './examples-css/07-visual.mjs';
import { tasks as t08 } from './examples-css/08-animation.mjs';
import { tasks as t09 } from './examples-css/09-components.mjs';
import { tasks as t10 } from './examples-css/10-a11y.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'examples', 'css');

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

const folders = new Set(allTasks.map((t) => t.folder));
for (const folder of folders) {
  fs.mkdirSync(path.join(outDir, folder), { recursive: true });
}

const index = [];

for (const task of allTasks) {
  const id = padNum(task.num);
  const dirName = `${id}-${task.slug}`;
  const relDir = `${task.folder}/${dirName}`;
  const fullDir = path.join(outDir, relDir);
  fs.mkdirSync(fullDir, { recursive: true });

  fs.writeFileSync(path.join(fullDir, 'index.html'), buildIndexHtml(task), 'utf8');
  fs.writeFileSync(path.join(fullDir, 'index.tailwind.html'), buildTailwindHtml(task), 'utf8');
  fs.writeFileSync(path.join(fullDir, 'style.css'), buildStyleCss(task), 'utf8');

  index.push({
    num: task.num,
    id,
    slug: task.slug,
    folder: task.folder,
    title: task.title,
    difficulty: task.difficulty,
  });
}

fs.writeFileSync(path.join(outDir, 'README.md'), buildReadme(index), 'utf8');
fs.writeFileSync(path.join(outDir, 'index.html'), buildHubPage(index), 'utf8');

console.log(`Generated ${allTasks.length} examples in examples/css/`);
