# Sprint — Event Loop (Browser + Node)

> **Time:** ~10 hours | **Type:** Expert deep-dive sprint

## Goals

- Предсказывать порядок вывода для любого sync/micro/macro/nextTick сочетания
- Объяснять фазы Node.js event loop и роль libuv
- Реализовывать async-паттерны с пониманием очередей

## Prerequisites

- `days/day-08-js-async-event-loop`
- `days/day-36-node-eventloop-modules`

## Files

| File | Type | Topic |
|------|------|-------|
| `theory/01-browser-fundamentals.md` | Q&A |
| `theory/02-microtasks-macrotasks.md` | Q&A |
| `theory/03-async-await-internals.md` | Q&A |
| `theory/04-node-event-loop.md` | Q&A |
| `theory/05-pitfalls-debugging.md` | Q&A |
| `practice/tasks/task-01-classify-tasks.js` | Task | Classify tasks |
| `practice/tasks/task-02-predict-order.js` | Task | Predict execution order |
| `practice/tasks/task-03-microtask-drain.js` | Task | Microtask drain simulator |
| `practice/tasks/task-04-schedule-sequence.js` | Task | Schedule sequence |
| `practice/tasks/task-05-async-retry-backoff.js` | Task | Async retry with backoff |
| `practice/tasks/task-06-node-phase-order.js` | Task | Node event loop phases |
| `practice/tasks/task-07-nextTick-vs-microtask.js` | Task | nextTick vs microtask priority |
| `practice/tasks/task-08-event-loop-tracer.js` | Task | Event loop tracer |
| `drills/` | Drills | 38 puzzles with `check.mjs` |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 2–2.5 h | `theory/` — answer aloud in EN |
| Practice | 2.5–3 h | `practice/tasks/` |
| Drills pass 1 | 2–2.5 h | `drills/` — no spoilers |
| Drills pass 2 | 1.5–2 h | Retry mistakes + open-ended |
| Review | 1 h | Self-check below |

## Self-check

- [ ] 35+ drills correct without answer.md
- [ ] All 8 practice tasks pass
- [ ] Can whiteboard browser vs Node differences

## Run

```bash
npm run sprint-event-loop
npm run sprint-event-loop:drills
```

## Further reading

- [webdev Event Loop](../../webdev/10.%20async-js/004-chto-takoe-cikl-sobytiy-event-loop-i-kak-on-rabotaet.md)
- [webdev Micro vs Macro](../../webdev/10.%20async-js/005-raznica-mezhdu-mikro-i-makrozadachami-v-event-loop.md)
