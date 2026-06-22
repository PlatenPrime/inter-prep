# async/await Internals — Interview Q&A

---

## Q1. [RU] Что async/await делает под капотом?

**Answer (EN):**
async functions always return a Promise. await suspends the async function, schedules continuation as microtask when operand settles. Errors become rejections. Historically desugared to generators + Promise.

**Follow-ups:**
- Top-level await in modules?
- await in loop parallelism?

**Red flags:**
- Says await blocks the thread
- Ignores returned Promise

---

## Q2. [RU] В каком порядке выполняются await в цикле for?

**Answer (EN):**
Sequential: each await waits for previous iteration to settle before next begins. Each resume is a microtask turn. Use Promise.all for parallel awaits.

**Follow-ups:**
- for await...of vs for + await?
- Performance impact?

**Red flags:**
- Assumes parallel by default

---

## Q3. [RU] Когда срабатывает catch в async функции?

**Answer (EN):**
Rejected awaited promise or thrown sync error inside async function becomes rejection of returned Promise; catch on that Promise or try/catch inside async body handles it on microtask turn.

**Follow-ups:**
- try/catch vs .catch?
- finally ordering?

**Red flags:**
- Expects sync catch for await rejection without try

---

## Q4. [RU] Чем отличается await null от await Promise.resolve()?

**Answer (EN):**
Both yield one microtask turn; await wraps value in Promise.resolve. await null still suspends and resumes asynchronously after sync code in caller completes.

**Follow-ups:**
- await undefined?
- Microtask count?

**Red flags:**
- Says await null is sync

---

## Q5. [RU] Как async/await влияет на порядок console.log в интервью-задачах?

**Answer (EN):**
Code before first await runs synchronously when async fn is invoked. Code after await runs as microtask. Caller continues sync until its stack clears, then microtasks interleave.

**Follow-ups:**
- Two async functions interleaving?
- async IIFE?

**Red flags:**
- Treats entire async function as sync

---
