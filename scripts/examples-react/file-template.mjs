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
 * @property {string} exportName — main component export
 * @property {string[]} [imports] — extra named imports from component file
 * @property {string} component
 * @property {string} test
 * @property {boolean} [withRouter]
 * @property {boolean} [withQuery]
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

export function buildComponent(task) {
  const id = padNum(task.num);
  const tags = task.tags.join(', ');
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

${task.component.trim()}
`;
}

export function buildTest(task) {
  const id = padNum(task.num);
  const label = `${id}-${task.slug}`;
  const useProviders = task.withRouter || task.withQuery;

  const renderImport = useProviders
    ? `import { renderWithProviders } from '../_shared/render.tsx';\n`
  : `import { render, screen } from '@testing-library/react';\n`;

  const screenImport = useProviders ? `import { screen } from '@testing-library/react';\n` : '';

  const userImport = task.test.includes('userEvent') || task.test.includes('user.')
    ? `import userEvent from '@testing-library/user-event';\n`
    : '';

  const needsRtlCore =
    task.test.includes('waitFor') ||
    task.test.includes('findBy') ||
    task.test.includes('act(');
  const waitImport = needsRtlCore
    ? `import { ${[task.test.includes('act(') ? 'act' : null, task.test.includes('waitFor') || task.test.includes('findBy') ? 'waitFor' : null].filter(Boolean).join(', ')} } from '@testing-library/react';\n`
    : '';

  const withinImport = task.test.includes('within(') ? `import { within } from '@testing-library/react';\n` : '';

  const renderFn = useProviders ? 'renderWithProviders' : 'render';
  const providerOpts = [];
  if (task.withRouter) providerOpts.push('withRouter: true');
  if (task.withQuery) providerOpts.push('withQuery: true');
  if (task.route) providerOpts.push(`route: '${task.route}'`);
  const providerOptsStr = providerOpts.length ? `, { ${providerOpts.join(', ')} }` : '';

  const renderHelper = useProviders
    ? `\nimport type { ReactElement } from 'react';\n\nfunction renderUi(ui: ReactElement) {\n  return ${renderFn}(ui${providerOptsStr});\n}\n`
    : '';

  return `import { describe, it, expect${task.test.includes('vi.') ? ', vi' : ''}${task.test.includes('beforeEach') ? ', beforeEach, afterEach' : ''} } from 'vitest';
${renderImport}${screenImport}${userImport}${waitImport}${withinImport}import { ${[task.exportName, ...(task.imports ?? [])].filter((n, i, a) => a.indexOf(n) === i).join(', ')} } from './${label}.tsx';
${renderHelper}
describe('${label}', () => {
${task.test
  .trim()
  .split('\n')
  .map((l) => (l ? `  ${l}` : l))
  .join('\n')}
});
`;
}
