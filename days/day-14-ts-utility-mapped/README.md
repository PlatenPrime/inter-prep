# Day 14 — TS Utility & Mapped Types

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить Partial, Pick, Omit, Record и mapped types на интервью
- Реализовать partialDeep, requiredKeys, mutable и valueOfUnion

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/utility-types.md` | Q&A | Utility Types |
| `questions/mapped-types.md` | Q&A | Mapped Types |
| `tasks/task-01-partial-deep.ts` | Task | Shallow-clone nested objects one level deep per branch |
| `tasks/task-02-required-keys.ts` | Task | Own keys of object as array |
| `tasks/task-03-mutable.ts` | Task | Copy readonly array to mutable |
| `tasks/task-04-value-of-union.ts` | Task | Object.values for string enum map |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained mapped type syntax and keyof loop
- [ ] partialDeep clones nested objects shallowly per level
- [ ] All tasks pass: `npm run day-14`

## Run

```bash
npm run day-14
# or
npx tsx days/day-14-ts-utility-mapped/tasks/run-all.ts
```
