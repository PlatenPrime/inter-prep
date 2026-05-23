export function padNum(n) {
  return String(n).padStart(3, '0');
}

function sharedLinks(depth = 2) {
  const prefix = '../'.repeat(depth);
  return {
    reset: `${prefix}_shared/reset.css`,
    demo: `${prefix}_shared/demo.css`,
    hub: `${prefix}index.html`,
  };
}

function difficultyClass(d) {
  const map = { easy: 'demo-badge--easy', medium: 'demo-badge--medium', hard: 'demo-badge--hard' };
  return map[d] ?? '';
}

function headerComment(task) {
  const id = padNum(task.num);
  const tags = Array.isArray(task.tags) ? task.tags.join(', ') : task.tags;
  return `<!--
  ${id} — ${task.title}
  @tags ${tags}
  @difficulty ${task.difficulty}

  ${task.description}
  ${task.interview ? `На собесе: ${task.interview}` : ''}
-->`;
}

function pageShell(task, { variant, body, extraHead = '', styleHref = null }) {
  const id = padNum(task.num);
  const links = sharedLinks(2);
  const diffCls = difficultyClass(task.difficulty);
  const tags = Array.isArray(task.tags) ? task.tags.join(', ') : task.tags;
  const variantLabel = variant === 'tailwind' ? 'Tailwind CDN' : 'Pure CSS';

  const styleLink = styleHref
    ? `  <link rel="stylesheet" href="${styleHref}" />\n`
    : '';

  const tailwindScript =
    variant === 'tailwind'
      ? `  <script src="https://cdn.tailwindcss.com"></script>\n${task.tailwindConfig ? `  <script>\n${task.tailwindConfig.trim()}\n  </script>\n` : ''}`
      : '';

  return `${headerComment(task)}
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${id} — ${task.title} (${variantLabel})</title>
  <link rel="stylesheet" href="${links.reset}" />
  <link rel="stylesheet" href="${links.demo}" />
${styleLink}${tailwindScript}${extraHead}</head>
<body>
  <div class="demo-page">
    <header class="demo-header">
      <h1>${id} — ${task.title}</h1>
      <p class="demo-task">${task.description}</p>
      <div class="demo-meta">
        <span class="demo-badge">${tags}</span>
        <span class="demo-badge ${diffCls}">${task.difficulty}</span>
        <span class="demo-badge">${variantLabel}</span>
      </div>
    </header>
    <div class="demo-stage">
${indent(body, 6)}
    </div>
    ${task.hint ? `<p class="demo-hint">${task.hint}</p>` : ''}
    ${task.tailwindNote && variant === 'tailwind' ? `<p class="demo-hint"><strong>CSS ↔ Tailwind:</strong> ${task.tailwindNote}</p>` : ''}
    <nav class="demo-nav"><a href="${links.hub}">← Все примеры</a></nav>
  </div>
</body>
</html>
`;
}

function indent(str, spaces) {
  const pad = ' '.repeat(spaces);
  return str
    .split('\n')
    .map((line) => (line ? pad + line : line))
    .join('\n');
}

export function buildIndexHtml(task) {
  return pageShell(task, {
    variant: 'css',
    body: task.markup.trim(),
    styleHref: 'style.css',
  });
}

export function buildTailwindHtml(task) {
  const body = (task.tailwindMarkup ?? task.markup).trim();
  return pageShell(task, {
    variant: 'tailwind',
    body,
  });
}

export function buildStyleCss(task) {
  const id = padNum(task.num);
  return `/* ${id} — ${task.title} */\n\n${(task.css ?? '').trim()}\n`;
}

export function buildHubPage(index) {
  const byFolder = {};
  for (const row of index) {
    (byFolder[row.folder] ??= []).push(row);
  }

  let sections = '';
  for (const folder of Object.keys(byFolder).sort()) {
    sections += `    <section class="hub-section">\n`;
    sections += `      <h2>${folder}</h2>\n      <ul class="hub-list">\n`;
    for (const row of byFolder[folder]) {
      const href = `${row.folder}/${row.id}-${row.slug}/index.html`;
      const hrefTw = `${row.folder}/${row.id}-${row.slug}/index.tailwind.html`;
      sections += `        <li><a href="${href}">${row.id}</a> — ${row.title} <span class="hub-links">(<a href="${href}">CSS</a> · <a href="${hrefTw}">Tailwind</a>)</span></li>\n`;
    }
    sections += `      </ul>\n    </section>\n`;
  }

  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>examples/css — каталог 001–100</title>
  <link rel="stylesheet" href="_shared/reset.css" />
  <style>
    body { background: #f8fafc; color: #0f172a; }
    .hub { max-width: 52rem; margin: 0 auto; padding: 2rem 1rem; }
    h1 { font-size: 1.5rem; margin: 0 0 0.5rem; }
    .hub-intro { color: #64748b; font-size: 0.9rem; margin-bottom: 2rem; }
    .hub-section { margin-bottom: 1.5rem; }
    .hub-section h2 { font-size: 1rem; color: #475569; margin: 0 0 0.5rem; font-family: ui-monospace, monospace; }
    .hub-list { list-style: none; padding: 0; margin: 0; }
    .hub-list li { padding: 0.35rem 0; border-bottom: 1px solid #e2e8f0; font-size: 0.875rem; }
    .hub-list a { color: #2563eb; text-decoration: none; font-weight: 600; }
    .hub-links { color: #94a3b8; font-weight: 400; }
    .hub-links a { font-weight: 500; }
  </style>
</head>
<body>
  <main class="hub">
    <h1>examples/css</h1>
    <p class="hub-intro">100 примеров для CSS/Tailwind-собеседований. Открой index.html (чистый CSS) или index.tailwind.html (CDN). Локальный сервер: <code>npm run examples:css:serve</code></p>
${sections}  </main>
</body>
</html>
`;
}

export function buildReadme(index) {
  const byFolder = {};
  for (const row of index) {
    (byFolder[row.folder] ??= []).push(row);
  }

  let readme = `# examples/css — каталог 001–100

Справочник визуальных примеров для CSS/Tailwind-собеседований.

## Просмотр

\`\`\`bash
# Открой в браузере:
examples/css/01-fundamentals/001-box-model/index.html
examples/css/01-fundamentals/001-box-model/index.tailwind.html

# Локальный сервер:
npm run examples:css:serve

# Проверка структуры:
npm run examples:css
\`\`\`

## Оглавление

`;

  for (const folder of Object.keys(byFolder).sort()) {
    readme += `### \`${folder}/\`\n\n`;
    readme += '| # | Папка | Задача | Сложность |\n';
    readme += '|---|-------|--------|----------|\n';
    for (const row of byFolder[folder]) {
      const dir = `${row.folder}/${row.id}-${row.slug}`;
      readme += `| ${row.id} | [\`${row.id}-${row.slug}\`](${dir}/) | ${row.title} | ${row.difficulty} |\n`;
    }
    readme += '\n';
  }

  return readme;
}
