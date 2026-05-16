# Day 06 — JS Scope & Closures

> **Time:** ~4 hours | **Phase:** 2 — JavaScript depth

## Goals

- Объяснить lexical scope, closure и stale closure на интервью (EN)
- Реализовать once, memoize, createCounter и compose через замыкания

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/closures-lexical.md` | Q&A | Closures & Lexical Scope |
| `questions/memoize-patterns.md` | Q&A | Memoize & Module Patterns |
| `tasks/task-01-once.js` | Task | Call fn at most once |
| `tasks/task-02-memoize.js` | Task | Memoize by JSON.stringify(args) |
| `tasks/task-03-create-counter.js` | Task | Factory { increment, decrement, value } |
| `tasks/task-04-compose.js` | Task | compose(f,g)(x) => f(g(x)) right-to-left |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained lexical vs dynamic scope and TDZ
- [ ] Implemented once/memoize without library helpers
- [ ] All tasks pass: `npm run day-06`

## Run

```bash
npm run day-06
# or
node days/day-06-js-scope-closures/tasks/run-all.js
```
