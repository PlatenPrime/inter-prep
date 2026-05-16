# Suspense & Streaming — Interview Q&A

---

## Q1. [RU] Что делает Suspense?

**Answer (EN):**
Shows fallback while children suspend (throw promise). When resolved, shows children. Enables streaming SSR and lazy loading coordination.

**Follow-ups:**
- suspenseReady check?
- Multiple boundaries?

**Red flags:**
- Suspense without error boundary sibling

---

## Q2. [RU] suspenseReady utility?

**Answer (EN):**
Track promise resolution for teaching — production uses Suspense + cache. Checks if resource ready before render.

**Follow-ups:**
- use() hook React 19?
- Resource read()?

**Red flags:**
- Manual suspense without data library

---

## Q3. [RU] Suspense + data fetching?

**Answer (EN):**
Throw promise on fetch cache miss — Relay/Next.js/RSC patterns. TanStack Query suspense mode experimental.

**Follow-ups:**
- useSuspenseQuery?
- Waterfall avoidance?

**Red flags:**
- Fetch in child without coordinating suspense

---

## Q4. [RU] lazy() with Suspense?

**Answer (EN):**
React.lazy dynamic import — fallback in Suspense boundary. Code splitting routes. Handle import failure with error boundary.

**Follow-ups:**
- Prefetch route?
- Vite dynamic import?

**Red flags:**
- lazy without Suspense fallback

---

## Q5. [RU] Concurrent rendering and suspend?

**Answer (EN):**
React can show stale UI while preparing next — useTransition. Suspense boundaries define fallback units.

**Follow-ups:**
- selective hydration?
- PPR Next.js?

**Red flags:**
- Blocking entire app on one suspend

---

## Q6. [RU] Testing error and suspense?

**Answer (EN):**
RTL waitFor, act, mock throwing components. Error boundary test by rendering Thrower. Query error states easier than suspense in unit tests.

**Follow-ups:**
- MSW delayed response?
- Storybook play?

**Red flags:**
- No test for fallback UI

---

