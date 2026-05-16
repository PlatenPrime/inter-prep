# Day 13 — TS Generics & Inference

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить generic constraints, inference и variance на интервью
- Реализовать groupBy, pickKeys, omitKeys и identity

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/generics-basics.md` | Q&A | Generics Basics |
| `questions/inference-variance.md` | Q&A | Inference & Variance |
| `tasks/task-01-group-by.ts` | Task | Group array items by key fn |
| `tasks/task-02-pick-keys.ts` | Task | Pick subset of keys from object |
| `tasks/task-03-omit-keys.ts` | Task | Omit keys from object copy |
| `tasks/task-04-identity.ts` | Task | Generic identity function |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained when to use extends constraint vs default type param
- [ ] groupBy returns correct Record buckets
- [ ] All tasks pass: `npm run day-13`

## Run

```bash
npm run day-13
# or
npx tsx days/day-13-ts-generics-inference/tasks/run-all.ts
```
