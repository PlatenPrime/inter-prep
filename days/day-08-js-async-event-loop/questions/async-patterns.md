# Async Patterns — Interview Q&A

---

## Q1. [RU] Как реализовать retry с exponential backoff?

**Answer (EN):**
Loop attempts, catch error, wait delay * 2**attempt with jitter, retry until max. Respect idempotency for POST unless designed safe. Mention circuit breaker for downstream failures.

**Follow-ups:**
- Retry only 5xx?
- Idempotency keys?

**Red flags:**
- Retrying POST on 400 errors

---

## Q2. [RU] Что такое mapLimit / pool concurrency?

**Answer (EN):**
Process N async jobs at a time instead of unbounded Promise.all — protects DB and memory. Worker pool pattern with shared index counter or async queue library.

**Follow-ups:**
- p-limit library?
- Bottleneck in Node?

**Red flags:**
- Unbounded parallel fetch to same API

---

## Q3. [RU] Callback hell vs Promises vs async/await — trade-offs?

**Answer (EN):**
Callbacks nest and error-first pattern is verbose; Promises chain; async/await reads sync but can hide parallelism. Interview: still know Promise API for combinators.

**Follow-ups:**
- async errors stack traces?
- Bluebird history?

**Red flags:**
- Mixing callbacks and promises without promisify

---

## Q4. [RU] Как сериализовать async задачи (sequence)?

**Answer (EN):**
Reduce with Promise chain or for-await. Needed when order matters or resource is single-threaded. Contrast with mapLimit when parallel OK up to limit.

**Follow-ups:**
- Queue libraries?
- RxJS concatMap?

**Red flags:**
- Parallel when DB transactions require serial

---

## Q5. [RU] debounce vs throttle в контексте async UI?

**Answer (EN):**
Debounce waits for pause before firing (search input); throttle caps rate (scroll). Both interact with timers (macrotasks). Mention leading vs trailing edge.

**Follow-ups:**
- requestAnimationFrame throttle?
- React 18 batching?

**Red flags:**
- Debounce on every keystroke without cleanup on unmount

---

## Q6. [RU] Как тестировать async код в Node?

**Answer (EN):**
Use async tests, fake timers for setTimeout, mock fetch. assert.rejects for failures. In Vitest, vi.useFakeTimers and flush promises.

**Follow-ups:**
- Sinon timers?
- Testing retry backoff?

**Red flags:**
- No await on assertion causing false positives

---

