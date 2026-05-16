# Day 08 — JS Async & Event Loop

> **Time:** ~4 hours | **Phase:** 2 — JavaScript depth

## Goals

- Объяснить microtask vs macrotask и порядок вывода в консоль
- Реализовать retry, delay и mapLimit для async паттернов

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/event-loop.md` | Q&A | Event Loop |
| `questions/async-patterns.md` | Q&A | Async Patterns |
| `tasks/task-01-classify-micro-macro.js` | Task | Order: sync, promise micro, timeout macro |
| `tasks/task-02-retry.js` | Task | Retry async fn with attempts |
| `tasks/task-03-delay.js` | Task | Return promise resolved after ms |
| `tasks/task-04-map-limit.js` | Task | Map with concurrency limit |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Predicted event loop order for 3 interview snippets
- [ ] Implemented mapLimit with concurrency control
- [ ] All tasks pass: `npm run day-08`

## Run

```bash
npm run day-08
# or
node days/day-08-js-async-event-loop/tasks/run-all.js
```
