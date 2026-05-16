# Day 11 — TS Setup & Fundamentals

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить structural typing, unknown vs any и strict mode на интервью (EN)
- Реализовать isAssignable, pick, assertNever и deepFreeze как runtime-утилиты

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/ts-structural-typing.md` | Q&A | Structural Typing |
| `questions/strict-unknown-never.md` | Q&A | strict, unknown, never |
| `tasks/task-01-is-assignable.ts` | Task | Runtime structural shape check |
| `tasks/task-02-pick.ts` | Task | Pick keys from object |
| `tasks/task-03-assert-never.ts` | Task | Exhaustiveness runtime guard |
| `tasks/task-04-deep-freeze.ts` | Task | Deep Object.freeze |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained structural vs nominal typing with examples
- [ ] Implemented pick and deepFreeze with passing run-all.ts
- [ ] All tasks pass: `npm run day-11`

## Run

```bash
npm run day-11
# or
npx tsx days/day-11-ts-setup-fundamentals/tasks/run-all.ts
```
