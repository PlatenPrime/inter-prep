# Error Boundaries — Interview Q&A

---

## Q1. [RU] Что ловит Error Boundary?

**Answer (EN):**
Rendering, lifecycle, constructors in children — not event handlers, async, or SSR alone. getDerivedStateFromError + componentDidCatch.

**Follow-ups:**
- react-error-boundary lib?
- resetKeys?

**Red flags:**
- try/catch around onClick expecting boundary

---

## Q2. [RU] errorFallbackProps pattern?

**Answer (EN):**
Map error to { title, message, retry } for fallback UI component. Keep presentation separate from classification logic.

**Follow-ups:**
- i18n errors?
- error.digest Next.js?

**Red flags:**
- Showing stack trace to users in prod

---

## Q3. [RU] classifyError categories?

**Answer (EN):**
network, auth, validation, unknown — route to different UI and monitoring tags. Unknown errors log with fingerprint.

**Follow-ups:**
- instanceof AppError?
- HTTP status mapping?

**Red flags:**
- All errors generic toast

---

## Q4. [RU] retryBoundary strategy?

**Answer (EN):**
Reset error state on retry click with key increment remount children. Exponential backoff for query retry separate concern.

**Follow-ups:**
- resetErrorBoundary?
- Query errorResetBoundary?

**Red flags:**
- Infinite retry loop without limit

---

## Q5. [RU] Error boundary granularity?

**Answer (EN):**
Page-level vs widget-level — isolate failure blast radius. Route error boundaries in React Router 6.4+.

**Follow-ups:**
- Nested boundaries?
- Log to Sentry component stack?

**Red flags:**
- Single boundary at root only for huge app

---

## Q6. [RU] Uncaught promise in useEffect?

**Answer (EN):**
Not caught by boundary — handle in effect or global unhandledrejection. TanStack Query error state preferred.

**Follow-ups:**
- Error boundary + suspense?
- throw promise?

**Red flags:**
- Relying on boundary for fetch errors without throw

---

