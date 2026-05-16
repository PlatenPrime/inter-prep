# Day 20 — TS Branded & Runtime Validation

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить branded types и schema validation (Zod-style) на интервью
- Реализовать brand, parseEmail, safeParseUser и stripBrand

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/branded-types.md` | Q&A | Branded Types |
| `questions/zod-runtime-validation.md` | Q&A | Zod & Runtime Validation |
| `tasks/task-01-brand.ts` | Task | Attach runtime brand label via WeakMap |
| `tasks/task-02-parse-email.ts` | Task | Validate email string |
| `tasks/task-03-safe-parse-user.ts` | Task | Parse user object with email validation |
| `tasks/task-04-strip-brand.ts` | Task | Return plain object copy without brand |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained brands are compile-time only without runtime marker
- [ ] safeParseUser returns null on invalid email
- [ ] All tasks pass: `npm run day-20`

## Run

```bash
npm run day-20
# or
npx tsx days/day-20-ts-branded-zod/tasks/run-all.ts
```
