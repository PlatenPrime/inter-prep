# Day 21 — React Reconciliation

> **Time:** ~4 hours | **Phase:** 4 — React

## Goals

- Объяснить reconciliation, keys и Fiber на интервью (EN)
- Реализовать reconcileKeys, shouldUpdate, flattenChildren и listStableId

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/reconciliation-keys.md` | Q&A | Reconciliation & Keys |
| `questions/fiber-scheduler.md` | Q&A | Fiber & Scheduler |
| `tasks/task-01-reconcile-keys.ts` | Task | Diff old vs new key lists |
| `tasks/task-02-should-update.ts` | Task | Shallow compare props for re-render |
| `tasks/task-03-flatten-children.ts` | Task | Flatten nested child arrays |
| `tasks/task-04-list-stable-id.ts` | Task | Stable id from item fields |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained why index keys hurt reorderable lists
- [ ] reconcileKeys returns added/removed/moved
- [ ] All tasks pass: `npm run day-21`

## Run

```bash
npm run day-21
# or
npx tsx days/day-21-react-reconciliation/tasks/run-all.ts
```
