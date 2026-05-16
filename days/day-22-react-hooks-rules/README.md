# Day 22 — React Hooks Rules

> **Time:** ~4 hours | **Phase:** 4 — React

## Goals

- Объяснить rules of hooks и deps array на интервью
- Реализовать validateHookOrder, depsChanged, staleClosureFix и hookCallCount

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/rules-of-hooks.md` | Q&A | Rules of Hooks |
| `questions/deps-stale-closure.md` | Q&A | Deps & Stale Closure |
| `tasks/task-01-validate-hook-order.ts` | Task | Detect duplicate hook name in sequence |
| `tasks/task-02-deps-changed.ts` | Task | Shallow compare dependency tuples |
| `tasks/task-03-stale-closure-fix.ts` | Task | Return latest value via ref getter |
| `tasks/task-04-hook-call-count.ts` | Task | Count hook invocations in log |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained why hooks cannot be conditional
- [ ] depsChanged detects shallow changes
- [ ] All tasks pass: `npm run day-22`

## Run

```bash
npm run day-22
# or
npx tsx days/day-22-react-hooks-rules/tasks/run-all.ts
```
