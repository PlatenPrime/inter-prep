# React Performance Core — Interview Q&A

---

## Q1. [RU] Когда React.memo реально помогает?

**Answer (EN):**
memo helps when parent re-renders often but props to child are shallow-equal and render is expensive. Use React DevTools Profiler first — do not wrap every leaf. With React Compiler (19+) manual memo need drops.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Code splitting в React?

**Answer (EN):**
Route-level lazy(() => import()) reduces initial bundle. Prefetch on hover for likely navigation. Balance chunk count vs HTTP2 multiplexing.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Виртуализация списков?

**Answer (EN):**
Render only visible rows (react-window, TanStack Virtual) for 1k+ items. Fixed row height simplifies math; dynamic height needs measurement cache.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] key prop на списках?

**Answer (EN):**
Stable unique ids, not array index when order changes — prevents wrong component state reuse and excess DOM work.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] useMemo/useCallback — когда?

**Answer (EN):**
When passing to memoized children or expensive pure compute. Not for every primitive — allocation has cost too.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Concurrent features impact?

**Answer (EN):**
useTransition marks updates non-urgent; Suspense boundaries for streaming. Explain deferring heavy filter UI.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
