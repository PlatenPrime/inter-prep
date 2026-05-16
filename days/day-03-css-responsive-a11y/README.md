# Day 03 — CSS Responsive & Accessibility

> **Time:** ~4 hours | **Phase:** 1 — Platform foundations

## Goals

- Объяснять container queries vs media queries
- Считать contrast ratio и уровни WCAG AA/AAA
- Применять responsive patterns: `clamp()`, fluid typography

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/container-queries-responsive.md` | Q&A | @container, breakpoints, clamp |
| `questions/wcag-contrast-a11y.md` | Q&A | WCAG levels, contrast, focus |
| `tasks/task-01-container-query.js` | Task | Match styles by container width |
| `tasks/task-02-contrast-ratio.js` | Task | WCAG contrast ratio from hex |
| `tasks/task-03-wcag-level.js` | Task | AA / AAA / fail for text type |
| `tasks/task-04-clamp-value.js` | Task | Evaluate simplified clamp() |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards: 3 responsive + 3 a11y questions |

## Self-check

- [ ] Explained when container queries beat viewport media queries
- [ ] Calculated whether `#767676` on white passes WCAG AA for normal text
- [ ] Described difference between large text and normal text thresholds
- [ ] All tasks pass: `npm run day-03`

## Run

```bash
npm run day-03
# or
node days/day-03-css-responsive-a11y/tasks/run-all.js
```
