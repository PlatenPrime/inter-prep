# Day 24 — React TanStack Query

> **Time:** ~4 hours | **Phase:** 4 — React

## Goals

- Объяснить queryKey, staleTime, cache и invalidation на интервью
- Реализовать queryKeyHash, staleTimeCheck, cacheEntry и invalidatePrefix

## Files

| File | Type | Topic |
|------|------|-------|
| `questions/query-keys-cache.md` | Q&A | Query Keys & Cache |
| `questions/mutations-prefetch.md` | Q&A | Mutations & Prefetch |
| `tasks/task-01-query-key-hash.ts` | Task | Stable hash from query key array |
| `tasks/task-02-stale-time-check.ts` | Task | Is cache entry stale |
| `tasks/task-03-cache-entry.ts` | Task | Build cache entry object |
| `tasks/task-04-invalidate-prefix.ts` | Task | Remove keys matching prefix |

## Schedule

| Block | Duration | Activity |
|-------|----------|----------|
| Theory | 90–120 min | `questions/` — answer aloud in EN |
| Practice | 90–120 min | `tasks/` |
| Review | 30–60 min | Flashcards from question files |

## Self-check

- [ ] Explained stale vs cacheTime (gcTime) terminology
- [ ] invalidatePrefix removes matching keys
- [ ] All tasks pass: `npm run day-24`

## Run

```bash
npm run day-24
# or
npx tsx days/day-24-react-tanstack-query/tasks/run-all.ts
```
