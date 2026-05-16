# Day 25 — React Memo & Performance

> **Time:** ~4 hours | **Phase:** 4 — React

## Goals

- Объяснить React.memo, useMemo и profiling на интервью
- Реализовать shallowEqual, memoProps, whyDidYouRenderLite и selectSlice

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/memo-usememo.md` | Q&A | memo & useMemo |
| `questions/render-optimization.md` | Q&A | Render Optimization |
| `tasks/task-01-shallow-equal.ts` | Task | Shallow compare two objects |
| `tasks/task-02-memo-props.ts` | Task | Merge props for stable memo child |
| `tasks/task-03-why-did-you-render-lite.ts` | Task | Keys that changed shallowly |
| `tasks/task-04-select-slice.ts` | Task | Memoized selector with ref cache |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained referential equality and memo bailout
- [ ] selectSlice returns same reference if slice unchanged
- [ ] All tasks pass: `npm run day-25`

## Run

```bash
npm run day-25
# or
npx tsx days/day-25-react-memo-performance/tasks/run-all.ts
```
