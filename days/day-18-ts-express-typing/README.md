# Day 18 — TS Express Typing

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить типизацию Request/Response, middleware и error handler на интервью
- Реализовать wrapHandler, parseRouteParams, middlewareChain и errorHandlerShape

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/express-request-response.md` | Q&A | Express Request & Response |
| `questions/middleware-errors.md` | Q&A | Middleware & Errors |
| `tasks/task-01-wrap-handler.ts` | Task | Catch async errors in handler |
| `tasks/task-02-parse-route-params.ts` | Task | Match :param route pattern |
| `tasks/task-03-middleware-chain.ts` | Task | Run middlewares in sequence |
| `tasks/task-04-error-handler-shape.ts` | Task | Normalize error to { status, message } |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained req.params vs typed route params pattern
- [ ] middlewareChain runs in order until done
- [ ] All tasks pass: `npm run day-18`

## Run

```bash
npm run day-18
# or
npx tsx days/day-18-ts-express-typing/tasks/run-all.ts
```
