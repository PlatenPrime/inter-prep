# Deps & Stale Closure — Interview Q&A

---

## Q1. [RU] Как работает useEffect dependency array?

**Answer (EN):**
Empty [] runs once after mount; omitted runs every render; listed deps shallow-compared — re-run when changed. Cleanup runs before re-run and unmount.

**Follow-ups:**
- Exhaustive deps eslint?
- Object in deps?

**Red flags:**
- Missing deps causing stale closure bugs

---

## Q2. [RU] Что такое stale closure в useEffect/setInterval?

**Answer (EN):**
Effect captures old state from render when created. Fix: include deps, functional update, or ref for latest. Classic interview: counter + setInterval logging 0.

**Follow-ups:**
- useEffectEvent?
- Ref pattern?

**Red flags:**
- Empty deps with state inside effect always

---

## Q3. [RU] depsChanged shallow compare?

**Answer (EN):**
Same as React Object.is for each dep index; length must match. Used in tooling and useMemo implementation conceptually.

**Follow-ups:**
- Deep compare deps anti-pattern?
- useDeepCompareEffect?

**Red flags:**
- JSON.stringify deps hack

---

## Q4. [RU] useCallback vs useMemo?

**Answer (EN):**
useCallback returns stable function reference (memo(fn)); useMemo memoizes value. useCallback(fn, deps) ≡ useMemo(() => fn, deps). For child memoized components.

**Follow-ups:**
- Inline function cost?
- React Compiler auto memo?

**Red flags:**
- useCallback on every function without memo child

---

## Q5. [RU] useLayoutEffect vs useEffect?

**Answer (EN):**
useLayoutEffect runs synchronously after DOM mutations before paint — measure layout, avoid flicker. useEffect async after paint. SSR warning for layout.

**Follow-ups:**
- useInsertionEffect?
- Flash of wrong size?

**Red flags:**
- useLayoutEffect for data fetching

---

## Q6. [RU] hookCallCount — зачем в devtools?

**Answer (EN):**
Track renders vs hook invocations to detect violations (double hooks). Educational for understanding Fiber hook list length per render.

**Follow-ups:**
- Why did you render?
- React DevTools profiler?

**Red flags:**
- Ignoring profiler when debugging perf

---

