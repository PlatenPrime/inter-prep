# Advanced Performance — Interview Q&A

---

## Q1. [RU] Network waterfall в React?

**Answer (EN):**
Sequential fetches in nested useEffect cause waterfalls — lift fetch to route loader or parallelize with Promise.all / TanStack Query.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q2. [RU] Hydration cost?

**Answer (EN):**
Less client JS via RSC; avoid hydration mismatch. Selective hydration with Suspense.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q3. [RU] Bundle analysis?

**Answer (EN):**
vite-bundle-visualizer / webpack-bundle-analyzer; tree-shake lodash, import icons individually.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q4. [RU] Images performance?

**Answer (EN):**
width/height, lazy loading, WebP/AVIF, CDN — affects LCP directly.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q5. [RU] State colocation?

**Answer (EN):**
Push state down to avoid unrelated re-renders; context splits or Zustand selectors for global.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---

## Q6. [RU] Web Vitals на интервью?

**Answer (EN):**
LCP, INP, CLS — tie optimizations to metrics not micro-benchmarks.

**Follow-ups:**
- Real example from your project?

**Red flags:**
- Cannot explain trade-offs

---
