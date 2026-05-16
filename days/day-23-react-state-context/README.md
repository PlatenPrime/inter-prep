# Day 23 — React State & Context

> **Time:** ~4 hours | **Phase:** 4 — React

## Goals

- Объяснить Context, prop drilling и mini-store patterns на интервью
- Реализовать createStore, selector, splitContext и broadcast

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/context-patterns.md` | Q&A | Context Patterns |
| `questions/state-management.md` | Q&A | State Management |
| `tasks/task-01-create-store.ts` | Task | Minimal subscribe store |
| `tasks/task-02-selector.ts` | Task | Select slice from state |
| `tasks/task-03-split-context.ts` | Task | Return state and dispatch pair objects |
| `tasks/task-04-broadcast.ts` | Task | Notify all subscribers with payload |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained when Context causes re-render of all consumers
- [ ] selector returns derived slice without mutating state
- [ ] All tasks pass: `npm run day-23`

## Run

```bash
npm run day-23
# or
npx tsx days/day-23-react-state-context/tasks/run-all.ts
```
