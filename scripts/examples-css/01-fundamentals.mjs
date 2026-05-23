/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 1,
    slug: 'box-model',
    folder: '01-fundamentals',
    title: 'Box model',
    tags: ['fundamentals', 'box-model'],
    difficulty: 'easy',
    description: 'Визуализируй content, padding, border, margin. Переключи box-sizing.',
    interview: 'content-box vs border-box; что входит в width.',
    markup: `<div class="box-demo">
  <div class="box box--content">content-box</div>
  <div class="box box--border">border-box</div>
</div>`,
    css: `.box-demo { display: flex; gap: 1.5rem; flex-wrap: wrap; }
.box {
  width: 140px; height: 80px; background: #93c5fd; color: #1e3a8a;
  padding: 12px; border: 4px solid #2563eb; margin: 16px;
  font-size: 0.7rem; font-weight: 600; display: flex; align-items: center; justify-content: center;
}
.box--content { box-sizing: content-box; }
.box--border { box-sizing: border-box; background: #86efac; border-color: #16a34a; color: #14532d; }`,
    tailwindMarkup: `<div class="flex flex-wrap gap-6">
  <div class="w-[140px] h-20 bg-blue-300 border-4 border-blue-600 p-3 m-4 text-xs font-semibold flex items-center justify-center box-content">content-box (default)</div>
  <div class="w-[140px] h-20 bg-green-300 border-4 border-green-600 p-3 m-4 text-xs font-semibold flex items-center justify-center box-border">box-border</div>
</div>`,
    tailwindNote: 'box-border → box-sizing: border-box; w-[140px] → width: 140px',
  },
  {
    num: 2,
    slug: 'margin-collapse',
    folder: '01-fundamentals',
    title: 'Margin collapse',
    tags: ['fundamentals', 'margin'],
    difficulty: 'easy',
    description: 'Покажи схлопывание вертикальных margin между соседними блоками.',
    interview: 'Когда margin схлопывается; как предотвратить (padding, border, flex/grid, overflow).',
    markup: `<div class="collapse-wrap">
  <p class="block-a">Block A — margin-bottom: 24px</p>
  <p class="block-b">Block B — margin-top: 32px</p>
  <p class="collapse-note">Между ними ~32px, не 56px</p>
</div>`,
    css: `.collapse-wrap { background: #f1f5f9; padding: 1rem; }
.block-a { margin: 0 0 24px; background: #fecaca; padding: 0.5rem; }
.block-b { margin: 32px 0 0; background: #bfdbfe; padding: 0.5rem; }
.collapse-note { margin: 1rem 0 0; font-size: 0.75rem; color: #64748b; }`,
    tailwindMarkup: `<div class="bg-slate-100 p-4">
  <p class="mb-6 bg-red-200 p-2">Block A — mb-6 (24px)</p>
  <p class="mt-8 bg-blue-200 p-2">Block B — mt-8 (32px)</p>
  <p class="mt-4 text-xs text-slate-500">Схлопывание: видимый зазор ≈ max(24, 32) = 32px</p>
</div>`,
    tailwindNote: 'mb-6 + mt-8 схлопываются как обычные margin',
  },
  {
    num: 3,
    slug: 'specificity',
    folder: '01-fundamentals',
    title: 'Specificity',
    tags: ['fundamentals', 'cascade'],
    difficulty: 'medium',
    description: 'Один элемент — разные селекторы. Какой цвет победит?',
    interview: 'Порядок: inline > ID > class > element; :where() обнуляет вес.',
    markup: `<p id="spec" class="text">#id + .class + element — какой цвет?</p>`,
    css: `p { color: #64748b; }
.text { color: #2563eb; }
#spec { color: #dc2626; }`,
    tailwindMarkup: `<p class="text-blue-600 id-spec text-red-600 text-slate-500 font-medium">Tailwind: последний класс в HTML / порядок в stylesheet</p>
<p class="mt-2 text-xs text-slate-500">В CSS: #id побеждает .class и p</p>`,
    tailwindNote: 'Конфликт utilities решает порядок в CSS, не «специфичность» классов',
  },
  {
    num: 4,
    slug: 'cascade-layers',
    folder: '01-fundamentals',
    title: 'Cascade layers',
    tags: ['fundamentals', 'layer'],
    difficulty: 'medium',
    description: '@layer: порядок слоёв важнее специфичности внутри них.',
    interview: '@layer base, components, utilities; unlayered beats layered.',
    markup: `<button type="button" class="layered-btn">Layered button</button>`,
    css: `@layer base, theme;
@layer base { .layered-btn { background: #94a3b8; color: #fff; border: none; padding: 0.5rem 1rem; border-radius: 0.375rem; } }
@layer theme { .layered-btn { background: #2563eb; } }`,
    tailwindMarkup: `<button type="button" class="px-4 py-2 rounded-md bg-blue-600 text-white border-0">Tailwind utilities ≈ верхний «слой»</button>
<p class="mt-2 text-xs text-slate-500">@layer в Tailwind v4 — встроено в сборку</p>`,
    tailwindNote: 'bg-blue-600 — utility слой поверх component/base',
  },
  {
    num: 5,
    slug: 'custom-properties',
    folder: '01-fundamentals',
    title: 'CSS custom properties',
    tags: ['fundamentals', 'variables'],
    difficulty: 'easy',
    description: 'Тема через --переменные на :root; переключение data-theme.',
    interview: 'var(--x), fallback; наследование; отличие от Sass $vars.',
    markup: `<div class="theme-root" data-theme="light">
  <button type="button" class="theme-toggle">Toggle theme</button>
  <div class="theme-card">Card uses var(--bg) and var(--text)</div>
</div>
<script>
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
  const r = document.querySelector('.theme-root');
  r.dataset.theme = r.dataset.theme === 'dark' ? 'light' : 'dark';
});
</script>`,
    css: `.theme-root {
  --bg: #fff; --text: #0f172a; --accent: #2563eb;
  padding: 1rem; border-radius: 0.5rem; background: var(--bg); color: var(--text);
  border: 1px solid #e2e8f0;
}
.theme-root[data-theme="dark"] { --bg: #1e293b; --text: #f1f5f9; --accent: #60a5fa; }
.theme-card { margin-top: 0.75rem; padding: 1rem; background: color-mix(in srgb, var(--accent) 12%, var(--bg)); border-radius: 0.375rem; }
.theme-toggle { padding: 0.35rem 0.75rem; border-radius: 0.25rem; border: 1px solid var(--accent); background: transparent; color: var(--text); cursor: pointer; }`,
    tailwindMarkup: `<div id="tw-theme" class="p-4 rounded-lg border border-slate-200 bg-white text-slate-900">
  <button type="button" id="tw-theme-btn" class="px-3 py-1 rounded border border-blue-600 text-sm">Toggle dark</button>
  <div class="mt-3 p-4 rounded bg-blue-50 dark:bg-blue-900/30">dark: префикс ≈ другая тема</div>
</div>
<script>document.getElementById('tw-theme-btn')?.addEventListener('click',()=>document.documentElement.classList.toggle('dark'));</script>`,
    tailwindConfig: `tailwind.config = { darkMode: 'class' }`,
    tailwindNote: '--var на :root ↔ theme() / arbitrary values; dark: ↔ [data-theme]',
  },
  {
    num: 6,
    slug: 'rem-em-units',
    folder: '01-fundamentals',
    title: 'rem vs em',
    tags: ['fundamentals', 'units'],
    difficulty: 'easy',
    description: 'rem от root, em от родителя — размер шрифта вложенных элементов.',
    interview: 'Когда em ломает вложенность; rem для spacing scale.',
    markup: `<div class="em-parent">
  Parent 20px
  <p class="em-child">Child 1.5em = 30px</p>
</div>
<p class="rem-child">1.25rem от html root</p>`,
    css: `.em-parent { font-size: 20px; padding: 0.75rem; background: #e0e7ff; border-radius: 0.375rem; }
.em-child { font-size: 1.5em; margin: 0.5rem 0 0; }
.rem-child { font-size: 1.25rem; margin-top: 0.75rem; color: #475569; }`,
    tailwindMarkup: `<div class="text-xl p-3 bg-indigo-100 rounded">
  Parent text-xl
  <p class="text-[1.5em] mt-2">1.5em от родителя</p>
</div>
<p class="text-lg mt-3 text-slate-600">text-lg ≈ 1.125rem</p>`,
    tailwindNote: 'text-lg → 1.125rem; text-[1.5em] → arbitrary em',
  },
  {
    num: 7,
    slug: 'dvh-viewport',
    folder: '01-fundamentals',
    title: 'dvh vs vh',
    tags: ['fundamentals', 'viewport'],
    difficulty: 'medium',
    description: '100vh на мобильных обрезается UI браузера; dvh/svh/lvh.',
    interview: 'Mobile Safari 100vh bug; когда использовать dvh.',
    markup: `<div class="vh-panel">min-height: 40dvh (адаптивная «вьюпорт» высота)</div>`,
    css: `.vh-panel {
  min-height: 40dvh; display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #fff; border-radius: 0.5rem;
  font-weight: 600; font-size: 0.875rem; text-align: center; padding: 1rem;
}`,
    tailwindMarkup: `<div class="min-h-[40dvh] flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-semibold text-sm text-center p-4">min-h-[40dvh]</div>`,
    tailwindNote: 'min-h-[40dvh] → arbitrary viewport unit',
  },
  {
    num: 8,
    slug: 'display-visibility',
    folder: '01-fundamentals',
    title: 'display vs visibility',
    tags: ['fundamentals', 'display'],
    difficulty: 'easy',
    description: 'visibility:hidden сохраняет место; display:none убирает из потока.',
    interview: 'accessibility: hidden vs aria-hidden; reflow.',
    markup: `<div class="disp-row">
  <span class="box visible">visible</span>
  <span class="box hidden-vis">visibility: hidden</span>
  <span class="box hidden-disp">display: none</span>
  <span class="box visible">after</span>
</div>`,
    css: `.disp-row { display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap; }
.box { padding: 0.5rem 1rem; background: #cbd5e1; border-radius: 0.25rem; font-size: 0.75rem; }
.hidden-vis { visibility: hidden; }
.hidden-disp { display: none; }`,
    tailwindMarkup: `<div class="flex gap-2 flex-wrap items-center">
  <span class="px-4 py-2 bg-slate-300 rounded text-xs">visible</span>
  <span class="px-4 py-2 bg-slate-300 rounded text-xs invisible">invisible</span>
  <span class="px-4 py-2 bg-slate-300 rounded text-xs hidden">hidden</span>
  <span class="px-4 py-2 bg-slate-300 rounded text-xs">after</span>
</div>`,
    tailwindNote: 'invisible → visibility:hidden; hidden → display:none',
  },
  {
    num: 9,
    slug: 'overflow-scroll',
    folder: '01-fundamentals',
    title: 'Overflow',
    tags: ['fundamentals', 'overflow'],
    difficulty: 'easy',
    description: 'overflow: auto появляет скролл только при переполнении.',
    interview: 'overflow и BFC; scroll chaining; overscroll-behavior.',
    markup: `<div class="overflow-box">Длинный текст внутри фиксированной высоты — появится вертикальный скролл только когда контент не помещается. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.</div>`,
    css: `.overflow-box {
  height: 100px; overflow: auto; padding: 0.75rem; background: #f8fafc;
  border: 1px solid #e2e8f0; border-radius: 0.375rem; font-size: 0.8125rem;
}`,
    tailwindMarkup: `<div class="h-[100px] overflow-auto p-3 bg-slate-50 border border-slate-200 rounded text-sm">Длинный текст… Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>`,
    tailwindNote: 'overflow-auto → overflow: auto',
  },
  {
    num: 10,
    slug: 'is-where',
    folder: '01-fundamentals',
    title: ':is() and :where()',
    tags: ['fundamentals', 'selectors'],
    difficulty: 'medium',
    description: ':is(h1,h2,h3) группирует; :where() — нулевая специфичность.',
    interview: ':where() для reset без повышения веса.',
    markup: `<article class="is-where-demo">
  <h2>Heading</h2>
  <p>Paragraph styled via :is(article h2, article p)</p>
</article>`,
    css: `:is(.is-where-demo h2, .is-where-demo p) { color: #7c3aed; }
:where(.is-where-demo h2) { margin-top: 0; font-size: 1.125rem; }`,
    tailwindMarkup: `<article class="space-y-2">
  <h2 class="text-violet-600 text-lg font-bold mt-0">Heading</h2>
  <p class="text-violet-600">В Tailwind — явные классы на элементах</p>
</article>`,
    tailwindNote: ':is() / :where() — нативный CSS; Tailwind не дублирует',
  },
];
