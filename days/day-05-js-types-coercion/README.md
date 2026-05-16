# Day 05 — JS Types & Coercion

> **Time:** ~4 hours | **Phase:** 1 — Platform foundations

## Goals

- Уверенно объяснять `==` vs `===` и правила coercion
- Предсказывать результат `ToNumber` / `ToString`
- Реализовать `deepEqual` lite и понимать `Object.is`

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/coercion-equality.md` | Q&A | ==, ===, Object.is, falsy |
| `questions/types-typeof.md` | Q&A | typeof, arrays, deep equal |
| `tasks/task-01-loose-equal.js` | Task | Abstract equality (==) |
| `tasks/task-02-coercion-hint.js` | Task | Type tags + ToNumber |
| `tasks/task-03-deep-equal-lite.js` | Task | Deep equal for plain data |
| `tasks/task-04-strict-equal.js` | Task | Strict equal (Object.is) |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards: 3 coercion + 3 types questions |

## Self-check

- [ ] Listed falsy values and explained `[] == false`
- [ ] Explained why `Object.is(NaN, NaN)` is true but `NaN === NaN` is false
- [ ] Implemented deepEqual without `JSON.stringify` pitfalls
- [ ] All tasks pass: `npm run day-05`

## Run

```bash
npm run day-05
# or
node days/day-05-js-types-coercion/tasks/run-all.js
```
