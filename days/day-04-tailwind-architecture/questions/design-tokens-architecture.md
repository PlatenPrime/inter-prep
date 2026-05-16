# Design Tokens & Architecture — Interview Q&A

---

## Q1. [RU] Что такое design tokens и чем они отличаются от CSS variables?

**Answer (EN):**
Design tokens are named design decisions (color, spacing, radius) stored in a platform-agnostic format (often JSON), then transformed to CSS variables, iOS, Android. CSS variables are one **output** channel. Tokens enable single source of truth across web and native.

**Follow-ups:**
- Style Dictionary / Tokens Studio?
- Semantic vs primitive tokens?

**Red flags:**
- Hardcoded hex in 200 components "because tokens are overhead"

---

## Q2. [RU] Primitive vs semantic tokens — пример?

**Answer (EN):**
Primitive: `blue-500: #3b82f6`. Semantic: `color-primary-button: {blue.500}` or `text-danger: {red.600}`. Semantics survive rebrand — change primitive mapping once. Interview: components use `bg-primary`, not `bg-blue-500`, unless truly brand color.

**Follow-ups:**
- Dark mode token layering?
- `on-primary` contrast pairs?

**Red flags:**
- Components reference only primitive palette names for meaning (error/success)

---

## Q3. [RU] Как вынести повторяющиеся utility-цепочки?

**Answer (EN):**
Options: (1) React/Vue component with props, (2) `@apply` in a named class, (3) Tailwind plugin/component layer in config (`addComponents`). Choose based on team — React component best for behavior + styles. Automated detection (like task 03) finds candidates for extraction.

**Follow-ups:**
- Headless UI + Tailwind pattern?
- CVA (class-variance-authority)?

**Red flags:**
- Copy-paste 15 classes on 50 buttons with no shared abstraction

---

## Q4. [RU] Как Tailwind theme extend работает?

**Answer (EN):**
`theme.extend` merges with defaults — adds colors, spacing without replacing entire scale. `theme` without extend overrides defaults entirely (risky). Maps to CSS variables in v4. Interview: show you know difference between extend and override.

**Follow-ups:**
- Presets and shared configs across apps?
- Monorepo tailwind config sharing?

**Red flags:**
- Replacing full theme and losing default spacing scale accidentally

---

## Q5. [RU] Тёмная тема в token-архитектуре?

**Answer (EN):**
Define semantic tokens twice under `light` / `dark` or use CSS variables toggled on `html.dark` / `prefers-color-scheme`. Tailwind `dark:` variant applies when class or media strategy is configured. Keep contrast pairs validated in both modes.

**Follow-ups:**
- `color-scheme` property?
- Images and shadows in dark mode?

**Red flags:**
- Inverting colors with `filter: invert(1)` hack

---

## Q6. [RU] Как версионировать design system с Tailwind?

**Answer (EN):**
Publish internal package: `tailwind-config`, `ui-components`, tokens JSON. Semver breaking changes when renaming tokens or removing utilities. Document migration codemods. Consumers pin versions; visual regression on upgrade.

**Follow-ups:**
- Changelog for token renames?
- Multiple apps on different DS versions?

**Red flags:**
- Breaking token rename without deprecation alias period

---

## Q7. [RU] Производительность: purge/content и размер CSS?

**Answer (EN):**
Production build scans content files and tree-shakes unused utilities — final CSS is kilobytes, not megabytes. Misconfigured `content` paths cause missing styles OR bloated safelist. Interview: always verify content globs include all template paths (monorepo packages).

**Follow-ups:**
- Splitting CSS per route in Next.js?
- Critical CSS strategies with Tailwind?

**Red flags:**
- Disabling purge "so styles work in prod"
