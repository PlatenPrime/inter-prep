# Render Optimization — Interview Q&A

---

## Q1. [RU] whyDidYouRender / why render debugging?

**Answer (EN):**
Log when memoized component renders despite same props — find unstable props. Educational lite version compares prev/next props shallowly.

**Follow-ups:**
- React DevTools highlight?
- Strict Mode double render?

**Red flags:**
- Blaming React for parent new object props

---

## Q2. [RU] selectSlice from store?

**Answer (EN):**
Pick slice with shallow compare on result — avoid re-render when unrelated state changes. Zustand uses useStore(selector, shallow).

**Follow-ups:**
- Reselect memo?
- useSyncExternalStore selector?

**Red flags:**
- Selecting entire store object

---

## Q3. [RU] memoProps pattern?

**Answer (EN):**
Merge default + incoming props once with stable references for memo children. Pair with useMemo for style objects.

**Follow-ups:**
- CSS-in-JS objects?
- Tailwind static classes?

**Red flags:**
- style={{ }} new object every render to memo child

---

## Q4. [RU] Context split for performance?

**Answer (EN):**
See day 23 — split state/dispatch. Mention again in perf context: unnecessary context subscriptions dominate.

**Follow-ups:**
- useContextSelector?
- External store?

**Red flags:**
- Single fat context for perf-sensitive tree

---

## Q5. [RU] React 19 Compiler implications?

**Answer (EN):**
Auto memoization may reduce manual memo needs — still profile. Understand rules not removed — compiler inserts memo guards.

**Follow-ups:**
- Forget compiler fallback?
- eslint compiler plugin?

**Red flags:**
- "Compiler fixes everything" without testing

---

## Q6. [RU] INP and React performance?

**Answer (EN):**
Interaction to Next Paint — long tasks block input. Split work with startTransition, web workers for heavy JS, avoid layout thrashing.

**Follow-ups:**
- Concurrent features?
- Scheduler priorities?

**Red flags:**
- Synchronous heavy filter on every keystroke

---

