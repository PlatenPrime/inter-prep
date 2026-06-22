# Browser Event Loop Fundamentals — Interview Q&A

---

## Q1. [RU] Что такое event loop и зачем он нужен в однопоточном JavaScript?

**Answer (EN):**
The event loop is the runtime mechanism (browser or Node, not V8 itself) that schedules work when the call stack is empty. JavaScript runs one call frame at a time; async callbacks are queued and fed back onto the stack so I/O, timers, and promises can interleave without threads in user code.

**Follow-ups:**
- Where does rendering fit?
- What blocks the loop?

**Red flags:**
- Says JavaScript is multithreaded by default
- Confuses event loop with call stack

---

## Q2. [RU] Назови компоненты модели выполнения в браузере.

**Answer (EN):**
Call stack (LIFO execution), heap (objects), Web APIs (timers, fetch, DOM), microtask queue, macrotask/task queue, and the event loop orchestrator. Optional: render steps between tasks.

**Follow-ups:**
- Is fetch a microtask or macrotask?
- Where do DOM events go?

**Red flags:**
- Lists only stack and heap

---

## Q3. [RU] Опиши алгоритм event loop в браузере по шагам.

**Answer (EN):**
Run synchronous code until call stack empty. Drain entire microtask queue (including microtasks scheduled while draining). Take one macrotask, run it. Drain microtasks again. Browser may render between macrotasks. Repeat.

**Follow-ups:**
- What runs before paint?
- Can microtasks starve macrotasks?

**Red flags:**
- Runs one microtask per macrotask only
- Skips microtask drain after macrotask

---

## Q4. [RU] Чем call stack отличается от очереди задач?

**Answer (EN):**
Call stack holds currently executing synchronous frames (functions calling functions). Task queues hold callbacks waiting for a future turn. Event loop moves queued callbacks onto the stack when stack is empty.

**Follow-ups:**
- Stack overflow example?
- Max call stack size?

**Red flags:**
- Uses queue and stack interchangeably

---

## Q5. [RU] Когда браузер выполняет rendering относительно задач?

**Answer (EN):**
After macrotasks and associated microtasks, before next macrotask, if render is needed. requestAnimationFrame callbacks run before paint, typically after microtasks of that frame.

**Follow-ups:**
- layout thrashing connection?
- requestIdleCallback?

**Red flags:**
- Says render runs inside every microtask

---
