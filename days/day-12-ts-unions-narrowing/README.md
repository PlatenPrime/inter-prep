# Day 12 — TS Unions & Narrowing

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить discriminated unions и type guards на интервью (EN)
- Реализовать narrowShape, exhaustiveCheck, isKeyOf и parseResult

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/discriminated-unions.md` | Q&A | Discriminated Unions |
| `questions/type-guards-narrowing.md` | Q&A | Type Guards & Narrowing |
| `tasks/task-01-narrow-shape.ts` | Task | Narrow by kind discriminant |
| `tasks/task-02-exhaustive-check.ts` | Task | Runtime exhaustiveness throw |
| `tasks/task-03-is-key-of.ts` | Task | Type guard for object keys |
| `tasks/task-04-parse-result.ts` | Task | Result type with validator guard |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained narrowing flow for in / typeof / discriminant
- [ ] parseResult returns ok/error without throwing on invalid input
- [ ] All tasks pass: `npm run day-12`

## Run

```bash
npm run day-12
# or
npx tsx days/day-12-ts-unions-narrowing/tasks/run-all.ts
```
