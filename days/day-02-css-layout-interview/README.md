# Day 02 — CSS Layout Interview

> **Time:** ~4 hours | **Phase:** 1 — Platform foundations

## Goals

- Объяснять box model, margin collapse и BFC на интервью (EN)
- Уверенно сравнивать Flexbox и Grid, знать когда что выбирать
- Считать specificity и понимать cascade/stacking

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/box-model-bfc.md` | Q&A | content-box, BFC, margin collapse, overflow |
| `questions/flex-grid-specificity.md` | Q&A | flex/grid, alignment, specificity |
| `tasks/task-01-box-model.js` | Task | Outer dimensions (content-box / border-box) |
| `tasks/task-02-margin-collapse.js` | Task | Collapse vertical margins |
| `tasks/task-03-flex-distribute.js` | Task | Distribute flex grow space |
| `tasks/task-04-specificity.js` | Task | Specificity tuple for selector |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards: 3 box model + 3 flex/grid questions |

## Self-check

- [ ] Explained difference between `content-box` and `border-box`
- [ ] Described when a new BFC is created and why it matters
- [ ] Compared `justify-content` vs `align-items` in flex
- [ ] All tasks pass: `npm run day-02`

## Run

```bash
npm run day-02
# or
node days/day-02-css-layout-interview/tasks/run-all.js
```
