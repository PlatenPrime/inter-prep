# Performance Patterns — Interview Q&A

---

## Q1. [RU] debounce vs throttle — практические примеры?

**Answer (EN):**
Debounce: wait until user stops typing (autocomplete). Throttle: at most once per interval (scroll, resize). Choose trailing vs leading edge based on UX.

**Follow-ups:**
- lodash debounce options?
- React useDeferredValue?

**Red flags:**
- Throttle on search input causing laggy feel

---

## Q2. [RU] Что такое virtual scrolling / windowing?

**Answer (EN):**
Render only visible slice of large list plus overscan buffer. Reduces DOM nodes and layout cost. Requires fixed or measured row heights for best performance.

**Follow-ups:**
- react-window?
- IntersectionObserver?

**Red flags:**
- Rendering 50k DOM nodes "for simplicity"

---

## Q3. [RU] Как измерить performance в браузере?

**Answer (EN):**
Performance tab, Lighthouse, Core Web Vitals (LCP, INP, CLS). Long tasks over 50ms block main thread. Mention RUM vs lab data.

**Follow-ups:**
- User Timing API?
- PerformanceObserver?

**Red flags:**
- Optimizing without profiling

---

## Q4. [RU] Что такое layout thrashing?

**Answer (EN):**
Alternating read/write of layout-forcing properties causes forced reflows. Batch reads then writes, use transform/opacity for animations (composite only).

**Follow-ups:**
- offsetHeight read?
- requestAnimationFrame batching?

**Red flags:**
- Reading layout in loop per item

---

## Q5. [RU] Как оптимизировать список в React?

**Answer (EN):**
Stable keys, memoized row, virtualization, avoid inline object props, split context. React Compiler may auto-memoize — still understand why.

**Follow-ups:**
- key=index anti-pattern?
- Fragment keys?

**Red flags:**
- key={Math.random()}

---

## Q6. [RU] requestAnimationFrame vs setTimeout для анимаций?

**Answer (EN):**
rAF syncs to display refresh and pauses in background tabs. setTimeout drifts. Use rAF loop for visual updates; CSS animations preferred when possible.

**Follow-ups:**
- will-change?
- GPU layers?

**Red flags:**
- setTimeout 16ms for 60fps without drift handling

---

