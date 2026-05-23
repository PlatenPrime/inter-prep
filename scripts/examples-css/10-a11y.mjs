/** @type {import('./file-template.mjs').Task[]} */
export const tasks = [
  {
    num: 100,
    slug: 'skip-link',
    folder: '10-a11y',
    title: 'Skip link',
    tags: ['a11y', 'keyboard'],
    difficulty: 'easy',
    description: 'Skip to main content — виден только при фокусе.',
    interview: 'Первый focusable элемент; href="#main"; position absolute off-screen until focus.',
    markup: `<a href="#main-content" class="skip-link">Skip to main content</a>
<header class="site-h">Site header</header>
<main id="main-content" class="site-m" tabindex="-1"><p>Main content area — target of skip link.</p></main>`,
    css: `.skip-link {
  position: absolute; left: -9999px; top: 0; z-index: 100;
  padding: 0.5rem 1rem; background: #0f172a; color: #fff; font-size: 0.875rem;
  text-decoration: none; border-radius: 0 0 0.375rem 0;
}
.skip-link:focus {
  left: 0; outline: 3px solid #2563eb; outline-offset: 2px;
}
.site-h { padding: 0.75rem 1rem; background: #334155; color: #fff; font-size: 0.875rem; border-radius: 0.375rem; margin-bottom: 0.5rem; }
.site-m { padding: 1rem; background: #f1f5f9; border-radius: 0.375rem; font-size: 0.875rem; }
.site-m:focus { outline: 2px solid #2563eb; outline-offset: 2px; }
.site-m p { margin: 0; }`,
    tailwindMarkup: `<a href="#tw-main" class="absolute left-0 top-0 -translate-y-full focus:translate-y-0 z-[100] px-4 py-2 bg-slate-900 text-white text-sm rounded-br-md focus:outline focus:outline-3 focus:outline-blue-600 focus:outline-offset-2">Skip to main content</a>
<header class="px-4 py-3 bg-slate-700 text-white rounded-lg text-sm mb-2">Site header</header>
<main id="tw-main" class="p-4 bg-slate-100 rounded-lg text-sm focus:outline focus:outline-2 focus:outline-blue-600" tabindex="-1"><p class="m-0">Main content — Tab to skip link first.</p></main>`,
    tailwindNote: 'sr-only focus:not-sr-only focus:absolute — skip link pattern',
  },
];
