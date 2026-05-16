# Day 10 — Git Advanced Tricks

> **Time:** ~4 hours | **Phase:** 2 — JavaScript depth

## Goals

- Объяснить rebase, reflog, bisect и cherry-pick на интервью
- Реализовать парсеры reflog и планировщики git-сценариев

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/rebase-reflog.md` | Q&A | Rebase & Reflog |
| `questions/bisect-cherry-pick.md` | Q&A | Bisect & Cherry-pick |
| `tasks/task-01-parse-reflog.js` | Task | Parse reflog lines to objects |
| `tasks/task-02-rebase-onto-plan.js` | Task | Commits to replay for rebase --onto |
| `tasks/task-03-bisect-next.js` | Task | Middle index for bisect |
| `tasks/task-04-cherry-pick-order.js` | Task | Topo-sort commits by deps |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained rebase vs merge conflict resolution
- [ ] Recovered lost commit using reflog concept
- [ ] All tasks pass: `npm run day-10`

## Run

```bash
npm run day-10
# or
node days/day-10-git-advanced-tricks/tasks/run-all.js
```
