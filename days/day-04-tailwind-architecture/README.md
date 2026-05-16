# Day 04 — Tailwind Architecture

> **Time:** ~4 hours | **Phase:** 1 — Platform foundations

## Goals

- Аргументировать utility-first vs component CSS на интервью
- Понимать design tokens и их резолв в конфиге
- Рефакторить повторяющиеся utility-цепочки в компоненты

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/utility-first-tailwind.md` | Q&A | utility-first, @apply, conflicts |
| `questions/design-tokens-architecture.md` | Q&A | tokens, theming, extraction |
| `tasks/task-01-parse-utilities.js` | Task | Parse utility classes → style object |
| `tasks/task-02-merge-utilities.js` | Task | Last-wins merge (like Tailwind order) |
| `tasks/task-03-extract-patterns.js` | Task | Find repeated class patterns |
| `tasks/task-04-resolve-tokens.js` | Task | Resolve nested token paths |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards: 3 utility-first + 3 tokens questions |

## Self-check

- [ ] Explained trade-offs of utility-first CSS in a design system
- [ ] Described how conflicting utilities resolve in Tailwind
- [ ] Identified when to extract a component class vs keep utilities
- [ ] All tasks pass: `npm run day-04`

## Run

```bash
npm run day-04
# or
node days/day-04-tailwind-architecture/tasks/run-all.js
```
