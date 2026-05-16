# Day 17 — TS Config & Strict Mode

> **Time:** ~4 hours | **Phase:** 3 — TypeScript

## Goals

- Объяснить tsconfig flags и миграцию на strict на интервью
- Реализовать strictFlagsScore, needsNoImplicitAny, checkStrictNull и mergeCompilerOptions

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/tsconfig-flags.md` | Q&A | tsconfig Flags |
| `questions/strict-migration.md` | Q&A | Strict Migration |
| `tasks/task-01-strict-flags-score.ts` | Task | Count enabled strict-related flags |
| `tasks/task-02-needs-no-implicit-any.ts` | Task | Detect untyped param pattern in snippet |
| `tasks/task-03-check-strict-null.ts` | Task | Property access without optional chain |
| `tasks/task-04-merge-compiler-options.ts` | Task | Shallow merge compilerOptions |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Named at least 5 strict-related compiler options
- [ ] mergeCompilerOptions deep-merges compilerOptions object
- [ ] All tasks pass: `npm run day-17`

## Run

```bash
npm run day-17
# or
npx tsx days/day-17-ts-config-strict/tasks/run-all.ts
```
