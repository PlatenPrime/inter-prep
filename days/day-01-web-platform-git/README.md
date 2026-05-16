# Day 01 — Web Platform & Git

> **Time:** ~4 hours | **Phase:** 1 — Platform foundations

## Goals

- Уверенно объяснять семантику HTML и базовую a11y на интервью (EN)
- Различать merge/rebase и восстановление истории через reflog
- Решить прикладные задачи: audit HTML, delegation, git recovery logic

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/html-semantics-a11y.md` | Q&A | Landmarks, headings, ARIA, focus |
| `questions/git-workflow.md` | Q&A | merge vs rebase, cherry-pick, PR review |
| `tasks/task-01-semantic-audit.js` | Task | Find semantic/a11y violations in HTML string |
| `tasks/task-02-event-delegation.js` | Task | Single listener for dynamic list |
| `tasks/task-03-git-recovery-scenario.js` | Task | Recover commit hash from reflog entries |
| `tasks/task-04-parse-git-log.js` | Task | Parse simplified `git log --oneline` output |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards: 3 HTML + 3 Git questions |

## Self-check

- [ ] Explained why `<motion.div onClick>` is worse than `<button>` for a11y
- [ ] Described when to rebase vs merge on a feature branch
- [ ] All tasks pass: `npm run day-01`

## Run

```bash
npm run day-01
# or
node days/day-01-web-platform-git/tasks/run-all.js
```
