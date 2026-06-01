/**
 * @typedef {object} Task
 * @property {number} num
 * @property {string} slug
 * @property {string} folder
 * @property {string} title
 * @property {string[]} tags
 * @property {'easy'|'medium'|'hard'} difficulty
 * @property {string} theory
 * @property {string} interview
 * @property {string} [related]
 * @property {string} demo
 * @property {string} test
 * @property {boolean} [runAsync]
 */

export function padNum(n) {
  return String(n).padStart(3, '0');
}

function indentBlock(text, prefix = ' * ') {
  return text
    .trim()
    .split('\n')
    .map((line) => (line ? `${prefix}${line}` : prefix.trimEnd()))
    .join('\n');
}

export function buildFile(task) {
  const id = padNum(task.num);
  const label = `${id}-${task.slug}`;
  const tags = Array.isArray(task.tags) ? task.tags.join(', ') : task.tags;
  const asyncTests = task.runAsync ? 'true' : 'false';

  const relatedBlock = task.related
    ? `\n *\n * ## Связанные темы\n${indentBlock(task.related, ' * ')}`
    : '';

  return `/**
 * ${id} — ${task.title}
 * @tags ${tags}
 * @difficulty ${task.difficulty}
 *
 * ## Теория
${indentBlock(task.theory)}
 *
 * ## На собеседовании
${indentBlock(task.interview)}${relatedBlock}
 */

${task.demo.trim()}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond: unknown, msg?: string): asserts cond {
  if (!cond) throw new Error(msg ?? 'assertion failed');
}

${task.runAsync ? 'async ' : ''}function runTests() {
${task.test.trim().split('\n').map((l) => (l ? `  ${l}` : l)).join('\n')}
  console.log('${label}: ok');
}

const isMain =
  process.argv[1] &&
  (() => {
    const a = path.normalize(fileURLToPath(import.meta.url));
    const b = path.normalize(path.resolve(process.argv[1]));
    return a === b;
  })();

if (isMain) {
  ${
    task.runAsync
      ? 'runTests().catch((e) => { console.error(e); process.exit(1); });'
      : 'try { runTests(); } catch (e) { console.error(e); process.exit(1); }'
  }
}
`;
}
