# Day 28 — React Error & Suspense

> **Time:** ~4 hours | **Phase:** 4 — React

## Goals

- Объяснить Error Boundary, Suspense и retry на интервью
- Реализовать classifyError, retryBoundary, suspenseReady и errorFallbackProps

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/error-boundaries.md` | Q&A | Error Boundaries |
| `questions/suspense-streaming.md` | Q&A | Suspense & Streaming |
| `tasks/task-01-classify-error.ts` | Task | Categorize unknown error |
| `tasks/task-02-retry-boundary.ts` | Task | Increment reset key on retry |
| `tasks/task-03-suspense-ready.ts` | Task | Check if promise already settled |
| `tasks/task-04-error-fallback-props.ts` | Task | Build fallback UI props from error |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained Error Boundary limitations (no event handlers)
- [ ] classifyError maps unknown to category
- [ ] All tasks pass: `npm run day-28`

## Run

```bash
npm run day-28
# or
npx tsx days/day-28-react-error-suspense/tasks/run-all.ts
```
