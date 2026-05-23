import { fileURLToPath } from 'node:url';
import path from 'node:path';

export function padNum(n) {
  return String(n).padStart(3, '0');
}

export function buildFile(task) {
  const id = padNum(task.num);
  const label = `${id}-${task.slug}`;
  const tags = Array.isArray(task.tags) ? task.tags.join(', ') : task.tags;
  const asyncTests = task.runAsync ? 'true' : 'false';

  return `/**
 * ${id} — ${task.title}
 * @tags ${tags}
 * @difficulty ${task.difficulty}
 *
 * ${task.description}
 */

${task.solution.trim()}

// --- self-test ---
import { fileURLToPath } from 'node:url';
import path from 'node:path';

function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}

${task.runAsync ? 'async ' : ''}function runTests() {
${task.test.trim().split('\n').map((l) => (l ? `  ${l}` : l)).join('\n')}
  console.log('${label}: ok');
}

const isMain = process.argv[1] && (() => {
  const a = path.normalize(fileURLToPath(import.meta.url));
  const b = path.normalize(path.resolve(process.argv[1]));
  return a === b;
})();

if (isMain) {
  ${task.runAsync
    ? 'runTests().catch((e) => { console.error(e); process.exit(1); });'
    : 'try { runTests(); } catch (e) { console.error(e); process.exit(1); }'}
}
`;
}
