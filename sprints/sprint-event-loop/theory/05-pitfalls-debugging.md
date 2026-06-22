# Pitfalls & Debugging — Interview Q&A

---

## Q1. [RU] Что такое starvation event loop?

**Answer (EN):**
When microtasks (or recursive nextTick) continuously schedule more work, macrotasks and I/O never run — timers and network callbacks delay indefinitely.

**Follow-ups:**
- Infinite Promise.resolve loop?
- Fix strategy?

**Red flags:**
- Never heard of starvation

---

## Q2. [RU] Как floating promise ломает React приложения?

**Answer (EN):**
Unhandled rejections in useEffect async IIFE; race conditions on unmount; missing cleanup. Always catch, use AbortController, or dedicated data library with cancellation.

**Follow-ups:**
- eslint floating promises?
- React 19 use() hook?

**Red flags:**
- async useEffect without cleanup discussion

---

## Q3. [RU] Как отлаживать порядок выполнения на интервью?

**Answer (EN):**
Write phases: sync stack → microtasks (FIFO, drain all) → one macrotask → repeat. For Node add nextTick before Promise. Trace nested then/await as additional microtasks.

**Follow-ups:**
- Whiteboard technique?
- Common trick questions?

**Red flags:**
- Guesses without phase model

---

## Q4. [RU] Promise.all vs allSettled в контексте event loop?

**Answer (EN):**
Both wait for all inputs; all rejects fast on first rejection. allSettled always resolves with per-promise status — better when partial success matters. Microtasks from inputs still interleave per turn rules.

**Follow-ups:**
- Promise.race pitfalls?
- AbortSignal integration?

**Red flags:**
- Uses all when need partial results

---
