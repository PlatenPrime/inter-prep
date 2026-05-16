# Day 16 — TS Async & API Typing

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить Promise typing, Result pattern и async boundaries на интервью
- Реализовать toResult, mapAsync, sequence и timeoutPromise

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/promise-async-types.md` | Q&A | Promise & async Types |
| `questions/api-result-pattern.md` | Q&A | API Result Pattern |
| `tasks/task-01-to-result.ts` | Task | Wrap promise in Result |
| `tasks/task-02-map-async.ts` | Task | Parallel map with promises |
| `tasks/task-03-sequence.ts` | Task | Run async tasks serially |
| `tasks/task-04-timeout-promise.ts` | Task | Reject if promise exceeds ms |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained Promise<T> vs async function return inference
- [ ] toResult never throws on rejection
- [ ] All tasks pass: `npm run day-16`

## Run

```bash
npm run day-16
# or
npx tsx days/day-16-ts-async-api-typing/tasks/run-all.ts
```
