export function padNum(n) {
  return String(n).padStart(3, '0');
}

export function getExportNames(solution) {
  const names = [];
  for (const m of solution.matchAll(/export (?:async )?function (\w+)/g)) {
    names.push(m[1]);
  }
  return names;
}

/** @param {string} solution */
export function solutionToStub(solution) {
  const lines = solution.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fnMatch = line.match(/^export (async )?function (\w+)/);
    if (fnMatch) {
      const openOnSameLine = line.includes('{');
      const sig = openOnSameLine ? line.replace(/\{.*$/, '').trimEnd() : line.trimEnd();
      out.push(`${sig} {`);
      out.push("  throw new Error('Not implemented');");
      out.push('}');
      i += 1;
      let depth = openOnSameLine ? 1 : 0;
      if (!openOnSameLine) {
        while (i < lines.length && depth === 0) {
          if (lines[i].includes('{')) depth += 1;
          i += 1;
        }
      }
      while (i < lines.length && depth > 0) {
        for (const ch of lines[i]) {
          if (ch === '{') depth += 1;
          if (ch === '}') depth -= 1;
        }
        i += 1;
      }
      continue;
    }
    out.push(line);
    i += 1;
  }
  return `${out.join('\n').trim()}\n`;
}

/** @param {object} task */
export function buildTaskJs(task) {
  return solutionToStub(task.solution);
}

function buildAssertBody(test) {
  return test
    .split('\n')
    .filter((l) => l.trim())
    .map((line, idx) => {
      const trimmed = line.trim();
      const m = trimmed.match(/^assert\((.+)\);?$/);
      if (m) return `  assert('test ${idx + 1}', ${m[1]});`;
      return `  ${trimmed}`;
    })
    .join('\n');
}

/** @param {object} task */
export function buildTaskTest(task) {
  const names = getExportNames(task.solution);
  const header = `import { ${names.join(', ')} } from './task.js';

let passed = 0;
let failed = 0;

function assert(name, condition) {
  if (condition) {
    passed++;
    console.log(\`  ✓ \${name}\`);
  } else {
    failed++;
    console.log(\`  ✗ \${name}\`);
  }
}

function finish() {
  console.log(\`\\n\${passed} passed, \${failed} failed\`);
  process.exit(failed > 0 ? 1 : 0);
}
`;

  const body = buildAssertBody(task.test);

  if (task.runAsync) {
    return `${header}
async function run() {
${body}
}

run()
  .then(finish)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
`;
  }

  return `${header}
function run() {
${body}
}

try {
  run();
  finish();
} catch (e) {
  console.error(e);
  process.exit(1);
}
`;
}

/** @param {object} task */
export function buildSolutionJs(task) {
  const summary = task.explanationRu.split('.')[0].trim();
  return `/**
 * Кратко: ${summary}.
 */
${task.solution.trim()}\n`;
}

/** @param {object} task */
export function buildSolutionMd(task) {
  const id = padNum(task.num);
  const tags = Array.isArray(task.tags) ? task.tags.join(', ') : task.tags;

  return `# ${id} — ${task.titleRu ?? task.title}

## Кратко

${task.explanationRu}

## Решение

Полный код — в [solution.js](./solution.js). Сверяйся с ним **после** своей попытки и прогона \`task.test.js\`.

## Связанные темы

${tags}
`;
}

/** @param {object} task */
export function buildTaskReadme(task) {
  const id = padNum(task.num);
  const tags = Array.isArray(task.tags) ? task.tags.join(', ') : task.tags;
  const hint =
    task.hint ??
    (task.difficulty === 'medium'
      ? 'Разбей задачу на шаги, покрой краевые случаи, затем прогони тесты.'
      : 'Начни с простых примеров из условия, затем обобщи решение.');

  return `# ${id} — ${task.titleRu ?? task.title}

**Сложность:** ${task.difficulty}  
**Теги:** ${tags}

## Условие

${task.description}

## Запуск тестов

\`\`\`bash
node js-tasks/${id}-${task.slug}/task.test.js
\`\`\`

## Подсказка

${hint}

## Решение

Открой [solution.md](./solution.md) и [solution.js](./solution.js) только после своей реализации.
`;
}


/** @param {object} task */
export async function verifyTaskSolution(task) {
  const code = `
${task.solution}
function assert(cond, msg) {
  if (!cond) throw new Error(msg || 'assertion failed');
}
${task.runAsync ? 'export async function __verify() {' : 'export function __verify() {'}
${task.test
  .split('\n')
  .filter((l) => l.trim())
  .map((l) => `  ${l.trim()}`)
  .join('\n')}
}
`;
  const url = `data:text/javascript;charset=utf-8,${encodeURIComponent(code)}`;
  const mod = await import(url);
  await mod.__verify();
}
