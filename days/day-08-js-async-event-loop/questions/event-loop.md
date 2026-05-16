# Event Loop — Interview Q&A

---

## Q1. [RU] В каком порядке выполняются sync, Promise и setTimeout?

**Answer (EN):**
Run synchronous code first, drain microtask queue (promises, queueMicrotask), then one macrotask (setTimeout), repeat. Nested promises schedule more microtasks before next macrotask. Classic interview: print order puzzle.

**Follow-ups:**
- requestAnimationFrame queue?
- Node vs browser differences?

**Red flags:**
- "setTimeout 0 runs immediately"

---

## Q2. [RU] Чем microtask отличается от macrotask?

**Answer (EN):**
Microtasks run after current stack clears but before rendering/next timer; macrotasks are task queue items like setTimeout, I/O callbacks. Promises are microtasks; setTimeout is macrotask.

**Follow-ups:**
- MutationObserver?
- process.nextTick in Node?

**Red flags:**
- Starving macrotasks with infinite Promise.resolve loop

---

## Q3. [RU] Что такое async/await под капотом?

**Answer (EN):**
async functions return Promises; await suspends function and resumes as microtask when Promise settles. Errors become rejections. Syntactic sugar over generators + Promise in older transpilation.

**Follow-ups:**
- Top-level await in modules?
- await in for-loop performance?

**Red flags:**
- await in loop without discussing parallelism

---

## Q4. [RU] Как обработать unhandled promise rejection?

**Answer (EN):**
Add window unhandledrejection / process unhandledRejection handlers; always catch at boundaries or use Result pattern. In apps, log to monitoring and avoid silent failures.

**Follow-ups:**
- finally vs catch?
- Promise.all vs allSettled?

**Red flags:**
- Floating promises in React useEffect

---

## Q5. [RU] Promise.all vs Promise.allSettled — когда что?

**Answer (EN):**
all fails fast on first rejection; allSettled waits for all and returns status per input. Use allSettled for independent tasks where partial success matters (batch APIs).

**Follow-ups:**
- Promise.race pitfalls?
- AbortSignal?

**Red flags:**
- all when you need partial results without handling errors

---

## Q6. [RU] Как отменить async операцию (AbortController)?

**Answer (EN):**
Pass signal to fetch and check aborted in loops. Combine with Promise.race or throw AbortError. React Query and modern APIs standardize on AbortSignal.

**Follow-ups:**
- Cleanup in useEffect?
- Cancel tokens in axios legacy?

**Red flags:**
- No cancellation strategy for long polling

---

